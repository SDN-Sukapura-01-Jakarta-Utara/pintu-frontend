<template>
  <DashboardLayout>
    <!-- Header Section -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Rekap Kehadiran</h1>
      <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
        Rekap kehadiran siswa per bulan sebagai guru kelas atau guru bidang studi
      </p>
    </div>

    <!-- Detail Absensi Modal -->
    <DetailAbsensiModal
      :is-open="isDetailModalOpen"
      :detail-data="selectedDetailData"
      :bidang-studi-nama="selectedBidangStudiNama"
      @close="closeDetailModal"
      @updated="handleDataUpdated"
    />

    <!-- Synchronize Absensi Modal -->
    <SynchronizeAbsensiModal
      :is-open="isSyncModalOpen"
      :tahun-pelajaran-id="syncConfig.tahun_pelajaran_id"
      :rombel-id="syncConfig.rombel_id"
      :bidang-studi-id="syncConfig.bidang_studi_id"
      :is-guru-mapel="syncConfig.is_guru_mapel"
      @close="closeSyncModal"
      @synchronized="handleSynchronized"
    />

    <!-- Create/Edit Absensi Modal -->
    <CreateEditAbsensiModal
      :is-open="isCreateModalOpen"
      :siswa-data="selectedSiswaData"
      :tanggal="selectedTanggal"
      :rombel-id="createConfig.rombel_id"
      :tahun-pelajaran-id="createConfig.tahun_pelajaran_id"
      :bidang-studi-id="createConfig.bidang_studi_id"
      :pertemuan-ke="createConfig.pertemuan_ke"
      @close="closeCreateModal"
      @created="handleAbsensiCreated"
    />

    <!-- Main Content -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <!-- Tabs -->
      <div v-if="showGuruKelasTab || showGuruMapelTab" class="border-b border-gray-200">
        <div class="px-4 sm:px-6">
          <div class="flex gap-1 overflow-x-auto -mb-px" style="scrollbar-width: thin;">
            <button
              v-if="showGuruKelasTab"
              @click="activeTab = 'guru-kelas'"
              :class="[
                'px-4 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 border-b-2 relative cursor-pointer',
                activeTab === 'guru-kelas'
                  ? 'text-red-600 border-b-red-600'
                  : 'text-gray-600 border-b-transparent hover:text-gray-900 hover:border-b-gray-300'
              ]"
            >
              <span class="flex items-center gap-2">
                <i class="fa-solid fa-chalkboard-user w-4 h-4"></i>
                Rekap Kehadiran sebagai Guru Kelas
              </span>
            </button>
            <button
              v-if="showGuruMapelTab"
              @click="activeTab = 'guru-mapel'"
              :class="[
                'px-4 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 border-b-2 relative cursor-pointer',
                activeTab === 'guru-mapel'
                  ? 'text-red-600 border-b-red-600'
                  : 'text-gray-600 border-b-transparent hover:text-gray-900 hover:border-b-gray-300'
              ]"
            >
              <span class="flex items-center gap-2">
                <i class="fa-solid fa-book-open w-4 h-4"></i>
                Rekap Kehadiran sebagai Guru Bidang Studi
              </span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- No Access Message -->
      <div v-else class="p-8 text-center">
        <div class="flex flex-col items-center justify-center py-12">
          <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <i class="fa-solid fa-exclamation-circle text-2xl text-gray-400"></i>
          </div>
          <h3 class="text-base font-semibold text-gray-900 mb-1">Akses Tidak Tersedia</h3>
          <p class="text-sm text-gray-600">Anda tidak memiliki akses untuk melihat rekap kehadiran. Hubungi administrator.</p>
        </div>
      </div>

      <!-- Tab Content: Guru Kelas -->
      <div v-if="showGuruKelasTab && activeTab === 'guru-kelas'" class="p-4 sm:p-6 md:p-8">
        <!-- Filter Section -->
        <div class="mb-6 pb-6 border-b border-gray-200">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <!-- Tahun Pelajaran -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Tahun Pelajaran <span class="text-red-600">*</span>
              </label>
              <select
                v-model.number="filterKelas.tahun_pelajaran_id"
                @change="loadRekapKelas"
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
              >
                <option :value="0" disabled>Pilih Tahun Pelajaran</option>
                <option v-for="tahun in activeTahunPelajaranList" :key="tahun.id" :value="tahun.id">
                  {{ tahun.tahun_pelajaran }}
                </option>
              </select>
            </div>

            <!-- Rombel -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Rombel <span class="text-red-600">*</span>
              </label>
              <div class="flex gap-2">
                <select
                  v-model.number="filterKelas.rombel_id"
                  @change="loadRekapKelas"
                  class="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                >
                  <option :value="0" disabled>Pilih Rombel</option>
                  <option v-for="rombel in activeRombelList" :key="rombel.id" :value="rombel.id">
                    {{ rombel.name }}
                  </option>
                </select>
                <button
                  @click="openSyncModal(false)"
                  :disabled="!filterKelas.tahun_pelajaran_id || !filterKelas.rombel_id"
                  class="px-3 py-[9px] bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg text-white font-medium rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap text-xs"
                  title="Synchronize Data"
                >
                  <i class="fa-solid fa-sync text-xs"></i>
                  <span>Sync Data</span>
                </button>
                <button
                  @click="downloadExcel(false)"
                  :disabled="!filterKelas.tahun_pelajaran_id || !filterKelas.rombel_id || isDownloading"
                  class="px-3 py-[9px] bg-gradient-to-r from-green-600 to-green-700 hover:shadow-lg text-white font-medium rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap text-xs"
                  title="Download Excel"
                >
                  <i class="fa-solid fa-download text-xs"></i>
                  <span>{{ isDownloading ? 'Downloading...' : 'Download Excel' }}</span>
                </button>
                <button
                  @click="downloadPdf(false)"
                  :disabled="!filterKelas.tahun_pelajaran_id || !filterKelas.rombel_id || isDownloading"
                  class="px-3 py-[9px] bg-gradient-to-r from-red-600 to-red-700 hover:shadow-lg text-white font-medium rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap text-xs"
                  title="Download PDF"
                >
                  <i class="fa-solid fa-file-pdf text-xs"></i>
                  <span>{{ isDownloading ? 'Downloading...' : 'Download PDF' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Month Navigation -->
        <div v-if="rekapDataKelas" class="mb-6 flex items-center justify-between">
          <button
            @click="prevMonth('kelas')"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-sm cursor-pointer transition-colors"
          >
            <i class="fa-solid fa-chevron-left mr-2"></i>
            Bulan Sebelumnya
          </button>
          <h3 class="text-lg font-bold text-gray-900">
            {{ getMonthName(filterKelas.bulan) }} {{ filterKelas.tahun }}
          </h3>
          <button
            @click="nextMonth('kelas')"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-sm cursor-pointer transition-colors"
          >
            Bulan Selanjutnya
            <i class="fa-solid fa-chevron-right ml-2"></i>
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <div class="flex flex-col items-center gap-3">
            <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
            <p class="text-sm text-gray-600 font-medium">Memuat data rekap...</p>
          </div>
        </div>

        <!-- Rekap Table -->
        <div v-else-if="rekapDataKelas" class="overflow-x-auto">
          <table class="w-full border-collapse text-xs">
            <thead>
              <tr style="background-color: #1f2937;">
                <th rowspan="2" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white;">NO</th>
                <th rowspan="2" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white;">NAMA SISWA</th>
                <th rowspan="2" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white;">P/L</th>
                <th :colspan="daysInMonth" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white;">
                  {{ getMonthName(filterKelas.bulan).toUpperCase() }}
                </th>
                <th colspan="3" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white;">JUMLAH ABSEN</th>
                <th rowspan="2" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white;">JUMLAH</th>
              </tr>
              <tr style="background-color: #1f2937;">
                <th v-for="day in daysInMonth" :key="day" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white; min-width: 40px;">
                  {{ day }}
                </th>
                <th class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white; min-width: 40px;">S</th>
                <th class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white; min-width: 40px;">I</th>
                <th class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white; min-width: 40px;">A</th>
              </tr>
            </thead>
            <tbody v-if="rekapDataKelas.data_siswa && rekapDataKelas.data_siswa.length > 0">
              <tr v-for="(siswa, index) in rekapDataKelas.data_siswa" :key="siswa.peserta_didik_id" class="hover:bg-gray-50">
                <td class="px-2 py-2 text-center border border-gray-200">{{ Number(index) + 1 }}</td>
                <td class="px-2 py-2 border border-gray-200">{{ siswa.nama }}</td>
                <td class="px-2 py-2 text-center border border-gray-200">{{ siswa.jenis_kelamin }}</td>
                <td 
                  v-for="day in daysInMonth" 
                  :key="day" 
                  :class="[
                    'px-2 py-2 text-center border font-semibold', 
                    getStatusForDate(siswa, day).color,
                    (getStatusForDate(siswa, day).hasData || getStatusForDate(siswa, day).hasAnyRecords) ? 'border-gray-200 cursor-pointer hover:border-gray-900 hover:border-2 transition-all' : 'border-gray-200'
                  ]" 
                  style="min-width: 40px;"
                  @click="handleCellClick(siswa, getStatusForDate(siswa, day), day)"
                >
                  {{ getStatusForDate(siswa, day).text }}
                </td>
                <td class="px-2 py-2 text-center border border-gray-200 font-semibold" style="min-width: 40px;">{{ siswa.total_sakit }}</td>
                <td class="px-2 py-2 text-center border border-gray-200 font-semibold" style="min-width: 40px;">{{ siswa.total_izin }}</td>
                <td class="px-2 py-2 text-center border border-gray-200 font-semibold" style="min-width: 40px;">{{ siswa.total_alpa }}</td>
                <td class="px-2 py-2 text-center border border-gray-200 font-bold bg-gray-50">{{ siswa.total_absen }}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td :colspan="daysInMonth + 7" class="px-4 py-8 text-center text-gray-500">
                  Belum ada data siswa
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center py-12">
          <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <i class="fa-solid fa-calendar-xmark text-2xl text-gray-400"></i>
          </div>
          <h3 class="text-base font-semibold text-gray-900 mb-1">Belum ada data rekap</h3>
          <p class="text-sm text-gray-600">Pilih tahun pelajaran dan rombel untuk melihat rekap kehadiran</p>
        </div>
      </div>

      <!-- Tab Content: Guru Mapel -->
      <div v-if="showGuruMapelTab && activeTab === 'guru-mapel'" class="p-4 sm:p-6 md:p-8">
        <!-- Filter Section -->
        <div class="mb-6 pb-6 border-b border-gray-200">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <!-- Bidang Studi -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Bidang Studi <span class="text-red-600">*</span>
              </label>
              <select
                v-model.number="filterMapel.bidang_studi_id"
                @change="loadRekapMapel"
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
                v-model.number="filterMapel.tahun_pelajaran_id"
                @change="loadRekapMapel"
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
              >
                <option :value="0" disabled>Pilih Tahun Pelajaran</option>
                <option v-for="tahun in activeTahunPelajaranList" :key="tahun.id" :value="tahun.id">
                  {{ tahun.tahun_pelajaran }}
                </option>
              </select>
            </div>

            <!-- Rombel -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Rombel <span class="text-red-600">*</span>
              </label>
              <select
                v-model.number="filterMapel.rombel_id"
                @change="loadRekapMapel"
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
              >
                <option :value="0" disabled>Pilih Rombel</option>
                <option v-for="rombel in activeRombelList" :key="rombel.id" :value="rombel.id">
                  {{ rombel.name }}
                </option>
              </select>
            </div>

            <!-- Tampilan Dropdown -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Tampilan <span class="text-red-600">*</span>
              </label>
              <select
                v-model="filterMapel.view_type"
                @change="changeViewType"
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
              >
                <option value="per_bulan">Per Bulan</option>
                <option value="per_semester">Per Semester</option>
              </select>
            </div>

            <!-- Semester Dropdown (conditional) -->
            <div v-if="filterMapel.view_type === 'per_semester'">
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Semester <span class="text-red-600">*</span>
              </label>
              <select
                v-model.number="filterMapel.semester"
                @change="loadRekapMapel"
                class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
              >
                <option :value="1">Semester 1 (Juli - Desember)</option>
                <option :value="2">Semester 2 (Januari - Juni)</option>
              </select>
            </div>
          </div>

          <!-- Action Buttons Row -->
          <div class="mt-4 flex gap-2">
            <button
              @click="openSyncModal(true)"
              :disabled="!filterMapel.tahun_pelajaran_id || !filterMapel.rombel_id || !filterMapel.bidang_studi_id"
              class="px-3 py-[9px] bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg text-white font-medium rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap text-xs"
              title="Synchronize Data"
            >
              <i class="fa-solid fa-sync text-xs"></i>
              <span>Sync Data</span>
            </button>
            <button
              @click="downloadExcel(true)"
              :disabled="!filterMapel.tahun_pelajaran_id || !filterMapel.rombel_id || !filterMapel.bidang_studi_id || isDownloading"
              class="px-3 py-[9px] bg-gradient-to-r from-green-600 to-green-700 hover:shadow-lg text-white font-medium rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap text-xs"
              title="Download Excel"
            >
              <i class="fa-solid fa-download text-xs"></i>
              <span>{{ isDownloading ? 'Downloading...' : 'Download Excel' }}</span>
            </button>
            <button
              @click="downloadPdf(true)"
              :disabled="!filterMapel.tahun_pelajaran_id || !filterMapel.rombel_id || !filterMapel.bidang_studi_id || isDownloading"
              class="px-3 py-[9px] bg-gradient-to-r from-red-600 to-red-700 hover:shadow-lg text-white font-medium rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap text-xs"
              title="Download PDF"
            >
              <i class="fa-solid fa-file-pdf text-xs"></i>
              <span>{{ isDownloading ? 'Downloading...' : 'Download PDF' }}</span>
            </button>
          </div>
        </div>

        <!-- Month Navigation (only for per_bulan) -->
        <div v-if="rekapDataMapel && filterMapel.view_type === 'per_bulan'" class="mb-6 flex items-center justify-between">
          <button
            @click="prevMonth('mapel')"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-sm cursor-pointer transition-colors"
          >
            <i class="fa-solid fa-chevron-left mr-2"></i>
            Bulan Sebelumnya
          </button>
          <h3 class="text-lg font-bold text-gray-900">
            {{ getMonthName(filterMapel.bulan!) }} {{ filterMapel.tahun }}
          </h3>
          <button
            @click="nextMonth('mapel')"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-sm cursor-pointer transition-colors"
          >
            Bulan Selanjutnya
            <i class="fa-solid fa-chevron-right ml-2"></i>
          </button>
        </div>

        <!-- Semester Display (only for per_semester) -->
        <div v-if="rekapDataMapel && filterMapel.view_type === 'per_semester'" class="mb-6 text-center">
          <h3 class="text-lg font-bold text-gray-900">
            Semester {{ filterMapel.semester }} - Tahun {{ filterMapel.tahun }}
          </h3>
          <p class="text-sm text-gray-600 mt-1">
            {{ filterMapel.semester === 1 ? 'Juli - Desember' : 'Januari - Juni' }}
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <div class="flex flex-col items-center gap-3">
            <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
            <p class="text-sm text-gray-600 font-medium">Memuat data rekap...</p>
          </div>
        </div>

        <!-- Rekap Table -->
        <div v-else-if="rekapDataMapel" class="overflow-x-auto">
          <table class="w-full border-collapse text-xs">
            <thead>
              <!-- Row 1: Month Names -->
              <tr style="background-color: #1f2937;">
                <th rowspan="3" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white;">NO</th>
                <th rowspan="3" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white;">NAMA SISWA</th>
                <th rowspan="3" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white;">P/L</th>
                <th v-for="month in getMonthsStructureMapel" :key="month.monthKey" :colspan="month.columns.length" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white;">
                  {{ month.monthName.toUpperCase() }}
                </th>
                <th colspan="3" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white;">JUMLAH ABSEN</th>
                <th rowspan="3" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white;">JUMLAH</th>
              </tr>
              <!-- Row 2: Pertemuan Ke -->
              <tr style="background-color: #1f2937;">
                <th v-for="(dateInfo, idx) in getDateListMapel" :key="idx" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white; min-width: 40px;">
                  {{ dateInfo.pertemuan_ke ? `P${dateInfo.pertemuan_ke}` : '-' }}
                </th>
                <th rowspan="2" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white; min-width: 40px;">S</th>
                <th rowspan="2" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white; min-width: 40px;">I</th>
                <th rowspan="2" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white; min-width: 40px;">A</th>
              </tr>
              <!-- Row 3: Date Numbers -->
              <tr style="background-color: #1f2937;">
                <th v-for="(dateInfo, idx) in getDateListMapel" :key="idx" class="px-2 py-2 text-center font-semibold border border-gray-700" style="color: white; min-width: 40px;">
                  {{ dateInfo.day || '-' }}
                </th>
              </tr>
            </thead>
            <tbody v-if="rekapDataMapel.data_siswa && rekapDataMapel.data_siswa.length > 0">
              <tr v-for="(siswa, index) in rekapDataMapel.data_siswa" :key="siswa.peserta_didik_id" class="hover:bg-gray-50">
                <td class="px-2 py-2 text-center border border-gray-200">{{ Number(index) + 1 }}</td>
                <td class="px-2 py-2 border border-gray-200">{{ siswa.nama }}</td>
                <td class="px-2 py-2 text-center border border-gray-200">{{ siswa.jenis_kelamin }}</td>
                <td 
                  v-for="(dateInfo, idx) in getDateListMapel" 
                  :key="idx" 
                  :class="[
                    'px-2 py-2 text-center border font-semibold', 
                    getStatusForDateMapel(siswa, dateInfo.date).color,
                    (getStatusForDateMapel(siswa, dateInfo.date).hasData || getStatusForDateMapel(siswa, dateInfo.date).hasAnyRecords) ? 'border-gray-200 cursor-pointer hover:border-gray-900 hover:border-2 transition-all' : 'border-gray-200'
                  ]" 
                  style="min-width: 40px;"
                  @click="handleCellClickMapel(siswa, getStatusForDateMapel(siswa, dateInfo.date), dateInfo, rekapDataMapel.bidang_studi_nama)"
                >
                  {{ getStatusForDateMapel(siswa, dateInfo.date).text }}
                </td>
                <td class="px-2 py-2 text-center border border-gray-200 font-semibold" style="min-width: 40px;">{{ siswa.total_sakit }}</td>
                <td class="px-2 py-2 text-center border border-gray-200 font-semibold" style="min-width: 40px;">{{ siswa.total_izin }}</td>
                <td class="px-2 py-2 text-center border border-gray-200 font-semibold" style="min-width: 40px;">{{ siswa.total_alpa }}</td>
                <td class="px-2 py-2 text-center border border-gray-200 font-bold bg-gray-50">{{ siswa.total_absen }}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td :colspan="getTotalDatesMapel + 7" class="px-4 py-8 text-center text-gray-500">
                  Belum ada data siswa
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center py-12">
          <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <i class="fa-solid fa-calendar-xmark text-2xl text-gray-400"></i>
          </div>
          <h3 class="text-base font-semibold text-gray-900 mb-1">Belum ada data rekap</h3>
          <p class="text-sm text-gray-600">Pilih bidang studi, tahun pelajaran, dan rombel untuk melihat rekap kehadiran</p>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRombelStore } from '~/stores/RombelStore'
import { useTahunPelajaranStore } from '~/stores/TahunPelajaranStore'
import { useBidangStudiStore } from '~/stores/BidangStudiStore'
import { useAuth } from '~/composables/useAuth'
import { getRekapAbsensi, exportExcelAbsensi, exportPdfAbsensi } from '~/services/absensi'
import { useToast } from '~/composables/useToast'
import DashboardLayout from '~/components/DashboardLayout.vue'
import DetailAbsensiModal from '~/components/modals/DetailAbsensiModal.vue'
import SynchronizeAbsensiModal from '~/components/modals/SynchronizeAbsensiModal.vue'
import CreateEditAbsensiModal from '~/components/modals/CreateEditAbsensiModal.vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

useHead({
  title: 'Rekap Kehadiran | PINTU SDN Sukapura 01',
  link: [
    {
      rel: 'icon',
      type: 'image/jpeg',
      href: '/logo-sekolah.jpg'
    }
  ]
})

const route = useRoute()
const { getCurrentUser } = useAuth()
const rombelStore = useRombelStore()
const tahunPelajaranStore = useTahunPelajaranStore()
const bidangStudiStore = useBidangStudiStore()

// Get current user data
const currentUser = getCurrentUser()

// Check if user is superadmin (user ID 1)
const isSuperAdmin = computed(() => currentUser?.id === 1)

// Determine which tabs to show based on jabatan
const showGuruKelasTab = computed(() => {
  // Superadmin has access to all tabs
  if (isSuperAdmin.value) return true
  
  const jabatan = currentUser?.jabatan
  return jabatan === 'Guru Kelas' || jabatan === 'Guru Kelas dan Guru Bidang Studi'
})

const showGuruMapelTab = computed(() => {
  // Superadmin has access to all tabs
  if (isSuperAdmin.value) return true
  
  const jabatan = currentUser?.jabatan
  return jabatan === 'Guru Bidang Studi' || jabatan === 'Guru Kelas dan Guru Bidang Studi'
})

// State
const activeTab = ref(showGuruKelasTab.value ? 'guru-kelas' : 'guru-mapel')
const isLoading = ref(false)
const isDownloading = ref(false)

const { success: showToast, error: showErrorToast } = useToast()

const rombelList = ref<any[]>([])
const tahunPelajaranList = ref<any[]>([])
const bidangStudiList = ref<any[]>([])
const rekapDataKelas = ref<any>(null)
const rekapDataMapel = ref<any>(null)

// Modal state
const isDetailModalOpen = ref(false)
const selectedDetailData = ref<any>(null)
const selectedBidangStudiNama = ref<string>('')

const isSyncModalOpen = ref(false)
const syncConfig = ref({
  tahun_pelajaran_id: 0,
  rombel_id: 0,
  bidang_studi_id: null as number | null,
  is_guru_mapel: false
})

const isCreateModalOpen = ref(false)
const selectedSiswaData = ref<any>({
  id: 0,
  nama: '',
  nis: '',
  peserta_didik_rombel_id: 0
})
const selectedTanggal = ref('')
const createConfig = ref({
  rombel_id: 0,
  tahun_pelajaran_id: 0,
  bidang_studi_id: null as number | null,
  pertemuan_ke: null as number | null
})

// Mapping peserta_didik_id to peserta_didik_rombel_id
const pesertaDidikRombelMapping = ref<Map<number, number>>(new Map())

// Store pemetaan rombel data for student list
const pemetaanRombelData = ref<any[]>([])

// Get current date
const today = new Date()
const currentMonth = today.getMonth() + 1 // 1-12
const currentYear = today.getFullYear()
// Semester 1: Juli-Desember (7-12), Semester 2: Januari-Juni (1-6)
const currentSemester = currentMonth >= 7 && currentMonth <= 12 ? 1 : 2

const filterKelas = ref({
  tahun_pelajaran_id: 0,
  rombel_id: 0, // Always start with 0 (not selected) so user must choose
  tanggal_mulai: '',
  tanggal_selesai: '',
  bulan: currentMonth,
  tahun: currentYear,
  bidang_studi_id: null
})

const filterMapel = ref({
  tahun_pelajaran_id: 0,
  rombel_id: 0,
  tanggal_mulai: '',
  tanggal_selesai: '',
  bulan: currentMonth,
  tahun: currentYear,
  bidang_studi_id: 0, // Always start with 0 (not selected) so user must choose
  semester: currentSemester,
  view_type: 'per_bulan' as 'per_bulan' | 'per_semester'
})

// Computed - Filter rombel list based on user's assignment
const activeRombelList = computed(() => {
  const filtered = rombelList.value.filter((r: any) => r.status === 'active')
  
  // Superadmin has access to all rombel
  if (isSuperAdmin.value) {
    return filtered
  }
  
  // For guru kelas tab, only show their assigned rombel
  if (activeTab.value === 'guru-kelas' && currentUser?.rombel_guru_kelas_id) {
    return filtered.filter((r: any) => r.id === currentUser.rombel_guru_kelas_id)
  }
  
  // For guru mapel tab, only show their assigned rombels
  if (activeTab.value === 'guru-mapel' && currentUser?.rombel_bidang_studi && currentUser.rombel_bidang_studi.length > 0) {
    return filtered.filter((r: any) => currentUser.rombel_bidang_studi?.includes(r.id))
  }
  
  return filtered
})

const activeTahunPelajaranList = computed(() => {
  return tahunPelajaranList.value.filter((t: any) => t.status === 'active')
})

// Filter bidang studi list for guru mapel (only show their assigned bidang studi)
const activeBidangStudiList = computed(() => {
  const filtered = bidangStudiList.value.filter((b: any) => b.status === 'active')
  
  // Superadmin has access to all bidang studi
  if (isSuperAdmin.value) {
    return filtered
  }
  
  // For guru mapel, only show their assigned bidang studi
  if (currentUser?.bidang_studi_id) {
    return filtered.filter((b: any) => b.id === currentUser.bidang_studi_id)
  }
  
  return filtered
})

const daysInMonth = computed(() => {
  return new Date(filterKelas.value.tahun, filterKelas.value.bulan, 0).getDate()
})

const daysInMonthMapel = computed(() => {
  if (filterMapel.value.view_type === 'per_bulan' && filterMapel.value.bulan) {
    return new Date(filterMapel.value.tahun, filterMapel.value.bulan, 0).getDate()
  }
  return 0
})

// Get header title for mapel table
const getHeaderTitleMapel = computed(() => {
  if (filterMapel.value.view_type === 'per_bulan' && filterMapel.value.bulan) {
    return getMonthName(filterMapel.value.bulan).toUpperCase()
  } else if (filterMapel.value.view_type === 'per_semester') {
    return `SEMESTER ${filterMapel.value.semester}`
  }
  return ''
})

// Get grouped months structure for mapel table
const getMonthsStructureMapel = computed(() => {
  // Determine which months to show based on view type
  let monthsToShow: number[] = []
  
  if (filterMapel.value.view_type === 'per_bulan' && filterMapel.value.bulan) {
    monthsToShow = [filterMapel.value.bulan]
  } else if (filterMapel.value.view_type === 'per_semester' && filterMapel.value.semester) {
    // Always show all 6 months in the semester
    monthsToShow = filterMapel.value.semester === 1 
      ? [7, 8, 9, 10, 11, 12] // Juli - Desember
      : [1, 2, 3, 4, 5, 6] // Januari - Juni
  }
  
  // If no data, create default structure
  if (!rekapDataMapel.value || !rekapDataMapel.value.data_siswa || rekapDataMapel.value.data_siswa.length === 0) {
    const monthsArray: any[] = []
    monthsToShow.forEach(month => {
      const monthName = getMonthName(month)
      const columns = []
      for (let i = 1; i <= 5; i++) {
        columns.push({
          date: null,
          day: null,
          pertemuan_ke: i,
          monthName: monthName
        })
      }
      monthsArray.push({
        monthKey: `${filterMapel.value.tahun}-${String(month).padStart(2, '0')}`,
        monthName: monthName,
        columns
      })
    })
    return monthsArray
  }
  
  const firstStudent = rekapDataMapel.value.data_siswa[0]
  
  // Group existing data by month from ALL students (not just first student)
  const monthsMap = new Map<string, any[]>()
  
  // Iterate through all students to collect all unique dates
  rekapDataMapel.value.data_siswa.forEach((student: any) => {
    if (!student.detail_per_tanggal || student.detail_per_tanggal.length === 0) return
    
    student.detail_per_tanggal.forEach((detail: any) => {
      const date = new Date(detail.tanggal)
      const month = date.getMonth() + 1
      const monthKey = `${date.getFullYear()}-${String(month).padStart(2, '0')}`
      const monthName = getMonthName(month)
      
      if (!monthsMap.has(monthKey)) {
        monthsMap.set(monthKey, [])
      }
      
      const existingColumn = monthsMap.get(monthKey)!.find(col => 
        col.date === detail.tanggal && col.pertemuan_ke === detail.pertemuan_ke
      )
      
      // Only add if not already exists (avoid duplicates)
      if (!existingColumn) {
        monthsMap.get(monthKey)!.push({
          date: detail.tanggal,
          day: date.getDate(),
          pertemuan_ke: detail.pertemuan_ke || null,
          monthName: monthName
        })
      }
    })
  })
  
  // Build structure for all months that should be shown
  const monthsArray: any[] = []
  
  monthsToShow.forEach(month => {
    const monthKey = `${filterMapel.value.tahun}-${String(month).padStart(2, '0')}`
    const monthName = getMonthName(month)
    
    // Check if we have data for this month
    const monthData = monthsMap.get(monthKey)
    
    if (monthData && monthData.length > 0) {
      // Sort by pertemuan_ke
      monthData.sort((a, b) => (a.pertemuan_ke || 0) - (b.pertemuan_ke || 0))
      
      // Ensure minimum 5 columns per month
      const minPertemuan = 5
      const maxPertemuan = Math.max(minPertemuan, monthData.length)
      
      const columns = []
      for (let i = 1; i <= maxPertemuan; i++) {
        const existingData = monthData.find(d => d.pertemuan_ke === i)
        if (existingData) {
          columns.push(existingData)
        } else {
          // Add placeholder for missing pertemuan
          columns.push({
            date: null,
            day: null,
            pertemuan_ke: i,
            monthName: monthName
          })
        }
      }
      
      monthsArray.push({
        monthKey,
        monthName: monthName,
        columns
      })
    } else {
      // No data for this month, create default structure with 5 pertemuan
      const columns = []
      for (let i = 1; i <= 5; i++) {
        columns.push({
          date: null,
          day: null,
          pertemuan_ke: i,
          monthName: monthName
        })
      }
      monthsArray.push({
        monthKey,
        monthName: monthName,
        columns
      })
    }
  })
  
  return monthsArray
})

// Get total columns for mapel table
const getTotalDatesMapel = computed(() => {
  return getMonthsStructureMapel.value.reduce((total, month) => total + month.columns.length, 0)
})

// Get flat date list for mapel table
const getDateListMapel = computed(() => {
  const flatList: any[] = []
  getMonthsStructureMapel.value.forEach(month => {
    flatList.push(...month.columns)
  })
  return flatList
})

// Methods
const getMonthName = (month: number | undefined) => {
  if (!month) return ''
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  return months[month - 1] || ''
}

// Check if a specific date has any absensi records across all students (guru kelas)
const dateHasRecords = (day: number) => {
  if (!rekapDataKelas.value.data_siswa || rekapDataKelas.value.data_siswa.length === 0) return false
  
  const dateStr = `${filterKelas.value.tahun}-${String(filterKelas.value.bulan).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  
  return rekapDataKelas.value.data_siswa.some((siswa: any) => 
    siswa.detail_per_tanggal?.some((d: any) => d.tanggal === dateStr)
  )
}

const getStatusForDate = (siswa: any, day: number) => {
  const dateStr = `${filterKelas.value.tahun}-${String(filterKelas.value.bulan).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const detail = siswa.detail_per_tanggal?.find((d: any) => d.tanggal === dateStr)
  
  // Check if this date has any records across all students
  const hasAnyRecords = dateHasRecords(day)
  
  if (!detail) {
    return { 
      text: '-', 
      color: '', 
      hasData: false, 
      detail: null,
      dateStr: dateStr,
      hasAnyRecords: hasAnyRecords
    }
  }
  
  const result = {
    hasData: true,
    detail: detail,
    dateStr: dateStr,
    hasAnyRecords: true
  }
  
  switch (detail.status) {
    case 'hadir': return { ...result, text: '✓', color: 'bg-green-100' }
    case 'izin': return { ...result, text: 'I', color: 'bg-yellow-100' }
    case 'sakit': return { ...result, text: 'S', color: 'bg-blue-100' }
    case 'alpa': return { ...result, text: 'A', color: 'bg-red-100' }
    default: return { ...result, text: '-', color: '' }
  }
}

// Check if a specific date has any absensi records across all students (guru mapel)
const dateHasRecordsMapel = (dateStr: string | null) => {
  if (!dateStr || !rekapDataMapel.value.data_siswa || rekapDataMapel.value.data_siswa.length === 0) return false
  
  return rekapDataMapel.value.data_siswa.some((siswa: any) => 
    siswa.detail_per_tanggal?.some((d: any) => d.tanggal === dateStr)
  )
}

const getStatusForDateMapel = (siswa: any, dateStr: string | null) => {
  if (!dateStr) return { text: '-', color: '', hasData: false, detail: null, dateStr: null, hasAnyRecords: false }
  
  const detail = siswa.detail_per_tanggal?.find((d: any) => d.tanggal === dateStr)
  
  // Check if this date has any records across all students
  const hasAnyRecords = dateHasRecordsMapel(dateStr)
  
  if (!detail) {
    return { 
      text: '-', 
      color: '', 
      hasData: false, 
      detail: null,
      dateStr: dateStr,
      hasAnyRecords: hasAnyRecords
    }
  }
  
  const result = {
    hasData: true,
    detail: detail,
    dateStr: dateStr,
    hasAnyRecords: true
  }
  
  switch (detail.status) {
    case 'hadir': return { ...result, text: '✓', color: 'bg-green-100' }
    case 'izin': return { ...result, text: 'I', color: 'bg-yellow-100' }
    case 'sakit': return { ...result, text: 'S', color: 'bg-blue-100' }
    case 'alpa': return { ...result, text: 'A', color: 'bg-red-100' }
    default: return { ...result, text: '-', color: '' }
  }
}

const openDetailModal = (siswa: any, statusData: any, bidangStudiNama?: string) => {
  if (!statusData.hasData || !statusData.detail) return
  
  selectedDetailData.value = {
    id: statusData.detail.id,
    nama: siswa.nama,
    nis: siswa.nis,
    jenis_kelamin: siswa.jenis_kelamin,
    tanggal: statusData.detail.tanggal,
    pertemuan_ke: statusData.detail.pertemuan_ke,
    status: statusData.detail.status,
    waktu_absen: statusData.detail.waktu_absen,
    metode_input: statusData.detail.metode_input,
    keterangan: statusData.detail.keterangan,
    file_surat: statusData.detail.file_surat,
    dicatat_oleh: statusData.detail.dicatat_oleh,
    dicatat_oleh_id: statusData.detail.dicatat_oleh_id
  }
  
  selectedBidangStudiNama.value = bidangStudiNama || ''
  isDetailModalOpen.value = true
}

const closeDetailModal = () => {
  isDetailModalOpen.value = false
  selectedDetailData.value = null
  selectedBidangStudiNama.value = ''
}

// Handle cell click for guru kelas tab
const handleCellClick = (siswa: any, statusData: any, day: number) => {
  if (statusData.hasData) {
    // Cell has data, open detail modal
    openDetailModal(siswa, statusData)
  } else if (statusData.hasAnyRecords) {
    // Cell is empty but date has records, open create modal
    openCreateModal(siswa, statusData.dateStr)
  }
}

// Handle cell click for guru mapel tab
const handleCellClickMapel = (siswa: any, statusData: any, dateInfo: any, bidangStudiNama: string) => {
  if (statusData.hasData) {
    // Cell has data, open detail modal
    openDetailModal(siswa, statusData, bidangStudiNama)
  } else if (statusData.hasAnyRecords) {
    // Cell is empty but date has records, open create modal
    // Get pertemuan_ke from dateInfo
    const pertemuanKe = dateInfo.pertemuan_ke || null
    openCreateModal(siswa, statusData.dateStr, pertemuanKe)
  }
}

const openSyncModal = (isGuruMapel: boolean) => {
  if (isGuruMapel) {
    syncConfig.value = {
      tahun_pelajaran_id: filterMapel.value.tahun_pelajaran_id,
      rombel_id: filterMapel.value.rombel_id,
      bidang_studi_id: filterMapel.value.bidang_studi_id,
      is_guru_mapel: true
    }
  } else {
    syncConfig.value = {
      tahun_pelajaran_id: filterKelas.value.tahun_pelajaran_id,
      rombel_id: filterKelas.value.rombel_id,
      bidang_studi_id: null,
      is_guru_mapel: false
    }
  }
  isSyncModalOpen.value = true
}

const closeSyncModal = () => {
  isSyncModalOpen.value = false
}

const handleSynchronized = () => {
  // Reload data based on active tab
  if (activeTab.value === 'guru-kelas') {
    loadRekapKelas()
  } else {
    loadRekapMapel()
  }
  
  // Close modal after short delay
  setTimeout(() => {
    closeSyncModal()
  }, 2000)
}

const openCreateModal = (siswa: any, tanggal: string, pertemuanKe: number | null = null) => {
  console.log('Opening create modal for siswa:', siswa)
  
  // Get peserta_didik_rombel_id from mapping
  const pesertaDidikRombelId = pesertaDidikRombelMapping.value.get(siswa.peserta_didik_id) || 0
  
  selectedSiswaData.value = {
    id: siswa.peserta_didik_id,
    nama: siswa.nama,
    nis: siswa.nis,
    peserta_didik_rombel_id: pesertaDidikRombelId
  }
  
  console.log('Selected siswa data:', selectedSiswaData.value)
  console.log('Peserta didik rombel ID from mapping:', pesertaDidikRombelId)
  
  selectedTanggal.value = tanggal
  
  if (activeTab.value === 'guru-kelas') {
    createConfig.value = {
      rombel_id: filterKelas.value.rombel_id,
      tahun_pelajaran_id: filterKelas.value.tahun_pelajaran_id,
      bidang_studi_id: null,
      pertemuan_ke: null
    }
  } else {
    createConfig.value = {
      rombel_id: filterMapel.value.rombel_id,
      tahun_pelajaran_id: filterMapel.value.tahun_pelajaran_id,
      bidang_studi_id: filterMapel.value.bidang_studi_id,
      pertemuan_ke: pertemuanKe
    }
  }
  
  isCreateModalOpen.value = true
}

const closeCreateModal = () => {
  isCreateModalOpen.value = false
}

const handleAbsensiCreated = () => {
  // Reload data based on active tab
  if (activeTab.value === 'guru-kelas') {
    loadRekapKelas()
  } else {
    loadRekapMapel()
  }
}

const handleDataUpdated = () => {
  // Reload data based on active tab
  if (activeTab.value === 'guru-kelas') {
    loadRekapKelas()
  } else {
    loadRekapMapel()
  }
}

const downloadExcel = async (isGuruMapel: boolean) => {
  isDownloading.value = true
  
  try {
    let requestData: any
    
    if (isGuruMapel) {
      // Guru Mapel - check view type
      if (filterMapel.value.view_type === 'per_bulan') {
        requestData = {
          tahun_pelajaran_id: filterMapel.value.tahun_pelajaran_id,
          rombel_id: filterMapel.value.rombel_id,
          bidang_studi_id: filterMapel.value.bidang_studi_id,
          tipe_periode: 'bulan',
          bulan: filterMapel.value.bulan,
          tahun: filterMapel.value.tahun
        }
      } else {
        // per_semester
        requestData = {
          tahun_pelajaran_id: filterMapel.value.tahun_pelajaran_id,
          rombel_id: filterMapel.value.rombel_id,
          bidang_studi_id: filterMapel.value.bidang_studi_id,
          tipe_periode: 'semester',
          semester: filterMapel.value.semester
        }
      }
    } else {
      // Guru Kelas - always per bulan
      requestData = {
        tahun_pelajaran_id: filterKelas.value.tahun_pelajaran_id,
        rombel_id: filterKelas.value.rombel_id,
        tipe_periode: 'bulan',
        bulan: filterKelas.value.bulan,
        tahun: filterKelas.value.tahun
      }
    }
    
    // Call API
    const blob = await exportExcelAbsensi(requestData)
    
    // Create download link
    const url = window.URL.createObjectURL(blob as Blob)
    const link = document.createElement('a')
    link.href = url
    
    // Generate filename
    const rombelName = rombelList.value.find(r => r.id === (isGuruMapel ? filterMapel.value.rombel_id : filterKelas.value.rombel_id))?.name || 'Rombel'
    const date = new Date().toISOString().split('T')[0]
    link.download = `Rekap_Absensi_${rombelName}_${date}.xlsx`
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    showToast('Berhasil', 'File Excel berhasil didownload')
  } catch (err: any) {
    console.error('Error downloading excel:', err)
    const errorMsg = err.data?.error || err.data?.message || 'Gagal mendownload file Excel'
    showErrorToast('Error', errorMsg)
  } finally {
    isDownloading.value = false
  }
}

const downloadPdf = async (isGuruMapel: boolean) => {
  isDownloading.value = true
  
  try {
    let requestData: any
    
    if (isGuruMapel) {
      // Guru Mapel - check view type
      if (filterMapel.value.view_type === 'per_bulan') {
        requestData = {
          tahun_pelajaran_id: filterMapel.value.tahun_pelajaran_id,
          rombel_id: filterMapel.value.rombel_id,
          bidang_studi_id: filterMapel.value.bidang_studi_id,
          tipe_periode: 'bulan',
          bulan: filterMapel.value.bulan,
          tahun: filterMapel.value.tahun
        }
      } else {
        // per_semester
        requestData = {
          tahun_pelajaran_id: filterMapel.value.tahun_pelajaran_id,
          rombel_id: filterMapel.value.rombel_id,
          bidang_studi_id: filterMapel.value.bidang_studi_id,
          tipe_periode: 'semester',
          semester: filterMapel.value.semester
        }
      }
    } else {
      // Guru Kelas - always per bulan
      requestData = {
        tahun_pelajaran_id: filterKelas.value.tahun_pelajaran_id,
        rombel_id: filterKelas.value.rombel_id,
        tipe_periode: 'bulan',
        bulan: filterKelas.value.bulan,
        tahun: filterKelas.value.tahun
      }
    }
    
    // Call API
    const blob = await exportPdfAbsensi(requestData)
    
    // Create download link
    const url = window.URL.createObjectURL(blob as Blob)
    const link = document.createElement('a')
    link.href = url
    
    // Generate filename
    const rombelName = rombelList.value.find(r => r.id === (isGuruMapel ? filterMapel.value.rombel_id : filterKelas.value.rombel_id))?.name || 'Rombel'
    const date = new Date().toISOString().split('T')[0]
    link.download = `Rekap_Absensi_${rombelName}_${date}.pdf`
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    showToast('Berhasil', 'File PDF berhasil didownload')
  } catch (err: any) {
    console.error('Error downloading PDF:', err)
    const errorMsg = err.data?.error || err.data?.message || 'Gagal mendownload file PDF'
    showErrorToast('Error', errorMsg)
  } finally {
    isDownloading.value = false
  }
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
        filterKelas.value.tahun_pelajaran_id = activeTahun.id
        filterMapel.value.tahun_pelajaran_id = activeTahun.id
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

const loadPemetaanRombelMapping = async (rombelId: number, tahunPelajaranId: number) => {
  try {
    const config = useRuntimeConfig()
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    
    const response: any = await $fetch(
      `${config.public.apiBase}/api/v1/peserta-didik/get-pemetaan-rombel`,
      {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: {
          search: {
            rombel_id: rombelId,
            tahun_pelajaran_id: tahunPelajaranId,
            status: 'active'
          },
          pagination: {
            limit: 50,
            page: 1
          }
        },
        credentials: 'include',
      }
    )
    
    // Store full pemetaan rombel data
    pemetaanRombelData.value = response.data || []
    
    // Create mapping from peserta_didik_id to peserta_didik_rombel_id (pemetaan rombel ID)
    const mapping = new Map<number, number>()
    if (response.data && Array.isArray(response.data)) {
      response.data.forEach((item: any) => {
        if (item.peserta_didik_id && item.id) {
          mapping.set(item.peserta_didik_id, item.id) // item.id is peserta_didik_rombel_id
        }
      })
    }
    
    pesertaDidikRombelMapping.value = mapping
    console.log('Pemetaan rombel data loaded:', response.data?.length, 'students')
    console.log('Pemetaan rombel mapping loaded:', mapping)
  } catch (err) {
    console.error('Error loading pemetaan rombel:', err)
    pemetaanRombelData.value = []
    pesertaDidikRombelMapping.value = new Map()
  }
}

const loadRekapKelas = async () => {
  if (!filterKelas.value.tahun_pelajaran_id || !filterKelas.value.rombel_id) {
    rekapDataKelas.value = null
    return
  }

  isLoading.value = true
  try {
    // Load pemetaan rombel to get all students and mapping
    await loadPemetaanRombelMapping(filterKelas.value.rombel_id, filterKelas.value.tahun_pelajaran_id)
    
    // Load rekap data
    const response = await getRekapAbsensi(filterKelas.value)
    const rekapData = response.data || { data_siswa: [] }
    
    // Merge: Use all students from pemetaan rombel, add absensi details from rekap
    // Filter only active students and active pemetaan rombel
    const mergedStudents = pemetaanRombelData.value
      .filter((pemetaanSiswa: any) => 
        pemetaanSiswa.peserta_didik?.status === 'active' && 
        pemetaanSiswa.status === 'active'
      )
      .map((pemetaanSiswa: any) => {
        // Find matching student in rekap data
        const rekapSiswa = rekapData.data_siswa?.find((rs: any) => rs.peserta_didik_id === pemetaanSiswa.peserta_didik_id)
        
        return {
          id: pemetaanSiswa.id, // peserta_didik_rombel_id
          peserta_didik_id: pemetaanSiswa.peserta_didik_id,
          nama: pemetaanSiswa.peserta_didik?.nama || '',
          nis: pemetaanSiswa.peserta_didik?.nis || '',
          jenis_kelamin: pemetaanSiswa.peserta_didik?.jenis_kelamin || '',
          detail_per_tanggal: rekapSiswa?.detail_per_tanggal || [],
          total_sakit: rekapSiswa?.total_sakit || 0,
          total_izin: rekapSiswa?.total_izin || 0,
          total_alpa: rekapSiswa?.total_alpa || 0,
          total_absen: rekapSiswa?.total_absen || 0
        }
      })
    
    rekapDataKelas.value = {
      ...rekapData,
      data_siswa: mergedStudents
    }
  } catch (err) {
    console.error('Error loading rekap kelas:', err)
    // Set empty data instead of null to show table
    rekapDataKelas.value = { data_siswa: [] }
  } finally {
    isLoading.value = false
  }
}

const loadRekapMapel = async () => {
  if (!filterMapel.value.tahun_pelajaran_id || !filterMapel.value.rombel_id || !filterMapel.value.bidang_studi_id) {
    rekapDataMapel.value = null
    return
  }

  isLoading.value = true
  try {
    // Load pemetaan rombel to get all students and mapping
    await loadPemetaanRombelMapping(filterMapel.value.rombel_id, filterMapel.value.tahun_pelajaran_id)
    
    const requestData: any = {
      tahun_pelajaran_id: filterMapel.value.tahun_pelajaran_id,
      rombel_id: filterMapel.value.rombel_id,
      bidang_studi_id: filterMapel.value.bidang_studi_id,
      tahun: filterMapel.value.tahun,
      tanggal_mulai: '',
      tanggal_selesai: ''
    }

    if (filterMapel.value.view_type === 'per_bulan') {
      requestData.bulan = filterMapel.value.bulan
      requestData.semester = null
    } else {
      requestData.bulan = null
      requestData.semester = filterMapel.value.semester
    }

    const response = await getRekapAbsensi(requestData)
    const rekapData = response.data || { data_siswa: [] }
    
    // Merge: Use all students from pemetaan rombel, add absensi details from rekap
    // Filter only active students and active pemetaan rombel
    const mergedStudents = pemetaanRombelData.value
      .filter((pemetaanSiswa: any) => 
        pemetaanSiswa.peserta_didik?.status === 'active' && 
        pemetaanSiswa.status === 'active'
      )
      .map((pemetaanSiswa: any) => {
        // Find matching student in rekap data
        const rekapSiswa = rekapData.data_siswa?.find((rs: any) => rs.peserta_didik_id === pemetaanSiswa.peserta_didik_id)
        
        return {
          id: pemetaanSiswa.id, // peserta_didik_rombel_id
          peserta_didik_id: pemetaanSiswa.peserta_didik_id,
          nama: pemetaanSiswa.peserta_didik?.nama || '',
          nis: pemetaanSiswa.peserta_didik?.nis || '',
          jenis_kelamin: pemetaanSiswa.peserta_didik?.jenis_kelamin || '',
          detail_per_tanggal: rekapSiswa?.detail_per_tanggal || [],
          total_sakit: rekapSiswa?.total_sakit || 0,
          total_izin: rekapSiswa?.total_izin || 0,
          total_alpa: rekapSiswa?.total_alpa || 0,
          total_absen: rekapSiswa?.total_absen || 0
        }
      })
    
    rekapDataMapel.value = {
      ...rekapData,
      data_siswa: mergedStudents
    }
  } catch (err) {
    console.error('Error loading rekap mapel:', err)
    // Set empty data instead of null to show table
    rekapDataMapel.value = { data_siswa: [] }
  } finally {
    isLoading.value = false
  }
}

const changeViewType = () => {
  if (filterMapel.value.view_type === 'per_bulan') {
    filterMapel.value.bulan = currentMonth
    filterMapel.value.semester = currentSemester
  } else {
    filterMapel.value.bulan = currentMonth
    filterMapel.value.semester = currentSemester
  }
  loadRekapMapel()
}

const prevMonth = (type: 'kelas' | 'mapel') => {
  if (type === 'kelas') {
    if (filterKelas.value.bulan === 1) {
      filterKelas.value.bulan = 12
      filterKelas.value.tahun--
    } else {
      filterKelas.value.bulan--
    }
    loadRekapKelas()
  } else {
    if (filterMapel.value.view_type === 'per_bulan') {
      if (filterMapel.value.bulan === 1) {
        filterMapel.value.bulan = 12
        filterMapel.value.tahun--
      } else {
        filterMapel.value.bulan--
      }
      loadRekapMapel()
    }
  }
}

const nextMonth = (type: 'kelas' | 'mapel') => {
  if (type === 'kelas') {
    if (filterKelas.value.bulan === 12) {
      filterKelas.value.bulan = 1
      filterKelas.value.tahun++
    } else {
      filterKelas.value.bulan++
    }
    loadRekapKelas()
  } else {
    if (filterMapel.value.view_type === 'per_bulan') {
      if (filterMapel.value.bulan === 12) {
        filterMapel.value.bulan = 1
        filterMapel.value.tahun++
      } else {
        filterMapel.value.bulan++
      }
      loadRekapMapel()
    }
  }
}

onMounted(async () => {
  await Promise.all([loadRombelList(), loadTahunPelajaranList(), loadBidangStudiList()])
  
  // Check for query parameters from input kehadiran redirect
  if (route.query.tab) {
    activeTab.value = route.query.tab as string
  }
  
  if (route.query.tab === 'guru-kelas' && route.query.rombel_id) {
    filterKelas.value.rombel_id = Number(route.query.rombel_id)
    if (route.query.tahun_pelajaran_id) {
      filterKelas.value.tahun_pelajaran_id = Number(route.query.tahun_pelajaran_id)
    }
    // Load data after filters are set
    setTimeout(() => {
      loadRekapKelas()
    }, 500)
  }
  
  if (route.query.tab === 'guru-mapel' && route.query.rombel_id && route.query.bidang_studi_id) {
    filterMapel.value.rombel_id = Number(route.query.rombel_id)
    filterMapel.value.bidang_studi_id = Number(route.query.bidang_studi_id)
    if (route.query.tahun_pelajaran_id) {
      filterMapel.value.tahun_pelajaran_id = Number(route.query.tahun_pelajaran_id)
    }
    // Load data after filters are set
    setTimeout(() => {
      loadRekapMapel()
    }, 500)
  }
})
</script>
