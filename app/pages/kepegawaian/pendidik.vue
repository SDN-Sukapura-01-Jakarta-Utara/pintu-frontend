<template>
  <div class="font-poppins bg-white overflow-x-hidden">

    <!-- ===== NAVBAR ===== -->
    <PublicNavbar />

    <!-- ===== HERO ===== -->
    <section class="relative h-[40vh] min-h-[320px] max-h-[400px] overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0">
        <img 
          src="~/assets/images/profil-sekolah.jpg" 
          alt="Pendidik" 
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
            <span class="text-white/70">Kepegawaian</span>
            <i class="fas fa-chevron-right text-[10px]"></i>
            <span class="text-white">Pendidik</span>
          </div>

          <!-- Title & Description -->
          <div class="max-w-2xl">
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight animate-fadeInUp animation-delay-100">
              Tenaga <span class="text-yellow-400">Pendidik</span>
            </h1>
            <p class="text-sm sm:text-base md:text-lg text-white/85 leading-relaxed animate-fadeInUp animation-delay-200">
              Daftar tenaga pendidik SDN Sukapura 01 yang berdedikasi dalam membimbing dan mendidik generasi penerus bangsa.
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

    <!-- ===== PENDIDIK CARDS ===== -->
    <section class="pendidik-section">
      <div class="section-inner">
        <div class="section-header reveal" data-delay="0">
          <div class="section-eyebrow">Kepegawaian</div>
          <h2 class="section-title crimson-text">Daftar Tenaga Pendidik</h2>
          <p class="section-desc">Guru-guru berkualitas dan berpengalaman yang siap membimbing siswa-siswi kami</p>
        </div>

        <!-- Loading State -->
        <div v-if="loadingPendidik" class="text-center py-12 text-gray-500">
          <i class="fas fa-spinner fa-spin text-3xl mb-3"></i>
          <p>Memuat data pendidik...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="errorPendidik" class="text-center py-12 text-red-500">
          <i class="fas fa-exclamation-circle text-3xl mb-3"></i>
          <p>Gagal memuat data pendidik</p>
          <p class="text-xs mt-2">{{ errorPendidik.message }}</p>
        </div>

        <!-- Cards Grid -->
        <div v-else-if="pendidikData && pendidikData.length > 0" class="pendidik-grid">
          <div 
            v-for="(pendidik, index) in pendidikData" 
            :key="index"
            class="pendidik-card reveal"
            :data-delay="(index % 12) * 50"
          >
            <!-- Photo -->
            <div class="pendidik-photo-wrapper">
              <img 
                v-if="pendidik.foto" 
                :src="getPhotoUrl(pendidik.foto)" 
                :alt="pendidik.nama"
                class="pendidik-photo"
                @error="handleImageError"
              />
              <div v-else class="pendidik-photo-placeholder">
                <i class="fas fa-user"></i>
              </div>
            </div>

            <!-- Info -->
            <div class="pendidik-info">
              <h3 class="pendidik-name">{{ pendidik.nama }}</h3>
              
              <div class="pendidik-id">
                <i class="fas fa-id-card"></i>
                <span v-if="pendidik.nip">NIP: {{ pendidik.nip }}</span>
                <span v-else-if="pendidik.nkki">NKKI: {{ pendidik.nkki }}</span>
                <span v-else class="text-gray-400">-</span>
              </div>

              <div class="pendidik-jabatan">
                <i class="fas fa-briefcase"></i>
                <span>{{ pendidik.jabatan }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12 text-gray-500">
          <i class="fas fa-users text-3xl mb-3"></i>
          <p>Belum ada data pendidik</p>
        </div>
      </div>
    </section>

    <!-- ===== FOOTER ===== -->
    <PublicFooter :kontakData="kontakDataFromAPI" />

    <!-- Back to Top -->
    <Transition name="fade">
      <button
        v-show="scrolled"
        @click="scrollToTop"
        class="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 w-11 h-11 sm:w-12 sm:h-12 rounded-full text-white border-none cursor-pointer flex items-center justify-center shadow-xl z-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
        style="background: linear-gradient(135deg, #8B0000, #DC143C);"
      >
        <i class="fas fa-chevron-up"></i>
      </button>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getPublicDataPendidik, getPublicDataKontak } from '~/services/public-home'

// Set page title
useHead({
  title: 'Tenaga Pendidik - SDN Sukapura 01'
})

// ----- DATA -----
const scrolled = ref(false)
const kontakDataFromAPI = ref(null)

// Fetch pendidik using useAsyncData
const { data: pendidikData, pending: loadingPendidik, error: errorPendidik } = await useAsyncData(
  'pendidik',
  async () => {
    try {
      const response = await getPublicDataPendidik()
      console.log('Pendidik response:', response)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching pendidik:', error)
      return []
    }
  }
)

// ----- LOGIC -----
const handleScroll = () => {
  scrolled.value = window.scrollY > 100
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Get photo URL
const getPhotoUrl = (foto) => {
  if (!foto) return ''
  const config = useRuntimeConfig()
  // If foto already contains full URL, return as is
  if (foto.startsWith('http://') || foto.startsWith('https://')) {
    return foto
  }
  // Otherwise, construct URL
  return `${config.public.apiBase}/storage/${foto}`
}

// Handle image error
const handleImageError = (event) => {
  event.target.style.display = 'none'
  event.target.parentElement.innerHTML = '<div class="pendidik-photo-placeholder"><i class="fas fa-user"></i></div>'
}

// Fetch data kontak
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

// Intersection Observer for reveal
let revealObserver = null

onMounted(() => {
  window.addEventListener('scroll', handleScroll)

  // Fetch data kontak
  fetchKontakData()

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0
        setTimeout(() => entry.target.classList.add('visible'), +delay)
      }
    })
  }, { threshold: 0.1 })

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el))
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  revealObserver?.disconnect()
})
</script>

<style scoped>
/* ─── BASE ─────────────────────────────────────────────────── */
.font-poppins {
  font-family: 'Poppins', 'Plus Jakarta Sans', sans-serif;
}

/* ─── HERO ──────────────────────────────────────────────────── */
.animate-fadeInUp {
  animation: fadeInUp 0.8s ease-out forwards;
}

.animation-delay-100 {
  animation-delay: 0.1s;
  opacity: 0;
}

.animation-delay-200 {
  animation-delay: 0.2s;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ─── SHARED SECTION STYLES ─────────────────────────────────── */
.section-inner { 
  max-width: 1280px; 
  margin: 0 auto; 
  padding: 80px 24px; 
}

.section-header { 
  text-align: center; 
  margin-bottom: 56px; 
}

.section-eyebrow {
  display: inline-flex; 
  align-items: center; 
  gap: 12px;
  font-size: 11px; 
  font-weight: 700; 
  letter-spacing: 2.5px; 
  text-transform: uppercase;
  color: #DC143C; 
  margin-bottom: 12px;
}

.section-eyebrow::before, .section-eyebrow::after {
  content: ''; 
  flex: 0 0 32px; 
  height: 1px; 
  background: #DC143C; 
  opacity: 0.35;
}

.section-title {
  font-family: 'Poppins', 'Plus Jakarta Sans', sans-serif;
  font-size: clamp(24px, 4vw, 36px); 
  line-height: 1.2; 
  font-weight: 700;
}

.crimson-text { 
  color: #8B0000; 
}

.section-desc { 
  color: #666; 
  margin-top: 14px; 
  max-width: 600px; 
  margin-left: auto; 
  margin-right: auto; 
  font-size: 15px;
  line-height: 1.6;
}

/* ─── PENDIDIK SECTION ───────────────────────────────────────── */
.pendidik-section { 
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
  min-height: 60vh;
}

.pendidik-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px;
  margin-top: 40px;
}

@media (max-width: 640px) {
  .pendidik-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

/* ─── PENDIDIK CARD ──────────────────────────────────────────── */
.pendidik-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: all 0.3s ease;
  border: 1px solid #fee2e2;
}

.pendidik-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(139,0,0,0.15);
  border-color: #fecaca;
}

/* Photo */
.pendidik-photo-wrapper {
  position: relative;
  width: 100%;
  height: 280px;
  background: #f3f4f6;
  overflow: hidden;
  border-bottom: 3px solid #DC143C;
}

.pendidik-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.pendidik-card:hover .pendidik-photo {
  transform: scale(1.02);
}

.pendidik-photo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #DC143C;
  font-size: 64px;
}

/* Info */
.pendidik-info {
  padding: 20px;
}

.pendidik-name {
  font-size: 17px;
  font-weight: 600;
  color: #8B0000;
  margin-bottom: 0;
  line-height: 1.4;
  min-height: 48px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.pendidik-id {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 10px;
}

.pendidik-id i {
  color: #DC143C;
  font-size: 13px;
  flex-shrink: 0;
}

.pendidik-jabatan {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #374151;
  padding-top: 12px;
  border-top: 1px solid #fee2e2;
}

.pendidik-jabatan i {
  color: #DC143C;
  font-size: 13px;
  flex-shrink: 0;
}

/* ─── FADE TRANSITION ─────────────────────────────────────────── */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* ─── REVEAL ANIMATION ───────────────────────────────────────── */
.reveal {
  opacity: 0; 
  transform: translateY(28px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.visible { 
  opacity: 1; 
  transform: none; 
}
</style>
