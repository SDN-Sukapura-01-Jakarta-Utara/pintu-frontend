<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- Popup Pendaftaran Belum Dibuka (Tidak bisa ditutup) -->
    <div v-if="!isPendaftaranOpen" class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[60] p-4">
      <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-bounce-in border-4 border-red-500">
        <div class="text-center">
          <div class="mx-auto w-24 h-24 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mb-6 shadow-lg animate-pulse">
            <i class="fas fa-calendar-times text-white text-5xl"></i>
          </div>
          
          <h3 class="text-2xl font-bold text-gray-800 mb-3">
            {{ pendaftaranStatus === 'belum_buka' ? 'Pendaftaran Belum Dibuka' : 'Pendaftaran Sudah Ditutup' }}
          </h3>
          
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 mb-6 border-2 border-blue-200">
            <p class="text-gray-700 font-semibold mb-3">Periode Pendaftaran:</p>
            <div class="flex items-center justify-center gap-2">
              <i class="fas fa-calendar-alt text-blue-600"></i>
              <span class="font-bold text-gray-800">{{ formatDate(tanggalBukaPendaftaran) }} - {{ formatDate(tanggalTutupPendaftaran) }}</span>
            </div>
          </div>

          <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-4">
            <p class="text-sm text-gray-700 flex items-start">
              <i class="fas fa-info-circle text-yellow-600 mr-2 mt-0.5"></i>
              <span>Untuk informasi lebih lanjut, silakan kunjungi website sekolah kami:</span>
            </p>
          </div>

          <a href="https://sdnsukapura01.sch.id/" target="_blank" class="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg">
            <i class="fas fa-external-link-alt mr-2"></i>Kunjungi Website
          </a>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-bounce-in border-2 border-gray-100">
        <div class="text-center">
          <div class="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <i class="fas fa-check-circle text-white text-4xl"></i>
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-2">Pendaftaran Berhasil!</h3>
          <p class="text-gray-600 mb-2">Nomor Pendaftaran Anda:</p>
          
          <!-- Nomor Pendaftaran dengan Background Lebih Bagus -->
          <div class="relative mb-6">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl blur opacity-75"></div>
            <div class="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl p-6 shadow-lg">
              <p class="text-3xl font-black text-white tracking-wider">{{ registrationNumber }}/CMB/{{ currentYear }}</p>
            </div>
          </div>
          
          <div class="space-y-3">
            <button @click="downloadFormulir" class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] shadow-md hover:shadow-lg">
              <i class="fas fa-download mr-2"></i>Download Formulir Pendaftaran
            </button>
            <a :href="whatsappGroupLink" target="_blank" class="block w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] shadow-md hover:shadow-lg">
              <i class="fab fa-whatsapp mr-2"></i>Join Grup WhatsApp
            </a>
          </div>

          <div class="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg text-left">
            <p class="font-bold text-gray-800 mb-3 flex items-center">
              <i class="fas fa-info-circle text-blue-600 mr-2"></i>
              Berkas Fisik yang Dibawa ke Sekolah:
            </p>
            <ol class="text-sm text-gray-700 space-y-1">
              <li>1. Fotokopi Akta Kelahiran</li>
              <li>2. Fotokopi Kartu Keluarga</li>
              <li>3. Fotokopi Rapor Terakhir (sudah dilegalisir)</li>
              <li>4. SPTJM sudah TTD di atas materai</li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Notification -->
    <div v-if="showErrorNotification" class="fixed top-4 right-4 z-50 animate-slide-in">
      <div class="bg-red-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-start max-w-md">
        <i class="fas fa-exclamation-circle text-2xl mr-3 flex-shrink-0 mt-1"></i>
        <div class="flex-1">
          <p class="font-bold mb-1">{{ errorMessage }}</p>
        </div>
        <button @click="showErrorNotification = false" class="ml-3 text-white hover:text-gray-200">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Header -->
      <div class="bg-white rounded-2xl shadow-lg p-8 mb-6 border-t-4 border-blue-600">
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
            <i class="fas fa-school text-white text-2xl"></i>
          </div>
        </div>

        <h1 class="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4 leading-tight">
          PENDAFTARAN MUTASI SISWA<br>SDN SUKAPURA 01
        </h1>
        <div class="text-center">
          <div class="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg px-6 py-2 shadow-md">
            <p class="text-base font-semibold text-white">
              <i class="fas fa-calendar-alt mr-2"></i>SEMESTER {{ currentSemester }} TAHUN PELAJARAN {{ tahunPelajaran }}
            </p>
          </div>
        </div>
      </div>

      <form @submit.prevent="submitForm" novalidate class="space-y-6">
        <!-- DATA SISWA -->
        <div class="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100">
          <div class="flex items-center mb-6 pb-3 border-b-2 border-blue-100">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <i class="fas fa-user-graduate text-white"></i>
            </div>
            <h2 class="text-xl font-bold text-gray-800">
              DATA SISWA
            </h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">NAMA LENGKAP <span class="text-red-600">*</span></label>
              <input v-model="form.nama_lengkap" type="text" required class="form-input-custom" placeholder="Contoh: AHMAD FAUZI RAHMATULLAH" />
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">NAMA PANGGILAN <span class="text-red-600">*</span></label>
              <input v-model="form.nama_panggilan" type="text" required class="form-input-custom" placeholder="Contoh: FAUZI" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">NISN <span class="text-red-600">*</span></label>
              <input v-model="form.nisn" type="text" required class="form-input-custom" placeholder="Contoh: 0123456789" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">TEMPAT LAHIR <span class="text-red-600">*</span></label>
              <input v-model="form.tempat_lahir" type="text" required class="form-input-custom" placeholder="Contoh: JAKARTA" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">TANGGAL LAHIR <span class="text-red-600">*</span></label>
              <input v-model="form.tanggal_lahir" type="date" required class="form-input-custom" placeholder="Contoh: 15-05-2015" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">JENIS KELAMIN <span class="text-red-600">*</span></label>
              <select v-model="form.jenis_kelamin" required class="form-input-custom">
                <option value="">PILIH JENIS KELAMIN</option>
                <option value="LAKI-LAKI">LAKI-LAKI</option>
                <option value="PEREMPUAN">PEREMPUAN</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">AGAMA <span class="text-red-600">*</span></label>
              <select v-model="form.agama" required class="form-input-custom">
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
              <label class="block text-sm font-semibold text-gray-700 mb-2">GOLONGAN DARAH <span class="text-red-600">*</span></label>
              <select v-model="form.golongan_darah" required class="form-input-custom">
                <option value="">PILIH GOLONGAN DARAH</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">ANAK KE <span class="text-red-600">*</span></label>
              <input v-model.number="form.anak_ke" type="number" required class="form-input-custom" placeholder="Contoh: 2" min="1" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">JUMLAH SAUDARA <span class="text-red-600">*</span></label>
              <input v-model.number="form.jumlah_saudara" type="number" required class="form-input-custom" placeholder="Contoh: 3" min="0" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">STATUS ANAK DALAM KELUARGA <span class="text-red-600">*</span></label>
              <select v-model="form.status_anak" required class="form-input-custom" @change="handleStatusAnakChange">
                <option value="">PILIH STATUS ANAK</option>
                <option value="ANAK KANDUNG">ANAK KANDUNG</option>
                <option value="ANAK ANGKAT">ANAK ANGKAT</option>
                <option value="LAINNYA">LAINNYA</option>
              </select>
            </div>

            <div v-if="form.status_anak === 'LAINNYA'">
              <label class="block text-sm font-semibold text-gray-700 mb-2">SEBUTKAN STATUS <span class="text-red-600">*</span></label>
              <input v-model="form.status_anak_custom" type="text" required class="form-input-custom" placeholder="Contoh: ANAK ASUH" />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">ALAMAT SISWA <span class="text-red-600">*</span></label>
              <textarea v-model="form.alamat" required class="form-input-custom" rows="3" placeholder="Contoh: JL. MAWAR NO. 123, KOMPLEK TAMAN SARI"></textarea>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">RT <span class="text-red-600">*</span></label>
              <input v-model="form.rt" type="text" required class="form-input-custom" placeholder="Contoh: 001" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">RW <span class="text-red-600">*</span></label>
              <input v-model="form.rw" type="text" required class="form-input-custom" placeholder="Contoh: 002" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">KELURAHAN <span class="text-red-600">*</span></label>
              <input v-model="form.kelurahan" type="text" required class="form-input-custom" placeholder="Contoh: TUGU UTARA" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">KECAMATAN <span class="text-red-600">*</span></label>
              <input v-model="form.kecamatan" type="text" required class="form-input-custom" placeholder="Contoh: KOJA" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">KOTA <span class="text-red-600">*</span></label>
              <input v-model="form.kota" type="text" required class="form-input-custom" placeholder="Contoh: JAKARTA UTARA" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">PROVINSI <span class="text-red-600">*</span></label>
              <input v-model="form.provinsi" type="text" required class="form-input-custom" placeholder="Contoh: DKI JAKARTA" />
            </div>
          </div>
        </div>

        <!-- DATA ORANG TUA -->
        <div class="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100">
          <div class="flex items-center mb-6 pb-3 border-b-2 border-blue-100">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <i class="fas fa-users text-white"></i>
            </div>
            <h2 class="text-xl font-bold text-gray-800">
              DATA ORANG TUA
            </h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">NAMA AYAH <span class="text-red-600">*</span></label>
              <input v-model="form.nama_ayah" type="text" required class="form-input-custom" placeholder="Contoh: BUDI SANTOSO" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">NAMA IBU KANDUNG <span class="text-red-600">*</span></label>
              <input v-model="form.nama_ibu" type="text" required class="form-input-custom" placeholder="Contoh: SITI AMINAH" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">PENDIDIKAN TERTINGGI AYAH <span class="text-red-600">*</span></label>
              <select v-model="form.pendidikan_ayah" required class="form-input-custom">
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
              <label class="block text-sm font-semibold text-gray-700 mb-2">PENDIDIKAN TERTINGGI IBU <span class="text-red-600">*</span></label>
              <select v-model="form.pendidikan_ibu" required class="form-input-custom">
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
              <label class="block text-sm font-semibold text-gray-700 mb-2">PEKERJAAN AYAH <span class="text-red-600">*</span></label>
              <input v-model="form.pekerjaan_ayah" type="text" required class="form-input-custom" placeholder="Contoh: WIRASWASTA" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">PEKERJAAN IBU <span class="text-red-600">*</span></label>
              <input v-model="form.pekerjaan_ibu" type="text" required class="form-input-custom" placeholder="Contoh: IBU RUMAH TANGGA" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">PENGHASILAN PER BULAN AYAH <span class="text-red-600">*</span></label>
              <input v-model.number="form.penghasilan_ayah" type="number" required class="form-input-custom" placeholder="Contoh: 5000000" min="0" step="1000" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">PENGHASILAN PER BULAN IBU <span class="text-red-600">*</span></label>
              <input v-model.number="form.penghasilan_ibu" type="number" required class="form-input-custom" placeholder="Contoh: 3000000" min="0" step="1000" />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">NOMOR HP/WHATSAPP ORANG TUA <span class="text-red-600">*</span></label>
              <input v-model="form.nomor_hp_ortu" type="text" required class="form-input-custom" placeholder="Contoh: 081234567890" />
            </div>
          </div>
        </div>

        <!-- DATA WALI -->
        <div id="data-wali-section" class="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100">
          <div class="flex items-center mb-6 pb-3 border-b-2 border-blue-100">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <i class="fas fa-user-shield text-white"></i>
            </div>
            <h2 class="text-xl font-bold text-gray-800">
              DATA WALI <span class="text-sm font-normal text-gray-500">(Opsional)</span>
            </h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">NAMA WALI</label>
              <input v-model="form.nama_wali" type="text" class="form-input-custom" placeholder="Contoh: AHMAD BUDIMAN" @input="handleNamaWaliChange" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">PENDIDIKAN TERTINGGI WALI <span v-if="isWaliRequired" class="text-red-600">*</span></label>
              <select v-model="form.pendidikan_wali" :required="isWaliRequired" class="form-input-custom">
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
              <label class="block text-sm font-semibold text-gray-700 mb-2">HUBUNGAN WALI DENGAN ANAK <span v-if="isWaliRequired" class="text-red-600">*</span></label>
              <input v-model="form.hubungan_wali" type="text" :required="isWaliRequired" class="form-input-custom" placeholder="Contoh: PAMAN" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">PEKERJAAN WALI <span v-if="isWaliRequired" class="text-red-600">*</span></label>
              <input v-model="form.pekerjaan_wali" type="text" :required="isWaliRequired" class="form-input-custom" placeholder="Contoh: PEGAWAI SWASTA" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">NOMOR HP/WHATSAPP WALI <span v-if="isWaliRequired" class="text-red-600">*</span></label>
              <input v-model="form.nomor_hp_wali" type="text" :required="isWaliRequired" class="form-input-custom" placeholder="Contoh: 081234567899" />
            </div>
          </div>
        </div>

        <!-- ASAL MULA ANAK -->
        <div class="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100">
          <div class="flex items-center mb-6 pb-3 border-b-2 border-blue-100">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <i class="fas fa-school text-white"></i>
            </div>
            <h2 class="text-xl font-bold text-gray-800">
              ASAL MULA ANAK
            </h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">MASUK SEKOLAH SAAT INI SEBAGAI PINDAHAN KELAS <span class="text-red-600">*</span></label>
              <input v-model.number="form.pindahan_kelas" type="number" required class="form-input-custom" placeholder="Contoh: 3" min="1" max="6" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">ASAL ANAK <span class="text-red-600">*</span></label>
              <select v-model="form.asal_sekolah" required class="form-input-custom">
                <option value="">PILIH ASAL SEKOLAH</option>
                <option value="SD">SD (SEKOLAH DASAR)</option>
                <option value="SDI">SDI (SEKOLAH DASAR ISLAM)</option>
                <option value="SDIT">SDIT (SEKOLAH DASAR ISLAM TERPADU)</option>
                <option value="SDK">SDK (SEKOLAH DASAR KRISTEN)</option>
                <option value="SDKA">SDKA (SEKOLAH DASAR KATOLIK)</option>
                <option value="MI">MI (MADRASAH IBTIDAIYAH)</option>
                <option value="MIN">MIN (MADRASAH IBTIDAIYAH NEGERI)</option>
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">NAMA ASAL SEKOLAH <span class="text-red-600">*</span></label>
              <input v-model="form.nama_asal_sekolah" type="text" required class="form-input-custom" placeholder="Contoh: SDN SUKAPURA 02" />
            </div>
          </div>
        </div>

        <!-- UPLOAD PERSYARATAN -->
        <div id="upload-persyaratan-section" class="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100">
          <div class="flex items-center mb-6 pb-3 border-b-2 border-blue-100">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <i class="fas fa-file-upload text-white"></i>
            </div>
            <h2 class="text-xl font-bold text-gray-800">
              UPLOAD PERSYARATAN
            </h2>
          </div>
          <div class="space-y-6">
            <!-- Rapor -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                SCAN FOTOKOPI RAPOR SEMESTER TERAKHIR (Telah Dilegalisir) <span class="text-red-600">*</span>
              </label>
              <div class="file-upload-area" @click="triggerFileInput('rapor')" @dragover.prevent @drop.prevent="handleFileDrop($event, 'rapor')">
                <input ref="raporInput" type="file" accept="image/*,.pdf" class="hidden" @change="handleFileChange($event, 'rapor')" />
                <div v-if="!form.rapor" class="text-center py-6">
                  <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                  <p class="text-sm text-gray-600">Klik atau drag file ke sini</p>
                  <p class="text-xs text-gray-500 mt-1">Maks. 5 MB</p>
                </div>
                <div v-else class="flex items-center justify-between py-4">
                  <div class="flex items-center">
                    <i class="fas fa-file-pdf text-red-600 text-2xl mr-3"></i>
                    <span class="text-sm text-gray-700">{{ fileNames.rapor }}</span>
                  </div>
                  <button type="button" @click.stop="removeFile('rapor')" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Akte Kelahiran -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                SCAN FOTOKOPI AKTE KELAHIRAN ANAK <span class="text-red-600">*</span>
              </label>
              <div class="file-upload-area" @click="triggerFileInput('akte')" @dragover.prevent @drop.prevent="handleFileDrop($event, 'akte')">
                <input ref="akteInput" type="file" accept="image/*,.pdf" class="hidden" @change="handleFileChange($event, 'akte')" />
                <div v-if="!form.akte_kelahiran" class="text-center py-6">
                  <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                  <p class="text-sm text-gray-600">Klik atau drag file ke sini</p>
                  <p class="text-xs text-gray-500 mt-1">Maks. 5 MB</p>
                </div>
                <div v-else class="flex items-center justify-between py-4">
                  <div class="flex items-center">
                    <i class="fas fa-file-pdf text-red-600 text-2xl mr-3"></i>
                    <span class="text-sm text-gray-700">{{ fileNames.akte }}</span>
                  </div>
                  <button type="button" @click.stop="removeFile('akte')" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Kartu Keluarga -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                SCAN FOTOKOPI KARTU KELUARGA <span class="text-red-600">*</span>
              </label>
              <div class="file-upload-area" @click="triggerFileInput('kk')" @dragover.prevent @drop.prevent="handleFileDrop($event, 'kk')">
                <input ref="kkInput" type="file" accept="image/*,.pdf" class="hidden" @change="handleFileChange($event, 'kk')" />
                <div v-if="!form.kartu_keluarga" class="text-center py-6">
                  <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                  <p class="text-sm text-gray-600">Klik atau drag file ke sini</p>
                  <p class="text-xs text-gray-500 mt-1">Maks. 5 MB</p>
                </div>
                <div v-else class="flex items-center justify-between py-4">
                  <div class="flex items-center">
                    <i class="fas fa-file-pdf text-red-600 text-2xl mr-3"></i>
                    <span class="text-sm text-gray-700">{{ fileNames.kk }}</span>
                  </div>
                  <button type="button" @click.stop="removeFile('kk')" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- SPTJM -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="block text-sm font-semibold text-gray-700">
                  SCAN SPTJM SUDAH TTD MATERAI <span class="text-red-600">*</span>
                </label>
                <button type="button" @click="downloadTemplateSPTJM" class="download-template-btn">
                  <i class="fas fa-download mr-1"></i>Download Template SPTJM
                </button>
              </div>
              <div class="file-upload-area" @click="triggerFileInput('sptjm')" @dragover.prevent @drop.prevent="handleFileDrop($event, 'sptjm')">
                <input ref="sptjmInput" type="file" accept="image/*,.pdf" class="hidden" @change="handleFileChange($event, 'sptjm')" />
                <div v-if="!form.sptjm" class="text-center py-6">
                  <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                  <p class="text-sm text-gray-600">Klik atau drag file ke sini</p>
                  <p class="text-xs text-gray-500 mt-1">Maks. 5 MB</p>
                </div>
                <div v-else class="flex items-center justify-between py-4">
                  <div class="flex items-center">
                    <i class="fas fa-file-pdf text-red-600 text-2xl mr-3"></i>
                    <span class="text-sm text-gray-700">{{ fileNames.sptjm }}</span>
                  </div>
                  <button type="button" @click.stop="removeFile('sptjm')" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-center">
          <button type="submit" :disabled="isSubmitting" class="submit-button">
            <span v-if="!isSubmitting">
              <i class="fas fa-paper-plane mr-2"></i>KIRIM PENDAFTARAN
            </span>
            <span v-else>
              <i class="fas fa-spinner fa-spin mr-2"></i>MENGIRIM...
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

definePageMeta({
  layout: false
})

useHead({
  title: 'Pendaftaran Mutasi Siswa - SDN Sukapura 01',
  link: [
    {
      rel: 'icon',
      type: 'image/jpeg',
      href: '/logo-sekolah.jpg'
    }
  ]
})

// State
const tahunPelajaranId = ref<number | null>(null)
const tahunPelajaran = ref('')
const currentSemester = ref(1)
const currentYear = ref(new Date().getFullYear())
const templateSPTJMUrl = ref('')
const whatsappGroupLink = ref('')
const tanggalBukaPendaftaran = ref('')
const tanggalTutupPendaftaran = ref('')
const isPendaftaranOpen = ref(true)
const pendaftaranStatus = ref<'belum_buka' | 'sudah_tutup' | 'buka'>('buka')
const showSuccessModal = ref(false)
const showErrorNotification = ref(false)
const errorMessage = ref('')
const registrationNumber = ref('')
const isSubmitting = ref(false)
const registrationId = ref<number | null>(null)

// Form data
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
  nama_asal_sekolah: '',
  rapor: null as File | null,
  akte_kelahiran: null as File | null,
  kartu_keluarga: null as File | null,
  sptjm: null as File | null
})

const fileNames = ref({
  rapor: '',
  akte: '',
  kk: '',
  sptjm: ''
})

// Refs
const raporInput = ref<HTMLInputElement | null>(null)
const akteInput = ref<HTMLInputElement | null>(null)
const kkInput = ref<HTMLInputElement | null>(null)
const sptjmInput = ref<HTMLInputElement | null>(null)

// Computed
const isWaliRequired = computed(() => {
  return form.value.nama_wali && form.value.nama_wali.trim() !== ''
})

// Helper untuk capitalize input
const capitalizeInput = (key: keyof typeof form.value) => {
  watch(() => form.value[key], (newValue) => {
    if (typeof newValue === 'string') {
      form.value[key] = newValue.toUpperCase() as any
    }
  })
}

// Methods
const getCurrentSemester = () => {
  const now = new Date()
  const month = now.getMonth() + 1 // 1-12
  // Juli (7) - Desember (12) = Semester 1
  // Januari (1) - Juni (6) = Semester 2
  return month >= 7 && month <= 12 ? 1 : 2
}

const showError = (message: string, scrollToId?: string) => {
  errorMessage.value = message
  showErrorNotification.value = true
  
  // Auto hide after 5 seconds
  setTimeout(() => {
    showErrorNotification.value = false
  }, 5000)
  
  // Scroll to section if provided
  if (scrollToId) {
    const section = document.getElementById(scrollToId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}

const fetchTahunPelajaran = async () => {
  const config = useRuntimeConfig()
  try {
    const response = await $fetch(`${config.public.apiBase}/api/v1/public/get-tahun-pelajaran-aktif`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (response && response.data) {
      tahunPelajaranId.value = response.data.id
      tahunPelajaran.value = response.data.tahun_pelajaran
    }
  } catch (error) {
    console.error('Error fetching tahun pelajaran:', error)
    showError('Gagal memuat data tahun pelajaran')
  }
}

const fetchKonfigurasiMutasi = async () => {
  const config = useRuntimeConfig()
  try {
    const response = await $fetch(`${config.public.apiBase}/api/v1/public/get-konfigurasi-mutasi-siswa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (response && response.data) {
      templateSPTJMUrl.value = response.data.template_sptjm
      whatsappGroupLink.value = response.data.grup_wa
      tanggalBukaPendaftaran.value = response.data.tanggal_buka_pendaftaran
      tanggalTutupPendaftaran.value = response.data.tanggal_tutup_pendaftaran
      
      // Check if registration is open
      checkPendaftaranStatus()
    }
  } catch (error) {
    console.error('Error fetching konfigurasi:', error)
  }
}

const checkPendaftaranStatus = () => {
  const now = new Date()
  const bukaTanggal = new Date(tanggalBukaPendaftaran.value)
  const tutupTanggal = new Date(tanggalTutupPendaftaran.value)
  
  // Set time to start of day for bukaTanggal and end of day for tutupTanggal
  bukaTanggal.setHours(0, 0, 0, 0)
  tutupTanggal.setHours(23, 59, 59, 999)
  
  // Check if current date is within registration period
  if (now < bukaTanggal) {
    // Belum dibuka
    isPendaftaranOpen.value = false
    pendaftaranStatus.value = 'belum_buka'
  } else if (now > tutupTanggal) {
    // Sudah ditutup
    isPendaftaranOpen.value = false
    pendaftaranStatus.value = 'sudah_tutup'
  } else {
    // Masih buka
    isPendaftaranOpen.value = true
    pendaftaranStatus.value = 'buka'
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }
  
  return date.toLocaleDateString('id-ID', options)
}

const downloadTemplateSPTJM = () => {
  if (templateSPTJMUrl.value) {
    window.open(templateSPTJMUrl.value, '_blank')
  } else {
    showError('Template SPTJM tidak tersedia')
  }
}

const handleStatusAnakChange = () => {
  if (form.value.status_anak !== 'LAINNYA') {
    form.value.status_anak_custom = ''
  }
}

const handleNamaWaliChange = () => {
  if (!form.value.nama_wali || form.value.nama_wali.trim() === '') {
    form.value.pendidikan_wali = ''
    form.value.hubungan_wali = ''
    form.value.pekerjaan_wali = ''
    form.value.nomor_hp_wali = ''
  }
}

const triggerFileInput = (type: string) => {
  if (type === 'rapor') raporInput.value?.click()
  else if (type === 'akte') akteInput.value?.click()
  else if (type === 'kk') kkInput.value?.click()
  else if (type === 'sptjm') sptjmInput.value?.click()
}

const handleFileChange = (event: Event, type: string) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      showError('Ukuran file maksimal 5 MB')
      target.value = ''
      return
    }
    
    if (type === 'rapor') {
      form.value.rapor = file
      fileNames.value.rapor = file.name
    } else if (type === 'akte') {
      form.value.akte_kelahiran = file
      fileNames.value.akte = file.name
    } else if (type === 'kk') {
      form.value.kartu_keluarga = file
      fileNames.value.kk = file.name
    } else if (type === 'sptjm') {
      form.value.sptjm = file
      fileNames.value.sptjm = file.name
    }
  }
}

const handleFileDrop = (event: DragEvent, type: string) => {
  const file = event.dataTransfer?.files?.[0]
  
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      showError('Ukuran file maksimal 5 MB')
      return
    }
    
    if (type === 'rapor') {
      form.value.rapor = file
      fileNames.value.rapor = file.name
    } else if (type === 'akte') {
      form.value.akte_kelahiran = file
      fileNames.value.akte = file.name
    } else if (type === 'kk') {
      form.value.kartu_keluarga = file
      fileNames.value.kk = file.name
    } else if (type === 'sptjm') {
      form.value.sptjm = file
      fileNames.value.sptjm = file.name
    }
  }
}

const removeFile = (type: string) => {
  if (type === 'rapor') {
    form.value.rapor = null
    fileNames.value.rapor = ''
    if (raporInput.value) raporInput.value.value = ''
  } else if (type === 'akte') {
    form.value.akte_kelahiran = null
    fileNames.value.akte = ''
    if (akteInput.value) akteInput.value.value = ''
  } else if (type === 'kk') {
    form.value.kartu_keluarga = null
    fileNames.value.kk = ''
    if (kkInput.value) kkInput.value.value = ''
  } else if (type === 'sptjm') {
    form.value.sptjm = null
    fileNames.value.sptjm = ''
    if (sptjmInput.value) sptjmInput.value.value = ''
  }
}

const submitForm = async () => {
  // Validasi
  if (!form.value.rapor || !form.value.akte_kelahiran || !form.value.kartu_keluarga || !form.value.sptjm) {
    showError('Semua file persyaratan wajib diupload!', 'upload-persyaratan-section')
    return
  }

  if (!tahunPelajaranId.value) {
    showError('Tahun pelajaran belum tersedia')
    return
  }

  // Validasi data wali jika nama wali diisi
  if (form.value.nama_wali && form.value.nama_wali.trim() !== '') {
    if (!form.value.pendidikan_wali || !form.value.hubungan_wali || !form.value.pekerjaan_wali || !form.value.nomor_hp_wali) {
      showError('Jika nama wali diisi, semua data wali lainnya wajib diisi!', 'data-wali-section')
      return
    }
  }

  isSubmitting.value = true
  const config = useRuntimeConfig()

  try {
    const formData = new FormData()
    
    // Tambahkan data ke FormData
    formData.append('tahun_pelajaran_id', tahunPelajaranId.value.toString())
    formData.append('semester', currentSemester.value.toString())
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
    
    // Files
    formData.append('rapor', form.value.rapor)
    formData.append('akte_kelahiran', form.value.akte_kelahiran)
    formData.append('kartu_keluarga', form.value.kartu_keluarga)
    formData.append('sptjm', form.value.sptjm)

    const response = await $fetch(`${config.public.apiBase}/api/v1/public/create-mutasi-siswa`, {
      method: 'POST',
      body: formData
    })

    if (response && response.data) {
      registrationNumber.value = response.data.nomor_pendaftaran
      registrationId.value = response.data.id
      showSuccessModal.value = true
    }
  } catch (error: any) {
    console.error('Error submitting form:', error)
    showError(error?.data?.message || 'Gagal mengirim pendaftaran. Silakan coba lagi.')
  } finally {
    isSubmitting.value = false
  }
}

const downloadFormulir = async () => {
  if (!registrationId.value) {
    showError('ID pendaftaran tidak ditemukan')
    return
  }

  const config = useRuntimeConfig()
  try {
    const response = await $fetch(`${config.public.apiBase}/api/v1/public/export-pdf-formulir-mutasi-siswa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        id: registrationId.value
      },
      responseType: 'blob'
    })

    // Create download link
    const url = window.URL.createObjectURL(response as Blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Formulir-Pendaftaran-${registrationNumber.value}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading formulir:', error)
    showError('Gagal mendownload formulir')
  }
}

// Lifecycle
onMounted(() => {
  currentSemester.value = getCurrentSemester()
  fetchTahunPelajaran()
  fetchKonfigurasiMutasi()
  
  // Setup capitalize untuk semua field text
  const textFields: (keyof typeof form.value)[] = [
    'nama_lengkap', 'nama_panggilan', 'nisn', 'tempat_lahir', 'alamat', 
    'rt', 'rw', 'kelurahan', 'kecamatan', 'kota', 'provinsi',
    'nama_ayah', 'nama_ibu', 'pekerjaan_ayah', 'pekerjaan_ibu', 'nomor_hp_ortu',
    'nama_wali', 'hubungan_wali', 'pekerjaan_wali', 'nomor_hp_wali',
    'nama_asal_sekolah', 'status_anak_custom'
  ]
  
  textFields.forEach(field => capitalizeInput(field))
})
</script>

<style scoped>
.form-input-custom {
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(to bottom, #ffffff, #fafafa);
  text-transform: uppercase;
  font-weight: 500;
}

.form-input-custom:hover {
  border-color: #d1d5db;
  background: #ffffff;
}

.form-input-custom:focus {
  outline: none;
  border-color: #ef4444;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.form-input-custom::placeholder {
  text-transform: none;
  color: #9ca3af;
  font-weight: 400;
}

.file-upload-area {
  border: 3px dashed #d1d5db;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  position: relative;
  overflow: hidden;
}

.file-upload-area::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(249, 115, 22, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.file-upload-area:hover {
  border-color: #ef4444;
  background: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.15);
}

.file-upload-area:hover::before {
  opacity: 1;
}

.submit-button {
  background: linear-gradient(135deg, #dc2626 0%, #ea580c 50%, #f59e0b 100%);
  background-size: 200% 200%;
  color: white;
  font-weight: 800;
  padding: 18px 56px;
  border-radius: 16px;
  font-size: 17px;
  letter-spacing: 0.5px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(220, 38, 38, 0.35), 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: gradient-shift 3s ease infinite;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 32px rgba(220, 38, 38, 0.5), 0 8px 16px rgba(0, 0, 0, 0.15);
}

.submit-button:active:not(:disabled) {
  transform: translateY(-1px) scale(0.98);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  animation: none;
}

.border-gradient {
  background: linear-gradient(to right, #ef4444, #f97316, #fbbf24);
  height: 3px;
  border: none;
}

/* Animations */
@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.7) translateY(20px);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes scale-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(20px, -50px) scale(1.1);
  }
  50% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  75% {
    transform: translate(50px, 50px) scale(1.05);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-in {
  animation: bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.animate-scale-in {
  animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.animate-blob {
  animation: blob 7s infinite;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animation-delay-300 {
  animation-delay: 300ms;
}

.animation-delay-600 {
  animation-delay: 600ms;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 16px;
  }
  
  h1 {
    font-size: 24px;
  }
  
  h2 {
    font-size: 20px;
  }
  
  .submit-button {
    padding: 16px 40px;
    font-size: 15px;
  }
  
  .file-upload-area {
    padding: 16px;
  }
}

/* Smooth scroll */
html {
  scroll-behavior: smooth;
}
</style>

<style scoped>
.form-input-custom {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  transition: all 0.2s ease;
  background: #ffffff;
  text-transform: uppercase;
  font-weight: 500;
}

.form-input-custom:hover {
  border-color: #cbd5e1;
}

.form-input-custom:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-input-custom::placeholder {
  text-transform: none;
  color: #9ca3af;
  font-weight: 400;
}

.file-upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f9fafb;
}

.file-upload-area:hover {
  border-color: #2563eb;
  background: #eff6ff;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
}

.submit-button {
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  color: white;
  font-weight: 700;
  padding: 16px 48px;
  border-radius: 10px;
  font-size: 16px;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(37, 99, 235, 0.4);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.download-template-btn {
  text-sm: true;
  color: #2563eb;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px 16px;
  border-radius: 8px;
  background: #eff6ff;
  border: 2px solid #bfdbfe;
  position: relative;
  overflow: hidden;
}

.download-template-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(37, 99, 235, 0.1);
  transform: translate(-50%, -50%);
  transition: width 0.4s ease, height 0.4s ease;
}

.download-template-btn:hover::before {
  width: 300px;
  height: 300px;
}

.download-template-btn:hover {
  color: #1e40af;
  background: #dbeafe;
  border-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.download-template-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.2);
}

.download-template-btn i {
  display: inline-block;
  transition: transform 0.3s ease;
}

.download-template-btn:hover i {
  animation: bounce-down 0.6s ease infinite;
}

@keyframes bounce-down {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(3px);
  }
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes slide-in {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-bounce-in {
  animation: bounce-in 0.4s ease-out;
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 16px;
  }
  
  h1 {
    font-size: 22px;
  }
  
  h2 {
    font-size: 18px;
  }
  
  .submit-button {
    padding: 14px 36px;
    font-size: 15px;
  }
  
  .download-template-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>
