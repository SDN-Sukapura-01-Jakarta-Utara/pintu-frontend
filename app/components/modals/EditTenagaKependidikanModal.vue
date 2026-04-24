<template>
    <!-- Backdrop -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="modelValue" @click.self="closeModal" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"></div>
    </Transition>

    <!-- Modal -->
    <Transition enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4">
        <div v-if="modelValue"
            class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <div
                class="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-2xl w-full max-w-2xl lg:max-w-4xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]">

                <!-- Header with Red Gradient Background -->
                <div
                    class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
                    <!-- Animated gradient blobs -->
                    <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0"></div>

                    <!-- Header Content -->
                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Edit Tenaga Kependidikan</h2>
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

                <!-- Body with padding and scrollbar -->
                <div class="p-4 sm:p-8 relative z-10 overflow-y-auto flex-1">

                    <!-- Form -->
                    <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
                        <!-- Nama Input -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Nama
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <input v-model="form.nama" type="text" placeholder="Nama lengkap tenaga kependidikan" required
                                :disabled="isSubmitting"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>

                        <!-- NIP and NKKI Row -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <!-- NIP Input -->
                            <div>
                                <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                    NIP
                                    <span class="text-red-600 ml-1">*</span>
                                </label>
                                <input v-model="form.nip" type="text" placeholder="Nomor Induk Pegawai"
                                    :disabled="isSubmitting || form.nkki.trim().length > 0"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                            </div>

                            <!-- NKKI Input -->
                            <div>
                                <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                    NKKI
                                </label>
                                <input v-model="form.nkki" type="text" placeholder="Nomor KKI"
                                    :disabled="isSubmitting || form.nip.trim().length > 0"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                            </div>
                        </div>

                        <!-- Username Input with Generate Button -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Username
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <div class="flex gap-2">
                                <input v-model="form.username" type="text" placeholder="Username unik" required
                                    :disabled="isSubmitting"
                                    class="flex-1 rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                                <button type="button" @click="generateUsernameFromNIPOrNKKI" :disabled="isSubmitting || (!form.nip.trim() && !form.nkki.trim())"
                                    :title="(form.nip.trim() || form.nkki.trim()) ? 'Generate username dari NIP/NKKI' : 'Isi NIP atau NKKI terlebih dahulu'"
                                    class="flex-shrink-0 px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 active:bg-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1">
                                    <i class="fa-solid fa-wand-magic-sparkles w-4 h-4"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Kategori Input (disabled, pre-filled) -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Kategori
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <input v-model="form.kategori" type="text" readonly disabled
                                class="w-full rounded-lg border-2 border-gray-300 bg-gray-100 px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>

                        <!-- Jabatan Dropdown -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Jabatan
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <select v-model="form.jabatan" required :disabled="isSubmitting"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                <option value="">Pilih Jabatan</option>
                                <option value="Tenaga Administrasi">Tenaga Administrasi</option>
                                <option value="Tenaga Kebersihan">Tenaga Kebersihan</option>
                                <option value="Tenaga Keamanan">Tenaga Keamanan</option>
                            </select>
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
                            <div v-else-if="Object.keys(rolesBySystem).length === 0" class="text-xs sm:text-sm text-gray-600">
                                Belum ada role yang tersedia
                            </div>
                            <div v-else class="space-y-4">
                                <div v-for="(system, systemName) in rolesBySystem" :key="systemName"
                                    class="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <!-- System Header with Reset Button -->
                                    <div class="flex items-center justify-between mb-3">
                                        <h4 class="text-xs sm:text-sm font-semibold text-gray-900">{{ systemName }}</h4>
                                        <button type="button" @click="form.roleIds[systemName] = null"
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
                                                v-model.number="form.roleIds[systemName]"
                                                :disabled="isSubmitting"
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

                        <!-- Password Update Section -->
                        <div class="border-t border-gray-300 pt-4 sm:pt-6">
                            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Update Password (Opsional)</h3>
                            <p class="text-xs text-gray-600 mb-4">Biarkan kosong jika tidak ingin mengubah password</p>

                            <!-- Password Type Selection -->
                            <div class="space-y-4">
                                <!-- Radio Options -->
                                <div class="flex gap-3 sm:gap-4">
                                    <!-- Generate Otomatis Option -->
                                    <label class="flex items-center gap-2 cursor-pointer"
                                        :class="form.passwordType === 'auto' ? 'text-red-600 font-semibold' : 'text-gray-900'">
                                        <input type="radio" v-model="form.passwordType" value="auto"
                                            :disabled="isSubmitting"
                                            class="w-4 h-4 text-red-600 cursor-pointer" />
                                        <span class="text-xs sm:text-sm font-medium">Generate Otomatis</span>
                                    </label>

                                    <!-- Manual Setting Option -->
                                    <label class="flex items-center gap-2 cursor-pointer"
                                        :class="form.passwordType === 'manual' ? 'text-red-600 font-semibold' : 'text-gray-900'">
                                        <input type="radio" v-model="form.passwordType" value="manual"
                                            :disabled="isSubmitting"
                                            class="w-4 h-4 text-red-600 cursor-pointer" />
                                        <span class="text-xs sm:text-sm font-medium">Manual Setting</span>
                                    </label>

                                    <!-- Reset Button -->
                                    <button type="button" @click="resetPasswordType" :disabled="isSubmitting"
                                        class="ml-auto px-3 py-1.5 rounded-lg bg-gray-200 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                        <i class="fa-solid fa-rotate-left mr-1"></i>Reset
                                    </button>
                                </div>

                                <!-- Generate Otomatis - Password Display -->
                                <div v-if="form.passwordType === 'auto'" class="space-y-3">
                                    <div class="relative flex items-center">
                                        <input :value="autoGeneratedPassword" type="text" readonly
                                            :disabled="isSubmitting"
                                            class="w-full rounded-lg border-2 border-gray-300 bg-gray-50 px-4 py-2 sm:py-3 pr-10 sm:pr-12 text-xs sm:text-sm font-medium text-gray-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed" />
                                        <div class="absolute right-4 flex items-center justify-center text-gray-600">
                                            <i class="fa-solid fa-lock w-4 h-4 sm:w-5 sm:h-5"></i>
                                        </div>
                                    </div>
                                </div>

                                <!-- Manual Setting - Password Inputs -->
                                <div v-if="form.passwordType === 'manual'" class="space-y-4">
                                    <!-- Password Input -->
                                    <div>
                                        <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                            Password Baru
                                            <span class="text-red-600 ml-1">*</span>
                                        </label>
                                        <div class="relative flex items-center">
                                            <input v-model="form.newPassword" :type="showPassword ? 'text' : 'password'"
                                                placeholder="Minimum 6 karakter" :disabled="isSubmitting"
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
                                        <p v-if="form.newPassword && form.newPassword.length < 6" class="mt-1 text-xs text-red-600 font-medium">
                                            Minimal 6 karakter
                                        </p>
                                    </div>

                                    <!-- Confirm Password Input -->
                                    <div>
                                        <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                            Konfirmasi Password
                                            <span class="text-red-600 ml-1">*</span>
                                        </label>
                                        <div class="relative flex items-center">
                                            <input v-model="form.passwordConfirm" :type="showPasswordConfirm ? 'text' : 'password'"
                                                placeholder="Ulangi password" :disabled="isSubmitting"
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
                                        <p v-if="form.newPassword && form.newPassword !== form.passwordConfirm"
                                            class="mt-1 text-xs text-red-600 font-medium">
                                            Password tidak cocok
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Photo Upload Section -->
                        <div class="space-y-4 pt-4 sm:pt-6 border-t border-gray-200">
                            <div>
                                <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-3 sm:mb-4">
                                    Foto Tenaga Kependidikan (Opsional)
                                </label>

                                <!-- Photo Preview -->
                                <div v-if="photoPreview" class="mb-4 relative group w-fit">
                                    <img :src="photoPreview" alt="Preview"
                                        class="h-32 sm:h-40 aspect-[3/4] object-cover rounded-lg border-2 border-gray-200 shadow-md" />
                                    <button type="button" @click="removePhoto" :disabled="isSubmitting"
                                        class="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-100 hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 cursor-pointer">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                clip-rule="evenodd"></path>
                                        </svg>
                                    </button>
                                </div>

                                <!-- Upload Area -->
                                <div @click="$refs.photoInput?.click()" @dragover.prevent="isDraggingPhoto = true"
                                    @dragleave="isDraggingPhoto = false" @drop.prevent="handlePhotoDrop" :class="[
                                        'relative border-2 border-dashed rounded-lg p-4 sm:p-6 text-center cursor-pointer transition-all duration-300',
                                        isDraggingPhoto
                                            ? 'border-blue-500 bg-blue-50 scale-105'
                                            : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
                                    ]">
                                    <input ref="photoInput" type="file" accept="image/*" class="hidden"
                                        @change="handlePhotoSelect" :disabled="isSubmitting" />

                                    <div class="flex flex-col items-center gap-2 sm:gap-3">
                                        <div
                                            class="h-10 sm:h-12 w-10 sm:w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                            <svg class="w-5 sm:w-6 h-5 sm:w-6 text-blue-600" fill="none"
                                                stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M12 4v16m8-8H4"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <p class="text-xs sm:text-sm font-semibold text-gray-900">Klik atau drag foto di sini</p>
                                            <p class="text-xs text-gray-600 mt-1">Format: JPG, PNG, WebP | Rasio: 3x4 | Maks. 1MB</p>
                                        </div>
                                    </div>

                                    <!-- Error Message -->
                                    <div v-if="photoError" class="mt-3 p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p class="text-xs sm:text-sm text-red-700 font-medium">{{ photoError }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- File Upload Section -->
                        <div class="space-y-4 pt-4 sm:pt-6 border-t border-gray-200">
                            <h3 class="text-sm sm:text-base font-semibold text-gray-900">Upload Berkas (Opsional)</h3>
                            <p class="text-xs text-gray-600">Format: PDF | Ukuran Maksimal: 1MB</p>

                            <!-- Single File Upload Fields -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FileUploadField v-for="field in singleFileFields" :key="field.key" :field="field"
                                    :form-value="form[field.key]" :uploaded-file="uploadedFiles[field.key]"
                                    @upload="(file) => handleFileUpload(field.key, file)"
                                    @request-delete="(fieldKey, fileName) => handleRequestDeleteFile(fieldKey, fileName)"
                                    :is-submitting="isSubmitting" :is-uploading="uploadingField === field.key" />
                            </div>

                            <!-- Multiple File Upload Fields -->
                            <div class="space-y-4">
                                <MultiFileUploadField v-for="field in multipleFileFields" :key="field.key"
                                    :field="field" :uploaded-files="uploadedFiles[field.key] || []"
                                    @upload="(files) => handleMultiFileUpload(field.key, files)"
                                    @request-delete="(index, fileName) => handleRequestDeleteFileMulti(field.key, index, fileName)"
                                    @request-delete-all="() => handleRequestDeleteAllMultiFiles(field.key)"
                                    :is-submitting="isSubmitting" :is-uploading="uploadingField === field.key" />
                            </div>
                        </div>

                        <!-- Status Toggle -->
                        <div class="pt-3 sm:pt-4 border-t border-gray-200">
                            <div class="flex items-center justify-between">
                                <label class="text-[13px] sm:text-[15px] font-semibold text-gray-900">Status</label>
                                <button type="button"
                                    @click="form.status = form.status === 'active' ? 'inactive' : 'active'"
                                    :disabled="isSubmitting" :class="[
                                        'relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300',
                                        form.status === 'active' ? 'bg-green-600' : 'bg-gray-300',
                                        isSubmitting && 'opacity-50 cursor-not-allowed'
                                    ]">
                                    <span :class="[
                                        'inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-md',
                                        form.status === 'active' ? 'translate-x-7' : 'translate-x-1'
                                    ]"></span>
                                </button>
                            </div>
                            <div class="mt-2 flex items-center gap-2">
                                <span :class="[
                                    'px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold',
                                    form.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                ]">
                                    {{ form.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                                </span>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <div class="flex gap-3 pt-4 sm:pt-6">
                            <button type="button" @click="closeModal" :disabled="isSubmitting"
                                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                <i class="fa-solid fa-times w-4 h-4"></i>
                                Batal
                            </button>
                            <button type="submit" :disabled="isSubmitting"
                                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 sm:py-3 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                <span v-if="isSubmitting"
                                    class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                <i v-else class="fa-solid fa-floppy-disk w-4 h-4"></i>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useKepegawaianStore } from '~/stores/KepegawaianStore'
import { useToastStore } from '~/stores/ToastStore'
import { getRoleList } from '~/services/user'
import { updateKepegawaianFile, getKepegawaianById } from '~/services/kepegawaian'
import FileUploadField from '~/components/common/FileUploadField.vue'
import MultiFileUploadField from '~/components/common/MultiFileUploadField.vue'

const props = defineProps({
    modelValue: Boolean,
    tenagaKependidikan: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['update:modelValue', 'success', 'error'])

const kepegawaianStore = useKepegawaianStore()
const toastStore = useToastStore()

const isSubmitting = ref(false)
const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const roleLoading = ref(false)
const isDraggingPhoto = ref(false)

const roles = ref<any[]>([])
const photoInput = ref<HTMLInputElement | null>(null)
const photoError = ref<string>('')
const photoPreview = ref<string>('')

const singleFileFields = [
    { key: 'kk', label: 'Kartu Keluarga' },
    { key: 'akta_lahir', label: 'Akta Lahir' },
    { key: 'ktp', label: 'KTP' },
    { key: 'ijazah_sd', label: 'Ijazah SD' },
    { key: 'ijazah_smp', label: 'Ijazah SMP' },
    { key: 'ijazah_sma', label: 'Ijazah SMA' },
    { key: 'ijazah_s1', label: 'Ijazah S1' },
    { key: 'ijazah_s2', label: 'Ijazah S2' },
    { key: 'ijazah_s3', label: 'Ijazah S3' },
    { key: 'sk', label: 'SK' }
]

const multipleFileFields = [
    { key: 'sertifikat_lainnya', label: 'Sertifikat Lainnya' },
    { key: 'dokumen_lainnya', label: 'Dokumen Lainnya' }
]

const uploadedFiles = ref<Record<string, File | null | File[]>>({
    kk: null,
    akta_lahir: null,
    ktp: null,
    ijazah_sd: null,
    ijazah_smp: null,
    ijazah_sma: null,
    ijazah_s1: null,
    ijazah_s2: null,
    ijazah_s3: null,
    sk: null,
    sertifikat_lainnya: [],
    dokumen_lainnya: []
})

const uploadingField = ref<string>('')

const form = ref({
    nama: '',
    nip: '',
    nkki: '',
    username: '',
    newPassword: '',
    passwordConfirm: '',
    passwordType: '' as 'auto' | 'manual' | '',
    kategori: 'Tenaga Kependidikan',
    jabatan: '',
    roleIds: {} as Record<string, number | null>,
    status: 'active'
})

// Computed
const autoGeneratedPassword = computed(() => {
    if (form.value.passwordType === 'auto') {
        return form.value.nip || form.value.nkki || ''
    }
    return ''
})

const rolesBySystem = computed(() => {
    const grouped: Record<string, any[]> = {}
    roles.value.forEach(role => {
        const systemName = role.system?.nama || 'Umum'
        if (!grouped[systemName]) {
            grouped[systemName] = []
        }
        grouped[systemName].push(role)
    })
    // Initialize roleIds for all systems if not already done
    Object.keys(grouped).forEach(system => {
        if (!(system in form.value.roleIds)) {
            form.value.roleIds[system] = null
        }
    })
    return grouped
})

// Methods
const closeModal = () => {
    emit('update:modelValue', false)
}

const resetPasswordType = () => {
    form.value.passwordType = ''
    form.value.newPassword = ''
    form.value.passwordConfirm = ''
    showPassword.value = false
    showPasswordConfirm.value = false
}

const generateUsernameFromNIPOrNKKI = () => {
    if (form.value.nip.trim()) {
        form.value.username = form.value.nip
    } else if (form.value.nkki.trim()) {
        form.value.username = form.value.nkki
    }
}

const handlePhotoSelect = async (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
        const file = target.files[0]
        
        // Validation
        if (!file.type.startsWith('image/')) {
            photoError.value = 'Format file harus gambar (JPG, PNG, WebP)'
            return
        }
        
        if (file.size > 1024 * 1024) {
            photoError.value = 'Ukuran file terlalu besar (maks. 1MB)'
            return
        }
        
        photoError.value = ''
        
        // Show preview
        const reader = new FileReader()
        reader.onload = (e) => {
            photoPreview.value = e.target?.result as string
        }
        reader.readAsDataURL(file)
        
        // Upload photo immediately
        await uploadPhoto(file)
    }
}

const uploadPhoto = async (file: File) => {
    try {
        // Set uploading state
        uploadingField.value = 'foto'

        // Create FormData
        const formData = new FormData()
        formData.append('foto', file)

        // Call API untuk upload file langsung
        const { updateKepegawaianFile } = await import('~/services/kepegawaian')
        const response = await updateKepegawaianFile(props.tenagaKependidikan.id, formData)

        // Check if response successful
        const isSuccess = response?.data && (response.data?.id || response.data?.nama)

        if (isSuccess && response?.data) {
            // Fetch ulang data kepegawaian untuk get foto URL yang ter-update
            try {
                const { getKepegawaianById } = await import('~/services/kepegawaian')
                const latestData = await getKepegawaianById(props.tenagaKependidikan.id)

                const fotoData = latestData.data?.foto

                if (fotoData) {
                    toastStore.showToast('success', 'Tersimpan', `${file.name} berhasil diupload`)
                } else {
                    toastStore.showToast('error', 'Gagal Tersimpan', `Foto gagal disimpan di server. Silakan coba lagi atau hubungi admin.`)
                }
            } catch (fetchErr) {
                toastStore.showToast('error', 'Gagal', 'Tidak bisa verify foto upload')
            }
        } else {
            // Error response dari backend
            const errorMsg = response?.message || response?.error?.message || response?.error || 'Gagal upload foto'
            toastStore.showToast('error', 'Gagal upload', errorMsg)
        }
    } catch (err: any) {
        let message = 'Gagal upload foto'

        if (err.data?.message) {
            message = err.data.message
        } else if (err.data?.errors) {
            const errors = err.data.errors
            const errorMessages = Object.values(errors).filter(msg => msg).join(', ')
            if (errorMessages) {
                message = errorMessages
            }
        } else if (err.message) {
            message = err.message
        }

        toastStore.showToast('error', 'Gagal upload', message)
    } finally {
        uploadingField.value = ''
    }
}

const handlePhotoDrop = (event: DragEvent) => {
    isDraggingPhoto.value = false
    const files = event.dataTransfer?.files
    if (files && files[0]) {
        const input = photoInput.value as HTMLInputElement
        input.files = files
        handlePhotoSelect({ target: input } as any)
    }
}

const removePhoto = () => {
    photoPreview.value = ''
    photoError.value = ''
    if (photoInput.value) {
        photoInput.value.value = ''
    }
}

const handleFileUpload = async (fieldKey: string, file: File) => {
    try {
        // Validation
        if (file.type !== 'application/pdf') {
            toastStore.showToast('error', 'Gagal upload', 'Format file harus PDF')
            return
        }

        if (file.size > 1024 * 1024) {
            toastStore.showToast('error', 'Gagal upload', 'Ukuran file maksimal 1MB')
            return
        }

        // Set uploading state
        uploadingField.value = fieldKey

        // Create FormData dengan key field yang sesuai backend
        const formData = new FormData()
        formData.append(fieldKey, file)

        // Call API untuk upload file langsung
        const response = await updateKepegawaianFile(props.tenagaKependidikan.id, formData)

        // Check if response successful
        const isSuccess = response?.data && (response.data?.id || response.data?.nama)

        if (isSuccess && response?.data) {
            // Fetch ulang data untuk get file URL yang ter-update
            try {
                const latestData = await getKepegawaianById(props.tenagaKependidikan.id)
                const fileData = latestData.data?.[fieldKey]

                // Check if this is a multi-file field
                const isMultiFileField = multipleFileFields.some(f => f.key === fieldKey)

                if (fileData) {
                    if (isMultiFileField && Array.isArray(fileData)) {
                        // For multiple file fields
                        if (!Array.isArray(uploadedFiles.value[fieldKey])) {
                            uploadedFiles.value[fieldKey] = []
                        }
                        uploadedFiles.value[fieldKey] = fileData

                        toastStore.showToast('success', 'Tersimpan', `${file.name} berhasil diupload`)
                    } else if (!isMultiFileField) {
                        // For single file fields
                        uploadedFiles.value[fieldKey] = {
                            url: fileData,
                            name: file.name,
                            saved: true
                        }

                        // Update form value dengan URL
                        form.value[fieldKey as keyof typeof form.value] = fileData

                        toastStore.showToast('success', 'Tersimpan', `${file.name} berhasil diupload`)
                    }
                } else {
                    toastStore.showToast('error', 'Gagal Tersimpan', `File ${fieldKey} gagal disimpan di server. Silakan coba lagi atau hubungi admin.`)
                }
            } catch (fetchErr) {
                toastStore.showToast('error', 'Gagal', 'Tidak bisa verify file upload')
            }
        } else {
            // Error response dari backend
            const errorMsg = response?.message || response?.error?.message || response?.error || 'Gagal upload file'
            toastStore.showToast('error', 'Gagal upload', errorMsg)
        }
    } catch (err: any) {
        let message = 'Gagal upload file'

        if (err.data?.message) {
            message = err.data.message
        } else if (err.data?.errors) {
            const errors = err.data.errors
            const errorMessages = Object.values(errors).filter(msg => msg).join(', ')
            if (errorMessages) {
                message = errorMessages
            }
        } else if (err.message) {
            message = err.message
        }

        toastStore.showToast('error', 'Gagal upload', message)
    } finally {
        uploadingField.value = ''
    }
}

const handleMultiFileUpload = async (fieldKey: string, files: File[]) => {
    try {
        // Validation
        for (const file of files) {
            if (file.type !== 'application/pdf') {
                toastStore.showToast('error', 'Gagal upload', 'Format file harus PDF')
                return
            }

            if (file.size > 1024 * 1024) {
                toastStore.showToast('error', 'Gagal upload', 'Ukuran file maksimal 1MB per file')
                return
            }
        }

        // Set uploading state
        uploadingField.value = fieldKey

        // Create FormData dengan multiple files
        const formData = new FormData()
        files.forEach(file => {
            formData.append(fieldKey, file)
        })

        // Call API untuk upload files
        const response = await updateKepegawaianFile(props.tenagaKependidikan.id, formData)

        const isSuccess = response?.data && (response.data?.id || response.data?.nama)

        if (isSuccess && response?.data) {
            try {
                const latestData = await getKepegawaianById(props.tenagaKependidikan.id)
                const fileData = latestData.data?.[fieldKey]

                if (fileData && Array.isArray(fileData)) {
                    uploadedFiles.value[fieldKey] = fileData
                    toastStore.showToast('success', 'Tersimpan', `${files.length} file berhasil diupload`)
                } else {
                    toastStore.showToast('error', 'Gagal Tersimpan', `Files ${fieldKey} gagal disimpan di server.`)
                }
            } catch (fetchErr) {
                toastStore.showToast('error', 'Gagal', 'Tidak bisa verify file upload')
            }
        } else {
            const errorMsg = response?.message || response?.error?.message || response?.error || 'Gagal upload files'
            toastStore.showToast('error', 'Gagal upload', errorMsg)
        }
    } catch (err: any) {
        let message = 'Gagal upload files'

        if (err.data?.message) {
            message = err.data.message
        } else if (err.message) {
            message = err.message
        }

        toastStore.showToast('error', 'Gagal upload', message)
    } finally {
        uploadingField.value = ''
    }
}

const handleRequestDeleteFile = async (fieldKey: string, fileName: string) => {
    try {
        // Create FormData untuk delete file
        const formData = new FormData()
        formData.append('field_name', fieldKey)

        const response = await updateKepegawaianFile(props.tenagaKependidikan.id, formData)

        if (response?.data) {
            // Fetch ulang data
            const latestData = await getKepegawaianById(props.tenagaKependidikan.id)
            const fileData = latestData.data?.[fieldKey]

            uploadedFiles.value[fieldKey] = fileData || null
            toastStore.showToast('success', 'Berhasil', `File ${fileName} berhasil dihapus`)
        }
    } catch (err: any) {
        toastStore.showToast('error', 'Gagal', 'Tidak bisa delete file')
    }
}

const handleRequestDeleteFileMulti = async (fieldKey: string, index: number, fileName: string) => {
    try {
        // Create FormData untuk delete specific file
        const formData = new FormData()
        formData.append('field_name', fieldKey)
        formData.append('file_index', index.toString())

        const response = await updateKepegawaianFile(props.tenagaKependidikan.id, formData)

        if (response?.data) {
            // Fetch ulang data
            const latestData = await getKepegawaianById(props.tenagaKependidikan.id)
            const fileData = latestData.data?.[fieldKey]

            if (Array.isArray(fileData)) {
                uploadedFiles.value[fieldKey] = fileData
            }
            toastStore.showToast('success', 'Berhasil', `File ${fileName} berhasil dihapus`)
        }
    } catch (err: any) {
        toastStore.showToast('error', 'Gagal', 'Tidak bisa delete file')
    }
}

const handleRequestDeleteAllMultiFiles = async (fieldKey: string) => {
    try {
        // Create FormData untuk delete semua files
        const formData = new FormData()
        formData.append('field_name', fieldKey)
        formData.append('delete_all', 'true')

        const response = await updateKepegawaianFile(props.tenagaKependidikan.id, formData)

        if (response?.data) {
            // Fetch ulang data
            const latestData = await getKepegawaianById(props.tenagaKependidikan.id)
            const fileData = latestData.data?.[fieldKey]

            uploadedFiles.value[fieldKey] = Array.isArray(fileData) ? fileData : []
            toastStore.showToast('success', 'Berhasil', 'Semua file berhasil dihapus')
        }
    } catch (err: any) {
        toastStore.showToast('error', 'Gagal', 'Tidak bisa delete files')
    }
}

const loadRoles = async () => {
    roleLoading.value = true
    try {
        const response = await getRoleList()
        roles.value = response.data || []
    } catch (err) {
        console.error('Error loading roles:', err)
    } finally {
        roleLoading.value = false
    }
}

const loadFormData = () => {
    if (!props.tenagaKependidikan) return

    form.value = {
        nama: props.tenagaKependidikan.nama || '',
        nip: props.tenagaKependidikan.nip || '',
        nkki: props.tenagaKependidikan.nkki || '',
        username: props.tenagaKependidikan.username || '',
        newPassword: '',
        passwordConfirm: '',
        passwordType: '',
        kategori: props.tenagaKependidikan.kategori || 'Tenaga Kependidikan',
        jabatan: props.tenagaKependidikan.jabatan || '',
        roleIds: {},
        status: props.tenagaKependidikan.status || 'active'
    }

    // Load selected roles
    if (props.tenagaKependidikan.roles && Array.isArray(props.tenagaKependidikan.roles)) {
        props.tenagaKependidikan.roles.forEach((role: any) => {
            const systemName = role.system?.nama || 'Umum'
            form.value.roleIds[systemName] = role.id
        })
    }
}

const handleSubmit = async () => {
    // Validation
    if (!form.value.nama.trim()) {
        toastStore.showToast('error', 'Gagal menyimpan', 'Nama harus diisi')
        return
    }

    if (!form.value.nip.trim() && !form.value.nkki.trim()) {
        toastStore.showToast('error', 'Gagal menyimpan', 'NIP atau NKKI harus diisi salah satunya')
        return
    }

    if (!form.value.username.trim()) {
        toastStore.showToast('error', 'Gagal menyimpan', 'Username harus diisi')
        return
    }

    if (!form.value.jabatan) {
        toastStore.showToast('error', 'Gagal menyimpan', 'Jabatan harus dipilih')
        return
    }

    // Validate role
    const selectedRoles = Object.values(form.value.roleIds).filter(role => role !== null && role !== undefined)
    if (selectedRoles.length === 0) {
        toastStore.showToast('error', 'Gagal menyimpan', 'Minimal satu role harus dipilih')
        return
    }

    // Validate password if changing it
    if (form.value.newPassword.trim()) {
        if (form.value.passwordType === 'manual') {
            if (form.value.newPassword.length < 6) {
                toastStore.showToast('error', 'Gagal menyimpan', 'Password minimal 6 karakter')
                return
            }
            if (form.value.newPassword !== form.value.passwordConfirm) {
                toastStore.showToast('error', 'Gagal menyimpan', 'Password tidak cocok')
                return
            }
        }
    }

    isSubmitting.value = true

    try {
        const payload: any = {
            nama: form.value.nama,
            username: form.value.username,
            nip: form.value.nip || undefined,
            nkki: form.value.nkki || undefined,
            kategori: form.value.kategori,
            jabatan: form.value.jabatan,
            role_ids: Object.values(form.value.roleIds).filter(role => role !== null && role !== undefined) as number[],
            status: form.value.status
        }

        // Add password if changing it
        if (form.value.newPassword.trim()) {
            payload.password = form.value.passwordType === 'auto' ? autoGeneratedPassword.value : form.value.newPassword
        }

        const result = await kepegawaianStore.updateKepegawaian(props.tenagaKependidikan.id, payload)

        if (result.success) {
            toastStore.showToast('success', 'Berhasil', result.message)
            emit('success')
            closeModal()
        } else {
            toastStore.showToast('error', 'Gagal menyimpan', result.message)
            emit('error')
        }
    } catch (err: any) {
        let message = 'Terjadi kesalahan saat menyimpan data'

        if (err.data?.message) {
            message = err.data.message
        } else if (err.data?.errors) {
            const errors = err.data.errors
            const errorMessages = Object.values(errors).filter(msg => msg).join(', ')
            if (errorMessages) {
                message = errorMessages
            }
        } else if (err.message) {
            message = err.message
        }

        toastStore.showToast('error', 'Gagal menyimpan', message)
        emit('error')
    } finally {
        isSubmitting.value = false
    }
}

onMounted(() => {
    loadRoles()
    if (props.modelValue && props.tenagaKependidikan) {
        loadFormData()
    }
})

watch(() => props.modelValue, (newVal) => {
    if (newVal) {
        loadRoles()
        loadFormData()
    }
})

watch(() => props.tenagaKependidikan, () => {
    if (props.modelValue) {
        loadFormData()
    }
})
</script>
