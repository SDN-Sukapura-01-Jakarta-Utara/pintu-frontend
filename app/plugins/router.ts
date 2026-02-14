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
    const isPublicRoute = to.path === '/' || isLoginPage

    // Debug log
    // console.log('Router guard:', { to: to.path, isAuthenticated, isProtectedRoute })

    // Jika mencoba akses protected route tanpa auth, redirect ke login
    if (isProtectedRoute && !isAuthenticated) {
      return '/backoffice/login'
    }

    // Jika sudah auth dan mencoba akses login, redirect ke dashboard
    if (isLoginPage && isAuthenticated) {
      return '/backoffice'
    }

    // Allow public routes without auth
    if (isPublicRoute && !isAuthenticated) {
      return true
    }
  })
})
