import { createWebHashHistory, createRouter } from 'vue-router';

import HomeView from '@/client/views/HomeView.vue';
import TargetNewView from '@/client/views/TargetNewView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/target-new', name: 'target-new', component: TargetNewView },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
