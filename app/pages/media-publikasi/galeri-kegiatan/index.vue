<template>
  <div class="font-poppins bg-white overflow-x-hidden">
    <!-- Navbar -->
    <PublicNavbar />

    <!-- Hero Section -->
    <section class="relative h-[40vh] min-h-[320px] max-h-[400px] overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0">
        <img 
          src="~/assets/images/profil-sekolah.jpg" 
          alt="Galeri Kegiatan" 
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Overlays -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>

      <!-- Content -->
      <div class="absolute inset-0 flex items-center">
        <div class="w-full max-w-7xl mx-auto px-6 sm:px-8">
          <!-- Breadcrumb -->
          <div class="flex items-center gap-2 text-white/70 text-xs sm:text-sm mb-4 animate-fadeInUp">
            <a href="/" class="hover:text-yellow-400 transition-colors">
              <i class="fas fa-home"></i> Beranda
            </a>
            <i class="fas fa-chevron-right text-[10px]"></i>
            <span class="text-white/70">Media & Publikasi</span>
            <i class="fas fa-chevron-right text-[10px]"></i>
            <span class="text-white">Galeri Kegiatan</span>
          </div>

          <!-- Title & Description -->
          <div class="max-w-2xl">
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight animate-fadeInUp animation-delay-100">
              <span class="text-yellow-400">Galeri Kegiatan</span>
            </h1>
            <p class="text-sm sm:text-base md:text-lg text-white/85 leading-relaxed animate-fadeInUp animation-delay-200">
              Dokumentasi kegiatan dan momen berharga di SDN Sukapura 01.
            </p>
          </div>
        </div>
      </div>

      <!-- Bottom Curve -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" class="w-full h-8 sm:h-12 block">
          <path fill="white" d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z"></path>
        </svg>
      </div>
    </section>

    <!-- Content Section -->
    <section class="py-12 sm:py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-5 sm:px-8">
        <!-- Filter Section -->
        <div class="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-8">
          <div class="max-w-xs">
            <!-- Sort Filter -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fas fa-sort mr-2 text-red-600"></i>Urutkan
              </label>
              <select 
                v-model="filters.sort" 
                @change="applyFilters"
                class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors text-sm"
              >
                <option value="terbaru">Terbaru</option>
                <option value="terlama">Terlama</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading && galeriList.length === 0" class="text-center py-12">
          <i class="fas fa-spinner fa-spin text-4xl text-red-600 mb-4"></i>
          <p class="text-gray-600">Memuat galeri kegiatan...</p>
        </div>

        <!-- Galeri Grid -->
        <div v-else-if="galeriList.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <div 
            v-for="galeri in galeriList" 
            :key="galeri.id"
            class="group cursor-pointer"
            @click="goToDetail(galeri.id)"
          >
            <!-- Card Container -->
            <div class="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <!-- Image -->
              <div class="relative aspect-[4/3] overflow-hidden">
                <img 
                  :src="galeri.foto_thumbnail" 
                  :alt="galeri.judul"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
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
                  {{ galeri.judul }}
                </h3>
                
                <div class="flex items-center justify-between">
                  <span class="text-white/80 text-xs flex items-center gap-1">
                    <i class="far fa-calendar-alt"></i>
                    {{ formatDate(galeri.tanggal) }}
                  </span>
                  
                  <div class="flex items-center gap-1 text-white/80 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Lihat Galeri</span>
                    <i class="fas fa-arrow-right text-xs"></i>
                  </div>
                </div>
              </div>

              <!-- Hover Effect Border -->
              <div class="absolute inset-0 border-2 border-transparent group-hover:border-red-500/50 rounded-2xl transition-colors duration-300"></div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <i class="fas fa-images text-6xl text-gray-300 mb-4"></i>
          <p class="text-gray-600 text-lg">Tidak ada galeri kegiatan ditemukan</p>
        </div>

        <!-- Load More Button -->
        <div v-if="hasMore && !loading" class="text-center mt-8">
          <button 
            @click="loadMore"
            class="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-none cursor-pointer"
          >
            <i class="fas fa-plus-circle"></i>
            <span>Lihat Lebih Banyak</span>
          </button>
        </div>

        <!-- Loading More -->
        <div v-if="loading && galeriList.length > 0" class="text-center py-6">
          <i class="fas fa-spinner fa-spin text-2xl text-red-600"></i>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <PublicFooter :kontakData="kontakDataFromAPI" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPublicDaftarGaleri, getPublicDataKontak } from '~/services/public-home'

const router = useRouter()

// State
const galeriList = ref([])
const loading = ref(false)
const hasMore = ref(false)
const currentOffset = ref(0)
const filters = ref({
  sort: 'terbaru'
})
const kontakDataFromAPI = ref(null)

// Fetch galeri
const fetchGaleri = async (append = false) => {
  loading.value = true
  
  try {
    const filterObj = {
      sort: filters.value.sort
    }

    const response = await getPublicDaftarGaleri(filterObj, currentOffset.value)

    if (append) {
      galeriList.value = [...galeriList.value, ...response.data]
    } else {
      galeriList.value = response.data
    }
    
    hasMore.value = response.has_more
  } catch (error) {
    console.error('Error fetching galeri:', error)
  } finally {
    loading.value = false
  }
}

// Apply filters
const applyFilters = () => {
  currentOffset.value = 0
  fetchGaleri(false)
}

// Load more
const loadMore = () => {
  currentOffset.value += 12
  fetchGaleri(true)
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

// Format date short
const formatDateShort = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { 
    day: '2-digit', 
    month: '2-digit',
    year: '2-digit'
  })
}

// Go to detail
const goToDetail = (id) => {
  router.push(`/media-publikasi/galeri-kegiatan/${id}`)
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

// On mounted
onMounted(() => {
  fetchGaleri()
  fetchKontakData()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

.animation-delay-100 {
  animation-delay: 0.1s;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}
</style>