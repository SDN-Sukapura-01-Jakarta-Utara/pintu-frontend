<template>
  <div class="font-poppins bg-white overflow-x-hidden">

    <!-- ===== NAVBAR ===== -->
    <PublicNavbar />

    <!-- ===== HERO / JUMBOTRON ===== -->
    <section class="relative h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-hidden">
      <!-- Slides -->
      <div v-if="publicHomeStore.isLoading" class="absolute inset-0 flex items-center justify-center bg-gray-900">
        <div class="text-white text-center">
          <i class="fas fa-spinner fa-spin text-4xl mb-4"></i>
          <p>Memuat...</p>
        </div>
      </div>
      <TransitionGroup v-else name="hero-slide">
        <div v-for="(slide, i) in heroSlides" :key="i" v-show="currentSlide === i" class="absolute inset-0">
          <img :src="slide.image" :alt="slide.title" class="w-full h-full object-cover hero-zoom" />
        </div>
      </TransitionGroup>

      <!-- Multi-layer overlays -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/20"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>
      <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 1px); background-size: 50px 50px;"></div>

      <!-- Floating decorative shapes -->
      <div class="absolute top-20 right-[10%] w-32 sm:w-48 h-32 sm:h-48 rounded-full opacity-10 hero-float" style="background: radial-gradient(circle, #FFD700, transparent 70%);"></div>
      <div class="absolute bottom-32 right-[20%] w-20 sm:w-28 h-20 sm:h-28 rounded-full opacity-10 hero-float-delayed" style="background: radial-gradient(circle, #DC143C, transparent 70%);"></div>
      <div class="absolute top-[40%] right-[5%] w-16 h-16 rounded-full opacity-10 hero-float" style="background: radial-gradient(circle, white, transparent 70%);"></div>

      <!-- Left accent bar -->
      <div class="absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 z-10" style="background: linear-gradient(to bottom, transparent, #FFD700, #DC143C, transparent);"></div>

      <!-- Content -->
      <div class="absolute inset-0 flex items-center">
        <div class="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div class="max-w-xl lg:max-w-2xl">
            <p class="text-yellow-400 font-semibold text-xs sm:text-sm uppercase tracking-[0.25em] mb-3 sm:mb-4 animate-fadeInUp flex items-center gap-2">
              <span class="w-6 sm:w-8 h-[2px] bg-yellow-400 inline-block"></span>
              Selamat Datang di
            </p>
            <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight animate-fadeInUp animation-delay-100">
              SDN Sukapura <span class="hero-title-highlight">01</span>
            </h1>
            <p class="text-sm sm:text-base md:text-lg lg:text-xl text-white/85 leading-relaxed mb-6 sm:mb-8 animate-fadeInUp animation-delay-200 max-w-lg">
              Sambut masa depan gemilang dengan berakhlak, berilmu, berkarya dan berprestasi
            </p>
            <div class="flex flex-wrap items-center gap-2 sm:gap-4 animate-fadeInUp animation-delay-300">
              <a v-if="aplikasiJumbotron" :href="aplikasiJumbotron.link" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-8 py-2 sm:py-4 rounded-full font-bold text-xs sm:text-base text-gray-900 bounce-btn" style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); box-shadow: 0 10px 30px rgba(255,215,0,0.4);">
                <i class="fas fa-arrow-right"></i> {{ aplikasiJumbotron.nama }}
              </a>
              <button @click="scrollToAbout" class="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-2 sm:py-4 rounded-full font-semibold text-xs sm:text-base text-white border-2 border-white/30 hover:bg-white/10 hover:border-white/50 transition-all duration-300 cursor-pointer bg-transparent">
                <i class="fas fa-info-circle"></i> Tentang Kami
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom indicators + arrows -->
      <div class="absolute bottom-6 sm:bottom-8 left-0 right-0 px-5 sm:px-8">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <!-- Left arrows -->
          <div class="flex items-center gap-2">
            <button @click="prevSlide" class="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 cursor-pointer flex items-center justify-center hover:bg-white/25 hover:border-yellow-400/50 transition-all duration-300">
              <i class="fas fa-chevron-left text-xs sm:text-sm"></i>
            </button>
            <button @click="nextSlide" class="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 cursor-pointer flex items-center justify-center hover:bg-white/25 hover:border-yellow-400/50 transition-all duration-300">
              <i class="fas fa-chevron-right text-xs sm:text-sm"></i>
            </button>
          </div>
          <!-- Indicators -->
          <div class="flex gap-2 sm:gap-3">
            <button v-for="(_, i) in heroSlides" :key="i" @click="currentSlide = i" class="group/dot flex items-center gap-2 border-none cursor-pointer bg-transparent p-0">
              <span class="h-1 sm:h-1.5 rounded-full transition-all duration-500" :class="currentSlide === i ? 'bg-yellow-400 w-8 sm:w-12' : 'bg-white/40 w-4 sm:w-6 group-hover/dot:bg-white/70'"></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Bottom curve -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" class="w-full h-6 sm:h-8 block">
          <path fill="white" fill-opacity="0.03" d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z"></path>
        </svg>
      </div>
    </section>

    <!-- ===== ABOUT SECTION ===== -->
    <section id="about" class="relative py-16 sm:py-24 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-red-50">
      <!-- Decorative blobs -->
      <div class="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 -translate-y-1/3 translate-x-1/3" style="background: radial-gradient(circle, #DC143C, transparent 70%);"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-5 translate-y-1/3 -translate-x-1/3" style="background: radial-gradient(circle, #8B0000, transparent 70%);"></div>

      <div class="max-w-6xl mx-auto px-5 sm:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <!-- Image side -->
          <div class="relative reveal">
            <div class="relative rounded-3xl overflow-hidden shadow-2xl">
              <img src="~/assets/images/tentang-sekolah.png" alt="SDN Sukapura 01" class="w-full h-64 sm:h-80 lg:h-96 object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-red-900/40 to-transparent"></div>
            </div>
            <!-- Floating badge -->
            <div class="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-white rounded-2xl shadow-xl p-4 sm:p-5 flex items-center gap-3 border-l-4 border-red-600">
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white text-lg" style="background: linear-gradient(135deg, #8B0000, #DC143C);">
                <i class="fas fa-award"></i>
              </div>
              <div>
                <div class="text-lg sm:text-xl font-bold text-gray-900">Akreditasi A</div>
                <div class="text-xs text-gray-500">Sekolah Unggulan</div>
              </div>
            </div>
            <!-- Decorative dots -->
            <div class="absolute -top-4 -left-4 grid grid-cols-4 gap-1.5 opacity-30">
              <span v-for="n in 16" :key="n" class="w-2 h-2 rounded-full bg-red-400"></span>
            </div>
          </div>

          <!-- Text side -->
          <div class="reveal">
            <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-red-700 bg-red-100 mb-4">
              <i class="fas fa-school"></i> Tentang Kami
            </span>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-5 sm:mb-6 leading-tight">
              Membangun Generasi <span class="text-red-700">Berkarakter</span> dan <span class="text-red-700">Berprestasi</span>
            </h2>
            <p class="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
              SDN Sukapura 01 merupakan lembaga pendidikan dasar yang berlokasi di Jl. Beo No.15, Komplek Walikota,
              Kelurahan Sukapura, Kecamatan Cilincing, Jakarta Utara. Sekolah kami berkomitmen untuk mewujudkan
              generasi yang berakhlak mulia, cerdas, dan unggul dalam prestasi.
            </p>
            <p class="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
              Melalui sistem pembelajaran yang menanamkan nilai-nilai akhlak mulia, kami memfasilitasi peserta didik
              untuk berkembang secara optimal baik dalam bidang akademik maupun non-akademik.
            </p>
            <!-- Feature pills -->
            <div class="grid grid-cols-2 gap-3 sm:gap-4">
              <div v-for="feature in aboutFeatures" :key="feature.text" class="flex items-center gap-3 bg-white rounded-xl p-3 sm:p-4 shadow-md border border-gray-100 hover:border-red-200 hover:shadow-lg transition-all duration-300">
                <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white text-sm flex-shrink-0" :style="{ background: feature.color }">
                  <i :class="feature.icon"></i>
                </div>
                <span class="text-xs sm:text-sm font-medium text-gray-700">{{ feature.text }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== WAVE DIVIDER ===== -->
    <div class="wave-divider-dark">
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" class="w-full h-12 sm:h-16 block"><path fill="#1a1a1a" d="M0,40 C360,100 720,0 1080,60 C1260,90 1380,50 1440,40 L1440,100 L0,100 Z"></path></svg>
    </div>

    <!-- ===== STATS SECTION ===== -->
    <section ref="statsSection" class="relative py-14 sm:py-20 px-5 sm:px-8 overflow-hidden" style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);">
      <!-- Decorative pattern -->
      <div class="absolute inset-0 opacity-5" style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 1px); background-size: 40px 40px;"></div>
      <div class="absolute top-10 right-10 w-40 h-40 rounded-full opacity-10" style="background: radial-gradient(circle, #FFD700, transparent 70%);"></div>
      <div class="absolute bottom-10 left-10 w-56 h-56 rounded-full opacity-5" style="background: radial-gradient(circle, #FFA500, transparent 70%);"></div>

      <div class="max-w-6xl mx-auto relative">
        <div class="text-center mb-10 sm:mb-14 reveal">
          <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-yellow-300 bg-yellow-400/10 border border-yellow-400/20 mb-4">
            <i class="fas fa-chart-bar"></i> Statistik
          </span>
          <h2 class="text-2xl sm:text-4xl font-bold text-white">
            Data <span class="text-yellow-400">Sekolah</span>
          </h2>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          <div
            v-for="(stat, index) in statsData"
            :key="stat.label"
            class="group relative rounded-2xl p-5 sm:p-8 text-center border border-yellow-400/20 transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400/50 cursor-default reveal overflow-hidden"
            style="background: linear-gradient(145deg, rgba(255,215,0,0.08) 0%, rgba(255,165,0,0.04) 100%);"
            :style="{ transitionDelay: `${index * 100}ms` }"
          >
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style="background: linear-gradient(145deg, rgba(255,215,0,0.15) 0%, rgba(255,165,0,0.05) 100%);"></div>
            <div class="relative">
              <div class="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-5 rounded-2xl flex items-center justify-center text-xl sm:text-2xl text-yellow-400 bg-yellow-400/10 group-hover:bg-yellow-400/20 group-hover:scale-110 transition-all duration-300">
                <i :class="stat.icon"></i>
              </div>
              <div class="text-2xl sm:text-4xl font-bold text-yellow-400 mb-1 sm:mb-2">{{ statsVisible ? animatedStats[index] : 0 }}</div>
              <div class="text-[10px] sm:text-xs text-gray-400 font-medium leading-snug uppercase tracking-wide">{{ stat.label }}</div>
            </div>
          </div>
        </div>

        <!-- Identitas Sekolah -->
        <div class="mt-12 sm:mt-16 reveal">
          <div class="bg-gradient-to-br from-yellow-50/10 to-white/5 rounded-3xl border border-yellow-400/20 p-6 sm:p-10">
            <h3 class="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8 text-center">
              <i class="fas fa-school text-yellow-400 mr-2"></i>
              Identitas Sekolah
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div
                v-for="(item, index) in identitasSekolah"
                :key="item.label"
                class="group flex items-start gap-3 sm:gap-4 bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-white/10 hover:border-yellow-400/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-yellow-400 bg-yellow-400/10 group-hover:bg-yellow-400/20 group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                  <i :class="item.icon" class="text-base sm:text-lg"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-[10px] sm:text-xs font-semibold text-yellow-400/70 uppercase tracking-wider mb-1">{{ item.label }}</div>
                  <div class="text-sm sm:text-base text-white font-medium break-words">{{ item.value }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== WAVE DIVIDER ===== -->
    <div class="wave-divider-light">
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" class="w-full h-12 sm:h-16 block"><path fill="#1a1a1a" d="M0,60 C360,0 720,100 1080,40 C1260,10 1380,50 1440,60 L1440,0 L0,0 Z"></path></svg>
    </div>

    <!-- ===== PRESTASI SECTION ===== -->
    <section class="relative py-12 sm:py-16 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-red-50/30">
      <!-- Decorative Background -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <div class="absolute top-20 left-10 w-64 h-64 bg-red-500 rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 right-10 w-80 h-80 bg-yellow-500 rounded-full blur-3xl"></div>
      </div>

      <div class="relative">
        <!-- Header -->
        <div class="text-center mb-0 reveal px-5 sm:px-8">
          <div class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-yellow-100 via-red-50 to-red-100 border-2 border-red-200 mb-3 sm:mb-4 shadow-sm">
            <i class="fas fa-trophy text-yellow-600 text-lg"></i>
            <span class="text-sm font-bold bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">Prestasi Gemilang</span>
          </div>
          <h2 class="text-2xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-1.5">
            <span class="bg-gradient-to-r from-red-600 via-red-500 to-yellow-500 bg-clip-text text-transparent">Juara</span> Kebanggaan Kami
          </h2>
          <p class="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Pencapaian luar biasa siswa-siswi SDN Sukapura 01 yang membanggakan
          </p>
        </div>

        <!-- Full Width Carousel -->
        <div v-if="prestasiData && prestasiData.length > 0" class="reveal mt-0">
          <!-- Cards Container - Full Width -->
          <div class="relative h-[550px] sm:h-[650px] overflow-hidden">
            <div class="absolute inset-0 flex items-center justify-center">
              <!-- Card Wrapper for Positioning -->
              <div 
                v-for="(item, index) in visiblePrestasiCards" 
                :key="`card-${item.id || item.originalIndex}`"
                @click="handleCardClick(item.position)"
                class="absolute cursor-pointer will-change-transform"
                :style="getCardStyleFullWidth(item.position)"
              >
                  <!-- Card Content -->
                  <div 
                    class="relative overflow-hidden rounded-3xl transition-all duration-700 ease-out group/card shadow-2xl"
                    :class="[
                      item.position === 'center' ? 'w-72 sm:w-96 md:w-[450px]' : 'w-56 sm:w-72 md:w-80',
                      'prestasi-card-slide'
                    ]"
                    style="background: linear-gradient(145deg, #ffffff 0%, #fafafa 100%);"
                  >
                  <!-- Gradient Border Effect -->
                  <div 
                    class="absolute inset-0 rounded-3xl p-[3px] transition-all duration-700"
                    :style="item.position === 'center' 
                      ? 'background: linear-gradient(135deg, #FFD700 0%, #FF6B6B 50%, #DC143C 100%);' 
                      : 'background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);'"
                  >
                    <div 
                      class="h-full w-full rounded-3xl"
                      style="background: linear-gradient(145deg, #ffffff 0%, #f9fafb 100%);"
                    ></div>
                  </div>

                  <!-- Card Content -->
                  <div class="relative z-10">
                    <!-- Image -->
                    <div 
                      class="relative overflow-hidden rounded-t-3xl"
                      :class="item.position === 'center' ? 'h-72 sm:h-96' : 'h-56 sm:h-64'"
                    >
                      <img 
                        :src="item.foto" 
                        :alt="item.nama"
                        class="w-full h-full object-cover transition-transform duration-700"
                        :class="item.position === 'center' ? 'group-hover/card:scale-110' : ''"
                      />
                      <!-- Gradient Overlay -->
                      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                      
                      <!-- Shine Effect on Center Card -->
                      <div 
                        v-if="item.position === 'center'"
                        class="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none"
                        style="background: linear-gradient(135deg, transparent 0%, rgba(255,215,0,0.3) 50%, transparent 100%);"
                      ></div>
                      
                      <!-- Badge Juara -->
                      <div 
                        class="absolute top-4 right-4 flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold shadow-2xl backdrop-blur-md border-2 transition-all duration-300"
                        :class="[
                          getJuaraClass(item.juara),
                          item.position === 'center' ? 'text-sm scale-100' : 'text-xs scale-90',
                          item.position === 'center' ? 'hover:scale-105' : ''
                        ]"
                      >
                        <i class="fas fa-trophy"></i>
                        <span>{{ item.juara }}</span>
                      </div>

                      <!-- Overlay Info (Only Center) -->
                      <div 
                        v-if="item.position === 'center'"
                        class="absolute bottom-0 left-0 right-0 p-6"
                      >
                        <div class="flex flex-wrap items-center gap-2">
                          <span class="px-3 py-2 rounded-xl bg-gradient-to-r from-red-600/90 to-red-500/90 backdrop-blur-md text-white text-xs font-bold border border-white/40 shadow-lg">
                            <i class="fas fa-medal mr-1.5"></i>{{ item.tingkatPrestasi || 'Tingkat Kota' }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Content -->
                    <div 
                      class="p-4 sm:p-5 md:p-6 rounded-b-3xl"
                      :class="item.position === 'center' ? '' : 'opacity-70'"
                      style="background: linear-gradient(to bottom, #ffffff 0%, #fafafa 100%);"
                    >
                      <!-- Title with Icon -->
                      <div class="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div 
                          class="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md"
                          :class="item.position === 'center' ? 'bg-gradient-to-br from-red-600 to-red-500 text-white shadow-red-500/30' : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-500'"
                        >
                          <i class="fas fa-user-graduate text-sm sm:text-base"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                          <h3 
                            class="font-bold text-gray-900 mb-1 sm:mb-1.5 transition-colors leading-tight"
                            :class="[
                              item.position === 'center' ? 'text-base sm:text-lg md:text-xl line-clamp-2' : 'text-xs sm:text-sm line-clamp-1',
                              item.position === 'center' ? 'group-hover/card:text-red-600' : ''
                            ]"
                          >
                            {{ item.nama }}
                          </h3>
                          <p 
                            class="text-gray-600 leading-relaxed mb-1.5 sm:mb-2"
                            :class="item.position === 'center' ? 'text-xs sm:text-sm line-clamp-2' : 'text-[10px] sm:text-xs line-clamp-2'"
                          >
                            {{ item.namaPrestasi }}
                          </p>
                          <!-- Tanggal dan Tingkat -->
                          <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
                            <span 
                              class="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-semibold"
                              :class="item.position === 'center' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'"
                            >
                              <i class="far fa-calendar text-[8px] sm:text-[10px]"></i>
                              <span>{{ item.tanggal }}</span>
                            </span>
                            <span 
                              v-if="item.position === 'center' && item.tingkatPrestasi"
                              class="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-yellow-100 text-yellow-700 text-[10px] sm:text-xs font-semibold"
                            >
                              <i class="fas fa-medal text-[8px] sm:text-[10px]"></i>
                              <span>{{ item.tingkatPrestasi }}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Divider (Only Center with Team Button) -->
                      <div 
                        v-if="item.position === 'center' && item.jenis === 'Tim' && item.anggotaTim && item.anggotaTim.length > 0"
                        class="h-[2px] bg-gradient-to-r from-transparent via-red-300 to-transparent mb-4"
                      ></div>
                      
                      <!-- Button Anggota Tim (Only Center) -->
                      <button 
                        v-if="item.position === 'center' && item.jenis === 'Tim' && item.anggotaTim && item.anggotaTim.length > 0"
                        @click.stop="openTeamModal(item)"
                        class="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-700 hover:via-red-600 hover:to-red-700 text-white text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 border-none cursor-pointer"
                      >
                        <i class="fas fa-users"></i>
                        <span>Lihat Anggota Tim</span>
                        <i class="fas fa-arrow-right text-xs ml-1"></i>
                      </button>
                    </div>
                  </div>
                  </div>
                </div>
            </div>
          </div>

          <!-- Navigation Arrows -->
          <div class="flex justify-center items-center gap-3 sm:gap-4 mt-0 reveal">
            <button @click="prevPrestasi" class="w-10 h-10 sm:w-12 sm:h-12 rounded-full text-white border-none cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-md" style="background: linear-gradient(135deg, #8B0000, #DC143C);">
              <i class="fas fa-chevron-left text-xs sm:text-sm"></i>
            </button>
            <button @click="$router.push('/media-publikasi/prestasi-siswa')" class="group/btn inline-flex items-center gap-2 px-7 sm:px-9 py-3 sm:py-4 rounded-full text-white font-semibold text-sm sm:text-base border-none cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl" style="background: linear-gradient(135deg, #8B0000, #DC143C);">
              Lihat Semua Prestasi
              <i class="fas fa-arrow-right text-sm transition-transform duration-300 group-hover/btn:translate-x-1"></i>
            </button>
            <button @click="nextPrestasi" class="w-10 h-10 sm:w-12 sm:h-12 rounded-full text-white border-none cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-md" style="background: linear-gradient(135deg, #8B0000, #DC143C);">
              <i class="fas fa-chevron-right text-xs sm:text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== ARTIKEL SECTION ===== -->
    <section class="relative py-16 sm:py-24 overflow-hidden" style="background: linear-gradient(180deg, #FFF5F5 0%, #FFF 50%, #FFFBF5 100%);">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-[0.03]" style="background: radial-gradient(circle, #DC143C, transparent 70%);"></div>

      <div class="max-w-6xl mx-auto px-5 sm:px-8 relative">
        <div class="text-center mb-10 sm:mb-14 reveal">
          <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-red-700 bg-red-100 mb-4">
            <i class="fas fa-newspaper"></i> Berita
          </span>
          <h2 class="text-2xl sm:text-4xl font-bold text-gray-900">
            Artikel <span class="text-red-700">Terbaru</span>
          </h2>
          <p class="text-gray-500 mt-3 sm:mt-4 text-sm sm:text-base max-w-lg mx-auto">Berita dan informasi terkini dari SDN Sukapura 01</p>
        </div>

        <!-- Carousel wrapper -->
        <div class="relative reveal">
          <div class="overflow-hidden">
            <div 
              ref="artikelTrack"
              class="flex gap-6 sm:gap-8 transition-transform duration-500 ease-out"
              :style="{ transform: `translateX(-${currentArtikel * (100 / 3)}%)` }"
            >
              <!-- Duplicate articles for infinite loop -->
              <div 
                v-for="(artikel, index) in [...artikelData, ...artikelData]" 
                :key="'artikel-' + index"
                @click="$router.push('/media-publikasi/artikel/' + artikel.id)"
                class="group artikel-card bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer transition-all duration-400 relative hover:-translate-y-3 border border-gray-100 hover:border-red-200 flex-shrink-0"
                :style="{ width: 'calc((100% - 2rem) / 3)' }"
              >
                <div class="artikel-accent absolute top-0 left-0 right-0 h-1 scale-x-0 origin-left transition-transform duration-400 z-10" style="background: linear-gradient(90deg, #8B0000, #DC143C, #FF6B6B);" />
                <div class="relative h-44 sm:h-52 overflow-hidden">
                  <img :src="artikel.gambar" :alt="artikel.judul" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span class="absolute top-3 right-3 sm:top-4 sm:right-4 text-white text-[10px] sm:text-xs font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full uppercase tracking-wide shadow-lg" style="background: linear-gradient(135deg, #8B0000, #DC143C);">
                    <i class="fas fa-tag mr-1"></i> {{ artikel.kategori }}
                  </span>
                </div>
                <div class="p-4 sm:p-6">
                  <div class="flex items-center gap-3 text-xs text-gray-400 mb-2 sm:mb-3">
                    <span class="flex items-center gap-1.5">
                      <i class="far fa-calendar-alt text-red-400"></i>
                      {{ artikel.tanggal }}
                    </span>
                    <span v-if="artikel.penulis" class="flex items-center gap-1.5">
                      <i class="fas fa-user-edit text-red-400"></i>
                      {{ artikel.penulis }}
                    </span>
                  </div>
                  <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2 leading-snug line-clamp-2 transition-colors group-hover:text-red-600">{{ artikel.judul }}</h3>
                  <p class="text-xs sm:text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4">{{ artikel.deskripsi }}</p>
                  <span class="inline-flex items-center gap-1 text-xs font-semibold text-red-600 group-hover:gap-2 transition-all duration-300">
                    Baca Selengkapnya <i class="fas fa-arrow-right text-[10px]"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center items-center gap-3 sm:gap-4 mt-10 sm:mt-12 reveal">
          <button @click="prevArtikel" class="w-10 h-10 sm:w-12 sm:h-12 rounded-full text-white border-none cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-md" style="background: linear-gradient(135deg, #8B0000, #DC143C);">
            <i class="fas fa-chevron-left text-xs sm:text-sm"></i>
          </button>
          <button @click="$router.push('/media-publikasi/artikel')" class="group/btn inline-flex items-center gap-2 px-7 sm:px-9 py-3 sm:py-4 rounded-full text-white font-semibold text-sm sm:text-base border-none cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl" style="background: linear-gradient(135deg, #8B0000, #DC143C);">
            Lihat Semua Artikel
            <i class="fas fa-arrow-right text-sm transition-transform duration-300 group-hover/btn:translate-x-1"></i>
          </button>
          <button @click="nextArtikel" class="w-10 h-10 sm:w-12 sm:h-12 rounded-full text-white border-none cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-md" style="background: linear-gradient(135deg, #8B0000, #DC143C);">
            <i class="fas fa-chevron-right text-xs sm:text-sm"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- ===== WAVE DIVIDER ===== -->
    <div class="wave-divider-dark">
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" class="w-full h-12 sm:h-16 block"><path fill="#1a1a1a" d="M0,30 C240,90 480,10 720,50 C960,90 1200,20 1440,40 L1440,100 L0,100 Z"></path></svg>
    </div>

    <!-- ===== PENGUMUMAN SECTION ===== -->
    <section class="relative py-14 sm:py-20 px-5 sm:px-8 overflow-hidden" style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);">
      <div class="absolute inset-0 opacity-5" style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 1px); background-size: 40px 40px;"></div>
      <div class="absolute top-20 left-10 w-48 h-48 rounded-full opacity-10" style="background: radial-gradient(circle, #FFD700, transparent 70%);"></div>

      <div class="max-w-6xl mx-auto relative">
        <div class="text-center mb-10 sm:mb-14 reveal">
          <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-yellow-300 bg-yellow-400/10 border border-yellow-400/20 mb-4">
            <i class="fas fa-bullhorn"></i> Informasi
          </span>
          <h2 class="text-2xl sm:text-4xl font-bold text-white">
            Pengumuman <span class="text-yellow-400">Terbaru</span>
          </h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-7 lg:items-stretch">
          <!-- Card Besar (Kiri) -->
          <div @click="$router.push('/media-publikasi/pengumuman/' + pengumumanLatest.id)" class="group bg-white rounded-2xl overflow-hidden border-2 border-yellow-400/20 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400/50 reveal flex flex-col">
            <div class="relative h-52 lg:h-64 overflow-hidden flex-shrink-0">
              <img :src="pengumumanLatest.gambar" :alt="pengumumanLatest.judul" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <span class="absolute top-3 left-3 sm:top-4 sm:left-4 text-gray-900 text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full uppercase tracking-wide shadow-lg" style="background: linear-gradient(135deg, #FFD700, #FFA500);">
                <i class="fas fa-bullhorn mr-1"></i> PENGUMUMAN
              </span>
            </div>
            <div class="p-4 sm:p-6 flex-1 flex flex-col">
              <div class="flex items-center gap-3 text-xs text-red-500 mb-2 sm:mb-3">
                <span class="flex items-center gap-1.5">
                  <i class="far fa-calendar-alt"></i> {{ pengumumanLatest.tanggal }}
                </span>
                <span v-if="pengumumanLatest.penulis" class="flex items-center gap-1.5">
                  <i class="fas fa-user-edit"></i> {{ pengumumanLatest.penulis }}
                </span>
              </div>
              <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-red-600 transition-colors">{{ pengumumanLatest.judul }}</h3>
              <p class="text-xs sm:text-sm text-gray-500 leading-relaxed line-clamp-3 mb-3 flex-1">{{ pengumumanLatest.deskripsi }}</p>
              <span class="inline-flex items-center gap-1 text-xs font-semibold text-red-600 group-hover:gap-2 transition-all duration-300">
                Baca Selengkapnya <i class="fas fa-arrow-right text-[10px]"></i>
              </span>
            </div>
          </div>

          <!-- Cards Kecil (Kanan) -->
          <div class="flex flex-col gap-4 sm:gap-5 lg:h-full">
            <div
              v-for="(item, index) in pengumumanData"
              :key="item.id || index"
              @click="$router.push('/media-publikasi/pengumuman/' + item.id)"
              class="group bg-white rounded-2xl overflow-hidden border-2 border-yellow-400/20 cursor-pointer flex flex-row transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/50 reveal lg:flex-1"
              :style="{ transitionDelay: `${index * 100}ms` }"
            >
              <div class="relative w-28 sm:w-32 lg:w-36 min-w-28 sm:min-w-32 lg:min-w-36 h-28 sm:h-32 lg:h-full overflow-hidden flex-shrink-0">
                <img :src="item.gambar" :alt="item.judul" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div class="absolute inset-0 bg-gradient-to-r from-transparent to-black/10"></div>
              </div>
              <div class="p-3 sm:p-4 flex flex-col justify-center min-w-0">
                <div class="flex items-center gap-2 text-[10px] sm:text-xs text-red-500 mb-1.5">
                  <span class="flex items-center gap-1">
                    <i class="far fa-calendar-alt"></i> {{ item.tanggal }}
                  </span>
                  <span v-if="item.penulis" class="flex items-center gap-1">
                    <i class="fas fa-user-edit"></i> {{ item.penulis }}
                  </span>
                </div>
                <h3 class="text-xs sm:text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">{{ item.judul }}</h3>
                <p class="text-[10px] sm:text-xs text-gray-500 leading-relaxed line-clamp-2 mt-1 sm:mt-1.5">{{ item.deskripsi }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center mt-10 sm:mt-12 reveal">
          <button @click="$router.push('/media-publikasi/pengumuman')" class="group/btn inline-flex items-center gap-2 px-8 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base text-gray-900 border-none cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl" style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);">
            Lihat Semua Pengumuman
            <i class="fas fa-arrow-right text-sm transition-transform duration-300 group-hover/btn:translate-x-1"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- ===== WAVE DIVIDER ===== -->
    <div class="wave-divider-light">
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" class="w-full h-12 sm:h-16 block"><path fill="#1a1a1a" d="M0,50 C360,0 720,80 1080,30 C1260,10 1380,50 1440,50 L1440,0 L0,0 Z"></path></svg>
    </div>

    <!-- ===== GALERI SECTION ===== -->
    <section class="relative py-16 sm:py-24 overflow-hidden bg-gradient-to-br from-white via-red-50/20 to-white">
      <div class="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-5" style="background: radial-gradient(circle, #DC143C, transparent 70%);"></div>

      <div class="max-w-6xl mx-auto px-5 sm:px-8 relative">
        <div class="text-center mb-10 sm:mb-14 reveal">
          <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-red-700 bg-red-100 mb-4">
            <i class="fas fa-images"></i> Dokumentasi
          </span>
          <h2 class="text-2xl sm:text-4xl font-bold text-gray-900">
            Galeri <span class="text-red-700">Kegiatan</span>
          </h2>
          <p class="text-gray-500 mt-3 sm:mt-4 text-sm sm:text-base max-w-lg mx-auto">Dokumentasi kegiatan dan prestasi SDN Sukapura 01</p>
        </div>
      </div>

      <!-- Marquee auto-scroll (full width) -->
      <div ref="galeriWrapper" class="galeri-marquee-wrapper overflow-hidden reveal py-2" @mouseenter="pauseGaleri" @mouseleave="resumeGaleri">
        <div ref="galeriTrack" class="galeri-marquee flex gap-5 sm:gap-6">
          <div
            v-for="(galeri, index) in [...galeriData, ...galeriData]"
            :key="index"
            @click="$router.push('/media-publikasi/galeri-kegiatan/' + galeri.id)"
            class="group relative rounded-2xl overflow-hidden h-60 sm:h-72 lg:h-80 cursor-pointer shadow-lg transition-all duration-400 hover:-translate-y-3 border-2 border-transparent hover:border-red-300 flex-shrink-0 w-72 sm:w-80 lg:w-96"
          >
            <img :src="galeri.gambar" :alt="galeri.kegiatan" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-400" style="background: linear-gradient(to top, rgba(139,0,0,0.9) 0%, rgba(220,20,60,0.6) 40%, transparent 100%);"></div>
            <div class="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
              <h3 class="text-white font-bold text-sm sm:text-base leading-snug drop-shadow-lg">{{ galeri.kegiatan }}</h3>
              <p v-if="galeri.tanggal" class="text-white/80 text-xs sm:text-sm mt-1 drop-shadow-md flex items-center gap-1.5">
                <i class="far fa-calendar-alt text-xs"></i>
                {{ galeri.tanggal }}
              </p>
            </div>
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-4 group-hover:translate-y-0">
              <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-lg border border-white/30">
                <i class="fas fa-search-plus"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center items-center gap-3 sm:gap-4 mt-10 sm:mt-12 reveal">
        <button @click="scrollGaleri('left')" class="w-10 h-10 sm:w-12 sm:h-12 rounded-full text-white border-none cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-md" style="background: linear-gradient(135deg, #8B0000, #DC143C);">
          <i class="fas fa-chevron-left text-xs sm:text-sm"></i>
        </button>
        <button @click="$router.push('/media-publikasi/galeri-kegiatan')" class="group/btn inline-flex items-center gap-2 px-7 sm:px-9 py-3 sm:py-4 rounded-full text-white font-semibold text-sm sm:text-base border-none cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl" style="background: linear-gradient(135deg, #8B0000, #DC143C);">
          Lihat Semua Galeri
          <i class="fas fa-arrow-right text-sm transition-transform duration-300 group-hover/btn:translate-x-1"></i>
        </button>
        <button @click="scrollGaleri('right')" class="w-10 h-10 sm:w-12 sm:h-12 rounded-full text-white border-none cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-md" style="background: linear-gradient(135deg, #8B0000, #DC143C);">
          <i class="fas fa-chevron-right text-xs sm:text-sm"></i>
        </button>
      </div>
    </section>

    <!-- ===== KONTAK SECTION ===== -->
    <section class="relative py-16 sm:py-24 overflow-hidden" style="background: linear-gradient(180deg, #FFFBF5 0%, #FFF5F5 50%, #FFF 100%);">
      <div class="absolute top-0 right-0 w-80 h-80 rounded-full opacity-5" style="background: radial-gradient(circle, #8B0000, transparent 70%);"></div>

      <div class="max-w-6xl mx-auto px-5 sm:px-8 relative">
        <div class="text-center mb-10 sm:mb-14 reveal">
          <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-red-700 bg-red-100 mb-4">
            <i class="fas fa-headset"></i> Hubungi Kami
          </span>
          <h2 class="text-2xl sm:text-4xl font-bold text-gray-900">
            Kontak <span class="text-red-700">Kami</span>
          </h2>
          <p class="text-gray-500 mt-3 sm:mt-4 text-sm sm:text-base max-w-lg mx-auto">Hubungi kami untuk informasi lebih lanjut</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-stretch">
          <!-- Info Kontak -->
          <div class="space-y-4 sm:space-y-5 reveal flex flex-col">
            <div v-for="(kontak, index) in kontakData" :key="kontak.label"
              class="group flex items-start gap-4 sm:gap-5 bg-white rounded-2xl p-4 sm:p-6 shadow-md border border-gray-100 hover:border-red-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              :style="{ transitionDelay: `${index * 80}ms` }"
            >
              <div class="w-11 h-11 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-white text-base sm:text-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300" style="background: linear-gradient(135deg, #8B0000, #DC143C);">
                <i :class="kontak.icon"></i>
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="text-sm sm:text-base font-bold text-gray-900 mb-2 sm:mb-3">{{ kontak.label }}</h3>
                <!-- Jam Buka dengan format khusus -->
                <div v-if="kontak.label === 'Jam Buka' && kontak.jamBukaArray" class="grid grid-cols-1 gap-2">
                  <div v-for="(jam, idx) in kontak.jamBukaArray" :key="idx" 
                    class="flex items-center justify-between text-xs sm:text-sm rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 border-l-4 transition-all duration-200 hover:translate-x-1"
                    :style="{
                      background: 'linear-gradient(90deg, #FFF5F5 0%, #FFFBF5 100%)',
                      borderColor: '#DC143C'
                    }">
                    <span class="font-bold text-gray-800 min-w-[70px] sm:min-w-[80px]">{{ jam.hari }}</span>
                    <span v-if="jam.hari === 'Sabtu' || jam.hari === 'Minggu'" class="text-gray-500 flex items-center gap-2 font-semibold italic">
                      Tutup
                    </span>
                    <span v-else class="text-gray-600 flex items-center gap-2 font-medium">
                      <span class="font-semibold text-red-700">{{ jam.jam_buka }}</span>
                      <span class="text-gray-400">–</span>
                      <span class="font-semibold text-red-700">{{ jam.jam_tutup }}</span>
                    </span>
                  </div>
                </div>
                <!-- Format biasa untuk kontak lainnya -->
                <p v-else class="text-xs sm:text-sm text-gray-500 leading-relaxed m-0 whitespace-pre-line break-words">{{ kontak.value }}</p>
              </div>
            </div>
          </div>

          <!-- Map -->
          <div class="rounded-2xl overflow-hidden shadow-xl border-2 border-gray-100 reveal lg:h-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.8513517764823!2d106.92182319999999!3d-6.1506563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698ab7a5b038f9%3A0x3c1b1cac881e3af!2sSDN%20Sukapura%2001!5e0!3m2!1sid!2sid!4v1764144796548!5m2!1sid!2sid"
              class="w-full h-full min-h-[300px] lg:min-h-full"
              style="border:0;"
              allowfullscreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== KRITIK & SARAN SECTION ===== -->
    <section id="kritik-saran" class="relative py-16 sm:py-24 px-5 sm:px-8 overflow-hidden" style="background: linear-gradient(135deg, #8B0000 0%, #DC143C 50%, #B22222 100%);">
      <!-- Decorative -->
      <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 1px); background-size: 30px 30px;"></div>
      <div class="absolute top-10 right-10 w-64 h-64 rounded-full opacity-10" style="background: radial-gradient(circle, #FFD700, transparent 70%);"></div>
      <div class="absolute bottom-10 left-10 w-48 h-48 rounded-full opacity-10" style="background: radial-gradient(circle, white, transparent 70%);"></div>

      <div class="max-w-2xl mx-auto relative">
        <div class="text-center mb-8 sm:mb-12 reveal">
          <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-yellow-300 bg-white/10 border border-white/20 mb-4">
            <i class="fas fa-comment-dots"></i> Masukan
          </span>
          <h2 class="text-2xl sm:text-4xl font-bold text-white">
            Kritik &amp; Saran
          </h2>
          <p class="text-white/80 text-sm sm:text-base mt-3 sm:mt-4">Masukan Anda sangat berarti untuk kemajuan SDN Sukapura 01</p>
        </div>

        <div class="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl reveal">
          <div class="mb-5 sm:mb-6">
            <label class="block text-sm font-semibold text-gray-900 mb-2">
              <i class="fas fa-user text-red-500 mr-1"></i> Nama <span class="text-red-600">*</span>
            </label>
            <input type="text" placeholder="Masukkan nama Anda" class="w-full px-4 sm:px-5 py-3 sm:py-4 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all duration-200 font-poppins bg-gray-50 hover:bg-white" />
          </div>
          <div class="mb-5 sm:mb-6">
            <label class="block text-sm font-semibold text-gray-900 mb-2">
              <i class="fas fa-pen text-red-500 mr-1"></i> Kritik &amp; Saran <span class="text-red-600">*</span>
            </label>
            <textarea placeholder="Tulis kritik dan saran Anda di sini..." rows="5" class="w-full px-4 sm:px-5 py-3 sm:py-4 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all duration-200 resize-y font-poppins bg-gray-50 hover:bg-white"></textarea>
          </div>
          <button class="group w-full flex items-center justify-center gap-2 sm:gap-3 py-3.5 sm:py-4 rounded-full text-white font-semibold text-sm sm:text-base border-none cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl" style="background: linear-gradient(135deg, #8B0000, #DC143C);">
            <i class="fas fa-paper-plane transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"></i>
            Kirim Kritik &amp; Saran
          </button>
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

    <!-- Modal Team Members -->
    <TeamMembersModal 
      :isOpen="showTeamModal" 
      :teamName="selectedTeam.name" 
      :members="selectedTeam.members"
      @close="closeTeamModal"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue'
import { usePublicHomeStore } from '~/stores/PublicHomeStore'
import { getPublicDataPrestasi, getPublicDataArtikel, getPublicPengumumanLatest, getPublicDataPengumuman, getPublicDataGaleriKegiatan, getPublicDataKontak } from '~/services/public-home'
import TeamMembersModal from '~/components/modals/TeamMembersModal.vue'

// Set page title
useHead({
  title: 'Portal Informasi Terpadu - SDN Sukapura 01'
})

const publicHomeStore = usePublicHomeStore()

const scrolled = ref(false)
const currentSlide = ref(0)
const statsVisible = ref(false)
const statsSection = ref(null)
const animatedStats = reactive([0, 0, 0, 0, 0])
const currentPrestasi = ref(0)
const prestasiTrack = ref(null)
const prestasiTranslateX = ref(0)
const prestasiAnimating = ref(false)
const currentArtikel = ref(0)
const artikelTrack = ref(null)
const galeriWrapper = ref(null)
const galeriTrack = ref(null)

// State untuk modal team members
const showTeamModal = ref(false)
const selectedTeam = ref({ name: '', members: [] })

// State untuk data prestasi dari API
const prestasiDataFromAPI = ref([])
const isLoadingPrestasi = ref(false)

// State untuk data artikel dari API
const artikelDataFromAPI = ref([])
const isLoadingArtikel = ref(false)

// State untuk data pengumuman dari API
const pengumumanLatestFromAPI = ref(null)
const pengumumanDataFromAPI = ref([])
const isLoadingPengumuman = ref(false)

// State untuk data galeri kegiatan dari API
const galeriKegiatanDataFromAPI = ref([])
const isLoadingGaleri = ref(false)

// State untuk data kontak dari API
const kontakDataFromAPI = ref(null)
const isLoadingKontak = ref(false)

// State untuk aplikasi jumbotron
const aplikasiJumbotron = ref(null)
const isLoadingAplikasiJumbotron = ref(false)

// Fetch jumbotron data dari API
const heroSlides = computed(() => {
  console.log('Store data:', publicHomeStore.jumbotronList)
  console.log('Active jumbotron:', publicHomeStore.activeJumbotron)
  
  if (publicHomeStore.activeJumbotron.length > 0) {
    return publicHomeStore.activeJumbotron.map((item, index) => ({
      image: item.file,
      title: `Slide ${index + 1}`
    }))
  }
  
  // Fallback jika data belum dimuat atau kosong
  return [
    { image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&q=80', title: 'Kegiatan Sekolah' },
  ]
})

const aboutFeatures = [
  { icon: 'fas fa-book-open', text: 'Kurikulum Merdeka', color: 'linear-gradient(135deg, #8B0000, #DC143C)' },
  { icon: 'fas fa-users', text: 'Guru Profesional', color: 'linear-gradient(135deg, #B8860B, #DAA520)' },
  { icon: 'fas fa-laptop', text: 'Fasilitas Modern', color: 'linear-gradient(135deg, #2E8B57, #3CB371)' },
  { icon: 'fas fa-heart', text: 'Pendidikan Karakter', color: 'linear-gradient(135deg, #4169E1, #6495ED)' },
]

const statsData = computed(() => [
  { icon: 'fas fa-users', value: publicHomeStore.totalSiswa, label: 'Jumlah Siswa' },
  { icon: 'fas fa-chalkboard-teacher', value: publicHomeStore.totalPendidik, label: 'Jumlah Pendidik' },
  { icon: 'fas fa-user-tie', value: publicHomeStore.totalTendik, label: 'Jumlah Tendik' },
  { icon: 'fas fa-door-open', value: publicHomeStore.totalRombel, label: 'Jumlah Rombel' },
  { icon: 'fas fa-trophy', value: publicHomeStore.totalEkskul, label: 'Jumlah Ekskul' },
])

const identitasSekolah = [
  { icon: 'fas fa-id-card', label: 'NPSN', value: '20100593' },
  { icon: 'fas fa-building', label: 'Status Sekolah', value: 'Negeri' },
  { icon: 'fas fa-star', label: 'Akreditasi', value: 'A (Unggul)' },
  { icon: 'fas fa-map-marker-alt', label: 'Kecamatan', value: 'Cilincing' },
  { icon: 'fas fa-city', label: 'Kota', value: 'Jakarta Utara' },
  { icon: 'fas fa-calendar-alt', label: 'Tanggal Berdiri', value: '1 Januari 1970' },
  { icon: 'fas fa-envelope', label: 'Email', value: 'sdnsukapuraa01@gmail.com' },
  { icon: 'fas fa-phone', label: 'Telepon', value: '021-4411729' },
  { icon: 'fas fa-globe', label: 'Website', value: 'sdnsukapura01.sch.id' },
]

// Gunakan data dari API jika ada, fallback ke dummy data
const prestasiData = computed(() => {
  if (prestasiDataFromAPI.value.length > 0) {
    return prestasiDataFromAPI.value.map(item => {
      // Format tanggal
      const date = new Date(item.tanggal_lomba)
      const formattedDate = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      
      return {
        id: item.id,
        jenis: item.jenis,
        nama: item.jenis === 'Individu' ? item.nama_peserta_didik : item.nama_grup,
        juara: item.juara,
        namaPrestasi: item.nama_prestasi,
        tanggal: formattedDate,
        foto: item.foto_thumbnail,
        tingkatPrestasi: item.tingkat_prestasi,
        // Untuk tim
        namaGrup: item.nama_grup,
        anggotaTim: item.anggota_tim || []
      }
    })
  }
  
  // Fallback dummy data
  return [
    { nama: 'Ahmad Fauzi', juara: 'Juara 2', namaPrestasi: 'Olimpiade Matematika Tingkat Kecamatan 2024', tanggal: '15 Oktober 2024', foto: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80', jenis: 'Individu' },
    { nama: 'Siti Nurhaliza', juara: 'Juara 1', namaPrestasi: 'Lomba Cipta Puisi Tingkat Kota Jakarta Utara', tanggal: '3 November 2024', foto: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80', jenis: 'Individu' },
    { nama: 'Reza Pratama', juara: 'Juara 3', namaPrestasi: 'Kejuaraan Atletik Pelajar Tingkat Provinsi DKI', tanggal: '20 September 2024', foto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&q=80', jenis: 'Individu' },
    { nama: 'Ayu Lestari', juara: 'Juara 1', namaPrestasi: 'Lomba Menggambar Tingkat Kecamatan 2024', tanggal: '8 Agustus 2024', foto: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=400&q=80', jenis: 'Individu' },
    { nama: 'Budi Santoso', juara: 'Juara 2', namaPrestasi: 'Lomba Pidato Bahasa Indonesia Tingkat Kota', tanggal: '25 Juli 2024', foto: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&q=80', jenis: 'Individu' },
  ]
})

const visiblePrestasi = computed(() => {
  const total = prestasiData.value.length
  if (total === 0) return []
  
  const left = (currentPrestasi.value - 1 + total) % total
  const center = currentPrestasi.value
  const right = (currentPrestasi.value + 1) % total
  return [
    { ...prestasiData.value[left], position: 'side' },
    { ...prestasiData.value[center], position: 'center' },
    { ...prestasiData.value[right], position: 'side' },
  ]
})

// Get 5 visible prestasi cards for carousel (3 on mobile, 5 on desktop)
const visiblePrestasiCards = computed(() => {
  const total = prestasiData.value.length
  if (total === 0) return []
  
  // Check if mobile (you can adjust breakpoint as needed)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  
  if (isMobile) {
    // Mobile: show 3 cards (left, center, right)
    const positions = ['left', 'center', 'right']
    const cards = []
    
    for (let i = -1; i <= 1; i++) {
      const index = (currentPrestasi.value + i + total) % total
      const item = prestasiData.value[index]
      
      cards.push({
        ...item,
        position: positions[i + 1],
        originalIndex: index
      })
    }
    
    return cards
  } else {
    // Desktop: show 5 cards
    const positions = ['far-left', 'left', 'center', 'right', 'far-right']
    const cards = []
    
    for (let i = -2; i <= 2; i++) {
      const index = (currentPrestasi.value + i + total) % total
      const item = prestasiData.value[index]
      
      cards.push({
        ...item,
        position: positions[i + 2],
        originalIndex: index
      })
    }
    
    return cards
  }
})

// Get card style based on position (Full Width - from edge to edge)
const getCardStyleFullWidth = (position) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  
  const styles = {
    // Mobile positions (3 cards)
    'left': {
      left: isMobile ? '8%' : '10%',
      transform: 'scale(0.85)',
      opacity: '0.6',
      zIndex: '2',
      pointerEvents: 'auto',
      transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    'center': {
      left: '50%',
      transform: 'translateX(-50%) scale(1)',
      opacity: '1',
      zIndex: '10',
      pointerEvents: 'auto',
      transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    'right': {
      right: isMobile ? '8%' : '10%',
      transform: 'scale(0.85)',
      opacity: '0.6',
      zIndex: '2',
      pointerEvents: 'auto',
      transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    // Desktop positions (5 cards)
    'far-left': {
      left: '5%',
      transform: 'scale(0.8)',
      opacity: '0.4',
      zIndex: '1',
      pointerEvents: 'auto',
      transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    'far-right': {
      right: '5%',
      transform: 'scale(0.8)',
      opacity: '0.4',
      zIndex: '1',
      pointerEvents: 'auto',
      transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
  
  // Override left/right for desktop (when far-left/far-right exist)
  if (!isMobile) {
    styles.left = {
      left: '20%',
      transform: 'scale(0.92)',
      opacity: '0.75',
      zIndex: '2',
      pointerEvents: 'auto',
      transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
    }
    styles.right = {
      right: '20%',
      transform: 'scale(0.92)',
      opacity: '0.75',
      zIndex: '2',
      pointerEvents: 'auto',
      transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
  
  return styles[position] || {}
}

// Get card style based on position
const getCardStyle = (position) => {
  const styles = {
    'far-left': {
      transform: 'translateX(-120%) scale(0.75) rotateY(25deg)',
      opacity: '0.3',
      zIndex: '1',
      pointerEvents: 'auto'
    },
    'left': {
      transform: 'translateX(-60%) scale(0.85) rotateY(15deg)',
      opacity: '0.6',
      zIndex: '2',
      pointerEvents: 'auto'
    },
    'center': {
      transform: 'translateX(0) scale(1) rotateY(0deg)',
      opacity: '1',
      zIndex: '10',
      pointerEvents: 'auto'
    },
    'right': {
      transform: 'translateX(60%) scale(0.85) rotateY(-15deg)',
      opacity: '0.6',
      zIndex: '2',
      pointerEvents: 'auto'
    },
    'far-right': {
      transform: 'translateX(120%) scale(0.75) rotateY(-25deg)',
      opacity: '0.3',
      zIndex: '1',
      pointerEvents: 'auto'
    }
  }
  
  return styles[position] || {}
}

// Handle card click
const handleCardClick = (position) => {
  if (position === 'left' || position === 'far-left') {
    prevPrestasi()
  } else if (position === 'right' || position === 'far-right') {
    nextPrestasi()
  }
}

// Gunakan data dari API jika ada, fallback ke dummy data
const artikelData = computed(() => {
  if (artikelDataFromAPI.value.length > 0) {
    return artikelDataFromAPI.value.map(item => {
      // Format tanggal
      const date = new Date(item.tanggal)
      const formattedDate = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      
      // Strip HTML tags dari deskripsi untuk preview
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = item.deskripsi
      const plainText = tempDiv.textContent || tempDiv.innerText || ''
      
      return {
        id: item.id,
        judul: item.judul,
        kategori: item.kategori,
        tanggal: formattedDate,
        gambar: item.gambar,
        deskripsi: plainText,
        penulis: item.penulis
      }
    })
  }
  
  // Fallback dummy data
  return [
    { judul: 'Peringatan Hari Pahlawan: Upacara Bendera Khidmat di SDN Sukapura 01', kategori: 'Kegiatan', tanggal: '10 November 2024', gambar: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80', deskripsi: 'SDN Sukapura 01 menggelar upacara bendera untuk memperingati Hari Pahlawan dengan penuh khidmat dan semangat nasionalisme yang tinggi.' },
    { judul: 'Program Literasi Digital: Siswa Belajar Coding Sejak Dini', kategori: 'Akademik', tanggal: '5 November 2024', gambar: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80', deskripsi: 'Dalam rangka meningkatkan literasi digital, SDN Sukapura 01 memperkenalkan program coding dasar bagi siswa kelas 4-6 bekerja sama dengan komunitas teknologi.' },
    { judul: 'Kunjungan Edukatif ke Museum Nasional Jakarta', kategori: 'Kegiatan', tanggal: '28 Oktober 2024', gambar: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&q=80', deskripsi: 'Siswa kelas 5 dan 6 mengadakan kunjungan edukatif ke Museum Nasional Jakarta sebagai bagian dari pembelajaran sejarah dan kebudayaan Indonesia.' },
  ]
})

// Pengumuman latest (card besar)
const pengumumanLatest = computed(() => {
  if (pengumumanLatestFromAPI.value) {
    const item = pengumumanLatestFromAPI.value
    const date = new Date(item.tanggal)
    const formattedDate = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    
    // Strip HTML tags dari deskripsi
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = item.deskripsi
    const plainText = tempDiv.textContent || tempDiv.innerText || ''
    
    return {
      id: item.id,
      judul: item.judul,
      tanggal: formattedDate,
      gambar: item.gambar,
      deskripsi: plainText,
      penulis: item.penulis
    }
  }
  
  // Fallback dummy data
  return { 
    judul: 'Pengumuman Libur Akhir Semester Ganjil Tahun Ajaran 2024/2025', 
    tanggal: '12 November 2024', 
    gambar: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&q=80', 
    deskripsi: 'Diberitahukan kepada seluruh wali murid SDN Sukapura 01 bahwa libur akhir semester ganjil akan dilaksanakan mulai tanggal 23 Desember 2024 hingga 3 Januari 2025.' 
  }
})

// Pengumuman list (3 card kecil)
const pengumumanData = computed(() => {
  if (pengumumanDataFromAPI.value.length > 0) {
    return pengumumanDataFromAPI.value.slice(0, 3).map(item => {
      const date = new Date(item.tanggal)
      const formattedDate = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      
      // Strip HTML tags dari deskripsi
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = item.deskripsi
      const plainText = tempDiv.textContent || tempDiv.innerText || ''
      
      return {
        id: item.id,
        judul: item.judul,
        tanggal: formattedDate,
        gambar: item.gambar,
        deskripsi: plainText,
        penulis: item.penulis
      }
    })
  }
  
  // Fallback dummy data
  return [
    { judul: 'Jadwal Penerimaan Rapor Semester Ganjil', tanggal: '10 November 2024', gambar: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&q=80', deskripsi: 'Penerimaan rapor semester ganjil akan dilaksanakan pada hari Sabtu, 21 Desember 2024.' },
    { judul: 'Pendaftaran Ekstrakurikuler Semester Genap Dibuka', tanggal: '7 November 2024', gambar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&q=80', deskripsi: 'Pendaftaran kegiatan ekstrakurikuler untuk semester genap 2024/2025 telah dibuka.' },
    { judul: 'Imunisasi Rutin untuk Siswa Kelas 1 dan 2', tanggal: '4 November 2024', gambar: 'https://images.unsplash.com/photo-1559757175-7cb057fba93a?w=400&q=80', deskripsi: 'Akan dilaksanakan program imunisasi rutin dari Puskesmas untuk siswa kelas 1 dan 2.' },
  ]
})

const galeriData = computed(() => {
  if (galeriKegiatanDataFromAPI.value.length > 0) {
    return galeriKegiatanDataFromAPI.value.map(item => {
      // Format tanggal
      const date = new Date(item.tanggal)
      const formattedDate = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      
      return {
        id: item.id,
        kegiatan: item.judul,
        tanggal: formattedDate,
        gambar: item.foto_thumbnail
      }
    })
  }
  
  // Fallback dummy data
  return [
    { kegiatan: 'Peringatan Hari Kemerdekaan RI ke-79', gambar: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=600&q=80' },
    { kegiatan: 'Pameran Karya Seni Siswa 2024', gambar: 'https://images.unsplash.com/photo-1541178735493-479c1a27ed24?w=600&q=80' },
    { kegiatan: 'Pentas Seni dan Budaya Nusantara', gambar: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&q=80' },
    { kegiatan: 'Lomba Cerdas Cermat Antar Kelas', gambar: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80' },
    { kegiatan: 'Kegiatan Pramuka dan Outbound', gambar: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600&q=80' },
    { kegiatan: 'Pelepasan Siswa Kelas 6 Tahun 2024', gambar: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&q=80' },
  ]
})

const kontakData = computed(() => {
  if (kontakDataFromAPI.value) {
    const data = kontakDataFromAPI.value
    
    return [
      { icon: 'fas fa-map-marker-alt', label: 'Alamat', value: data.alamat },
      { icon: 'fas fa-phone-alt', label: 'Telepon', value: data.telepon },
      { icon: 'fas fa-envelope', label: 'Email', value: data.email },
      { 
        icon: 'fas fa-clock', 
        label: 'Jam Buka', 
        value: '', 
        jamBukaArray: data.jam_buka || [] 
      },
    ]
  }
  
  // Fallback dummy data
  return [
    { icon: 'fas fa-map-marker-alt', label: 'Alamat', value: 'Jl. Beo No.15, Komp.Walikota No.2, RT.12/RW.6,\nSukapura, Kec. Cilincing, Jakarta Utara 14140' },
    { icon: 'fas fa-phone-alt', label: 'Telepon', value: '0821-2028-0609' },
    { icon: 'fas fa-envelope', label: 'Email', value: 'sdnsukapuraa01@gmail.com' },
    { icon: 'fas fa-clock', label: 'Jam Buka', value: 'Senin – Jumat: 06.30 – 15.00\nSabtu & Minggu: Tutup' },
  ]
})

let slideInterval = null

function nextSlide() { currentSlide.value = (currentSlide.value + 1) % heroSlides.value.length }
function prevSlide() { currentSlide.value = (currentSlide.value - 1 + heroSlides.value.length) % heroSlides.value.length }
function startSlideshow() { slideInterval = setInterval(nextSlide, 5000) }

let prestasiInterval = null
function nextPrestasi() { 
  if (prestasiData.value.length > 0 && !prestasiAnimating.value) {
    prestasiAnimating.value = true
    currentPrestasi.value = (currentPrestasi.value + 1) % prestasiData.value.length
    
    setTimeout(() => {
      prestasiAnimating.value = false
    }, 700)
  }
}

function prevPrestasi() { 
  if (prestasiData.value.length > 0 && !prestasiAnimating.value) {
    prestasiAnimating.value = true
    currentPrestasi.value = (currentPrestasi.value - 1 + prestasiData.value.length) % prestasiData.value.length
    
    setTimeout(() => {
      prestasiAnimating.value = false
    }, 700)
  }
}

// Function untuk membuka modal team members
function openTeamModal(prestasi) {
  if (prestasi.jenis === 'Tim' && prestasi.anggotaTim && prestasi.anggotaTim.length > 0) {
    selectedTeam.value = {
      name: prestasi.namaGrup || prestasi.nama,
      members: prestasi.anggotaTim
    }
    showTeamModal.value = true
  }
}

function closeTeamModal() {
  showTeamModal.value = false
}

// Artikel navigation with infinite loop
function nextArtikel() {
  if (artikelData.value.length === 0) return
  
  const totalArticles = artikelData.value.length
  currentArtikel.value++
  
  // When reaching the end of first set, reset to beginning without transition
  if (currentArtikel.value >= totalArticles) {
    setTimeout(() => {
      if (artikelTrack.value) {
        artikelTrack.value.style.transition = 'none'
        currentArtikel.value = 0
        setTimeout(() => {
          if (artikelTrack.value) {
            artikelTrack.value.style.transition = 'transform 0.5s ease-out'
          }
        }, 50)
      }
    }, 500)
  }
}

function prevArtikel() {
  if (artikelData.value.length === 0) return
  
  const totalArticles = artikelData.value.length
  
  // If at the beginning, jump to the end of first set without transition
  if (currentArtikel.value === 0) {
    if (artikelTrack.value) {
      artikelTrack.value.style.transition = 'none'
      currentArtikel.value = totalArticles
      setTimeout(() => {
        if (artikelTrack.value) {
          artikelTrack.value.style.transition = 'transform 0.5s ease-out'
          currentArtikel.value = totalArticles - 1
        }
      }, 50)
    }
  } else {
    currentArtikel.value--
  }
}

/* ── GALERI SCROLL ── */
let galeriAnim = null
let galeriPos = 0
let galeriPaused = false

function startGaleriScroll() {
  function step() {
    if (!galeriPaused && galeriTrack.value) {
      galeriPos += 0.5
      const halfWidth = galeriTrack.value.scrollWidth / 2
      if (galeriPos >= halfWidth) galeriPos = 0
      galeriTrack.value.style.transform = `translateX(-${galeriPos}px)`
    }
    galeriAnim = requestAnimationFrame(step)
  }
  galeriAnim = requestAnimationFrame(step)
}

function pauseGaleri() { galeriPaused = true }
function resumeGaleri() { galeriPaused = false }

function scrollGaleri(dir) {
  if (!galeriTrack.value) return
  galeriPaused = true
  const cardWidth = window.innerWidth >= 1024 ? 408 : window.innerWidth >= 640 ? 344 : 308
  const halfWidth = galeriTrack.value.scrollWidth / 2
  const target = dir === 'right' ? galeriPos + cardWidth : galeriPos - cardWidth

  galeriTrack.value.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)'

  if (target >= halfWidth) {
    galeriPos = target - halfWidth
    galeriTrack.value.style.transition = 'none'
    galeriTrack.value.style.transform = `translateX(-${galeriPos}px)`
  } else if (target < 0) {
    galeriPos = halfWidth + target
    galeriTrack.value.style.transition = 'none'
    galeriTrack.value.style.transform = `translateX(-${galeriPos}px)`
  } else {
    galeriPos = target
    galeriTrack.value.style.transform = `translateX(-${galeriPos}px)`
  }

  setTimeout(() => {
    if (galeriTrack.value) galeriTrack.value.style.transition = 'none'
    galeriPaused = false
  }, 650)
}

function onScroll() { scrolled.value = window.scrollY > 80 }
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }
function scrollToAbout() { document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) }

function animateCounter(index, target) {
  const duration = 1500
  const steps = 40
  const increment = target / steps
  let step = 0
  const timer = setInterval(() => {
    step++
    animatedStats[index] = Math.min(Math.round(increment * step), target)
    if (step >= steps) clearInterval(timer)
  }, duration / steps)
}

function setupReveal() {
  const observer = new IntersectionObserver(
    (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('revealed') }) },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  )
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
}

function setupStatsObserver() {
  const observer = new IntersectionObserver(
    (entries) => { 
      entries.forEach((entry) => { 
        if (entry.isIntersecting && !statsVisible.value) { 
          statsVisible.value = true
          statsData.value.forEach((stat, i) => animateCounter(i, stat.value))
        } 
      }) 
    },
    { threshold: 0.3 }
  )
  if (statsSection.value) observer.observe(statsSection.value)
}

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

onMounted(async () => {
  window.addEventListener('scroll', onScroll)
  
  // Fetch jumbotron data dari API
  try {
    console.log('Fetching jumbotron data...')
    const result = await publicHomeStore.fetchPublicJumbotron()
    console.log('Fetch result:', result)
    console.log('Store after fetch:', publicHomeStore.jumbotronList)
  } catch (error) {
    console.error('Failed to fetch jumbotron:', error)
  }
  
  // Fetch aplikasi jumbotron
  try {
    console.log('Fetching aplikasi jumbotron...')
    isLoadingAplikasiJumbotron.value = true
    const { getPublicAplikasiJumbotron } = await import('~/services/public-home')
    const response = await getPublicAplikasiJumbotron()
    console.log('Aplikasi jumbotron response:', response)
    if (response && response.data && response.data.length > 0) {
      aplikasiJumbotron.value = response.data[0] // Ambil aplikasi pertama
      console.log('Aplikasi jumbotron loaded:', aplikasiJumbotron.value)
    }
  } catch (error) {
    console.error('Failed to fetch aplikasi jumbotron:', error)
  } finally {
    isLoadingAplikasiJumbotron.value = false
  }
  
  // Fetch total siswa data dari API
  try {
    console.log('Fetching total siswa data...')
    await publicHomeStore.fetchPublicTotalSiswa()
    console.log('Total siswa:', publicHomeStore.totalSiswa)
  } catch (error) {
    console.error('Failed to fetch total siswa:', error)
  }
  
  // Fetch total pendidik data dari API
  try {
    console.log('Fetching total pendidik data...')
    await publicHomeStore.fetchPublicTotalPendidik()
    console.log('Total pendidik:', publicHomeStore.totalPendidik)
  } catch (error) {
    console.error('Failed to fetch total pendidik:', error)
  }
  
  // Fetch total tendik data dari API
  try {
    console.log('Fetching total tendik data...')
    await publicHomeStore.fetchPublicTotalTendik()
    console.log('Total tendik:', publicHomeStore.totalTendik)
  } catch (error) {
    console.error('Failed to fetch total tendik:', error)
  }
  
  // Fetch total rombel data dari API
  try {
    console.log('Fetching total rombel data...')
    await publicHomeStore.fetchPublicTotalRombel()
    console.log('Total rombel:', publicHomeStore.totalRombel)
  } catch (error) {
    console.error('Failed to fetch total rombel:', error)
  }
  
  // Fetch total ekstrakurikuler data dari API
  try {
    console.log('Fetching total ekstrakurikuler data...')
    await publicHomeStore.fetchPublicTotalEkskul()
    console.log('Total ekstrakurikuler:', publicHomeStore.totalEkskul)
  } catch (error) {
    console.error('Failed to fetch total ekstrakurikuler:', error)
  }
  
  // Fetch data prestasi dari API
  try {
    console.log('Fetching data prestasi...')
    isLoadingPrestasi.value = true
    const response = await getPublicDataPrestasi()
    console.log('Data prestasi response:', response)
    if (response && response.data) {
      prestasiDataFromAPI.value = response.data
      console.log('Data prestasi loaded:', prestasiDataFromAPI.value)
    }
  } catch (error) {
    console.error('Failed to fetch data prestasi:', error)
  } finally {
    isLoadingPrestasi.value = false
  }
  
  // Fetch data artikel dari API
  try {
    console.log('Fetching data artikel...')
    isLoadingArtikel.value = true
    const response = await getPublicDataArtikel()
    console.log('Data artikel response:', response)
    if (response && response.data) {
      artikelDataFromAPI.value = response.data
      console.log('Data artikel loaded:', artikelDataFromAPI.value)
    }
  } catch (error) {
    console.error('Failed to fetch data artikel:', error)
  } finally {
    isLoadingArtikel.value = false
  }
  
  // Fetch pengumuman latest dari API
  try {
    console.log('Fetching pengumuman latest...')
    isLoadingPengumuman.value = true
    const response = await getPublicPengumumanLatest()
    console.log('Pengumuman latest response:', response)
    if (response) {
      pengumumanLatestFromAPI.value = response
      console.log('Pengumuman latest loaded:', pengumumanLatestFromAPI.value)
    }
  } catch (error) {
    console.error('Failed to fetch pengumuman latest:', error)
  }
  
  // Fetch data pengumuman dari API
  try {
    console.log('Fetching data pengumuman...')
    const response = await getPublicDataPengumuman()
    console.log('Data pengumuman response:', response)
    if (response && response.data) {
      pengumumanDataFromAPI.value = response.data
      console.log('Data pengumuman loaded:', pengumumanDataFromAPI.value)
    }
  } catch (error) {
    console.error('Failed to fetch data pengumuman:', error)
  } finally {
    isLoadingPengumuman.value = false
  }
  
  // Fetch data galeri kegiatan dari API
  try {
    console.log('Fetching data galeri kegiatan...')
    isLoadingGaleri.value = true
    const response = await getPublicDataGaleriKegiatan()
    console.log('Data galeri kegiatan response:', response)
    if (response && response.data) {
      galeriKegiatanDataFromAPI.value = response.data
      console.log('Data galeri kegiatan loaded:', galeriKegiatanDataFromAPI.value)
    }
  } catch (error) {
    console.error('Failed to fetch data galeri kegiatan:', error)
  } finally {
    isLoadingGaleri.value = false
  }
  
  // Fetch data kontak dari API
  try {
    console.log('Fetching data kontak...')
    isLoadingKontak.value = true
    const response = await getPublicDataKontak()
    console.log('Data kontak response:', response)
    if (response) {
      kontakDataFromAPI.value = response
      console.log('Data kontak loaded:', kontakDataFromAPI.value)
    }
  } catch (error) {
    console.error('Failed to fetch data kontak:', error)
  } finally {
    isLoadingKontak.value = false
  }
  
  startSlideshow()
  startGaleriScroll()
  setupStatsObserver()
  setTimeout(setupReveal, 100)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (slideInterval) clearInterval(slideInterval)
  if (galeriAnim) cancelAnimationFrame(galeriAnim)
})
</script>

<style scoped>
/* ── HERO ENHANCEMENTS ── */
.hero-title-highlight {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@keyframes heroZoom {
  from { transform: scale(1); }
  to { transform: scale(1.08); }
}
.hero-zoom {
  animation: heroZoom 8s ease-out forwards;
}

@keyframes heroFloat {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.05); }
}
.hero-float {
  animation: heroFloat 6s ease-in-out infinite;
}
.hero-float-delayed {
  animation: heroFloat 6s ease-in-out infinite;
  animation-delay: 2s;
}

/* ── BOUNCE CTA ── */
@keyframes bounce-cta {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-12px); }
  60% { transform: translateY(-6px); }
}
.bounce-btn { animation: bounce-cta 2s infinite; }
.bounce-btn:hover { animation: none; transform: translateY(-5px); }

/* ── FADE IN UP ── */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; }
.animation-delay-100 { animation-delay: 0.1s; }
.animation-delay-200 { animation-delay: 0.2s; }
.animation-delay-300 { animation-delay: 0.3s; }

/* ── SCROLL REVEAL ── */
.reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.7s ease-out, transform 0.7s ease-out; }
.reveal.revealed { opacity: 1; transform: translateY(0); }

/* ── HERO SLIDE ── */
.hero-slide-enter-active, .hero-slide-leave-active { transition: opacity 1s ease-in-out; }
.hero-slide-enter-from, .hero-slide-leave-to { opacity: 0; }

/* ── FADE (back-to-top) ── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ── HOVER SHADOWS ── */
.hover\:shadow-red-glow:hover { box-shadow: 0 20px 60px rgba(139, 0, 0, 0.25); }
.hover\:shadow-yellow-glow:hover { box-shadow: 0 20px 40px rgba(255, 215, 0, 0.3); }

/* ── PRESTASI CAROUSEL ── */
@keyframes prestasiSlideIn {
  from { opacity: 0; transform: scale(0.95) translateX(20px); }
  to { opacity: 1; transform: scale(1) translateX(0); }
}
.prestasi-slide-in {
  animation: prestasiSlideIn 0.5s ease-out;
}

/* ── PRESTASI CARD SLIDE ANIMATION ── */
@keyframes cardSlideIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.prestasi-card-slide {
  animation: cardSlideIn 0.5s ease-out;
}

/* Prevent card ghosting during transition */
.will-change-transform {
  will-change: transform, opacity, left, right;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
}

/* ── ARTIKEL CAROUSEL ── */
@keyframes artikelSlideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.artikel-slide-in {
  animation: artikelSlideIn 0.4s ease-out;
}

/* ── GALERI MARQUEE ── */
.galeri-marquee {
  will-change: transform;
  transition: none;
}

/* ── ARTIKEL ACCENT ── */
.artikel-card:hover .artikel-accent { transform: scaleX(1) !important; }

/* ── WAVE DIVIDERS ── */
.wave-divider-dark { margin-top: -1px; background: transparent; }
.wave-divider-light { margin-bottom: -1px; background: transparent; }

/* ── LINE CLAMP ── */
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.line-clamp-4 { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
</style>
