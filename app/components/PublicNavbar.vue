<template>
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
          <a href="#" class="text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-white/20 transition-all duration-200 flex items-center gap-1">
            Kepegawaian
            <svg class="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </a>
          <div class="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-2xl min-w-48 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50">
            <a href="#" class="block px-5 py-3 text-gray-700 text-sm hover:bg-red-700 hover:text-white transition-all duration-200 hover:pl-7">Pendidik</a>
            <a href="#" class="block px-5 py-3 text-gray-700 text-sm hover:bg-red-700 hover:text-white transition-all duration-200 hover:pl-7">Tenaga Kependidikan</a>
          </div>
        </li>
        <li class="relative group">
          <a href="#" class="text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-white/20 transition-all duration-200 flex items-center gap-1">
            Media dan Publikasi
            <svg class="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </a>
          <div class="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-2xl min-w-48 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50">
            <a href="#" class="block px-5 py-3 text-gray-700 text-sm hover:bg-red-700 hover:text-white transition-all duration-200 hover:pl-7">Artikel</a>
            <a href="#" class="block px-5 py-3 text-gray-700 text-sm hover:bg-red-700 hover:text-white transition-all duration-200 hover:pl-7">Pengumuman</a>
            <a href="#" class="block px-5 py-3 text-gray-700 text-sm hover:bg-red-700 hover:text-white transition-all duration-200 hover:pl-7">Galeri Kegiatan</a>
          </div>
        </li>
        <li class="relative group">
          <a href="#" class="text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-white/20 transition-all duration-200 flex items-center gap-1">
            Aplikasi Sekolah
            <svg class="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </a>
          <div class="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-2xl min-w-72 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50">
            <a href="#" class="block px-5 py-3 text-gray-700 text-sm hover:bg-red-700 hover:text-white transition-all duration-200 hover:pl-7">PINTU (Portal Informasi Terpadu)</a>
            <a href="#" class="block px-5 py-3 text-gray-700 text-sm hover:bg-red-700 hover:text-white transition-all duration-200 hover:pl-7">SEPAKAT</a>
            <a href="#" class="block px-5 py-3 text-gray-700 text-sm hover:bg-red-700 hover:text-white transition-all duration-200 hover:pl-7">SIEKSA</a>
            <a href="#" class="block px-5 py-3 text-gray-700 text-sm hover:bg-red-700 hover:text-white transition-all duration-200 hover:pl-7">SIPERSA</a>
            <a href="#" class="block px-5 py-3 text-gray-700 text-sm hover:bg-red-700 hover:text-white transition-all duration-200 hover:pl-7">MUTASI SISWA</a>
          </div>
        </li>
        <li><a href="#" class="text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-white/20 transition-all duration-200 block">Pertanyaan dan Pengaduan</a></li>
      </ul>
      <button @click="mobileMenuOpen = !mobileMenuOpen" class="lg:hidden flex flex-col gap-1.5 p-2 bg-transparent border-none cursor-pointer z-50 relative">
        <span class="w-6 h-0.5 bg-white block rounded transition-all duration-300" :class="mobileMenuOpen ? 'rotate-45 translate-y-2' : ''"></span>
        <span class="w-6 h-0.5 bg-white block rounded transition-all duration-300" :class="mobileMenuOpen ? 'opacity-0' : ''"></span>
        <span class="w-6 h-0.5 bg-white block rounded transition-all duration-300" :class="mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''"></span>
      </button>
    </div>
    <Transition name="mobile-menu">
      <div v-if="mobileMenuOpen" class="lg:hidden fixed inset-0 top-0 z-40 bg-gradient-to-b from-[#8B0000] to-[#DC143C] flex flex-col pt-20 px-6 overflow-y-auto">
        <a @click="mobileMenuOpen = false" href="/" class="text-white text-sm font-medium py-2.5 border-b border-white/20 block" :class="isActive('/') ? 'bg-white/15' : ''">Beranda</a>
        <a @click="mobileMenuOpen = false" href="/profil-sekolah" class="text-white text-sm font-medium py-2.5 border-b border-white/20 block" :class="isActive('/profil-sekolah') ? 'bg-white/15' : ''">Profil Sekolah</a>
        <div class="border-b border-white/20">
          <button @click="mobileSubMenu = mobileSubMenu === 'kepegawaian' ? '' : 'kepegawaian'" class="text-white text-sm font-medium py-2.5 bg-transparent border-none cursor-pointer flex items-center justify-between w-full">
            Kepegawaian <svg class="w-3.5 h-3.5 transition-transform duration-200" :class="mobileSubMenu === 'kepegawaian' ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div v-show="mobileSubMenu === 'kepegawaian'" class="pl-4 pb-2">
            <a @click="mobileMenuOpen = false" href="#" class="text-white/80 text-sm py-1.5 block">Pendidik</a>
            <a @click="mobileMenuOpen = false" href="#" class="text-white/80 text-sm py-1.5 block">Tenaga Kependidikan</a>
          </div>
        </div>
        <div class="border-b border-white/20">
          <button @click="mobileSubMenu = mobileSubMenu === 'media' ? '' : 'media'" class="text-white text-sm font-medium py-2.5 bg-transparent border-none cursor-pointer flex items-center justify-between w-full">
            Media dan Publikasi <svg class="w-3.5 h-3.5 transition-transform duration-200" :class="mobileSubMenu === 'media' ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div v-show="mobileSubMenu === 'media'" class="pl-4 pb-2">
            <a @click="mobileMenuOpen = false" href="#" class="text-white/80 text-sm py-1.5 block">Artikel</a>
            <a @click="mobileMenuOpen = false" href="#" class="text-white/80 text-sm py-1.5 block">Pengumuman</a>
            <a @click="mobileMenuOpen = false" href="#" class="text-white/80 text-sm py-1.5 block">Galeri Kegiatan</a>
          </div>
        </div>
        <div class="border-b border-white/20">
          <button @click="mobileSubMenu = mobileSubMenu === 'aplikasi' ? '' : 'aplikasi'" class="text-white text-sm font-medium py-2.5 bg-transparent border-none cursor-pointer flex items-center justify-between w-full">
            Aplikasi Sekolah <svg class="w-3.5 h-3.5 transition-transform duration-200" :class="mobileSubMenu === 'aplikasi' ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div v-show="mobileSubMenu === 'aplikasi'" class="pl-4 pb-2">
            <a @click="mobileMenuOpen = false" href="#" class="text-white/80 text-sm py-1.5 block">PINTU</a>
            <a @click="mobileMenuOpen = false" href="#" class="text-white/80 text-sm py-1.5 block">SEPAKAT</a>
            <a @click="mobileMenuOpen = false" href="#" class="text-white/80 text-sm py-1.5 block">SIEKSA</a>
            <a @click="mobileMenuOpen = false" href="#" class="text-white/80 text-sm py-1.5 block">SIPERSA</a>
            <a @click="mobileMenuOpen = false" href="#" class="text-white/80 text-sm py-1.5 block">MUTASI SISWA</a>
          </div>
        </div>
        <a @click="mobileMenuOpen = false" href="#" class="text-white text-sm font-medium py-2.5 border-b border-white/20 block">Pertanyaan dan Pengaduan</a>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const scrolled = ref(false)
const mobileMenuOpen = ref(false)
const mobileSubMenu = ref('')

const isActive = (path) => {
  return route.path === path
}

const handleScroll = () => {
  scrolled.value = window.scrollY > 100
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
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

.mobile-menu-enter-active, .mobile-menu-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.mobile-menu-enter-from, .mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
