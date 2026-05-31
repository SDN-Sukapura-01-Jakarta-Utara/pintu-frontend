<template>
  <DashboardLayout>
    <!-- Header Section -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Input Kehadiran</h1>
      <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
        Input kehadiran siswa sebagai guru kelas atau guru mata pelajaran
      </p>
    </div>

    <!-- Main Content -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <div class="px-4 sm:px-6">
          <div class="flex gap-1 overflow-x-auto -mb-px" style="scrollbar-width: thin;">
            <button
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
                Input Kehadiran sebagai Guru Kelas
              </span>
            </button>
            <button
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
                Input Kehadiran sebagai Guru Mapel
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Tab Content: Guru Kelas -->
      <div v-if="activeTab === 'guru-kelas'" class="p-4 sm:p-6 md:p-8">
        <form @submit.prevent="handleSubmit">
          <!-- Filter Section -->
          <div class="mb-8 pb-8 border-b border-gray-200">
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <i class="fa-solid fa-calendar-check text-red-600"></i>
              Informasi Kehadiran
            </h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- Rombel -->
              <div>
                <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-2">
                  Rombel <span class="text-red-600">*</span>
                </label>
                <select
                  v-model.number="formData.rombel_id"
                  @change="loadStudents"
                  class="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                  required
                  :disabled="isSubmitting || isLoadingStudents"
                >
                  <option :value="0" disabled>Pilih Rombel</option>
                  <option v-for="rombel in activeRombelList" :key="rombel.id" :value="rombel.id">
                    {{ rombel.name }}
                  </option>
                </select>
              </div>

              <!-- Tahun Pelajaran -->
              <div>
                <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-2">
                  Tahun Pelajaran <span class="text-red-600">*</span>
                </label>
                <select
                  v-model.number="formData.tahun_pelajaran_id"
                  @change="loadStudents"
                  class="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                  required
                  :disabled="isSubmitting || isLoadingStudents"
                >
                  <option v-for="tahun in activeTahunPelajaranList" :key="tahun.id" :value="tahun.id">
                    {{ tahun.tahun_pelajaran }}
                  </option>
                </select>
              </div>

              <!-- Semester -->
              <div>
                <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-2">
                  Semester <span class="text-red-600">*</span>
                </label>
                <select
                  v-model.number="formData.semester"
                  class="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                  required
                  :disabled="isSubmitting"
                >
                  <option :value="1">Semester 1</option>
                  <option :value="2">Semester 2</option>
                </select>
              </div>

              <!-- Tanggal -->
              <div>
                <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-2">
                  Tanggal <span class="text-red-600">*</span>
                </label>
                <input
                  v-model="formData.tanggal"
                  type="date"
                  class="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                  required
                  :disabled="isSubmitting"
                />
              </div>
            </div>
          </div>

          <!-- Students Table Section -->
          <div v-if="studentsList.length > 0" class="mb-8">
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <i class="fa-solid fa-users text-red-600"></i>
              Daftar Kehadiran Siswa
            </h2>

            <div class="overflow-x-auto">
              <table class="w-full border-collapse">
                <thead>
                  <tr style="background-color: #1f2937;">
                    <th class="px-4 py-3 text-left text-xs font-semibold border-b-2" style="color: white; border-color: #374151;">NO</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold border-b-2" style="color: white; border-color: #374151;">NAMA SISWA</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold border-b-2" style="color: white; border-color: #374151;">JENIS KELAMIN</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold border-b-2" style="color: white; border-color: #374151;">STATUS KEHADIRAN</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold border-b-2" style="color: white; border-color: #374151;">KETERANGAN</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold border-b-2" style="color: white; border-color: #374151;">UPLOAD SURAT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(student, index) in studentsList" :key="student.id" class="hover:bg-gray-50">
                    <td class="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">{{ index + 1 }}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">{{ student.nama }}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                      {{ student.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}
                    </td>
                    <td class="px-4 py-3 border-b border-gray-200">
                      <select
                        v-model="formData.absensi_list[index].status"
                        class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                        :disabled="isSubmitting"
                      >
                        <option value="hadir">Hadir</option>
                        <option value="sakit">Sakit</option>
                        <option value="izin">Izin</option>
                        <option value="alpa">Alpa</option>
                      </select>
                    </td>
                    <td class="px-4 py-3 border-b border-gray-200">
                      <input
                        v-model="formData.absensi_list[index].keterangan"
                        type="text"
                        placeholder="Keterangan (opsional)"
                        class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                        :disabled="isSubmitting"
                      />
                    </td>
                    <td class="px-4 py-3 border-b border-gray-200">
                      <input
                        :ref="el => fileInputRefs[index] = el"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        @change="handleFileChange(index, $event)"
                        class="hidden"
                      />
                      <div v-if="uploadedFiles[index]" class="flex items-center gap-2">
                        <span class="text-xs text-gray-600 truncate max-w-[150px]">{{ uploadedFiles[index].name }}</span>
                        <button
                          type="button"
                          @click="removeFile(index)"
                          class="text-red-600 hover:text-red-700"
                          :disabled="isSubmitting"
                        >
                          <i class="fa-solid fa-trash text-xs"></i>
                        </button>
                      </div>
                      <div v-else>
                        <button
                          type="button"
                          @click="triggerFileInput(index)"
                          class="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                          :disabled="isSubmitting"
                        >
                          <i class="fa-solid fa-upload mr-1"></i>
                          Upload
                        </button>
                        <p class="text-[10px] text-gray-500 mt-1">Maks. 5MB</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="!isLoadingStudents" class="flex flex-col items-center justify-center py-12">
            <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <i class="fa-solid fa-users text-2xl text-gray-400"></i>
            </div>
            <h3 class="text-base font-semibold text-gray-900 mb-1">Belum ada data siswa</h3>
            <p class="text-sm text-gray-600">Pilih rombel dan tahun pelajaran untuk memuat data siswa</p>
          </div>

          <!-- Loading State -->
          <div v-if="isLoadingStudents" class="flex items-center justify-center py-12">
            <div class="flex flex-col items-center gap-3">
              <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
              <p class="text-sm text-gray-600 font-medium">Memuat data siswa...</p>
            </div>
          </div>

          <!-- Alerts Section -->
          <div v-if="studentsList.length > 0" class="mb-6 space-y-3">
            <!-- Error Alert -->
            <div v-if="submitError" class="p-3 sm:p-4 bg-red-50 border-2 border-red-200 rounded-lg">
              <div class="flex gap-2 sm:gap-3">
                <i class="fa-solid fa-exclamation-circle text-red-600 text-sm sm:text-base flex-shrink-0 mt-0.5"></i>
                <div class="flex-1 text-xs sm:text-sm">
                  <p class="font-semibold text-red-900">Error</p>
                  <p class="text-red-800 mt-1">{{ submitError }}</p>
                </div>
              </div>
            </div>

            <!-- Success Alert -->
            <div v-if="showSuccessMessage" class="p-3 sm:p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <div class="flex gap-2 sm:gap-3">
                <i class="fa-solid fa-check-circle text-green-600 text-sm sm:text-base flex-shrink-0 mt-0.5"></i>
                <div class="flex-1 text-xs sm:text-sm">
                  <p class="font-semibold text-green-900">Berhasil</p>
                  <p class="text-green-800 mt-1">{{ successMessage }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div v-if="studentsList.length > 0" class="flex justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="resetForm"
              :disabled="isSubmitting"
              class="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm cursor-pointer"
            >
              Reset
            </button>
            <button
              type="submit"
              :disabled="isSubmitting || studentsList.length === 0"
              class="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
            >
              <svg v-if="isSubmitting" class="w-3 h-3 sm:w-4 sm:h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan Kehadiran' }}</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Tab Content: Guru Mapel -->
      <div v-if="activeTab === 'guru-mapel'" class="p-4 sm:p-6 md:p-8">
        <form @submit.prevent="handleSubmitMapel">
          <!-- Filter Section -->
          <div class="mb-8 pb-8 border-b border-gray-200">
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <i class="fa-solid fa-calendar-check text-red-600"></i>
              Informasi Kehadiran
            </h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <!-- Bidang Studi -->
              <div>
                <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-2">
                  Bidang Studi <span class="text-red-600">*</span>
                </label>
                <select
                  v-model.number="formDataMapel.bidang_studi_id"
                  class="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                  required
                  :disabled="isSubmitting"
                >
                  <option :value="0" disabled>Pilih Bidang Studi</option>
                  <option v-for="bidang in activeBidangStudiList" :key="bidang.id" :value="bidang.id">
                    {{ bidang.name }}
                  </option>
                </select>
              </div>

              <!-- Rombel -->
              <div>
                <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-2">
                  Rombel <span class="text-red-600">*</span>
                </label>
                <select
                  v-model.number="formDataMapel.rombel_id"
                  @change="loadStudentsMapel"
                  class="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                  required
                  :disabled="isSubmitting || isLoadingStudents"
                >
                  <option :value="0" disabled>Pilih Rombel</option>
                  <option v-for="rombel in activeRombelList" :key="rombel.id" :value="rombel.id">
                    {{ rombel.name }}
                  </option>
                </select>
              </div>

              <!-- Tahun Pelajaran -->
              <div>
                <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-2">
                  Tahun Pelajaran <span class="text-red-600">*</span>
                </label>
                <select
                  v-model.number="formDataMapel.tahun_pelajaran_id"
                  @change="loadStudentsMapel"
                  class="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                  required
                  :disabled="isSubmitting || isLoadingStudents"
                >
                  <option v-for="tahun in activeTahunPelajaranList" :key="tahun.id" :value="tahun.id">
                    {{ tahun.tahun_pelajaran }}
                  </option>
                </select>
              </div>

              <!-- Semester -->
              <div>
                <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-2">
                  Semester <span class="text-red-600">*</span>
                </label>
                <select
                  v-model.number="formDataMapel.semester"
                  class="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                  required
                  :disabled="isSubmitting"
                >
                  <option :value="1">Semester 1</option>
                  <option :value="2">Semester 2</option>
                </select>
              </div>

              <!-- Pertemuan Ke -->
              <div>
                <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-2">
                  Pertemuan Ke <span class="text-red-600">*</span>
                </label>
                <select
                  v-model.number="formDataMapel.pertemuan_ke"
                  class="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                  required
                  :disabled="isSubmitting"
                >
                  <option v-for="n in 10" :key="n" :value="n">Pertemuan {{ n }}</option>
                </select>
              </div>

              <!-- Tanggal -->
              <div>
                <label class="block text-sm sm:text-base font-semibold text-gray-900 mb-2">
                  Tanggal <span class="text-red-600">*</span>
                </label>
                <input
                  v-model="formDataMapel.tanggal"
                  type="date"
                  class="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                  required
                  :disabled="isSubmitting"
                />
              </div>
            </div>
          </div>

          <!-- Students Table Section -->
          <div v-if="studentsListMapel.length > 0" class="mb-8">
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <i class="fa-solid fa-users text-red-600"></i>
              Daftar Kehadiran Siswa
            </h2>

            <div class="overflow-x-auto">
              <table class="w-full border-collapse">
                <thead>
                  <tr style="background-color: #1f2937;">
                    <th class="px-4 py-3 text-left text-xs font-semibold border-b-2" style="color: white; border-color: #374151;">NO</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold border-b-2" style="color: white; border-color: #374151;">NAMA SISWA</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold border-b-2" style="color: white; border-color: #374151;">JENIS KELAMIN</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold border-b-2" style="color: white; border-color: #374151;">STATUS KEHADIRAN</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold border-b-2" style="color: white; border-color: #374151;">KETERANGAN</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold border-b-2" style="color: white; border-color: #374151;">UPLOAD SURAT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(student, index) in studentsListMapel" :key="student.id" class="hover:bg-gray-50">
                    <td class="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">{{ index + 1 }}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">{{ student.nama }}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                      {{ student.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}
                    </td>
                    <td class="px-4 py-3 border-b border-gray-200">
                      <select
                        v-model="formDataMapel.absensi_list[index].status"
                        class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                        :disabled="isSubmitting"
                      >
                        <option value="hadir">Hadir</option>
                        <option value="sakit">Sakit</option>
                        <option value="izin">Izin</option>
                        <option value="alpa">Alpa</option>
                      </select>
                    </td>
                    <td class="px-4 py-3 border-b border-gray-200">
                      <input
                        v-model="formDataMapel.absensi_list[index].keterangan"
                        type="text"
                        placeholder="Keterangan (opsional)"
                        class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-sm"
                        :disabled="isSubmitting"
                      />
                    </td>
                    <td class="px-4 py-3 border-b border-gray-200">
                      <input
                        :ref="el => fileInputRefsMapel[index] = el"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        @change="handleFileChangeMapel(index, $event)"
                        class="hidden"
                      />
                      <div v-if="uploadedFilesMapel[index]" class="flex items-center gap-2">
                        <span class="text-xs text-gray-600 truncate max-w-[150px]">{{ uploadedFilesMapel[index].name }}</span>
                        <button
                          type="button"
                          @click="removeFileMapel(index)"
                          class="text-red-600 hover:text-red-700"
                          :disabled="isSubmitting"
                        >
                          <i class="fa-solid fa-trash text-xs"></i>
                        </button>
                      </div>
                      <div v-else>
                        <button
                          type="button"
                          @click="triggerFileInputMapel(index)"
                          class="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                          :disabled="isSubmitting"
                        >
                          <i class="fa-solid fa-upload mr-1"></i>
                          Upload
                        </button>
                        <p class="text-[10px] text-gray-500 mt-1">Maks. 5MB</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="!isLoadingStudents" class="flex flex-col items-center justify-center py-12">
            <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <i class="fa-solid fa-users text-2xl text-gray-400"></i>
            </div>
            <h3 class="text-base font-semibold text-gray-900 mb-1">Belum ada data siswa</h3>
            <p class="text-sm text-gray-600">Pilih rombel dan tahun pelajaran untuk memuat data siswa</p>
          </div>

          <!-- Loading State -->
          <div v-if="isLoadingStudents" class="flex items-center justify-center py-12">
            <div class="flex flex-col items-center gap-3">
              <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
              <p class="text-sm text-gray-600 font-medium">Memuat data siswa...</p>
            </div>
          </div>

          <!-- Alerts Section -->
          <div v-if="studentsListMapel.length > 0" class="mb-6 space-y-3">
            <!-- Error Alert -->
            <div v-if="submitError" class="p-3 sm:p-4 bg-red-50 border-2 border-red-200 rounded-lg">
              <div class="flex gap-2 sm:gap-3">
                <i class="fa-solid fa-exclamation-circle text-red-600 text-sm sm:text-base flex-shrink-0 mt-0.5"></i>
                <div class="flex-1 text-xs sm:text-sm">
                  <p class="font-semibold text-red-900">Error</p>
                  <p class="text-red-800 mt-1">{{ submitError }}</p>
                </div>
              </div>
            </div>

            <!-- Success Alert -->
            <div v-if="showSuccessMessage" class="p-3 sm:p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <div class="flex gap-2 sm:gap-3">
                <i class="fa-solid fa-check-circle text-green-600 text-sm sm:text-base flex-shrink-0 mt-0.5"></i>
                <div class="flex-1 text-xs sm:text-sm">
                  <p class="font-semibold text-green-900">Berhasil</p>
                  <p class="text-green-800 mt-1">{{ successMessage }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div v-if="studentsListMapel.length > 0" class="flex justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="resetFormMapel"
              :disabled="isSubmitting"
              class="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm cursor-pointer"
            >
              Reset
            </button>
            <button
              type="submit"
              :disabled="isSubmitting || studentsListMapel.length === 0"
              class="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
            >
              <svg v-if="isSubmitting" class="w-3 h-3 sm:w-4 sm:h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan Kehadiran' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRombelStore } from '~/stores/RombelStore'
import { useTahunPelajaranStore } from '~/stores/TahunPelajaranStore'
import { usePesertaDidikStore } from '~/stores/PesertaDidikStore'
import { useBidangStudiStore } from '~/stores/BidangStudiStore'
import { useToast } from '~/composables/useToast'
import { createAbsensiManual } from '~/services/absensi'
import DashboardLayout from '~/components/DashboardLayout.vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

useHead({
  title: 'Input Kehadiran | Pintu SDN Sukapura 01'
})

const { success: showToast, error: showErrorToast } = useToast()
const rombelStore = useRombelStore()
const tahunPelajaranStore = useTahunPelajaranStore()
const pesertaDidikStore = usePesertaDidikStore()
const bidangStudiStore = useBidangStudiStore()

// State
const activeTab = ref('guru-kelas')
const isSubmitting = ref(false)
const isLoadingStudents = ref(false)
const submitError = ref<string | null>(null)
const showSuccessMessage = ref(false)
const successMessage = ref('')

const rombelList = ref<any[]>([])
const tahunPelajaranList = ref<any[]>([])
const bidangStudiList = ref<any[]>([])
const studentsList = ref<any[]>([])
const studentsListMapel = ref<any[]>([])
const uploadedFiles = ref<{ [key: number]: File }>({})
const uploadedFilesMapel = ref<{ [key: number]: File }>({})
const fileInputRefs = ref<any[]>([])
const fileInputRefsMapel = ref<any[]>([])

// Get current date
const today = new Date()
const currentMonth = today.getMonth() + 1 // 1-12
// Semester 1: Juli-Desember (7-12), Semester 2: Januari-Juni (1-6)
const defaultSemester = currentMonth >= 7 && currentMonth <= 12 ? 1 : 2

const formData = ref({
  rombel_id: 0,
  tahun_pelajaran_id: 0,
  semester: defaultSemester,
  tanggal: today.toISOString().split('T')[0],
  waktu_absen: '',
  bidang_studi_id: null,
  pertemuan_ke: null,
  absensi_list: [] as Array<{
    peserta_didik_id: number
    status: string
    keterangan: string
  }>
})

const formDataMapel = ref({
  rombel_id: 0,
  tahun_pelajaran_id: 0,
  semester: defaultSemester,
  tanggal: today.toISOString().split('T')[0],
  waktu_absen: '',
  bidang_studi_id: 0,
  pertemuan_ke: 1,
  absensi_list: [] as Array<{
    peserta_didik_id: number
    status: string
    keterangan: string
  }>
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

// Methods
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
        formData.value.tahun_pelajaran_id = activeTahun.id
        formDataMapel.value.tahun_pelajaran_id = activeTahun.id
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

const loadStudents = async () => {
  if (!formData.value.rombel_id || !formData.value.tahun_pelajaran_id) {
    studentsList.value = []
    return
  }

  isLoadingStudents.value = true
  try {
    const search = {
      rombel_id: formData.value.rombel_id,
      tahun_pelajaran_id: formData.value.tahun_pelajaran_id,
      status: 'active'
    }

    const result = await pesertaDidikStore.fetchPesertaDidik(search, 1, 1000)
    
    if (result.success) {
      studentsList.value = pesertaDidikStore.pesertaDidiks
      
      // Initialize absensi_list
      formData.value.absensi_list = studentsList.value.map((student: any) => ({
        peserta_didik_id: student.id,
        status: 'hadir',
        keterangan: ''
      }))
      
      // Reset uploaded files
      uploadedFiles.value = {}
    }
  } catch (err) {
    console.error('Error loading students:', err)
    studentsList.value = []
  } finally {
    isLoadingStudents.value = false
  }
}

const loadStudentsMapel = async () => {
  if (!formDataMapel.value.rombel_id || !formDataMapel.value.tahun_pelajaran_id) {
    studentsListMapel.value = []
    return
  }

  isLoadingStudents.value = true
  try {
    const search = {
      rombel_id: formDataMapel.value.rombel_id,
      tahun_pelajaran_id: formDataMapel.value.tahun_pelajaran_id,
      status: 'active'
    }

    const result = await pesertaDidikStore.fetchPesertaDidik(search, 1, 1000)
    
    if (result.success) {
      studentsListMapel.value = pesertaDidikStore.pesertaDidiks
      
      // Initialize absensi_list
      formDataMapel.value.absensi_list = studentsListMapel.value.map((student: any) => ({
        peserta_didik_id: student.id,
        status: 'hadir',
        keterangan: ''
      }))
      
      // Reset uploaded files
      uploadedFilesMapel.value = {}
    }
  } catch (err) {
    console.error('Error loading students:', err)
    studentsListMapel.value = []
  } finally {
    isLoadingStudents.value = false
  }
}

const triggerFileInput = (index: number) => {
  if (fileInputRefs.value[index]) {
    fileInputRefs.value[index].click()
  }
}

const handleFileChange = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Error', 'Ukuran file maksimal 5MB')
      return
    }
    
    uploadedFiles.value[index] = file
  }
}

const removeFile = (index: number) => {
  delete uploadedFiles.value[index]
  if (fileInputRefs.value[index]) {
    fileInputRefs.value[index].value = ''
  }
}

const triggerFileInputMapel = (index: number) => {
  if (fileInputRefsMapel.value[index]) {
    fileInputRefsMapel.value[index].click()
  }
}

const handleFileChangeMapel = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showErrorToast('Error', 'Ukuran file maksimal 5MB')
      return
    }
    
    uploadedFilesMapel.value[index] = file
  }
}

const removeFileMapel = (index: number) => {
  delete uploadedFilesMapel.value[index]
  if (fileInputRefsMapel.value[index]) {
    fileInputRefsMapel.value[index].value = ''
  }
}

const handleSubmit = async () => {
  isSubmitting.value = true
  submitError.value = null
  showSuccessMessage.value = false

  try {
    // Set waktu_absen to current datetime
    const now = new Date()
    formData.value.waktu_absen = `${formData.value.tanggal} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:00`

    // Create FormData for file upload
    const formDataToSend = new FormData()
    formDataToSend.append('data', JSON.stringify({
      rombel_id: formData.value.rombel_id,
      tahun_pelajaran_id: formData.value.tahun_pelajaran_id,
      semester: formData.value.semester,
      tanggal: formData.value.tanggal,
      waktu_absen: formData.value.waktu_absen,
      bidang_studi_id: formData.value.bidang_studi_id,
      absensi_list: formData.value.absensi_list
    }))

    // Append files
    Object.keys(uploadedFiles.value).forEach((key) => {
      const index = parseInt(key)
      const file = uploadedFiles.value[index]
      formDataToSend.append(`file_surat_${index + 1}`, file)
    })

    const response = await createAbsensiManual(formDataToSend)

    if (response.data) {
      const { total_success = 0, total_failed = 0, message = '', errors = [] } = response.data

      // Check if all failed
      if (total_success === 0 && total_failed > 0) {
        // All failed - show error
        const errorMessage = errors.length > 0 ? errors[0].message : message
        submitError.value = `Gagal menyimpan kehadiran: ${errorMessage}`
        showErrorToast('Gagal', submitError.value)
      } else if (total_failed > 0 && total_success > 0) {
        // Partial success - show warning
        successMessage.value = `${total_success} data berhasil disimpan, ${total_failed} gagal`
        showToast('Peringatan', successMessage.value)
        showSuccessMessage.value = true
        
        setTimeout(() => {
          showSuccessMessage.value = false
          resetForm()
        }, 3000)
      } else {
        // All success
        successMessage.value = message || 'Data kehadiran berhasil disimpan'
        showToast('Berhasil', successMessage.value)
        showSuccessMessage.value = true
        
        // Redirect to rekap page after 1.5 seconds
        setTimeout(() => {
          navigateTo({
            path: '/backoffice/absensi-siswa/rekap',
            query: {
              tab: 'guru-kelas',
              rombel_id: formData.value.rombel_id,
              tahun_pelajaran_id: formData.value.tahun_pelajaran_id
            }
          })
        }, 1500)
      }
    }
  } catch (err: any) {
    console.error('Error saving attendance:', err)
    // Handle error from $fetch - check multiple possible error structures
    const errorMessage = err.data?.error || err.data?.message || err.response?.data?.error || err.response?.data?.message || err.message || 'Gagal menyimpan data kehadiran'
    submitError.value = errorMessage
    showErrorToast('Gagal', errorMessage)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  // Reset form to initial state
  formData.value.absensi_list = studentsList.value.map((student: any) => ({
    peserta_didik_id: student.id,
    status: 'hadir',
    keterangan: ''
  }))
  
  uploadedFiles.value = {}
  fileInputRefs.value.forEach((ref: any) => {
    if (ref) ref.value = ''
  })
  
  submitError.value = null
  showSuccessMessage.value = false
}

const resetFormMapel = () => {
  // Reset form to initial state
  formDataMapel.value.absensi_list = studentsListMapel.value.map((student: any) => ({
    peserta_didik_id: student.id,
    status: 'hadir',
    keterangan: ''
  }))
  
  uploadedFilesMapel.value = {}
  fileInputRefsMapel.value.forEach((ref: any) => {
    if (ref) ref.value = ''
  })
  
  submitError.value = null
  showSuccessMessage.value = false
}

const handleSubmitMapel = async () => {
  isSubmitting.value = true
  submitError.value = null
  showSuccessMessage.value = false

  try {
    // Set waktu_absen to current datetime
    const now = new Date()
    formDataMapel.value.waktu_absen = `${formDataMapel.value.tanggal} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:00`

    // Create FormData for file upload
    const formDataToSend = new FormData()
    formDataToSend.append('data', JSON.stringify({
      rombel_id: formDataMapel.value.rombel_id,
      tahun_pelajaran_id: formDataMapel.value.tahun_pelajaran_id,
      semester: formDataMapel.value.semester,
      tanggal: formDataMapel.value.tanggal,
      waktu_absen: formDataMapel.value.waktu_absen,
      bidang_studi_id: formDataMapel.value.bidang_studi_id,
      pertemuan_ke: formDataMapel.value.pertemuan_ke,
      absensi_list: formDataMapel.value.absensi_list
    }))

    // Append files
    Object.keys(uploadedFilesMapel.value).forEach((key) => {
      const index = parseInt(key)
      const file = uploadedFilesMapel.value[index]
      formDataToSend.append(`file_surat_${index + 1}`, file)
    })

    const response = await createAbsensiManual(formDataToSend)

    if (response.data) {
      const { total_success = 0, total_failed = 0, message = '', errors = [] } = response.data

      // Check if all failed
      if (total_success === 0 && total_failed > 0) {
        // All failed - show error
        const errorMessage = errors.length > 0 ? errors[0].message : message
        submitError.value = `Gagal menyimpan kehadiran: ${errorMessage}`
        showErrorToast('Gagal', submitError.value)
      } else if (total_failed > 0 && total_success > 0) {
        // Partial success - show warning
        successMessage.value = `${total_success} data berhasil disimpan, ${total_failed} gagal`
        showToast('Peringatan', successMessage.value)
        showSuccessMessage.value = true
        
        setTimeout(() => {
          showSuccessMessage.value = false
          resetFormMapel()
        }, 3000)
      } else {
        // All success
        successMessage.value = message || 'Data kehadiran berhasil disimpan'
        showToast('Berhasil', successMessage.value)
        showSuccessMessage.value = true
        
        // Redirect to rekap page after 1.5 seconds
        setTimeout(() => {
          navigateTo({
            path: '/backoffice/absensi-siswa/rekap',
            query: {
              tab: 'guru-mapel',
              rombel_id: formDataMapel.value.rombel_id,
              tahun_pelajaran_id: formDataMapel.value.tahun_pelajaran_id,
              bidang_studi_id: formDataMapel.value.bidang_studi_id
            }
          })
        }, 1500)
      }
    }
  } catch (err: any) {
    console.error('Error saving attendance:', err)
    // Handle error from $fetch - check multiple possible error structures
    const errorMessage = err.data?.error || err.data?.message || err.response?.data?.error || err.response?.data?.message || err.message || 'Gagal menyimpan data kehadiran'
    submitError.value = errorMessage
    showErrorToast('Gagal', errorMessage)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  await Promise.all([loadRombelList(), loadTahunPelajaranList(), loadBidangStudiList()])
})
</script>
