import { createRouter, createWebHistory } from 'vue-router';
import { getRouterName } from '../utils/index.js';

const files = import.meta.globEager('../views/**/*.vue');

const targetRoute = [];

for (const key in files) {
  const routerItem = {};
  routerItem.meta = {
    title: files[key].default.name
  };
  const name = getRouterName(key);
  routerItem.name = name;
  routerItem.path = `/${name}`;
  routerItem.component = files[key].default;
  targetRoute.push(routerItem);
}


export const routes = [
  {
    path: '/',
    name: 'Base',
    redirect: '/BoxTest',
    component: () => import('../layout/index.vue'),
    children: [...targetRoute]
  }
];


export const router = createRouter({
  history: createWebHistory(),
  routes
});

 
