import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const ArticleManagement: AppRouteModule = {
  path: '/backend',
  name: 'ArticleManagement',
  component: LAYOUT,
  redirect: '/backend/articleManagement',
  meta: {
    orderNo: 2,
    icon: 'material-symbols:article',
    title: t('routes.menu.News'),
  },

  children: [
    {
      path: 'articleCategory',
      name: 'ArticleCategory',
      component: () => import('/@/views/articleManagement/articleCategory/index.vue'),
      meta: {
        title: t('routes.menu.ArticleManagement.articleCategory'),
      },
    },
    {
      path: 'articleList',
      name: 'ArticleList',
      component: () => import('/@/views/articleManagement/articleList/Home/index.vue'),
      meta: {
        title: t('routes.menu.ArticleManagement.articleList'),
      },
    },
    {
      path: 'articleDetail/:id',
      name: 'ArticleDetail',
      component: () => import('/@/views/articleManagement/articleList/Detail/index.vue'),
      meta: {
        title: '文章內容',
        hideMenu: true,
        ignoreKeepAlive: false, //開啟緩存
        currentActiveMenu: '/backend/articleList',
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

export default ArticleManagement;
