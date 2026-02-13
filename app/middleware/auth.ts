export default defineNuxtRouteMiddleware((to, from) => {
  // This middleware is only applied in client-side
  if (process.client) {
    const token = localStorage.getItem('auth_token')
    const user = localStorage.getItem('auth_user')

    // If user tries to access protected routes without being authenticated
    if (!token || !user) {
      // Allow access to login and home
      if (to.path === '/backoffice/login' || to.path === '/') {
        return
      }
      // Redirect to login
      return navigateTo('/backoffice/login')
    }

    // If authenticated but tries to access login, redirect to dashboard
    if (to.path === '/backoffice/login') {
      return navigateTo('/backoffice')
    }
  }
})
