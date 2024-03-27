import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

const backendFeedback: AppRouteModule = {
  path: '/backend',
  name: 'Feedback',
  component: LAYOUT,
  redirect: '/backend/feedback',
  meta: {
    orderNo: 5,
    hideChildrenInMenu: true,
    icon: 'fluent-mdl2:questionnaire',
    title: t('routes.menu.Feedback'),
  },
  children: [
    {
      path: 'feedback',
      name: 'Feedback',
      meta: {
        title: t('routes.menu.Feedback'),
      },
      component: () => import('/@/views/feedback/index.vue'),
    },
  ],
};

export default backendFeedback;
