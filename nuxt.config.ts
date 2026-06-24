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
  },
  runtimeConfig: {
    public: {
      apiBase: '',
    },
  },
  modules: ['@pinia/nuxt', '@nuxtjs/sitemap'],
  site: {
    url: 'https://sdn-sukapura01.sch.id',
  },
  sitemap: {
    strictNuxtContentPaths: true,
    urls: [
      '/',
      '/profil-sekolah',
      '/media-publikasi/artikel',
      '/media-publikasi/pengumuman',
      '/media-publikasi/galeri-kegiatan',
      '/media-publikasi/prestasi-siswa',
      '/layanan-umpan-balik/pertanyaan',
      '/layanan-umpan-balik/pengaduan',
    ],
    exclude: [
      '/**', // Exclude semua route
    ],
  },
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
      routes: ['/sitemap.xml'],
    },
  },
});