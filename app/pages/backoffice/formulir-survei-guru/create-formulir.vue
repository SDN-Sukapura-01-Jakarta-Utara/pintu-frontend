<template>
  <DashboardLayout>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-3 mb-2">
        <button
          @click="$router.push('/backoffice/formulir-survei-guru/form-saya')"
          class="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <i class="fa-solid fa-arrow-left text-gray-600"></i>
        </button>
        <h1 class="text-2xl font-bold text-gray-900">Buat Formulir/Survei Baru</h1>
      </div>
      <p class="text-sm text-gray-600 ml-11">Buat formulir atau survei untuk mengumpulkan data dari responder</p>
    </div>

    <!-- Form Container -->
    <div>
      <!-- Basic Info Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Informasi Dasar</h2>
        
        <!-- Judul -->
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-900 mb-2">
            Judul Formulir/Survei <span class="text-red-600">*</span>
          </label>
          <input
            v-model="formData.judul"
            type="text"
            placeholder="Contoh: Formulir Pendaftaran Siswa Baru 2026/2027"
            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
          />
        </div>

        <!-- Deskripsi -->
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-900 mb-2">
            Deskripsi
          </label>
          <textarea
            v-model="formData.deskripsi"
            rows="3"
            placeholder="Jelaskan tujuan dan instruksi pengisian formulir ini..."
            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
          ></textarea>
        </div>

        <!-- Max Response -->
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-900 mb-2">
            Maksimal Respons (Opsional)
          </label>
          <input
            v-model.number="formData.max_responses"
            type="number"
            placeholder="Contoh: 100"
            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
          />
        </div>

        <!-- Tanggal Pengisian -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">
              Tanggal Mulai <span class="text-red-600">*</span>
            </label>
            <input
              v-model="formData.start_date"
              type="datetime-local"
              class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">
              Tanggal Berakhir <span class="text-red-600">*</span>
            </label>
            <input
              v-model="formData.end_date"
              type="datetime-local"
              class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          </div>
        </div>

        <!-- Tipe Akses -->
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-900 mb-2">
            Tipe Akses <span class="text-red-600">*</span>
          </label>
          <select
            v-model="formData.access_type"
            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer"
          >
            <option value="">Pilih Tipe Akses</option>
            <option value="public">Publik</option>
            <option value="authenticated">Autentikasi</option>
          </select>
          <p class="text-xs text-gray-500 mt-2">
            <span class="font-semibold">Publik:</span> Responder bisa dari dalam atau luar sekolah tanpa login.<br>
            <span class="font-semibold">Autentikasi:</span> Membutuhkan login terlebih dahulu sebagai guru, tendik, atau murid.
          </p>
        </div>

        <!-- Allow Multiple Responses (Public only) -->
        <div v-if="formData.access_type === 'public'" class="mb-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="formData.allow_multiple_responses"
              type="checkbox"
              class="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span class="text-sm font-semibold text-gray-900">Izinkan Multiple Respons</span>
          </label>
        </div>

        <!-- Target Responder (Authenticated only) -->
        <div v-if="formData.access_type === 'authenticated'" class="mb-4">
          <label class="block text-sm font-semibold text-gray-900 mb-2">
            Target Responder <span class="text-red-600">*</span>
          </label>
          <div class="space-y-2">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="formData.target_user_types"
                type="checkbox"
                value="pendidik"
                class="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span class="text-sm font-medium text-gray-900">Pendidik</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="formData.target_user_types"
                type="checkbox"
                value="tendik"
                class="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span class="text-sm font-medium text-gray-900">Tendik</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="formData.target_user_types"
                type="checkbox"
                value="murid"
                class="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span class="text-sm font-medium text-gray-900">Murid</span>
            </label>
          </div>
        </div>

        <!-- Rombel Selection (if murid selected) -->
        <div v-if="formData.target_user_types.includes('murid')" class="mb-4">
          <label class="block text-sm font-semibold text-gray-900 mb-2">
            Pilih Rombel
          </label>
          <div v-if="isLoadingRombel" class="text-sm text-gray-500">Memuat data rombel...</div>
          <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg">
            <label
              v-for="rombel in rombelList"
              :key="rombel.id"
              class="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded"
            >
              <input
                v-model="formData.rombel_ids"
                type="checkbox"
                :value="rombel.id"
                class="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span class="text-sm font-medium text-gray-900">{{ rombel.name }}</span>
            </label>
          </div>
        </div>

        <!-- Status -->
        <div class="pt-3 sm:pt-4 border-t border-gray-200">
          <div class="flex items-center gap-4">
            <label class="text-sm font-semibold text-gray-900">Status</label>
            <button
              type="button"
              @click="formData.is_active = !formData.is_active"
              :class="[
                'relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 cursor-pointer',
                formData.is_active ? 'bg-green-600' : 'bg-gray-300'
              ]"
            >
              <span :class="[
                'inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-md',
                formData.is_active ? 'translate-x-7' : 'translate-x-1'
              ]"></span>
            </button>
            <span :class="[
              'px-3 py-1 rounded-full text-sm font-semibold',
              formData.is_active
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            ]">
              {{ formData.is_active ? 'Aktif' : 'Nonaktif' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Questions Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div class="mb-4">
          <h2 class="text-lg font-bold text-gray-900">Pertanyaan</h2>
        </div>

        <!-- Questions List -->
        <div class="space-y-4">
          <div
            v-for="(question, index) in formData.pertanyaan"
            :key="question.tempId"
            class="border-2 border-gray-200 rounded-lg p-4 bg-gray-50"
          >
            <!-- Question Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-white font-bold text-sm">
                  {{ index + 1 }}
                </span>
                <span class="text-sm font-semibold text-gray-700">Pertanyaan {{ index + 1 }}</span>
              </div>
              <div class="flex items-center gap-2">
                <button
                  v-if="index > 0"
                  @click="moveQuestionUp(index)"
                  class="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"
                  title="Pindah ke atas"
                >
                  <i class="fa-solid fa-arrow-up text-gray-700 text-sm"></i>
                </button>
                <button
                  v-if="index < formData.pertanyaan.length - 1"
                  @click="moveQuestionDown(index)"
                  class="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"
                  title="Pindah ke bawah"
                >
                  <i class="fa-solid fa-arrow-down text-gray-700 text-sm"></i>
                </button>
                <button
                  @click="removeQuestion(index)"
                  class="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors cursor-pointer"
                  title="Hapus pertanyaan"
                >
                  <i class="fa-solid fa-trash text-red-600 text-sm"></i>
                </button>
              </div>
            </div>

            <!-- Question Label -->
            <div class="mb-3">
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Label Pertanyaan <span class="text-red-600">*</span>
              </label>
              <input
                v-model="question.label"
                type="text"
                placeholder="Contoh: Nama Lengkap"
                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>

            <!-- Question Placeholder -->
            <div class="mb-3">
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Placeholder
              </label>
              <input
                v-model="question.placeholder"
                type="text"
                placeholder="Contoh: Masukkan nama lengkap sesuai KTP"
                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>

            <!-- Link Input -->
            <div class="mb-3">
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Link (Opsional)
              </label>
              <input
                v-model="question.link"
                type="url"
                placeholder="https://example.com/video-tutorial"
                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
              <p class="text-xs text-gray-500 mt-1">Link eksternal seperti video tutorial atau panduan</p>
            </div>

            <!-- Upload Dokumen -->
            <div class="mb-3">
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Upload Dokumen (Opsional)
              </label>
              <div class="relative">
                <input
                  type="file"
                  :id="`doc-upload-${index}`"
                  @change="handleDocumentUpload(index, $event)"
                  accept=".pdf,.doc,.docx"
                  class="hidden"
                />
                <label
                  :for="`doc-upload-${index}`"
                  class="flex items-center justify-center gap-3 w-full rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-sm font-medium transition-all duration-200 hover:border-red-400 hover:bg-red-50 cursor-pointer"
                >
                  <i class="fa-solid fa-cloud-arrow-up text-2xl text-gray-400"></i>
                  <div class="text-center">
                    <p class="text-gray-700 font-semibold">Klik untuk upload dokumen</p>
                    <p class="text-xs text-gray-500 mt-1">PDF, DOC, DOCX (Max 5MB)</p>
                  </div>
                </label>
              </div>
              <div v-if="question.dokumen" class="mt-2 flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                <i class="fa-solid fa-file-check text-green-600"></i>
                <span class="text-sm text-green-700 font-medium flex-1">{{ question.dokumen }}</span>
                <button
                  @click="question.dokumen = ''"
                  class="text-red-600 hover:text-red-700 cursor-pointer"
                >
                  <i class="fa-solid fa-times"></i>
                </button>
              </div>
            </div>

            <!-- Question Type -->
            <div class="mb-3">
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Tipe Jawaban <span class="text-red-600">*</span>
              </label>
              <select
                v-model="question.tipe"
                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer"
              >
                <option value="">Pilih Tipe</option>
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="number">Number</option>
                <option value="textarea">Textarea</option>
                <option value="select">Select (Dropdown)</option>
                <option value="radio">Radio Button</option>
                <option value="checkbox">Checkbox</option>
                <option value="date">Date</option>
                <option value="time">Time</option>
                <option value="datetime">Datetime</option>
                <option value="file">File Upload</option>
              </select>
            </div>

            <!-- Options (for select, radio, checkbox) -->
            <div v-if="['select', 'radio', 'checkbox'].includes(question.tipe)" class="mb-3">
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Pilihan <span class="text-red-600">*</span>
              </label>
              <div class="space-y-2">
                <div
                  v-for="(option, optIndex) in question.options"
                  :key="String(optIndex)"
                  class="flex gap-2"
                >
                  <input
                    v-model="question.options[Number(optIndex)]"
                    type="text"
                    :placeholder="`Pilihan ${Number(optIndex) + 1}`"
                    class="flex-1 rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                  />
                  <button
                    @click="removeOption(index, Number(optIndex))"
                    class="px-3 py-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors cursor-pointer"
                  >
                    <i class="fa-solid fa-times text-red-600"></i>
                  </button>
                </div>
                <button
                  @click="addOption(index)"
                  class="text-sm text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                >
                  + Tambah Pilihan
                </button>
              </div>
            </div>

            <!-- File Config (for file type) -->
            <div v-if="question.tipe === 'file'" class="mb-3">
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Konfigurasi File
              </label>
              <div class="space-y-3 p-3 bg-white rounded-lg border border-gray-200">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">
                    Maksimal Ukuran File
                  </label>
                  <select
                    v-model="question.file_config.max_size_mb"
                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer"
                  >
                    <option value="">Pilih Ukuran Maksimal</option>
                    <option :value="1">1 MB</option>
                    <option :value="2">2 MB</option>
                    <option :value="5">5 MB</option>
                    <option :value="10">10 MB</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">
                    Tipe File yang Diizinkan
                  </label>
                  <div class="grid grid-cols-2 gap-2">
                    <label class="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                      <input
                        v-model="question.file_config.allowed_types"
                        type="checkbox"
                        value="jpg"
                        class="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                      <span class="text-sm text-gray-700">JPG</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                      <input
                        v-model="question.file_config.allowed_types"
                        type="checkbox"
                        value="png"
                        class="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                      <span class="text-sm text-gray-700">PNG</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                      <input
                        v-model="question.file_config.allowed_types"
                        type="checkbox"
                        value="pdf"
                        class="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                      <span class="text-sm text-gray-700">PDF</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                      <input
                        v-model="question.file_config.allowed_types"
                        type="checkbox"
                        value="doc"
                        class="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                      <span class="text-sm text-gray-700">Word</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                      <input
                        v-model="question.file_config.allowed_types"
                        type="checkbox"
                        value="xls"
                        class="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                      <span class="text-sm text-gray-700">Excel</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                      <input
                        v-model="question.file_config.allowed_types"
                        type="checkbox"
                        value="gif"
                        class="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                      <span class="text-sm text-gray-700">GIF</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                      <input
                        v-model="question.file_config.allowed_types"
                        type="checkbox"
                        value="pptx"
                        class="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                      <span class="text-sm text-gray-700">PPTX</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">
                    Pesan Error
                  </label>
                  <input
                    v-model="question.file_config.error_message"
                    type="text"
                    placeholder="File harus berupa gambar dengan ukuran maksimal 2MB"
                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                  />
                </div>
              </div>
            </div>

            <!-- Required Toggle -->
            <div class="mb-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="question.is_required"
                  type="checkbox"
                  class="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span class="text-sm font-semibold text-gray-900">Wajib Diisi</span>
              </label>
            </div>

            <!-- Validation Rules (only show if type is selected and not file type) -->
            <div v-if="question.tipe && question.tipe !== 'file'" class="mb-3">
                <button
                  @click="toggleValidationRules(index)"
                  class="text-sm text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                >
                  {{ question.showValidation ? '- Sembunyikan Validasi' : '+ Tambah Validasi' }}
                </button>
              
              <div v-if="question.showValidation" class="mt-3 space-y-3 p-3 bg-white rounded-lg border border-gray-200">
                <!-- Validation for text/textarea -->
                <div v-if="['text', 'textarea', 'email', 'phone'].includes(question.tipe)">
                  <div class="grid grid-cols-2 gap-3 mb-2">
                    <div>
                      <label class="block text-xs font-semibold text-gray-700 mb-1">Min Length</label>
                      <input
                        v-model.number="question.validation_rules.min_length"
                        type="number"
                        placeholder="3"
                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-gray-700 mb-1">Max Length</label>
                      <input
                        v-model.number="question.validation_rules.max_length"
                        type="number"
                        placeholder="100"
                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                      />
                    </div>
                  </div>
                  <div class="mb-2">
                    <label class="block text-xs font-semibold text-gray-700 mb-1">
                      Pattern Validasi
                      <span class="text-gray-500 font-normal">(Opsional)</span>
                    </label>
                    <select
                      v-model="question.validation_rules.pattern"
                      class="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer mb-2"
                    >
                      <option value="">Pilih Pattern (Opsional)</option>
                      <option value="^[a-zA-Z\s]+$">Hanya Huruf dan Spasi</option>
                      <option value="^[a-zA-Z0-9\s]+$">Huruf, Angka, dan Spasi</option>
                      <option value="^[0-9]+$">Hanya Angka</option>
                      <option value="^08[0-9]{8,13}$">Nomor HP Indonesia (08...)</option>
                      <option value="^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$">Format Email</option>
                      <option value="custom">Custom Pattern (Regex)</option>
                    </select>
                    <input
                      v-if="question.validation_rules.pattern === 'custom'"
                      v-model="question.validation_rules.custom_pattern"
                      type="text"
                      placeholder="Contoh: ^[a-zA-Z\s]+$"
                      class="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                    />
                    <p v-if="question.validation_rules.pattern && question.validation_rules.pattern !== 'custom'" class="text-xs text-gray-500 mt-1">
                      Pattern: {{ question.validation_rules.pattern }}
                    </p>
                  </div>
                </div>

                <!-- Validation for number -->
                <div v-if="question.tipe === 'number'" class="grid grid-cols-2 gap-3 mb-2">
                  <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-1">Min Value</label>
                    <input
                      v-model.number="question.validation_rules.min"
                      type="number"
                      placeholder="0"
                      class="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-1">Max Value</label>
                    <input
                      v-model.number="question.validation_rules.max"
                      type="number"
                      placeholder="100"
                      class="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                </div>

                <!-- Validation for checkbox -->
                <div v-if="question.tipe === 'checkbox'" class="grid grid-cols-2 gap-3 mb-2">
                  <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-1">Min Selected</label>
                    <input
                      v-model.number="question.validation_rules.min_selected"
                      type="number"
                      placeholder="1"
                      class="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-1">Max Selected</label>
                    <input
                      v-model.number="question.validation_rules.max_selected"
                      type="number"
                      placeholder="3"
                      class="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                </div>

                <!-- Validation for date -->
                <div v-if="question.tipe === 'date'" class="grid grid-cols-2 gap-3 mb-2">
                  <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-1">Min Date</label>
                    <input
                      v-model="question.validation_rules.min_date"
                      type="date"
                      class="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-1">Max Date</label>
                    <input
                      v-model="question.validation_rules.max_date"
                      type="date"
                      class="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                </div>

                <!-- Validation for time -->
                <div v-if="question.tipe === 'time'" class="grid grid-cols-2 gap-3 mb-2">
                  <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-1">Min Time</label>
                    <input
                      v-model="question.validation_rules.min_time"
                      type="time"
                      class="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-1">Max Time</label>
                    <input
                      v-model="question.validation_rules.max_time"
                      type="time"
                      class="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                </div>

                <!-- Validation for datetime -->
                <div v-if="question.tipe === 'datetime'" class="grid grid-cols-2 gap-3 mb-2">
                  <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-1">Min Datetime</label>
                    <input
                      v-model="question.validation_rules.min_datetime"
                      type="datetime-local"
                      class="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-1">Max Datetime</label>
                    <input
                      v-model="question.validation_rules.max_datetime"
                      type="datetime-local"
                      class="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                </div>

                <!-- Error Message (common for all) -->
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Pesan Error</label>
                  <input
                    v-model="question.validation_rules.error_message"
                    type="text"
                    placeholder="Masukkan pesan error validasi"
                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Add Question Button (at bottom) -->
        <div class="mt-4 flex justify-center">
          <button
            @click="addQuestion"
            class="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
          >
            <i class="fa-solid fa-plus"></i>
            Tambah Pertanyaan
          </button>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end gap-3 mb-6">
        <button
          @click="$router.push('/backoffice/formulir-survei')"
          class="px-6 py-2.5 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold text-sm hover:bg-gray-100 transition-colors cursor-pointer"
        >
          Batal
        </button>
        <button
          @click="submitForm"
          :disabled="isSaving"
          class="px-6 py-2.5 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <span v-if="isSaving">Menyimpan...</span>
          <span v-else>Simpan Formulir</span>
        </button>
      </div>
    </div>
  </DashboardLayout>
</template>


<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useToast } from '~/composables/useToast'
import { useAuthGuard } from '~/composables/useAuthGuard'

definePageMeta({
  middleware: 'auth'
})

useHead({
  title: 'Buat Formulir/Survei | Guru',
})

const { success, error } = useToast()
const { handle401 } = useAuthGuard()
const config = useRuntimeConfig()
const router = useRouter()

const isSaving = ref(false)
const isLoadingRombel = ref(false)
const rombelList = ref<any[]>([])
const fileConfigExtensions = ref<{ [key: number]: string }>({})
const fileConfigMimeTypes = ref<{ [key: number]: string }>({})

interface Question {
  tempId: string
  urutan: number
  label: string
  placeholder: string
  tipe: string
  is_required: boolean
  options: string[]
  validation_rules: any
  file_config: {
    max_size_mb: number | string
    allowed_types: string[]
    error_message: string
  }
  link: string
  dokumen: string
  dokumenFile: File | null
  showValidation: boolean
}

const formData = ref({
  judul: '',
  deskripsi: '',
  role: 'pendidik',
  is_active: true,
  max_responses: null as number | null,
  start_date: '',
  end_date: '',
  access_type: '',
  target_user_types: [] as string[],
  rombel_ids: [] as number[],
  allow_multiple_responses: false,
  pertanyaan: [] as any[]
})

let questionIdCounter = 0

const addQuestion = () => {
  const newQuestion = {
    tempId: `temp-${questionIdCounter++}`,
    urutan: formData.value.pertanyaan.length + 1,
    label: '',
    placeholder: '',
    tipe: '',
    is_required: false,
    options: [] as string[],
    validation_rules: {} as any,
    file_config: {
      max_size_mb: '',
      allowed_types: [] as string[],
      error_message: ''
    },
    link: '',
    dokumen: '',
    dokumenFile: null as File | null,
    showValidation: false
  }
  formData.value.pertanyaan.push(newQuestion)
}

const removeQuestion = (index: number) => {
  formData.value.pertanyaan.splice(index, 1)
  // Update urutan
  formData.value.pertanyaan.forEach((q, i) => {
    q.urutan = i + 1
  })
}

const moveQuestionUp = (index: number) => {
  if (index > 0) {
    const temp = formData.value.pertanyaan[index]
    formData.value.pertanyaan[index] = formData.value.pertanyaan[index - 1]
    formData.value.pertanyaan[index - 1] = temp
    // Update urutan
    formData.value.pertanyaan.forEach((q, i) => {
      q.urutan = i + 1
    })
  }
}

const moveQuestionDown = (index: number) => {
  if (index < formData.value.pertanyaan.length - 1) {
    const temp = formData.value.pertanyaan[index]
    formData.value.pertanyaan[index] = formData.value.pertanyaan[index + 1]
    formData.value.pertanyaan[index + 1] = temp
    // Update urutan
    formData.value.pertanyaan.forEach((q, i) => {
      q.urutan = i + 1
    })
  }
}

const addOption = (questionIndex: number) => {
  const question = formData.value.pertanyaan[questionIndex]
  if (question) {
    if (!question.options) {
      question.options = []
    }
    question.options.push('')
  }
}

const removeOption = (questionIndex: number, optionIndex: number) => {
  const question = formData.value.pertanyaan[questionIndex]
  if (question && question.options) {
    question.options.splice(optionIndex, 1)
  }
}

const toggleValidationRules = (index: number) => {
  const question = formData.value.pertanyaan[index]
  if (question) {
    question.showValidation = !question.showValidation
  }
}

const updateFileExtensions = (index: number, value: string) => {
  fileConfigExtensions.value[index] = value
  const extensions = value.split(',').map(e => e.trim()).filter(e => e)
  const question = formData.value.pertanyaan[index]
  if (question && question.file_config) {
    question.file_config.allowed_extensions = extensions
  }
}

const updateFileMimeTypes = (index: number, value: string) => {
  fileConfigMimeTypes.value[index] = value
  const mimeTypes = value.split(',').map(m => m.trim()).filter(m => m)
  const question = formData.value.pertanyaan[index]
  if (question && question.file_config) {
    question.file_config.allowed_mime_types = mimeTypes
  }
}

const handleDocumentUpload = (index: number, event: any) => {
  const file = event.target?.files?.[0]
  if (file) {
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      error('File Terlalu Besar', 'Ukuran file maksimal 5MB')
      if (event.target) event.target.value = '' // Reset input
      return
    }
    
    const question = formData.value.pertanyaan[index]
    if (question) {
      // Store file object and filename
      question.dokumenFile = file
      question.dokumen = file.name
      success('File Dipilih', `File ${file.name} siap diupload`)
    }
  }
}

// Helper function to convert MB to bytes
const convertMBToBytes = (mb: number): number => {
  return mb * 1024 * 1024
}

// Helper function to map file types to extensions and MIME types
const getFileExtensionsAndMimes = (types: string[]) => {
  const mapping: { [key: string]: { ext: string[], mime: string[] } } = {
    jpg: { ext: ['jpg', 'jpeg'], mime: ['image/jpeg'] },
    png: { ext: ['png'], mime: ['image/png'] },
    pdf: { ext: ['pdf'], mime: ['application/pdf'] },
    doc: { ext: ['doc', 'docx'], mime: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] },
    xls: { ext: ['xls', 'xlsx'], mime: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'] },
    gif: { ext: ['gif'], mime: ['image/gif'] },
    pptx: { ext: ['ppt', 'pptx'], mime: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'] }
  }
  
  const extensions: string[] = []
  const mimeTypes: string[] = []
  
  types.forEach(type => {
    const typeMapping = mapping[type]
    if (typeMapping) {
      extensions.push(...typeMapping.ext)
      mimeTypes.push(...typeMapping.mime)
    }
  })
  
  return { extensions, mimeTypes }
}

const loadRombel = async () => {
  isLoadingRombel.value = true
  try {
    const token = localStorage.getItem('auth_token')
    
    const response: any = await $fetch(
      `${config.public.apiBase}/api/v1/rombel/get-rombel`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: {
          search: {
            name: null,
            status: 'active',
            kelas_id: null
          },
          pagination: {
            limit: 50,
            page: 1
          }
        }
      }
    )
    
    if (response.data) {
      rombelList.value = response.data
    }
  } catch (err: any) {
    console.error('Error loading rombel:', err)
    if (err.status === 401 || err.statusCode === 401) {
      await handle401()
    }
  } finally {
    isLoadingRombel.value = false
  }
}

const validateForm = () => {
  if (!formData.value.judul) {
    error('Validasi Gagal', 'Judul formulir wajib diisi')
    return false
  }
  
  if (!formData.value.start_date) {
    error('Validasi Gagal', 'Tanggal mulai wajib diisi')
    return false
  }
  
  if (!formData.value.end_date) {
    error('Validasi Gagal', 'Tanggal berakhir wajib diisi')
    return false
  }
  
  if (!formData.value.access_type) {
    error('Validasi Gagal', 'Tipe akses wajib dipilih')
    return false
  }
  
  if (formData.value.access_type === 'authenticated' && formData.value.target_user_types.length === 0) {
    error('Validasi Gagal', 'Target responder wajib dipilih untuk tipe akses autentikasi')
    return false
  }
  
  if (formData.value.pertanyaan.length === 0) {
    error('Validasi Gagal', 'Minimal harus ada 1 pertanyaan')
    return false
  }
  
  // Validate each question
  for (let i = 0; i < formData.value.pertanyaan.length; i++) {
    const q = formData.value.pertanyaan[i]
    
    if (!q) continue
    
    if (!q.label) {
      error('Validasi Gagal', `Label pertanyaan ${i + 1} wajib diisi`)
      return false
    }
    
    if (!q.tipe) {
      error('Validasi Gagal', `Tipe pertanyaan ${i + 1} wajib dipilih`)
      return false
    }
    
    if (['select', 'radio', 'checkbox'].includes(q.tipe) && (!q.options || q.options.length === 0)) {
      error('Validasi Gagal', `Pertanyaan ${i + 1} harus memiliki minimal 1 pilihan`)
      return false
    }
  }
  
  return true
}

// Helper function to convert datetime-local format to YYYY-MM-DD HH:mm:ss
const formatDateTimeForAPI = (dateTimeString: string): string => {
  if (!dateTimeString) return ''
  
  // If already in correct format, return as is
  if (dateTimeString.includes(' ')) return dateTimeString
  
  // Convert from datetime-local format (YYYY-MM-DDTHH:mm) to YYYY-MM-DD HH:mm:ss
  const replaced = dateTimeString.replace('T', ' ')
  
  // Add seconds if not present
  if (replaced.length === 16) { // YYYY-MM-DD HH:mm
    return replaced + ':00'
  }
  
  return replaced
}

const submitForm = async () => {
  if (!validateForm()) {
    return
  }
  
  isSaving.value = true
  
  try {
    const token = localStorage.getItem('auth_token')
    
    // Prepare pertanyaan data
    const pertanyaanData = formData.value.pertanyaan.map(q => {
      const questionData: any = {
        urutan: q.urutan,
        label: q.label,
        placeholder: q.placeholder || '',
        tipe: q.tipe,
        is_required: q.is_required
      }
      
      // Add options for select, radio, checkbox
      if (['select', 'radio', 'checkbox'].includes(q.tipe)) {
        questionData.options = q.options.filter((opt: string) => opt.trim() !== '')
      }
      
      // Add validation rules if any
      if (q.validation_rules && Object.keys(q.validation_rules).length > 0) {
        questionData.validation_rules = {}
        Object.keys(q.validation_rules).forEach(key => {
          if (q.validation_rules[key] !== null && q.validation_rules[key] !== undefined && q.validation_rules[key] !== '') {
            // Handle custom pattern
            if (key === 'pattern' && q.validation_rules[key] === 'custom' && q.validation_rules.custom_pattern) {
              questionData.validation_rules.pattern = q.validation_rules.custom_pattern
            } else if (key !== 'custom_pattern') {
              questionData.validation_rules[key] = q.validation_rules[key]
            }
          }
        })
      }
      
      // Add file config if file type
      if (q.tipe === 'file' && q.file_config) {
        questionData.file_config = {}
        
        // Convert MB to bytes
        if (q.file_config.max_size_mb) {
          questionData.file_config.max_size = convertMBToBytes(Number(q.file_config.max_size_mb))
        }
        
        // Convert allowed types to extensions and MIME types
        if (q.file_config.allowed_types && q.file_config.allowed_types.length > 0) {
          const { extensions, mimeTypes } = getFileExtensionsAndMimes(q.file_config.allowed_types)
          questionData.file_config.allowed_extensions = extensions
          questionData.file_config.allowed_mime_types = mimeTypes
        }
        
        // Add error message
        if (q.file_config.error_message) {
          questionData.file_config.error_message = q.file_config.error_message
        }
      }
      
      // Add link if provided
      if (q.link) {
        questionData.link = q.link
      }
      
      return questionData
    })
    
    // Prepare request body wrapped in "data" key
    const requestData: any = {
      judul: formData.value.judul,
      deskripsi: formData.value.deskripsi || '',
      role: formData.value.role,
      is_active: formData.value.is_active,
      start_date: formatDateTimeForAPI(formData.value.start_date),
      end_date: formatDateTimeForAPI(formData.value.end_date),
      access_type: formData.value.access_type,
      pertanyaan: pertanyaanData
    }
    
    // Add max_responses if provided
    if (formData.value.max_responses) {
      requestData.max_responses = formData.value.max_responses
    }
    
    // Add target_user_types for authenticated
    if (formData.value.access_type === 'authenticated') {
      requestData.target_user_types = formData.value.target_user_types
      
      // Add rombel_ids if murid selected
      if (formData.value.target_user_types.includes('murid') && formData.value.rombel_ids.length > 0) {
        requestData.rombel_ids = formData.value.rombel_ids
      }
    }
    
    // Add allow_multiple_responses for public
    if (formData.value.access_type === 'public') {
      requestData.allow_multiple_responses = formData.value.allow_multiple_responses
    }
    
    // Create FormData
    const formDataToSend = new FormData()
    
    // Add main data as JSON string in "data" field
    formDataToSend.append('data', JSON.stringify(requestData))
    
    // Add document files with keys dokumen_1, dokumen_2, etc.
    formData.value.pertanyaan.forEach((q, index) => {
      if (q.dokumenFile) {
        formDataToSend.append(`dokumen_${q.urutan}`, q.dokumenFile)
      }
    })
    
    const response: any = await $fetch(
      `${config.public.apiBase}/api/v1/formulir/create-formulir`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type, let browser set it with boundary for FormData
        },
        body: formDataToSend
      }
    )
    
    if (response.data) {
      success('Berhasil', 'Formulir berhasil dibuat')
      router.push('/backoffice/formulir-survei-guru/form-saya')
    }
  } catch (err: any) {
    console.error('Error creating formulir:', err)
    
    if (err.status === 401 || err.statusCode === 401) {
      await handle401()
      return
    }
    
    error('Gagal', err.data?.message || 'Gagal membuat formulir')
  } finally {
    isSaving.value = false
  }
}

// Watch target_user_types to load rombel when murid is selected
watch(
  () => formData.value.target_user_types,
  (newVal) => {
    if (newVal.includes('murid') && rombelList.value.length === 0) {
      loadRombel()
    }
  },
  { deep: true }
)

onMounted(() => {
  // Load rombel if needed
  // Add first question by default
  if (formData.value.pertanyaan.length === 0) {
    addQuestion()
  }
})
</script>
