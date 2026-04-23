<template>
  <footer class="relative py-12 sm:py-16 px-5 sm:px-8 overflow-hidden" style="background: linear-gradient(135deg, #111 0%, #1a1a1a 50%, #222 100%);">
    <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 1px); background-size: 30px 30px;"></div>

    <div class="max-w-6xl mx-auto relative">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-12">
        <!-- Brand -->
        <div class="sm:col-span-2 lg:col-span-1">
          <div class="flex items-center gap-3 mb-4">
            <img src="~/assets/images/logo-sekolah.jpg" alt="Logo" class="w-10 h-10 rounded-lg object-cover border border-white/20" />
            <h3 class="text-lg font-bold text-white">SDN Sukapura 01</h3>
          </div>
          <p class="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">
            Membangun generasi berkarakter dan berprestasi dengan berlandaskan akhlak mulia dan jiwa Pancasila.
          </p>
          <div class="flex gap-3 flex-wrap">
            <a v-if="kontakData?.website" :href="kontakData.website" target="_blank" rel="noopener noreferrer" class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white text-sm transition-all duration-300 hover:-translate-y-1 border border-white/10 hover:border-red-500 hover:bg-red-600">
              <i class="fas fa-globe"></i>
            </a>
            
            <a v-if="kontakData?.youtube" :href="kontakData.youtube" target="_blank" rel="noopener noreferrer" class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white text-sm transition-all duration-300 hover:-translate-y-1 border border-white/10 hover:border-red-500 hover:bg-red-600">
              <i class="fab fa-youtube"></i>
            </a>
            
            <a v-if="kontakData?.instagram" :href="kontakData.instagram" target="_blank" rel="noopener noreferrer" class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white text-sm transition-all duration-300 hover:-translate-y-1 border border-white/10 hover:border-red-500 hover:bg-red-600">
              <i class="fab fa-instagram"></i>
            </a>
            
            <a v-if="kontakData?.tiktok" :href="kontakData.tiktok" target="_blank" rel="noopener noreferrer" class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white text-sm transition-all duration-300 hover:-translate-y-1 border border-white/10 hover:border-red-500 hover:bg-red-600">
              <i class="fab fa-tiktok"></i>
            </a>
            
            <a v-if="kontakData?.facebook" :href="kontakData.facebook" target="_blank" rel="noopener noreferrer" class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white text-sm transition-all duration-300 hover:-translate-y-1 border border-white/10 hover:border-red-500 hover:bg-red-600">
              <i class="fab fa-facebook-f"></i>
            </a>
            
            <a v-if="kontakData?.twitter" :href="kontakData.twitter" target="_blank" rel="noopener noreferrer" class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white text-sm transition-all duration-300 hover:-translate-y-1 border border-white/10 hover:border-red-500 hover:bg-red-600">
              <i class="fab fa-x-twitter"></i>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-white font-semibold mb-4 text-sm flex items-center gap-2">
            <span class="w-5 h-0.5 rounded-full" style="background: linear-gradient(90deg, #DC143C, #FF6B6B);"></span>
            Tautan Cepat
          </h4>
          <ul class="list-none m-0 p-0 space-y-2.5">
            <li><a href="/profil-sekolah" class="text-gray-400 text-xs sm:text-sm hover:text-red-400 transition-colors flex items-center gap-2"><i class="fas fa-chevron-right text-[8px] text-red-500"></i> Profil Sekolah</a></li>
            <li><a href="#" class="text-gray-400 text-xs sm:text-sm hover:text-red-400 transition-colors flex items-center gap-2"><i class="fas fa-chevron-right text-[8px] text-red-500"></i> Artikel</a></li>
            <li><a href="#" class="text-gray-400 text-xs sm:text-sm hover:text-red-400 transition-colors flex items-center gap-2"><i class="fas fa-chevron-right text-[8px] text-red-500"></i> Pengumuman</a></li>
            <li><a href="#" class="text-gray-400 text-xs sm:text-sm hover:text-red-400 transition-colors flex items-center gap-2"><i class="fas fa-chevron-right text-[8px] text-red-500"></i> Galeri</a></li>
          </ul>
        </div>

        <!-- Aplikasi -->
        <div>
          <h4 class="text-white font-semibold mb-4 text-sm flex items-center gap-2">
            <span class="w-5 h-0.5 rounded-full" style="background: linear-gradient(90deg, #DC143C, #FF6B6B);"></span>
            Aplikasi
          </h4>
          <ul class="list-none m-0 p-0 space-y-2.5">
            <li><a href="#" class="text-gray-400 text-xs sm:text-sm hover:text-red-400 transition-colors flex items-center gap-2"><i class="fas fa-chevron-right text-[8px] text-red-500"></i> PINTU</a></li>
            <li><a href="#" class="text-gray-400 text-xs sm:text-sm hover:text-red-400 transition-colors flex items-center gap-2"><i class="fas fa-chevron-right text-[8px] text-red-500"></i> SEPAKAT</a></li>
            <li><a href="#" class="text-gray-400 text-xs sm:text-sm hover:text-red-400 transition-colors flex items-center gap-2"><i class="fas fa-chevron-right text-[8px] text-red-500"></i> SIEKSA</a></li>
            <li><a href="#" class="text-gray-400 text-xs sm:text-sm hover:text-red-400 transition-colors flex items-center gap-2"><i class="fas fa-chevron-right text-[8px] text-red-500"></i> Mutasi Siswa</a></li>
          </ul>
        </div>

        <!-- Kontak -->
        <div>
          <h4 class="text-white font-semibold mb-4 text-sm flex items-center gap-2">
            <span class="w-5 h-0.5 rounded-full" style="background: linear-gradient(90deg, #DC143C, #FF6B6B);"></span>
            Kontak
          </h4>
          <ul v-if="kontakData" class="list-none m-0 p-0 space-y-3">
            <li class="flex items-start gap-2 text-gray-400 text-xs sm:text-sm"><i class="fas fa-map-marker-alt text-red-500 mt-0.5"></i> {{ kontakData.alamat }}</li>
            <li class="flex items-center gap-2 text-gray-400 text-xs sm:text-sm"><i class="fas fa-phone-alt text-red-500"></i> {{ kontakData.telepon }}</li>
            <li class="flex items-center gap-2 text-gray-400 text-xs sm:text-sm"><i class="fas fa-envelope text-red-500"></i> {{ kontakData.email }}</li>
          </ul>
          <ul v-else class="list-none m-0 p-0 space-y-3">
            <li class="flex items-start gap-2 text-gray-400 text-xs sm:text-sm"><i class="fas fa-map-marker-alt text-red-500 mt-0.5"></i> Jl. Beo No.15, Komplek Walikota, Jakarta Utara</li>
            <li class="flex items-center gap-2 text-gray-400 text-xs sm:text-sm"><i class="fas fa-phone-alt text-red-500"></i> 021-4411729</li>
            <li class="flex items-center gap-2 text-gray-400 text-xs sm:text-sm"><i class="fas fa-envelope text-red-500"></i> sdnsukapuraa01@gmail.com</li>
          </ul>
        </div>
      </div>

      <div class="border-t border-white/10 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-gray-500 text-xs sm:text-sm">
        <p>&copy; 2025 SDN Sukapura 01. All Rights Reserved.</p>
        <p>Handcrafted with <span class="text-red-500 animate-pulse">&hearts;</span> by Syahira Isnaeni Dewi</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
defineProps({
  kontakData: {
    type: Object,
    default: null
  }
})
</script>
