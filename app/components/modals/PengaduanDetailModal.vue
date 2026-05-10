<template>
    <Transition name="modal">
        <div v-if="isOpen" @click="handleClose" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div @click.stop class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 max-h-[90vh] overflow-y-auto">
                <!-- Loading State -->
                <div v-if="isLoading" class="flex items-center justify-center py-16">
                    <div class="flex flex-col items-center gap-4">
                        <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
                        <p class="text-base text-gray-600 font-medium">Memuat detail pengaduan...</p>
                    </div>
                </div>

                <!-- Content -->
                <template v-else-if="data">
                    <!-- Header -->
                    <div class="sticky top-0 bg-gradient-to-r from-red-600 to-red-500 px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <i class="fas fa-bullhorn text-white text-xl"></i>
                            </div>
                            <div>
                                <h2 class="text-xl font-bold text-white">Detail Pengaduan</h2>
                                <p class="text-sm text-white/80">{{ data.id_tiket }}</p>
                            </div>
                        </div>
                        <button @click="handleClose" class="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg cursor-pointer">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>

                    <div class="p-6 space-y-6">
                        <!-- Status Badge -->
                        <div class="flex items-center justify-between flex-wrap gap-3">
                            <span 
                                class="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold"
                                :class="{
                                    'bg-orange-100 text-orange-800': data.status === 'pending',
                                    'bg-blue-100 text-blue-800': data.status === 'processed',
                                    'bg-gray-100 text-gray-800': data.status === 'closed'
                                }"
                            >
                                <i class="fas fa-circle text-xs mr-2"></i>
                                {{ getStatusLabel(data.status) }}
                            </span>
                            <div class="flex items-center gap-2">
                                <span 
                                    class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium"
                                    :class="{
                                        'bg-purple-100 text-purple-800': data.tipe_pelapor === 'anonim',
                                        'bg-blue-100 text-blue-800': data.tipe_pelapor === 'teridentifikasi'
                                    }"
                                >
                                    {{ data.tipe_pelapor === 'anonim' ? 'Anonim' : 'Teridentifikasi' }}
                                </span>
                                <span 
                                    class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium"
                                    :class="{
                                        'bg-green-100 text-green-800': data.prioritas === 'Rendah',
                                        'bg-yellow-100 text-yellow-800': data.prioritas === 'Sedang',
                                        'bg-red-100 text-red-800': data.prioritas === 'Tinggi'
                                    }"
                                >
                                    Prioritas: {{ data.prioritas }}
                                </span>
                            </div>
                        </div>

                        <!-- Informasi Pelapor (hanya untuk teridentifikasi) -->
                        <div v-if="data.tipe_pelapor === 'teridentifikasi'" class="bg-gray-50 rounded-xl p-5 border border-gray-200">
                            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <i class="fas fa-user text-red-500"></i>
                                Informasi Pelapor
                            </h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p class="text-xs text-gray-600 mb-1">Nama</p>
                                    <p class="text-sm font-semibold text-gray-900">{{ data.nama || '-' }}</p>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-600 mb-1">Email</p>
                                    <p class="text-sm font-semibold text-gray-900">{{ data.email || '-' }}</p>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-600 mb-1">Telepon</p>
                                    <p class="text-sm font-semibold text-gray-900">{{ data.telepon || '-' }}</p>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-600 mb-1">Tanggal Pengajuan</p>
                                    <p class="text-sm font-semibold text-gray-900">{{ formatDateTime(data.tanggal_pengajuan) }}</p>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-600 mb-1">Kategori</p>
                                    <p class="text-sm font-semibold text-gray-900">{{ data.kategori }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Informasi Pengaduan (untuk anonim) -->
                        <div v-else class="bg-gray-50 rounded-xl p-5 border border-gray-200">
                            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <i class="fas fa-info-circle text-red-500"></i>
                                Informasi Pengaduan
                            </h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p class="text-xs text-gray-600 mb-1">Tanggal Pengajuan</p>
                                    <p class="text-sm font-semibold text-gray-900">{{ formatDateTime(data.tanggal_pengajuan) }}</p>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-600 mb-1">Kategori</p>
                                    <p class="text-sm font-semibold text-gray-900">{{ data.kategori }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Pengaduan -->
                        <div class="bg-orange-50 rounded-xl p-5 border border-orange-200">
                            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <i class="fas fa-bullhorn text-orange-500"></i>
                                Pengaduan
                            </h3>
                            <div class="space-y-4">
                                <div>
                                    <p class="text-sm font-bold text-orange-900 mb-2 flex items-center gap-2">
                                        <i class="fas fa-heading text-orange-600"></i>
                                        Judul Pengaduan
                                    </p>
                                    <p class="text-sm font-semibold text-gray-900 bg-white p-3 rounded-lg border border-orange-200">{{ data.judul }}</p>
                                </div>
                                <div>
                                    <p class="text-sm font-bold text-orange-900 mb-2 flex items-center gap-2">
                                        <i class="fas fa-align-left text-orange-600"></i>
                                        Deskripsi Pengaduan
                                    </p>
                                    <p class="text-sm text-gray-700 whitespace-pre-wrap bg-white p-3 rounded-lg border border-orange-200">{{ data.deskripsi }}</p>
                                </div>
                                <!-- File Pengaduan -->
                                <div v-if="data.file_pengaduan && data.file_pengaduan.length > 0">
                                    <p class="text-sm font-bold text-orange-900 mb-2 flex items-center gap-2">
                                        <i class="fas fa-paperclip text-orange-600"></i>
                                        File Bukti Pengaduan
                                    </p>
                                    <div class="space-y-2">
                                        <a 
                                            v-for="file in data.file_pengaduan" 
                                            :key="file.id"
                                            :href="file.url"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="flex items-center gap-3 p-3 bg-white rounded-lg border border-orange-200 hover:border-orange-400 hover:bg-orange-50 transition-all cursor-pointer group"
                                        >
                                            <i class="fas fa-file-pdf text-red-500 text-xl"></i>
                                            <div class="flex-1 min-w-0">
                                                <p class="text-sm font-medium text-gray-900 truncate group-hover:text-orange-600">{{ file.filename }}</p>
                                                <p class="text-xs text-gray-600">{{ formatFileSize(file.size) }}</p>
                                            </div>
                                            <i class="fas fa-download text-gray-400 group-hover:text-orange-600"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- UNTUK TIPE ANONIM: Hanya Tindak Lanjut -->
                        <template v-if="data.tipe_pelapor === 'anonim'">
                            <!-- Form Tindak Lanjut (untuk status pending atau processed tanpa tindak lanjut) -->
                            <div v-if="data.status !== 'closed' && !data.tindak_lanjut" class="bg-purple-50 rounded-xl p-5 border border-purple-200">
                                <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <i class="fas fa-tasks text-purple-500"></i>
                                    Tindak Lanjut
                                </h3>
                                <form @submit.prevent="handleSubmitTindakLanjut" class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-900 mb-2">
                                            Tindak Lanjut <span class="text-red-600">*</span>
                                        </label>
                                        <textarea
                                            v-model="tindakLanjutForm"
                                            required
                                            rows="5"
                                            placeholder="Masukkan tindak lanjut untuk pengaduan ini..."
                                            class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-y"
                                        ></textarea>
                                    </div>

                                    <!-- Upload File Tindak Lanjut -->
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-900 mb-2">
                                            File Lampiran (Opsional)
                                        </label>
                                        <p class="text-xs text-gray-600 mb-3">Maksimal 3 file, masing-masing maksimal 5 MB</p>
                                        <input
                                            ref="fileInputTindakLanjut"
                                            type="file"
                                            multiple
                                            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                            @change="handleFileChangeTindakLanjut"
                                            class="hidden"
                                        />
                                        <button
                                            type="button"
                                            @click="$refs.fileInputTindakLanjut.click()"
                                            class="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-purple-600 cursor-pointer"
                                        >
                                            <i class="fas fa-cloud-upload-alt text-xl"></i>
                                            <span class="font-medium">Klik untuk upload file</span>
                                        </button>

                                        <!-- File List -->
                                        <div v-if="selectedFilesTindakLanjut.length > 0" class="mt-3 space-y-2">
                                            <div
                                                v-for="(file, index) in selectedFilesTindakLanjut"
                                                :key="index"
                                                class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                                            >
                                                <div class="flex items-center gap-3 flex-1 min-w-0">
                                                    <i class="fas fa-file text-purple-500"></i>
                                                    <div class="flex-1 min-w-0">
                                                        <p class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</p>
                                                        <p class="text-xs text-gray-600">{{ formatFileSize(file.size) }}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    @click="removeFileTindakLanjut(index)"
                                                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <i class="fas fa-times"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        :disabled="isSubmittingTindakLanjut"
                                        class="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        <i v-if="isSubmittingTindakLanjut" class="fas fa-spinner fa-spin mr-2"></i>
                                        <i v-else class="fas fa-save mr-2"></i>
                                        {{ isSubmittingTindakLanjut ? 'Menyimpan...' : 'Simpan Tindak Lanjut' }}
                                    </button>
                                </form>
                            </div>

                            <!-- Tampilan Tindak Lanjut (jika sudah ada) - ANONIM -->
                            <div v-if="data.tindak_lanjut && !isEditingTindakLanjut" class="bg-purple-50 rounded-xl p-5 border border-purple-200">
                                <div class="flex items-center justify-between mb-4">
                                    <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <i class="fas fa-check-circle text-purple-500"></i>
                                        Tindak Lanjut
                                    </h3>
                                    <button
                                        v-if="data.status !== 'closed'"
                                        @click="handleEditTindakLanjut"
                                        class="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-2"
                                    >
                                        <i class="fas fa-edit"></i>
                                        Edit
                                    </button>
                                </div>
                                <div class="space-y-4">
                                    <div class="bg-white p-4 rounded-lg border border-purple-200">
                                        <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ data.tindak_lanjut }}</p>
                                    </div>
                                    <!-- File Tindak Lanjut -->
                                    <div v-if="data.file_tindak_lanjut && data.file_tindak_lanjut.length > 0">
                                        <p class="text-sm font-bold text-purple-900 mb-2 flex items-center gap-2">
                                            <i class="fas fa-paperclip text-purple-600"></i>
                                            File Lampiran Tindak Lanjut
                                        </p>
                                        <div class="space-y-2">
                                            <a 
                                                v-for="file in data.file_tindak_lanjut" 
                                                :key="file.id"
                                                :href="file.url"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all cursor-pointer group"
                                            >
                                                <i class="fas fa-file-pdf text-red-500 text-xl"></i>
                                                <div class="flex-1 min-w-0">
                                                    <p class="text-sm font-medium text-gray-900 truncate group-hover:text-purple-600">{{ file.filename }}</p>
                                                    <p class="text-xs text-gray-600">{{ formatFileSize(file.size) }}</p>
                                                </div>
                                                <i class="fas fa-download text-gray-400 group-hover:text-purple-600"></i>
                                            </a>
                                        </div>
                                    </div>
                                    <div class="text-xs text-gray-600">
                                        <i class="fas fa-clock mr-1"></i>
                                        Diproses pada: {{ formatDateTime(data.tanggal_proses) }}
                                    </div>
                                </div>
                            </div>

                            <!-- Form Edit Tindak Lanjut (untuk anonim) -->
                            <div v-if="data.tindak_lanjut && isEditingTindakLanjut && data.tipe_pelapor === 'anonim'" class="bg-purple-50 rounded-xl p-5 border border-purple-200">
                                <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <i class="fas fa-edit text-purple-500"></i>
                                    Edit Tindak Lanjut
                                </h3>
                                <form @submit.prevent="handleSubmitTindakLanjut" class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-900 mb-2">
                                            Tindak Lanjut <span class="text-red-600">*</span>
                                        </label>
                                        <textarea
                                            v-model="tindakLanjutForm"
                                            required
                                            rows="5"
                                            placeholder="Masukkan tindak lanjut untuk pengaduan ini..."
                                            class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-y"
                                        ></textarea>
                                    </div>

                                    <!-- Upload File Tindak Lanjut -->
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-900 mb-2">
                                            File Lampiran (Opsional)
                                        </label>
                                        <p class="text-xs text-gray-600 mb-3">Maksimal 3 file total (file lama + file baru). Masing-masing maksimal 5 MB</p>
                                        
                                        <!-- Existing Files -->
                                        <div v-if="existingFilesTindakLanjut.length > 0" class="mb-3">
                                            <p class="text-xs font-semibold text-gray-700 mb-2">File yang sudah ada:</p>
                                            <div class="space-y-2">
                                                <div
                                                    v-for="file in existingFilesTindakLanjut"
                                                    :key="file.id"
                                                    class="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                                                >
                                                    <div class="flex items-center gap-3 flex-1 min-w-0">
                                                        <i class="fas fa-file text-blue-500"></i>
                                                        <div class="flex-1 min-w-0">
                                                            <p class="text-sm font-medium text-gray-900 truncate">{{ file.filename }}</p>
                                                            <p class="text-xs text-gray-600">{{ formatFileSize(file.size) }}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        @click="removeExistingFileTindakLanjut(file.id)"
                                                        class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                        title="Hapus file"
                                                    >
                                                        <i class="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Upload New Files -->
                                        <input
                                            ref="fileInputTindakLanjut"
                                            type="file"
                                            multiple
                                            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                            @change="handleFileChangeTindakLanjut"
                                            class="hidden"
                                        />
                                        <button
                                            type="button"
                                            @click="$refs.fileInputTindakLanjut.click()"
                                            :disabled="existingFilesTindakLanjut.length + selectedFilesTindakLanjut.length >= 3"
                                            class="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-purple-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <i class="fas fa-cloud-upload-alt text-xl"></i>
                                            <span class="font-medium">Klik untuk upload file baru</span>
                                        </button>

                                        <!-- New Files List -->
                                        <div v-if="selectedFilesTindakLanjut.length > 0" class="mt-3">
                                            <p class="text-xs font-semibold text-gray-700 mb-2">File baru yang akan diupload:</p>
                                            <div class="space-y-2">
                                                <div
                                                    v-for="(file, index) in selectedFilesTindakLanjut"
                                                    :key="index"
                                                    class="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                                                >
                                                    <div class="flex items-center gap-3 flex-1 min-w-0">
                                                        <i class="fas fa-file text-green-500"></i>
                                                        <div class="flex-1 min-w-0">
                                                            <p class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</p>
                                                            <p class="text-xs text-gray-600">{{ formatFileSize(file.size) }}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        @click="removeFileTindakLanjut(index)"
                                                        class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                    >
                                                        <i class="fas fa-times"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- File Count Info -->
                                        <p class="text-xs text-gray-600 mt-2">
                                            Total file: {{ existingFilesTindakLanjut.length + selectedFilesTindakLanjut.length }} / 3
                                        </p>
                                    </div>

                                    <div class="flex gap-3">
                                        <button
                                            type="button"
                                            @click="handleCancelEditTindakLanjut"
                                            class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                        >
                                            <i class="fas fa-times mr-2"></i>
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            :disabled="isSubmittingTindakLanjut"
                                            class="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            <i v-if="isSubmittingTindakLanjut" class="fas fa-spinner fa-spin mr-2"></i>
                                            <i v-else class="fas fa-save mr-2"></i>
                                            {{ isSubmittingTindakLanjut ? 'Menyimpan...' : 'Simpan Perubahan' }}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <!-- Close Pengaduan (jika sudah ada tindak lanjut) -->
                            <div v-if="data.tindak_lanjut && data.status !== 'closed' && !isEditingTindakLanjut" class="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                <div class="flex items-start gap-3">
                                    <input
                                        v-model="closeConfirmation"
                                        type="checkbox"
                                        id="closeConfirm"
                                        class="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                                    />
                                    <label for="closeConfirm" class="flex-1 cursor-pointer">
                                        <p class="text-sm font-semibold text-gray-900 mb-1">Tutup Pengaduan</p>
                                        <p class="text-xs text-gray-600">
                                            Dengan mencentang ini, pengaduan akan ditandai sebagai selesai dan ditutup. 
                                            Pengaduan yang sudah ditutup tidak dapat diproses lebih lanjut.
                                        </p>
                                    </label>
                                </div>
                                <button
                                    @click="handleClosePengaduan"
                                    :disabled="!closeConfirmation || isClosingPengaduan"
                                    class="mt-4 w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-500 text-white font-semibold rounded-lg hover:from-gray-700 hover:to-gray-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    <i v-if="isClosingPengaduan" class="fas fa-spinner fa-spin mr-2"></i>
                                    <i v-else class="fas fa-times-circle mr-2"></i>
                                    {{ isClosingPengaduan ? 'Menutup...' : 'Tutup Pengaduan' }}
                                </button>
                            </div>
                        </template>

                        <!-- UNTUK TIPE TERIDENTIFIKASI: Jawaban + Tindak Lanjut -->
                        <template v-else>
                            <!-- Form Jawaban (untuk status pending) -->
                            <div v-if="data.status === 'pending'" class="bg-green-50 rounded-xl p-5 border border-green-200">
                                <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <i class="fas fa-reply text-green-500"></i>
                                    Jawab Pengaduan
                                </h3>
                                <form @submit.prevent="handleSubmitJawaban" class="space-y-4">
                                    <!-- Judul Jawaban -->
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-900 mb-2">
                                            Judul Jawaban <span class="text-red-600">*</span>
                                        </label>
                                        <input
                                            v-model="jawabanForm.judul_jawaban"
                                            type="text"
                                            required
                                            placeholder="Masukkan judul jawaban"
                                            class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all"
                                        />
                                    </div>

                                    <!-- Deskripsi Jawaban -->
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-900 mb-2">
                                            Deskripsi Jawaban <span class="text-red-600">*</span>
                                        </label>
                                        <RichTextEditor 
                                            v-model="jawabanForm.deskripsi_jawaban"
                                            placeholder="Masukkan jawaban lengkap untuk pengaduan ini..."
                                        />
                                    </div>

                                    <!-- Upload File Jawaban -->
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-900 mb-2">
                                            File Lampiran (Opsional)
                                        </label>
                                        <p class="text-xs text-gray-600 mb-3">Maksimal 3 file, masing-masing maksimal 5 MB</p>
                                        <input
                                            ref="fileInputJawaban"
                                            type="file"
                                            multiple
                                            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                            @change="handleFileChangeJawaban"
                                            class="hidden"
                                        />
                                        <button
                                            type="button"
                                            @click="$refs.fileInputJawaban.click()"
                                            class="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-green-600 cursor-pointer"
                                        >
                                            <i class="fas fa-cloud-upload-alt text-xl"></i>
                                            <span class="font-medium">Klik untuk upload file</span>
                                        </button>

                                        <!-- File List -->
                                        <div v-if="selectedFilesJawaban.length > 0" class="mt-3 space-y-2">
                                            <div
                                                v-for="(file, index) in selectedFilesJawaban"
                                                :key="index"
                                                class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                                            >
                                                <div class="flex items-center gap-3 flex-1 min-w-0">
                                                    <i class="fas fa-file text-green-500"></i>
                                                    <div class="flex-1 min-w-0">
                                                        <p class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</p>
                                                        <p class="text-xs text-gray-600">{{ formatFileSize(file.size) }}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    @click="removeFileJawaban(index)"
                                                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <i class="fas fa-times"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Submit Button -->
                                    <button
                                        type="submit"
                                        :disabled="isSubmittingJawaban"
                                        class="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        <i v-if="isSubmittingJawaban" class="fas fa-spinner fa-spin mr-2"></i>
                                        <i v-else class="fas fa-paper-plane mr-2"></i>
                                        {{ isSubmittingJawaban ? 'Mengirim...' : 'Kirim Jawaban' }}
                                    </button>
                                </form>
                            </div>

                            <!-- Tampilan Jawaban (jika sudah ada) -->
                            <div v-if="data.judul_jawaban" class="bg-green-50 rounded-xl p-5 border border-green-200">
                                <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <i class="fas fa-check-circle text-green-500"></i>
                                    Jawaban
                                </h3>
                                <div class="space-y-4">
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <p class="text-xs text-gray-600 mb-1">Tanggal Proses</p>
                                            <p class="text-sm font-semibold text-gray-900">{{ formatDateTime(data.tanggal_proses) }}</p>
                                        </div>
                                        <div>
                                            <p class="text-xs text-gray-600 mb-1">Dijawab Oleh</p>
                                            <p class="text-sm font-semibold text-gray-900">{{ data.replied_by || '-' }}</p>
                                        </div>
                                        <div>
                                            <p class="text-xs text-gray-600 mb-1">Email Terkirim</p>
                                            <span 
                                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                                :class="data.email_terkirim ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                                            >
                                                {{ data.email_terkirim ? 'Ya' : 'Tidak' }}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p class="text-sm font-bold text-green-900 mb-2 flex items-center gap-2">
                                            <i class="fas fa-heading text-green-600"></i>
                                            Judul Jawaban
                                        </p>
                                        <p class="text-sm font-semibold text-gray-900 bg-white p-3 rounded-lg border border-green-200">{{ data.judul_jawaban }}</p>
                                    </div>
                                    <div>
                                        <p class="text-sm font-bold text-green-900 mb-2 flex items-center gap-2">
                                            <i class="fas fa-align-left text-green-600"></i>
                                            Deskripsi Jawaban
                                        </p>
                                        <div class="text-sm text-gray-700 bg-white p-3 rounded-lg border border-green-200 prose prose-sm max-w-none" v-html="data.deskripsi_jawaban"></div>
                                    </div>
                                    <!-- File Jawaban -->
                                    <div v-if="data.file_jawaban && data.file_jawaban.length > 0">
                                        <p class="text-sm font-bold text-green-900 mb-2 flex items-center gap-2">
                                            <i class="fas fa-paperclip text-green-600"></i>
                                            File Lampiran Jawaban
                                        </p>
                                        <div class="space-y-2">
                                            <a 
                                                v-for="file in data.file_jawaban" 
                                                :key="file.id"
                                                :href="file.url"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200 hover:border-green-400 hover:bg-green-50 transition-all cursor-pointer group"
                                            >
                                                <i class="fas fa-file-pdf text-red-500 text-xl"></i>
                                                <div class="flex-1 min-w-0">
                                                    <p class="text-sm font-medium text-gray-900 truncate group-hover:text-green-600">{{ file.filename }}</p>
                                                    <p class="text-xs text-gray-600">{{ formatFileSize(file.size) }}</p>
                                                </div>
                                                <i class="fas fa-download text-gray-400 group-hover:text-green-600"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Form Tindak Lanjut (jika sudah ada jawaban tapi belum ada tindak lanjut) -->
                            <div v-if="data.judul_jawaban && !data.tindak_lanjut && data.status !== 'closed'" class="bg-purple-50 rounded-xl p-5 border border-purple-200">
                                <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <i class="fas fa-tasks text-purple-500"></i>
                                    Tindak Lanjut
                                </h3>
                                <form @submit.prevent="handleSubmitTindakLanjut" class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-900 mb-2">
                                            Tindak Lanjut <span class="text-red-600">*</span>
                                        </label>
                                        <textarea
                                            v-model="tindakLanjutForm"
                                            required
                                            rows="5"
                                            placeholder="Masukkan tindak lanjut untuk pengaduan ini..."
                                            class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-y"
                                        ></textarea>
                                    </div>

                                    <!-- Upload File Tindak Lanjut -->
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-900 mb-2">
                                            File Lampiran (Opsional)
                                        </label>
                                        <p class="text-xs text-gray-600 mb-3">Maksimal 3 file, masing-masing maksimal 5 MB</p>
                                        <input
                                            ref="fileInputTindakLanjut"
                                            type="file"
                                            multiple
                                            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                            @change="handleFileChangeTindakLanjut"
                                            class="hidden"
                                        />
                                        <button
                                            type="button"
                                            @click="$refs.fileInputTindakLanjut.click()"
                                            class="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-purple-600 cursor-pointer"
                                        >
                                            <i class="fas fa-cloud-upload-alt text-xl"></i>
                                            <span class="font-medium">Klik untuk upload file</span>
                                        </button>

                                        <!-- File List -->
                                        <div v-if="selectedFilesTindakLanjut.length > 0" class="mt-3 space-y-2">
                                            <div
                                                v-for="(file, index) in selectedFilesTindakLanjut"
                                                :key="index"
                                                class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                                            >
                                                <div class="flex items-center gap-3 flex-1 min-w-0">
                                                    <i class="fas fa-file text-purple-500"></i>
                                                    <div class="flex-1 min-w-0">
                                                        <p class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</p>
                                                        <p class="text-xs text-gray-600">{{ formatFileSize(file.size) }}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    @click="removeFileTindakLanjut(index)"
                                                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <i class="fas fa-times"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        :disabled="isSubmittingTindakLanjut"
                                        class="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        <i v-if="isSubmittingTindakLanjut" class="fas fa-spinner fa-spin mr-2"></i>
                                        <i v-else class="fas fa-save mr-2"></i>
                                        {{ isSubmittingTindakLanjut ? 'Menyimpan...' : 'Simpan Tindak Lanjut' }}
                                    </button>
                                </form>
                            </div>

                            <!-- Tampilan Tindak Lanjut (jika sudah ada) - TERIDENTIFIKASI -->
                            <div v-if="data.tindak_lanjut && !isEditingTindakLanjut" class="bg-purple-50 rounded-xl p-5 border border-purple-200">
                                <div class="flex items-center justify-between mb-4">
                                    <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <i class="fas fa-check-circle text-purple-500"></i>
                                        Tindak Lanjut
                                    </h3>
                                    <button
                                        v-if="data.status !== 'closed'"
                                        @click="handleEditTindakLanjut"
                                        class="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-2"
                                    >
                                        <i class="fas fa-edit"></i>
                                        Edit
                                    </button>
                                </div>
                                <div class="space-y-4">
                                    <div class="bg-white p-4 rounded-lg border border-purple-200">
                                        <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ data.tindak_lanjut }}</p>
                                    </div>
                                    <!-- File Tindak Lanjut -->
                                    <div v-if="data.file_tindak_lanjut && data.file_tindak_lanjut.length > 0">
                                        <p class="text-sm font-bold text-purple-900 mb-2 flex items-center gap-2">
                                            <i class="fas fa-paperclip text-purple-600"></i>
                                            File Lampiran Tindak Lanjut
                                        </p>
                                        <div class="space-y-2">
                                            <a 
                                                v-for="file in data.file_tindak_lanjut" 
                                                :key="file.id"
                                                :href="file.url"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all cursor-pointer group"
                                            >
                                                <i class="fas fa-file-pdf text-red-500 text-xl"></i>
                                                <div class="flex-1 min-w-0">
                                                    <p class="text-sm font-medium text-gray-900 truncate group-hover:text-purple-600">{{ file.filename }}</p>
                                                    <p class="text-xs text-gray-600">{{ formatFileSize(file.size) }}</p>
                                                </div>
                                                <i class="fas fa-download text-gray-400 group-hover:text-purple-600"></i>
                                            </a>
                                        </div>
                                    </div>
                                    <div class="text-xs text-gray-600">
                                        <i class="fas fa-clock mr-1"></i>
                                        Diproses pada: {{ formatDateTime(data.tanggal_proses) }}
                                    </div>
                                </div>
                            </div>

                            <!-- Form Edit Tindak Lanjut (untuk teridentifikasi) -->
                            <div v-if="data.tindak_lanjut && isEditingTindakLanjut && data.tipe_pelapor === 'teridentifikasi'" class="bg-purple-50 rounded-xl p-5 border border-purple-200">
                                <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <i class="fas fa-edit text-purple-500"></i>
                                    Edit Tindak Lanjut
                                </h3>
                                <form @submit.prevent="handleSubmitTindakLanjut" class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-900 mb-2">
                                            Tindak Lanjut <span class="text-red-600">*</span>
                                        </label>
                                        <textarea
                                            v-model="tindakLanjutForm"
                                            required
                                            rows="5"
                                            placeholder="Masukkan tindak lanjut untuk pengaduan ini..."
                                            class="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-y"
                                        ></textarea>
                                    </div>

                                    <!-- Upload File Tindak Lanjut -->
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-900 mb-2">
                                            File Lampiran (Opsional)
                                        </label>
                                        <p class="text-xs text-gray-600 mb-3">Maksimal 3 file total (file lama + file baru). Masing-masing maksimal 5 MB</p>
                                        
                                        <!-- Existing Files -->
                                        <div v-if="existingFilesTindakLanjut.length > 0" class="mb-3">
                                            <p class="text-xs font-semibold text-gray-700 mb-2">File yang sudah ada:</p>
                                            <div class="space-y-2">
                                                <div
                                                    v-for="file in existingFilesTindakLanjut"
                                                    :key="file.id"
                                                    class="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                                                >
                                                    <div class="flex items-center gap-3 flex-1 min-w-0">
                                                        <i class="fas fa-file text-blue-500"></i>
                                                        <div class="flex-1 min-w-0">
                                                            <p class="text-sm font-medium text-gray-900 truncate">{{ file.filename }}</p>
                                                            <p class="text-xs text-gray-600">{{ formatFileSize(file.size) }}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        @click="removeExistingFileTindakLanjut(file.id)"
                                                        class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                        title="Hapus file"
                                                    >
                                                        <i class="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Upload New Files -->
                                        <input
                                            ref="fileInputTindakLanjut"
                                            type="file"
                                            multiple
                                            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                            @change="handleFileChangeTindakLanjut"
                                            class="hidden"
                                        />
                                        <button
                                            type="button"
                                            @click="$refs.fileInputTindakLanjut.click()"
                                            :disabled="existingFilesTindakLanjut.length + selectedFilesTindakLanjut.length >= 3"
                                            class="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-purple-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <i class="fas fa-cloud-upload-alt text-xl"></i>
                                            <span class="font-medium">Klik untuk upload file baru</span>
                                        </button>

                                        <!-- New Files List -->
                                        <div v-if="selectedFilesTindakLanjut.length > 0" class="mt-3">
                                            <p class="text-xs font-semibold text-gray-700 mb-2">File baru yang akan diupload:</p>
                                            <div class="space-y-2">
                                                <div
                                                    v-for="(file, index) in selectedFilesTindakLanjut"
                                                    :key="index"
                                                    class="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                                                >
                                                    <div class="flex items-center gap-3 flex-1 min-w-0">
                                                        <i class="fas fa-file text-green-500"></i>
                                                        <div class="flex-1 min-w-0">
                                                            <p class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</p>
                                                            <p class="text-xs text-gray-600">{{ formatFileSize(file.size) }}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        @click="removeFileTindakLanjut(index)"
                                                        class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                    >
                                                        <i class="fas fa-times"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- File Count Info -->
                                        <p class="text-xs text-gray-600 mt-2">
                                            Total file: {{ existingFilesTindakLanjut.length + selectedFilesTindakLanjut.length }} / 3
                                        </p>
                                    </div>

                                    <div class="flex gap-3">
                                        <button
                                            type="button"
                                            @click="handleCancelEditTindakLanjut"
                                            class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                        >
                                            <i class="fas fa-times mr-2"></i>
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            :disabled="isSubmittingTindakLanjut"
                                            class="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            <i v-if="isSubmittingTindakLanjut" class="fas fa-spinner fa-spin mr-2"></i>
                                            <i v-else class="fas fa-save mr-2"></i>
                                            {{ isSubmittingTindakLanjut ? 'Menyimpan...' : 'Simpan Perubahan' }}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <!-- Close Pengaduan (jika sudah ada tindak lanjut) -->
                            <div v-if="data.tindak_lanjut && data.status !== 'closed' && !isEditingTindakLanjut" class="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                <div class="flex items-start gap-3">
                                    <input
                                        v-model="closeConfirmation"
                                        type="checkbox"
                                        id="closeConfirm"
                                        class="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                                    />
                                    <label for="closeConfirm" class="flex-1 cursor-pointer">
                                        <p class="text-sm font-semibold text-gray-900 mb-1">Tutup Pengaduan</p>
                                        <p class="text-xs text-gray-600">
                                            Dengan mencentang ini, pengaduan akan ditandai sebagai selesai dan ditutup. 
                                            Pengaduan yang sudah ditutup tidak dapat diproses lebih lanjut.
                                        </p>
                                    </label>
                                </div>
                                <button
                                    @click="handleClosePengaduan"
                                    :disabled="!closeConfirmation || isClosingPengaduan"
                                    class="mt-4 w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-500 text-white font-semibold rounded-lg hover:from-gray-700 hover:to-gray-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    <i v-if="isClosingPengaduan" class="fas fa-spinner fa-spin mr-2"></i>
                                    <i v-else class="fas fa-times-circle mr-2"></i>
                                    {{ isClosingPengaduan ? 'Menutup...' : 'Tutup Pengaduan' }}
                                </button>
                            </div>
                        </template>

                        <!-- Info Closed (untuk status closed) -->
                        <div v-if="data.status === 'closed'" class="bg-gray-50 rounded-xl p-5 border border-gray-200">
                            <div class="flex items-center gap-3 text-gray-600">
                                <i class="fas fa-info-circle text-xl"></i>
                                <div>
                                    <p class="text-sm font-semibold text-gray-900">Pengaduan Ditutup</p>
                                    <p class="text-xs text-gray-600">
                                        Pengaduan ini telah ditutup pada {{ formatDateTime(data.tanggal_selesai) }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </Transition>

    <!-- Confirmation Modal -->
    <Transition name="modal">
        <div v-if="showConfirmSendModal" @click="cancelSendJawaban" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div @click.stop class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <!-- Header -->
                <div class="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 flex items-center gap-3">
                    <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <i class="fas fa-question-circle text-white text-xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-white">Konfirmasi Kirim Jawaban</h3>
                </div>
                
                <!-- Body -->
                <div class="p-6">
                    <div class="text-center mb-6">
                        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-paper-plane text-blue-600 text-2xl"></i>
                        </div>
                        <h4 class="text-lg font-semibold text-gray-900 mb-2">Kirim Jawaban?</h4>
                        <p class="text-sm text-gray-600 mb-4">
                            Apakah Anda yakin akan mengirim jawaban untuk pengaduan ini?
                        </p>
                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left">
                            <p class="text-xs text-blue-800 mb-1">
                                <strong>Email akan dikirim ke:</strong>
                            </p>
                            <p class="text-sm font-semibold text-blue-900">{{ data?.email }}</p>
                        </div>
                    </div>
                    
                    <div class="flex gap-3">
                        <button 
                            @click="cancelSendJawaban"
                            class="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            Batal
                        </button>
                        <button 
                            @click="confirmSendJawaban"
                            class="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all cursor-pointer"
                        >
                            Ya, Kirim
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Transition>

    <!-- Success Modal -->
    <Transition name="modal">
        <div v-if="showSuccessModal" @click="closeSuccessModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div @click.stop class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <!-- Header -->
                <div class="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 text-center">
                    <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                        <i class="fas fa-check-circle text-green-500 text-3xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-1">Jawaban Terkirim!</h3>
                    <p class="text-white/90 text-sm">Email berhasil dikirim dan data tersimpan</p>
                </div>
                
                <!-- Body -->
                <div class="p-6">
                    <div class="space-y-3 mb-6">
                        <div class="flex items-start gap-3">
                            <i class="fas fa-envelope text-green-500 mt-1"></i>
                            <p class="text-sm text-gray-700">
                                Email jawaban telah dikirim ke <strong>{{ data?.email }}</strong>
                            </p>
                        </div>
                        <div class="flex items-start gap-3">
                            <i class="fas fa-database text-blue-500 mt-1"></i>
                            <p class="text-sm text-gray-700">
                                Data jawaban telah tersimpan dalam sistem
                            </p>
                        </div>
                        <div class="flex items-start gap-3">
                            <i class="fas fa-clock text-orange-500 mt-1"></i>
                            <p class="text-sm text-gray-700">
                                Status pengaduan telah diubah menjadi "Diproses"
                            </p>
                        </div>
                    </div>
                    
                    <button 
                        @click="closeSuccessModal"
                        class="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-600 transition-all cursor-pointer"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    </Transition>

    <!-- Close Confirmation Modal -->
    <Transition name="modal">
        <div v-if="showConfirmCloseModal" @click="cancelClosePengaduan" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div @click.stop class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <!-- Header -->
                <div class="bg-gradient-to-r from-red-600 to-red-500 px-6 py-4 flex items-center gap-3">
                    <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <i class="fas fa-times-circle text-white text-xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-white">Konfirmasi Tutup Pengaduan</h3>
                </div>
                
                <!-- Body -->
                <div class="p-6">
                    <div class="text-center mb-6">
                        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-times-circle text-red-600 text-2xl"></i>
                        </div>
                        <h4 class="text-lg font-semibold text-gray-900 mb-2">Tutup Pengaduan?</h4>
                        <p class="text-sm text-gray-600 mb-4">
                            Apakah Anda yakin akan menutup pengaduan ini?
                        </p>
                        <div class="bg-red-50 border border-red-200 rounded-lg p-3 text-left">
                            <p class="text-xs text-red-800 mb-2">
                                <strong>Dengan menutup pengaduan ini:</strong>
                            </p>
                            <ul class="text-xs text-red-700 space-y-1">
                                <li>• Pengaduan akan ditandai sebagai selesai</li>
                                <li>• Tidak dapat diproses lebih lanjut</li>
                                <li>• Status akan berubah menjadi "Ditutup"</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="flex gap-3">
                        <button 
                            @click="cancelClosePengaduan"
                            class="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            Batal
                        </button>
                        <button 
                            @click="confirmClosePengaduan"
                            class="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-600 transition-all cursor-pointer"
                        >
                            Ya, Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Transition>

    <!-- Close Success Modal -->
    <Transition name="modal">
        <div v-if="showCloseSuccessModal" @click="closeCloseSuccessModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div @click.stop class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <!-- Header -->
                <div class="bg-gradient-to-r from-gray-600 to-gray-500 px-6 py-4 text-center">
                    <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                        <i class="fas fa-check-circle text-gray-500 text-3xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-1">Pengaduan Ditutup!</h3>
                    <p class="text-white/90 text-sm">Pengaduan berhasil ditutup</p>
                </div>
                
                <!-- Body -->
                <div class="p-6">
                    <div class="space-y-3 mb-6">
                        <div class="flex items-start gap-3">
                            <i class="fas fa-check-circle text-green-500 mt-1"></i>
                            <p class="text-sm text-gray-700">
                                Pengaduan telah ditandai sebagai <strong>selesai</strong>
                            </p>
                        </div>
                        <div class="flex items-start gap-3">
                            <i class="fas fa-lock text-gray-500 mt-1"></i>
                            <p class="text-sm text-gray-700">
                                Status berubah menjadi <strong>"Ditutup"</strong>
                            </p>
                        </div>
                        <div class="flex items-start gap-3">
                            <i class="fas fa-info-circle text-blue-500 mt-1"></i>
                            <p class="text-sm text-gray-700">
                                Pengaduan tidak dapat diproses lebih lanjut
                            </p>
                        </div>
                    </div>
                    
                    <button 
                        @click="closeCloseSuccessModal"
                        class="w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-500 text-white font-semibold rounded-lg hover:from-gray-700 hover:to-gray-600 transition-all cursor-pointer"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import RichTextEditor from '~/components/common/RichTextEditor.vue'
import { useToast } from '~/composables/useToast'

const props = defineProps<{
    isOpen: boolean
    data: any
    isLoading: boolean
}>()

const emit = defineEmits<{
    close: []
    refresh: []
}>()

const config = useRuntimeConfig()
const { success: showSuccessToast, error: showErrorToast } = useToast()

// Form state
const jawabanForm = ref({
    judul_jawaban: '',
    deskripsi_jawaban: ''
})

const tindakLanjutForm = ref('')
const selectedFilesJawaban = ref<File[]>([])
const selectedFilesTindakLanjut = ref<File[]>([])
const existingFilesTindakLanjut = ref<any[]>([])
const filesToDelete = ref<string[]>([])
const fileInputJawaban = ref<HTMLInputElement | null>(null)
const fileInputTindakLanjut = ref<HTMLInputElement | null>(null)
const closeConfirmation = ref(false)
const isEditingTindakLanjut = ref(false)

// Loading states
const isSubmittingJawaban = ref(false)
const isSubmittingTindakLanjut = ref(false)
const isClosingPengaduan = ref(false)

// Confirmation states
const showConfirmSendModal = ref(false)
const showSuccessModal = ref(false)
const showConfirmCloseModal = ref(false)
const showCloseSuccessModal = ref(false)

// Methods
const handleClose = () => {
    emit('close')
    emit('refresh')
    // Reset form
    jawabanForm.value = {
        judul_jawaban: '',
        deskripsi_jawaban: ''
    }
    tindakLanjutForm.value = ''
    selectedFilesJawaban.value = []
    closeConfirmation.value = false
}

const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
        pending: 'Menunggu',
        processed: 'Diproses',
        closed: 'Ditutup'
    }
    return labels[status] || status
}

const formatDateTime = (dateString: string) => {
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

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const handleFileChangeJawaban = (event: Event) => {
    const target = event.target as HTMLInputElement
    const files = Array.from(target.files || [])
    
    if (selectedFilesJawaban.value.length + files.length > 3) {
        showErrorToast('Maksimal 3 file yang dapat diupload')
        return
    }
    
    const maxSize = 5 * 1024 * 1024
    const invalidFiles = files.filter(file => file.size > maxSize)
    
    if (invalidFiles.length > 0) {
        showErrorToast('Ukuran file maksimal 5 MB per file')
        return
    }
    
    selectedFilesJawaban.value = [...selectedFilesJawaban.value, ...files]
    
    if (target) {
        target.value = ''
    }
}

const removeFileJawaban = (index: number) => {
    selectedFilesJawaban.value.splice(index, 1)
}

const handleFileChangeTindakLanjut = (event: Event) => {
    const target = event.target as HTMLInputElement
    const files = Array.from(target.files || [])
    
    // Calculate total files (existing + new)
    const totalFiles = existingFilesTindakLanjut.value.length + selectedFilesTindakLanjut.value.length + files.length
    
    if (totalFiles > 3) {
        showErrorToast('Maksimal 3 file yang dapat diupload (termasuk file yang sudah ada)')
        return
    }
    
    const maxSize = 5 * 1024 * 1024
    const invalidFiles = files.filter(file => file.size > maxSize)
    
    if (invalidFiles.length > 0) {
        showErrorToast('Ukuran file maksimal 5 MB per file')
        return
    }
    
    selectedFilesTindakLanjut.value = [...selectedFilesTindakLanjut.value, ...files]
    
    if (target) {
        target.value = ''
    }
}

const removeFileTindakLanjut = (index: number) => {
    selectedFilesTindakLanjut.value.splice(index, 1)
}

const removeExistingFileTindakLanjut = (fileId: string) => {
    // Add to delete list
    filesToDelete.value.push(fileId)
    // Remove from existing files display
    existingFilesTindakLanjut.value = existingFilesTindakLanjut.value.filter(file => file.id !== fileId)
}

const handleSubmitJawaban = async () => {
    // Validate form
    if (!jawabanForm.value.judul_jawaban.trim() || !jawabanForm.value.deskripsi_jawaban.trim()) {
        showErrorToast('Mohon lengkapi judul dan deskripsi jawaban')
        return
    }
    
    // Show confirmation modal
    showConfirmSendModal.value = true
}

const confirmSendJawaban = async () => {
    showConfirmSendModal.value = false
    isSubmittingJawaban.value = true
    
    try {
        const token = localStorage.getItem('auth_token')
        const formData = new FormData()
        
        formData.append('id', props.data.id.toString())
        formData.append('judul_jawaban', jawabanForm.value.judul_jawaban)
        formData.append('deskripsi_jawaban', jawabanForm.value.deskripsi_jawaban)
        
        // Append files
        selectedFilesJawaban.value.forEach((file) => {
            formData.append('file_jawaban', file)
        })
        
        const response = await fetch(`${config.public.apiBase}/api/v1/pengaduan/send-reply`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })

        if (response.status === 401) {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('user')
            showErrorToast('Sesi Habis', 'Sesi Anda telah habis. Silakan login kembali.')
            setTimeout(() => {
                navigateTo('/backoffice/login')
            }, 1500)
            return
        }

        if (!response.ok) {
            throw new Error('Failed to send reply')
        }

        const result = await response.json()
        
        // Update data with new response
        Object.assign(props.data, result.data)
        
        // Show success modal
        showSuccessModal.value = true
        
        // Reset form
        jawabanForm.value = {
            judul_jawaban: '',
            deskripsi_jawaban: ''
        }
        selectedFilesJawaban.value = []
        
    } catch (error) {
        console.error('Error sending reply:', error)
        showErrorToast('Gagal mengirim jawaban. Silakan coba lagi.')
    } finally {
        isSubmittingJawaban.value = false
    }
}

const cancelSendJawaban = () => {
    showConfirmSendModal.value = false
}

const closeSuccessModal = () => {
    showSuccessModal.value = false
}

const handleSubmitTindakLanjut = async () => {
    if (!tindakLanjutForm.value.trim()) {
        showErrorToast('Mohon isi tindak lanjut')
        return
    }
    
    isSubmittingTindakLanjut.value = true
    
    try {
        const token = localStorage.getItem('auth_token')
        const formData = new FormData()
        
        formData.append('id', props.data.id.toString())
        formData.append('tindak_lanjut', tindakLanjutForm.value)
        
        // Append new files
        selectedFilesTindakLanjut.value.forEach((file) => {
            formData.append('file_tindak_lanjut', file)
        })
        
        // Append files to delete
        if (filesToDelete.value.length > 0) {
            formData.append('files_to_delete', JSON.stringify(filesToDelete.value))
        }
        
        const response = await fetch(`${config.public.apiBase}/api/v1/pengaduan/save-tindak-lanjut`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })

        if (response.status === 401) {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('user')
            showErrorToast('Sesi Habis', 'Sesi Anda telah habis. Silakan login kembali.')
            setTimeout(() => {
                navigateTo('/backoffice/login')
            }, 1500)
            return
        }

        if (!response.ok) {
            throw new Error('Failed to save tindak lanjut')
        }

        const result = await response.json()
        
        // Update data with new response
        Object.assign(props.data, result.data)
        
        showSuccessToast('Tindak lanjut berhasil disimpan')
        
        // Reset form and edit mode
        tindakLanjutForm.value = ''
        selectedFilesTindakLanjut.value = []
        existingFilesTindakLanjut.value = []
        filesToDelete.value = []
        isEditingTindakLanjut.value = false
        
    } catch (error) {
        console.error('Error saving tindak lanjut:', error)
        showErrorToast('Gagal menyimpan tindak lanjut. Silakan coba lagi.')
    } finally {
        isSubmittingTindakLanjut.value = false
    }
}

const handleEditTindakLanjut = () => {
    // Populate form with existing data
    tindakLanjutForm.value = props.data.tindak_lanjut || ''
    selectedFilesTindakLanjut.value = []
    // Copy existing files to display
    existingFilesTindakLanjut.value = props.data.file_tindak_lanjut ? [...props.data.file_tindak_lanjut] : []
    filesToDelete.value = []
    isEditingTindakLanjut.value = true
}

const handleCancelEditTindakLanjut = () => {
    tindakLanjutForm.value = ''
    selectedFilesTindakLanjut.value = []
    existingFilesTindakLanjut.value = []
    filesToDelete.value = []
    isEditingTindakLanjut.value = false
}

const handleClosePengaduan = () => {
    if (!closeConfirmation.value) return
    
    // Show confirmation modal
    showConfirmCloseModal.value = true
}

const confirmClosePengaduan = async () => {
    showConfirmCloseModal.value = false
    isClosingPengaduan.value = true
    
    try {
        const token = localStorage.getItem('auth_token')
        
        const response = await fetch(`${config.public.apiBase}/api/v1/pengaduan/close-pengaduan`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id: props.data.id })
        })

        if (response.status === 401) {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('user')
            showErrorToast('Sesi Habis', 'Sesi Anda telah habis. Silakan login kembali.')
            setTimeout(() => {
                navigateTo('/backoffice/login')
            }, 1500)
            return
        }

        if (!response.ok) {
            throw new Error('Failed to close pengaduan')
        }

        const result = await response.json()
        
        // Update data with new response
        Object.assign(props.data, result.data)
        
        // Show success modal
        showCloseSuccessModal.value = true
        
        // Reset checkbox
        closeConfirmation.value = false
        
    } catch (error) {
        console.error('Error closing pengaduan:', error)
        showErrorToast('Gagal menutup pengaduan. Silakan coba lagi.')
    } finally {
        isClosingPengaduan.value = false
    }
}

const cancelClosePengaduan = () => {
    showConfirmCloseModal.value = false
}

const closeCloseSuccessModal = () => {
    showCloseSuccessModal.value = false
}

// Watch for modal close to reset form
watch(() => props.isOpen, (newVal) => {
    if (!newVal) {
        jawabanForm.value = {
            judul_jawaban: '',
            deskripsi_jawaban: ''
        }
        tindakLanjutForm.value = ''
        selectedFilesJawaban.value = []
        selectedFilesTindakLanjut.value = []
        existingFilesTindakLanjut.value = []
        filesToDelete.value = []
        closeConfirmation.value = false
        showConfirmSendModal.value = false
        showSuccessModal.value = false
        isEditingTindakLanjut.value = false
        showConfirmCloseModal.value = false
        showCloseSuccessModal.value = false
    }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
    transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
    transform: scale(0.9);
}
</style>
