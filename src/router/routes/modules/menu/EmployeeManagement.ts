import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

const backendHome: AppRouteModule = {
  path: '/backend',
  name: 'EmployeeManagement',
  component: LAYOUT,
  redirect: '/backend/employeeManagement',
  meta: {
    orderNo: 6,
    hideChildrenInMenu: true,
    icon: 'icon-park-outline:file-staff',
    title: t('routes.menu.EmployeeManagement'),
    hideMenu: true,
  },
  children: [
    {
      path: 'employeeManagement',
      name: 'EmployeeManagement',
      meta: {
        title: t('routes.menu.EmployeeManagement'),
        hideMenu: true,
      },
      component: () => import('/@/views/employeeManagement/index.vue'),
    },
  ],
};

export default backendHome;
