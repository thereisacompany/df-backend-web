import type { AppRouteRecordRaw, Menu } from '/@/router/types';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { useUserStore } from './user';
import { toRaw } from 'vue';
import { flatMultiLevelRoutes } from '/@/router/helper/routeHelper';
import { transformRouteToMenu } from '/@/router/helper/menuHelper';

import { PermissionModeEnum } from '/@/enums/appEnum';

import { asyncRoutes } from '/@/router/routes';
import { ERROR_LOG_ROUTE } from '/@/router/routes/basic';

import { filter } from '/@/utils/helper/treeHelper';
import { PageEnum } from '/@/enums/pageEnum';

//設定白名單IP權限
import XEUtils from 'xe-utils';
//import axios from 'axios';

interface PermissionState {
  // Permission code list
  permCodeList: string[] | number[];
  // Whether the route has been dynamically added
  isDynamicAddedRoute: boolean;
  // To trigger a menu update
  lastBuildMenuTime: number;
  // Backstage menu list
  backMenuList: Menu[];
  frontMenuList: Menu[];
  buttonList: any;
}

export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => ({
    permCodeList: [],
    // Whether the route has been dynamically added
    isDynamicAddedRoute: false,
    // To trigger a menu update
    lastBuildMenuTime: 0,
    // Backstage menu list
    backMenuList: [],
    // menu List
    frontMenuList: [],
    // button List
    buttonList: [],
  }),
  getters: {
    getPermCodeList(): string[] | number[] {
      return this.permCodeList;
    },
    getBackMenuList(): Menu[] {
      return this.backMenuList;
    },
    getFrontMenuList(): Menu[] {
      return this.frontMenuList;
    },
    getLastBuildMenuTime(): number {
      return this.lastBuildMenuTime;
    },
    getIsDynamicAddedRoute(): boolean {
      return this.isDynamicAddedRoute;
    },
    getButtonList(): string {
      return this.buttonList;
    },
  },
  actions: {
    setPermCodeList(codeList: string[]) {
      this.permCodeList = codeList;
    },

    setBackMenuList(list: Menu[]) {
      this.backMenuList = list;
      list?.length > 0 && this.setLastBuildMenuTime();
    },

    setFrontMenuList(list: Menu[]) {
      this.frontMenuList = list;
    },

    setLastBuildMenuTime() {
      this.lastBuildMenuTime = new Date().getTime();
    },

    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added;
    },
    resetState(): void {
      this.isDynamicAddedRoute = false;
      this.permCodeList = [];
      this.backMenuList = [];
      this.lastBuildMenuTime = 0;
    },
    async changePermissionCode() {
      const userStore = useUserStore();
      const codeList = toRaw(userStore.getRoleList) || [];

      this.setPermCodeList(codeList);
    },
    //處理菜單權限
    async buildRoutesAction(): Promise<AppRouteRecordRaw[]> {
      const userStore = useUserStore();
      const roleList = toRaw(userStore.getRoleList) || [];
      let routes: AppRouteRecordRaw[] = [];

      //設定權限
      const permissionMode: any = await this.verify();

      const routeFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route;
        const { roles } = meta || {};
        if (!roles) return true;
        return roleList.some((role) => roles.includes(role));
      };

      const routeRemoveIgnoreFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route;
        const { ignoreRoute } = meta || {};
        return !ignoreRoute;
      };

      /**
       * @description 根据设置的首页path，修正routes中的affix标记（固定首页）
       * */
      const patchHomeAffix = (routes: AppRouteRecordRaw[]) => {
        if (!routes || routes.length === 0) return;
        let homePath: any = permissionMode != 'NO_VERIFY' ? PageEnum.BASE_HOME : PageEnum.NO_VERIFY;
        function patcher(routes: AppRouteRecordRaw[], parentPath = '') {
          if (parentPath) parentPath = parentPath + '/';
          routes.forEach((route: AppRouteRecordRaw) => {
            const { path, children, redirect } = route;
            const currentPath = path.startsWith('/') ? path : parentPath + path;
            if (currentPath === homePath) {
              if (redirect) {
                homePath = route.redirect! as string;
              } else {
                route.meta = Object.assign({}, route.meta, { affix: true });
                throw new Error('end');
              }
            }
            children && children.length > 0 && patcher(children, currentPath);
          });
        }
        try {
          patcher(routes);
        } catch (e) {
          // 已处理完毕跳出循环
        }
        return;
      };

      userStore.setRoleIP(permissionMode);

      if (permissionMode != PermissionModeEnum.NO_VERIFY) {
        let routeList: any = [];
        if (permissionMode === PermissionModeEnum.ROUTE_MAPPING) {
          //主管權限
          routeList = XEUtils.filter(asyncRoutes, (item: any) => item.name != 'NoVerify');
        } else if (permissionMode === PermissionModeEnum.ROLE) {
          //員工權限
          routeList = XEUtils.filter(
            asyncRoutes,
            (item: any) =>
              item.name != 'NoVerify' &&
              item.name != 'EmployeeManagement' &&
              item.name != 'WhiteList' &&
              item.name != 'MemberManagement',
          );
        }
        console.log('權限菜單:', { permissionMode, routeList });

        //routes
        routes = filter(routeList, routeFilter);
        routes = routes.filter(routeFilter);
        routes = filter(routes, routeRemoveIgnoreFilter);
        routes = routes.filter(routeRemoveIgnoreFilter);

        //menu
        let menuList = transformRouteToMenu(routes, true);
        menuList = XEUtils.filter(menuList, (item: any) => item.role != 'NO_VERIFY');
        menuList.sort((a, b) => {
          return (a.meta?.orderNo || 0) - (b.meta?.orderNo || 0);
        });

        this.changePermissionCode();
        this.setFrontMenuList(menuList);
        routes = flatMultiLevelRoutes(routes);
      } else {
        //白名單IP權限(沒有權限=>跳頁至無權限頁面)
        const verifyMenus = XEUtils.filter(asyncRoutes, (item: any) => item.name == 'NoVerify');
        routes = filter(verifyMenus, routeFilter);
      }

      routes.push(ERROR_LOG_ROUTE);
      patchHomeAffix(routes);
      return routes;
    },
    //設定權限
    async verify() {
      const userStore = useUserStore();

      //ROUTE_MAPPING=管理者, ROLE=使用者, NO_VERIFY=無權限
      //let trueRole = PermissionModeEnum.NO_VERIFY;
      let trueRole = PermissionModeEnum.ROLE;
      // let trueRole = PermissionModeEnum.NO_VERIFY;

      // //處理白名單權限
      // const whiteIPs = [{ ip: '61.216.105.50' }];
      // const response = await axios.get('https://api.ipify.org?format=json');
      // let myIP = response.data.ip;
      // if (myIP) {
      //   const array = myIP.split('.');
      //   array.pop();
      //   myIP = array.join('.');
      // }

      // //驗證IP
      // const conform = XEUtils.filter(whiteIPs, (item) => item.ip.indexOf(myIP) > -1);
      // if (conform.length > 0) {
      //   trueRole = PermissionModeEnum.ROUTE_MAPPING;
      // }

      //處理帳號權限
      const realName = userStore.getUserInfo.realName;
      if (realName && realName === 'RD_Admin') {
        trueRole = PermissionModeEnum.ROUTE_MAPPING;
      }

      // console.log('IP位置:', myIP, response.data.ip);
      console.log('trueRole角色:', trueRole);
      console.log('使用者資訊:', userStore.getUserInfo);
      return trueRole;
    },
  },
});

// Need to be used outside the setup
export function usePermissionStoreWithOut() {
  return usePermissionStore(store);
}
