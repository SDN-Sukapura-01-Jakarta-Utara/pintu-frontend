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
          alt="Pengumuman" 
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
            <span class="text-white">Pengumuman</span>
          </div>

          <!-- Title & Description -->
          <div class="max-w-2xl">
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight animate-fadeInUp animation-delay-100">
              <span class="text-yellow-400">Pengumuman</span>
            </h1>
            <p class="text-sm sm:text-base md:text-lg text-white/85 leading-relaxed animate-fadeInUp animation-delay-200">
              Informasi dan pengumuman penting dari SDN Sukapura 01.
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
        <div v-if="loading && pengumumanList.length === 0" class="text-center py-12">
          <i class="fas fa-spinner fa-spin text-4xl text-red-600 mb-4"></i>
          <p class="text-gray-600">Memuat pengumuman...</p>
        </div>

        <!-- Pengumuman Grid -->
        <div v-else-if="pengumumanList.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div 
            v-for="pengumuman in pengumumanList" 
            :key="pengumuman.id"
            class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 cursor-pointer group"
            @click="goToDetail(pengumuman.id)"
          >
            <!-- Image -->
            <div class="relative h-48 overflow-hidden">
              <img 
                v-if="pengumuman.gambar"
                :src="pengumuman.gambar" 
                :alt="pengumuman.judul"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center">
                <i class="fas fa-bullhorn text-white text-6xl opacity-20"></i>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              <!-- Date Badge -->
              <span class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg" style="background: linear-gradient(135deg, #8B0000, #DC143C);">
                <i class="far fa-calendar-alt mr-1"></i>{{ formatDate(pengumuman.tanggal) }}
              </span>
            </div>

            <!-- Content -->
            <div class="p-5">
              <!-- Meta Info -->
              <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <span v-if="pengumuman.penulis" class="flex items-center gap-1.5">
                  <i class="fas fa-user-edit text-red-500"></i>
                  {{ pengumuman.penulis }}
                </span>
              </div>

              <!-- Title -->
              <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-red-600 transition-colors">
                {{ pengumuman.judul }}
              </h3>

              <!-- Description -->
              <p class="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4" v-html="stripHtml(pengumuman.deskripsi)"></p>

              <!-- Read More -->
              <span class="inline-flex items-center gap-1 text-sm font-semibold text-red-600 group-hover:gap-2 transition-all">
                Baca Selengkapnya <i class="fas fa-arrow-right text-xs"></i>
              </span>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <i class="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
          <p class="text-gray-600 text-lg">Tidak ada pengumuman ditemukan</p>
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
        <div v-if="loading && pengumumanList.length > 0" class="text-center py-6">
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
import { getPublicDaftarPengumuman, getPublicDataKontak } from '~/services/public-home'

const router = useRouter()

// State
const pengumumanList = ref([])
const loading = ref(false)
const hasMore = ref(false)
const currentOffset = ref(0)
const filters = ref({
  sort: 'terbaru'
})
const kontakDataFromAPI = ref(null)

// Fetch pengumuman
const fetchPengumuman = async (append = false) => {
  loading.value = true
  
  try {
    const filterObj = {
      sort: filters.value.sort
    }

    const response = await getPublicDaftarPengumuman(filterObj, currentOffset.value)

    if (append) {
      pengumumanList.value = [...pengumumanList.value, ...response.data]
    } else {
      pengumumanList.value = response.data
    }
    
    hasMore.value = response.has_more
  } catch (error) {
    console.error('Error fetching pengumuman:', error)
  } finally {
    loading.value = false
  }
}

// Apply filters
const applyFilters = () => {
  currentOffset.value = 0
  fetchPengumuman(false)
}

// Load more
const loadMore = () => {
  currentOffset.value += 12
  fetchPengumuman(true)
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

// Strip HTML tags
const stripHtml = (html) => {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

// Go to detail
const goToDetail = (id) => {
  router.push(`/media-publikasi/pengumuman/${id}`)
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
  fetchPengumuman()
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

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
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
