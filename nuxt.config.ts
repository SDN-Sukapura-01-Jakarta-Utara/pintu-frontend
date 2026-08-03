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
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('chart.js')) return 'vendor-chart';
              if (id.includes('@vueuse')) return 'vendor-vueuse';
              if (id.includes('pinia')) return 'vendor-pinia';
              return 'vendor';
            }
          },
        },
      },
      chunkSizeWarningLimit: 1000,
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