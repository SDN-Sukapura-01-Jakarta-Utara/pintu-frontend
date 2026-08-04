import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],
  pages: true,
  layouts: true,
  components: true,
  vite: {
    plugins: [
      tailwindcss(),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined, // Disable manual chunks untuk menghindari circular dependency
        },
      },
      chunkSizeWarningLimit: 1000,
      minify: 'terser', // Gunakan terser untuk minifikasi yang lebih stabil
      terserOptions: {
        compress: {
          drop_console: process.env.NODE_ENV === 'production',
        },
      },
    },
  },
  runtimeConfig: {
    public: {
      apiBase: '',
    },
  },
  modules: ['@pinia/nuxt'],
  ssr: false,
  app: {
    head: {
      meta: [
        /**
         * Referrer-Policy: Control referrer information
         * NOTE: frame-ancestors & X-Frame-Options must be set via HTTP headers, not meta tags
         */
        {
          name: 'referrer',
          content: 'strict-origin-when-cross-origin',
        },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css',
        },
      ],
    },
  },
  /**
   * Configure fetch to support httpOnly cookies
   */
  nitro: {
    prerender: {
      crawlLinks: false,
    },
  },
});