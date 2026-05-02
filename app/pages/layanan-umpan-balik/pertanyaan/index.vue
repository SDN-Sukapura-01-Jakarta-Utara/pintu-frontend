<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <PublicNavbar />

    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-red-600 via-red-500 to-red-600 py-16 sm:py-20 overflow-hidden">
      <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 1px); background-size: 30px 30px;"></div>
      <div class="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-10 left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
            <i class="fas fa-question-circle text-white"></i>
            <span class="text-white text-sm font-semibold">Layanan Pertanyaan</span>
          </div>
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Pusat Layanan Pertanyaan
          </h1>
          <p class="text-lg text-white/90 max-w-2xl mx-auto">
            Ajukan pertanyaan Anda atau lacak status pertanyaan yang telah diajukan
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-12 sm:py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Tabs -->
        <div class="bg-white rounded-t-2xl shadow-sm border border-gray-200 border-b-0">
          <div class="flex border-b border-gray-200">
            <button
              @click="activeTab = 'ajukan'"
              :class="[
                'flex-1 px-6 py-4 text-sm sm:text-base font-semibold transition-all duration-200 cursor-pointer',
                activeTab === 'ajukan'
                  ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              ]"
            >
              <i class="fas fa-paper-plane mr-2"></i>
              Ajukan Pertanyaan
            </button>
            <button
              @click="activeTab = 'lacak'"
              :class="[
                'flex-1 px-6 py-4 text-sm sm:text-base font-semibold transition-all duration-200 cursor-pointer',
                activeTab === 'lacak'
                  ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              ]"
            >
              <i class="fas fa-search mr-2"></i>
              Lacak Pertanyaan
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="bg-white rounded-b-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <!-- Ajukan Pertanyaan Tab -->
          <div v-if="activeTab === 'ajukan'">
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Nama Lengkap -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">
                  <i class="fas fa-user text-red-500 mr-1"></i>
                  Nama Lengkap <span class="text-red-600">*</span>
                </label>
                <input
                  v-model="form.nama"
                  type="text"
                  required
                  placeholder="Masukkan nama lengkap Anda"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                />
              </div>

              <!-- Email & Telepon -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">
                    <i class="fas fa-envelope text-red-500 mr-1"></i>
                    Email <span class="text-red-600">*</span>
                  </label>
                  <input
                    v-model="form.email"
                    type="email"
                    required
                    placeholder="contoh@email.com"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">
                    <i class="fas fa-phone text-red-500 mr-1"></i>
                    Nomor Telepon/WhatsApp <span class="text-red-600">*</span>
                  </label>
                  <input
                    v-model="form.telepon"
                    type="tel"
                    required
                    placeholder="08123456789"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                  />
                </div>
              </div>

              <!-- Kategori & Prioritas -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">
                    <i class="fas fa-tag text-red-500 mr-1"></i>
                    Kategori <span class="text-red-600">*</span>
                  </label>
                  <select
                    v-model="form.kategori"
                    required
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="Akademik">Akademik</option>
                    <option value="Non-Akademik">Non-Akademik</option>
                    <option value="Kegiatan Sekolah">Kegiatan Sekolah</option>
                    <option value="Penerimaan Murid Baru (SPMB)">Penerimaan Murid Baru (SPMB)</option>
                    <option value="Mutasi Siswa">Mutasi Siswa</option>
                    <option value="KJP">KJP</option>
                    <option value="PIP">PIP</option>
                    <option value="Administrasi">Administrasi</option>
                    <option value="Informasi Umum">Informasi Umum</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">
                    <i class="fas fa-exclamation-circle text-red-500 mr-1"></i>
                    Prioritas <span class="text-red-600">*</span>
                  </label>
                  <select
                    v-model="form.prioritas"
                    required
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                  >
                    <option value="">Pilih Prioritas</option>
                    <option value="Rendah">Rendah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Tinggi">Tinggi</option>
                  </select>
                </div>
              </div>

              <!-- Judul Pertanyaan -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">
                  <i class="fas fa-heading text-red-500 mr-1"></i>
                  Judul Pertanyaan <span class="text-red-600">*</span>
                </label>
                <input
                  v-model="form.judul"
                  type="text"
                  required
                  placeholder="Ringkasan singkat pertanyaan Anda"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                />
              </div>

              <!-- Deskripsi Pertanyaan -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">
                  <i class="fas fa-align-left text-red-500 mr-1"></i>
                  Deskripsi Pertanyaan <span class="text-red-600">*</span>
                </label>
                <textarea
                  v-model="form.deskripsi"
                  required
                  rows="5"
                  placeholder="Jelaskan pertanyaan Anda secara detail..."
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all resize-y"
                ></textarea>
              </div>

              <!-- Upload File -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">
                  <i class="fas fa-paperclip text-red-500 mr-1"></i>
                  Upload File (Opsional)
                </label>
                <p class="text-xs text-gray-600 mb-3">Maksimal 3 file, masing-masing maksimal 5 MB</p>
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  @change="handleFileChange"
                  class="hidden"
                />
                <button
                  type="button"
                  @click="$refs.fileInput.click()"
                  class="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-red-600 cursor-pointer"
                >
                  <i class="fas fa-cloud-upload-alt text-xl"></i>
                  <span class="font-medium">Klik untuk upload file</span>
                </button>

                <!-- File List -->
                <div v-if="selectedFiles.length > 0" class="mt-4 space-y-2">
                  <div
                    v-for="(file, index) in selectedFiles"
                    :key="index"
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                      <i class="fas fa-file text-red-500"></i>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</p>
                        <p class="text-xs text-gray-600">{{ formatFileSize(file.size) }}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      @click="removeFile(index)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="pt-4">
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
                  <i v-else class="fas fa-paper-plane"></i>
                  <span>{{ isSubmitting ? 'Mengirim...' : 'Kirim Pertanyaan' }}</span>
                </button>
              </div>
            </form>
          </div>

          <!-- Lacak Pertanyaan Tab -->
          <div v-else-if="activeTab === 'lacak'">
            <!-- Search Form -->
            <form @submit.prevent="handleTrackSearch" class="mb-6">
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                <i class="fas fa-ticket-alt text-red-500 mr-1"></i>
                ID Tiket
              </label>
              <div class="flex gap-3">
                <input
                  v-model="trackingId"
                  type="text"
                  placeholder="Masukkan ID Tiket (contoh: PRT-20260502-X0K6)"
                  class="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                />
                <button
                  type="submit"
                  :disabled="isSearching || !trackingId.trim()"
                  class="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                >
                  <i v-if="isSearching" class="fas fa-spinner fa-spin"></i>
                  <i v-else class="fas fa-search"></i>
                  <span>{{ isSearching ? 'Mencari...' : 'Cari' }}</span>
                </button>
              </div>
            </form>

            <!-- Not Found Message -->
            <div v-if="trackingResult === 'not-found'" class="text-center py-12">
              <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-exclamation-circle text-3xl text-red-500"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">ID Tiket Tidak Ditemukan</h3>
              <p class="text-gray-600">Pastikan ID Tiket yang Anda masukkan sudah benar</p>
            </div>

            <!-- Tracking Result -->
            <div v-else-if="trackingData" class="space-y-6">
              <!-- Status Banner -->
              <div 
                class="rounded-xl p-6 border-2"
                :class="{
                  'bg-yellow-50 border-yellow-300': trackingData.status === 'pending',
                  'bg-green-50 border-green-300': trackingData.status === 'processed',
                  'bg-gray-50 border-gray-300': trackingData.status === 'closed'
                }"
              >
                <div class="flex items-start gap-4">
                  <div 
                    class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    :class="{
                      'bg-yellow-200': trackingData.status === 'pending',
                      'bg-green-200': trackingData.status === 'processed',
                      'bg-gray-200': trackingData.status === 'closed'
                    }"
                  >
                    <i 
                      class="text-xl"
                      :class="{
                        'fas fa-clock text-yellow-700': trackingData.status === 'pending',
                        'fas fa-check-circle text-green-700': trackingData.status === 'processed',
                        'fas fa-times-circle text-gray-700': trackingData.status === 'closed'
                      }"
                    ></i>
                  </div>
                  <div class="flex-1">
                    <h3 
                      class="text-lg font-bold mb-2"
                      :class="{
                        'text-yellow-900': trackingData.status === 'pending',
                        'text-green-900': trackingData.status === 'processed',
                        'text-gray-900': trackingData.status === 'closed'
                      }"
                    >
                      {{ getStatusTitle(trackingData.status) }}
                    </h3>
                    <p 
                      class="text-sm"
                      :class="{
                        'text-yellow-800': trackingData.status === 'pending',
                        'text-green-800': trackingData.status === 'processed',
                        'text-gray-800': trackingData.status === 'closed'
                      }"
                    >
                      {{ getStatusMessage(trackingData.status) }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Ticket Information -->
              <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h4 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i class="fas fa-info-circle text-red-500"></i>
                  Informasi Tiket
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p class="text-xs text-gray-600 mb-1">ID Tiket</p>
                    <p class="text-sm font-semibold text-gray-900">{{ trackingData.id_tiket }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-600 mb-1">Tanggal Pengajuan</p>
                    <p class="text-sm font-semibold text-gray-900">{{ formatDate(trackingData.tanggal_pengajuan) }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-600 mb-1">Nama</p>
                    <p class="text-sm font-semibold text-gray-900">{{ trackingData.nama }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-600 mb-1">Email</p>
                    <p class="text-sm font-semibold text-gray-900">{{ trackingData.email }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-600 mb-1">Telepon</p>
                    <p class="text-sm font-semibold text-gray-900">{{ trackingData.telepon }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-600 mb-1">Kategori</p>
                    <p class="text-sm font-semibold text-gray-900">{{ trackingData.kategori }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-600 mb-1">Prioritas</p>
                    <p class="text-sm font-semibold text-gray-900">
                      <span 
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="{
                          'bg-green-100 text-green-800': trackingData.prioritas === 'Rendah',
                          'bg-yellow-100 text-yellow-800': trackingData.prioritas === 'Sedang',
                          'bg-red-100 text-red-800': trackingData.prioritas === 'Tinggi'
                        }"
                      >
                        {{ trackingData.prioritas }}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-600 mb-1">Status</p>
                    <p class="text-sm font-semibold text-gray-900">
                      <span 
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="{
                          'bg-yellow-100 text-yellow-800': trackingData.status === 'pending',
                          'bg-green-100 text-green-800': trackingData.status === 'processed',
                          'bg-gray-100 text-gray-800': trackingData.status === 'closed'
                        }"
                      >
                        {{ getStatusLabel(trackingData.status) }}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <!-- Question Details -->
              <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h4 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i class="fas fa-question-circle text-red-500"></i>
                  Detail Pertanyaan
                </h4>
                <div class="space-y-3">
                  <div>
                    <p class="text-xs text-gray-600 mb-1">Judul</p>
                    <p class="text-sm font-semibold text-gray-900">{{ trackingData.judul }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-600 mb-1">Deskripsi</p>
                    <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ trackingData.deskripsi }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="!trackingResult" class="text-center py-12">
              <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-search text-3xl text-gray-400"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Lacak Pertanyaan Anda</h3>
              <p class="text-gray-600">Masukkan ID Tiket untuk melihat status pertanyaan</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <PublicFooter />

    <!-- Success Modal -->
    <Transition name="fade">
      <div v-if="showSuccessModal" @click="closeSuccessModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
        <div @click.stop class="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-bounce-in">
          <!-- Header -->
          <div class="relative bg-gradient-to-r from-green-600 via-green-500 to-green-600 p-8 text-center overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            
            <div class="relative">
              <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <i class="fas fa-check-circle text-4xl text-green-500"></i>
              </div>
              <h3 class="text-2xl font-bold text-white mb-2">Pertanyaan Terkirim!</h3>
              <p class="text-white/90 text-sm">Pertanyaan Anda telah berhasil dikirim</p>
            </div>
          </div>
          
          <!-- Body -->
          <div class="p-8">
            <div class="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
              <p class="text-sm font-semibold text-blue-900 mb-2">ID Tiket Anda:</p>
              <div class="flex items-center justify-between bg-white rounded-lg p-3 border border-blue-300">
                <code class="text-lg font-bold text-blue-600">{{ ticketId }}</code>
                <button
                  @click="copyTicketId"
                  class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  title="Salin ID Tiket"
                >
                  <i class="fas fa-copy"></i>
                </button>
              </div>
            </div>

            <div class="space-y-3 mb-6">
              <div class="flex items-start gap-3">
                <i class="fas fa-info-circle text-blue-500 mt-1"></i>
                <p class="text-sm text-gray-700">
                  <strong>Simpan ID Tiket ini</strong> untuk melacak status pertanyaan Anda
                </p>
              </div>
              <div class="flex items-start gap-3">
                <i class="fas fa-envelope text-green-500 mt-1"></i>
                <p class="text-sm text-gray-700">
                  Jawaban akan dikirimkan ke email Anda
                </p>
              </div>
              <div class="flex items-start gap-3">
                <i class="fas fa-clock text-orange-500 mt-1"></i>
                <p class="text-sm text-gray-700">
                  Kami akan memproses pertanyaan Anda dalam 1-3 hari kerja
                </p>
              </div>
            </div>
            
            <button 
              @click="closeSuccessModal" 
              class="w-full px-6 py-3.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast Notification -->
    <Transition name="slide-down">
      <div v-if="toast.show" class="fixed top-4 right-4 z-[110] max-w-md">
        <div 
          class="rounded-xl shadow-2xl overflow-hidden animate-shake"
          :class="{
            'bg-gradient-to-r from-red-600 to-red-500': toast.type === 'error',
            'bg-gradient-to-r from-orange-600 to-orange-500': toast.type === 'warning',
            'bg-gradient-to-r from-green-600 to-green-500': toast.type === 'success'
          }"
        >
          <div class="p-4 flex items-start gap-3">
            <div class="flex-shrink-0">
              <i v-if="toast.type === 'error'" class="fas fa-exclamation-circle text-white text-xl"></i>
              <i v-if="toast.type === 'warning'" class="fas fa-exclamation-triangle text-white text-xl"></i>
              <i v-if="toast.type === 'success'" class="fas fa-check-circle text-white text-xl"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-white font-semibold text-sm mb-1">{{ toast.title }}</p>
              <p class="text-white/90 text-xs">{{ toast.message }}</p>
            </div>
            <button 
              @click="closeToast"
              class="flex-shrink-0 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { submitPertanyaan, trackPertanyaan } from '~/services/pertanyaan'
import PublicNavbar from '~/components/PublicNavbar.vue'
import PublicFooter from '~/components/PublicFooter.vue'

useHead({
  title: 'Layanan Pertanyaan - SDN Sukapura 01'
})

const activeTab = ref('ajukan')
const isSubmitting = ref(false)
const showSuccessModal = ref(false)
const ticketId = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const toast = ref({
  show: false,
  type: 'error' as 'error' | 'warning' | 'success',
  title: '',
  message: ''
})

let toastTimeout: NodeJS.Timeout | null = null

// Tracking
const trackingId = ref('')
const isSearching = ref(false)
const trackingResult = ref<'found' | 'not-found' | null>(null)
const trackingData = ref<any>(null)

const form = ref({
  nama: '',
  email: '',
  telepon: '',
  kategori: '',
  prioritas: '',
  judul: '',
  deskripsi: ''
})

const selectedFiles = ref<File[]>([])

const showToast = (type: 'error' | 'warning' | 'success', title: string, message: string) => {
  // Clear existing timeout
  if (toastTimeout) {
    clearTimeout(toastTimeout)
  }
  
  toast.value = {
    show: true,
    type,
    title,
    message
  }
  
  // Auto hide after 4 seconds
  toastTimeout = setTimeout(() => {
    closeToast()
  }, 4000)
}

const closeToast = () => {
  toast.value.show = false
  if (toastTimeout) {
    clearTimeout(toastTimeout)
    toastTimeout = null
  }
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  
  // Validate max 3 files
  if (selectedFiles.value.length + files.length > 3) {
    showToast('warning', 'Batas Upload Tercapai', 'Maksimal 3 file yang dapat diupload')
    return
  }
  
  // Validate file size (5MB max per file)
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  const invalidFiles = files.filter(file => file.size > maxSize)
  
  if (invalidFiles.length > 0) {
    showToast('error', 'Ukuran File Terlalu Besar', 'Ukuran file maksimal 5 MB per file')
    return
  }
  
  selectedFiles.value = [...selectedFiles.value, ...files]
  
  // Reset input
  if (target) {
    target.value = ''
  }
}

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    const formData = new FormData()
    formData.append('nama', form.value.nama)
    formData.append('email', form.value.email)
    formData.append('telepon', form.value.telepon)
    formData.append('kategori', form.value.kategori)
    formData.append('prioritas', form.value.prioritas)
    formData.append('judul', form.value.judul)
    formData.append('deskripsi', form.value.deskripsi)
    
    // Append files
    selectedFiles.value.forEach((file) => {
      formData.append('file_pertanyaan', file)
    })
    
    const response = await submitPertanyaan(formData)
    
    // Show success modal with ticket ID
    ticketId.value = response.data.id_tiket
    showSuccessModal.value = true
    
    // Reset form
    form.value = {
      nama: '',
      email: '',
      telepon: '',
      kategori: '',
      prioritas: '',
      judul: '',
      deskripsi: ''
    }
    selectedFiles.value = []
  } catch (error) {
    console.error('Error submitting pertanyaan:', error)
    showToast('error', 'Gagal Mengirim', 'Gagal mengirim pertanyaan. Silakan coba lagi.')
  } finally {
    isSubmitting.value = false
  }
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  ticketId.value = ''
}

const copyTicketId = () => {
  navigator.clipboard.writeText(ticketId.value)
  showToast('success', 'Berhasil Disalin', 'ID Tiket berhasil disalin ke clipboard!')
}

const handleTrackSearch = async () => {
  if (!trackingId.value.trim()) return
  
  isSearching.value = true
  trackingResult.value = null
  trackingData.value = null
  
  try {
    const response = await trackPertanyaan(trackingId.value.trim())
    
    if (response.data) {
      trackingResult.value = 'found'
      trackingData.value = response.data
    } else {
      trackingResult.value = 'not-found'
    }
  } catch (error) {
    console.error('Error tracking pertanyaan:', error)
    trackingResult.value = 'not-found'
  } finally {
    isSearching.value = false
  }
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Menunggu',
    processed: 'Dijawab',
    closed: 'Ditutup'
  }
  return labels[status] || status
}

const getStatusTitle = (status: string) => {
  const titles: Record<string, string> = {
    pending: 'Pertanyaan Dalam Antrian',
    processed: 'Pertanyaan Telah Dijawab',
    closed: 'Pertanyaan Telah Ditutup'
  }
  return titles[status] || status
}

const getStatusMessage = (status: string) => {
  const messages: Record<string, string> = {
    pending: 'Pertanyaan Anda saat ini masih dalam antrian. Tim kami akan segera memprosesnya dalam 1-3 hari kerja.',
    processed: 'Pertanyaan Anda telah dijawab oleh admin. Silakan cek email Anda untuk melihat jawaban lengkapnya.',
    closed: 'Pertanyaan ini telah ditutup dan tidak dapat diproses lebih lanjut. Jika Anda memiliki pertanyaan lain, silakan ajukan pertanyaan baru.'
  }
  return messages[status] || status
}

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.3) translateY(-50px);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}

.animate-bounce-in {
  animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-2px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(2px);
  }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}
</style>
