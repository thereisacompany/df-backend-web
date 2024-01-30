import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

const backendCustomerService: AppRouteModule = {
  path: '/backend',
  name: 'CustomerService',
  component: LAYOUT,
  redirect: '/backend/customerService',
  meta: {
    orderNo: 1,
    hideChildrenInMenu: true,
    icon: 'ri:customer-service-fill',
    // title: t('routes.menu.CustomerService'),
    title: t('routes.menu.Workbench'),
  },
  children: [
    {
      path: 'customerService',
      name: 'CustomerService',
      meta: {
        //   title: t('routes.menu.CustomerService'),
        title: t('routes.menu.Workbench'),
      },
      // component: () => import('/@/views/customerService/index.vue'),
      component: () => import('/@/views/workbench/index.vue'),
    },
  ],
};

export default backendCustomerService;
