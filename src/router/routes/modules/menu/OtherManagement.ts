import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const OtherManagement: AppRouteModule = {
  path: '/backend',
  name: 'OtherManagement',
  component: LAYOUT,
  redirect: '/backend/otherManagement',
  meta: {
    orderNo: 6,
    icon: 'material-symbols:article',
    title: t('routes.menu.OtherManagement.OtherManagement'),
  },
  children: [
    {
      path: 'otherSting',
      name: 'OtherSeting',
      component: () => import('/@/views/otherManagement/otherSeting/index.vue'),
      meta: {
        title: t('routes.menu.OtherManagement.otherSeting'),
      },
    },
  ],
};

export default OtherManagement;
