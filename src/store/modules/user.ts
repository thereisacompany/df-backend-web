import type { UserInfo, UserLoginInfo } from '/#/store';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { RoleEnum } from '/@/enums/roleEnum';
import { PageEnum } from '/@/enums/pageEnum';
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY, ROLE_IP } from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { loginApi } from '/@/api/sys/user';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { router } from '/@/router';
import { usePermissionStore } from '/@/store/modules/permission';
import { PermissionModeEnum } from '/@/enums/appEnum';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import { isArray } from '/@/utils/is';
import { h } from 'vue';
import { useAppStore } from '/@/store/modules/app';
import axios from 'axios';

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleList: string[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
  test: any;
  fileUUID: string[];
  authBtnList: any[]; //按鈕權限清單
  roleIP: string; //白名單IP權限
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
    test: null,
    fileUUID: [],

    //按鈕權限清單
    authBtnList: [],

    roleIP: '', //白名單IP權限
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRoleList(): string[] {
      return this.roleList.length > 0 ? this.roleList : getAuthCache<string[]>(ROLES_KEY);
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime;
    },
    getFileUUID(): string[] {
      return this.fileUUID;
    },
    //設定白名單IP權限(取得IP位址)
    async getRoleIP() {
      //取得目前IP位址
      const response = await axios.get('https://api.ipify.org?format=json');
      const myIP = response.data.ip;
      return myIP;
    },
    //設定白名單IP權限(設定跳頁至正確的首頁)
    getHomePage(): any {
      const value = this.roleIP || getAuthCache<string>(ROLE_IP);
      if (value == PermissionModeEnum.NO_VERIFY) {
        return PageEnum.NO_VERIFY;
      } else {
        return PageEnum.BASE_HOME;
      }
    },
  },
  actions: {
    //白名單IP權限
    setRoleIP(value: string) {
      this.roleIP = value;
      setAuthCache(ROLE_IP, value);
    },
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setRoleList(roleList: string[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    async setUserInfo(info: UserInfo | null) {
      if (info) {
        //有https代表是用預設的頭像
        info.avatar = 'none';
      }
      this.userInfo = info;

      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
    //設定按鈕權限清單
    setAuthButtonList(array: any) {
      this.authBtnList = array;
    },
    //核對按鈕權限清單
    checkAuthButton(codeValue: Number) {
      let isAuth = false;
      if (this.userInfo) {
        const userId = parseInt(this.userInfo.userId);
        for (const item of this.authBtnList) {
          if (item.employeeID === userId && item.userButtonId === codeValue) {
            isAuth = true;
            break;
          }
        }
      }
      return isAuth;
    },
    async logout(goLogin = false) {
      const { createMessage } = useMessage();
      const { t } = useI18n();
      if (this.getToken) {
        try {
          //await doLogout();
          createMessage.success(t('sys.login.logoutSuccessTitle'));
        } catch {
          console.log('Failed to logout Token');
        }
      }
      this.setToken(undefined);
      this.setSessionTimeout(false);
      localStorage.clear();
      useAppStore().resetAllState();
      this.resetState();
      location.reload();
      await this.setUserInfo(null);
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },

    //TG Sport Login
    async loginLive(params): Promise<any> {
      const permissionStore = usePermissionStore();
      const { createWarningModal, createErrorModal } = useMessage();
      const { t } = useI18n();
      try {
        //驗證登入
        const res = await loginApi(params);
        if (
          res.result.msgTip == 'user is not exist' ||
          res.result.msgTip == 'user password error'
        ) {
          createErrorModal({
            title: t('sys.api.errorTip'),
            content: t('sys.api.loginError'),
            getContainer: () => document.body || false,
          });
          return;
        }

        if (res.result.msgTip == 'user is black') {
          createErrorModal({
            title: t('sys.api.errorTip'),
            content: h('div', { class: 'mt-5' }, [
              h('p', { class: 'mb-1' }, t('sys.login.accountDeactivated')),
              h('p', {}, t('sys.app.contactAdministrator')),
            ]),
            getContainer: () => document.body,
          });
          return;
        }

        const model: UserLoginInfo = handleUserInfo(res.result);

        // save token
        this.setToken(model.token);

        //登入後執行的項目
        if (!this.getToken) return null;

        const userInfo: any = model;

        const { roles = [] } = userInfo;
        if (isArray(roles)) {
          const roleList = roles.map((item) => item.value) as RoleEnum[];
          this.setRoleList(roleList);
        } else {
          userInfo.roles = [];
          this.setRoleList([]);
        }
        this.setUserInfo(userInfo);

        //設定白名單IP權限(登入)
        const role: any = await permissionStore.verify();
        if (role == 'NO_VERIFY') {
          createWarningModal({
            title: t('component.noVerify.access'),
            content: t('component.noVerify.area'),
            getContainer: () => document.body,
          });
          return role;
        } else {
          //登入路由設定
          const sessionTimeout = this.sessionTimeout;
          if (sessionTimeout) {
            this.setSessionTimeout(false);
          } else {
            const permissionStore = usePermissionStore();
            if (!permissionStore.isDynamicAddedRoute) {
              const routes = await permissionStore.buildRoutesAction();
              routes.forEach((route) => {
                router.addRoute(route as unknown as RouteRecordRaw);
              });
              router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
              permissionStore.setDynamicAddedRoute(true);
            }
            await router.replace(this.getHomePage); //自訂登入頁面
          }
        }
        return userInfo;
      } catch (error) {
        switch (error) {
          case '帳號密碼錯誤':
            createErrorModal({
              title: t('sys.api.errorTip'),
              content: t('sys.api.loginError'),
              getContainer: () => document.body,
            });
            break;
          case '帳號停用':
            createErrorModal({
              title: t('sys.api.errorTip'),
              content: h('div', { class: 'mt-5' }, [
                h('p', { class: 'mb-1' }, t('sys.login.accountDeactivated')),
                h('p', {}, t('sys.app.contactAdministrator')),
              ]),
              getContainer: () => document.body,
            });
            break;
        }
      }
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}

function handleUserInfo(res) {
  const { token, msgTip, user } = res;
  const model: UserLoginInfo = {
    id: user.id,
    username: user.username,
    password: '',
    alias: user.alias,
    status: user.status,
    userType: user.userType,
    level: user.level,
    country: user.country,
    birthday: user.birthday,
    avatar: user.avatar,
    currency: user.currency,
    balance: user.balance,
    registerAt: user.registerAt,
    registerIp: user.registerIp,
    userSig: user.userSig,
    msgTip: msgTip,
    token: token,
    realName: user.alias,
  };
  return model;
}
