/**
 * Global Fetch Error Handler Plugin
 * Handle 401 Unauthorized errors and redirect to login
 */

export default defineNuxtPlugin(() => {
  // This will be called on every $fetch error in this plugin
  // We need to set up global error handler using nuxt's mechanism
  
  // Note: We handle 401 errors in individual service calls
  // and in the middleware/auth guard.
  // This ensures proper error propagation and handling.
  
  // For future: If needed, we can create a custom $fetch wrapper
  // that handles errors globally, but for now the service-level
  // error handling is sufficient.
})
