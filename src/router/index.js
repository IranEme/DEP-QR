import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/HomeView.vue'
import AddItemView from '../views/AddItemView.vue'
import ItemDetailView from '../views/ItemDetailView.vue'
import ScanView from '../views/ScanView.vue'
import EditItemView from '../views/EditItemView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ForgotPasswordView from '../views/ForgotPasswordView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/add',
      name: 'add',
      component: AddItemView,
      // Esta ruta ahora requiere que el usuario sea admin
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/item/:id',
      name: 'item-detail',
      component: ItemDetailView,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/scan',
      name: 'scan',
      component: ScanView,
      meta: { requiresAuth: true }
    },
    {
      path: '/edit/:id',
      name: 'edit-item',
      component: EditItemView,
      props: true,
      // Esta ruta también requiere que el usuario sea admin
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordView
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Si no hemos verificado al usuario en esta sesión, lo hacemos ahora
  if (authStore.user === null) {
    await authStore.getSession()
  }

  const isAuthenticated = authStore.user !== null
  const isAdmin = isAuthenticated && authStore.user.role === 'admin'

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)

  // Si la ruta requiere autenticación y el usuario no está logueado
  if (requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  // Si la ruta requiere ser admin y el usuario no lo es
  } else if (requiresAdmin && !isAdmin) {
    // Redirigimos al home (o a una página de 'No autorizado')
    next({ name: 'home' })
  // Si el usuario está logueado e intenta ir a login/register
  } else if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
    next({ name: 'home' })
  } else {
    // En cualquier otro caso, permitimos el acceso
    next()
  }
})

export default router
