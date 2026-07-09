<template>
  <!-- Backdrop -->
  <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
    enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
    leave-to-class="opacity-0">
    <div v-if="modelValue" @click="closeModal" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"></div>
  </Transition>

  <!-- Modal -->
  <Transition enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
    leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0"
    leave-to-class="opacity-0 scale-95 translate-y-4">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        
        <!-- Header -->
        <div class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
          <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0"></div>
          <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0"></div>
          <div class="relative z-10 flex-1">
            <h2 class="text-lg sm:text-xl font-bold text-white">Edit Data CMB</h2>
          </div>
          <button type="button" @click.stop="closeModal" :disabled="isSubmitting" :title="'Tutup'"
            class="relative z-10 flex-shrink-0 inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-150 disabled:opacity-50 backdrop-blur-sm cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" fill="none" stroke="currentColor"
              viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="p-4 sm:p-6 lg:p-8 flex items-center justify-center flex-1">
          <div class="flex flex-col items-center gap-3 sm:gap-4">
            <div class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
            <p class="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Memuat data...</p>
          </div>
        </div>

        <!-- Form Content -->
        <form v-else @submit.prevent="handleSubmit" class="p-3 sm:p-5 md:p-8 overflow-y-auto flex-1 space-y-6">
          <!-- DATA SISWA -->
          <div class="space-y-4">
            <h3 class="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <i class="fas fa-user-graduate text-red-600"></i>
              DATA SISWA
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">NAMA LENGKAP <span class="text-red-600">*</span></label>
                <input v-model="form.nama_lengkap" type="text" required :disabled="isSubmitting"
                  class="form-input" placeholder="Contoh: AHMAD FAUZI RAHMATULLAH" />
              </div>
              
              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">NAMA PANGGILAN <span class="text-red-600">*</span></label>
                <input v-model="form.nama_panggilan" type="text" required :disabled="isSubmitting"
                  class="form-input" placeholder="Contoh: FAUZI" />
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">NISN <span class="text-red-600">*</span></label>
                <input v-model="form.nisn" type="text" required :disabled="isSubmitting"
                  class="form-input" placeholder="Contoh: 0123456789" />
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">TEMPAT LAHIR <span class="text-red-600">*</span></label>
                <input v-model="form.tempat_lahir" type="text" required :disabled="isSubmitting"
                  class="form-input" placeholder="Contoh: JAKARTA" />
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">TANGGAL LAHIR <span class="text-red-600">*</span></label>
                <input v-model="form.tanggal_lahir" type="date" required :disabled="isSubmitting"
                  class="form-input" />
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">JENIS KELAMIN <span class="text-red-600">*</span></label>
                <select v-model="form.jenis_kelamin" required :disabled="isSubmitting" class="form-input">
                  <option value="">PILIH JENIS KELAMIN</option>
                  <option value="LAKI-LAKI">LAKI-LAKI</option>
                  <option value="PEREMPUAN">PEREMPUAN</option>
                </select>
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">AGAMA <span class="text-red-600">*</span></label>
                <select v-model="form.agama" required :disabled="isSubmitting" class="form-input">
                  <option value="">PILIH AGAMA</option>
                  <option value="ISLAM">ISLAM</option>
                  <option value="KRISTEN">KRISTEN</option>
                  <option value="KATOLIK">KATOLIK</option>
                  <option value="HINDU">HINDU</option>
                  <option value="BUDDHA">BUDDHA</option>
                  <option value="KONGHUCU">KONGHUCU</option>
                </select>
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">GOLONGAN DARAH <span class="text-red-600">*</span></label>
                <select v-model="form.golongan_darah" required :disabled="isSubmitting" class="form-input">
                  <option value="">PILIH GOLONGAN DARAH</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
                </select>
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">ANAK KE <span class="text-red-600">*</span></label>
                <input v-model.number="form.anak_ke" type="number" required :disabled="isSubmitting"
                  class="form-input" placeholder="Contoh: 2" min="1" />
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">JUMLAH SAUDARA <span class="text-red-600">*</span></label>
                <input v-model.number="form.jumlah_saudara" type="number" required :disabled="isSubmitting"
                  class="form-input" placeholder="Contoh: 3" min="0" />
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">STATUS ANAK <span class="text-red-600">*</span></label>
                <select v-model="form.status_anak" required :disabled="isSubmitting" class="form-input">
                  <option value="">PILIH STATUS ANAK</option>
                  <option value="ANAK KANDUNG">ANAK KANDUNG</option>
                  <option value="ANAK ANGKAT">ANAK ANGKAT</option>
                  <option value="LAINNYA">LAINNYA</option>
                </select>
              </div>

              <div v-if="form.status_anak === 'LAINNYA'">
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">SEBUTKAN STATUS <span class="text-red-600">*</span></label>
                <input v-model="form.status_anak_custom" type="text" required :disabled="isSubmitting"
                  class="form-input" placeholder="Contoh: ANAK ASUH" />
              </div>
            </div>
          </div>

          <!-- ALAMAT -->
          <div class="space-y-4">
            <h3 class="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <i class="fas fa-map-marker-alt text-red-600"></i>
              ALAMAT
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">ALAMAT SISWA <span class="text-red-600">*</span></label>
                <textarea v-model="form.alamat" required :disabled="isSubmitting"
                  class="form-input" rows="3" placeholder="Contoh: JL. MAWAR NO. 123"></textarea>
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">RT <span class="text-red-600">*</span></label>
                <input v-model="form.rt" type="text" required :disabled="isSubmitting"
                  class="form-input" placeholder="Contoh: 001" />
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">RW <span class="text-red-600">*</span></label>
                <input v-model="form.rw" type="text" required :disabled="isSubmitting"
                  class="form-input" placeholder="Contoh: 002" />
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">KELURAHAN <span class="text-red-600">*</span></label>
                <input v-model="form.kelurahan" type="text" required :disabled="isSubmitting"
                  class="form-input" placeholder="Contoh: TUGU UTARA" />
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">KECAMATAN <span class="text-red-600">*</span></label>
                <input v-model="form.kecamatan" type="text" required :disabled="isSubmitting"
                  class="form-input" placeholder="Contoh: KOJA" />
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">KOTA <span class="text-red-600">*</span></label>
                <input v-model="form.kota" type="text" required :disabled="isSubmitting"
                  class="form-input" placeholder="Contoh: JAKARTA UTARA" />
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">PROVINSI <span class="text-red-600">*</span></label>
                <input v-model="form.provinsi" type="text" required :disabled="isSubmitting"
                  class="form-input" placeholder="Contoh: DKI JAKARTA" />
              </div>
            </div>
          </div>

          <!-- DATA ORANG TUA -->
          <div class="space-y-4">
            <h3 class="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <i class="fas fa-users text-red-600"></i>
              DATA ORANG TUA
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">NAMA AYAH <span class="text-red-600">*</span></label>
                <input v-model="form.nama_ayah" type="text" required :disabled="isSubmitting"
                  class="form-input" placeholder="Contoh: BUDI SANTOSO" />
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">NAMA IBU KANDUNG <span class="text-red-600">*</span></label>
                <input v-model="form.nama_ibu" type="text" required :disabled="isSubmitting"
                  class="form-input" placeholder="Contoh: SITI AMINAH" />
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">PENDIDIKAN AYAH <span class="text-red-600">*</span></label>
                <select v-model="form.pendidikan_ayah" required :disabled="isSubmitting" class="form-input">
                  <option value="">PILIH PENDIDIKAN</option>
                  <option value="SD">SD</option>
                  <option value="SMP">SMP</option>
                  <option value="SMA">SMA</option>
                  <option value="D2">D2</option>
                  <option value="D3">D3</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                  <option value="TIDAK SEKOLAH">TIDAK SEKOLAH</option>
                </select>
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">PENDIDIKAN IBU <span class="text-red-600">*</span></label>
                <select v-model="form.pendidikan_ibu" required :disabled="isSubmitting" class="form-input">
                  <option value="">PILIH PENDIDIKAN</option>
                  <option value="SD">SD</option>
                  <option value="SMP">SMP</option>
                  <option value="SMA">SMA</option>
                  <option value="D2">D2</option>
                  <option value="D3">D3</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                  <option value="TIDAK SEKOLAH">TIDAK SEKOLAH</option>
                </select>
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">PEKERJAAN AYAH <span class="text-red-600">*</span></label>
                <input v-model="form.pekerjaan_ayah" type="text" required :disabled="isSubmitting"
                  class="form-input" placeholder="Contoh: WIRASWASTA" />
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">PEKERJAAN IBU <span class="text-red-600">*</span></label>
                <input v-model="form.pekerjaan_ibu" type="text" required :disabled="isSubmitting"
                  class="form-input" placeholder="Contoh: IBU RUMAH TANGGA" />
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">PENGHASILAN AYAH <span class="text-red-600">*</span></label>
                <input v-model.number="form.penghasilan_ayah" type="number" required :disabled="isSubmitting"
                  class="form-input" placeholder="Contoh: 5000000" min="0" step="1000" />
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">PENGHASILAN IBU <span class="text-red-600">*</span></label>
                <input v-model.number="form.penghasilan_ibu" type="number" required :disabled="isSubmitting"
                  class="form-input" placeholder="Contoh: 3000000" min="0" step="1000" />
              </div>

              <div class="md:col-span-2">
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">NOMOR HP ORANG TUA <span class="text-red-600">*</span></label>
                <input v-model="form.nomor_hp_ortu" type="text" required :disabled="isSubmitting"
                  class="form-input" placeholder="Contoh: 081234567890" />
              </div>
            </div>
          </div>

          <!-- DATA WALI -->
          <div class="space-y-4">
            <h3 class="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <i class="fas fa-user-shield text-red-600"></i>
              DATA WALI <span class="text-sm font-normal text-gray-500">(Opsional)</span>
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">NAMA WALI</label>
                <input v-model="form.nama_wali" type="text" :disabled="isSubmitting"
                  class="form-input" placeholder="Contoh: AHMAD BUDIMAN" />
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">PENDIDIKAN WALI <span v-if="isWaliRequired" class="text-red-600">*</span></label>
                <select v-model="form.pendidikan_wali" :required="isWaliRequired ? true : false" :disabled="isSubmitting" class="form-input">
                  <option value="">PILIH PENDIDIKAN</option>
                  <option value="SD">SD</option>
                  <option value="SMP">SMP</option>
                  <option value="SMA">SMA</option>
                  <option value="D2">D2</option>
                  <option value="D3">D3</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                  <option value="TIDAK SEKOLAH">TIDAK SEKOLAH</option>
                </select>
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">HUBUNGAN WALI <span v-if="isWaliRequired" class="text-red-600">*</span></label>
                <input v-model="form.hubungan_wali" type="text" :required="isWaliRequired ? true : false" :disabled="isSubmitting"
                  class="form-input" placeholder="Contoh: PAMAN" />
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">PEKERJAAN WALI <span v-if="isWaliRequired" class="text-red-600">*</span></label>
                <input v-model="form.pekerjaan_wali" type="text" :required="isWaliRequired ? true : false" :disabled="isSubmitting"
                  class="form-input" placeholder="Contoh: PEGAWAI SWASTA" />
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">NOMOR HP WALI <span v-if="isWaliRequired" class="text-red-600">*</span></label>
                <input v-model="form.nomor_hp_wali" type="text" :required="isWaliRequired ? true : false" :disabled="isSubmitting"
                  class="form-input" placeholder="Contoh: 081234567899" />
              </div>
            </div>
          </div>

          <!-- DATA SEKOLAH -->
          <div class="space-y-4">
            <h3 class="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <i class="fas fa-school text-red-600"></i>
              ASAL MULA ANAK
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">PINDAHAN KELAS <span class="text-red-600">*</span></label>
                <input v-model.number="form.pindahan_kelas" type="number" required :disabled="isSubmitting"
                  class="form-input" placeholder="Contoh: 3" min="1" max="6" />
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">ASAL ANAK <span class="text-red-600">*</span></label>
                <select v-model="form.asal_sekolah" required :disabled="isSubmitting" class="form-input">
                  <option value="">PILIH ASAL SEKOLAH</option>
                  <option value="SD">SD</option>
                  <option value="SDI">SDI</option>
                  <option value="SDIT">SDIT</option>
                  <option value="SDK">SDK</option>
                  <option value="SDKA">SDKA</option>
                  <option value="MI">MI</option>
                  <option value="MIN">MIN</option>
                </select>
              </div>

              <div class="md:col-span-2">
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">NAMA ASAL SEKOLAH <span class="text-red-600">*</span></label>
                <input v-model="form.nama_asal_sekolah" type="text" required :disabled="isSubmitting"
                  class="form-input" placeholder="Contoh: SDN SUKAPURA 02" />
              </div>
            </div>
          </div>

          <!-- UPLOAD DOKUMEN -->
          <div class="space-y-4">
            <h3 class="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <i class="fas fa-file-upload text-red-600"></i>
              UPLOAD PERSYARATAN
            </h3>
            
            <div class="space-y-4">
              <!-- Rapor -->
              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">RAPOR <span class="text-red-600">*</span></label>
                <div v-if="existingFiles.rapor && !newFiles.rapor" class="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <a :href="existingFiles.rapor" target="_blank" class="text-sm text-blue-600 hover:underline flex items-center gap-2">
                    <i class="fas fa-file-pdf"></i>
                    Lihat Dokumen
                  </a>
                  <button type="button" @click="removeExistingFile('rapor')" :disabled="isSubmitting"
                    class="text-red-600 hover:text-red-800 text-sm">
                    <i class="fas fa-trash"></i> Hapus
                  </button>
                </div>
                <div v-else class="file-upload-area" @click="triggerFileInput('rapor')">
                  <input ref="raporInput" type="file" accept="image/*,.pdf" class="hidden" @change="handleFileChange($event, 'rapor')" />
                  <div v-if="!newFiles.rapor" class="text-center py-4">
                    <i class="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                    <p class="text-xs text-gray-600">Klik untuk upload</p>
                    <p class="text-xs text-gray-500 mt-1">Maks. 5 MB</p>
                  </div>
                  <div v-else class="flex items-center justify-between py-3">
                    <div class="flex items-center gap-2">
                      <i class="fas fa-file-pdf text-red-600 text-xl"></i>
                      <span class="text-xs text-gray-700">{{ newFiles.rapor.name }}</span>
                    </div>
                    <button type="button" @click.stop="removeNewFile('rapor')" class="text-red-600 hover:text-red-800">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Akte -->
              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">AKTE KELAHIRAN <span class="text-red-600">*</span></label>
                <div v-if="existingFiles.akte_kelahiran && !newFiles.akte_kelahiran" class="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <a :href="existingFiles.akte_kelahiran" target="_blank" class="text-sm text-blue-600 hover:underline flex items-center gap-2">
                    <i class="fas fa-file-pdf"></i>
                    Lihat Dokumen
                  </a>
                  <button type="button" @click="removeExistingFile('akte_kelahiran')" :disabled="isSubmitting"
                    class="text-red-600 hover:text-red-800 text-sm">
                    <i class="fas fa-trash"></i> Hapus
                  </button>
                </div>
                <div v-else class="file-upload-area" @click="triggerFileInput('akte_kelahiran')">
                  <input ref="akteInput" type="file" accept="image/*,.pdf" class="hidden" @change="handleFileChange($event, 'akte_kelahiran')" />
                  <div v-if="!newFiles.akte_kelahiran" class="text-center py-4">
                    <i class="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                    <p class="text-xs text-gray-600">Klik untuk upload</p>
                    <p class="text-xs text-gray-500 mt-1">Maks. 5 MB</p>
                  </div>
                  <div v-else class="flex items-center justify-between py-3">
                    <div class="flex items-center gap-2">
                      <i class="fas fa-file-pdf text-red-600 text-xl"></i>
                      <span class="text-xs text-gray-700">{{ newFiles.akte_kelahiran.name }}</span>
                    </div>
                    <button type="button" @click.stop="removeNewFile('akte_kelahiran')" class="text-red-600 hover:text-red-800">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Kartu Keluarga -->
              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">KARTU KELUARGA <span class="text-red-600">*</span></label>
                <div v-if="existingFiles.kartu_keluarga && !newFiles.kartu_keluarga" class="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <a :href="existingFiles.kartu_keluarga" target="_blank" class="text-sm text-blue-600 hover:underline flex items-center gap-2">
                    <i class="fas fa-file-pdf"></i>
                    Lihat Dokumen
                  </a>
                  <button type="button" @click="removeExistingFile('kartu_keluarga')" :disabled="isSubmitting"
                    class="text-red-600 hover:text-red-800 text-sm">
                    <i class="fas fa-trash"></i> Hapus
                  </button>
                </div>
                <div v-else class="file-upload-area" @click="triggerFileInput('kartu_keluarga')">
                  <input ref="kkInput" type="file" accept="image/*,.pdf" class="hidden" @change="handleFileChange($event, 'kartu_keluarga')" />
                  <div v-if="!newFiles.kartu_keluarga" class="text-center py-4">
                    <i class="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                    <p class="text-xs text-gray-600">Klik untuk upload</p>
                    <p class="text-xs text-gray-500 mt-1">Maks. 5 MB</p>
                  </div>
                  <div v-else class="flex items-center justify-between py-3">
                    <div class="flex items-center gap-2">
                      <i class="fas fa-file-pdf text-red-600 text-xl"></i>
                      <span class="text-xs text-gray-700">{{ newFiles.kartu_keluarga.name }}</span>
                    </div>
                    <button type="button" @click.stop="removeNewFile('kartu_keluarga')" class="text-red-600 hover:text-red-800">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- SPTJM -->
              <div>
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">SPTJM <span class="text-red-600">*</span></label>
                <div v-if="existingFiles.sptjm && !newFiles.sptjm" class="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <a :href="existingFiles.sptjm" target="_blank" class="text-sm text-blue-600 hover:underline flex items-center gap-2">
                    <i class="fas fa-file-pdf"></i>
                    Lihat Dokumen
                  </a>
                  <button type="button" @click="removeExistingFile('sptjm')" :disabled="isSubmitting"
                    class="text-red-600 hover:text-red-800 text-sm">
                    <i class="fas fa-trash"></i> Hapus
                  </button>
                </div>
                <div v-else class="file-upload-area" @click="triggerFileInput('sptjm')">
                  <input ref="sptjmInput" type="file" accept="image/*,.pdf" class="hidden" @change="handleFileChange($event, 'sptjm')" />
                  <div v-if="!newFiles.sptjm" class="text-center py-4">
                    <i class="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                    <p class="text-xs text-gray-600">Klik untuk upload</p>
                    <p class="text-xs text-gray-500 mt-1">Maks. 5 MB</p>
                  </div>
                  <div v-else class="flex items-center justify-between py-3">
                    <div class="flex items-center gap-2">
                      <i class="fas fa-file-pdf text-red-600 text-xl"></i>
                      <span class="text-xs text-gray-700">{{ newFiles.sptjm.name }}</span>
                    </div>
                    <button type="button" @click.stop="removeNewFile('sptjm')" class="text-red-600 hover:text-red-800">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="closeModal" :disabled="isSubmitting"
              class="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Batal
            </button>
            <button type="submit" :disabled="isSubmitting"
              class="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              <i v-if="!isSubmitting" class="fas fa-save"></i>
              <i v-else class="fas fa-spinner fa-spin"></i>
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { updateMutasiSiswa, getMutasiSiswaById } from '@/services/mutasi-siswa'

const props = defineProps<{
  modelValue: boolean
  mutasiId: number | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'success': []
}>()

const isLoading = ref(false)
const isSubmitting = ref(false)

const form = ref({
  nama_lengkap: '',
  nama_panggilan: '',
  nisn: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  jenis_kelamin: '',
  agama: '',
  golongan_darah: '',
  anak_ke: null as number | null,
  jumlah_saudara: null as number | null,
  status_anak: '',
  status_anak_custom: '',
  alamat: '',
  rt: '',
  rw: '',
  kelurahan: '',
  kecamatan: '',
  kota: '',
  provinsi: '',
  nama_ayah: '',
  nama_ibu: '',
  pendidikan_ayah: '',
  pendidikan_ibu: '',
  pekerjaan_ayah: '',
  pekerjaan_ibu: '',
  penghasilan_ayah: null as number | null,
  penghasilan_ibu: null as number | null,
  nomor_hp_ortu: '',
  nama_wali: '',
  pendidikan_wali: '',
  hubungan_wali: '',
  pekerjaan_wali: '',
  nomor_hp_wali: '',
  pindahan_kelas: null as number | null,
  asal_sekolah: '',
  nama_asal_sekolah: ''
})

const existingFiles = ref({
  rapor: '',
  akte_kelahiran: '',
  kartu_keluarga: '',
  sptjm: ''
})

const newFiles = ref({
  rapor: null as File | null,
  akte_kelahiran: null as File | null,
  kartu_keluarga: null as File | null,
  sptjm: null as File | null
})

const raporInput = ref<HTMLInputElement | null>(null)
const akteInput = ref<HTMLInputElement | null>(null)
const kkInput = ref<HTMLInputElement | null>(null)
const sptjmInput = ref<HTMLInputElement | null>(null)

const isWaliRequired = computed(() => {
  return form.value.nama_wali && form.value.nama_wali.trim() !== ''
})

const closeModal = () => {
  if (!isSubmitting.value) {
    emit('update:modelValue', false)
  }
}

const loadData = async () => {
  if (!props.mutasiId) return
  
  isLoading.value = true
  try {
    const response = await getMutasiSiswaById({ id: props.mutasiId })
    if (response.data) {
      const data = response.data
      
      // Map data to form
      form.value = {
        nama_lengkap: data.nama_lengkap || '',
        nama_panggilan: data.nama_panggilan || '',
        nisn: data.nisn || '',
        tempat_lahir: data.tempat_lahir || '',
        tanggal_lahir: data.tanggal_lahir || '',
        jenis_kelamin: data.jenis_kelamin || '',
        agama: data.agama || '',
        golongan_darah: data.golongan_darah || '',
        anak_ke: data.anak_ke || null,
        jumlah_saudara: data.jumlah_saudara || null,
        status_anak: data.status_anak || '',
        status_anak_custom: '',
        alamat: data.alamat || '',
        rt: data.rt || '',
        rw: data.rw || '',
        kelurahan: data.kelurahan || '',
        kecamatan: data.kecamatan || '',
        kota: data.kota || '',
        provinsi: data.provinsi || '',
        nama_ayah: data.nama_ayah || '',
        nama_ibu: data.nama_ibu || '',
        pendidikan_ayah: data.pendidikan_ayah || '',
        pendidikan_ibu: data.pendidikan_ibu || '',
        pekerjaan_ayah: data.pekerjaan_ayah || '',
        pekerjaan_ibu: data.pekerjaan_ibu || '',
        penghasilan_ayah: data.penghasilan_ayah || null,
        penghasilan_ibu: data.penghasilan_ibu || null,
        nomor_hp_ortu: data.nomor_hp_ortu || '',
        nama_wali: data.nama_wali || '',
        pendidikan_wali: data.pendidikan_wali || '',
        hubungan_wali: data.hubungan_wali || '',
        pekerjaan_wali: data.pekerjaan_wali || '',
        nomor_hp_wali: data.nomor_hp_wali || '',
        pindahan_kelas: data.pindahan_kelas || null,
        asal_sekolah: data.asal_sekolah || '',
        nama_asal_sekolah: data.nama_asal_sekolah || ''
      }
      
      // Set existing files
      existingFiles.value = {
        rapor: data.rapor || '',
        akte_kelahiran: data.akte_kelahiran || '',
        kartu_keluarga: data.kartu_keluarga || '',
        sptjm: data.sptjm || ''
      }
      
      // Reset new files
      newFiles.value = {
        rapor: null,
        akte_kelahiran: null,
        kartu_keluarga: null,
        sptjm: null
      }
    }
  } catch (error) {
    console.error('Error loading mutasi siswa:', error)
  } finally {
    isLoading.value = false
  }
}

const triggerFileInput = (type: string) => {
  if (type === 'rapor') raporInput.value?.click()
  else if (type === 'akte_kelahiran') akteInput.value?.click()
  else if (type === 'kartu_keluarga') kkInput.value?.click()
  else if (type === 'sptjm') sptjmInput.value?.click()
}

const handleFileChange = (event: Event, type: string) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5 MB')
      target.value = ''
      return
    }
    
    newFiles.value[type as keyof typeof newFiles.value] = file as any
  }
}

const removeExistingFile = (type: string) => {
  existingFiles.value[type as keyof typeof existingFiles.value] = ''
}

const removeNewFile = (type: string) => {
  newFiles.value[type as keyof typeof newFiles.value] = null
  
  // Reset input
  if (type === 'rapor' && raporInput.value) raporInput.value.value = ''
  else if (type === 'akte_kelahiran' && akteInput.value) akteInput.value.value = ''
  else if (type === 'kartu_keluarga' && kkInput.value) kkInput.value.value = ''
  else if (type === 'sptjm' && sptjmInput.value) sptjmInput.value.value = ''
}

const handleSubmit = async () => {
  if (!props.mutasiId) return
  
  // Validate files
  const hasRapor = existingFiles.value.rapor || newFiles.value.rapor
  const hasAkte = existingFiles.value.akte_kelahiran || newFiles.value.akte_kelahiran
  const hasKK = existingFiles.value.kartu_keluarga || newFiles.value.kartu_keluarga
  const hasSPTJM = existingFiles.value.sptjm || newFiles.value.sptjm
  
  if (!hasRapor || !hasAkte || !hasKK || !hasSPTJM) {
    alert('Semua dokumen wajib diisi atau di-upload!')
    return
  }
  
  // Validate wali if nama_wali is filled
  if (form.value.nama_wali && form.value.nama_wali.trim() !== '') {
    if (!form.value.pendidikan_wali || !form.value.hubungan_wali || !form.value.pekerjaan_wali || !form.value.nomor_hp_wali) {
      alert('Jika nama wali diisi, semua data wali lainnya wajib diisi!')
      return
    }
  }
  
  isSubmitting.value = true
  
  try {
    const formData = new FormData()
    
    // Add all form data - EXACT same format as public form
    formData.append('nama_lengkap', form.value.nama_lengkap)
    formData.append('nama_panggilan', form.value.nama_panggilan)
    formData.append('nisn', form.value.nisn)
    formData.append('tempat_lahir', form.value.tempat_lahir)
    formData.append('tanggal_lahir', form.value.tanggal_lahir)
    formData.append('jenis_kelamin', form.value.jenis_kelamin)
    formData.append('agama', form.value.agama)
    formData.append('golongan_darah', form.value.golongan_darah)
    formData.append('anak_ke', form.value.anak_ke?.toString() || '')
    formData.append('jumlah_saudara', form.value.jumlah_saudara?.toString() || '')
    
    // Status anak
    const statusAnak = form.value.status_anak === 'LAINNYA' 
      ? form.value.status_anak_custom 
      : form.value.status_anak
    formData.append('status_anak', statusAnak)
    
    formData.append('alamat', form.value.alamat)
    formData.append('rt', form.value.rt)
    formData.append('rw', form.value.rw)
    formData.append('kelurahan', form.value.kelurahan)
    formData.append('kecamatan', form.value.kecamatan)
    formData.append('kota', form.value.kota)
    formData.append('provinsi', form.value.provinsi)
    
    // Data orang tua
    formData.append('nama_ayah', form.value.nama_ayah)
    formData.append('nama_ibu', form.value.nama_ibu)
    formData.append('pendidikan_ayah', form.value.pendidikan_ayah)
    formData.append('pendidikan_ibu', form.value.pendidikan_ibu)
    formData.append('pekerjaan_ayah', form.value.pekerjaan_ayah)
    formData.append('pekerjaan_ibu', form.value.pekerjaan_ibu)
    formData.append('penghasilan_ayah', form.value.penghasilan_ayah?.toString() || '0')
    formData.append('penghasilan_ibu', form.value.penghasilan_ibu?.toString() || '0')
    formData.append('nomor_hp_ortu', form.value.nomor_hp_ortu)
    
    // Data wali (opsional)
    formData.append('nama_wali', form.value.nama_wali || '')
    formData.append('pendidikan_wali', form.value.pendidikan_wali || '')
    formData.append('hubungan_wali', form.value.hubungan_wali || '')
    formData.append('pekerjaan_wali', form.value.pekerjaan_wali || '')
    formData.append('nomor_hp_wali', form.value.nomor_hp_wali || '')
    
    // Asal mula anak
    formData.append('pindahan_kelas', form.value.pindahan_kelas?.toString() || '')
    formData.append('asal_sekolah', form.value.asal_sekolah)
    formData.append('nama_asal_sekolah', form.value.nama_asal_sekolah)
    
    // Files - only append new files if uploaded
    if (newFiles.value.rapor) formData.append('rapor', newFiles.value.rapor)
    if (newFiles.value.akte_kelahiran) formData.append('akte_kelahiran', newFiles.value.akte_kelahiran)
    if (newFiles.value.kartu_keluarga) formData.append('kartu_keluarga', newFiles.value.kartu_keluarga)
    if (newFiles.value.sptjm) formData.append('sptjm', newFiles.value.sptjm)
    
    await updateMutasiSiswa(props.mutasiId, formData)
    emit('success')
    closeModal()
  } catch (error: any) {
    console.error('Error updating mutasi siswa:', error)
    alert(error?.message || 'Gagal menyimpan perubahan')
  } finally {
    isSubmitting.value = false
  }
}

watch(() => props.modelValue, (newValue) => {
  if (newValue && props.mutasiId) {
    loadData()
  }
})
</script>

<style scoped>
.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  background: #ffffff;
  text-transform: uppercase;
}

.form-input:hover {
  border-color: #cbd5e1;
}

.form-input:focus {
  outline: none;
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-input::placeholder {
  text-transform: none;
  color: #9ca3af;
  font-weight: 400;
}

.form-input:disabled {
  background: #f9fafb;
  cursor: not-allowed;
  opacity: 0.6;
}

.file-upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f9fafb;
}

.file-upload-area:hover {
  border-color: #ef4444;
  background: #fef2f2;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1);
}
</style>
