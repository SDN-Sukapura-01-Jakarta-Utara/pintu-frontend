/**
 * Router Plugin
 * Handle authentication checks dan navigation guards
 */

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()

  router.beforeEach(async (to, from) => {
    // Get auth store
    const { useAuthStore } = await import('~/stores/AuthStore')
    const authStore = useAuthStore()
    
    // Initialize auth dari localStorage
    authStore.initializeAuth()

    const isAuthenticated = authStore.isAuthenticated
    const isLoginPage = to.path === '/backoffice/login'
    const isProtectedRoute = to.path.startsWith('/backoffice') && !isLoginPage

    // Jika mencoba akses protected route tanpa auth, redirect ke login
    if (isProtectedRoute && !isAuthenticated) {
      return '/backoffice/login'
    }

    // Jika sudah auth dan mencoba akses login, redirect ke dashboard
    if (isLoginPage && isAuthenticated) {
      return '/backoffice'
    }
  })
})
