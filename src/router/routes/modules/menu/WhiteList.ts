import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

// TODO: 暫時隱藏菜單 hideMenu: true,
const backendNews: AppRouteModule = {
  path: '/backend',
  name: 'WhiteList',
  component: LAYOUT,
  redirect: '/backend/whiteList',
  meta: {
    orderNo: 7,
    hideChildrenInMenu: true,
    icon: 'material-symbols:featured-play-list-outline-rounded',
    title: t('routes.menu.WhiteList'),
    hideMenu: true,
  },
  children: [
    {
      path: 'whiteList',
      name: 'WhiteList',
      meta: {
        title: t('routes.menu.WhiteList'),
        hideMenu: true,
      },
      component: () => import('/@/views/whiteList/index.vue'),
    },
  ],
};

export default backendNews;
