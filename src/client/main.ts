import '@/client/style.css';
import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import App from '@/client/App.vue';
import router from '@/client/router'

const app = createApp(App);
app.use(VueQueryPlugin,{
  queryClientConfig: {
    defaultOptions: {
      queries: {
        retry: false,      
        // staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  },
});

app.use(router);

app.mount('#app');
