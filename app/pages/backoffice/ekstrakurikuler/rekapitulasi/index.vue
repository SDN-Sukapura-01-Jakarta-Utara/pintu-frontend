<template>
  <DashboardLayout>
    <!-- Header Section -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Rekapitulasi Data Ekstrakurikuler</h1>
      <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
        Rekap lengkap data pendaftaran dan partisipasi ekstrakurikuler siswa
      </p>
    </div>

    <!-- Main Content -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <!-- Main Tabs -->
      <div class="border-b border-gray-200">
        <div class="px-4 sm:px-6">
          <div class="flex gap-1 overflow-x-auto -mb-px" style="scrollbar-width: thin;">
            <button
              @click="mainTab = 'per-ekskul'"
              :class="[
                'px-4 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 border-b-2 relative cursor-pointer',
                mainTab === 'per-ekskul'
                  ? 'text-red-600 border-b-red-600'
                  : 'text-gray-600 border-b-transparent hover:text-gray-900 hover:border-b-gray-300'
              ]"
            >
              <span class="flex items-center gap-2">
                <i class="fas fa-futbol w-4 h-4"></i>
                Data Per Ekskul
              </span>
            </button>
            <button
              @click="mainTab = 'per-rombel'"
              :class="[
                'px-4 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 border-b-2 relative cursor-pointer',
                mainTab === 'per-rombel'
                  ? 'text-red-600 border-b-red-600'
                  : 'text-gray-600 border-b-transparent hover:text-gray-900 hover:border-b-gray-300'
              ]"
            >
              <span class="flex items-center gap-2">
                <i class="fas fa-users-rectangle w-4 h-4"></i>
                Data Per Rombel
              </span>
            </button>
          </div>
        </div>
      </div>

      <div class="p-4 sm:p-6 md:p-8">
        <!-- Tab Content: Data Per Ekskul -->
        <div v-if="mainTab === 'per-ekskul'">
          <!-- Loading Ekstrakurikuler -->
          <div v-if="isLoadingEkskul" class="flex items-center justify-center py-12">
            <div class="flex flex-col items-center gap-3">
              <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
              <p class="text-sm text-gray-600 font-medium">Memuat data ekstrakurikuler...</p>
            </div>
          </div>

          <div v-else-if="ekskulList.length > 0">
            <!-- Ekstrakurikuler Pills -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-900 mb-3">Pilih Ekstrakurikuler</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="ekskul in ekskulList"
                  :key="ekskul.id"
                  @click="selectedEkskulId = ekskul.id; loadDataPerEkskul()"
                  :class="[
                    'px-4 py-2 rounded-full font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer',
                    selectedEkskulId === ekskul.id
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  {{ ekskul.name }}
                </button>
              </div>
            </div>

            <!-- Content Container -->
            <div class="bg-gray-50 rounded-lg border-2 border-gray-200 p-6">

            <!-- Filters -->
            <div class="mb-6 bg-white rounded-lg p-4 shadow-sm">
              <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fas fa-filter text-red-600"></i>
                Filter Data
              </h2>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">
                    Tahun Pelajaran <span class="text-red-600">*</span>
                  </label>
                  <select
                    v-model.number="filtersEkskul.tahun_pelajaran_id"
                    @change="loadDataPerEkskul"
                    class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                  >
                    <option v-for="tahun in tahunPelajaranList" :key="tahun.id" :value="tahun.id">
                      {{ tahun.tahun_pelajaran }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">Nama</label>
                  <input
                    v-model="filtersEkskul.nama"
                    @keyup.enter="loadDataPerEkskul"
                    type="text"
                    placeholder="Cari nama siswa..."
                    class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">NIS</label>
                  <input
                    v-model="filtersEkskul.nis"
                    @keyup.enter="loadDataPerEkskul"
                    type="text"
                    placeholder="Cari NIS..."
                    class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">Rombel</label>
                  <select
                    v-model.number="filtersEkskul.rombel_id"
                    @change="loadDataPerEkskul"
                    class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                  >
                    <option :value="null">Semua Rombel</option>
                    <option v-for="rombel in rombelList" :key="rombel.id" :value="rombel.id">
                      {{ rombel.name }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="mt-3 flex gap-2">
                <button
                  @click="loadDataPerEkskul"
                  class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-semibold flex items-center gap-2"
                >
                  <i class="fas fa-search"></i>
                  Cari
                </button>
                <button
                  @click="resetFiltersEkskul"
                  class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all text-sm font-semibold flex items-center gap-2"
                >
                  <i class="fas fa-redo"></i>
                  Reset
                </button>
                <button
                  @click="downloadExcelPerEkskul"
                  :disabled="isDownloadingEkskul"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-semibold flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
                >
                  <i :class="isDownloadingEkskul ? 'fas fa-spinner fa-spin' : 'fas fa-file-excel'"></i>
                  {{ isDownloadingEkskul ? 'Downloading...' : 'Excel' }}
                </button>
              </div>
            </div>

            <div class="border-t border-gray-300 my-6"></div>
            <!-- Loading Data -->
            <div v-if="isLoadingDataEkskul" class="flex items-center justify-center py-12">
              <div class="flex flex-col items-center gap-3">
                <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
                <p class="text-sm text-gray-600 font-medium">Memuat data siswa...</p>
              </div>
            </div>

            <!-- Data Table -->
            <div v-else-if="dataPerEkskul">
              <!-- Check if ekstrakurikuler data exists and has data -->
              <div v-if="dataPerEkskul.ekstrakurikuler && dataPerEkskul.ekstrakurikuler.length > 0 && dataPerEkskul.ekstrakurikuler[0]?.siswa && dataPerEkskul.ekstrakurikuler[0].siswa.length > 0">
                <div class="mb-4 flex items-center justify-between">
                  <h3 class="text-base font-bold text-gray-900">
                    Total Siswa: {{ dataPerEkskul.ekstrakurikuler[0]?.total_siswa || 0 }}
                  </h3>
                </div>

                <div class="overflow-x-auto bg-white rounded-lg">
                  <table class="w-full text-sm">
                    <thead class="bg-gray-700 border-b-2 border-gray-600">
                      <tr>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">No</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Nama</th>
                        <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">NIS</th>
                        <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Rombel</th>
                        <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Tanggal Daftar</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                      <tr v-for="(siswa, index) in dataPerEkskul.ekstrakurikuler[0].siswa" :key="siswa.peserta_didik_id" class="hover:bg-gray-50 transition-colors">
                        <td class="px-4 py-3 text-gray-900">{{ (paginationEkskul.page - 1) * paginationEkskul.limit + index + 1 }}</td>
                        <td class="px-4 py-3 text-gray-900 font-medium">{{ siswa.nama }}</td>
                        <td class="px-4 py-3 text-center text-gray-600">{{ siswa.nis }}</td>
                        <td class="px-4 py-3 text-center">
                          <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {{ siswa.nama_rombel }}
                          </span>
                        </td>
                        <td class="px-4 py-3 text-center text-gray-600">{{ formatDate(siswa.tanggal_daftar) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Pagination -->
                <div v-if="dataPerEkskul.pagination && dataPerEkskul.pagination.total_pages > 1" class="mt-6 flex items-center justify-between">
                  <p class="text-sm text-gray-600">
                    Menampilkan {{ ((paginationEkskul.page - 1) * paginationEkskul.limit) + 1 }} - 
                    {{ Math.min(paginationEkskul.page * paginationEkskul.limit, dataPerEkskul.pagination.total) }} 
                    dari {{ dataPerEkskul.pagination.total }} data
                  </p>
                  <div class="flex gap-2">
                    <button
                      @click="changePaginationEkskul(paginationEkskul.page - 1)"
                      :disabled="paginationEkskul.page === 1"
                      class="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all text-sm font-semibold"
                    >
                      <i class="fas fa-chevron-left"></i>
                    </button>
                    <span class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold">
                      {{ paginationEkskul.page }}
                    </span>
                    <button
                      @click="changePaginationEkskul(paginationEkskul.page + 1)"
                      :disabled="paginationEkskul.page === dataPerEkskul.pagination.total_pages"
                      class="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all text-sm font-semibold"
                    >
                      <i class="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-else class="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-lg border-2 border-gray-200">
                <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <i class="fas fa-inbox text-3xl text-gray-400"></i>
                </div>
                <h3 class="text-base font-semibold text-gray-900 mb-1">Tidak Ada Data</h3>
                <p class="text-sm text-gray-600 text-center">Tidak ada siswa terdaftar untuk ekstrakurikuler ini pada tahun pelajaran dan filter yang dipilih</p>
              </div>
            </div>
            </div>
          </div>

          <!-- Empty State No Ekskul -->
          <div v-else class="flex flex-col items-center justify-center py-12">
            <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <i class="fas fa-futbol text-2xl text-gray-400"></i>
            </div>
            <h3 class="text-base font-semibold text-gray-900 mb-1">Belum Ada Ekstrakurikuler</h3>
            <p class="text-sm text-gray-600">Tidak ada data ekstrakurikuler aktif</p>
          </div>
        </div>
        <!-- Tab Content: Data Per Rombel -->
        <div v-if="mainTab === 'per-rombel'">
          <!-- Loading Rombel -->
          <div v-if="isLoadingRombel" class="flex items-center justify-center py-12">
            <div class="flex flex-col items-center gap-3">
              <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
              <p class="text-sm text-gray-600 font-medium">Memuat data rombel...</p>
            </div>
          </div>

          <div v-else-if="rombelList.length > 0">
            <!-- Rombel Pills -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-900 mb-3">Pilih Rombel</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="rombel in rombelList"
                  :key="rombel.id"
                  @click="selectedRombelId = rombel.id; loadDataPerRombel()"
                  :class="[
                    'px-4 py-2 rounded-full font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer',
                    selectedRombelId === rombel.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  {{ rombel.name }}
                </button>
              </div>
            </div>

            <!-- Content Container -->
            <div class="bg-gray-50 rounded-lg border-2 border-gray-200 p-6">

            <!-- Filters -->
            <div class="mb-6 bg-white rounded-lg p-4 shadow-sm">
              <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fas fa-filter text-red-600"></i>
                Filter Data
              </h2>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">
                    Tahun Pelajaran <span class="text-red-600">*</span>
                  </label>
                  <select
                    v-model.number="filtersRombel.tahun_pelajaran_id"
                    @change="loadDataPerRombel"
                    class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                  >
                    <option v-for="tahun in tahunPelajaranList" :key="tahun.id" :value="tahun.id">
                      {{ tahun.tahun_pelajaran }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">Nama</label>
                  <input
                    v-model="filtersRombel.nama"
                    @keyup.enter="loadDataPerRombel"
                    type="text"
                    placeholder="Cari nama siswa..."
                    class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">NIS</label>
                  <input
                    v-model="filtersRombel.nis"
                    @keyup.enter="loadDataPerRombel"
                    type="text"
                    placeholder="Cari NIS..."
                    class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                  />
                </div>
              </div>

              <div class="mt-3 flex gap-2">
                <button
                  @click="loadDataPerRombel"
                  class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-semibold flex items-center gap-2"
                >
                  <i class="fas fa-search"></i>
                  Cari
                </button>
                <button
                  @click="resetFiltersRombel"
                  class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all text-sm font-semibold flex items-center gap-2"
                >
                  <i class="fas fa-redo"></i>
                  Reset
                </button>
                <button
                  @click="downloadExcelPerRombel"
                  :disabled="isDownloadingRombel"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-semibold flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
                >
                  <i :class="isDownloadingRombel ? 'fas fa-spinner fa-spin' : 'fas fa-file-excel'"></i>
                  {{ isDownloadingRombel ? 'Downloading...' : 'Excel' }}
                </button>
              </div>
            </div>

            <!-- Loading Data -->
            <div v-if="isLoadingDataRombel" class="flex items-center justify-center py-12">
              <div class="flex flex-col items-center gap-3">
                <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
                <p class="text-sm text-gray-600 font-medium">Memuat data siswa...</p>
              </div>
            </div>
            <!-- Data Table -->
            <div v-else-if="dataPerRombel">
              <div class="mb-4 flex items-center justify-between">
                <h3 class="text-base font-bold text-gray-900">
                  Total Siswa: {{ dataPerRombel.total_siswa }}
                </h3>
              </div>

              <div class="overflow-x-auto bg-white rounded-lg">
                <table class="w-full text-sm">
                  <thead class="bg-gray-700 border-b-2 border-gray-600">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">No</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Nama</th>
                      <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">NIS</th>
                      <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Ekstrakurikuler</th>
                      <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Total Ekskul</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr v-for="(siswa, index) in dataPerRombel.siswa || []" :key="siswa.peserta_didik_id" class="hover:bg-gray-50 transition-colors">
                      <td class="px-4 py-3 text-gray-900">{{ (paginationRombel.page - 1) * paginationRombel.limit + index + 1 }}</td>
                      <td class="px-4 py-3 text-gray-900 font-medium">{{ siswa.nama }}</td>
                      <td class="px-4 py-3 text-center text-gray-600">{{ siswa.nis }}</td>
                      <td class="px-4 py-3">
                        <div v-if="siswa.ekstrakurikuler.length > 0" class="flex flex-wrap gap-1 justify-center">
                          <span 
                            v-for="ekskul in siswa.ekstrakurikuler" 
                            :key="ekskul.ekstrakurikuler_id"
                            class="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
                          >
                            {{ ekskul.nama_ekstrakurikuler }}
                          </span>
                        </div>
                        <span v-else class="text-gray-400 text-xs italic block text-center">Tidak ada</span>
                      </td>
                      <td class="px-4 py-3 text-center">
                        <span :class="[
                          'px-3 py-1 rounded-full text-xs font-semibold',
                          siswa.total_ekskul > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        ]">
                          {{ siswa.total_ekskul }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              <div v-if="dataPerRombel.pagination && dataPerRombel.pagination.total_pages > 1" class="mt-6 flex items-center justify-between">
                <p class="text-sm text-gray-600">
                  Menampilkan {{ ((paginationRombel.page - 1) * paginationRombel.limit) + 1 }} - 
                  {{ Math.min(paginationRombel.page * paginationRombel.limit, dataPerRombel.pagination.total) }} 
                  dari {{ dataPerRombel.pagination.total }} data
                </p>
                <div class="flex gap-2">
                  <button
                    @click="changePaginationRombel(paginationRombel.page - 1)"
                    :disabled="paginationRombel.page === 1"
                    class="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all text-sm font-semibold"
                  >
                    <i class="fas fa-chevron-left"></i>
                  </button>
                  <span class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold">
                    {{ paginationRombel.page }}
                  </span>
                  <button
                    @click="changePaginationRombel(paginationRombel.page + 1)"
                    :disabled="paginationRombel.page === dataPerRombel.pagination.total_pages"
                    class="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all text-sm font-semibold"
                  >
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>

              <!-- Empty State -->
              <div v-if="!dataPerRombel.siswa || dataPerRombel.siswa.length === 0" class="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-lg border-2 border-gray-200">
                <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <i class="fas fa-inbox text-3xl text-gray-400"></i>
                </div>
                <h3 class="text-base font-semibold text-gray-900 mb-1">Tidak Ada Data</h3>
                <p class="text-sm text-gray-600 text-center">Tidak ada data siswa untuk rombel ini</p>
              </div>
            </div>
            </div>
          </div>

          <!-- Empty State No Rombel -->
          <div v-else class="flex flex-col items-center justify-center py-12">
            <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <i class="fas fa-users-rectangle text-2xl text-gray-400"></i>
            </div>
            <h3 class="text-base font-semibold text-gray-900 mb-1">Belum Ada Rombel</h3>
            <p class="text-sm text-gray-600">Tidak ada data rombel aktif</p>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useToast } from '~/composables/useToast'
import { useAuthGuard } from '~/composables/useAuthGuard'
import DashboardLayout from '~/components/DashboardLayout.vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

useHead({
  title: 'Rekapitulasi Data Ekstrakurikuler | PINTU SDN Sukapura 01',
  link: [
    {
      rel: 'icon',
      type: 'image/jpeg',
      href: '/logo-sekolah.jpg'
    },
    {
      rel: 'stylesheet',
      href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    }
  ]
})

const { success: showToast, error: showErrorToast } = useToast()
const { handle401 } = useAuthGuard()

// State
const mainTab = ref('per-ekskul')
const isLoadingEkskul = ref(false)
const isLoadingRombel = ref(false)
const isLoadingDataEkskul = ref(false)
const isLoadingDataRombel = ref(false)
const isDownloadingEkskul = ref(false)
const isDownloadingRombel = ref(false)

const ekskulList = ref<any[]>([])
const rombelList = ref<any[]>([])
const tahunPelajaranList = ref<any[]>([])

const selectedEkskulId = ref<number | null>(null)
const selectedRombelId = ref<number | null>(null)

const dataPerEkskul = ref<any>(null)
const dataPerRombel = ref<any>(null)

// Filters for Per Ekskul
const filtersEkskul = ref({
  tahun_pelajaran_id: 0,
  nama: null,
  nis: null,
  rombel_id: null
})

const paginationEkskul = ref({
  limit: 20,
  page: 1
})

// Filters for Per Rombel
const filtersRombel = ref({
  tahun_pelajaran_id: 0,
  nama: null,
  nis: null
})

const paginationRombel = ref({
  limit: 10,
  page: 1
})

onMounted(async () => {
  await loadTahunPelajaran()
  await loadEkstrakurikuler()
  await loadRombel()
})

watch(mainTab, (newVal) => {
  if (newVal === 'per-ekskul' && selectedEkskulId.value) {
    loadDataPerEkskul()
  } else if (newVal === 'per-rombel' && selectedRombelId.value) {
    loadDataPerRombel()
  }
})

async function loadTahunPelajaran() {
  try {
    const config = useRuntimeConfig()
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    const response = await $fetch<any>(
      `${config.public.apiBase}/api/v1/tahun-pelajaran/get-tahun-pelajaran`,
      {
        method: 'POST',
        body: {
          search: { tahun_pelajaran: null, status: null },
          pagination: { limit: 25, page: 1 }
        },
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    )

    tahunPelajaranList.value = response.data || []
    
    const activeTahun = tahunPelajaranList.value.find((t: any) => t.status === 'active')
    if (activeTahun) {
      filtersEkskul.value.tahun_pelajaran_id = activeTahun.id
      filtersRombel.value.tahun_pelajaran_id = activeTahun.id
    }
  } catch (error: any) {
    console.error('Error loading tahun pelajaran:', error)
    
    // Check if it's a 401 error (invalid or expired token)
    if (error.status === 401 || error.statusCode === 401 || 
        (error.data && error.data.error && error.data.error.includes('token'))) {
      await handle401()
      return
    }
    
    showErrorToast('Gagal Memuat Data', 'Gagal memuat data tahun pelajaran.')
  }
}

async function loadEkstrakurikuler() {
  isLoadingEkskul.value = true
  try {
    const config = useRuntimeConfig()
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    const response = await $fetch<any>(
      `${config.public.apiBase}/api/v1/ekstrakurikuler/get-ekstrakurikuler`,
      {
        method: 'POST',
        body: {
          search: { name: null, kelas_id: null, kategori: null, status: 'active' },
          pagination: { limit: 50, page: 1 }
        },
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    )

    ekskulList.value = response.data || []
    
    if (ekskulList.value.length > 0) {
      selectedEkskulId.value = ekskulList.value[0].id
      await loadDataPerEkskul()
    }
  } catch (error: any) {
    console.error('Error loading ekstrakurikuler:', error)
    
    // Check if it's a 401 error (invalid or expired token)
    if (error.status === 401 || error.statusCode === 401 || 
        (error.data && error.data.error && error.data.error.includes('token'))) {
      await handle401()
      return
    }
    
    showErrorToast('Gagal Memuat Data', 'Gagal memuat data ekstrakurikuler.')
  } finally {
    isLoadingEkskul.value = false
  }
}

async function loadRombel() {
  isLoadingRombel.value = true
  try {
    const config = useRuntimeConfig()
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    const response = await $fetch<any>(
      `${config.public.apiBase}/api/v1/rombel/get-rombel`,
      {
        method: 'POST',
        body: {
          search: { name: null, status: 'active', kelas_id: null },
          pagination: { limit: 50, page: 1 }
        },
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    )

    rombelList.value = response.data || []
    
    if (rombelList.value.length > 0) {
      selectedRombelId.value = rombelList.value[0].id
      if (mainTab.value === 'per-rombel') {
        await loadDataPerRombel()
      }
    }
  } catch (error: any) {
    console.error('Error loading rombel:', error)
    
    // Check if it's a 401 error (invalid or expired token)
    if (error.status === 401 || error.statusCode === 401 || 
        (error.data && error.data.error && error.data.error.includes('token'))) {
      await handle401()
      return
    }
    
    showErrorToast('Gagal Memuat Data', 'Gagal memuat data rombel.')
  } finally {
    isLoadingRombel.value = false
  }
}

async function loadDataPerEkskul() {
  if (!selectedEkskulId.value || filtersEkskul.value.tahun_pelajaran_id === 0) return

  isLoadingDataEkskul.value = true
  try {
    const config = useRuntimeConfig()
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    const response = await $fetch<any>(
      `${config.public.apiBase}/api/v1/ekstrakurikuler/rekapitulasi-data-per-ekskul`,
      {
        method: 'POST',
        body: {
          ekstrakurikuler_id: selectedEkskulId.value,
          search: {
            nama: filtersEkskul.value.nama || null,
            nis: filtersEkskul.value.nis || null,
            rombel_id: filtersEkskul.value.rombel_id || null,
            tahun_pelajaran_id: filtersEkskul.value.tahun_pelajaran_id
          },
          pagination: {
            limit: paginationEkskul.value.limit,
            page: paginationEkskul.value.page
          }
        },
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    )

    dataPerEkskul.value = response.data
  } catch (error: any) {
    console.error('Error loading data per ekskul:', error)
    
    // Check if it's a 401 error (invalid or expired token)
    if (error.status === 401 || error.statusCode === 401 || 
        (error.data && error.data.error && error.data.error.includes('token'))) {
      await handle401()
      return
    }
    
    const errorMessage = error?.data?.message || error?.message || 'Terjadi kesalahan saat memuat data'
    showErrorToast('Gagal Memuat Data', errorMessage)
  } finally {
    isLoadingDataEkskul.value = false
  }
}

async function loadDataPerRombel() {
  if (!selectedRombelId.value || filtersRombel.value.tahun_pelajaran_id === 0) return

  isLoadingDataRombel.value = true
  try {
    const config = useRuntimeConfig()
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    const response = await $fetch<any>(
      `${config.public.apiBase}/api/v1/ekstrakurikuler/rekapitulasi-data-per-rombel`,
      {
        method: 'POST',
        body: {
          rombel_id: selectedRombelId.value,
          tahun_pelajaran_id: filtersRombel.value.tahun_pelajaran_id,
          search: {
            nama: filtersRombel.value.nama || null,
            nis: filtersRombel.value.nis || null
          },
          pagination: {
            limit: paginationRombel.value.limit,
            page: paginationRombel.value.page
          }
        },
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    )

    dataPerRombel.value = response.data
  } catch (error: any) {
    console.error('Error loading data per rombel:', error)
    
    // Check if it's a 401 error (invalid or expired token)
    if (error.status === 401 || error.statusCode === 401 || 
        (error.data && error.data.error && error.data.error.includes('token'))) {
      await handle401()
      return
    }
    
    const errorMessage = error?.data?.message || error?.message || 'Terjadi kesalahan saat memuat data'
    showErrorToast('Gagal Memuat Data', errorMessage)
  } finally {
    isLoadingDataRombel.value = false
  }
}

function changePaginationEkskul(page: number) {
  paginationEkskul.value.page = page
  loadDataPerEkskul()
}

function changePaginationRombel(page: number) {
  paginationRombel.value.page = page
  loadDataPerRombel()
}

function resetFiltersEkskul() {
  filtersEkskul.value.nama = null
  filtersEkskul.value.nis = null
  filtersEkskul.value.rombel_id = null
  paginationEkskul.value.page = 1
  loadDataPerEkskul()
}

function resetFiltersRombel() {
  filtersRombel.value.nama = null
  filtersRombel.value.nis = null
  paginationRombel.value.page = 1
  loadDataPerRombel()
}

function formatDate(dateString: string) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function downloadExcelPerEkskul() {
  if (!selectedEkskulId.value || filtersEkskul.value.tahun_pelajaran_id === 0) {
    showErrorToast('Error', 'Pilih ekstrakurikuler dan tahun pelajaran terlebih dahulu')
    return
  }

  isDownloadingEkskul.value = true
  try {
    const config = useRuntimeConfig()
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    const response = await fetch(
      `${config.public.apiBase}/api/v1/ekstrakurikuler/download-excel-data-per-ekskul`,
      {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          tahun_pelajaran_id: filtersEkskul.value.tahun_pelajaran_id,
          ekstrakurikuler_id: selectedEkskulId.value
        })
      }
    )

    if (!response.ok) {
      throw new Error('Gagal mengunduh file')
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    
    const ekskulName = ekskulList.value.find(e => e.id === selectedEkskulId.value)?.name || 'ekstrakurikuler'
    a.download = `Data_Per_Ekstrakurikuler_${ekskulName}_${new Date().getTime()}.xlsx`
    
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    showToast('Berhasil', 'File Excel berhasil diunduh')
  } catch (error: any) {
    console.error('Error downloading excel per ekskul:', error)
    
    // Check if it's a 401 error (invalid or expired token)
    if (error.status === 401 || error.statusCode === 401 || 
        (error.data && error.data.error && error.data.error.includes('token'))) {
      await handle401()
      return
    }
    
    showErrorToast('Gagal Mengunduh', 'Terjadi kesalahan saat mengunduh file Excel')
  } finally {
    isDownloadingEkskul.value = false
  }
}

async function downloadExcelPerRombel() {
  if (!selectedRombelId.value || filtersRombel.value.tahun_pelajaran_id === 0) {
    showErrorToast('Error', 'Pilih rombel dan tahun pelajaran terlebih dahulu')
    return
  }

  isDownloadingRombel.value = true
  try {
    const config = useRuntimeConfig()
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    const response = await fetch(
      `${config.public.apiBase}/api/v1/ekstrakurikuler/download-excel-data-per-rombel`,
      {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          rombel_id: selectedRombelId.value,
          tahun_pelajaran_id: filtersRombel.value.tahun_pelajaran_id
        })
      }
    )

    if (!response.ok) {
      throw new Error('Gagal mengunduh file')
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    
    const rombelName = rombelList.value.find(r => r.id === selectedRombelId.value)?.name || 'rombel'
    a.download = `Data_Per_Rombel_${rombelName}_${new Date().getTime()}.xlsx`
    
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    showToast('Berhasil', 'File Excel berhasil diunduh')
  } catch (error: any) {
    console.error('Error downloading excel per rombel:', error)
    
    // Check if it's a 401 error (invalid or expired token)
    if (error.status === 401 || error.statusCode === 401 || 
        (error.data && error.data.error && error.data.error.includes('token'))) {
      await handle401()
      return
    }
    
    showErrorToast('Gagal Mengunduh', 'Terjadi kesalahan saat mengunduh file Excel')
  } finally {
    isDownloadingRombel.value = false
  }
}
</script>
