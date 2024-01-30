import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
// TODO: 暫時隱藏菜單
const backendPersonal: AppRouteModule = {
  path: '/backend',
  name: 'Personal',
  component: LAYOUT,
  redirect: '/backend/personal',
  meta: {
    orderNo: 99,
    hideChildrenInMenu: true,
    icon: 'ant-design:setting-outlined',
    title: t('routes.menu.Personal'),
    hideMenu: true,
  },
  children: [
    {
      path: 'personal',
      name: 'Personal',
      meta: {
        title: t('routes.menu.Personal'),
        hideMenu: true,
      },
      component: () => import('/@/views/system/personal/index.vue'),
    },
  ],
};

export default backendPersonal;
