import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'signup', component: () => import('pages/SignupPage.vue') },
      { path: 'reset-password', component: () => import('pages/ResetPasswordPage.vue') },
      { path: 'auth-callback', component: () => import('pages/AuthCallbackPage.vue') },
      { path: 'complete-profile', component: () => import('pages/CompleteProfilePage.vue') },
      { path: 'dashboard', component: () => import('pages/DashboardPage.vue') },
      { path: 'savings', component: () => import('pages/SavingsPage.vue') },
      { path: 'log-craving', component: () => import('pages/CravingTrackingPage.vue') },
      { path: 'information', component: () => import('pages/InformationPage.vue') },
      {
        path: 'product-selection',
        component: () => import('pages/NicotineProductSelectionPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
