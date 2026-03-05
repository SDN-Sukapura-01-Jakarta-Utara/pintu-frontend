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
                class="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-2xl w-full max-w-2xl lg:max-w-4xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]">

                <!-- Header with Red Gradient Background -->
                <div
                    class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
                    <!-- Animated gradient blobs -->
                    <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0"></div>

                    <!-- Header Content -->
                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Edit Pendidik</h2>
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
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                                Nama
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <input v-model="form.nama" type="text" placeholder="Nama lengkap pendidik" required
                                :disabled="isSubmitting"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>

                        <!-- NIP and NKKI Row -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <!-- NIP Input -->
                            <div>
                                <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                                    NIP
                                    <span class="text-red-600 ml-1">*</span>
                                </label>
                                <input v-model="form.nip" type="text" placeholder="Nomor Induk Pegawai"
                                    :disabled="isSubmitting || form.nkki.trim().length > 0"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                            </div>

                            <!-- NKKI Input -->
                            <div>
                                <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                                    NKKI
                                </label>
                                <input v-model="form.nkki" type="text" placeholder="Nomor KKI"
                                    :disabled="isSubmitting || form.nip.trim().length > 0"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                            </div>
                        </div>

                        <!-- Username Input -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                                Username
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <input v-model="form.username" type="text" placeholder="Username unik" required
                                :disabled="isSubmitting"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>

                        <!-- Kategori Input (disabled, pre-filled) -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                                Kategori
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <input v-model="form.kategori" type="text" readonly disabled
                                class="w-full rounded-lg border-2 border-gray-300 bg-gray-100 px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>

                        <!-- Jabatan Dropdown -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                                Jabatan
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <select v-model="form.jabatan" required :disabled="isSubmitting"
                                @change="handleJabatanChange"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                <option value="">Pilih Jabatan</option>
                                <option value="Guru Kelas">Guru Kelas</option>
                                <option value="Guru Bidang Studi">Guru Bidang Studi</option>
                                <option value="Guru Kelas dan Guru Bidang Studi">Guru Kelas dan Guru Bidang Studi
                                </option>
                            </select>
                        </div>

                        <!-- Conditional Fields Based on Jabatan -->

                        <!-- Guru Kelas: Rombel Wali Kelas -->
                        <div
                            v-if="form.jabatan === 'Guru Kelas' || form.jabatan === 'Guru Kelas dan Guru Bidang Studi'">
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                                Rombel yang Diampu sebagai Wali Kelas
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <select v-model.number="form.rombelGuruKelasId" :disabled="isSubmitting || rombelLoading"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                <option :value="null">Pilih Rombel</option>
                                <option v-for="rombel in activeRombels" :key="rombel.id" :value="rombel.id">
                                    {{ rombel.name }}
                                </option>
                            </select>
                        </div>

                        <!-- Guru Bidang Studi: Bidang Studi -->
                        <div
                            v-if="form.jabatan === 'Guru Bidang Studi' || form.jabatan === 'Guru Kelas dan Guru Bidang Studi'">
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                                Bidang Studi
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <select v-model.number="form.bidangStudiId" :disabled="isSubmitting || bidangStudiLoading"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                <option :value="null">Pilih Bidang Studi</option>
                                <option v-for="bidangStudi in activeBidangStudis" :key="bidangStudi.id"
                                    :value="bidangStudi.id">
                                    {{ bidangStudi.nama }}
                                </option>
                            </select>
                        </div>

                        <!-- Guru Bidang Studi: Rombel yang Diampu -->
                        <div
                            v-if="form.jabatan === 'Guru Bidang Studi' || form.jabatan === 'Guru Kelas dan Guru Bidang Studi'">
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                                Rombel yang Diampu sebagai Guru Bidang Studi
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <label v-for="rombel in activeRombels" :key="rombel.id"
                                    class="flex items-center gap-3 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input type="checkbox" :value="rombel.id" v-model.number="form.rombelBidangStudi"
                                        :disabled="isSubmitting" class="w-4 h-4 text-red-600 rounded cursor-pointer" />
                                    <span class="text-xs sm:text-sm font-medium text-gray-900">{{ rombel.name }}</span>
                                </label>
                            </div>
                        </div>

                        <!-- Role Selection -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-3 sm:mb-4">
                                Role
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <div v-if="isLoadingRoles" class="flex items-center gap-2 text-gray-600">
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
                                <div v-for="(system, systemId) in rolesBySystem" :key="systemId"
                                    class="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <!-- System Header with Reset Button -->
                                    <div class="flex items-center justify-between mb-3">
                                        <h4 class="text-xs sm:text-sm font-semibold text-gray-900">{{
                                            getSystemNameById(Number(systemId)) }}</h4>
                                        <button type="button" @click="resetRoleGroup(Number(systemId))"
                                            :disabled="isSubmitting"
                                            class="px-2 py-1 text-xs font-medium bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                            Reset
                                        </button>
                                    </div>

                                    <!-- Roles Radio Group -->
                                    <div class="space-y-2">
                                        <label v-for="role in system" :key="role.id" :class="[
                                            'flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg transition-colors duration-200',
                                            role.status === 'inactive' ? 'bg-gray-100 opacity-75' : 'hover:bg-gray-100'
                                        ]">
                                            <input type="radio" :value="role.id" :name="`role-system-${systemId}`"
                                                v-model.number="form.roleIds[Number(systemId)]"
                                                :disabled="isSubmitting || role.status === 'inactive'"
                                                class="w-4 h-4 rounded-full border-2 border-gray-300 text-red-600 focus:ring-2 focus:ring-red-500 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" />
                                            <div class="flex-1">
                                                <div class="flex items-center gap-2">
                                                    <span class="text-xs sm:text-sm font-medium text-gray-700 block">{{
                                                        role.name }}</span>
                                                    <span v-if="role.status === 'inactive'"
                                                        class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-800">
                                                        Nonaktif
                                                    </span>
                                                </div>
                                                <span class="text-xs text-gray-500">{{ role.description }}</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Reset Password Section -->
                        <div class="space-y-4 pt-4 sm:pt-6 border-t border-gray-200">
                            <div>
                                <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-3 sm:mb-4">
                                    Reset Password
                                </label>

                                <!-- Radio Options -->
                                <div class="flex gap-3 sm:gap-4 mb-4">
                                    <!-- Generate Otomatis Option -->
                                    <label class="flex items-center gap-2 cursor-pointer"
                                        :class="form.passwordType === 'auto' ? 'text-red-600 font-semibold' : 'text-gray-900'">
                                        <input type="radio" v-model="form.passwordType" value="auto"
                                            :disabled="isSubmitting" class="w-4 h-4 text-red-600 cursor-pointer" />
                                        <span class="text-xs sm:text-sm font-medium">Generate Otomatis</span>
                                    </label>

                                    <!-- Manual Setting Option -->
                                    <label class="flex items-center gap-2 cursor-pointer"
                                        :class="form.passwordType === 'manual' ? 'text-red-600 font-semibold' : 'text-gray-900'">
                                        <input type="radio" v-model="form.passwordType" value="manual"
                                            :disabled="isSubmitting" class="w-4 h-4 text-red-600 cursor-pointer" />
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
                                    <p v-if="!autoGeneratedPassword" class="text-xs text-amber-600">
                                        Masukkan NIP terlebih dahulu untuk generate password otomatis
                                    </p>
                                </div>

                                <!-- Manual Setting - Password Inputs -->
                                <div v-if="form.passwordType === 'manual'" class="space-y-4">
                                    <!-- Password Input -->
                                    <div>
                                        <label
                                            class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
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
                                                <svg v-else class="h-4 w-4 sm:h-5 sm:w-5"
                                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" stroke-width="2">
                                                    <path
                                                        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24">
                                                    </path>
                                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                                </svg>
                                            </button>
                                        </div>
                                        <p v-if="form.newPassword && form.newPassword.length < 6"
                                            class="mt-1 text-xs text-red-600 font-medium">
                                            Minimal 6 karakter
                                        </p>
                                    </div>

                                    <!-- Confirm Password Input -->
                                    <div>
                                        <label
                                            class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                                            Konfirmasi Password
                                            <span class="text-red-600 ml-1">*</span>
                                        </label>
                                        <div class="relative flex items-center">
                                            <input v-model="form.passwordConfirm"
                                                :type="showPasswordConfirm ? 'text' : 'password'"
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
                                                <svg v-else class="h-4 w-4 sm:h-5 sm:w-5"
                                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" stroke-width="2">
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

                        <!-- File Upload Section -->
                        <div class="space-y-4 pt-4 sm:pt-6 border-t border-gray-200">
                            <h3 class="text-sm sm:text-base font-semibold text-gray-900">Upload Berkas (Opsional)</h3>
                            <p class="text-xs text-gray-600">Format: PDF | Ukuran Maksimal: 1MB</p>

                            <!-- File Upload Fields -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FileUploadField v-for="field in singleFileFields" :key="field.key" :field="field"
                                    :form-value="form[field.key]" :uploaded-file="uploadedFiles[field.key]"
                                    @upload="(file) => handleFileUpload(field.key, file)" @remove="handleFileRemove"
                                    :is-submitting="isSubmitting" :is-uploading="uploadingField === field.key" />
                            </div>

                            <!-- Multiple File Upload Fields -->
                            <div class="space-y-4">
                                <MultiFileUploadField v-for="field in multipleFileFields" :key="field.key"
                                    :field="field" :uploaded-files="uploadedFiles[field.key] || []"
                                    @upload="(file) => handleFileUpload(field.key, file)" 
                                    @remove="(fieldKey, index) => handleFileRemoveMulti(fieldKey, index)"
                                    @removeAll="(fieldKey) => handleFileRemoveAllMulti(fieldKey)"
                                    :is-submitting="isSubmitting" :is-uploading="uploadingField === field.key" />
                            </div>
                        </div>

                        <!-- Status Toggle -->
                        <div class="pt-3 sm:pt-4 border-t border-gray-200">
                            <div class="flex items-center justify-between">
                                <label class="text-xs sm:text-sm font-semibold text-gray-900">Status</label>
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
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useKepegawaianStore } from '~/stores/KepegawaianStore'
import { useToastStore } from '~/stores/ToastStore'
import { getRombelList } from '~/services/rombel'
import { getBidangStudiList } from '~/services/bidang-studi'
import { getRoleList } from '~/services/user'
import { updateKepegawaianFile } from '~/services/kepegawaian'
import FileUploadField from '~/components/common/FileUploadField.vue'
import MultiFileUploadField from '~/components/common/MultiFileUploadField.vue'

interface Props {
    modelValue: boolean
    pendidik?: any
}

const props = withDefaults(defineProps<Props>(), {
    pendidik: null
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    success: []
    error: []
}>()

const toastStore = useToastStore()
const kepegawaianStore = useKepegawaianStore()

const isSubmitting = ref(false)
const rombels = ref<any[]>([])
const rombelLoading = ref(false)
const bidangStudis = ref<any[]>([])
const bidangStudiLoading = ref(false)
const roles = ref<any[]>([])
const isLoadingRoles = ref(false)
const selectedRoleIds = ref<Set<number>>(new Set())
const uploadingField = ref<string | null>(null)
const showPassword = ref(false)
const showPasswordConfirm = ref(false)

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
    { key: 'sertifikat_pendidik', label: 'Sertifikat Pendidik' },
    { key: 'sk', label: 'SK' }
]

const multipleFileFields = [
    { key: 'sertifikat_lainnya', label: 'Sertifikat Lainnya' },
    { key: 'dokumen_lainnya', label: 'Dokumen Lainnya' }
]

const form = ref({
    nama: '',
    nip: '',
    nkki: '',
    username: '',
    kategori: 'Pendidik',
    jabatan: '',
    rombelGuruKelasId: null as number | null,
    rombelBidangStudi: [] as number[],
    bidangStudiId: null as number | null,
    roleIds: {} as Record<number, number | null>,
    passwordType: '' as 'auto' | 'manual' | '',
    newPassword: '',
    passwordConfirm: '',
    status: 'active' as 'active' | 'inactive',
    kk: null,
    akta_lahir: null,
    ktp: null,
    ijazah_sd: null,
    ijazah_smp: null,
    ijazah_sma: null,
    ijazah_s1: null,
    ijazah_s2: null,
    ijazah_s3: null,
    sertifikat_pendidik: null,
    sertifikat_lainnya: [] as any[],
    sk: null,
    dokumen_lainnya: [] as any[]
})

const uploadedFiles = ref<Record<string, any>>({})

// Computed
const activeRombels = computed(() => rombels.value.filter(r => r.status === 'active'))
const activeBidangStudis = computed(() => bidangStudis.value.filter(b => b.status === 'active'))

const autoGeneratedPassword = computed(() => {
    if (form.value.passwordType === 'auto') {
        return form.value.nip || ''
    }
    return ''
})

const rolesBySystem = computed(() => {
    const grouped: Record<number, any[]> = {}
    roles.value.forEach(role => {
        const systemId = role.system_id
        // Show role if: 1. Role is active, OR 2. Role is inactive BUT currently selected
        const isCurrentlySelected = selectedRoleIds.value.has(role.id)
        if (role.status === 'active' || isCurrentlySelected) {
            if (!grouped[systemId]) {
                grouped[systemId] = []
            }
            grouped[systemId].push(role)
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

const getSystemNameById = (systemId: number): string => {
    const roleWithSystem = roles.value.find(r => r.system_id === systemId)
    if (roleWithSystem && roleWithSystem.system) {
        return roleWithSystem.system.nama
    }
    return `System ${systemId}`
}

const resetRoleGroup = (systemId: number) => {
    form.value.roleIds[systemId] = null
}

const handleJabatanChange = () => {
    form.value.rombelGuruKelasId = null
    form.value.rombelBidangStudi = []
    form.value.bidangStudiId = null
}

const loadRombels = async () => {
    rombelLoading.value = true
    try {
        const response = await getRombelList(1, 100, {})
        rombels.value = response.data || []
    } catch (err) {
        console.error('Error loading rombels:', err)
    } finally {
        rombelLoading.value = false
    }
}

const loadBidangStudis = async () => {
    bidangStudiLoading.value = true
    try {
        const response = await getBidangStudiList(1, 100, {})
        bidangStudis.value = response.data || []
    } catch (err) {
        console.error('Error loading bidang studi:', err)
    } finally {
        bidangStudiLoading.value = false
    }
}

const loadRoles = async () => {
    isLoadingRoles.value = true
    try {
        const response = await getRoleList()
        roles.value = response.data || []
    } catch (err) {
        console.error('Error loading roles:', err)
    } finally {
        isLoadingRoles.value = false
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

        // Create FormData dengan key field yang sesuai backend (kk, ktp, ijazah_sd, dll)
        const formData = new FormData()
        formData.append(fieldKey, file)  // Key: fieldKey (e.g., 'kk', 'ijazah_sd')

        console.log(`Starting upload for ${fieldKey}, pendidik id: ${props.pendidik.id}`)

        // Call API untuk upload file langsung
        const response = await updateKepegawaianFile(props.pendidik.id, formData)
        console.log(`Upload response:`, response)

        // Check if response successful
        // Backend return full kepegawaian object in response.data
        const isSuccess = response?.data && (response.data?.id || response.data?.nama)
        
        if (isSuccess && response?.data) {
            // Fetch ulang data kepegawaian untuk get file URL yang ter-update
            // Ini lebih reliable daripada expect backend return file URL langsung
            try {
                console.log(`[UPLOAD] File upload success, fetching latest data...`)
                const { getKepegawaianById } = await import('~/services/kepegawaian')
                const latestData = await getKepegawaianById(props.pendidik.id)
                
                console.log(`[UPLOAD] Full response dari getKepegawaianById:`, {
                    hasData: !!latestData.data,
                    dataId: latestData.data?.id,
                    allFields: latestData.data ? Object.keys(latestData.data) : []
                })
                
                const fileUrl = latestData.data?.[fieldKey]
                
                console.log(`[UPLOAD] Latest data for '${fieldKey}':`, {
                    fileUrl,
                    fieldValue: fileUrl,
                    fieldType: typeof fileUrl,
                    responseData: {
                        kk: latestData.data?.kk,
                        akta_lahir: latestData.data?.akta_lahir,
                        ktp: latestData.data?.ktp,
                        ijazah_s1: latestData.data?.ijazah_s1
                    }
                })

                if (fileUrl) {
                    // Update uploadedFiles dengan data yang berhasil
                    uploadedFiles.value[fieldKey] = {
                        url: fileUrl,
                        name: file.name,
                        saved: true
                    }

                    // Update form value dengan URL
                    form.value[fieldKey as keyof typeof form.value] = fileUrl

                    toastStore.showToast('success', 'Tersimpan', `${file.name} berhasil diupload`)
                    console.log(`✓ File ${fieldKey} uploaded and saved successfully with URL: ${fileUrl}`)
                } else {
                    console.warn(`File URL untuk '${fieldKey}' masih null setelah fetch`)
                    console.warn(`Debug info:`, {
                        fieldKey,
                        uploadedFieldValue: latestData.data?.[fieldKey],
                        allFileFields: {
                            kk: latestData.data?.kk,
                            akta_lahir: latestData.data?.akta_lahir,
                            ktp: latestData.data?.ktp,
                            ijazah_sd: latestData.data?.ijazah_sd,
                            ijazah_s1: latestData.data?.ijazah_s1,
                            ijazah_s2: latestData.data?.ijazah_s2,
                            ijazah_s3: latestData.data?.ijazah_s3,
                            sertifikat_pendidik: latestData.data?.sertifikat_pendidik,
                            sk: latestData.data?.sk,
                        }
                    })
                    toastStore.showToast('error', 'Gagal Tersimpan', `File ${fieldKey} gagal disimpan di server. Silakan coba lagi atau hubungi admin.`)
                }
            } catch (fetchErr) {
                console.error('Error fetching latest kepegawaian data:', fetchErr)
                toastStore.showToast('error', 'Gagal', 'Tidak bisa verify file upload')
            }
        } else {
            // Error response dari backend
            const errorMsg = response?.message || response?.error?.message || response?.error || 'Gagal upload file'
            toastStore.showToast('error', 'Gagal upload', errorMsg)
            console.error('Upload failed:', { 
                response, 
                errorMsg,
                hasData: !!response?.data,
                hasSuccess: response?.success,
                hasError: response?.error
            })
        }
    } catch (err: any) {
        console.error('File upload error:', err)
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
        console.error('Upload error details:', { message, error: err })
    } finally {
        // Clear uploading state
        uploadingField.value = null
        console.log(`Upload process complete for ${fieldKey}`)
    }
}

const handleFileRemove = (fieldKey: string) => {
    // Delete single file from backend
    isSubmitting.value = true
    
    try {
        const payload: Record<string, any> = {
            id: props.pendidik.id,
            files_to_delete: [fieldKey]
        }
        
        // Call API delete
        kepegawaianStore.updateKepegawaian(props.pendidik.id, payload).then((result) => {
            if (result.success) {
                // Clear from UI
                uploadedFiles.value[fieldKey] = null
                form.value[fieldKey as keyof typeof form.value] = null
                toastStore.showToast('success', 'Berhasil', `File ${fieldKey} berhasil dihapus`)
                console.log(`File ${fieldKey} deleted successfully`)
            } else {
                toastStore.showToast('error', 'Gagal', `Gagal menghapus file ${fieldKey}`)
            }
        }).catch((err) => {
            console.error('Error deleting file:', err)
            toastStore.showToast('error', 'Gagal', 'Gagal menghapus file')
        }).finally(() => {
            isSubmitting.value = false
        })
    } catch (err) {
        console.error('Error in handleFileRemove:', err)
        isSubmitting.value = false
    }
}

const handleFileRemoveMulti = (fieldKey: string, index: number) => {
    // Delete single file dari multi-file array
    const fileName = uploadedFiles.value[fieldKey]?.[index]?.name || ''
    
    isSubmitting.value = true
    
    try {
        const toDeleteKey = `${fieldKey}_to_delete`
        const payload: Record<string, any> = {
            id: props.pendidik.id,
            [toDeleteKey]: [fileName]
        }
        
        kepegawaianStore.updateKepegawaian(props.pendidik.id, payload).then((result) => {
            if (result.success) {
                // Remove dari array
                if (uploadedFiles.value[fieldKey]) {
                    uploadedFiles.value[fieldKey].splice(index, 1)
                }
                toastStore.showToast('success', 'Berhasil', `File ${fileName} berhasil dihapus`)
                console.log(`File ${fileName} deleted successfully`)
            } else {
                toastStore.showToast('error', 'Gagal', `Gagal menghapus file ${fileName}`)
            }
        }).catch((err) => {
            console.error('Error deleting file:', err)
            toastStore.showToast('error', 'Gagal', 'Gagal menghapus file')
        }).finally(() => {
            isSubmitting.value = false
        })
    } catch (err) {
        console.error('Error in handleFileRemoveMulti:', err)
        isSubmitting.value = false
    }
}

const handleFileRemoveAllMulti = (fieldKey: string) => {
    // Delete semua files dari multi-file array
    const totalFiles = uploadedFiles.value[fieldKey]?.length || 0
    
    if (totalFiles === 0) {
        toastStore.showToast('warning', 'Perhatian', 'Tidak ada file untuk dihapus')
        return
    }
    
    isSubmitting.value = true
    
    try {
        const fileNames = uploadedFiles.value[fieldKey].map((f: any) => f.name)
        const toDeleteKey = `${fieldKey}_to_delete`
        const payload: Record<string, any> = {
            id: props.pendidik.id,
            [toDeleteKey]: fileNames
        }
        
        kepegawaianStore.updateKepegawaian(props.pendidik.id, payload).then((result) => {
            if (result.success) {
                // Clear array
                uploadedFiles.value[fieldKey] = []
                toastStore.showToast('success', 'Berhasil', `Semua ${totalFiles} file berhasil dihapus`)
                console.log(`All files in ${fieldKey} deleted successfully`)
            } else {
                toastStore.showToast('error', 'Gagal', `Gagal menghapus file di ${fieldKey}`)
            }
        }).catch((err) => {
            console.error('Error deleting all files:', err)
            toastStore.showToast('error', 'Gagal', 'Gagal menghapus file')
        }).finally(() => {
            isSubmitting.value = false
        })
    } catch (err) {
        console.error('Error in handleFileRemoveAllMulti:', err)
        isSubmitting.value = false
    }
}

const handleSubmit = async () => {
    if (!form.value.nama.trim()) {
        toastStore.showToast('error', 'Gagal menyimpan', 'Nama harus diisi')
        return
    }

    if (!form.value.nip.trim()) {
        toastStore.showToast('error', 'Gagal menyimpan', 'NIP harus diisi')
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

    const selectedRoles = Object.values(form.value.roleIds).filter(role => role !== null && role !== undefined)
    if (selectedRoles.length === 0) {
        toastStore.showToast('error', 'Gagal menyimpan', 'Minimal satu role harus dipilih')
        return
    }

    if (form.value.jabatan === 'Guru Kelas' || form.value.jabatan === 'Guru Kelas dan Guru Bidang Studi') {
        if (!form.value.rombelGuruKelasId) {
            toastStore.showToast('error', 'Gagal menyimpan', 'Pilih rombel untuk wali kelas')
            return
        }
    }

    if (form.value.jabatan === 'Guru Bidang Studi' || form.value.jabatan === 'Guru Kelas dan Guru Bidang Studi') {
        if (!form.value.bidangStudiId) {
            toastStore.showToast('error', 'Gagal menyimpan', 'Pilih bidang studi')
            return
        }
        if (form.value.rombelBidangStudi.length === 0) {
            toastStore.showToast('error', 'Gagal menyimpan', 'Pilih minimal satu rombel untuk guru bidang studi')
            return
        }
    }

    if (form.value.passwordType === 'manual') {
        if (!form.value.newPassword.trim()) {
            toastStore.showToast('error', 'Gagal menyimpan', 'Password harus diisi')
            return
        }
        if (form.value.newPassword.length < 6) {
            toastStore.showToast('error', 'Gagal menyimpan', 'Password minimal 6 karakter')
            return
        }
        if (form.value.newPassword !== form.value.passwordConfirm) {
            toastStore.showToast('error', 'Gagal menyimpan', 'Password tidak cocok')
            return
        }
    }

    isSubmitting.value = true

    try {
        const payload: Record<string, any> = {
            nama: form.value.nama,
            username: form.value.username,
            nip: form.value.nip,
            kategori: form.value.kategori,
            jabatan: form.value.jabatan,
            role_ids: Object.values(form.value.roleIds).filter(role => role !== null && role !== undefined) as number[],
            status: form.value.status
        }

        if (form.value.nkki.trim()) {
            payload.nkki = form.value.nkki
        }

        if (form.value.rombelGuruKelasId) {
            payload.rombel_guru_kelas_id = form.value.rombelGuruKelasId
        }

        if (form.value.rombelBidangStudi.length > 0) {
            payload.rombel_bidang_studi = form.value.rombelBidangStudi
        }

        if (form.value.bidangStudiId) {
            payload.bidang_studi_id = form.value.bidangStudiId
        }

        if (form.value.passwordType === 'auto') {
            payload.password = autoGeneratedPassword.value
        } else if (form.value.passwordType === 'manual') {
            payload.password = form.value.newPassword
        }

        const result = await kepegawaianStore.updateKepegawaian(props.pendidik.id, payload)

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

const initializeForm = async () => {
    if (props.pendidik) {
        // Track selected role IDs and build roleIds map by system
        selectedRoleIds.value = new Set()
        const roleIdsBySystem: Record<number, number | null> = {}

        if (props.pendidik.roles && Array.isArray(props.pendidik.roles)) {
            props.pendidik.roles.forEach((role: any) => {
                selectedRoleIds.value.add(role.id)
                const systemId = role.system_id
                // For each system, take the first role (or last if there are multiple)
                if (roleIdsBySystem[systemId] === undefined) {
                    roleIdsBySystem[systemId] = role.id
                }
            })
        }

        // Wait for next tick to ensure roles are rendered
        await nextTick()

        form.value = {
            nama: props.pendidik.nama || '',
            nip: props.pendidik.nip || '',
            nkki: props.pendidik.nkki || '',
            username: props.pendidik.username || '',
            kategori: props.pendidik.kategori || 'Pendidik',
            jabatan: props.pendidik.jabatan || '',
            rombelGuruKelasId: props.pendidik.rombel_guru_kelas_id || null,
            rombelBidangStudi: props.pendidik.rombel_bidang_studi || [],
            bidangStudiId: props.pendidik.bidang_studi_id || null,
            roleIds: roleIdsBySystem,
            passwordType: '',
            newPassword: '',
            passwordConfirm: '',
            status: props.pendidik.status || 'active',
            kk: props.pendidik.kk || null,
            akta_lahir: props.pendidik.akta_lahir || null,
            ktp: props.pendidik.ktp || null,
            ijazah_sd: props.pendidik.ijazah_sd || null,
            ijazah_smp: props.pendidik.ijazah_smp || null,
            ijazah_sma: props.pendidik.ijazah_sma || null,
            ijazah_s1: props.pendidik.ijazah_s1 || null,
            ijazah_s2: props.pendidik.ijazah_s2 || null,
            ijazah_s3: props.pendidik.ijazah_s3 || null,
            sertifikat_pendidik: props.pendidik.sertifikat_pendidik || null,
            sertifikat_lainnya: [],
            sk: props.pendidik.sk || null,
            dokumen_lainnya: []
        }

        uploadedFiles.value = {}
        singleFileFields.forEach(field => {
            if (props.pendidik[field.key]) {
                uploadedFiles.value[field.key] = {
                    url: props.pendidik[field.key],
                    name: `${field.label}.pdf`,
                    saved: true
                }
            }
        })
    }
}

onMounted(() => {
    loadRombels()
    loadBidangStudis()
    loadRoles()
})

watch(
    () => [props.pendidik?.id, props.modelValue],
    async ([pendidikId, isOpen]) => {
        if (pendidikId && isOpen) {
            // Load all data first before initializing form
            await Promise.all([
                loadRombels(),
                loadBidangStudis(),
                loadRoles()
            ])
            // Then initialize form with loaded data
            await initializeForm()
            await nextTick()
        } else if (!isOpen) {
            // Reset when modal closes
            selectedRoleIds.value = new Set()
        }
    },
    { immediate: false }
)
</script>
