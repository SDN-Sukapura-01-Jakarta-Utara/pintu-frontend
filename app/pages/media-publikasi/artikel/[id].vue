<template>
  <div class="font-poppins bg-white overflow-x-hidden">
    <!-- Navbar -->
    <PublicNavbar />

    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <i class="fas fa-spinner fa-spin text-5xl text-red-600 mb-4"></i>
        <p class="text-gray-600 text-lg">Memuat artikel...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center px-6">
        <i class="fas fa-exclamation-circle text-5xl text-red-600 mb-4"></i>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Artikel Tidak Ditemukan</h2>
        <p class="text-gray-600 mb-6">Artikel yang Anda cari tidak tersedia.</p>
        <button 
          @click="$router.push('/media-publikasi/artikel')"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <i class="fas fa-arrow-left"></i>
          <span>Kembali ke Daftar Artikel</span>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="artikel" class="bg-gray-50 py-8 sm:py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 text-gray-500 text-xs sm:text-sm mb-6">
          <a href="/" class="hover:text-red-600 transition-colors">
            <i class="fas fa-home"></i> Beranda
          </a>
          <i class="fas fa-chevron-right text-[10px]"></i>
          <a href="/media-publikasi/artikel" class="hover:text-red-600 transition-colors">
            Artikel
          </a>
          <i class="fas fa-chevron-right text-[10px]"></i>
          <span class="text-gray-700">Detail</span>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Article Content (Left Side) -->
          <div class="lg:col-span-2">
            <!-- Article Card -->
            <article class="bg-white rounded-lg shadow-sm overflow-hidden">
              <!-- Category & Meta -->
              <div class="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 border-b border-gray-100">
                <span class="inline-block px-3 py-1 rounded-md text-xs font-semibold text-white mb-4" style="background: linear-gradient(135deg, #8B0000, #DC143C);">
                  {{ artikel.kategori }}
                </span>
                
                <!-- Title -->
                <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {{ artikel.judul }}
                </h1>

                <!-- Meta Info -->
                <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span class="flex items-center gap-2">
                    <i class="far fa-calendar-alt text-red-600"></i>
                    {{ formatDate(artikel.tanggal) }}
                  </span>
                  <span v-if="artikel.penulis" class="flex items-center gap-2">
                    <i class="fas fa-user-edit text-red-600"></i>
                    {{ artikel.penulis }}
                  </span>
                </div>
              </div>

              <!-- Featured Image -->
              <div class="px-6 sm:px-8 pt-6">
                <img 
                  :src="artikel.gambar" 
                  :alt="artikel.judul"
                  class="w-full h-auto rounded-lg"
                />
              </div>

              <!-- Article Body -->
              <div class="px-6 sm:px-8 py-8">
                <div class="prose prose-lg max-w-none article-content" v-html="artikel.deskripsi"></div>
              </div>

              <!-- Files Section -->
              <div v-if="artikel.files && artikel.files.length > 0" class="px-6 sm:px-8 pb-8">
                <div class="pt-6 border-t border-gray-200">
                  <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <i class="fas fa-paperclip text-red-600"></i>
                    Lampiran File
                  </h3>
                  <div class="space-y-3">
                    <a 
                      v-for="file in artikel.files" 
                      :key="file.id"
                      :href="file.url"
                      target="_blank"
                      class="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-red-500 hover:bg-red-50 transition-all duration-300 group"
                    >
                      <div 
                        class="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-white"
                        :class="getFileColor(file.filename)"
                      >
                        <i class="fas" :class="getFileIcon(file.filename)"></i>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="font-semibold text-gray-900 group-hover:text-red-600 transition-colors text-sm truncate">
                          {{ file.filename }}
                        </p>
                        <p class="text-xs text-gray-500">
                          {{ formatFileSize(file.size) }}
                        </p>
                      </div>
                      <div class="flex-shrink-0">
                        <i class="fas fa-download text-gray-400 group-hover:text-red-600 transition-colors text-sm"></i>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </article>

            <!-- Back Button -->
            <div class="mt-8">
              <button 
                @click="$router.push('/media-publikasi/artikel')"
                class="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                <i class="fas fa-arrow-left"></i>
                <span>Kembali ke Daftar Artikel</span>
              </button>
            </div>
          </div>

          <!-- Sidebar (Right Side) -->
          <div class="lg:col-span-1">
            <!-- Rekomendasi Artikel Lainnya -->
            <div v-if="artikelLainnya.length > 0" class="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 class="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                <i class="fas fa-newspaper text-red-600 mr-2"></i>
                Artikel Lainnya
              </h2>
              
              <div class="space-y-4">
                <div 
                  v-for="item in artikelLainnya.slice(0, 5)" 
                  :key="item.id"
                  class="group cursor-pointer"
                  @click="goToArtikel(item.id)"
                >
                  <div class="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <!-- Image -->
                    <div class="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden">
                      <img 
                        :src="item.gambar" 
                        :alt="item.judul"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <!-- Content -->
                    <div class="flex-1 min-w-0">
                      <!-- Category -->
                      <span class="inline-block px-2 py-0.5 rounded text-xs font-medium text-white mb-1" style="background: linear-gradient(135deg, #8B0000, #DC143C);">
                        {{ item.kategori }}
                      </span>
                      
                      <!-- Title -->
                      <h3 class="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-red-600 transition-colors mb-1">
                        {{ item.judul }}
                      </h3>

                      <!-- Meta -->
                      <div class="flex items-center gap-2 text-xs text-gray-500">
                        <span class="flex items-center gap-1">
                          <i class="far fa-calendar-alt"></i>
                          {{ formatDate(item.tanggal) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- View All Button -->
              <div class="mt-6 pt-4 border-t border-gray-200">
                <button 
                  @click="$router.push('/media-publikasi/artikel')"
                  class="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold text-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <i class="fas fa-list mr-2"></i>
                  Lihat Semua Artikel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <PublicFooter :kontakData="kontakDataFromAPI" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getPublicDetailArtikel, getPublicArtikelLainnya, getPublicDataKontak } from '~/services/public-home'

const route = useRoute()

// State
const artikel = ref(null)
const artikelLainnya = ref([])
const loading = ref(true)
const error = ref(false)
const kontakDataFromAPI = ref(null)

// Fetch article detail
const fetchArtikelDetail = async () => {
  loading.value = true
  error.value = false
  
  try {
    const id = route.params.id
    const response = await getPublicDetailArtikel(id)
    artikel.value = response
    
    // Fetch related articles after getting the main article
    await fetchArtikelLainnya(id)
  } catch (err) {
    console.error('Error fetching article detail:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

// Fetch artikel lainnya
const fetchArtikelLainnya = async (currentId) => {
  try {
    const response = await getPublicArtikelLainnya(currentId)
    artikelLainnya.value = response.data || []
  } catch (err) {
    console.error('Error fetching artikel lainnya:', err)
    artikelLainnya.value = []
  }
}

// Fetch contact data
const fetchKontakData = async () => {
  try {
    const response = await getPublicDataKontak()
    if (response) {
      kontakDataFromAPI.value = response
    }
  } catch (error) {
    console.error('Error fetching kontak data:', error)
  }
}

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  })
}

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Strip HTML tags
const stripHtml = (html) => {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

// Get file icon based on extension
const getFileIcon = (filename) => {
  const ext = filename.split('.').pop().toLowerCase()
  
  const iconMap = {
    // Documents
    'pdf': 'fa-file-pdf',
    'doc': 'fa-file-word',
    'docx': 'fa-file-word',
    'txt': 'fa-file-alt',
    
    // Spreadsheets
    'xls': 'fa-file-excel',
    'xlsx': 'fa-file-excel',
    'csv': 'fa-file-csv',
    
    // Presentations
    'ppt': 'fa-file-powerpoint',
    'pptx': 'fa-file-powerpoint',
    
    // Images
    'jpg': 'fa-file-image',
    'jpeg': 'fa-file-image',
    'png': 'fa-file-image',
    'gif': 'fa-file-image',
    'svg': 'fa-file-image',
    'webp': 'fa-file-image',
    
    // Archives
    'zip': 'fa-file-archive',
    'rar': 'fa-file-archive',
    '7z': 'fa-file-archive',
    
    // Videos
    'mp4': 'fa-file-video',
    'avi': 'fa-file-video',
    'mov': 'fa-file-video',
    'mkv': 'fa-file-video',
    
    // Audio
    'mp3': 'fa-file-audio',
    'wav': 'fa-file-audio',
    'ogg': 'fa-file-audio',
    
    // Code
    'html': 'fa-file-code',
    'css': 'fa-file-code',
    'js': 'fa-file-code',
    'json': 'fa-file-code',
    'xml': 'fa-file-code',
  }
  
  return iconMap[ext] || 'fa-file'
}

// Get file color based on extension
const getFileColor = (filename) => {
  const ext = filename.split('.').pop().toLowerCase()
  
  const colorMap = {
    // Documents
    'pdf': 'from-red-600 to-red-500',
    'doc': 'from-blue-600 to-blue-500',
    'docx': 'from-blue-600 to-blue-500',
    'txt': 'from-gray-600 to-gray-500',
    
    // Spreadsheets
    'xls': 'from-green-600 to-green-500',
    'xlsx': 'from-green-600 to-green-500',
    'csv': 'from-green-600 to-green-500',
    
    // Presentations
    'ppt': 'from-orange-600 to-orange-500',
    'pptx': 'from-orange-600 to-orange-500',
    
    // Images
    'jpg': 'from-purple-600 to-purple-500',
    'jpeg': 'from-purple-600 to-purple-500',
    'png': 'from-purple-600 to-purple-500',
    'gif': 'from-purple-600 to-purple-500',
    'svg': 'from-purple-600 to-purple-500',
    'webp': 'from-purple-600 to-purple-500',
    
    // Archives
    'zip': 'from-yellow-600 to-yellow-500',
    'rar': 'from-yellow-600 to-yellow-500',
    '7z': 'from-yellow-600 to-yellow-500',
    
    // Videos
    'mp4': 'from-pink-600 to-pink-500',
    'avi': 'from-pink-600 to-pink-500',
    'mov': 'from-pink-600 to-pink-500',
    'mkv': 'from-pink-600 to-pink-500',
    
    // Audio
    'mp3': 'from-indigo-600 to-indigo-500',
    'wav': 'from-indigo-600 to-indigo-500',
    'ogg': 'from-indigo-600 to-indigo-500',
    
    // Code
    'html': 'from-teal-600 to-teal-500',
    'css': 'from-teal-600 to-teal-500',
    'js': 'from-teal-600 to-teal-500',
    'json': 'from-teal-600 to-teal-500',
    'xml': 'from-teal-600 to-teal-500',
  }
  
  return colorMap[ext] || 'from-gray-600 to-gray-500'
}

// Go to article detail
const goToArtikel = (id) => {
  navigateTo(`/media-publikasi/artikel/${id}`)
}

// On mounted
onMounted(() => {
  fetchArtikelDetail()
  fetchKontakData()
})
</script>

<style scoped>
.font-poppins {
  font-family: 'Poppins', 'Plus Jakarta Sans', sans-serif;
}

/* Article Content Styling */
.article-content {
  color: #374151;
  line-height: 1.75;
  font-size: 1rem;
}

.article-content :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.75;
}

.article-content :deep(h1),
.article-content :deep(h2),
.article-content :deep(h3),
.article-content :deep(h4) {
  color: #1f2937;
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.article-content :deep(h1) {
  font-size: 1.875rem;
}

.article-content :deep(h2) {
  font-size: 1.5rem;
}

.article-content :deep(h3) {
  font-size: 1.25rem;
}

.article-content :deep(h4) {
  font-size: 1.125rem;
}

.article-content :deep(ul),
.article-content :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.article-content :deep(li) {
  margin-bottom: 0.5rem;
}

.article-content :deep(strong) {
  font-weight: 700;
  color: #1f2937;
}

.article-content :deep(em) {
  font-style: italic;
}

.article-content :deep(mark) {
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
}

.article-content :deep(a) {
  color: #DC143C;
  text-decoration: underline;
  transition: color 0.2s;
}

.article-content :deep(a:hover) {
  color: #8B0000;
}

.article-content :deep(blockquote) {
  border-left: 4px solid #DC143C;
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
  color: #6b7280;
}

.article-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.article-content :deep(code) {
  background-color: #f3f4f6;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
  font-size: 0.875em;
}

.article-content :deep(pre) {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.article-content :deep(pre code) {
  background-color: transparent;
  padding: 0;
  color: inherit;
}

.article-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.article-content :deep(th),
.article-content :deep(td) {
  border: 1px solid #e5e7eb;
  padding: 0.5rem;
  text-align: left;
}

.article-content :deep(th) {
  background-color: #f9fafb;
  font-weight: 600;
}

.article-content :deep(hr) {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1.5rem 0;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
