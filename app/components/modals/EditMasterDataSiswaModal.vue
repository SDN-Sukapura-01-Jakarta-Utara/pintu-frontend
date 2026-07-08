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
        <div v-if="modelValue"
            class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <div
                class="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-2xl w-full max-w-3xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]">

                <!-- Header with Red Gradient Background -->
                <div
                    class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
                    <!-- Animated gradient blobs -->
                    <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0"></div>

                    <!-- Header Content -->
                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Edit Data Siswa</h2>
                    </div>

                    <!-- Close Button -->
                    <button type="button" @click.stop="closeModal" :disabled="isSubmitting" :title="'Tutup'"
                        class="relative z-10 flex-shrink-0 inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-150 disabled:opacity-50 backdrop-blur-sm cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Loading State -->
                <div v-if="isLoading" class="p-4 sm:p-8 flex items-center justify-center flex-1">
                    <div class="flex flex-col items-center gap-3 sm:gap-4">
                        <div
                            class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600">
                        </div>
                        <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat data siswa...</p>
                    </div>
                </div>

                <!-- Body with Form -->
                <div v-else-if="siswa" class="p-4 sm:p-8 relative z-10 overflow-y-auto flex-1">

                    <!-- Form -->
                    <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
                        <!-- Nama Input -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Nama
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <input v-model="form.nama" type="text" placeholder="Nama lengkap peserta didik" required
                                :disabled="isSubmitting"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>

                        <!-- NIS and NISN Row -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <!-- NIS Input -->
                            <div>
                                <label
                                    class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                    NIS
                                    <span class="text-red-600 ml-1">*</span>
                                </label>
                                <input v-model="form.nis" type="text" placeholder="Nomor Induk Siswa" required
                                    :disabled="isSubmitting"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                            </div>

                            <!-- NISN Input -->
                            <div>
                                <label
                                    class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                    NISN
                                    <span class="text-red-600 ml-1">*</span>
                                </label>
                                <input v-model="form.nisn" type="text" placeholder="Nomor Induk Siswa Nasional" required
                                    :disabled="isSubmitting"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                            </div>
                        </div>

                        <!-- Jenis Kelamin and Tempat Lahir Row -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <!-- Jenis Kelamin Dropdown -->
                            <div>
                                <label
                                    class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                    Jenis Kelamin
                                    <span class="text-red-600 ml-1">*</span>
                                </label>
                                <select v-model="form.jenis_kelamin" required :disabled="isSubmitting"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                    <option value="">Pilih Jenis Kelamin</option>
                                    <option value="L">Laki-laki</option>
                                    <option value="P">Perempuan</option>
                                </select>
                            </div>

                            <!-- Tempat Lahir Input -->
                            <div>
                                <label
                                    class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                    Tempat Lahir
                                    <span class="text-red-600 ml-1">*</span>
                                </label>
                                <input v-model="form.tempat_lahir" type="text" placeholder="Tempat lahir" required
                                    :disabled="isSubmitting"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                            </div>
                        </div>

                        <!-- Tanggal Lahir and NIK Row -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <!-- Tanggal Lahir Input -->
                            <div>
                                <label
                                    class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                    Tanggal Lahir
                                    <span class="text-red-600 ml-1">*</span>
                                </label>
                                <input v-model="form.tanggal_lahir" type="date" required :disabled="isSubmitting"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                            </div>

                            <!-- NIK Input -->
                            <div>
                                <label
                                    class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                    NIK
                                    <span class="text-red-600 ml-1">*</span>
                                </label>
                                <input v-model="form.nik" type="text" placeholder="Nomor Induk Kependudukan" required
                                    :disabled="isSubmitting"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                            </div>
                        </div>

                        <!-- Agama Dropdown -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Agama
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <select v-model="form.agama" required :disabled="isSubmitting"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                <option value="">Pilih Agama</option>
                                <option value="Islam">Islam</option>
                                <option value="Kristen">Kristen</option>
                                <option value="Katolik">Katolik</option>
                                <option value="Hindu">Hindu</option>
                                <option value="Buddha">Buddha</option>
                                <option value="Konghucu">Konghucu</option>
                            </select>
                        </div>

                        <!-- Alamat Input -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Alamat
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <textarea v-model="form.alamat" placeholder="Alamat lengkap" required
                                :disabled="isSubmitting"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                                rows="3"></textarea>
                        </div>

                        <!-- RT, RW, Kelurahan, Kecamatan Row -->
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                            <!-- RT Input -->
                            <div>
                                <label
                                    class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                    RT
                                    <span class="text-red-600 ml-1">*</span>
                                </label>
                                <input v-model="form.rt" type="text" placeholder="RT" required maxlength="5"
                                    :disabled="isSubmitting"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                            </div>

                            <!-- RW Input -->
                            <div>
                                <label
                                    class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                    RW
                                    <span class="text-red-600 ml-1">*</span>
                                </label>
                                <input v-model="form.rw" type="text" placeholder="RW" required maxlength="5"
                                    :disabled="isSubmitting"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                            </div>

                            <!-- Kelurahan Input -->
                            <div>
                                <label
                                    class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                    Kelurahan
                                    <span class="text-red-600 ml-1">*</span>
                                </label>
                                <input v-model="form.kelurahan" type="text" placeholder="Kelurahan" required
                                    :disabled="isSubmitting"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                            </div>

                            <!-- Kecamatan Input -->
                            <div>
                                <label
                                    class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                    Kecamatan
                                    <span class="text-red-600 ml-1">*</span>
                                </label>
                                <input v-model="form.kecamatan" type="text" placeholder="Kecamatan" required
                                    :disabled="isSubmitting"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                            </div>
                        </div>

                        <!-- Kode Pos Input -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Kode Pos
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <input v-model="form.kode_pos" type="text" placeholder="Kode Pos" required
                                :disabled="isSubmitting"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>

                        <!-- Nama Ayah and Nama Ibu Row -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <!-- Nama Ayah Input -->
                            <div>
                                <label
                                    class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                    Nama Ayah
                                    <span class="text-red-600 ml-1">*</span>
                                </label>
                                <input v-model="form.nama_ayah" type="text" placeholder="Nama ayah" required
                                    :disabled="isSubmitting"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                            </div>

                            <!-- Nama Ibu Input -->
                            <div>
                                <label
                                    class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                    Nama Ibu
                                    <span class="text-red-600 ml-1">*</span>
                                </label>
                                <input v-model="form.nama_ibu" type="text" placeholder="Nama ibu" required
                                    :disabled="isSubmitting"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                            </div>
                        </div>

                        <!-- Foto Siswa Upload -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Foto Siswa (3x4)
                                <span class="text-xs text-gray-500 font-normal ml-2">Maksimal 1 MB</span>
                            </label>
                            
                            <!-- Current Photo Display -->
                            <div v-if="currentPhoto && !selectedPhoto" class="mb-3">
                                <p class="text-xs text-gray-600 mb-2">Foto saat ini:</p>
                                <img :src="currentPhoto" alt="Foto saat ini" class="w-24 h-32 object-cover rounded border-2 border-gray-300" />
                            </div>

                            <!-- Hidden File Input -->
                            <input ref="photoInput" type="file" accept="image/jpeg,image/jpg,image/png" @change="handlePhotoSelect" class="hidden" :disabled="isSubmitting" />
                            
                            <!-- Upload Area -->
                            <div v-if="!selectedPhoto" @click="triggerPhotoInput" :class="['border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer transition-all duration-200', isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:border-red-500 hover:bg-red-50']">
                                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p class="text-xs sm:text-sm font-medium text-gray-700 mt-2">
                                    {{ currentPhoto ? 'Ganti Foto' : 'Klik untuk upload foto' }}
                                </p>
                                <p class="text-xs text-gray-500 mt-1">Format: JPG, PNG (Max 1 MB)</p>
                            </div>

                            <!-- Preview Selected Photo -->
                            <div v-else class="border-2 border-red-500 rounded-lg p-4 bg-red-50">
                                <div class="flex items-start gap-4">
                                    <img :src="photoPreview" alt="Preview" class="w-24 h-32 object-cover rounded border-2 border-gray-300" />
                                    <div class="flex-1">
                                        <p class="text-xs sm:text-sm font-semibold text-gray-900 mb-1">{{ selectedPhoto.name }}</p>
                                        <p class="text-xs text-gray-600 mb-2">{{ formatFileSize(selectedPhoto.size) }}</p>
                                        <button type="button" @click="removePhoto" :disabled="isSubmitting" class="text-xs text-red-600 hover:text-red-700 font-semibold disabled:opacity-50 cursor-pointer">
                                            <svg class="inline-block w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                            </svg>
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Username/Password Setting -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-3 sm:mb-4">
                                Update Username dan Password
                            </label>

                            <!-- Radio Options -->
                            <div class="flex gap-3 sm:gap-4 mb-4">
                                <!-- Tidak Ubah Option -->
                                <label class="flex items-center gap-2 cursor-pointer"
                                    :class="form.passwordType === 'nochange' ? 'text-red-600 font-semibold' : 'text-gray-900'">
                                    <input type="radio" v-model="form.passwordType" value="nochange"
                                        :disabled="isSubmitting" class="w-4 h-4 text-red-600 cursor-pointer" />
                                    <span class="text-xs sm:text-sm font-medium">Tidak Ubah</span>
                                </label>

                                <!-- Manual Setting Option -->
                                <label class="flex items-center gap-2 cursor-pointer"
                                    :class="form.passwordType === 'manual' ? 'text-red-600 font-semibold' : 'text-gray-900'">
                                    <input type="radio" v-model="form.passwordType" value="manual"
                                        :disabled="isSubmitting" class="w-4 h-4 text-red-600 cursor-pointer" />
                                    <span class="text-xs sm:text-sm font-medium">Manual Setting</span>
                                </label>
                            </div>

                            <!-- Manual Setting - Password Inputs -->
                            <div v-if="form.passwordType === 'manual'" class="space-y-4">
                                <!-- Username Input -->
                                <div>
                                    <label
                                        class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                        Username
                                        <span class="text-red-600 ml-1">*</span>
                                    </label>
                                    <input v-model="form.username" type="text" placeholder="Username unik" required
                                        :disabled="isSubmitting"
                                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                                </div>

                                <!-- Password Input -->
                                <div>
                                    <label
                                        class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                        Password
                                        <span class="text-red-600 ml-1">*</span>
                                    </label>
                                    <div class="relative flex items-center">
                                        <input v-model="form.password" :type="showPassword ? 'text' : 'password'"
                                            placeholder="Minimum 3 karakter" required :disabled="isSubmitting"
                                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 pr-10 sm:pr-12 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                                        <button type="button" @click="showPassword = !showPassword"
                                            :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
                                            :disabled="isSubmitting"
                                            class="absolute right-4 flex items-center justify-center text-gray-600 transition-colors duration-300 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                            <svg v-if="!showPassword" class="h-4 w-4 sm:h-5 sm:w-5"
                                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                            <svg v-else class="h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path
                                                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24">
                                                </path>
                                                <line x1="1" y1="1" x2="23" y2="23"></line>
                                            </svg>
                                        </button>
                                    </div>
                                    <p v-if="form.password && form.password.length < 3"
                                        class="mt-1 text-xs text-red-600 font-medium">
                                        Minimal 3 karakter
                                    </p>
                                </div>

                                <!-- Confirm Password Input -->
                                <div>
                                    <label
                                        class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                        Konfirmasi Password
                                        <span class="text-red-600 ml-1">*</span>
                                    </label>
                                    <div class="relative flex items-center">
                                        <input v-model="form.passwordConfirm"
                                            :type="showPasswordConfirm ? 'text' : 'password'"
                                            placeholder="Ulangi password" required :disabled="isSubmitting"
                                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 pr-10 sm:pr-12 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                                        <button type="button" @click="showPasswordConfirm = !showPasswordConfirm"
                                            :aria-label="showPasswordConfirm ? 'Sembunyikan password' : 'Tampilkan password'"
                                            :disabled="isSubmitting"
                                            class="absolute right-4 flex items-center justify-center text-gray-600 transition-colors duration-300 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                            <svg v-if="!showPasswordConfirm" class="h-4 w-4 sm:h-5 sm:w-5"
                                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                            <svg v-else class="h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path
                                                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24">
                                                </path>
                                                <line x1="1" y1="1" x2="23" y2="23"></line>
                                            </svg>
                                        </button>
                                    </div>
                                    <p v-if="form.passwordConfirm && form.password !== form.passwordConfirm"
                                        class="mt-1 text-xs text-red-600 font-medium">
                                        Password tidak cocok
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Role Selection -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-3 sm:mb-4">
                                Role
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <div v-if="roleLoading" class="flex items-center gap-2 text-gray-600">
                                <div
                                    class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-red-600">
                                </div>
                                <span class="text-xs sm:text-sm">Memuat role...</span>
                            </div>
                            <div v-else-if="Object.keys(rolesBySystem).length === 0"
                                class="text-xs sm:text-sm text-gray-600">
                                Belum ada role yang tersedia
                            </div>
                            <div v-else class="space-y-4">
                                <div v-for="(system, systemName) in rolesBySystem" :key="systemName"
                                    class="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <!-- System Header with Reset Button -->
                                    <div class="flex items-center justify-between mb-3">
                                        <h4 class="text-xs sm:text-sm font-semibold text-gray-900">{{ systemName }}</h4>
                                        <button type="button" @click="resetRoleGroup(systemName)"
                                            :disabled="isSubmitting"
                                            class="px-2 py-1 text-xs font-medium bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                            Reset
                                        </button>
                                    </div>

                                    <!-- Roles Radio Group -->
                                    <div class="space-y-2">
                                        <label v-for="role in system" :key="role.id"
                                            class="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-white transition-colors">
                                            <input type="radio" :value="role.id" :name="`role-${systemName}`"
                                                v-model.number="form.roleIds[systemName]" :disabled="isSubmitting"
                                                class="w-4 h-4 rounded-full border-2 border-gray-300 text-red-600 focus:ring-2 focus:ring-red-500 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" />
                                            <div class="flex-1">
                                                <span class="text-xs sm:text-sm font-medium text-gray-700 block">{{ role.name }}</span>
                                                <span class="text-xs text-gray-500">{{ role.description }}</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Status Dropdown -->
                        <div class="pt-3 sm:pt-4 border-t border-gray-200">
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2">
                                Status
                            </label>
                            <select v-model="form.status" :disabled="isSubmitting"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-[13px] sm:text-[15px] font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                <option value="active">Aktif</option>
                                <option value="inactive">Nonaktif</option>
                                <option value="mutasi">Mutasi</option>
                                <option value="lulus">Lulus</option>
                            </select>
                        </div>

                        <!-- Submit Button -->
                        <div class="flex gap-3 pt-4 sm:pt-6 border-t border-gray-200">
                            <button type="button" @click="closeModal" :disabled="isSubmitting"
                                class="flex-1 px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                Batal
                            </button>
                            <button type="submit" :disabled="isSubmitting"
                                class="flex-1 flex items-center justify-center gap-2 px-4 py-2 sm:py-3 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                <span v-if="isSubmitting"
                                    class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                {{ isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useToastStore } from '~/stores/ToastStore';
import { useAuthGuard } from '~/composables/useAuthGuard';
import { getPesertaDidikById } from '~/services/peserta-didik';
import { getRoleList } from '~/services/user';

const props = defineProps({
    modelValue: Boolean,
    siswaId: Number,
});

const emit = defineEmits<{
    'update:modelValue': [value: boolean];
    success: [];
    error: [];
}>();

const toastStore = useToastStore();
const config = useRuntimeConfig();
const { handle401 } = useAuthGuard();

const isLoading = ref(false);
const isSubmitting = ref(false);
const siswa = ref<any>(null);
const showPassword = ref(false);
const showPasswordConfirm = ref(false);
const roleLoading = ref(false);
const rolesBySystem = ref<Record<string, any[]>>({});
const photoInput = ref<HTMLInputElement | null>(null);
const selectedPhoto = ref<File | null>(null);
const photoPreview = ref<string>('');
const currentPhoto = ref<string>('');

const resetRoleGroup = (systemName: string) => {
    form.value.roleIds[systemName] = null;
};

const form = ref({
    nama: '',
    nis: '',
    jenis_kelamin: '',
    nisn: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    nik: '',
    agama: '',
    alamat: '',
    rt: '',
    rw: '',
    kelurahan: '',
    kecamatan: '',
    kode_pos: '',
    nama_ayah: '',
    nama_ibu: '',
    status: 'active',
    passwordType: 'nochange',
    username: '',
    password: '',
    passwordConfirm: '',
    roleIds: {} as Record<string, number | null>,
});

watch(
    () => props.modelValue,
    async (newVal) => {
        if (newVal && props.siswaId && props.siswaId > 0) {
            await fetchSiswaData();
            await loadRoles();
        }
    }
);

const fetchSiswaData = async () => {
    isLoading.value = true;
    try {
        const response = await getPesertaDidikById(props.siswaId!);
        siswa.value = response.data;

        form.value.nama = siswa.value.nama || '';
        form.value.nis = siswa.value.nis || '';
        form.value.jenis_kelamin = siswa.value.jenis_kelamin || '';
        form.value.nisn = siswa.value.nisn || '';
        form.value.tempat_lahir = siswa.value.tempat_lahir || '';
        form.value.tanggal_lahir = siswa.value.tanggal_lahir ? siswa.value.tanggal_lahir.split('T')[0] : '';
        form.value.nik = siswa.value.nik || '';
        form.value.agama = siswa.value.agama || '';
        form.value.alamat = siswa.value.alamat || '';
        form.value.rt = siswa.value.rt || '';
        form.value.rw = siswa.value.rw || '';
        form.value.kelurahan = siswa.value.kelurahan || '';
        form.value.kecamatan = siswa.value.kecamatan || '';
        form.value.kode_pos = siswa.value.kode_pos || '';
        form.value.nama_ayah = siswa.value.nama_ayah || '';
        form.value.nama_ibu = siswa.value.nama_ibu || '';
        form.value.status = siswa.value.status || 'active';
        form.value.username = siswa.value.username || '';
        
        currentPhoto.value = siswa.value.photo ? String(siswa.value.photo) : '';

        if (siswa.value.roles && siswa.value.roles.length > 0) {
            siswa.value.roles.forEach((role: any) => {
                const systemName = role.system?.nama || 'Tanpa Sistem';
                form.value.roleIds[systemName] = role.id;
            });
        }
    } catch (err: any) {
        console.error('Error fetching siswa data:', err);
        if (err.status === 401 || err.statusCode === 401) {
            await handle401();
            return;
        }
        toastStore.error('Gagal', 'Gagal memuat data siswa');
    } finally {
        isLoading.value = false;
    }
};

const loadRoles = async () => {
    roleLoading.value = true;
    try {
        const response = await getRoleList();
        const roles = response?.data || [];

        const grouped: Record<string, any[]> = {};
        roles.forEach((role: any) => {
            const systemName = role.system?.nama || 'Tanpa Sistem';
            if (!grouped[systemName]) {
                grouped[systemName] = [];
            }
            grouped[systemName].push(role);
        });

        rolesBySystem.value = grouped;

        Object.keys(grouped).forEach(systemName => {
            if (!(systemName in form.value.roleIds)) {
                form.value.roleIds[systemName] = null;
            }
        });
    } catch (err) {
        console.error('Error loading roles:', err);
    } finally {
        roleLoading.value = false;
    }
};

const getErrorMessage = (error: any): string => {
    if (error?.data?.errors) {
        const errors = error.data.errors;
        const errorMessages = Object.values(errors).filter(msg => msg && typeof msg === 'string') as string[];
        if (errorMessages.length > 0) {
            return errorMessages[0];
        }
    }

    if (error?.data?.message) {
        return String(error.data.message);
    }

    if (error?.data?.error) {
        return String(error.data.error);
    }

    if (error?.message) {
        return String(error.message);
    }

    return 'Terjadi kesalahan saat menyimpan';
};

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

const handlePhotoSelect = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (!file) return;
    
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        toastStore.error('Gagal', 'Format file harus JPG atau PNG');
        return;
    }
    
    if (file.size > 1024 * 1024) {
        toastStore.error('Gagal', 'Ukuran file maksimal 1 MB');
        return;
    }
    
    selectedPhoto.value = file;
    photoPreview.value = URL.createObjectURL(file);
};

const triggerPhotoInput = () => {
    if (photoInput.value) {
        photoInput.value.click();
    }
};

const removePhoto = () => {
    selectedPhoto.value = null;
    photoPreview.value = '';
    if (photoInput.value) {
        photoInput.value.value = '';
    }
};

const handleSubmit = async () => {
    if (form.value.passwordType === 'manual') {
        if (!form.value.username.trim()) {
            toastStore.error('Validasi', 'Username harus diisi');
            return;
        }
        if (!form.value.password.trim()) {
            toastStore.error('Validasi', 'Password harus diisi');
            return;
        }
        if (form.value.password.length < 3) {
            toastStore.error('Validasi', 'Password minimal 3 karakter');
            return;
        }
        if (form.value.password !== form.value.passwordConfirm) {
            toastStore.error('Validasi', 'Password tidak cocok');
            return;
        }
    }

    const selectedRoles = Object.values(form.value.roleIds).filter(id => id !== null && id !== undefined);
    if (selectedRoles.length === 0) {
        toastStore.error('Validasi', 'Pilih minimal satu role');
        return;
    }

    isSubmitting.value = true;

    try {
        const formData = new FormData();
        
        formData.append('id', String(props.siswaId));
        formData.append('nama', form.value.nama);
        formData.append('nis', form.value.nis);
        formData.append('jenis_kelamin', form.value.jenis_kelamin);
        formData.append('nisn', form.value.nisn);
        formData.append('tempat_lahir', form.value.tempat_lahir);
        formData.append('tanggal_lahir', form.value.tanggal_lahir);
        formData.append('nik', form.value.nik);
        formData.append('agama', form.value.agama);
        formData.append('alamat', form.value.alamat);
        formData.append('rt', form.value.rt);
        formData.append('rw', form.value.rw);
        formData.append('kelurahan', form.value.kelurahan);
        formData.append('kecamatan', form.value.kecamatan);
        formData.append('kode_pos', form.value.kode_pos);
        formData.append('nama_ayah', form.value.nama_ayah);
        formData.append('nama_ibu', form.value.nama_ibu);
        formData.append('status', form.value.status);
        
        selectedRoles.forEach((roleId) => {
            formData.append('role_ids[]', String(roleId));
        });

        if (form.value.passwordType === 'manual') {
            formData.append('username', form.value.username);
            formData.append('password', form.value.password);
        }
        
        if (selectedPhoto.value) {
            formData.append('photo', selectedPhoto.value);
        }

        const response = await fetch(`${config.public.apiBase}/api/v1/peserta-didik/update-peserta-didik`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
            },
            credentials: 'include',
            body: formData,
        });

        if (response.status === 401) {
            handle401();
            return;
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw errorData;
        }

        const result = await response.json();

        toastStore.success('Sukses', 'Data siswa berhasil diperbarui');
        closeModal();
        emit('success');
    } catch (error: any) {
        console.error('Error:', error);
        
        if (error?.status === 401) {
            handle401();
            return;
        }
        
        const errorMessage = getErrorMessage(error);
        toastStore.error('Gagal', errorMessage);
        emit('error');
    } finally {
        isSubmitting.value = false;
    }
};

const closeModal = () => {
    emit('update:modelValue', false);
    siswa.value = null;
    selectedPhoto.value = null;
    photoPreview.value = '';
    currentPhoto.value = '';
    form.value = {
        nama: '',
        nis: '',
        jenis_kelamin: '',
        nisn: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        nik: '',
        agama: '',
        alamat: '',
        rt: '',
        rw: '',
        kelurahan: '',
        kecamatan: '',
        kode_pos: '',
        nama_ayah: '',
        nama_ibu: '',
        status: 'active',
        passwordType: 'nochange',
        username: '',
        password: '',
        passwordConfirm: '',
        roleIds: {},
    };
};
</script>
