<template>
  <div class="font-poppins bg-white overflow-x-hidden">

    <!-- ===== NAVBAR ===== -->
    <nav class="sticky top-0 z-50 shadow-lg transition-all duration-300" :class="scrolled ? 'py-0' : 'py-1'" style="background: linear-gradient(135deg, #8B0000 0%, #DC143C 100%);">
      <div class="flex items-center justify-between px-4 sm:px-6 py-2 max-w-7xl mx-auto">
        <!-- Brand -->
        <a href="#" class="flex items-center gap-2 sm:gap-3 text-white no-underline">
          <img
            src="https://lh3.googleusercontent.com/d/1hPPyudMyUv3HrRhHImV7AqZSYkPi0PMI"
            alt="Logo SDN Sukapura 01"
            class="w-10 h-10 sm:w-14 sm:h-14 rounded-xl object-cover border-2 border-white/30 hover:scale-110 transition-transform duration-300"
          />
          <span class="text-base sm:text-xl font-bold tracking-wide">SDN Sukapura 01</span>
        </a>

        <!-- Desktop Menu -->
        <ul class="hidden lg:flex items-center gap-1 list-none m-0 p-0">
          <li>
            <a href="#" class="text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-white/20 transition-all duration-200 block">Beranda</a>
          </li>
          <li>
            <a href="#" class="text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-white/20 transition-all duration-200 block">Profil Sekolah</a>
          </li>
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
          <li>
            <a href="#" class="text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-white/20 transition-all duration-200 block">Pertanyaan dan Pengaduan</a>
          </li>
        </ul>

        <!-- Hamburger Mobile -->
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="lg:hidden flex flex-col gap-1.5 p-2 bg-transparent border-none cursor-pointer z-50 relative">
          <span class="w-6 h-0.5 bg-white block rounded transition-all duration-300" :class="mobileMenuOpen ? 'rotate-45 translate-y-2' : ''"></span>
          <span class="w-6 h-0.5 bg-white block rounded transition-all duration-300" :class="mobileMenuOpen ? 'opacity-0' : ''"></span>
          <span class="w-6 h-0.5 bg-white block rounded transition-all duration-300" :class="mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''"></span>
        </button>
      </div>

      <!-- Mobile Menu Overlay -->
      <Transition name="mobile-menu">
        <div v-if="mobileMenuOpen" class="lg:hidden fixed inset-0 top-0 z-40 bg-gradient-to-b from-[#8B0000] to-[#DC143C] flex flex-col pt-20 px-6 overflow-y-auto">
          <a @click="mobileMenuOpen = false" href="#" class="text-white text-lg font-medium py-3 border-b border-white/20 block">Beranda</a>
          <a @click="mobileMenuOpen = false" href="#" class="text-white text-lg font-medium py-3 border-b border-white/20 block">Profil Sekolah</a>

          <div class="border-b border-white/20">
            <button @click="mobileSubMenu = mobileSubMenu === 'kepegawaian' ? '' : 'kepegawaian'" class="text-white text-lg font-medium py-3 bg-transparent border-none cursor-pointer flex items-center justify-between w-full">
              Kepegawaian
              <svg class="w-4 h-4 transition-transform duration-200" :class="mobileSubMenu === 'kepegawaian' ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div v-show="mobileSubMenu === 'kepegawaian'" class="pl-4 pb-2">
              <a @click="mobileMenuOpen = false" href="#" class="text-white/80 text-base py-2 block">Pendidik</a>
              <a @click="mobileMenuOpen = false" href="#" class="text-white/80 text-base py-2 block">Tenaga Kependidikan</a>
            </div>
          </div>

          <div class="border-b border-white/20">
            <button @click="mobileSubMenu = mobileSubMenu === 'media' ? '' : 'media'" class="text-white text-lg font-medium py-3 bg-transparent border-none cursor-pointer flex items-center justify-between w-full">
              Media dan Publikasi
              <svg class="w-4 h-4 transition-transform duration-200" :class="mobileSubMenu === 'media' ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div v-show="mobileSubMenu === 'media'" class="pl-4 pb-2">
              <a @click="mobileMenuOpen = false" href="#" class="text-white/80 text-base py-2 block">Artikel</a>
              <a @click="mobileMenuOpen = false" href="#" class="text-white/80 text-base py-2 block">Pengumuman</a>
              <a @click="mobileMenuOpen = false" href="#" class="text-white/80 text-base py-2 block">Galeri Kegiatan</a>
            </div>
          </div>

          <div class="border-b border-white/20">
            <button @click="mobileSubMenu = mobileSubMenu === 'aplikasi' ? '' : 'aplikasi'" class="text-white text-lg font-medium py-3 bg-transparent border-none cursor-pointer flex items-center justify-between w-full">
              Aplikasi Sekolah
              <svg class="w-4 h-4 transition-transform duration-200" :class="mobileSubMenu === 'aplikasi' ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div v-show="mobileSubMenu === 'aplikasi'" class="pl-4 pb-2">
              <a @click="mobileMenuOpen = false" href="#" class="text-white/80 text-base py-2 block">PINTU</a>
              <a @click="mobileMenuOpen = false" href="#" class="text-white/80 text-base py-2 block">SEPAKAT</a>
              <a @click="mobileMenuOpen = false" href="#" class="text-white/80 text-base py-2 block">SIEKSA</a>
              <a @click="mobileMenuOpen = false" href="#" class="text-white/80 text-base py-2 block">SIPERSA</a>
              <a @click="mobileMenuOpen = false" href="#" class="text-white/80 text-base py-2 block">MUTASI SISWA</a>
            </div>
          </div>

          <a @click="mobileMenuOpen = false" href="#" class="text-white text-lg font-medium py-3 border-b border-white/20 block">Pertanyaan dan Pengaduan</a>
        </div>
      </Transition>
    </nav>

    <!-- ===== HERO / JUMBOTRON ===== -->
    <section class="relative h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-hidden">
      <!-- Slides -->
      <TransitionGroup name="hero-slide">
        <div v-for="(slide, i) in heroSlides" :key="i" v-show="currentSlide === i" class="absolute inset-0">
          <img :src="slide.image" :alt="slide.title" class="w-full h-full object-cover" />
        </div>
      </TransitionGroup>

      <!-- Overlay -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

      <!-- Content -->
      <div class="absolute inset-0 flex items-center">
        <div class="w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div class="max-w-xl lg:max-w-2xl">
            <p class="text-yellow-400 font-semibold text-xs sm:text-sm uppercase tracking-[0.2em] mb-3 sm:mb-4 animate-fadeInUp">Selamat Datang di</p>
            <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight animate-fadeInUp animation-delay-100">
              SDN Sukapura 01
            </h1>
            <p class="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 leading-relaxed mb-6 sm:mb-8 animate-fadeInUp animation-delay-200 max-w-lg">
              Sambut masa depan gemilang dengan berakhlak, berilmu, berkarya dan berprestasi
            </p>
            <a
              href="#"
              class="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base text-gray-900 bounce-btn animate-fadeInUp animation-delay-300"
              style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); box-shadow: 0 10px 30px rgba(255,215,0,0.4);"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Pendaftaran Mutasi Siswa
            </a>
          </div>
        </div>
      </div>

      <!-- Slide Indicators -->
      <div class="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3">
        <button
          v-for="(_, i) in heroSlides" :key="i"
          @click="currentSlide = i"
          class="h-1.5 sm:h-2 rounded-full border-none cursor-pointer transition-all duration-300"
          :class="currentSlide === i ? 'bg-yellow-400 w-8 sm:w-10' : 'bg-white/50 w-3 sm:w-4 hover:bg-white/80'"
        ></button>
      </div>

      <!-- Arrows -->
      <button @click="prevSlide" class="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 cursor-pointer flex items-center justify-center hover:bg-white/30 transition-all duration-300">
        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <button @click="nextSlide" class="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 cursor-pointer flex items-center justify-center hover:bg-white/30 transition-all duration-300">
        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </button>
    </section>

    <!-- ===== ABOUT SECTION ===== -->
    <section class="max-w-5xl mx-auto my-10 sm:my-16 px-5 sm:px-8 py-10 sm:py-16 bg-white rounded-3xl shadow-2xl reveal">
      <h2 class="text-2xl sm:text-3xl font-bold text-center text-red-900 mb-6 sm:mb-8 pb-4 relative">
        Tentang SDN Sukapura 01
        <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 sm:w-24 h-1 rounded-full" style="background: linear-gradient(90deg, #8B0000, #DC143C);"></span>
      </h2>
      <p class="text-gray-600 text-sm sm:text-base leading-relaxed text-justify">
        SDN Sukapura 01 merupakan lembaga pendidikan dasar yang berlokasi di Jl. Beo No.15, Komplek Walikota,
        Kelurahan Sukapura, Kecamatan Cilincing, Jakarta Utara. Sekolah kami berkomitmen untuk mewujudkan
        generasi yang berakhlak mulia, cerdas, dan unggul dalam prestasi dengan berwawasan kebhinekaan global
        serta berjiwa Pancasila.
      </p>
      <p class="text-gray-600 text-sm sm:text-base leading-relaxed text-justify mt-4 sm:mt-5">
        Melalui sistem pembelajaran yang menanamkan nilai-nilai akhlak mulia, kami memfasilitasi peserta didik
        untuk berkembang secara optimal baik dalam bidang akademik maupun non-akademik. Dengan membudayakan
        kompetisi yang sehat dan menanamkan nilai-nilai Pancasila melalui pembiasaan, SDN Sukapura 01 siap
        membentuk generasi penerus bangsa yang berkualitas, berakhlak, berilmu, berkarya, dan berprestasi.
      </p>
    </section>

    <!-- ===== STATS SECTION ===== -->
    <section ref="statsSection" class="py-14 sm:py-20 px-5 sm:px-8" style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-2xl sm:text-4xl font-bold text-center text-yellow-400 mb-10 sm:mb-14 pb-4 relative reveal">
          Data Sekolah
          <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 sm:w-24 h-1 rounded-full" style="background: linear-gradient(90deg, #FFD700, #FFA500);"></span>
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-7">
          <div
            v-for="(stat, index) in statsData"
            :key="stat.label"
            class="stat-card rounded-2xl p-5 sm:p-10 text-center border-2 border-yellow-400/30 bg-yellow-400/10 transition-all duration-300 hover:-translate-y-2 hover:border-yellow-500 hover:shadow-yellow-glow cursor-default reveal"
            :style="{ transitionDelay: `${index * 100}ms` }"
          >
            <div class="text-3xl sm:text-5xl text-yellow-400 mb-3 sm:mb-5"><i :class="stat.icon"></i></div>
            <div class="text-2xl sm:text-4xl font-bold text-yellow-400 mb-1 sm:mb-2">
              {{ statsVisible ? animatedStats[index] : 0 }}
            </div>
            <div class="text-xs sm:text-sm text-gray-300 font-medium leading-snug">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== PRESTASI SECTION ===== -->
    <section class="max-w-6xl mx-auto my-14 sm:my-20 px-5 sm:px-8">
      <div class="text-center mb-10 sm:mb-14 reveal">
        <h2 class="text-2xl sm:text-4xl font-bold inline-block pb-3 relative" style="background: linear-gradient(135deg, #8B0000, #DC143C); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          Prestasi Siswa
          <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 sm:w-20 h-1 rounded-full" style="background: linear-gradient(90deg, #8B0000, #DC143C);"></span>
        </h2>
        <p class="text-gray-500 mt-3 sm:mt-5 text-sm sm:text-base">Kebanggaan dan pencapaian gemilang siswa-siswi SDN Sukapura 01</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 items-start">
        <div v-for="(item, index) in prestasiData" :key="item.nama"
          class="prestasi-card rounded-2xl overflow-hidden bg-white shadow-lg transition-all duration-400 cursor-pointer relative hover:-translate-y-3 hover:shadow-red-glow reveal"
          :class="index === 1 ? 'md:scale-105 md:shadow-xl' : ''"
          :style="{ transitionDelay: `${index * 150}ms` }"
        >
          <div class="absolute top-0 left-0 right-0 h-1.5 z-10" style="background: linear-gradient(90deg, #8B0000, #DC143C, #FF1493);"></div>
          <div class="relative overflow-hidden" :class="index === 1 ? 'h-56 sm:h-72 md:h-96' : 'h-48 sm:h-56 md:h-72'">
            <img :src="item.foto" :alt="item.nama" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
            <div class="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold"
              :class="getJuaraClass(item.juara)">
              <i class="fas fa-trophy"></i> {{ item.juara }}
            </div>
          </div>
          <div class="p-4 sm:p-6">
            <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2 transition-colors hover:text-red-600">{{ item.nama }}</h3>
            <div class="text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2" :class="getJuaraTextClass(item.juara)"><i class="fas fa-trophy"></i> {{ item.juara }}</div>
            <p class="text-xs sm:text-sm text-gray-500 leading-relaxed line-clamp-2 mb-2 sm:mb-3">{{ item.namaPrestasi }}</p>
            <div class="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-400">
              <svg class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              {{ item.tanggal }}
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center mt-8 sm:mt-10 reveal">
        <button class="px-7 sm:px-9 py-3 sm:py-4 rounded-full text-white font-semibold text-sm sm:text-base border-none cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl" style="background: linear-gradient(135deg, #8B0000, #DC143C);">
          Lihat Semua Prestasi Siswa
        </button>
      </div>
    </section>

    <!-- ===== ARTIKEL SECTION ===== -->
    <section class="max-w-6xl mx-auto my-14 sm:my-20 px-5 sm:px-8">
      <div class="text-center mb-10 sm:mb-14 reveal">
        <h2 class="text-2xl sm:text-4xl font-bold inline-block pb-3 relative" style="background: linear-gradient(135deg, #8B0000, #DC143C); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          Artikel Terbaru
          <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 sm:w-20 h-1 rounded-full" style="background: linear-gradient(90deg, #8B0000, #DC143C);"></span>
        </h2>
        <p class="text-gray-500 mt-3 sm:mt-5 text-sm sm:text-base">Berita dan informasi terkini dari SDN Sukapura 01</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <div v-for="(artikel, index) in artikelData" :key="artikel.judul"
          class="artikel-card bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer transition-all duration-400 relative hover:-translate-y-3 hover:shadow-red-glow reveal"
          :style="{ transitionDelay: `${index * 150}ms` }"
        >
          <div class="artikel-accent absolute top-0 left-0 right-0 h-1.5 scale-x-0 origin-left transition-transform duration-400 z-10" style="background: linear-gradient(90deg, #8B0000, #DC143C, #FF1493);" />
          <div class="relative h-44 sm:h-56 overflow-hidden">
            <img :src="artikel.gambar" :alt="artikel.judul" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
            <span class="absolute top-3 right-3 sm:top-4 sm:right-4 bg-red-900/95 text-white text-[10px] sm:text-xs font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full uppercase tracking-wide shadow-lg">
              {{ artikel.kategori }}
            </span>
          </div>
          <div class="p-4 sm:p-6">
            <div class="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-400 mb-2 sm:mb-3">
              <svg class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              {{ artikel.tanggal }}
            </div>
            <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2 leading-snug line-clamp-2 transition-colors hover:text-red-600">{{ artikel.judul }}</h3>
            <p class="text-xs sm:text-sm text-gray-500 leading-relaxed line-clamp-3">{{ artikel.deskripsi }}</p>
          </div>
        </div>
      </div>

      <div class="flex justify-center mt-8 sm:mt-10 reveal">
        <button class="px-7 sm:px-9 py-3 sm:py-4 rounded-full text-white font-semibold text-sm sm:text-base border-none cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl" style="background: linear-gradient(135deg, #8B0000, #DC143C);">
          Lihat Semua Artikel
        </button>
      </div>
    </section>

    <!-- ===== PENGUMUMAN SECTION ===== -->
    <section class="py-14 sm:py-20 px-5 sm:px-8" style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-2xl sm:text-4xl font-bold text-center text-yellow-400 mb-10 sm:mb-14 pb-4 relative reveal">
          Pengumuman Terbaru
          <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 sm:w-24 h-1 rounded-full" style="background: linear-gradient(90deg, #FFD700, #FFA500);"></span>
        </h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-7">
          <!-- Card Besar (Kiri) -->
          <div class="bg-white rounded-2xl overflow-hidden border-2 border-yellow-400/30 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400 hover:shadow-yellow-glow reveal">
            <div class="relative h-52 sm:h-80 overflow-hidden">
              <img :src="pengumumanData[0].gambar" :alt="pengumumanData[0].judul" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
              <span class="absolute top-3 left-3 sm:top-4 sm:left-4 bg-yellow-400/95 text-gray-900 text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full uppercase tracking-wide">PENGUMUMAN</span>
            </div>
            <div class="p-4 sm:p-6">
              <div class="flex items-center gap-1.5 sm:gap-2 text-xs text-red-500 mb-2 sm:mb-3">
                <svg class="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                {{ pengumumanData[0].tanggal }}
              </div>
              <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 hover:text-red-600 transition-colors">{{ pengumumanData[0].judul }}</h3>
              <p class="text-xs sm:text-sm text-gray-500 leading-relaxed line-clamp-3 sm:line-clamp-4">{{ pengumumanData[0].deskripsi }}</p>
            </div>
          </div>

          <!-- Cards Kecil (Kanan) -->
          <div class="flex flex-col gap-4 sm:gap-6">
            <div
              v-for="(item, index) in pengumumanData.slice(1, 4)"
              :key="item.judul"
              class="bg-white rounded-2xl overflow-hidden border-2 border-yellow-400/30 cursor-pointer flex flex-row transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400 reveal"
              :style="{ transitionDelay: `${index * 100}ms` }"
            >
              <div class="relative w-28 sm:w-44 min-w-28 sm:min-w-44 h-28 sm:h-36 overflow-hidden flex-shrink-0">
                <img :src="item.gambar" :alt="item.judul" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                <span class="absolute top-2 left-2 bg-yellow-400/95 text-gray-900 font-bold px-2 sm:px-3 py-1 rounded-full uppercase text-[8px] sm:text-[10px]">PENGUMUMAN</span>
              </div>
              <div class="p-3 sm:p-4 flex flex-col justify-center min-w-0">
                <div class="flex items-center gap-1.5 text-xs text-red-500 mb-1.5 sm:mb-2">
                  <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  {{ item.tanggal }}
                </div>
                <h3 class="text-xs sm:text-sm font-bold text-gray-900 leading-snug line-clamp-2 hover:text-red-600 transition-colors">{{ item.judul }}</h3>
                <p class="text-[10px] sm:text-xs text-gray-500 leading-relaxed line-clamp-2 mt-1 sm:mt-1.5">{{ item.deskripsi }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center mt-8 sm:mt-10 reveal">
          <button class="px-8 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base text-gray-900 border-none cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl" style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);">
            Lihat Semua Pengumuman
          </button>
        </div>
      </div>
    </section>

    <!-- ===== GALERI SECTION ===== -->
    <section class="max-w-6xl mx-auto my-14 sm:my-20 px-5 sm:px-8">
      <div class="text-center mb-10 sm:mb-14 reveal">
        <h2 class="text-2xl sm:text-4xl font-bold inline-block pb-3 relative" style="background: linear-gradient(135deg, #8B0000, #DC143C); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          Galeri Kegiatan
          <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 sm:w-20 h-1 rounded-full" style="background: linear-gradient(90deg, #8B0000, #DC143C);"></span>
        </h2>
        <p class="text-gray-500 mt-3 sm:mt-5 text-sm sm:text-base">Dokumentasi kegiatan dan prestasi SDN Sukapura 01</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
        <div
          v-for="(galeri, index) in galeriData"
          :key="galeri.kegiatan"
          class="relative rounded-2xl overflow-hidden h-60 sm:h-80 cursor-pointer shadow-md transition-all duration-400 group hover:-translate-y-3 hover:shadow-red-glow reveal"
          :style="{ transitionDelay: `${index * 150}ms` }"
        >
          <div class="absolute top-0 left-0 right-0 h-1.5 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-400 z-10" style="background: linear-gradient(90deg, #8B0000, #DC143C, #FF1493);"></div>
          <img :src="galeri.gambar" :alt="galeri.kegiatan" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div class="absolute inset-0 flex items-end justify-center pb-4 sm:pb-5 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400" style="background: linear-gradient(to top, rgba(139,0,0,0.95) 0%, rgba(220,20,60,0.85) 50%, transparent 100%);">
            <h3 class="text-white font-bold text-base sm:text-lg text-center leading-snug drop-shadow">{{ galeri.kegiatan }}</h3>
          </div>
        </div>
      </div>

      <div class="flex justify-center mt-8 sm:mt-10 reveal">
        <button class="px-7 sm:px-9 py-3 sm:py-4 rounded-full text-white font-semibold text-sm sm:text-base border-none cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl" style="background: linear-gradient(135deg, #8B0000, #DC143C);">
          Lihat Semua Galeri Kegiatan
        </button>
      </div>
    </section>

    <!-- ===== KONTAK SECTION ===== -->
    <section class="max-w-6xl mx-auto my-14 sm:my-20 px-5 sm:px-8">
      <div class="text-center mb-10 sm:mb-14 reveal">
        <h2 class="text-2xl sm:text-4xl font-bold inline-block pb-3 relative" style="background: linear-gradient(135deg, #8B0000, #DC143C); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          Kontak Kami
          <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 sm:w-20 h-1 rounded-full" style="background: linear-gradient(90deg, #8B0000, #DC143C);"></span>
        </h2>
        <p class="text-gray-500 mt-3 sm:mt-5 text-sm sm:text-base">Hubungi kami untuk informasi lebih lanjut</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
        <!-- Info Kontak -->
        <div class="bg-white rounded-2xl p-6 sm:p-10 shadow-lg reveal">
          <div v-for="kontak in kontakData" :key="kontak.label" class="flex items-start gap-4 sm:gap-5 pb-5 sm:pb-7 mb-5 sm:mb-7 border-b border-gray-100 last:border-b-0 last:pb-0 last:mb-0">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0" style="background: linear-gradient(135deg, #8B0000, #DC143C);">
              <i :class="kontak.icon"></i>
            </div>
            <div class="min-w-0">
              <h3 class="text-sm sm:text-base font-semibold text-gray-900 mb-1">{{ kontak.label }}</h3>
              <p class="text-xs sm:text-sm text-gray-500 leading-relaxed m-0 whitespace-pre-line break-words">{{ kontak.value }}</p>
            </div>
          </div>
        </div>

        <!-- Map -->
        <div class="rounded-2xl overflow-hidden shadow-lg min-h-[300px] sm:min-h-[450px] reveal">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.8513517764823!2d106.92182319999999!3d-6.1506563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698ab7a5b038f9%3A0x3c1b1cac881e3af!2sSDN%20Sukapura%2001!5e0!3m2!1sid!2sid!4v1764144796548!5m2!1sid!2sid"
            class="w-full h-full min-h-[300px] sm:min-h-[450px]"
            style="border:0;"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>

    <!-- ===== KRITIK & SARAN SECTION ===== -->
    <section class="py-14 sm:py-20 px-5 sm:px-8" style="background: linear-gradient(135deg, #8B0000 0%, #DC143C 100%);">
      <div class="max-w-2xl mx-auto">
        <div class="text-center mb-8 sm:mb-12 reveal">
          <h2 class="text-2xl sm:text-4xl font-bold text-white inline-block pb-4 relative">
            Kritik &amp; Saran
            <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 sm:w-20 h-1 bg-white rounded-full"></span>
          </h2>
          <p class="text-white/90 text-sm sm:text-base mt-4 sm:mt-5">Masukan Anda sangat berarti untuk kemajuan SDN Sukapura 01</p>
        </div>

        <div class="bg-white rounded-2xl p-6 sm:p-12 shadow-2xl reveal">
          <div class="mb-5 sm:mb-7">
            <label class="block text-sm font-semibold text-gray-900 mb-2">
              Nama <span class="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Masukkan nama Anda"
              class="w-full px-4 sm:px-5 py-3 sm:py-4 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all duration-200 font-poppins"
            />
          </div>
          <div class="mb-5 sm:mb-7">
            <label class="block text-sm font-semibold text-gray-900 mb-2">
              Kritik &amp; Saran <span class="text-red-600">*</span>
            </label>
            <textarea
              placeholder="Tulis kritik dan saran Anda di sini..."
              rows="5"
              class="w-full px-4 sm:px-5 py-3 sm:py-4 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all duration-200 resize-y font-poppins"
            ></textarea>
          </div>
          <button
            class="w-full flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 rounded-full text-white font-semibold text-sm sm:text-base border-none cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
            style="background: linear-gradient(135deg, #8B0000, #DC143C);"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            Kirim Kritik &amp; Saran
          </button>
        </div>
      </div>
    </section>

    <!-- ===== FOOTER ===== -->
    <footer class="py-10 sm:py-12 px-5 sm:px-8" style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);">
      <div class="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between mb-6 sm:mb-8 gap-6 sm:gap-8">
        <div>
          <h3 class="text-lg sm:text-xl font-bold text-red-500 mb-2 sm:mb-3">SDN Sukapura 01</h3>
          <p class="text-gray-400 text-xs sm:text-sm leading-relaxed">Jl. Beo No.15, Komplek Walikota</p>
          <p class="text-gray-400 text-xs sm:text-sm">Kelurahan Sukapura, Kecamatan Cilincing</p>
          <p class="text-gray-400 text-xs sm:text-sm">Jakarta Utara</p>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Media Sosial</h4>
          <div class="flex gap-3 sm:gap-4">
            <a href="#" class="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white text-lg sm:text-xl transition-all duration-300 hover:-translate-y-1 hover:bg-red-600" style="background: rgba(220,20,60,0.2);">
              <i class="fab fa-youtube"></i>
            </a>
            <a href="#" class="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white text-lg sm:text-xl transition-all duration-300 hover:-translate-y-1 hover:bg-red-600" style="background: rgba(220,20,60,0.2);">
              <i class="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
      <div class="border-t border-white/10 pt-5 sm:pt-7 text-center text-gray-400 text-xs sm:text-sm">
        <p>&copy; 2025 SDN Sukapura 01. All Rights Reserved.</p>
        <p class="mt-1">Handcrafted and made with <span class="text-red-500 animate-pulse">&hearts;</span> by Syahira Isnaeni Dewi</p>
      </div>
    </footer>

    <!-- Back to Top -->
    <Transition name="fade">
      <button
        v-show="scrolled"
        @click="scrollToTop"
        class="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 w-11 h-11 sm:w-12 sm:h-12 rounded-full text-white border-none cursor-pointer flex items-center justify-center shadow-xl z-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
        style="background: linear-gradient(135deg, #8B0000, #DC143C);"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/></svg>
      </button>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue'

/* ── STATE ── */
const mobileMenuOpen = ref(false)
const mobileSubMenu = ref('')
const scrolled = ref(false)
const currentSlide = ref(0)
const statsVisible = ref(false)
const statsSection = ref(null)
const animatedStats = reactive([0, 0, 0, 0, 0])

/* ── HERO SLIDES ── */
const heroSlides = [
  { image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&q=80', title: 'Kegiatan Sekolah' },
  { image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80', title: 'Prestasi Siswa' },
  { image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80', title: 'Pembelajaran' },
]

/* ── DUMMY DATA ── */
const statsData = [
  { icon: 'fas fa-users', value: 412, label: 'Jumlah Siswa' },
  { icon: 'fas fa-chalkboard-teacher', value: 18, label: 'Jumlah Pendidik' },
  { icon: 'fas fa-user-tie', value: 5, label: 'Jumlah Tendik' },
  { icon: 'fas fa-door-open', value: 12, label: 'Jumlah Rombel' },
  { icon: 'fas fa-trophy', value: 8, label: 'Jumlah Ekstrakurikuler' },
]

const prestasiData = [
  {
    nama: 'Ahmad Fauzi',
    juara: 'Juara 2',
    namaPrestasi: 'Olimpiade Matematika Tingkat Kecamatan 2024',
    tanggal: '15 Oktober 2024',
    foto: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80',
  },
  {
    nama: 'Siti Nurhaliza',
    juara: 'Juara 1',
    namaPrestasi: 'Lomba Cipta Puisi Tingkat Kota Jakarta Utara',
    tanggal: '3 November 2024',
    foto: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80',
  },
  {
    nama: 'Reza Pratama',
    juara: 'Juara 3',
    namaPrestasi: 'Kejuaraan Atletik Pelajar Tingkat Provinsi DKI',
    tanggal: '20 September 2024',
    foto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&q=80',
  },
]

const artikelData = [
  {
    judul: 'Peringatan Hari Pahlawan: Upacara Bendera Khidmat di SDN Sukapura 01',
    kategori: 'Kegiatan',
    tanggal: '10 November 2024',
    gambar: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80',
    deskripsi: 'SDN Sukapura 01 menggelar upacara bendera untuk memperingati Hari Pahlawan dengan penuh khidmat dan semangat nasionalisme yang tinggi.',
  },
  {
    judul: 'Program Literasi Digital: Siswa Belajar Coding Sejak Dini',
    kategori: 'Akademik',
    tanggal: '5 November 2024',
    gambar: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80',
    deskripsi: 'Dalam rangka meningkatkan literasi digital, SDN Sukapura 01 memperkenalkan program coding dasar bagi siswa kelas 4-6 bekerja sama dengan komunitas teknologi.',
  },
  {
    judul: 'Kunjungan Edukatif ke Museum Nasional Jakarta',
    kategori: 'Kegiatan',
    tanggal: '28 Oktober 2024',
    gambar: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&q=80',
    deskripsi: 'Siswa kelas 5 dan 6 mengadakan kunjungan edukatif ke Museum Nasional Jakarta sebagai bagian dari pembelajaran sejarah dan kebudayaan Indonesia.',
  },
]

const pengumumanData = [
  {
    judul: 'Pengumuman Libur Akhir Semester Ganjil Tahun Ajaran 2024/2025',
    tanggal: '12 November 2024',
    gambar: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&q=80',
    deskripsi: 'Diberitahukan kepada seluruh wali murid SDN Sukapura 01 bahwa libur akhir semester ganjil akan dilaksanakan mulai tanggal 23 Desember 2024 hingga 3 Januari 2025.',
  },
  {
    judul: 'Jadwal Penerimaan Rapor Semester Ganjil',
    tanggal: '10 November 2024',
    gambar: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&q=80',
    deskripsi: 'Penerimaan rapor semester ganjil akan dilaksanakan pada hari Sabtu, 21 Desember 2024.',
  },
  {
    judul: 'Pendaftaran Ekstrakurikuler Semester Genap Dibuka',
    tanggal: '7 November 2024',
    gambar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&q=80',
    deskripsi: 'Pendaftaran kegiatan ekstrakurikuler untuk semester genap 2024/2025 telah dibuka.',
  },
  {
    judul: 'Imunisasi Rutin untuk Siswa Kelas 1 dan 2',
    tanggal: '4 November 2024',
    gambar: 'https://images.unsplash.com/photo-1559757175-7cb057fba93a?w=400&q=80',
    deskripsi: 'Akan dilaksanakan program imunisasi rutin dari Puskesmas untuk siswa kelas 1 dan 2.',
  },
]

const galeriData = [
  {
    kegiatan: 'Peringatan Hari Kemerdekaan RI ke-79',
    gambar: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=600&q=80',
  },
  {
    kegiatan: 'Pameran Karya Seni Siswa 2024',
    gambar: 'https://images.unsplash.com/photo-1541178735493-479c1a27ed24?w=600&q=80',
  },
  {
    kegiatan: 'Pentas Seni dan Budaya Nusantara',
    gambar: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&q=80',
  },
]

const kontakData = [
  {
    icon: 'fas fa-map-marker-alt',
    label: 'Alamat',
    value: 'Jl. Beo No.15, Komp.Walikota No.2, RT.12/RW.6,\nSukapura, Kec. Cilincing, Jakarta Utara 14140',
  },
  { icon: 'fas fa-phone-alt', label: 'Telepon', value: '0821-2028-0609' },
  { icon: 'fas fa-envelope', label: 'Email', value: 'sdnsukapuraa01@gmail.com' },
  {
    icon: 'fas fa-clock',
    label: 'Jam Buka',
    value: 'Senin – Jumat: 06.30 – 15.00\nSabtu & Minggu: Tutup',
  },
]

/* ── HERO SLIDER ── */
let slideInterval = null

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % heroSlides.length
}

function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + heroSlides.length) % heroSlides.length
}

function startSlideshow() {
  slideInterval = setInterval(nextSlide, 5000)
}

/* ── SCROLL HANDLER ── */
function onScroll() {
  scrolled.value = window.scrollY > 80
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/* ── ANIMATED COUNTER ── */
function animateCounter(index, target) {
  const duration = 1500
  const steps = 40
  const increment = target / steps
  let current = 0
  let step = 0
  const timer = setInterval(() => {
    step++
    current = Math.min(Math.round(increment * step), target)
    animatedStats[index] = current
    if (step >= steps) clearInterval(timer)
  }, duration / steps)
}

/* ── SCROLL REVEAL ── */
function setupReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  )
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
}

/* ── STATS OBSERVER ── */
function setupStatsObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !statsVisible.value) {
          statsVisible.value = true
          statsData.forEach((stat, index) => {
            animateCounter(index, stat.value)
          })
        }
      })
    },
    { threshold: 0.3 }
  )
  if (statsSection.value) observer.observe(statsSection.value)
}

/* ── HELPERS ── */
function getJuaraClass(juara) {
  const j = juara.toLowerCase()
  if (j.includes('1') || j.includes('pertama')) return 'bg-yellow-400 text-yellow-900'
  if (j.includes('2') || j.includes('kedua')) return 'bg-gray-300 text-gray-800'
  if (j.includes('3') || j.includes('ketiga')) return 'bg-amber-600 text-white'
  return 'bg-blue-500 text-white'
}

function getJuaraTextClass(juara) {
  const j = juara.toLowerCase()
  if (j.includes('1') || j.includes('pertama')) return 'text-yellow-500'
  if (j.includes('2') || j.includes('kedua')) return 'text-gray-400'
  if (j.includes('3') || j.includes('ketiga')) return 'text-amber-600'
  return 'text-blue-500'
}

/* ── LIFECYCLE ── */
onMounted(() => {
  window.addEventListener('scroll', onScroll)
  startSlideshow()
  setupStatsObserver()
  // Delay reveal setup slightly so DOM is rendered
  setTimeout(setupReveal, 100)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (slideInterval) clearInterval(slideInterval)
})
</script>

<style scoped>
/* ── BOUNCE CTA ── */
@keyframes bounce-cta {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-12px); }
  60% { transform: translateY(-6px); }
}
.bounce-btn {
  animation: bounce-cta 2s infinite;
}
.bounce-btn:hover {
  animation: none;
  transform: translateY(-5px);
}

/* ── FADE IN UP ANIMATION ── */
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
.animation-delay-100 { animation-delay: 0.1s; }
.animation-delay-200 { animation-delay: 0.2s; }
.animation-delay-300 { animation-delay: 0.3s; }

/* ── SCROLL REVEAL ── */
.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
.reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* ── HERO SLIDE TRANSITION ── */
.hero-slide-enter-active,
.hero-slide-leave-active {
  transition: opacity 1s ease-in-out;
}
.hero-slide-enter-from,
.hero-slide-leave-to {
  opacity: 0;
}

/* ── MOBILE MENU TRANSITION ── */
.mobile-menu-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.mobile-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.mobile-menu-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* ── FADE TRANSITION (back-to-top) ── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ── HOVER SHADOWS ── */
.hover\:shadow-red-glow:hover {
  box-shadow: 0 20px 60px rgba(139, 0, 0, 0.25);
}
.hover\:shadow-yellow-glow:hover {
  box-shadow: 0 20px 40px rgba(255, 215, 0, 0.3);
}

/* ── ARTIKEL CARD ACCENT HOVER ── */
.artikel-card:hover .artikel-accent {
  transform: scaleX(1) !important;
}

/* ── LINE CLAMP ── */
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
.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
