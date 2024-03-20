// src/router/router.ts

import { createRouter, createWebHistory } from 'vue-router';
import NewsSearch from '../components/NewsSearch.vue';
import ArticleDetail from '../components/ArticleDetail.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: NewsSearch },
    {
      path: '/article/:articleData',
      name: 'ArticleDetail',
      component: ArticleDetail,
      props: (route) => ({
        article: JSON.parse(decodeURIComponent(route.params.articleData as string))
      })
    }    
  ]
});

export default router;
