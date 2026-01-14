import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { supabase } from 'src/boot/supabase';


export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // Navigation guard to redirect authenticated users from index page
  Router.beforeEach(async (to, from, next) => {
    const { data: { session } } = await supabase.auth.getSession();

    // If user is logged in and trying to access index, login, or signup pages
    if (session && (to.path === '/' || to.path === '/login' || to.path === '/signup')) {
      next('/dashboard');
    } else {
      next();
    }
  });

  return Router;
});
