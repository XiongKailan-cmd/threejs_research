import { createRouter, createWebHistory } from 'vue-router';

export const routes = [
  {
    path: '/',
    name: 'Base',
    redirect: '/box',
    component: () => import('../layout/index.vue'),
    children: [
      {
        path: '/box',
        name: 'Box',
        component: () => import('../views/BoxTest/index.vue'),
        meta: {
          title: '绘制矩形'
        }
      }
    ]
  }
];


export const router = createRouter({
  history: createWebHistory(),
  routes
});

 
