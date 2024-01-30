import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { PermissionModeEnum } from '/@/enums/appEnum';

const backendNoVerify: AppRouteModule = {
  path: '/backend',
  name: 'NoVerify',
  component: LAYOUT,
  redirect: '/backend/noVerify',
  meta: {
    orderNo: 99,
    hideChildrenInMenu: true,
    icon: 'mdi:message-badge-outline',
    title: '無法訪問',
    role: PermissionModeEnum.NO_VERIFY,
  },
  children: [
    {
      path: 'noVerify',
      name: 'NoVerify',
      meta: {
        title: '無法訪問',
      },
      component: () => import('/@/views/noVerify/index.vue'),
    },
  ],
};

export default backendNoVerify;
