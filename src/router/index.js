import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../boot/supabase'

const routes = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      { 
        path: '', 
        name: 'Home',
        component: () => import('../pages/IndexPage.vue'),
        meta: { requiresAuth: true }
      },
      { 
        path: 'products', 
        name: 'Products',
        component: () => import('../pages/ProductsPage.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/LoginPage.vue')
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/ErrorNotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for authentication
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  if (requiresAuth) {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
