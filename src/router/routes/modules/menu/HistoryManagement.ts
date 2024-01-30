import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const HistoryManagement: AppRouteModule = {
  path: '/backend',
  name: 'HistoryManagement',
  component: LAYOUT,
  redirect: '/backend/historyManagement',
  meta: {
    orderNo: 3,
    icon: 'material-symbols:bookmark-manager',
    title: t('routes.menu.HistoryManagement.HistoryManagement'),
  },

  children: [
    {
      path: 'historyCategory',
      name: 'HistoryCategory',
      component: () => import('/@/views/historyManagement/historyCategory/index.vue'),
      meta: {
        title: t('routes.menu.HistoryManagement.historyCategory'),
      },
    },
    {
      path: 'historyList',
      name: 'HistoryList',
      component: () => import('/@/views/historyManagement/historyList/Home/index.vue'),
      meta: {
        title: t('routes.menu.HistoryManagement.historyList'),
      },
    },
    {
      path: 'historyDetail/:id',
      name: 'HistoryDetail',
      component: () => import('/@/views/historyManagement/historyList/Detail/index.vue'),
      meta: {
        title: '文章內容',
        hideMenu: true,
        ignoreKeepAlive: false, //開啟緩存
        currentActiveMenu: '/backend/historyList',
      },
    },
    // {
    //   path: 'tagManagement',
    //   name: 'TagManagement',
    //   component: () => import('/@/views/articleManagement/tagManagement/index.vue'),
    //   meta: {
    //     title: t('routes.menu.ArticleManagement.tagManagement'),
    //   },
    // },
  ],
};

export default HistoryManagement;
