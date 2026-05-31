<template>
  <DashboardLayout>
    <!-- Header Section -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Monitoring Kehadiran</h1>
      <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
        Dashboard monitoring kehadiran siswa secara real-time
      </p>
    </div>

    <!-- Main Content -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <div class="px-4 sm:px-6">
          <div class="flex gap-1 overflow-x-auto -mb-px" style="scrollbar-width: thin;">
            <button
              @click="activeTab = 'dashboard-umum'"
              :class="[
                'px-4 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 border-b-2 relative cursor-pointer',
                activeTab === 'dashboard-umum'
                  ? 'text-red-600 border-b-red-600'
                  : 'text-gray-600 border-b-transparent hover:text-gray-900 hover:border-b-gray-300'
              ]"
            >
              <span class="flex items-center gap-2">
                <i class="fa-solid fa-chart-line w-4 h-4"></i>
                Dashboard Umum
              </span>
            </button>
            <button
              @click="activeTab = 'dashboard-siswa'"
              :class="[
                'px-4 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 border-b-2 relative cursor-pointer',
                activeTab === 'dashboard-siswa'
                  ? 'text-red-600 border-b-red-600'
                  : 'text-gray-600 border-b-transparent hover:text-gray-900 hover:border-b-gray-300'
              ]"
            >
              <span class="flex items-center gap-2">
                <i class="fa-solid fa-user-graduate w-4 h-4"></i>
                Dashboard Siswa
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Tab Content: Dashboard Umum -->
      <div v-if="activeTab === 'dashboard-umum'" class="p-4 sm:p-6 md:p-8">
        <!-- Dashboard Type Selection -->
        <div class="mb-6 pb-6 border-b border-gray-200">
          <label class="block text-sm font-semibold text-gray-900 mb-3">
            Lihat Dashboard Sebagai
          </label>
          <div class="flex gap-3">
            <button
              @click="dashboardType = 'guru-kelas'"
              :class="[
                'flex-1 px-4 py-3 rounded-lg border-2 font-semibold text-sm transition-all cursor-pointer',
                dashboardType === 'guru-kelas'
                  ? 'bg-red-50 border-red-600 text-red-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
              ]"
            >
              <i class="fa-solid fa-chalkboard-user mr-2"></i>
              Guru Kelas
            </button>
            <button
              @click="dashboardType = 'guru-mapel'"
              :class="[
                'flex-1 px-4 py-3 rounded-lg border-2 font-semibold text-sm transition-all cursor-pointer',
                dashboardType === 'guru-mapel'
                  ? 'bg-red-50 border-red-600 text-red-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
              ]"
            >
              <i class="fa-solid fa-book-open mr-2"></i>
              Guru Mapel
            </button>
          </div>
        </div>

        <!-- Filters -->
        <div class="mb-6 pb-6 border-b border-gray-200">
          <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fa-solid fa-filter text-red-600"></i>
            Filter Data
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Bidang Studi (only for Guru Mapel) -->
            <div v-if="dashboardType === 'guru-mapel'">
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Bidang Studi <span class="text-red-600">*</span>
              </label>
              <select
                v-model.number="filters.bidang_studi_id"
                @change="loadAllData"
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
              >
                <option :value="0" disabled>Pilih Bidang Studi</option>
                <option v-for="bidang in activeBidangStudiList" :key="bidang.id" :value="bidang.id">
                  {{ bidang.name }}
                </option>
              </select>
            </div>

            <!-- Tahun Pelajaran -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Tahun Pelajaran <span class="text-red-600">*</span>
              </label>
              <select
                v-model.number="filters.tahun_pelajaran_id"
                @change="loadAllData"
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
              >
                <option v-for="tahun in activeTahunPelajaranList" :key="tahun.id" :value="tahun.id">
                  {{ tahun.tahun_pelajaran }}
                </option>
              </select>
            </div>

            <!-- Semester -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Semester <span class="text-red-600">*</span>
              </label>
              <select
                v-model.number="filters.semester"
                @change="loadAllData"
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
              >
                <option :value="1">Semester 1</option>
                <option :value="2">Semester 2</option>
              </select>
            </div>

            <!-- Rombel -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Rombel <span class="text-red-600">*</span>
              </label>
              <select
                v-model="filters.rombel_id"
                @change="loadAllData"
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
              >
                <option :value="null">Semua Rombel</option>
                <option v-for="rombel in activeRombelList" :key="rombel.id" :value="rombel.id">
                  {{ rombel.name }}
                </option>
              </select>
            </div>

            <!-- Tanggal Mulai -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Tanggal Mulai <span class="text-red-600">*</span>
              </label>
              <input
                v-model="filters.tanggal_mulai"
                type="date"
                @change="loadAllData"
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
              />
            </div>

            <!-- Tanggal Selesai -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Tanggal Selesai <span class="text-red-600">*</span>
              </label>
              <input
                v-model="filters.tanggal_selesai"
                type="date"
                @change="loadAllData"
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
              />
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <div class="flex flex-col items-center gap-3">
            <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
            <p class="text-sm text-gray-600 font-medium">Memuat data dashboard...</p>
          </div>
        </div>

        <!-- Dashboard Content -->
        <div v-else-if="dashboardData" class="space-y-6">
          <!-- Summary Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Total Siswa -->
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md flex-shrink-0">
                  <i class="fa-solid fa-users text-white text-xl"></i>
                </div>
                <div>
                  <p class="text-xs font-medium text-blue-600 uppercase tracking-wide">Total Siswa</p>
                  <p class="text-3xl font-bold text-blue-900 mt-1">{{ dashboardData.total_siswa }}</p>
                </div>
              </div>
              <div class="pt-3 border-t border-blue-200">
                <p class="text-xs text-blue-700">Siswa terdaftar</p>
              </div>
            </div>

            <!-- Total Pertemuan -->
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border-2 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-md flex-shrink-0">
                  <i class="fa-solid fa-calendar-check text-white text-xl"></i>
                </div>
                <div>
                  <p class="text-xs font-medium text-purple-600 uppercase tracking-wide">Total Pertemuan</p>
                  <p class="text-3xl font-bold text-purple-900 mt-1">{{ dashboardData.total_pertemuan }}</p>
                </div>
              </div>
              <div class="pt-3 border-t border-purple-200">
                <p class="text-xs text-purple-700">Pertemuan tercatat</p>
              </div>
            </div>

            <!-- Persentase Kehadiran -->
            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md flex-shrink-0">
                  <i class="fa-solid fa-chart-line text-white text-xl"></i>
                </div>
                <div>
                  <p class="text-xs font-medium text-green-600 uppercase tracking-wide">Persentase</p>
                  <p class="text-3xl font-bold text-green-900 mt-1">{{ dashboardData.summary.persentase_kehadiran }}%</p>
                </div>
              </div>
              <div class="pt-3 border-t border-green-200">
                <p class="text-xs text-green-700">Tingkat kehadiran</p>
              </div>
            </div>

            <!-- Trend Hari Ini -->
            <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border-2 border-orange-200 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md flex-shrink-0">
                  <i class="fa-solid fa-arrow-trend-up text-white text-xl"></i>
                </div>
                <div>
                  <p class="text-xs font-medium text-orange-600 uppercase tracking-wide">Trend Hari Ini</p>
                  <p class="text-3xl font-bold text-orange-900 mt-1">{{ dashboardData.trend.hadir_hari_ini }}</p>
                </div>
              </div>
              <div class="pt-3 border-t border-orange-200 flex items-center justify-between">
                <p class="text-xs text-orange-700">Hadir hari ini</p>
                <span :class="[
                  'text-xs font-bold px-2 py-1 rounded',
                  dashboardData.trend.perubahan.startsWith('+') ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                ]">
                  {{ dashboardData.trend.perubahan }}
                </span>
              </div>
            </div>
          </div>

          <!-- Status Kehadiran Detail -->
          <div class="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
            <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b-2 border-gray-200">
              <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                <i class="fa-solid fa-clipboard-list text-red-600"></i>
                Detail Status Kehadiran
              </h3>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Hadir -->
                <div class="bg-gradient-to-br from-green-50 to-white rounded-lg p-4 border-2 border-green-200">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <i class="fa-solid fa-check text-green-600 text-lg"></i>
                    </div>
                    <div>
                      <p class="text-xs text-green-600 font-semibold">Hadir</p>
                      <p class="text-2xl font-bold text-green-900">{{ dashboardData.summary.total_hadir }}</p>
                    </div>
                  </div>
                  <div class="w-full bg-green-200 rounded-full h-2">
                    <div 
                      class="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                      :style="{ width: getPercentage(dashboardData.summary.total_hadir) + '%' }"
                    ></div>
                  </div>
                </div>

                <!-- Sakit -->
                <div class="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border-2 border-blue-200">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <i class="fa-solid fa-notes-medical text-blue-600 text-lg"></i>
                    </div>
                    <div>
                      <p class="text-xs text-blue-600 font-semibold">Sakit</p>
                      <p class="text-2xl font-bold text-blue-900">{{ dashboardData.summary.total_sakit }}</p>
                    </div>
                  </div>
                  <div class="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      class="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                      :style="{ width: getPercentage(dashboardData.summary.total_sakit) + '%' }"
                    ></div>
                  </div>
                </div>

                <!-- Izin -->
                <div class="bg-gradient-to-br from-yellow-50 to-white rounded-lg p-4 border-2 border-yellow-200">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <i class="fa-solid fa-hand-paper text-yellow-600 text-lg"></i>
                    </div>
                    <div>
                      <p class="text-xs text-yellow-600 font-semibold">Izin</p>
                      <p class="text-2xl font-bold text-yellow-900">{{ dashboardData.summary.total_izin }}</p>
                    </div>
                  </div>
                  <div class="w-full bg-yellow-200 rounded-full h-2">
                    <div 
                      class="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full transition-all duration-500"
                      :style="{ width: getPercentage(dashboardData.summary.total_izin) + '%' }"
                    ></div>
                  </div>
                </div>

                <!-- Alpa -->
                <div class="bg-gradient-to-br from-red-50 to-white rounded-lg p-4 border-2 border-red-200">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                      <i class="fa-solid fa-times text-red-600 text-lg"></i>
                    </div>
                    <div>
                      <p class="text-xs text-red-600 font-semibold">Alpa</p>
                      <p class="text-2xl font-bold text-red-900">{{ dashboardData.summary.total_alpa }}</p>
                    </div>
                  </div>
                  <div class="w-full bg-red-200 rounded-full h-2">
                    <div 
                      class="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-500"
                      :style="{ width: getPercentage(dashboardData.summary.total_alpa) + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Grafik Kehadiran -->
          <div class="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
            <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b-2 border-gray-200">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <i class="fa-solid fa-chart-bar text-red-600"></i>
                  Grafik Kehadiran
                </h3>
                <select
                  v-model="filters.periode"
                  @change="loadChart"
                  class="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm font-semibold"
                >
                  <option value="harian">Harian</option>
                  <option value="mingguan">Mingguan</option>
                  <option value="bulanan">Bulanan</option>
                </select>
              </div>
            </div>
            <div class="p-6">
              <!-- Loading Chart -->
              <div v-if="isLoadingChart" class="flex items-center justify-center py-12">
                <div class="flex flex-col items-center gap-3">
                  <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
                  <p class="text-sm text-gray-600 font-medium">Memuat grafik...</p>
                </div>
              </div>

              <!-- Chart Content -->
              <div v-else-if="chartData" class="space-y-4">
                <div class="h-96">
                  <Line :data="chartDataFormatted" :options="chartOptions" />
                </div>
              </div>

              <!-- Empty Chart State -->
              <div v-else class="flex flex-col items-center justify-center py-12">
                <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <i class="fa-solid fa-chart-bar text-2xl text-gray-400"></i>
                </div>
                <h3 class="text-base font-semibold text-gray-900 mb-1">Belum ada data grafik</h3>
                <p class="text-sm text-gray-600">Pilih filter untuk melihat grafik kehadiran</p>
              </div>
            </div>
          </div>

          <!-- Statistik Per Hari -->
          <div class="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
            <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b-2 border-gray-200">
              <div class="flex items-center justify-between flex-wrap gap-4">
                <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <i class="fa-solid fa-calendar-week text-red-600"></i>
                  Statistik Kehadiran Per Hari
                </h3>
                <div class="flex items-center gap-3">
                  <select
                    v-model.number="filters.bulan"
                    @change="loadStatistikPerHari"
                    class="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm font-semibold"
                  >
                    <option :value="1">Januari</option>
                    <option :value="2">Februari</option>
                    <option :value="3">Maret</option>
                    <option :value="4">April</option>
                    <option :value="5">Mei</option>
                    <option :value="6">Juni</option>
                    <option :value="7">Juli</option>
                    <option :value="8">Agustus</option>
                    <option :value="9">September</option>
                    <option :value="10">Oktober</option>
                    <option :value="11">November</option>
                    <option :value="12">Desember</option>
                  </select>
                  <input
                    v-model.number="filters.tahun"
                    type="number"
                    @change="loadStatistikPerHari"
                    class="w-24 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm font-semibold"
                    placeholder="Tahun"
                  />
                </div>
              </div>
            </div>
            <div class="p-6">
              <!-- Loading Statistik -->
              <div v-if="isLoadingStatistik" class="flex items-center justify-center py-12">
                <div class="flex flex-col items-center gap-3">
                  <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
                  <p class="text-sm text-gray-600 font-medium">Memuat statistik...</p>
                </div>
              </div>

              <!-- Statistik Content -->
              <div v-else-if="statistikPerHariData" class="space-y-6">
                <!-- Bar Chart -->
                <div class="h-80">
                  <Bar :data="statistikBarData" :options="barChartOptions" />
                </div>

                <!-- Detail Table -->
                <div class="overflow-x-auto">
                  <table class="w-full">
                    <thead>
                      <tr class="bg-gray-50 border-b-2 border-gray-200">
                        <th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Hari</th>
                        <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Rata-rata Hadir</th>
                        <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Rata-rata Absen</th>
                        <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Persentase Kehadiran</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                      <tr 
                        v-for="(item, index) in statistikPerHariData.data" 
                        :key="index"
                        class="hover:bg-gray-50 transition-colors"
                      >
                        <td class="px-4 py-3 text-sm font-semibold text-gray-900">{{ item.hari }}</td>
                        <td class="px-4 py-3 text-sm text-center">
                          <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold">
                            <i class="fa-solid fa-check text-xs"></i>
                            {{ item.rata_rata_hadir }}
                          </span>
                        </td>
                        <td class="px-4 py-3 text-sm text-center">
                          <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-800 font-semibold">
                            <i class="fa-solid fa-times text-xs"></i>
                            {{ item.rata_rata_absen }}
                          </span>
                        </td>
                        <td class="px-4 py-3 text-sm text-center">
                          <div class="flex items-center justify-center gap-2">
                            <div class="flex-1 max-w-xs bg-gray-200 rounded-full h-2">
                              <div 
                                class="h-2 rounded-full transition-all duration-500"
                                :class="{
                                  'bg-green-500': item.persentase_hadir >= 90,
                                  'bg-yellow-500': item.persentase_hadir >= 75 && item.persentase_hadir < 90,
                                  'bg-red-500': item.persentase_hadir < 75
                                }"
                                :style="{ width: item.persentase_hadir + '%' }"
                              ></div>
                            </div>
                            <span 
                              class="font-bold text-sm min-w-[60px] text-right"
                              :class="{
                                'text-green-700': item.persentase_hadir >= 90,
                                'text-yellow-700': item.persentase_hadir >= 75 && item.persentase_hadir < 90,
                                'text-red-700': item.persentase_hadir < 75
                              }"
                            >
                              {{ item.persentase_hadir.toFixed(2) }}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Legend Info -->
                <div class="flex flex-wrap gap-4 justify-center pt-4 border-t border-gray-200">
                  <div class="flex items-center gap-2">
                    <div class="w-4 h-4 rounded bg-green-500"></div>
                    <span class="text-sm text-gray-700">≥ 90% (Sangat Baik)</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-4 h-4 rounded bg-yellow-500"></div>
                    <span class="text-sm text-gray-700">75-89% (Baik)</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-4 h-4 rounded bg-red-500"></div>
                    <span class="text-sm text-gray-700">< 75% (Perlu Perhatian)</span>
                  </div>
                </div>
              </div>

              <!-- Empty Statistik State -->
              <div v-else class="flex flex-col items-center justify-center py-12">
                <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <i class="fa-solid fa-calendar-week text-2xl text-gray-400"></i>
                </div>
                <h3 class="text-base font-semibold text-gray-900 mb-1">Belum ada data statistik</h3>
                <p class="text-sm text-gray-600">Pilih bulan dan tahun untuk melihat statistik per hari</p>
              </div>
            </div>
          </div>

          <!-- Perbandingan Rombel -->
          <div class="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
            <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b-2 border-gray-200">
              <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                <i class="fa-solid fa-chart-column text-red-600"></i>
                Perbandingan Kehadiran Antar Rombel
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                Periode: {{ filters.tanggal_mulai }} s/d {{ filters.tanggal_selesai }}
              </p>
            </div>
            <div class="p-6">
              <!-- Loading Perbandingan -->
              <div v-if="isLoadingPerbandingan" class="flex items-center justify-center py-12">
                <div class="flex flex-col items-center gap-3">
                  <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
                  <p class="text-sm text-gray-600 font-medium">Memuat perbandingan...</p>
                </div>
              </div>

              <!-- Perbandingan Content -->
              <div v-else-if="perbandinganRombelData" class="space-y-6">
                <!-- Bar Chart -->
                <div class="h-96">
                  <Bar :data="perbandinganBarData" :options="perbandinganBarChartOptions" />
                </div>

                <!-- Rombel Cards Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div 
                    v-for="(rombel, index) in sortedRombelData" 
                    :key="rombel.rombel_id"
                    class="relative bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 p-5 hover:shadow-lg transition-all"
                    :class="{
                      'border-yellow-400 shadow-md': index === 0,
                      'border-gray-300': index === 1,
                      'border-orange-400': index === 2,
                      'border-gray-200': index > 2
                    }"
                  >
                    <!-- Ranking Badge -->
                    <div 
                      v-if="index < 3"
                      class="absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg"
                      :class="{
                        'bg-gradient-to-br from-yellow-400 to-yellow-600': index === 0,
                        'bg-gradient-to-br from-gray-400 to-gray-600': index === 1,
                        'bg-gradient-to-br from-orange-400 to-orange-600': index === 2
                      }"
                    >
                      <i 
                        class="fa-solid text-sm"
                        :class="{
                          'fa-trophy': index === 0,
                          'fa-medal': index === 1 || index === 2
                        }"
                      ></i>
                    </div>

                    <!-- Rombel Header -->
                    <div class="flex items-center justify-between mb-4">
                      <div>
                        <h4 class="text-xl font-bold text-gray-900">{{ rombel.rombel_nama }}</h4>
                        <p class="text-sm text-gray-600">{{ rombel.total_siswa }} Siswa</p>
                      </div>
                      <div 
                        class="text-3xl font-bold"
                        :class="{
                          'text-green-600': rombel.persentase_hadir >= 90,
                          'text-yellow-600': rombel.persentase_hadir >= 75 && rombel.persentase_hadir < 90,
                          'text-red-600': rombel.persentase_hadir < 75
                        }"
                      >
                        {{ rombel.persentase_hadir.toFixed(1) }}%
                      </div>
                    </div>

                    <!-- Progress Bar -->
                    <div class="mb-4">
                      <div class="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          class="h-3 rounded-full transition-all duration-500"
                          :class="{
                            'bg-gradient-to-r from-green-500 to-green-600': rombel.persentase_hadir >= 90,
                            'bg-gradient-to-r from-yellow-500 to-yellow-600': rombel.persentase_hadir >= 75 && rombel.persentase_hadir < 90,
                            'bg-gradient-to-r from-red-500 to-red-600': rombel.persentase_hadir < 75
                          }"
                          :style="{ width: rombel.persentase_hadir + '%' }"
                        ></div>
                      </div>
                    </div>

                    <!-- Status Detail -->
                    <div class="grid grid-cols-2 gap-3">
                      <div class="bg-green-50 rounded-lg p-3 border border-green-200">
                        <div class="flex items-center gap-2 mb-1">
                          <i class="fa-solid fa-check text-green-600 text-xs"></i>
                          <span class="text-xs font-semibold text-green-700">Hadir</span>
                        </div>
                        <p class="text-lg font-bold text-green-900">{{ rombel.total_hadir }}</p>
                      </div>
                      <div class="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <div class="flex items-center gap-2 mb-1">
                          <i class="fa-solid fa-notes-medical text-blue-600 text-xs"></i>
                          <span class="text-xs font-semibold text-blue-700">Sakit</span>
                        </div>
                        <p class="text-lg font-bold text-blue-900">{{ rombel.total_sakit }}</p>
                      </div>
                      <div class="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                        <div class="flex items-center gap-2 mb-1">
                          <i class="fa-solid fa-hand-paper text-yellow-600 text-xs"></i>
                          <span class="text-xs font-semibold text-yellow-700">Izin</span>
                        </div>
                        <p class="text-lg font-bold text-yellow-900">{{ rombel.total_izin }}</p>
                      </div>
                      <div class="bg-red-50 rounded-lg p-3 border border-red-200">
                        <div class="flex items-center gap-2 mb-1">
                          <i class="fa-solid fa-times text-red-600 text-xs"></i>
                          <span class="text-xs font-semibold text-red-700">Alpa</span>
                        </div>
                        <p class="text-lg font-bold text-red-900">{{ rombel.total_alpa }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Summary Info -->
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-2 border-blue-200">
                  <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <i class="fa-solid fa-info text-white"></i>
                    </div>
                    <div>
                      <h4 class="font-bold text-blue-900 mb-1">Informasi Perbandingan</h4>
                      <p class="text-sm text-blue-800">
                        Data perbandingan menampilkan ranking rombel berdasarkan persentase kehadiran tertinggi. 
                        Rombel dengan medali emas 🏆 memiliki persentase kehadiran terbaik, diikuti medali perak dan perunggu.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty Perbandingan State -->
              <div v-else class="flex flex-col items-center justify-center py-12">
                <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <i class="fa-solid fa-chart-column text-2xl text-gray-400"></i>
                </div>
                <h3 class="text-base font-semibold text-gray-900 mb-1">Belum ada data perbandingan</h3>
                <p class="text-sm text-gray-600">Pilih filter untuk melihat perbandingan antar rombel</p>
              </div>
            </div>
          </div>

          <!-- Siswa dengan Kehadiran Terendah -->
          <div class="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
            <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b-2 border-gray-200">
              <div class="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <i class="fa-solid fa-user-clock text-red-600"></i>
                    Siswa dengan Kehadiran Terendah
                  </h3>
                  <p class="text-sm text-gray-600 mt-1">
                    Periode: {{ filters.tanggal_mulai }} s/d {{ filters.tanggal_selesai }}
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <label class="text-sm font-semibold text-gray-700">Tampilkan:</label>
                  <select
                    v-model.number="filters.limit"
                    @change="loadSiswaTerendah"
                    class="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm font-semibold"
                  >
                    <option :value="10">10 Siswa</option>
                    <option :value="25">25 Siswa</option>
                    <option :value="50">50 Siswa</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="p-6">
              <!-- Loading Siswa Terendah -->
              <div v-if="isLoadingSiswaTerendah" class="flex items-center justify-center py-12">
                <div class="flex flex-col items-center gap-3">
                  <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
                  <p class="text-sm text-gray-600 font-medium">Memuat data siswa...</p>
                </div>
              </div>

              <!-- Siswa Terendah Content -->
              <div v-else-if="siswaTerendahData && siswaTerendahData.data.length > 0" class="space-y-4">
                <!-- Table -->
                <div class="overflow-x-auto">
                  <table class="w-full">
                    <thead>
                      <tr class="bg-gradient-to-r from-red-50 to-orange-50 border-b-2 border-red-200">
                        <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-16">Rank</th>
                        <th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">NIS</th>
                        <th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nama Siswa</th>
                        <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Total Pertemuan</th>
                        <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Hadir</th>
                        <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Absen</th>
                        <th class="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Persentase</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                      <tr 
                        v-for="(siswa, index) in siswaTerendahData.data" 
                        :key="siswa.peserta_didik_id"
                        class="hover:bg-gray-50 transition-colors"
                        :class="{
                          'bg-red-50': siswa.persentase_hadir < 75,
                          'bg-yellow-50': siswa.persentase_hadir >= 75 && siswa.persentase_hadir < 90
                        }"
                      >
                        <!-- Rank -->
                        <td class="px-4 py-3 text-center">
                          <div 
                            class="inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm"
                            :class="{
                              'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md': index === 0,
                              'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md': index === 1,
                              'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-md': index === 2,
                              'bg-gray-200 text-gray-700': index > 2
                            }"
                          >
                            {{ index + 1 }}
                          </div>
                        </td>
                        <!-- NIS -->
                        <td class="px-4 py-3 text-sm font-semibold text-gray-900">{{ siswa.nis }}</td>
                        <!-- Nama -->
                        <td class="px-4 py-3 text-sm font-semibold text-gray-900">{{ siswa.nama }}</td>
                        <!-- Total Pertemuan -->
                        <td class="px-4 py-3 text-sm text-center">
                          <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold">
                            <i class="fa-solid fa-calendar-days text-xs"></i>
                            {{ siswa.total_pertemuan }}
                          </span>
                        </td>
                        <!-- Hadir -->
                        <td class="px-4 py-3 text-sm text-center">
                          <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold">
                            <i class="fa-solid fa-check text-xs"></i>
                            {{ siswa.total_hadir }}
                          </span>
                        </td>
                        <!-- Absen -->
                        <td class="px-4 py-3 text-sm text-center">
                          <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-800 font-semibold">
                            <i class="fa-solid fa-times text-xs"></i>
                            {{ siswa.total_absen }}
                          </span>
                        </td>
                        <!-- Persentase -->
                        <td class="px-4 py-3 text-sm text-center">
                          <div class="flex items-center justify-center gap-2">
                            <div class="flex-1 max-w-[100px] bg-gray-200 rounded-full h-2">
                              <div 
                                class="h-2 rounded-full transition-all duration-500"
                                :class="{
                                  'bg-green-500': siswa.persentase_hadir >= 90,
                                  'bg-yellow-500': siswa.persentase_hadir >= 75 && siswa.persentase_hadir < 90,
                                  'bg-red-500': siswa.persentase_hadir < 75
                                }"
                                :style="{ width: siswa.persentase_hadir + '%' }"
                              ></div>
                            </div>
                            <span 
                              class="font-bold text-sm min-w-[60px] text-right"
                              :class="{
                                'text-green-700': siswa.persentase_hadir >= 90,
                                'text-yellow-700': siswa.persentase_hadir >= 75 && siswa.persentase_hadir < 90,
                                'text-red-700': siswa.persentase_hadir < 75
                              }"
                            >
                              {{ siswa.persentase_hadir.toFixed(1) }}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Alert Info -->
                <div class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-2 border-amber-200">
                  <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                      <i class="fa-solid fa-exclamation-triangle text-white"></i>
                    </div>
                    <div>
                      <h4 class="font-bold text-amber-900 mb-1">Perhatian Khusus</h4>
                      <p class="text-sm text-amber-800">
                        Siswa dengan persentase kehadiran di bawah 75% memerlukan perhatian khusus. 
                        Pertimbangkan untuk melakukan pendekatan personal atau konseling untuk meningkatkan kehadiran mereka.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty Siswa Terendah State -->
              <div v-else class="flex flex-col items-center justify-center py-12">
                <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <i class="fa-solid fa-user-clock text-2xl text-gray-400"></i>
                </div>
                <h3 class="text-base font-semibold text-gray-900 mb-1">Belum ada data siswa</h3>
                <p class="text-sm text-gray-600">Pilih filter untuk melihat siswa dengan kehadiran terendah</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center py-12">
          <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <i class="fa-solid fa-chart-line text-2xl text-gray-400"></i>
          </div>
          <h3 class="text-base font-semibold text-gray-900 mb-1">Belum ada data</h3>
          <p class="text-sm text-gray-600">Pilih filter untuk melihat dashboard</p>
        </div>
      </div>

      <!-- Tab Content: Dashboard Siswa -->
      <div v-if="activeTab === 'dashboard-siswa'" class="p-4 sm:p-6 md:p-8">
        <!-- Dashboard Type Selection -->
        <div class="mb-6 pb-6 border-b border-gray-200">
          <label class="block text-sm font-semibold text-gray-900 mb-3">
            Lihat Dashboard Sebagai
          </label>
          <div class="flex gap-3">
            <button
              @click="dashboardSiswaType = 'guru-kelas'"
              :class="[
                'flex-1 px-4 py-3 rounded-lg border-2 font-semibold text-sm transition-all cursor-pointer',
                dashboardSiswaType === 'guru-kelas'
                  ? 'bg-red-50 border-red-600 text-red-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
              ]"
            >
              <i class="fa-solid fa-chalkboard-user mr-2"></i>
              Guru Kelas
            </button>
            <button
              @click="dashboardSiswaType = 'guru-mapel'"
              :class="[
                'flex-1 px-4 py-3 rounded-lg border-2 font-semibold text-sm transition-all cursor-pointer',
                dashboardSiswaType === 'guru-mapel'
                  ? 'bg-red-50 border-red-600 text-red-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
              ]"
            >
              <i class="fa-solid fa-book-open mr-2"></i>
              Guru Mapel
            </button>
          </div>
        </div>

        <!-- Filters -->
        <div class="mb-6 pb-6 border-b border-gray-200">
          <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fa-solid fa-filter text-red-600"></i>
            Filter Data
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Bidang Studi (only for Guru Mapel) -->
            <div v-if="dashboardSiswaType === 'guru-mapel'">
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Bidang Studi <span class="text-red-600">*</span>
              </label>
              <select
                v-model.number="filtersSiswa.bidang_studi_id"
                @change="loadDashboardSiswa"
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
              >
                <option :value="0" disabled>Pilih Bidang Studi</option>
                <option v-for="bidang in activeBidangStudiList" :key="bidang.id" :value="bidang.id">
                  {{ bidang.name }}
                </option>
              </select>
            </div>

            <!-- Tahun Pelajaran -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Tahun Pelajaran <span class="text-red-600">*</span>
              </label>
              <select
                v-model.number="filtersSiswa.tahun_pelajaran_id"
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
              >
                <option v-for="tahun in activeTahunPelajaranList" :key="tahun.id" :value="tahun.id">
                  {{ tahun.tahun_pelajaran }}
                </option>
              </select>
            </div>

            <!-- Semester -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Semester <span class="text-red-600">*</span>
              </label>
              <select
                v-model.number="filtersSiswa.semester"
                @change="loadDashboardSiswa"
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
              >
                <option :value="1">Semester 1</option>
                <option :value="2">Semester 2</option>
              </select>
            </div>

            <!-- Rombel -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Rombel <span class="text-red-600">*</span>
              </label>
              <select
                v-model.number="filtersSiswa.rombel_id"
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
              >
                <option :value="0" disabled>Pilih Rombel</option>
                <option v-for="rombel in activeRombelList" :key="rombel.id" :value="rombel.id">
                  {{ rombel.name }}
                </option>
              </select>
            </div>

            <!-- Peserta Didik -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Peserta Didik <span class="text-red-600">*</span>
              </label>
              <select
                v-model.number="filtersSiswa.peserta_didik_id"
                @change="loadDashboardSiswa"
                :disabled="!filtersSiswa.tahun_pelajaran_id || !filtersSiswa.rombel_id || isLoadingPesertaDidik"
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option :value="0" disabled>
                  {{ isLoadingPesertaDidik ? 'Memuat...' : 'Pilih Peserta Didik' }}
                </option>
                <option v-for="siswa in activePesertaDidikList" :key="siswa.id" :value="siswa.id">
                  {{ siswa.nis }} - {{ siswa.nama }}
                </option>
              </select>
            </div>

            <!-- Tanggal Mulai -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Tanggal Mulai <span class="text-red-600">*</span>
              </label>
              <input
                v-model="filtersSiswa.tanggal_mulai"
                type="date"
                @change="loadDashboardSiswa"
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
              />
            </div>

            <!-- Tanggal Selesai -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Tanggal Selesai <span class="text-red-600">*</span>
              </label>
              <input
                v-model="filtersSiswa.tanggal_selesai"
                type="date"
                @change="loadDashboardSiswa"
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
              />
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoadingDashboardSiswa" class="flex items-center justify-center py-12">
          <div class="flex flex-col items-center gap-3">
            <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
            <p class="text-sm text-gray-600 font-medium">Memuat dashboard siswa...</p>
          </div>
        </div>

        <!-- Dashboard Siswa Content -->
        <div v-else-if="dashboardSiswaData" class="space-y-6">
          <!-- Profil Siswa Card -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6">
            <div class="flex items-center gap-4">
              <div class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {{ dashboardSiswaData.siswa.nama.charAt(0) }}
              </div>
              <div class="flex-1">
                <h3 class="text-2xl font-bold text-gray-900">{{ dashboardSiswaData.siswa.nama }}</h3>
                <div class="flex flex-wrap gap-3 mt-2">
                  <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold">
                    <i class="fa-solid fa-id-card text-xs"></i>
                    NIS: {{ dashboardSiswaData.siswa.nis }}
                  </span>
                  <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-semibold">
                    <i class="fa-solid fa-users text-xs"></i>
                    {{ dashboardSiswaData.siswa.rombel_nama }}
                  </span>
                  <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold"
                    :class="{
                      'bg-pink-100 text-pink-800': dashboardSiswaData.siswa.jenis_kelamin === 'P',
                      'bg-cyan-100 text-cyan-800': dashboardSiswaData.siswa.jenis_kelamin === 'L'
                    }"
                  >
                    <i class="fa-solid" :class="dashboardSiswaData.siswa.jenis_kelamin === 'P' ? 'fa-venus' : 'fa-mars'"></i>
                    {{ dashboardSiswaData.siswa.jenis_kelamin === 'P' ? 'Perempuan' : 'Laki-laki' }}
                  </span>
                </div>
              </div>
              <div class="text-right">
                <div class="text-5xl font-bold"
                  :class="{
                    'text-green-600': dashboardSiswaData.summary.persentase_hadir >= 90,
                    'text-yellow-600': dashboardSiswaData.summary.persentase_hadir >= 75 && dashboardSiswaData.summary.persentase_hadir < 90,
                    'text-red-600': dashboardSiswaData.summary.persentase_hadir < 75
                  }"
                >
                  {{ dashboardSiswaData.summary.persentase_hadir.toFixed(1) }}%
                </div>
                <p class="text-sm font-semibold mt-1"
                  :class="{
                    'text-green-700': dashboardSiswaData.summary.persentase_hadir >= 90,
                    'text-yellow-700': dashboardSiswaData.summary.persentase_hadir >= 75 && dashboardSiswaData.summary.persentase_hadir < 90,
                    'text-red-700': dashboardSiswaData.summary.persentase_hadir < 75
                  }"
                >
                  {{ dashboardSiswaData.summary.status_kehadiran }}
                </p>
              </div>
            </div>
          </div>

          <!-- Summary Cards -->
          <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <!-- Total Pertemuan -->
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                  <i class="fa-solid fa-calendar-days text-white"></i>
                </div>
                <div>
                  <p class="text-xs text-blue-600 font-semibold">Pertemuan</p>
                  <p class="text-2xl font-bold text-blue-900">{{ dashboardSiswaData.summary.total_pertemuan }}</p>
                </div>
              </div>
            </div>

            <!-- Hadir -->
            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                  <i class="fa-solid fa-check text-white"></i>
                </div>
                <div>
                  <p class="text-xs text-green-600 font-semibold">Hadir</p>
                  <p class="text-2xl font-bold text-green-900">{{ dashboardSiswaData.summary.total_hadir }}</p>
                </div>
              </div>
            </div>

            <!-- Sakit -->
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                  <i class="fa-solid fa-notes-medical text-white"></i>
                </div>
                <div>
                  <p class="text-xs text-blue-600 font-semibold">Sakit</p>
                  <p class="text-2xl font-bold text-blue-900">{{ dashboardSiswaData.summary.total_sakit }}</p>
                </div>
              </div>
            </div>

            <!-- Izin -->
            <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border-2 border-yellow-200">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center">
                  <i class="fa-solid fa-hand-paper text-white"></i>
                </div>
                <div>
                  <p class="text-xs text-yellow-600 font-semibold">Izin</p>
                  <p class="text-2xl font-bold text-yellow-900">{{ dashboardSiswaData.summary.total_izin }}</p>
                </div>
              </div>
            </div>

            <!-- Alpa -->
            <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border-2 border-red-200">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center">
                  <i class="fa-solid fa-times text-white"></i>
                </div>
                <div>
                  <p class="text-xs text-red-600 font-semibold">Alpa</p>
                  <p class="text-2xl font-bold text-red-900">{{ dashboardSiswaData.summary.total_alpa }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Grafik Kehadiran -->
          <div class="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
            <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b-2 border-gray-200">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <i class="fa-solid fa-chart-line text-red-600"></i>
                  Grafik Kehadiran
                </h3>
                <select
                  v-model="filtersSiswa.periode"
                  @change="loadDashboardSiswa"
                  class="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm font-semibold"
                >
                  <option value="harian">Harian</option>
                  <option value="mingguan">Mingguan</option>
                  <option value="bulanan">Bulanan</option>
                </select>
              </div>
            </div>
            <div class="p-6">
              <div class="h-80">
                <Line :data="grafikSiswaData" :options="chartOptions" />
              </div>
            </div>
          </div>

          <!-- Riwayat Absensi -->
          <div class="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
            <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b-2 border-gray-200">
              <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                <i class="fa-solid fa-history text-red-600"></i>
                Riwayat Absensi
              </h3>
            </div>
            <div class="p-6">
              <div v-if="dashboardSiswaData.riwayat_absensi.length > 0" class="space-y-3">
                <div 
                  v-for="(riwayat, index) in dashboardSiswaData.riwayat_absensi" 
                  :key="index"
                  class="flex items-center gap-4 p-4 rounded-lg border-2 transition-all hover:shadow-md"
                  :class="{
                    'bg-green-50 border-green-200': riwayat.status === 'hadir',
                    'bg-blue-50 border-blue-200': riwayat.status === 'sakit',
                    'bg-yellow-50 border-yellow-200': riwayat.status === 'izin',
                    'bg-red-50 border-red-200': riwayat.status === 'alpa'
                  }"
                >
                  <div class="w-12 h-12 rounded-full flex items-center justify-center"
                    :class="{
                      'bg-green-500': riwayat.status === 'hadir',
                      'bg-blue-500': riwayat.status === 'sakit',
                      'bg-yellow-500': riwayat.status === 'izin',
                      'bg-red-500': riwayat.status === 'alpa'
                    }"
                  >
                    <i class="fa-solid text-white"
                      :class="{
                        'fa-check': riwayat.status === 'hadir',
                        'fa-notes-medical': riwayat.status === 'sakit',
                        'fa-hand-paper': riwayat.status === 'izin',
                        'fa-times': riwayat.status === 'alpa'
                      }"
                    ></i>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <h4 class="font-bold text-gray-900">{{ riwayat.hari }}, {{ riwayat.tanggal }}</h4>
                      <span class="px-2 py-1 rounded text-xs font-bold uppercase"
                        :class="{
                          'bg-green-200 text-green-800': riwayat.status === 'hadir',
                          'bg-blue-200 text-blue-800': riwayat.status === 'sakit',
                          'bg-yellow-200 text-yellow-800': riwayat.status === 'izin',
                          'bg-red-200 text-red-800': riwayat.status === 'alpa'
                        }"
                      >
                        {{ riwayat.status }}
                      </span>
                    </div>
                    <div class="flex flex-wrap gap-3 text-sm text-gray-600">
                      <span><i class="fa-solid fa-clock mr-1"></i>{{ riwayat.waktu_absen }}</span>
                      <span><i class="fa-solid fa-hashtag mr-1"></i>Pertemuan {{ riwayat.pertemuan_ke }}</span>
                      <span><i class="fa-solid fa-keyboard mr-1"></i>{{ riwayat.metode_input }}</span>
                    </div>
                    <p v-if="riwayat.keterangan" class="text-sm text-gray-700 mt-1 italic">
                      <i class="fa-solid fa-comment mr-1"></i>{{ riwayat.keterangan }}
                    </p>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-8 text-gray-500">
                <i class="fa-solid fa-inbox text-4xl mb-2"></i>
                <p>Belum ada riwayat absensi</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center py-12">
          <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <i class="fa-solid fa-user-graduate text-2xl text-gray-400"></i>
          </div>
          <h3 class="text-base font-semibold text-gray-900 mb-1">Pilih Siswa</h3>
          <p class="text-sm text-gray-600">Pilih filter untuk melihat dashboard siswa</p>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Line, Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { useRombelStore } from '~/stores/RombelStore'
import { useTahunPelajaranStore } from '~/stores/TahunPelajaranStore'
import { useBidangStudiStore } from '~/stores/BidangStudiStore'
import { usePesertaDidikStore } from '~/stores/PesertaDidikStore'
import { getDashboardSummary, getGrafikKehadiran, getStatistikPerHari, getPerbandinganRombel, getSiswaTerendah, getDashboardSiswa } from '~/services/absensi'
import DashboardLayout from '~/components/DashboardLayout.vue'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

useHead({
  title: 'Monitoring Kehadiran | Pintu SDN Sukapura 01'
})

const rombelStore = useRombelStore()
const tahunPelajaranStore = useTahunPelajaranStore()
const bidangStudiStore = useBidangStudiStore()
const pesertaDidikStore = usePesertaDidikStore()

// State
const activeTab = ref('dashboard-umum')
const dashboardType = ref<'guru-kelas' | 'guru-mapel'>('guru-kelas')
const dashboardSiswaType = ref<'guru-kelas' | 'guru-mapel'>('guru-kelas')
const isLoading = ref(false)
const isLoadingChart = ref(false)

const rombelList = ref<any[]>([])
const tahunPelajaranList = ref<any[]>([])
const bidangStudiList = ref<any[]>([])
const pesertaDidikList = ref<any[]>([])
const dashboardData = ref<any>(null)
const chartData = ref<any>(null)
const statistikPerHariData = ref<any>(null)
const perbandinganRombelData = ref<any>(null)
const siswaTerendahData = ref<any>(null)
const dashboardSiswaData = ref<any>(null)
const isLoadingStatistik = ref(false)
const isLoadingPerbandingan = ref(false)
const isLoadingSiswaTerendah = ref(false)
const isLoadingDashboardSiswa = ref(false)
const isLoadingPesertaDidik = ref(false)

// Get current date
const today = new Date()
const currentMonth = today.getMonth() + 1 // 1-12
const currentYear = today.getFullYear()
// Semester 1: Juli-Desember (7-12), Semester 2: Januari-Juni (1-6)
const defaultSemester = currentMonth >= 7 && currentMonth <= 12 ? 1 : 2

// Get first and last day of current month
const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1)
const lastDayOfMonth = new Date(currentYear, currentMonth, 0)

const filters = ref({
  tahun_pelajaran_id: 0,
  semester: defaultSemester,
  rombel_id: null as number | null,
  bidang_studi_id: 0,
  periode: 'harian',
  tanggal_mulai: firstDayOfMonth.toISOString().split('T')[0],
  tanggal_selesai: lastDayOfMonth.toISOString().split('T')[0],
  bulan: currentMonth,
  tahun: currentYear,
  limit: 10
})

const filtersSiswa = ref({
  tahun_pelajaran_id: 0,
  semester: defaultSemester,
  rombel_id: 0,
  bidang_studi_id: 0,
  peserta_didik_id: 0,
  periode: 'harian',
  tanggal_mulai: firstDayOfMonth.toISOString().split('T')[0],
  tanggal_selesai: lastDayOfMonth.toISOString().split('T')[0]
})

// Computed
const activeRombelList = computed(() => {
  return rombelList.value.filter((r: any) => r.status === 'active')
})

const activeTahunPelajaranList = computed(() => {
  return tahunPelajaranList.value.filter((t: any) => t.status === 'active')
})

const activeBidangStudiList = computed(() => {
  return bidangStudiList.value.filter((b: any) => b.status === 'active')
})

const activePesertaDidikList = computed(() => {
  return pesertaDidikList.value.filter((p: any) => p.status === 'active')
})

// Format grafik bulanan siswa for Line chart
const grafikSiswaData = computed(() => {
  if (!dashboardSiswaData.value?.grafik) return null
  
  return {
    labels: dashboardSiswaData.value.grafik.labels,
    datasets: [
      {
        label: 'Hadir',
        data: dashboardSiswaData.value.grafik.hadir,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#22c55e',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Sakit',
        data: dashboardSiswaData.value.grafik.sakit,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Izin',
        data: dashboardSiswaData.value.grafik.izin,
        borderColor: '#eab308',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#eab308',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Alpa',
        data: dashboardSiswaData.value.grafik.alpa,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#ef4444',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  }
})

// Format chart data for Chart.js
const chartDataFormatted = computed(() => {
  if (!chartData.value) return null
  
  return {
    labels: chartData.value.labels,
    datasets: [
      {
        label: 'Hadir',
        data: chartData.value.datasets[0].data,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#22c55e',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Sakit',
        data: chartData.value.datasets[1].data,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Izin',
        data: chartData.value.datasets[2].data,
        borderColor: '#eab308',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#eab308',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Alpa',
        data: chartData.value.datasets[3].data,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#ef4444',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  }
})

// Chart.js options
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        padding: 15,
        font: {
          size: 13,
          weight: '600',
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: {
        size: 14,
        weight: 'bold',
      },
      bodyFont: {
        size: 13,
      },
      callbacks: {
        label: function(context: any) {
          return `${context.dataset.label}: ${context.parsed.y} siswa`
        }
      }
    },
  },
  scales: {
    x: {
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.05)',
      },
      ticks: {
        font: {
          size: 11,
          weight: '500',
        },
        maxRotation: 45,
        minRotation: 45,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.05)',
      },
      ticks: {
        font: {
          size: 12,
          weight: '500',
        },
        stepSize: 5,
        callback: function(value: any) {
          return value
        }
      },
    },
  },
}))

// Format statistik per hari data for Bar chart
const statistikBarData = computed(() => {
  if (!statistikPerHariData.value) return null
  
  return {
    labels: statistikPerHariData.value.data.map((item: any) => item.hari),
    datasets: [
      {
        label: 'Persentase Kehadiran (%)',
        data: statistikPerHariData.value.data.map((item: any) => item.persentase_hadir),
        backgroundColor: statistikPerHariData.value.data.map((item: any) => {
          if (item.persentase_hadir >= 90) return 'rgba(34, 197, 94, 0.8)' // green
          if (item.persentase_hadir >= 75) return 'rgba(234, 179, 8, 0.8)' // yellow
          return 'rgba(239, 68, 68, 0.8)' // red
        }),
        borderColor: statistikPerHariData.value.data.map((item: any) => {
          if (item.persentase_hadir >= 90) return '#22c55e'
          if (item.persentase_hadir >= 75) return '#eab308'
          return '#ef4444'
        }),
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  }
})

// Bar chart options for statistik per hari (horizontal)
const barChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: {
        size: 14,
        weight: 'bold',
      },
      bodyFont: {
        size: 13,
      },
      callbacks: {
        label: function(context: any) {
          return `Kehadiran: ${context.parsed.x.toFixed(2)}%`
        }
      }
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      max: 100,
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.05)',
      },
      ticks: {
        font: {
          size: 12,
          weight: '500',
        },
        callback: function(value: any) {
          return value + '%'
        }
      },
    },
    y: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 13,
          weight: '600',
        },
      },
    },
  },
}))

// Bar chart options for perbandingan rombel (vertical)
const perbandinganBarChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: {
        size: 14,
        weight: 'bold',
      },
      bodyFont: {
        size: 13,
      },
      callbacks: {
        label: function(context: any) {
          return `Kehadiran: ${context.parsed.y.toFixed(2)}%`
        }
      }
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 13,
          weight: '600',
        },
      },
    },
    y: {
      beginAtZero: true,
      max: 100,
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.05)',
      },
      ticks: {
        font: {
          size: 12,
          weight: '500',
        },
        callback: function(value: any) {
          return value + '%'
        }
      },
    },
  },
}))

// Format perbandingan rombel data for Bar chart
const perbandinganBarData = computed(() => {
  if (!perbandinganRombelData.value) return null
  
  // Sort by persentase_hadir descending
  const sortedData = [...perbandinganRombelData.value.data].sort((a, b) => b.persentase_hadir - a.persentase_hadir)
  
  return {
    labels: sortedData.map((item: any) => item.rombel_nama),
    datasets: [
      {
        label: 'Persentase Kehadiran (%)',
        data: sortedData.map((item: any) => item.persentase_hadir),
        backgroundColor: sortedData.map((item: any) => {
          if (item.persentase_hadir >= 90) return 'rgba(34, 197, 94, 0.8)' // green
          if (item.persentase_hadir >= 75) return 'rgba(234, 179, 8, 0.8)' // yellow
          return 'rgba(239, 68, 68, 0.8)' // red
        }),
        borderColor: sortedData.map((item: any) => {
          if (item.persentase_hadir >= 90) return '#22c55e'
          if (item.persentase_hadir >= 75) return '#eab308'
          return '#ef4444'
        }),
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  }
})

// Get sorted rombel data for cards
const sortedRombelData = computed(() => {
  if (!perbandinganRombelData.value) return []
  return [...perbandinganRombelData.value.data].sort((a, b) => b.persentase_hadir - a.persentase_hadir)
})

// Methods
const getPercentage = (value: number) => {
  if (!dashboardData.value) return 0
  const total = dashboardData.value.summary.total_hadir + 
                dashboardData.value.summary.total_sakit + 
                dashboardData.value.summary.total_izin + 
                dashboardData.value.summary.total_alpa
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

const loadRombelList = async () => {
  try {
    const result = await rombelStore.fetchRombels(1, 100, { status: 'active' })
    if (result.success) {
      rombelList.value = rombelStore.rombels
    }
  } catch (err) {
    console.error('Error loading rombel:', err)
  }
}

const loadTahunPelajaranList = async () => {
  try {
    const result = await tahunPelajaranStore.fetchTahunPelajarans(1, 100)
    if (result.success) {
      tahunPelajaranList.value = tahunPelajaranStore.tahunPelajarans
      // Set default to active tahun pelajaran
      const activeTahun = activeTahunPelajaranList.value[0]
      if (activeTahun) {
        filters.value.tahun_pelajaran_id = activeTahun.id
      }
    }
  } catch (err) {
    console.error('Error loading tahun pelajaran:', err)
  }
}

const loadBidangStudiList = async () => {
  try {
    const result = await bidangStudiStore.fetchBidangStudis(1, 100, { status: 'active' })
    if (result.success) {
      bidangStudiList.value = bidangStudiStore.bidangStudis
    }
  } catch (err) {
    console.error('Error loading bidang studi:', err)
  }
}

const loadDashboard = async () => {
  // Validate required fields
  if (!filters.value.tahun_pelajaran_id) {
    dashboardData.value = null
    return
  }

  if (dashboardType.value === 'guru-mapel' && !filters.value.bidang_studi_id) {
    dashboardData.value = null
    return
  }

  isLoading.value = true
  try {
    const requestData: any = {
      tahun_pelajaran_id: filters.value.tahun_pelajaran_id,
      semester: filters.value.semester,
      rombel_id: filters.value.rombel_id,
      tanggal_mulai: filters.value.tanggal_mulai,
      tanggal_selesai: filters.value.tanggal_selesai
    }

    // Add bidang_studi_id only for guru mapel
    if (dashboardType.value === 'guru-mapel') {
      requestData.bidang_studi_id = filters.value.bidang_studi_id
    } else {
      requestData.bidang_studi_id = null
    }

    const response = await getDashboardSummary(requestData)
    dashboardData.value = response.data || null
  } catch (err) {
    console.error('Error loading dashboard:', err)
    dashboardData.value = null
  } finally {
    isLoading.value = false
  }
}

const loadChart = async () => {
  // Validate required fields
  if (!filters.value.tahun_pelajaran_id) {
    chartData.value = null
    return
  }

  if (dashboardType.value === 'guru-mapel' && !filters.value.bidang_studi_id) {
    chartData.value = null
    return
  }

  isLoadingChart.value = true
  try {
    const requestData: any = {
      tahun_pelajaran_id: filters.value.tahun_pelajaran_id,
      semester: filters.value.semester,
      rombel_id: filters.value.rombel_id,
      periode: filters.value.periode,
      tanggal_mulai: filters.value.tanggal_mulai,
      tanggal_selesai: filters.value.tanggal_selesai
    }

    // Add bidang_studi_id only for guru mapel
    if (dashboardType.value === 'guru-mapel') {
      requestData.bidang_studi_id = filters.value.bidang_studi_id
    } else {
      requestData.bidang_studi_id = null
    }

    const response = await getGrafikKehadiran(requestData)
    chartData.value = response.data || null
  } catch (err) {
    console.error('Error loading chart:', err)
    chartData.value = null
  } finally {
    isLoadingChart.value = false
  }
}

const loadStatistikPerHari = async () => {
  // Validate required fields
  if (!filters.value.tahun_pelajaran_id) {
    statistikPerHariData.value = null
    return
  }

  if (dashboardType.value === 'guru-mapel' && !filters.value.bidang_studi_id) {
    statistikPerHariData.value = null
    return
  }

  isLoadingStatistik.value = true
  try {
    const requestData: any = {
      tahun_pelajaran_id: filters.value.tahun_pelajaran_id,
      semester: filters.value.semester,
      rombel_id: filters.value.rombel_id,
      bulan: filters.value.bulan,
      tahun: filters.value.tahun
    }

    // Add bidang_studi_id only for guru mapel
    if (dashboardType.value === 'guru-mapel') {
      requestData.bidang_studi_id = filters.value.bidang_studi_id
    } else {
      requestData.bidang_studi_id = null
    }

    const response = await getStatistikPerHari(requestData)
    statistikPerHariData.value = response.data || null
  } catch (err) {
    console.error('Error loading statistik per hari:', err)
    statistikPerHariData.value = null
  } finally {
    isLoadingStatistik.value = false
  }
}

const loadPerbandinganRombel = async () => {
  // Validate required fields
  if (!filters.value.tahun_pelajaran_id) {
    perbandinganRombelData.value = null
    return
  }

  if (dashboardType.value === 'guru-mapel' && !filters.value.bidang_studi_id) {
    perbandinganRombelData.value = null
    return
  }

  isLoadingPerbandingan.value = true
  try {
    const requestData: any = {
      tahun_pelajaran_id: filters.value.tahun_pelajaran_id,
      semester: filters.value.semester,
      tanggal_mulai: filters.value.tanggal_mulai,
      tanggal_selesai: filters.value.tanggal_selesai
    }

    // Add bidang_studi_id only for guru mapel
    if (dashboardType.value === 'guru-mapel') {
      requestData.bidang_studi_id = filters.value.bidang_studi_id
    } else {
      requestData.bidang_studi_id = null
    }

    const response = await getPerbandinganRombel(requestData)
    perbandinganRombelData.value = response.data || null
  } catch (err) {
    console.error('Error loading perbandingan rombel:', err)
    perbandinganRombelData.value = null
  } finally {
    isLoadingPerbandingan.value = false
  }
}

const loadSiswaTerendah = async () => {
  // Validate required fields
  if (!filters.value.tahun_pelajaran_id) {
    siswaTerendahData.value = null
    return
  }

  if (dashboardType.value === 'guru-mapel' && !filters.value.bidang_studi_id) {
    siswaTerendahData.value = null
    return
  }

  isLoadingSiswaTerendah.value = true
  try {
    const requestData: any = {
      tahun_pelajaran_id: filters.value.tahun_pelajaran_id,
      semester: filters.value.semester,
      rombel_id: filters.value.rombel_id,
      limit: filters.value.limit,
      tanggal_mulai: filters.value.tanggal_mulai,
      tanggal_selesai: filters.value.tanggal_selesai
    }

    // Add bidang_studi_id only for guru mapel
    if (dashboardType.value === 'guru-mapel') {
      requestData.bidang_studi_id = filters.value.bidang_studi_id
    } else {
      requestData.bidang_studi_id = null
    }

    const response = await getSiswaTerendah(requestData)
    siswaTerendahData.value = response.data || null
  } catch (err) {
    console.error('Error loading siswa terendah:', err)
    siswaTerendahData.value = null
  } finally {
    isLoadingSiswaTerendah.value = false
  }
}

const loadAllData = () => {
  loadDashboard()
  loadChart()
  loadStatistikPerHari()
  loadPerbandinganRombel()
  loadSiswaTerendah()
}

const loadPesertaDidikList = async () => {
  if (!filtersSiswa.value.tahun_pelajaran_id || !filtersSiswa.value.rombel_id) {
    pesertaDidikList.value = []
    return
  }

  isLoadingPesertaDidik.value = true
  try {
    const search = {
      tahun_pelajaran_id: filtersSiswa.value.tahun_pelajaran_id,
      rombel_id: filtersSiswa.value.rombel_id,
      status: 'active'
    }
    
    const result = await pesertaDidikStore.fetchPesertaDidik(search, 1, 1000)
    
    if (result.success) {
      pesertaDidikList.value = pesertaDidikStore.pesertaDidiks
    }
  } catch (err) {
    console.error('Error loading peserta didik:', err)
    pesertaDidikList.value = []
  } finally {
    isLoadingPesertaDidik.value = false
  }
}

const loadDashboardSiswa = async () => {
  // Validate required fields
  if (!filtersSiswa.value.tahun_pelajaran_id || !filtersSiswa.value.rombel_id || !filtersSiswa.value.peserta_didik_id) {
    dashboardSiswaData.value = null
    return
  }

  if (dashboardSiswaType.value === 'guru-mapel' && !filtersSiswa.value.bidang_studi_id) {
    dashboardSiswaData.value = null
    return
  }

  isLoadingDashboardSiswa.value = true
  try {
    const requestData: any = {
      peserta_didik_id: filtersSiswa.value.peserta_didik_id,
      tahun_pelajaran_id: filtersSiswa.value.tahun_pelajaran_id,
      rombel_id: filtersSiswa.value.rombel_id,
      semester: filtersSiswa.value.semester,
      periode: filtersSiswa.value.periode,
      tanggal_mulai: filtersSiswa.value.tanggal_mulai,
      tanggal_selesai: filtersSiswa.value.tanggal_selesai
    }

    // Add bidang_studi_id only for guru mapel
    if (dashboardSiswaType.value === 'guru-mapel') {
      requestData.bidang_studi_id = filtersSiswa.value.bidang_studi_id
    } else {
      requestData.bidang_studi_id = null
    }

    const response = await getDashboardSiswa(requestData)
    dashboardSiswaData.value = response.data || null
  } catch (err) {
    console.error('Error loading dashboard siswa:', err)
    dashboardSiswaData.value = null
  } finally {
    isLoadingDashboardSiswa.value = false
  }
}

// Watch dashboard type change
watch(dashboardType, () => {
  // Reset bidang_studi_id when switching to guru kelas
  if (dashboardType.value === 'guru-kelas') {
    filters.value.bidang_studi_id = 0
  }
  loadAllData()
})

// Watch dashboard siswa type change
watch(dashboardSiswaType, () => {
  // Reset bidang_studi_id when switching to guru kelas
  if (dashboardSiswaType.value === 'guru-kelas') {
    filtersSiswa.value.bidang_studi_id = 0
  }
  loadDashboardSiswa()
})

// Watch tahun pelajaran and rombel changes to load peserta didik
watch([() => filtersSiswa.value.tahun_pelajaran_id, () => filtersSiswa.value.rombel_id], () => {
  filtersSiswa.value.peserta_didik_id = 0
  dashboardSiswaData.value = null
  loadPesertaDidikList()
})

onMounted(async () => {
  await Promise.all([loadRombelList(), loadTahunPelajaranList(), loadBidangStudiList()])
  // Load dashboard after data is ready
  if (filters.value.tahun_pelajaran_id) {
    loadAllData()
  }
  // Set default values for filtersSiswa
  if (activeTahunPelajaranList.value.length > 0) {
    filtersSiswa.value.tahun_pelajaran_id = activeTahunPelajaranList.value[0].id
  }
})
</script>
