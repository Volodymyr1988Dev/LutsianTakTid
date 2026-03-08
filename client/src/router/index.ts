import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProjectList from '../views/projectList.vue'
import ProjectImages from '../views/ProjectImages.vue'
import { useAuthStore } from '../stores/auth.store'

export const router = createRouter({

  history: createWebHistory(),

  routes: [
    {
      path: '/login',
      component: LoginView,
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      component: RegisterView,
      meta: { guestOnly: true },
    },
    {
      path: '/',
      component: ProjectList,
      meta: { requiresAuth: true },
    },
    {
      path: '/projects',
      component: ProjectList,
      meta: { requiresAuth: true },
    },

    {
      path: '/projects/:id',
      component: ProjectImages,
      meta: { requiresAuth: true }
    }

  ]

})

router.beforeEach(async (to) => {

  const auth = useAuthStore()

  if (!auth.isInitialized) {
    await auth.initAuth()
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return '/login'
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return '/'
  }

  return true
})