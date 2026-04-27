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
          alt="Prestasi Siswa" 
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
            <span class="text-white">Prestasi Siswa</span>
          </div>

          <!-- Title & Description -->
          <div class="max-w-2xl">
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight animate-fadeInUp animation-delay-100">
              <span class="text-yellow-400">Prestasi Siswa</span>
            </h1>
            <p class="text-sm sm:text-base md:text-lg text-white/85 leading-relaxed animate-fadeInUp animation-delay-200">
              Berbagai pencapaian dan prestasi membanggakan siswa-siswi SDN Sukapura 01.
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
        <div v-if="loading && prestasiList.length === 0" class="text-center py-12">
          <i class="fas fa-spinner fa-spin text-4xl text-red-600 mb-4"></i>
          <p class="text-gray-600">Memuat prestasi siswa...</p>
        </div>

        <!-- Prestasi Grid -->
        <div v-else-if="prestasiList.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div 
            v-for="prestasi in prestasiList" 
            :key="prestasi.id"
            class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group cursor-pointer"
            @click="openDetailModal(prestasi.id)"
          >
            <!-- Image with Trophy Overlay -->
            <div class="relative h-56 overflow-hidden">
              <img 
                v-if="prestasi.foto_thumbnail"
                :src="prestasi.foto_thumbnail" 
                :alt="prestasi.nama_prestasi"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-yellow-500 via-yellow-600 to-orange-600 flex items-center justify-center">
                <i class="fas fa-trophy text-white text-7xl opacity-30"></i>
              </div>
              
              <!-- Gradient Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              
              <!-- Trophy Icon Badge -->
              <div class="absolute top-3 right-3 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
                <i class="fas fa-trophy text-white text-lg"></i>
              </div>
              
              <!-- Juara Badge -->
              <div class="absolute top-3 left-3">
                <span :class="[
                  'px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg',
                  getJuaraColor(prestasi.juara)
                ]">
                  <i class="fas fa-medal mr-1"></i>{{ prestasi.juara }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-4">
              <!-- Header: Jenis Badge & Tingkat -->
              <div class="flex items-center justify-between mb-2">
                <span :class="[
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold',
                  prestasi.jenis === 'Individu' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-purple-100 text-purple-700'
                ]">
                  <i :class="prestasi.jenis === 'Individu' ? 'fas fa-user' : 'fas fa-users'"></i>
                  {{ prestasi.jenis }}
                </span>
                
                <span class="text-xs font-medium text-gray-600">
                  <i class="fas fa-map-marker-alt text-red-500 mr-1"></i>{{ prestasi.tingkat_prestasi }}
                </span>
              </div>

              <!-- Title -->
              <h3 class="text-base sm:text-lg font-bold text-gray-900 mt-4 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                {{ prestasi.nama_prestasi }}
              </h3>

              <!-- Participant Info & Date -->
              <div class="flex items-start justify-between mt-3 pt-3 border-t border-gray-100 gap-2">
                <!-- Participant -->
                <div class="flex-1 min-w-0">
                  <!-- Individu -->
                  <div v-if="prestasi.jenis === 'Individu'" class="flex items-start gap-2 text-sm text-gray-600">
                    <i class="fas fa-user-graduate text-red-500 mt-0.5 flex-shrink-0"></i>
                    <span class="font-medium truncate">{{ prestasi.nama_peserta_didik }}</span>
                  </div>
                  
                  <!-- Tim -->
                  <div v-else class="flex items-start gap-2 text-sm text-gray-600">
                    <i class="fas fa-users text-red-500 mt-0.5 flex-shrink-0"></i>
                    <span class="font-semibold truncate">{{ prestasi.nama_grup }}</span>
                  </div>
                </div>
                
                <!-- Date -->
                <div class="flex items-center gap-1.5 text-xs text-gray-500 flex-shrink-0">
                  <i class="far fa-calendar-alt text-red-500"></i>
                  <span>{{ formatDate(prestasi.tanggal_lomba) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <i class="fas fa-trophy text-6xl text-gray-300 mb-4"></i>
          <p class="text-gray-600 text-lg">Tidak ada prestasi ditemukan</p>
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

        <!-- Loading More State -->
        <div v-if="loading && prestasiList.length > 0" class="text-center mt-8">
          <i class="fas fa-spinner fa-spin text-2xl text-red-600"></i>
        </div>
      </div>
    </section>

    <!-- Detail Modal -->
    <Teleport to="body">
      <!-- Backdrop -->
      <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="showDetailModal" @click="closeDetailModal"
          class="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"></div>
      </Transition>
      
      <!-- Modal -->
      <Transition enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4">
        <div v-if="showDetailModal"
          class="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 pointer-events-none">
          <div
            class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[90vh]">

            <!-- Header -->
            <div
              class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-6 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
              <div class="relative z-10 flex-1">
                <h2 class="text-base sm:text-lg font-bold text-white">Detail Prestasi</h2>
              </div>
              <button type="button" @click="closeDetailModal"
                class="relative z-10 flex-shrink-0 inline-flex items-center justify-center p-1.5 sm:p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-150 cursor-pointer">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <!-- Loading State -->
            <div v-if="loadingDetail" class="flex-1 flex items-center justify-center p-8">
              <div class="text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-red-600 mb-4"></i>
                <p class="text-gray-600">Memuat detail prestasi...</p>
              </div>
            </div>

            <!-- Content -->
            <div v-else-if="prestasiDetail" class="flex-1 overflow-y-auto p-4 sm:p-6">
              <!-- Photo Gallery -->
              <div v-if="prestasiDetail.foto && prestasiDetail.foto.length > 0" class="mb-6">
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div 
                    v-for="(foto, index) in prestasiDetail.foto" 
                    :key="foto.id"
                    class="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                    @click="openPhotoLightbox(index)"
                  >
                    <img 
                      :src="foto.url" 
                      :alt="`Foto ${index + 1}`"
                      class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                      <i class="fas fa-search-plus text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Info Grid -->
              <div class="space-y-4">
                <!-- Jenis & Juara -->
                <div class="flex items-center gap-3 flex-wrap">
                  <span :class="[
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold',
                    prestasiDetail.jenis === 'Individu' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-purple-100 text-purple-700'
                  ]">
                    <i :class="prestasiDetail.jenis === 'Individu' ? 'fas fa-user' : 'fas fa-users'"></i>
                    {{ prestasiDetail.jenis }}
                  </span>
                  
                  <span :class="[
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold text-white',
                    getJuaraColorCompact(prestasiDetail.juara)
                  ]">
                    <i class="fas fa-medal"></i>
                    {{ prestasiDetail.juara }}
                  </span>
                </div>

                <!-- Nama Prestasi -->
                <div>
                  <h3 class="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                    {{ prestasiDetail.nama_prestasi }}
                  </h3>
                </div>

                <!-- Peserta -->
                <div class="bg-gray-50 rounded-lg p-4">
                  <h4 class="text-sm font-semibold text-gray-700 mb-2">Peserta</h4>
                  
                  <!-- Individu -->
                  <div v-if="prestasiDetail.jenis === 'Individu' && prestasiDetail.peserta_didik">
                    <div class="flex items-center gap-2 text-gray-900">
                      <i class="fas fa-user-graduate text-red-500"></i>
                      <span class="font-medium">{{ prestasiDetail.peserta_didik.nama }}</span>
                    </div>
                    <div class="text-sm text-gray-600 mt-1 ml-6">
                      NIS: {{ prestasiDetail.peserta_didik.nis }} | Kelas: {{ prestasiDetail.peserta_didik.rombel?.name || '-' }}
                    </div>
                  </div>
                  
                  <!-- Tim -->
                  <div v-else-if="prestasiDetail.jenis === 'Tim'">
                    <div class="flex items-center gap-2 text-gray-900 mb-3">
                      <i class="fas fa-users text-red-500"></i>
                      <span class="font-semibold">{{ prestasiDetail.nama_grup }}</span>
                    </div>
                    <div v-if="prestasiDetail.anggota_tim_prestasi && prestasiDetail.anggota_tim_prestasi.length > 0" class="space-y-2">
                      <p class="text-xs font-semibold text-gray-600 uppercase">Anggota Tim:</p>
                      <div 
                        v-for="(anggota, idx) in prestasiDetail.anggota_tim_prestasi" 
                        :key="idx"
                        class="flex items-center gap-2 text-sm text-gray-700 pl-4"
                      >
                        <i class="fas fa-circle text-[4px] text-gray-400"></i>
                        <span>{{ anggota.peserta_didik?.nama }} ({{ anggota.peserta_didik?.rombel?.name || '-' }})</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Detail Info -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="flex items-start gap-3">
                    <i class="fas fa-map-marker-alt text-red-500 mt-1"></i>
                    <div>
                      <p class="text-xs text-gray-500">Tingkat</p>
                      <p class="font-semibold text-gray-900">{{ prestasiDetail.tingkat_prestasi }}</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3">
                    <i class="fas fa-building text-red-500 mt-1"></i>
                    <div>
                      <p class="text-xs text-gray-500">Penyelenggara</p>
                      <p class="font-semibold text-gray-900">{{ prestasiDetail.penyelenggara || '-' }}</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3">
                    <i class="far fa-calendar-alt text-red-500 mt-1"></i>
                    <div>
                      <p class="text-xs text-gray-500">Tanggal Lomba</p>
                      <p class="font-semibold text-gray-900">{{ formatDate(prestasiDetail.tanggal_lomba) }}</p>
                    </div>
                  </div>

                  <div v-if="prestasiDetail.ekstrakurikuler" class="flex items-start gap-3">
                    <i class="fas fa-star text-red-500 mt-1"></i>
                    <div>
                      <p class="text-xs text-gray-500">Ekstrakurikuler</p>
                      <p class="font-semibold text-gray-900">{{ prestasiDetail.ekstrakurikuler.name }}</p>
                    </div>
                  </div>
                </div>

                <!-- Keterangan -->
                <div v-if="prestasiDetail.keterangan" class="bg-blue-50 rounded-lg p-4">
                  <h4 class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <i class="fas fa-info-circle text-blue-600"></i>
                    Keterangan
                  </h4>
                  <p class="text-sm text-gray-700 leading-relaxed">{{ prestasiDetail.keterangan }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Photo Lightbox -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="showPhotoLightbox" @click="closePhotoLightbox"
          class="fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center p-4">
          <div class="relative max-w-5xl max-h-full">
            <!-- Close Button -->
            <button 
              @click="closePhotoLightbox"
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
              v-if="prestasiDetail && currentPhotoIndex < prestasiDetail.foto.length - 1"
              @click.stop="nextPhoto"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-red-400 transition-colors z-10"
            >
              <i class="fas fa-chevron-right text-3xl"></i>
            </button>
            
            <!-- Image -->
            <img 
              v-if="prestasiDetail && prestasiDetail.foto[currentPhotoIndex]"
              :src="prestasiDetail.foto[currentPhotoIndex].url" 
              :alt="`Foto ${currentPhotoIndex + 1}`"
              class="max-w-full max-h-full object-contain rounded-lg"
              @click.stop
            />
            
            <!-- Photo Counter -->
            <div v-if="prestasiDetail" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-3 py-1 rounded text-sm">
              {{ currentPhotoIndex + 1 }} / {{ prestasiDetail.foto.length }}
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Footer -->
    <PublicFooter :kontakData="kontakDataFromAPI" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getPublicDaftarPrestasi, getPublicDetailPrestasi, getPublicDataKontak } from '~/services/public-home'

// State
const prestasiList = ref([])
const loading = ref(false)
const hasMore = ref(false)
const offset = ref(0)
const kontakDataFromAPI = ref(null)

// Modal state
const showDetailModal = ref(false)
const loadingDetail = ref(false)
const prestasiDetail = ref(null)

// Photo lightbox state
const showPhotoLightbox = ref(false)
const currentPhotoIndex = ref(0)

// Filters
const filters = ref({
  sort: 'terbaru'
})

// Fetch prestasi data
const fetchPrestasiData = async (reset = false) => {
  loading.value = true
  
  if (reset) {
    offset.value = 0
    prestasiList.value = []
  }
  
  try {
    const response = await getPublicDaftarPrestasi(filters.value, offset.value)
    
    if (reset) {
      prestasiList.value = response.data || []
    } else {
      prestasiList.value = [...prestasiList.value, ...(response.data || [])]
    }
    
    hasMore.value = response.has_more || false
  } catch (error) {
    console.error('Error fetching prestasi data:', error)
  } finally {
    loading.value = false
  }
}

// Apply filters
const applyFilters = () => {
  fetchPrestasiData(true)
}

// Load more
const loadMore = () => {
  offset.value += 12
  fetchPrestasiData(false)
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

// Get juara color
const getJuaraColor = (juara) => {
  if (juara.includes('Juara 1')) {
    return 'bg-gradient-to-r from-yellow-500 to-yellow-600'
  } else if (juara.includes('Juara 2')) {
    return 'bg-gradient-to-r from-gray-400 to-gray-500'
  } else if (juara.includes('Juara 3')) {
    return 'bg-gradient-to-r from-orange-600 to-orange-700'
  } else {
    return 'bg-gradient-to-r from-blue-600 to-blue-700'
  }
}

// Get juara color compact (for card content)
const getJuaraColorCompact = (juara) => {
  if (juara.includes('Juara 1')) {
    return 'bg-yellow-500'
  } else if (juara.includes('Juara 2')) {
    return 'bg-gray-400'
  } else if (juara.includes('Juara 3')) {
    return 'bg-orange-600'
  } else {
    return 'bg-blue-600'
  }
}

// Open detail modal
const openDetailModal = async (id) => {
  showDetailModal.value = true
  loadingDetail.value = true
  prestasiDetail.value = null
  
  try {
    const response = await getPublicDetailPrestasi(id)
    prestasiDetail.value = response.data
  } catch (error) {
    console.error('Error fetching prestasi detail:', error)
  } finally {
    loadingDetail.value = false
  }
}

// Close detail modal
const closeDetailModal = () => {
  showDetailModal.value = false
  prestasiDetail.value = null
  document.body.style.overflow = 'auto'
}

// Photo lightbox functions
const openPhotoLightbox = (index) => {
  currentPhotoIndex.value = index
  showPhotoLightbox.value = true
  document.body.style.overflow = 'hidden'
}

const closePhotoLightbox = () => {
  showPhotoLightbox.value = false
  document.body.style.overflow = 'auto'
}

const nextPhoto = () => {
  if (prestasiDetail.value && currentPhotoIndex.value < prestasiDetail.value.foto.length - 1) {
    currentPhotoIndex.value++
  }
}

const previousPhoto = () => {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--
  }
}

// On mounted
onMounted(() => {
  fetchPrestasiData(true)
  fetchKontakData()
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

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

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
  animation: fadeInUp 0.6s ease-out forwards;
}

.animation-delay-100 {
  animation-delay: 0.1s;
  opacity: 0;
}

.animation-delay-200 {
  animation-delay: 0.2s;
  opacity: 0;
}
</style>
