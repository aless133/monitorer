import { createWebHashHistory, createRouter } from 'vue-router';

import HomeView from '@/client/views/HomeView.vue';
import TargetCreateView from '@/client/views/TargetCreateView.vue';
import TargetUpdateView from '@/client/views/TargetUpdateView.vue';
import TargetViewView from '@/client/views/TargetViewView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/target/create', name: 'target-create', component: TargetCreateView },
  { path: '/target/update/:id', name: 'target-update', component: TargetUpdateView },
  { path: '/target/view/:id', name: 'target-view', component: TargetViewView },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
