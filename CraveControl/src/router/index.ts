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
    // Skip guard for auth callback page, handles auth internally
    if (to.path === '/auth-callback') {
      next();
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const publicPages = ['/', '/login', '/signup'];
    const isPublicPage = publicPages.includes(to.path);
    const isCompleteProfilePage = to.path === '/complete-profile';

    // Not logged in
    if (!session) {
      // Allow access to public pages and complete-profile
      if (isPublicPage || isCompleteProfilePage) {
        next();
      } else {
        // Redirect to login for protected pages
        next('/login');
      }
      return;
    }

    // After login, check if profile has age group
    const { data: profile } = await supabase
      .from('account')
      .select('age_group')
      .eq('user_id', session.user.id)
      .maybeSingle();

    const hasAgeGroup = profile?.age_group;

    // If no age group, ensure its entered
    if (!hasAgeGroup && !isCompleteProfilePage) {
      next('/complete-profile');
      return;
    }

    // If has age group and trying to access other pages
    if (hasAgeGroup && (isPublicPage || isCompleteProfilePage)) {
      next('/dashboard');
      return;
    }

    // Allow navigation
    next();
  });

  return Router;
});
