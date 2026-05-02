<template>
  <div>
    <nav class="sticky top-0 z-50 transition-all duration-500 navbar-glass" :class="scrolled ? 'navbar-scrolled' : 'navbar-top'">
      <div class="absolute bottom-0 left-0 right-0 h-[2px] opacity-60" style="background: linear-gradient(90deg, transparent, #FFD700, #FFA500, #FFD700, transparent);"></div>
      <div class="flex items-center justify-between px-4 sm:px-6 py-2 max-w-7xl mx-auto">
        <a href="/" class="flex items-center gap-2 sm:gap-3 text-white no-underline group">
          <div class="relative">
            <img
              src="~/assets/images/logo-sekolah.jpg"
              alt="Logo SDN Sukapura 01"
              class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover border-2 border-white/30 group-hover:scale-110 transition-transform duration-300 relative z-10"
            />
            <div class="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style="box-shadow: 0 0 20px rgba(255,215,0,0.4);"></div>
          </div>
          <div class="flex flex-col">
            <span class="text-base sm:text-lg font-bold tracking-wide leading-tight">SDN Sukapura 01</span>
            <span class="text-[9px] sm:text-[10px] text-yellow-300/80 font-medium tracking-widest uppercase hidden sm:block">Jakarta Utara</span>
          </div>
        </a>
        <ul class="hidden lg:flex items-center gap-1 list-none m-0 p-0">
          <li><a href="/" class="text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-white/20 transition-all duration-200 block" :class="isActive('/') ? 'bg-white/25 shadow-lg' : ''">Beranda</a></li>
          <li><a href="/profil-sekolah" class="text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-white/20 transition-all duration-200 block" :class="isActive('/profil-sekolah') ? 'bg-white/25 shadow-lg' : ''">Profil Sekolah</a></li>
          <li class="relative group">
            <a href="#" class="text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-white/20 transition-all duration-200 flex items-center gap-1" :class="isActive('/kepegawaian') ? 'bg-white/25 shadow-lg' : ''">
              Kepegawaian
              <svg class="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </a>
            <div class="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-2xl min-w-48 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50">
              <a href="/kepegawaian/pendidik" class="block px-5 py-3 text-gray-700 text-sm hover:bg-red-700 hover:text-white transition-all duration-200 hover:pl-7">Pendidik</a>
              <a href="/kepegawaian/tendik" class="block px-5 py-3 text-gray-700 text-sm hover:bg-red-700 hover:text-white transition-all duration-200 hover:pl-7">Tenaga Kependidikan</a>
            </div>
          </li>
          <li class="relative group">
            <a href="#" class="text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-white/20 transition-all duration-200 flex items-center gap-1" :class="isActive('/media-publikasi') ? 'bg-white/25 shadow-lg' : ''">
              Media dan Publikasi
              <svg class="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </a>
            <div class="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-2xl min-w-48 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50">
              <a href="/media-publikasi/artikel" class="block px-5 py-3 text-gray-700 text-sm hover:bg-red-700 hover:text-white transition-all duration-200 hover:pl-7">Artikel</a>
              <a href="/media-publikasi/pengumuman" class="block px-5 py-3 text-gray-700 text-sm hover:bg-red-700 hover:text-white transition-all duration-200 hover:pl-7">Pengumuman</a>
              <a href="/media-publikasi/galeri-kegiatan" class="block px-5 py-3 text-gray-700 text-sm hover:bg-red-700 hover:text-white transition-all duration-200 hover:pl-7">Galeri Kegiatan</a>
              <a href="/media-publikasi/prestasi-siswa" class="block px-5 py-3 text-gray-700 text-sm hover:bg-red-700 hover:text-white transition-all duration-200 hover:pl-7">Prestasi Siswa</a>
            </div>
          </li>
          <li class="relative group">
            <a href="#" class="text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-white/20 transition-all duration-200 flex items-center gap-1">
              Aplikasi Sekolah
              <svg class="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </a>
            <div class="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-2xl min-w-72 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50">
              <a v-for="app in aplikasiSekolah" :key="app.id" :href="app.link" target="_blank" rel="noopener noreferrer" class="block px-5 py-3 text-gray-700 text-sm hover:bg-red-700 hover:text-white transition-all duration-200 hover:pl-7">{{ app.nama }}</a>
              <div v-if="aplikasiSekolah.length === 0" class="px-5 py-3 text-gray-500 text-sm text-center">Tidak ada aplikasi</div>
            </div>
          </li>
          <li class="relative group">
            <a href="#" class="text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-white/20 transition-all duration-200 flex items-center gap-1" :class="isActive('/layanan-umpan-balik') ? 'bg-white/25 shadow-lg' : ''">
              Layanan Umpan Balik
              <svg class="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </a>
            <div class="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-2xl min-w-48 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50">
              <a href="/layanan-umpan-balik/pertanyaan" class="block px-5 py-3 text-gray-700 text-sm hover:bg-red-700 hover:text-white transition-all duration-200 hover:pl-7">Pertanyaan</a>
              <a href="#" class="block px-5 py-3 text-gray-700 text-sm hover:bg-red-700 hover:text-white transition-all duration-200 hover:pl-7">Pengaduan Online</a>
              <a @click.prevent="navigateToKritikSaran" href="/#kritik-saran" class="block px-5 py-3 text-gray-700 text-sm hover:bg-red-700 hover:text-white transition-all duration-200 hover:pl-7">Kritik & Saran</a>
            </div>
          </li>
        </ul>
        <button @click="toggleMobileMenu" class="lg:hidden flex flex-col gap-1.5 p-2 bg-transparent border-none cursor-pointer z-50 relative">
          <span class="w-6 h-0.5 bg-white block rounded transition-all duration-300" :class="mobileMenuOpen ? 'rotate-45 translate-y-2' : ''"></span>
          <span class="w-6 h-0.5 bg-white block rounded transition-all duration-300" :class="mobileMenuOpen ? 'opacity-0' : ''"></span>
          <span class="w-6 h-0.5 bg-white block rounded transition-all duration-300" :class="mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''"></span>
        </button>
      </div>
    </nav>

    <!-- Mobile Menu Overlay -->
    <Transition name="fade">
      <div 
        v-if="mobileMenuOpen" 
        @click="toggleMobileMenu"
        class="lg:hidden fixed inset-0 bg-black/50 z-[60]"
      ></div>
    </Transition>

    <!-- Mobile Menu Sidebar -->
    <Transition name="slide">
      <div v-if="mobileMenuOpen" class="lg:hidden fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] z-[70] bg-gradient-to-b from-[#8B0000] to-[#DC143C] shadow-2xl overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-white/20">
          <div class="flex items-center gap-2">
            <img
              src="~/assets/images/logo-sekolah.jpg"
              alt="Logo"
              class="w-10 h-10 rounded-lg object-cover border-2 border-white/30"
            />
            <div class="flex flex-col">
              <span class="text-white text-sm font-bold">SDN Sukapura 01</span>
              <span class="text-yellow-300/80 text-xs">Jakarta Utara</span>
            </div>
          </div>
          <button @click="toggleMobileMenu" class="text-white p-2 hover:bg-white/10 rounded-lg transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Menu Items -->
        <div class="p-4">
          <a @click="toggleMobileMenu" href="/" class="text-white text-sm font-medium py-3 px-4 rounded-lg block hover:bg-white/10 transition-colors mb-1" :class="isActive('/') ? 'bg-white/15' : ''">
            Beranda
          </a>
          
          <a @click="toggleMobileMenu" href="/profil-sekolah" class="text-white text-sm font-medium py-3 px-4 rounded-lg block hover:bg-white/10 transition-colors mb-1" :class="isActive('/profil-sekolah') ? 'bg-white/15' : ''">
            Profil Sekolah
          </a>
          
          <!-- Kepegawaian -->
          <div class="mb-1">
            <button @click="mobileSubMenu = mobileSubMenu === 'kepegawaian' ? '' : 'kepegawaian'" class="text-white text-sm font-medium py-3 px-4 rounded-lg bg-transparent border-none cursor-pointer flex items-center justify-between w-full hover:bg-white/10 transition-colors" :class="isActive('/kepegawaian') ? 'bg-white/15' : ''">
              <span>Kepegawaian</span>
              <svg class="w-4 h-4 transition-transform duration-200" :class="mobileSubMenu === 'kepegawaian' ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <div v-show="mobileSubMenu === 'kepegawaian'" class="pl-4 mt-1 space-y-1">
              <a @click="toggleMobileMenu" href="/kepegawaian/pendidik" class="text-white/90 text-sm py-2 px-4 rounded-lg block hover:bg-white/10 transition-colors">
                Pendidik
              </a>
              <a @click="toggleMobileMenu" href="/kepegawaian/tendik" class="text-white/90 text-sm py-2 px-4 rounded-lg block hover:bg-white/10 transition-colors">
                Tenaga Kependidikan
              </a>
            </div>
          </div>
          
          <!-- Media dan Publikasi -->
          <div class="mb-1">
            <button @click="mobileSubMenu = mobileSubMenu === 'media' ? '' : 'media'" class="text-white text-sm font-medium py-3 px-4 rounded-lg bg-transparent border-none cursor-pointer flex items-center justify-between w-full hover:bg-white/10 transition-colors" :class="isActive('/media-publikasi') ? 'bg-white/15' : ''">
              <span>Media dan Publikasi</span>
              <svg class="w-4 h-4 transition-transform duration-200" :class="mobileSubMenu === 'media' ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <div v-show="mobileSubMenu === 'media'" class="pl-4 mt-1 space-y-1">
              <a @click="toggleMobileMenu" href="/media-publikasi/artikel" class="text-white/90 text-sm py-2 px-4 rounded-lg block hover:bg-white/10 transition-colors">
                Artikel
              </a>
              <a @click="toggleMobileMenu" href="/media-publikasi/pengumuman" class="text-white/90 text-sm py-2 px-4 rounded-lg block hover:bg-white/10 transition-colors">
                Pengumuman
              </a>
              <a @click="toggleMobileMenu" href="/media-publikasi/galeri-kegiatan" class="text-white/90 text-sm py-2 px-4 rounded-lg block hover:bg-white/10 transition-colors">
                Galeri Kegiatan
              </a>
              <a @click="toggleMobileMenu" href="/media-publikasi/prestasi-siswa" class="text-white/90 text-sm py-2 px-4 rounded-lg block hover:bg-white/10 transition-colors">
                Prestasi Siswa
              </a>
            </div>
          </div>
          
          <!-- Aplikasi Sekolah -->
          <div class="mb-1">
            <button @click="mobileSubMenu = mobileSubMenu === 'aplikasi' ? '' : 'aplikasi'" class="text-white text-sm font-medium py-3 px-4 rounded-lg bg-transparent border-none cursor-pointer flex items-center justify-between w-full hover:bg-white/10 transition-colors">
              <span>Aplikasi Sekolah</span>
              <svg class="w-4 h-4 transition-transform duration-200" :class="mobileSubMenu === 'aplikasi' ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <div v-show="mobileSubMenu === 'aplikasi'" class="pl-4 mt-1 space-y-1">
              <a v-for="app in aplikasiSekolah" :key="app.id" @click="toggleMobileMenu" :href="app.link" target="_blank" rel="noopener noreferrer" class="text-white/90 text-sm py-2 px-4 rounded-lg block hover:bg-white/10 transition-colors">
                {{ app.nama }}
              </a>
              <div v-if="aplikasiSekolah.length === 0" class="text-white/60 text-sm py-2 px-4">Tidak ada aplikasi</div>
            </div>
          </div>
          
          <!-- Layanan Umpan Balik -->
          <div class="mb-1">
            <button @click="mobileSubMenu = mobileSubMenu === 'layanan' ? '' : 'layanan'" class="text-white text-sm font-medium py-3 px-4 rounded-lg bg-transparent border-none cursor-pointer flex items-center justify-between w-full hover:bg-white/10 transition-colors" :class="isActive('/layanan-umpan-balik') ? 'bg-white/15' : ''">
              <span>Layanan Umpan Balik</span>
              <svg class="w-4 h-4 transition-transform duration-200" :class="mobileSubMenu === 'layanan' ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <div v-show="mobileSubMenu === 'layanan'" class="pl-4 mt-1 space-y-1">
              <a @click="toggleMobileMenu" href="/layanan-umpan-balik/pertanyaan" class="text-white/90 text-sm py-2 px-4 rounded-lg block hover:bg-white/10 transition-colors">
                Pertanyaan
              </a>
              <a @click="toggleMobileMenu" href="#" class="text-white/90 text-sm py-2 px-4 rounded-lg block hover:bg-white/10 transition-colors">
                Pengaduan Online
              </a>
              <a @click="navigateToKritikSaranMobile" href="/#kritik-saran" class="text-white/90 text-sm py-2 px-4 rounded-lg block hover:bg-white/10 transition-colors">
                Kritik & Saran
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { getPublicAplikasiSekolah } from '~/services/public-home'

const route = useRoute()
const scrolled = ref(false)
const mobileMenuOpen = ref(false)
const mobileSubMenu = ref('')
const aplikasiSekolah = ref([])

const isActive = (path) => {
  if (path === '/media-publikasi') {
    // Check if current route starts with /media-publikasi/
    return route.path.startsWith('/media-publikasi/')
  }
  if (path === '/kepegawaian') {
    // Check if current route starts with /kepegawaian/
    return route.path.startsWith('/kepegawaian/')
  }
  if (path === '/layanan-umpan-balik') {
    // Check if current route starts with /layanan-umpan-balik/
    return route.path.startsWith('/layanan-umpan-balik/')
  }
  return route.path === path
}

const toggleMobileMenu = () => {
  console.log('Toggle clicked, current state:', mobileMenuOpen.value)
  mobileMenuOpen.value = !mobileMenuOpen.value
  console.log('New state:', mobileMenuOpen.value)
  if (mobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const handleScroll = () => {
  scrolled.value = window.scrollY > 100
}

const fetchAplikasiSekolah = async () => {
  try {
    const response = await getPublicAplikasiSekolah()
    aplikasiSekolah.value = response.data || []
  } catch (error) {
    console.error('Error fetching aplikasi sekolah:', error)
    aplikasiSekolah.value = []
  }
}

const navigateToKritikSaran = async (event) => {
  event.preventDefault()
  if (route.path === '/') {
    // Already on homepage, just scroll
    const element = document.getElementById('kritik-saran')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  } else {
    // Navigate to homepage first, then scroll
    await navigateTo('/')
    setTimeout(() => {
      const element = document.getElementById('kritik-saran')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 300)
  }
}

const navigateToKritikSaranMobile = async (event) => {
  event.preventDefault()
  toggleMobileMenu()
  if (route.path === '/') {
    // Already on homepage, just scroll
    setTimeout(() => {
      const element = document.getElementById('kritik-saran')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  } else {
    // Navigate to homepage first, then scroll
    await navigateTo('/')
    setTimeout(() => {
      const element = document.getElementById('kritik-saran')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 300)
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  fetchAplikasiSekolah()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.navbar-glass {
  background: linear-gradient(135deg, rgba(139,0,0,0.95), rgba(220,20,60,0.95));
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 24px rgba(0,0,0,0.1);
}

.navbar-scrolled {
  background: linear-gradient(135deg, rgba(139,0,0,0.98), rgba(220,20,60,0.98));
  box-shadow: 0 4px 32px rgba(0,0,0,0.2);
}

.navbar-top {
  background: linear-gradient(135deg, rgba(139,0,0,0.92), rgba(220,20,60,0.92));
}

/* Overlay Animation */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Slide Animation (Right to Left) */
.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
}
</style>
