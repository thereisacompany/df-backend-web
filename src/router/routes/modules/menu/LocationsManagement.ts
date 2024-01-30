import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

const LocationsManagement: AppRouteModule = {
  path: '/backend',
  name: 'LocationsManagement',
  component: LAYOUT,
  redirect: '/backend/locationsManagement',
  meta: {
    orderNo: 4,
    // hideChildrenInMenu: true,
    icon: 'ant-design:home-filled',
    title: t('routes.menu.LocationsManagement.LocationsManagement'),
  },
  children: [
    {
      path: 'businessCategory',
      name: 'BusinessCategory',
      component: () => import('/@/views/locationsManagement/businessCategory/index.vue'),
      meta: {
        title: t('routes.menu.LocationsManagement.businessCategory'),
      },
    },
    {
      path: 'regionsCategory',
      name: 'RegionsCategory',
      component: () => import('/@/views/locationsManagement/regionsCategory/index.vue'),
      meta: {
        title: t('routes.menu.LocationsManagement.regionsCategory'),
      },
    },
    {
      path: 'locationsList',
      name: 'LocationsList',
      component: () => import('/@/views/locationsManagement/locationsList/Home/index.vue'),
      meta: {
        title: t('routes.menu.LocationsManagement.locationsList'),
      },
    },
    {
      path: 'locationsDetail/:id',
      name: 'LocationsDetail',
      component: () => import('/@/views/locationsManagement/locationsList/Detail/index.vue'),
      meta: {
        title: '文章內容',
        hideMenu: true,
        ignoreKeepAlive: false, //開啟緩存
        currentActiveMenu: '/backend/locationsList',
      },
    },

    // {
    //   path: 'locations',
    //   name: 'Locations',
    //   meta: {
    //     title: t('routes.menu.Locations'),
    //   },
    //   component: () => import('/@/views/locationsManagement/index.vue'),
    // },
  ],
};

export default LocationsManagement;
