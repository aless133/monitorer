import { createWebHashHistory, createRouter } from 'vue-router';

import HomeView from '@/client/views/HomeView.vue';
import TargetCreateView from '@/client/views/TargetCreateView.vue';
import TargetUpdateView from '@/client/views/TargetUpdateView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/target-create', name: 'target-create', component: TargetCreateView },
  { path: '/target/:id', name: 'target-update', component: TargetUpdateView },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
