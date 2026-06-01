<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
    <!-- Confetti Canvas -->
    <canvas ref="confettiCanvas" class="fixed inset-0 pointer-events-none z-50"></canvas>
    
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div class="absolute top-40 right-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div class="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
    </div>

    <!-- Error Prank Modal -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-200 ease-in" 
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="showErrorPrankModal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div @click.stop class="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative overflow-hidden">
          <!-- Decorative elements -->
          <div class="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-yellow-100 rounded-full -ml-12 -mb-12 opacity-50"></div>
          
          <div class="relative z-10">
            <!-- Icon -->
            <div class="text-center mb-4">
              <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full mb-4 animate-bounce">
                <i class="fa-solid fa-exclamation text-3xl text-white"></i>
              </div>
            </div>

            <!-- Title -->
            <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-4">
              Waduh.....
            </h3>

            <!-- Message -->
            <p class="text-base sm:text-lg text-gray-700 text-center mb-2 leading-relaxed">
              Data kamu tidak ditemukan nih.
            </p>
            <p class="text-base sm:text-lg text-gray-700 text-center mb-6 leading-relaxed">
              Jangan-jangan kamu tidak lu...... <br>
              <span class="font-bold text-red-600">Ahh ga mungkin</span>, coba masukin datamu lagi 😅
            </p>

            <!-- GIF -->
            <div class="flex justify-center mb-6">
              <img :src="currentErrorGif" alt="Thinking" class="w-48 h-48 sm:w-64 sm:h-64 object-contain rounded-xl">
            </div>

            <!-- Button -->
            <button @click="closeErrorPrankModal"
              class="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-base sm:text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 cursor-pointer">
              <i class="fa-solid fa-check mr-2"></i>
              Oke, Coba Lagi!
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Welcome Modal -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="showWelcomeModal" @click="closeWelcomeModal" class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <Transition enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95">
          <div @click.stop class="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <!-- Decorative animated elements -->
            <div class="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
              <!-- Floating ribbons -->
              <div class="absolute top-10 left-10 w-16 h-16 opacity-20 animate-float">
                <i class="fa-solid fa-ribbon text-emerald-500 text-4xl"></i>
              </div>
              <div class="absolute top-20 right-10 w-16 h-16 opacity-20 animate-float-delayed">
                <i class="fa-solid fa-award text-teal-500 text-4xl"></i>
              </div>
              <div class="absolute bottom-20 left-20 w-16 h-16 opacity-20 animate-float-slow">
                <i class="fa-solid fa-star text-cyan-500 text-4xl"></i>
              </div>
              <div class="absolute bottom-10 right-20 w-16 h-16 opacity-20 animate-float">
                <i class="fa-solid fa-trophy text-emerald-500 text-4xl"></i>
              </div>
              
              <!-- Sparkles -->
              <div class="absolute top-1/4 left-1/4 animate-pulse">
                <i class="fa-solid fa-sparkles text-yellow-400 text-2xl"></i>
              </div>
              <div class="absolute top-1/3 right-1/4 animate-pulse animation-delay-1000">
                <i class="fa-solid fa-sparkles text-yellow-400 text-xl"></i>
              </div>
              <div class="absolute bottom-1/3 left-1/3 animate-pulse animation-delay-2000">
                <i class="fa-solid fa-sparkles text-yellow-400 text-2xl"></i>
              </div>
            </div>

            <div class="relative z-10 p-6 sm:p-8 md:p-12">
              <!-- Header Section -->
              <div class="text-center mb-8">
                <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-emerald-800 mb-2">
                  SELAMAT DATANG DI
                </h1>
                <h2 class="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
                  <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 italic" style="font-family: 'Georgia', serif;">
                    Pengumuman Kelulusan
                  </span>
                </h2>
                <h3 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  KELAS VI SDN SUKAPURA 01
                </h3>
                <p class="text-base sm:text-lg font-semibold text-gray-700">
                  Tahun Ajaran {{ tahunPelajaran }}
                </p>
                
                <!-- Decorative line -->
                <div class="flex items-center justify-center gap-2 mt-4 mb-6">
                  <div class="h-1 w-16 bg-gradient-to-r from-transparent to-emerald-500 rounded"></div>
                  <i class="fa-solid fa-graduation-cap text-emerald-600 text-2xl"></i>
                  <div class="h-1 w-16 bg-gradient-to-l from-transparent to-emerald-500 rounded"></div>
                </div>
              </div>

              <!-- Kepala Sekolah Section -->
              <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg mb-6">
                <div class="text-center mb-6">
                  <div class="inline-block relative">
                    <img v-if="settings?.foto_kepsek" :src="settings.foto_kepsek" alt="Kepala Sekolah" 
                      class="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-emerald-500 shadow-xl mx-auto">
                    <div class="absolute -bottom-2 -right-2 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <i class="fa-solid fa-graduation-cap text-white text-xl"></i>
                    </div>
                  </div>
                  <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mt-4">{{ settings?.nama_kepsek || 'Kepala Sekolah' }}</h3>
                  <p class="text-sm sm:text-base text-gray-600">Kepala SDN Sukapura 01 Jakarta</p>
                </div>

                <!-- Sambutan Title -->
                <div class="text-center mb-4">
                  <div class="inline-block px-6 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full border-2 border-emerald-300">
                    <h4 class="text-base sm:text-lg font-bold text-emerald-800">
                      <i class="fa-solid fa-message text-emerald-600 mr-2"></i>
                      Sambutan Kepala Sekolah
                    </h4>
                  </div>
                </div>

                <!-- Sambutan Content -->
                <div class="prose prose-sm sm:prose max-w-none text-gray-700" v-html="settings?.sambutan_kelulusan"></div>
              </div>

              <!-- Close Button -->
              <button @click="closeWelcomeModal"
                class="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-base sm:text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2">
                <i class="fa-solid fa-check text-xl"></i>
                <span>Lanjutkan ke Pengumuman</span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Content -->
    <div class="relative z-10 container mx-auto px-4 py-8 sm:py-12">
      <!-- Header -->
      <div class="text-center mb-8 sm:mb-12">
        <div class="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full mb-4 sm:mb-6 shadow-lg">
          <i class="fa-solid fa-user-graduate text-2xl sm:text-3xl text-white"></i>
        </div>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
          Pengumuman Kelulusan
        </h1>
        <p class="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          SDN Sukapura 01 Jakarta
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <div class="flex flex-col items-center gap-4">
          <div class="h-12 w-12 sm:h-16 sm:w-16 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
          <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat data...</p>
        </div>
      </div>

      <!-- Countdown Section -->
      <div v-else-if="!isAnnouncementOpen" class="max-w-4xl mx-auto">
        <div class="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 backdrop-blur-sm bg-opacity-90">
          <div class="text-center mb-8 sm:mb-12">
            <div class="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-6 shadow-lg animate-pulse" style="background-color: #f59e0b;">
              <i class="fa-solid fa-hourglass-half text-3xl sm:text-4xl text-white"></i>
            </div>
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pengumuman Akan Segera Dibuka
            </h2>
            <p class="text-sm sm:text-base text-gray-600">
              Mohon tunggu hingga waktu pengumuman kelulusan tiba
            </p>
          </div>

          <!-- Countdown Timer -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div class="rounded-2xl p-4 sm:p-6 text-center shadow-lg transform hover:scale-105 transition-transform" style="background-color: #10b981;">
              <div class="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                {{ countdown.days }}
              </div>
              <div class="text-xs sm:text-sm text-emerald-100 uppercase tracking-wider">Hari</div>
            </div>
            <div class="rounded-2xl p-4 sm:p-6 text-center shadow-lg transform hover:scale-105 transition-transform" style="background-color: #14b8a6;">
              <div class="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                {{ countdown.hours }}
              </div>
              <div class="text-xs sm:text-sm text-teal-100 uppercase tracking-wider">Jam</div>
            </div>
            <div class="rounded-2xl p-4 sm:p-6 text-center shadow-lg transform hover:scale-105 transition-transform" style="background-color: #06b6d4;">
              <div class="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                {{ countdown.minutes }}
              </div>
              <div class="text-xs sm:text-sm text-cyan-100 uppercase tracking-wider">Menit</div>
            </div>
            <div class="rounded-2xl p-4 sm:p-6 text-center shadow-lg transform hover:scale-105 transition-transform" style="background-color: #f59e0b;">
              <div class="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                {{ countdown.seconds }}
              </div>
              <div class="text-xs sm:text-sm text-amber-100 uppercase tracking-wider">Detik</div>
            </div>
          </div>

          <div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 sm:p-6">
            <div class="flex items-start gap-3">
              <i class="fa-solid fa-info-circle text-emerald-600 text-lg sm:text-xl flex-shrink-0 mt-1"></i>
              <div>
                <p class="text-sm sm:text-base font-semibold text-emerald-900 mb-1">Informasi Penting</p>
                <p class="text-xs sm:text-sm text-emerald-800">
                  Pengumuman kelulusan akan dibuka pada <strong>{{ formatDateTime(announcementDate) }}</strong>. 
                  Pastikan Anda memiliki NISN dan tanggal lahir untuk mengecek status kelulusan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Check Graduation Section -->
      <div v-else class="max-w-6xl mx-auto">
        <!-- Graduation Card (if exists) -->
        <div v-if="graduationResult" class="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 backdrop-blur-sm bg-opacity-90 mb-8">
          <!-- Certificate Card -->
          <div id="graduation-card" class="relative bg-white rounded-2xl p-8 sm:p-12 border-8 border-double border-emerald-600 shadow-2xl overflow-hidden">
            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-5 pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="star-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                    <path d="M40 10 L45 30 L65 30 L50 42 L55 62 L40 50 L25 62 L30 42 L15 30 L35 30 Z" 
                          fill="#10b981" stroke="#10b981" stroke-width="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#star-pattern)"/>
              </svg>
            </div>

            <!-- Decorative Corners -->
            <div class="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-emerald-600 rounded-tl-lg"></div>
            <div class="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-emerald-600 rounded-tr-lg"></div>
            <div class="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-emerald-600 rounded-bl-lg"></div>
            <div class="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-emerald-600 rounded-br-lg"></div>

            <!-- Content (relative to show above pattern) -->
            <div class="relative z-10">
            <!-- Logo -->
            <div class="text-center mb-6">
              <img src="/assets/images/logo-sekolah.jpg" alt="Logo Sekolah" class="w-24 h-24 sm:w-32 sm:h-32 mx-auto object-contain">
            </div>

            <!-- Title -->
            <div class="text-center mb-8">
              <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-800 mb-2">KARTU KELULUSAN</h2>
              <div class="w-32 h-1 bg-emerald-600 mx-auto mt-4"></div>
            </div>

            <!-- Content -->
            <div class="space-y-6 text-center max-w-3xl mx-auto">
              <p class="text-sm sm:text-base text-gray-700 leading-relaxed">
                Yang bertanda tangan di bawah ini, Kepala Sekolah SDN Sukapura 01 Jakarta,<br>
                dengan ini menerangkan bahwa:
              </p>

              <!-- Student Info -->
              <div class="bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 rounded-xl p-6 shadow-lg border-2 border-emerald-300">
                <table class="w-full text-left">
                  <tbody>
                    <tr>
                      <td class="text-sm sm:text-base font-semibold text-gray-800 py-2 pr-4 w-40 align-top">Nama</td>
                      <td class="text-sm sm:text-base font-semibold text-gray-800 py-2 w-8 align-top">:</td>
                      <td class="text-sm sm:text-base font-bold text-gray-900 py-2 align-top">{{ graduationResult.nama }}</td>
                    </tr>
                    <tr>
                      <td class="text-sm sm:text-base font-semibold text-gray-800 py-2 pr-4 align-top">NISN</td>
                      <td class="text-sm sm:text-base font-semibold text-gray-800 py-2 align-top">:</td>
                      <td class="text-sm sm:text-base font-bold text-gray-900 py-2 align-top">{{ graduationResult.nisn }}</td>
                    </tr>
                    <tr>
                      <td class="text-sm sm:text-base font-semibold text-gray-800 py-2 pr-4 align-top">Tanggal Lahir</td>
                      <td class="text-sm sm:text-base font-semibold text-gray-800 py-2 align-top">:</td>
                      <td class="text-sm sm:text-base font-bold text-gray-900 py-2 align-top">{{ formatDate(graduationResult.tanggal_lahir) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p class="text-sm sm:text-base text-gray-700 leading-relaxed">
                Berdasarkan hasil keputusan rapat dewan guru SDN Sukapura 01 Jakarta,<br>
                siswa tersebut di atas dinyatakan
              </p>

              <!-- Status -->
              <div class="py-6">
                <div v-if="graduationResult.lulus" class="inline-block px-12 py-6 rounded-2xl shadow-2xl transform rotate-3" style="background-color: #10b981;">
                  <p class="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-wider">LULUS</p>
                </div>
                <div v-else class="inline-block px-12 py-6 rounded-2xl shadow-2xl transform -rotate-3" style="background-color: #ef4444;">
                  <p class="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-wider">TIDAK LULUS</p>
                </div>
              </div>

              <p class="text-sm sm:text-base text-gray-700">
                dari SDN Sukapura 01 Jakarta<br>
                Tahun Pelajaran <strong>{{ tahunPelajaran }}</strong>
              </p>

              <!-- Motivational Message -->
              <div v-if="graduationResult.lulus" class="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl p-6 text-left">
                <h4 class="text-base sm:text-lg font-bold text-emerald-800 mb-4 text-center">PESAN MOTIVASI</h4>
                <p class="text-sm sm:text-base text-gray-800 leading-relaxed mb-3">
                  <i class="fa-solid fa-quote-left text-emerald-600 mr-2"></i>
                  Selamat atas kelulusanmu! Ini adalah langkah awal menuju masa depan yang cerah.
                </p>
                <p class="text-sm sm:text-base text-gray-800 leading-relaxed mb-3">
                  Jadikan ilmu yang kamu peroleh sebagai bekal untuk terus berprestasi.
                </p>
                <p class="text-sm sm:text-base text-gray-800 leading-relaxed mb-3">
                  Ingatlah bahwa kesuksesan adalah hasil dari kerja keras, ketekunan, dan doa.
                </p>
                <p class="text-sm sm:text-base text-gray-800 leading-relaxed">
                  Teruslah bermimpi, belajar, dan berbagi kebaikan dimanapun kamu berada.
                  <i class="fa-solid fa-quote-right text-emerald-600 ml-2"></i>
                </p>
              </div>

              <!-- Signature -->
              <div class="flex justify-end mt-8">
                <div class="text-right">
                  <p class="text-sm sm:text-base text-gray-700 mb-1">Jakarta, {{ formatAnnouncementDate() }}</p>
                  <p class="text-sm sm:text-base font-semibold text-gray-800 mb-2">Kepala SDN Sukapura 01</p>
                  <div class="mb-1">
                    <img v-if="settings?.ttd_kepsek" :src="settings.ttd_kepsek" alt="Tanda Tangan" class="h-24 sm:h-32 mx-auto">
                  </div>
                  <p class="text-sm sm:text-base font-bold text-gray-900 border-t-2 border-gray-800 pt-2">
                    {{ settings?.nama_kepsek || 'Kepala Sekolah' }}
                  </p>
                </div>
              </div>
            </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
            <button @click="resetForm" 
              class="flex-1 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-white font-semibold text-sm sm:text-base hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              style="background-color: #6b7280;">
              <i class="fa-solid fa-arrow-left"></i>
              Kembali
            </button>
            <button @click="downloadCard" 
              class="flex-1 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm sm:text-base hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer">
              <i class="fa-solid fa-download"></i>
              Download Kartu Kelulusan
            </button>
            <button @click="goToNilaiTKA" 
              class="flex-1 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm sm:text-base hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer">
              <i class="fa-solid fa-chart-line"></i>
              Cek Nilai TKA
            </button>
            <!-- <button v-if="graduationResult.lulus && graduationResult.skl" @click="downloadSKL" 
              class="flex-1 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm sm:text-base hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer">
              <i class="fa-solid fa-file-pdf"></i>
              Cetak SKL
            </button> -->
          </div>
        </div>

        <!-- Check Form -->
        <div v-else class="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 backdrop-blur-sm bg-opacity-90">
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full mb-6 shadow-lg">
              <i class="fa-solid fa-search text-3xl sm:text-4xl text-white"></i>
            </div>
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cek Status Kelulusan
            </h2>
            <p class="text-sm sm:text-base text-gray-600">
              Masukkan NISN dan tanggal lahir untuk melihat status kelulusan
            </p>
          </div>

          <form @submit.prevent="handleCheckGraduation" class="max-w-md mx-auto space-y-6">
            <!-- NISN Input -->
            <div>
              <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
                NISN
                <span class="text-red-600 ml-1">*</span>
              </label>
              <input
                v-model="checkForm.nisn"
                type="text"
                required
                placeholder="Masukkan NISN"
                class="w-full rounded-xl border-2 border-gray-300 bg-white px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium transition-all duration-200 placeholder-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <!-- Date of Birth Input -->
            <div>
              <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-3">
                Tanggal Lahir
                <span class="text-red-600 ml-1">*</span>
              </label>
              <input
                v-model="checkForm.tanggal_lahir"
                type="date"
                required
                class="w-full rounded-xl border-2 border-gray-300 bg-white px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium transition-all duration-200 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div class="flex items-start gap-3">
                <i class="fa-solid fa-exclamation-circle text-red-600 text-lg flex-shrink-0 mt-0.5"></i>
                <div>
                  <p class="text-sm font-semibold text-red-900 mb-1">Error</p>
                  <p class="text-xs sm:text-sm text-red-800">{{ errorMessage }}</p>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isChecking"
              class="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-base sm:text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 cursor-pointer"
            >
              <i v-if="isChecking" class="fa-solid fa-spinner fa-spin text-xl"></i>
              <i v-else class="fa-solid fa-search text-xl"></i>
              <span>{{ isChecking ? 'Mengecek...' : 'Cek Kelulusan' }}</span>
            </button>
          </form>

          <div class="mt-8 bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 sm:p-6">
            <div class="flex items-start gap-3">
              <i class="fa-solid fa-info-circle text-emerald-600 text-lg flex-shrink-0 mt-1"></i>
              <div>
                <p class="text-xs sm:text-sm font-semibold text-emerald-900 mb-1">Catatan</p>
                <p class="text-xs sm:text-sm text-emerald-800">
                  Pastikan NISN dan tanggal lahir yang Anda masukkan sesuai dengan data yang terdaftar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

definePageMeta({
  layout: false,
})

useHead({
  title: 'Pengumuman Kelulusan | Portal Informasi Terpadu',
  meta: [
    { name: 'description', content: 'Pengumuman Kelulusan Kelas VI SDN Sukapura 01 Jakarta' }
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/jpeg',
      href: '/logo-sekolah.jpg'
    }
  ]
})

// State
const isLoading = ref(true)
const isAnnouncementOpen = ref(false)
const announcementDate = ref<string>('')
const showWelcomeModal = ref(false)
const showErrorPrankModal = ref(false)
const currentErrorGif = ref('')
const errorAttemptMessage = ref('')
const settings = ref<any>(null)
const tahunPelajaran = ref('')
const countdown = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})
const checkForm = ref({
  nisn: '',
  tanggal_lahir: ''
})
const isChecking = ref(false)
const errorMessage = ref('')
const graduationResult = ref<any>(null)
const confettiCanvas = ref<HTMLCanvasElement | null>(null)

// GIF options for error prank
const errorGifs = [
  '/mikir1.gif',
  '/mikir2.gif',
  '/mikir3.gif',
  '/mikir4.gif'
]

let countdownInterval: NodeJS.Timeout | null = null

// Confetti Animation
const createConfetti = () => {
  if (!confettiCanvas.value) return

  const canvas = confettiCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const confettiPieces: any[] = []
  const confettiCount = 150
  const colors = ['#10b981', '#14b8a6', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6']

  for (let i = 0; i < confettiCount; i++) {
    confettiPieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * confettiCount,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 10,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
      tiltAngle: 0
    })
  }

  let animationFrame: number

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    confettiPieces.forEach((confetti, index) => {
      ctx.beginPath()
      ctx.lineWidth = confetti.r / 2
      ctx.strokeStyle = confetti.color
      ctx.moveTo(confetti.x + confetti.tilt + confetti.r / 4, confetti.y)
      ctx.lineTo(confetti.x + confetti.tilt, confetti.y + confetti.tilt + confetti.r / 4)
      ctx.stroke()

      confetti.tiltAngle += confetti.tiltAngleIncremental
      confetti.y += (Math.cos(confetti.d) + 3 + confetti.r / 2) / 2
      confetti.x += Math.sin(confetti.d)
      confetti.tilt = Math.sin(confetti.tiltAngle - index / 3) * 15

      if (confetti.y > canvas.height) {
        confettiPieces[index] = {
          ...confetti,
          x: Math.random() * canvas.width,
          y: -20
        }
      }
    })

    animationFrame = requestAnimationFrame(draw)
  }

  draw()

  // Stop after 10 seconds
  setTimeout(() => {
    cancelAnimationFrame(animationFrame)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }, 10000)
}

// Methods
const fetchSettings = async () => {
  isLoading.value = true
  try {
    const config = useRuntimeConfig()
    const response = await $fetch<{ data: any }>(
      `${config.public.apiBase}/api/v1/public/get-setting-pengumuman-kelulusan`,
      {
        method: 'POST',
        credentials: 'include',
      }
    )

    if (response && response.data) {
      settings.value = response.data
      announcementDate.value = response.data.tanggal_pengumuman_kelulusan
      checkAnnouncementStatus()
      startCountdown()
    }
  } catch (error: any) {
    console.error('Error fetching settings:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchTahunPelajaran = async () => {
  try {
    const config = useRuntimeConfig()
    const response = await $fetch<{ data: any }>(
      `${config.public.apiBase}/api/v1/public/get-tahun-pelajaran-aktif`,
      {
        method: 'POST',
        credentials: 'include',
      }
    )

    if (response && response.data) {
      tahunPelajaran.value = response.data.tahun_pelajaran
    }
  } catch (error: any) {
    console.error('Error fetching tahun pelajaran:', error)
  }
}

const checkAnnouncementStatus = () => {
  if (!announcementDate.value) return

  const now = new Date().getTime()
  const targetDate = new Date(announcementDate.value).getTime()
  
  isAnnouncementOpen.value = now >= targetDate
}

const startCountdown = () => {
  if (!announcementDate.value) return

  const updateCountdown = () => {
    const now = new Date().getTime()
    const targetDate = new Date(announcementDate.value).getTime()
    const distance = targetDate - now

    if (distance < 0) {
      isAnnouncementOpen.value = true
      if (countdownInterval) {
        clearInterval(countdownInterval)
      }
      return
    }

    countdown.value = {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000)
    }
  }

  updateCountdown()
  countdownInterval = setInterval(updateCountdown, 1000)
}

const closeWelcomeModal = () => {
  showWelcomeModal.value = false
  // Trigger confetti after modal closes
  createConfetti()
}

const closeErrorPrankModal = () => {
  showErrorPrankModal.value = false
  errorAttemptMessage.value = ''
}

const getRandomGif = () => {
  const randomIndex = Math.floor(Math.random() * errorGifs.length)
  return errorGifs[randomIndex]
}

const handleCheckGraduation = async () => {
  errorMessage.value = ''
  isChecking.value = true

  try {
    const config = useRuntimeConfig()
    const response = await $fetch<{ data: any }>(
      `${config.public.apiBase}/api/v1/public/cek-kelulusan`,
      {
        method: 'POST',
        body: {
          nisn: checkForm.value.nisn,
          tanggal_lahir: checkForm.value.tanggal_lahir
        },
        credentials: 'include',
      }
    )

    if (response && response.data) {
      graduationResult.value = response.data
      
      // Show welcome modal after successful check
      showWelcomeModal.value = true
    }
  } catch (error: any) {
    console.error('Error checking graduation:', error)
    const errorMsg = error?.data?.error || error?.message || 'Data tidak ditemukan. Pastikan NISN dan tanggal lahir sudah benar.'
    
    // Check if it's the verification error (prank error)
    if (errorMsg.includes('sedang diverifikasi') || errorMsg.includes('percobaan tersisa')) {
      // Show prank modal with random GIF
      currentErrorGif.value = getRandomGif()
      errorAttemptMessage.value = errorMsg
      showErrorPrankModal.value = true
    } else {
      // Show regular error message
      errorMessage.value = errorMsg
    }
  } finally {
    isChecking.value = false
  }
}

const resetForm = () => {
  graduationResult.value = null
  checkForm.value = {
    nisn: '',
    tanggal_lahir: ''
  }
  errorMessage.value = ''
}

const downloadCard = async () => {
  const element = document.getElementById('graduation-card')
  if (!element) return

  try {
    // Use window.print() as a more reliable alternative
    // Create a print-specific version
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Mohon izinkan popup untuk download kartu')
      return
    }

    const cardHTML = element.innerHTML
    const styles = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Poppins', sans-serif;
          background: white;
          padding: 10px;
        }
        .card-container {
          max-width: 700px;
          margin: 0 auto;
          background: white;
          padding: 2rem;
          border: 8px double #10b981;
          border-radius: 1rem;
          position: relative;
          overflow: hidden;
        }
        
        /* Text colors */
        .text-white { color: #ffffff !important; }
        .text-emerald-800 { color: #065f46 !important; }
        .text-emerald-600 { color: #059669 !important; }
        .text-emerald-900 { color: #064e3b !important; }
        .text-gray-700 { color: #374151 !important; }
        .text-gray-800 { color: #1f2937 !important; }
        .text-gray-900 { color: #111827 !important; }
        
        /* Background colors */
        .bg-white { background-color: #ffffff !important; }
        .bg-emerald-600 { background-color: #059669 !important; }
        .bg-emerald-100 { background-color: #d1fae5 !important; }
        .bg-green-100 { background-color: #dcfce7 !important; }
        .bg-gradient-to-br { 
          background: linear-gradient(to bottom right, #d1fae5, #ccfbf1, #cffafe) !important;
        }
        .bg-gradient-to-r {
          background: linear-gradient(to right, #d1fae5, #ccfbf1) !important;
        }
        
        /* Border colors */
        .border-emerald-600 { border-color: #059669 !important; }
        .border-emerald-200 { border-color: #a7f3d0 !important; }
        .border-emerald-300 { border-color: #6ee7b7 !important; }
        .border-emerald-400 { border-color: #34d399 !important; }
        .border-gray-800 { border-color: #1f2937 !important; }
        
        /* Border widths */
        .border { border-width: 1px !important; border-style: solid !important; }
        .border-2 { border-width: 2px !important; border-style: solid !important; }
        .border-4 { border-width: 4px !important; border-style: solid !important; }
        .border-8 { border-width: 8px !important; border-style: solid !important; }
        .border-t-2 { border-top-width: 2px !important; border-top-style: solid !important; }
        .border-t-4 { border-top-width: 4px !important; border-top-style: solid !important; }
        .border-l-4 { border-left-width: 4px !important; border-left-style: solid !important; }
        .border-r-4 { border-right-width: 4px !important; border-right-style: solid !important; }
        .border-b-4 { border-bottom-width: 4px !important; border-bottom-style: solid !important; }
        
        /* Border styles */
        .border-double { border-style: double !important; }
        
        /* Border radius */
        .rounded-lg { border-radius: 0.5rem !important; }
        .rounded-xl { border-radius: 0.75rem !important; }
        .rounded-2xl { border-radius: 1rem !important; }
        .rounded-tl-lg { border-top-left-radius: 0.5rem !important; }
        .rounded-tr-lg { border-top-right-radius: 0.5rem !important; }
        .rounded-bl-lg { border-bottom-left-radius: 0.5rem !important; }
        .rounded-br-lg { border-bottom-right-radius: 0.5rem !important; }
        
        /* Spacing */
        .p-6 { padding: 1rem !important; }
        .p-8 { padding: 1.5rem !important; }
        .px-12 { padding-left: 2rem !important; padding-right: 2rem !important; }
        .py-2 { padding-top: 0.4rem !important; padding-bottom: 0.4rem !important; }
        .py-6 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
        .pt-2 { padding-top: 0.5rem !important; }
        .pr-4 { padding-right: 1rem !important; }
        .mb-2 { margin-bottom: 0.4rem !important; }
        .mb-3 { margin-bottom: 0.6rem !important; }
        .mb-4 { margin-bottom: 0.8rem !important; }
        .mb-6 { margin-bottom: 1rem !important; }
        .mb-8 { margin-bottom: 1.2rem !important; }
        .mt-4 { margin-top: 0.8rem !important; }
        .mt-8 { margin-top: 1.2rem !important; }
        .mr-2 { margin-right: 0.5rem !important; }
        .ml-2 { margin-left: 0.5rem !important; }
        
        /* Text alignment */
        .text-left { text-align: left !important; }
        .text-center { text-align: center !important; }
        .text-right { text-align: right !important; }
        
        /* Font sizes - reduced for print */
        .text-sm { font-size: 0.75rem !important; line-height: 1.1rem !important; }
        .text-base { font-size: 0.875rem !important; line-height: 1.3rem !important; }
        .text-lg { font-size: 1rem !important; line-height: 1.5rem !important; }
        .text-2xl { font-size: 1.25rem !important; line-height: 1.6rem !important; }
        .text-3xl { font-size: 1.5rem !important; line-height: 1.8rem !important; }
        .text-4xl { font-size: 1.75rem !important; line-height: 2rem !important; }
        .text-5xl { font-size: 2rem !important; line-height: 1 !important; }
        .text-6xl { font-size: 2.5rem !important; line-height: 1 !important; }
        
        /* Font weights */
        .font-semibold { font-weight: 600 !important; }
        .font-bold { font-weight: 700 !important; }
        .font-black { font-weight: 900 !important; }
        
        /* Shadows */
        .shadow-lg { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important; }
        .shadow-2xl { box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.15) !important; }
        
        /* Positioning */
        .relative { position: relative !important; }
        .absolute { position: absolute !important; }
        .top-4 { top: 1rem !important; }
        .bottom-4 { bottom: 1rem !important; }
        .left-4 { left: 1rem !important; }
        .right-4 { right: 1rem !important; }
        
        /* Width/Height - reduced for print */
        .w-16 { width: 3rem !important; }
        .w-24 { width: 4rem !important; }
        .w-32 { width: 5rem !important; }
        .w-40 { width: 8rem !important; }
        .w-8 { width: 1.5rem !important; }
        .w-full { width: 100% !important; }
        .h-1 { height: 0.2rem !important; }
        .h-16 { height: 3rem !important; }
        .h-20 { height: 4rem !important; }
        .h-24 { height: 5rem !important; }
        .h-32 { height: 5.5rem !important; }
        
        /* Display */
        .inline-block { display: inline-block !important; }
        .block { display: block !important; }
        .flex { display: flex !important; }
        
        /* Flex */
        .justify-end { justify-content: flex-end !important; }
        
        /* Misc */
        .mx-auto { margin-left: auto !important; margin-right: auto !important; }
        .max-w-3xl { max-width: 40rem !important; }
        .space-y-6 > * + * { margin-top: 1rem !important; }
        .leading-relaxed { line-height: 1.5 !important; }
        .tracking-wider { letter-spacing: 0.05em !important; }
        .overflow-hidden { overflow: hidden !important; }
        .opacity-5 { opacity: 0.05 !important; }
        .pointer-events-none { pointer-events: none !important; }
        .object-contain { object-fit: contain !important; }
        .align-top { vertical-align: top !important; }
        .inset-0 { top: 0 !important; right: 0 !important; bottom: 0 !important; left: 0 !important; }
        .rotate-3 { transform: rotate(3deg) !important; }
        
        img {
          max-width: 100%;
          height: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        td {
          padding: 0.4rem;
        }
        
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          body { 
            padding: 0; 
            margin: 0;
          }
          .card-container { 
            border: 6px double #10b981;
            page-break-inside: avoid;
            padding: 1.5rem;
          }
        }
      <\/style>
    `

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Kartu Kelulusan - ${graduationResult.value?.nama || 'Siswa'}<\/title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;900&display=swap" rel="stylesheet">
          ${styles}
        <\/head>
        <body>
          <div class="card-container">
            ${cardHTML}
          <\/div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            }
          <\/script>
        <\/body>
      <\/html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()

  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Terjadi kesalahan saat membuat PDF. Silakan coba lagi.')
  }
}

const downloadSKL = () => {
  if (graduationResult.value?.skl) {
    window.open(graduationResult.value.skl, '_blank')
  }
}

const goToNilaiTKA = () => {
  navigateTo('/pengumuman-tka')
}

const formatDateTime = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { 
    weekday: 'long',
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric'
  })
}

const formatAnnouncementDate = () => {
  if (!announcementDate.value) return ''
  const date = new Date(announcementDate.value)
  return date.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric'
  })
}

onMounted(() => {
  fetchSettings()
  fetchTahunPelajaran()
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

@keyframes float-slow {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(-10deg);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 3s ease-in-out infinite;
  animation-delay: 1s;
}

.animate-float-slow {
  animation: float-slow 4s ease-in-out infinite;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.prose {
  max-width: none;
}

.prose p {
  margin-bottom: 1rem;
  line-height: 1.75;
}

.prose strong {
  font-weight: 600;
  color: #047857;
}

.prose em {
  font-style: italic;
  color: #059669;
}
</style>
