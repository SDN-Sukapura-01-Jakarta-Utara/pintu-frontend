<template>
  <div class="font-poppins bg-white overflow-x-hidden">
    <!-- Navbar -->
    <PublicNavbar />

    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <i class="fas fa-spinner fa-spin text-5xl text-red-600 mb-4"></i>
        <p class="text-gray-600 text-lg">Memuat galeri kegiatan...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center px-6">
        <i class="fas fa-exclamation-circle text-5xl text-red-600 mb-4"></i>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Galeri Tidak Ditemukan</h2>
        <p class="text-gray-600 mb-6">Galeri kegiatan yang Anda cari tidak tersedia.</p>
        <button 
          @click="$router.push('/media-publikasi/galeri-kegiatan')"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <i class="fas fa-arrow-left"></i>
          <span>Kembali ke Daftar Galeri</span>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="galeri" class="bg-gray-50 py-8 sm:py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 text-gray-500 text-xs sm:text-sm mb-6">
          <a href="/" class="hover:text-red-600 transition-colors">
            <i class="fas fa-home"></i> Beranda
          </a>
          <i class="fas fa-chevron-right text-[10px]"></i>
          <a href="/media-publikasi/galeri-kegiatan" class="hover:text-red-600 transition-colors">
            Galeri Kegiatan
          </a>
          <i class="fas fa-chevron-right text-[10px]"></i>
          <span class="text-gray-700">Detail</span>
        </div>

        <!-- Main Content Grid -->
        <div class="space-y-8">
          <!-- Gallery Content -->
          <div>
            <!-- Gallery Header -->
            <div class="bg-white rounded-lg shadow-sm p-6 sm:p-8 mb-6">
              <div class="mb-6">
                <span class="inline-block px-3 py-1 rounded-md text-xs font-semibold text-white mb-4" style="background: linear-gradient(135deg, #8B0000, #DC143C);">
                  <i class="fas fa-camera mr-1"></i>Galeri Kegiatan
                </span>
                
                <!-- Title -->
                <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {{ galeri.judul }}
                </h1>

                <!-- Meta Info -->
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <span class="flex items-center gap-2">
                    <i class="far fa-calendar-alt text-red-600"></i>
                    {{ formatDate(galeri.tanggal) }}
                  </span>
                  <span class="flex items-center gap-2 ml-4">
                    <i class="fas fa-images text-red-600"></i>
                    {{ galeri.foto.length }} Foto
                  </span>
                </div>
              </div>
            </div>

            <!-- Photo Gallery -->
            <div class="bg-white rounded-lg shadow-sm p-6 sm:p-8">
              <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <i class="fas fa-images text-red-600"></i>
                Foto Kegiatan
              </h2>
              
              <!-- Photo Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div 
                  v-for="(foto, index) in galeri.foto" 
                  :key="foto.id"
                  class="group cursor-pointer"
                  @click="openLightbox(index)"
                >
                  <!-- Card Container -->
                  <div class="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    <!-- Image -->
                    <div class="relative aspect-[4/3] overflow-hidden">
                      <img 
                        :src="foto.url" 
                        :alt="`${galeri.judul} - Foto ${index + 1}`"
                        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      <!-- Black Hover Overlay -->
                      <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <!-- Search Icon -->
                      <div class="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <i class="fas fa-search-plus text-white text-sm"></i>
                      </div>
                      
                      <!-- Photo Number -->
                      <div class="absolute top-4 left-4 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                        Foto {{ index + 1 }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Back Button - Removed from here -->
          </div>

          <!-- Galeri Lainnya Section -->
          <div v-if="galeriLainnya.length > 0" class="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <h2 class="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              <i class="fas fa-camera text-red-600 mr-2"></i>
              Galeri Lainnya
            </h2>
            
            <!-- Galeri Lainnya Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div 
                v-for="item in galeriLainnya.slice(0, 8)" 
                :key="item.id"
                class="group cursor-pointer"
                @click="goToGaleri(item.id)"
              >
                <div class="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <!-- Image -->
                  <div class="relative aspect-[4/3] overflow-hidden">
                    <img 
                      v-if="item.foto_thumbnail"
                      :src="item.foto_thumbnail" 
                      :alt="item.judul"
                      class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div v-else class="w-full h-full bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center">
                      <i class="fas fa-camera text-white text-2xl"></i>
                    </div>
                    
                    <!-- Overlay -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                    
                    <!-- Red Hover Overlay -->
                    <div class="absolute inset-0 bg-red-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <!-- Photo Icon -->
                    <div class="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <i class="fas fa-camera text-white text-sm"></i>
                    </div>
                  </div>

                  <!-- Content Overlay -->
                  <div class="absolute bottom-0 left-0 right-0 p-4">
                    <h3 class="text-white font-bold text-base leading-tight mb-2 line-clamp-2 group-hover:text-yellow-300 transition-colors duration-300">
                      {{ item.judul }}
                    </h3>
                    
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2 text-xs text-gray-300">
                        <span class="flex items-center gap-1">
                          <i class="far fa-calendar-alt"></i>
                          {{ formatDate(item.tanggal) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Back Button - Moved to bottom -->
          <div class="text-center">
            <button 
              @click="$router.push('/media-publikasi/galeri-kegiatan')"
              class="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              <i class="fas fa-arrow-left"></i>
              <span>Kembali ke Daftar Galeri</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <div 
      v-if="lightboxOpen" 
      class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      @click="closeLightbox"
    >
      <div class="relative max-w-4xl max-h-full">
        <!-- Close Button -->
        <button 
          @click="closeLightbox"
          class="absolute -top-12 right-0 text-white hover:text-red-400 transition-colors z-10"
        >
          <i class="fas fa-times text-2xl"></i>
        </button>
        
        <!-- Navigation Buttons -->
        <button 
          v-if="currentPhotoIndex > 0"
          @click.stop="previousPhoto"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-red-400 transition-colors z-10"
        >
          <i class="fas fa-chevron-left text-3xl"></i>
        </button>
        
        <button 
          v-if="currentPhotoIndex < galeri.foto.length - 1"
          @click.stop="nextPhoto"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-red-400 transition-colors z-10"
        >
          <i class="fas fa-chevron-right text-3xl"></i>
        </button>
        
        <!-- Image -->
        <img 
          :src="galeri.foto[currentPhotoIndex]?.url" 
          :alt="`${galeri.judul} - Foto ${currentPhotoIndex + 1}`"
          class="max-w-full max-h-full object-contain rounded-lg"
          @click.stop
        />
        
        <!-- Photo Counter -->
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-3 py-1 rounded text-sm">
          {{ currentPhotoIndex + 1 }} / {{ galeri.foto.length }}
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
import { getPublicDetailGaleri, getPublicGaleriLainnya, getPublicDataKontak } from '~/services/public-home'

const route = useRoute()

// State
const galeri = ref(null)
const galeriLainnya = ref([])
const loading = ref(true)
const error = ref(false)
const kontakDataFromAPI = ref(null)

// Lightbox state
const lightboxOpen = ref(false)
const currentPhotoIndex = ref(0)

// Fetch galeri detail
const fetchGaleriDetail = async () => {
  loading.value = true
  error.value = false
  
  try {
    const id = route.params.id
    const response = await getPublicDetailGaleri(id)
    galeri.value = response
    
    // Fetch related galeri after getting the main galeri
    await fetchGaleriLainnya(id)
  } catch (err) {
    console.error('Error fetching galeri detail:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

// Fetch galeri lainnya
const fetchGaleriLainnya = async (currentId) => {
  try {
    const response = await getPublicGaleriLainnya(currentId)
    galeriLainnya.value = response.data || []
  } catch (err) {
    console.error('Error fetching galeri lainnya:', err)
    galeriLainnya.value = []
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

// Image loading handlers
const handleImageLoad = (event) => {
  // Image loaded successfully
  console.log('Image loaded:', event.target.src)
}

const handleImageError = (event) => {
  console.error('Image failed to load:', event.target.src)
  // You could set a fallback image here if needed
}

// Lightbox functions
const openLightbox = (index) => {
  currentPhotoIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = 'auto'
}

const nextPhoto = () => {
  if (currentPhotoIndex.value < galeri.value.foto.length - 1) {
    currentPhotoIndex.value++
  }
}

const previousPhoto = () => {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--
  }
}

// Go to galeri detail
const goToGaleri = (id) => {
  navigateTo(`/media-publikasi/galeri-kegiatan/${id}`)
}

// Keyboard navigation for lightbox
const handleKeydown = (event) => {
  if (!lightboxOpen.value) return
  
  if (event.key === 'Escape') {
    closeLightbox()
  } else if (event.key === 'ArrowLeft') {
    previousPhoto()
  } else if (event.key === 'ArrowRight') {
    nextPhoto()
  }
}

// On mounted
onMounted(() => {
  fetchGaleriDetail()
  fetchKontakData()
  
  // Add keyboard event listener
  document.addEventListener('keydown', handleKeydown)
})

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'auto'
})
</script>

<style scoped>
.font-poppins {
  font-family: 'Poppins', 'Plus Jakarta Sans', sans-serif;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Lightbox animations */
.lightbox-enter-active, .lightbox-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-enter-from, .lightbox-leave-to {
  opacity: 0;
}
</style>