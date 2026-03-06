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
                class="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-2xl w-full max-w-2xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]">

                <!-- Header with Red Gradient Background -->
                <div
                    class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
                    <!-- Animated gradient blobs -->
                    <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0"></div>

                    <!-- Header Content -->
                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Tambah Pendidik</h2>
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
                            <input v-model="form.nama" type="text" placeholder="Nama lengkap pendidik" required
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
                                    :disabled="isSubmitting || (form.nkki.trim().length > 0)"
                                    @input="handleNipChange"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                            </div>

                            <!-- NKKI Input -->
                            <div>
                                <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                    NKKI
                                    <span class="text-red-600 ml-1">*</span>
                                </label>
                                <input v-model="form.nkki" type="text" placeholder="Nomor KKI"
                                    :disabled="isSubmitting || (form.nip.trim().length > 0)"
                                    @input="handleNkkiChange"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                            </div>
                        </div>

                        <!-- Username Input -->
                        <div>
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Username
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <input v-model="form.username" type="text" placeholder="Username unik" required
                                :disabled="isSubmitting"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>

                        <!-- Password Type Selection -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-3 sm:mb-4">
                                Setting Password
                                <span class="text-red-600 ml-1">*</span>
                            </label>

                            <!-- Radio Options -->
                            <div class="flex gap-3 sm:gap-4 mb-4">
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
                                    Masukkan NIP atau NKKI terlebih dahulu untuk generate password otomatis
                                </p>
                            </div>

                            <!-- Manual Setting - Password Inputs -->
                            <div v-if="form.passwordType === 'manual'" class="space-y-4">
                                <!-- Password Input -->
                                <div>
                                    <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                        Password
                                        <span class="text-red-600 ml-1">*</span>
                                    </label>
                                    <div class="relative flex items-center">
                                        <input v-model="form.password" :type="showPassword ? 'text' : 'password'"
                                            placeholder="Minimum 6 karakter" required :disabled="isSubmitting"
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
                                    <p v-if="form.password && form.password.length < 6" class="mt-1 text-xs text-red-600 font-medium">
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
                                    <p v-if="form.password && form.password !== form.passwordConfirm"
                                        class="mt-1 text-xs text-red-600 font-medium">
                                        Password tidak cocok
                                    </p>
                                </div>
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
                                @change="handleJabatanChange"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                <option value="">Pilih Jabatan</option>
                                <option value="Guru Kelas">Guru Kelas</option>
                                <option value="Guru Bidang Studi">Guru Bidang Studi</option>
                                <option value="Guru Kelas dan Guru Bidang Studi">Guru Kelas dan Guru Bidang Studi</option>
                            </select>
                        </div>

                        <!-- Conditional Fields Based on Jabatan -->

                        <!-- Guru Kelas: Rombel Wali Kelas -->
                        <div v-if="form.jabatan === 'Guru Kelas' || form.jabatan === 'Guru Kelas dan Guru Bidang Studi'">
                            <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                Rombel yang Diampu sebagai Wali Kelas
                                <span class="text-red-600 ml-1">*</span>
                            </label>
                            <select v-model="form.rombelGuruKelasId" :disabled="isSubmitting || rombelLoading"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                <option :value="null">Pilih Rombel</option>
                                <option v-for="rombel in activeRombels" :key="rombel.id" :value="rombel.id">
                                    {{ rombel.name }}
                                </option>
                            </select>
                        </div>

                        <!-- Guru Bidang Studi or Guru Kelas dan Bidang Studi: Bidang Studi & Rombel -->
                        <div v-if="form.jabatan === 'Guru Bidang Studi' || form.jabatan === 'Guru Kelas dan Guru Bidang Studi'"
                            class="space-y-4 sm:space-y-6">
                            <!-- Bidang Studi Dropdown -->
                            <div>
                                <label class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                    Bidang Studi
                                    <span class="text-red-600 ml-1">*</span>
                                </label>
                                <select v-model="form.bidangStudiId" :disabled="isSubmitting || bidangStudiLoading"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                    <option :value="null">Pilih Bidang Studi</option>
                                    <option v-for="bidang in activeBidangStudis" :key="bidang.id" :value="bidang.id">
                                        {{ bidang.name }}
                                    </option>
                                </select>
                            </div>

                            <!-- Rombel Bidang Studi Checkboxes -->
                             <div>
                                 <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-3 sm:mb-4">
                                     Rombel yang Diampu sebagai Guru Bidang Studi
                                     <span class="text-red-600 ml-1">*</span>
                                 </label>
                                 <div v-if="rombelLoading" class="text-xs text-gray-600">
                                     Memuat rombel...
                                 </div>
                                 <div v-else class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                                     <label v-for="rombel in activeRombels" :key="rombel.id"
                                         class="flex items-center gap-3 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                         <input type="checkbox" :value="rombel.id"
                                             v-model="form.rombelBidangStudi"
                                             :disabled="isSubmitting"
                                             class="w-4 h-4 text-red-600 rounded cursor-pointer" />
                                         <span class="text-xs sm:text-sm text-gray-900">{{ rombel.name }}</span>
                                     </label>
                                 </div>
                             </div>
                        </div>

                        <!-- Role Grouped by System -->
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

                        <!-- Status Toggle -->
                         <div class="pt-3 sm:pt-4 border-t border-gray-200">
                             <div class="flex items-center justify-between">
                                 <label class="text-[13px] sm:text-[15px] font-semibold text-gray-900">Status</label>
                                <button type="button" @click="form.status = form.status === 'active' ? 'inactive' : 'active'" :disabled="isSubmitting" :class="[
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
                                class="flex-1 flex items-center justify-center gap-2 px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                <i class="fa-solid fa-times w-4 h-4"></i>
                                Batal
                            </button>
                            <button type="submit" :disabled="isSubmitting"
                                class="flex-1 flex items-center justify-center gap-2 px-4 py-2 sm:py-3 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                <i v-if="!isSubmitting" class="fa-solid fa-check w-4 h-4"></i>
                                <i v-else class="fa-solid fa-spinner w-4 h-4 animate-spin"></i>
                                {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useKepegawaianStore } from '~/stores/KepegawaianStore'
import { useToastStore } from '~/stores/ToastStore'
import { getRombelList } from '~/services/rombel'
import { getBidangStudiList } from '~/services/bidang-studi'
import { getRoleList } from '~/services/user'

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    }
})

const emit = defineEmits(['update:modelValue', 'success', 'error'])

const kepegawaianStore = useKepegawaianStore()
const toastStore = useToastStore()

const isSubmitting = ref(false)
const showPassword = ref(false)
const showPasswordConfirm = ref(false)

const rombelLoading = ref(false)
const bidangStudiLoading = ref(false)
const roleLoading = ref(false)

const rombels = ref<any[]>([])
const bidangStudis = ref<any[]>([])
const roles = ref<any[]>([])

const form = ref({
    nama: '',
    nip: '',
    nkki: '',
    username: '',
    password: '',
    passwordConfirm: '',
    passwordType: 'auto',
    kategori: 'Pendidik',
    jabatan: '',
    rombelGuruKelasId: null as number | null,
    rombelBidangStudi: [] as number[],
    bidangStudiId: null as number | null,
    roleIds: {} as Record<string, number | null>,
    status: 'active' as 'active' | 'inactive'
})

// Computed
const activeRombels = computed(() => rombels.value.filter(r => r.status === 'active'))
const activeBidangStudis = computed(() => bidangStudis.value.filter(b => b.status === 'active'))

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
    return grouped
})

// Methods
const closeModal = () => {
    emit('update:modelValue', false)
    resetForm()
}

const resetForm = () => {
    form.value = {
        nama: '',
        nip: '',
        nkki: '',
        username: '',
        password: '',
        passwordConfirm: '',
        passwordType: 'auto',
        kategori: 'Pendidik',
        jabatan: '',
        rombelGuruKelasId: null,
        rombelBidangStudi: [],
        bidangStudiId: null,
        roleIds: {},
        status: 'active'
    }
    showPassword.value = false
    showPasswordConfirm.value = false
}

const handleNipChange = () => {
    // Auto-generate username from NIP
    if (form.value.nip.trim()) {
        form.value.username = form.value.nip
    }
    if (form.value.passwordType === 'auto') {
        // Auto update password when NIP changes
    }
}

const handleNkkiChange = () => {
    // Auto-generate username from NKKI
    if (form.value.nkki.trim()) {
        form.value.username = form.value.nkki
    }
    if (form.value.passwordType === 'auto') {
        // Auto update password when NKKI changes
    }
}

const handleJabatanChange = () => {
    // Reset related fields when jabatan changes
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

const handleSubmit = async () => {
    // Validation
    if (!form.value.nama.trim()) {
        toastStore.showToast('error', 'Gagal menyimpan', 'Nama harus diisi')
        return
    }

    // Validate NIP or NKKI - at least one must be filled
    if (!form.value.nip.trim() && !form.value.nkki.trim()) {
        toastStore.showToast('error', 'Gagal menyimpan', 'NIP atau NKKI harus diisi salah satunya')
        return
    }

    if (!form.value.username.trim()) {
        toastStore.showToast('error', 'Gagal menyimpan', 'Username harus diisi')
        return
    }

    if (form.value.passwordType === 'auto') {
        if (!autoGeneratedPassword.value) {
            toastStore.showToast('error', 'Gagal menyimpan', 'Masukkan NIP atau NKKI terlebih dahulu')
            return
        }
    } else {
        if (!form.value.password.trim()) {
            toastStore.showToast('error', 'Gagal menyimpan', 'Password harus diisi')
            return
        }
        if (form.value.password.length < 6) {
            toastStore.showToast('error', 'Gagal menyimpan', 'Password minimal 6 karakter')
            return
        }
        if (form.value.password !== form.value.passwordConfirm) {
            toastStore.showToast('error', 'Gagal menyimpan', 'Password tidak cocok')
            return
        }
    }

    if (!form.value.jabatan) {
        toastStore.showToast('error', 'Gagal menyimpan', 'Jabatan harus dipilih')
        return
    }

    // Validate that at least one role is selected overall (from any system)
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

    isSubmitting.value = true

    try {
        const payload = {
            nama: form.value.nama,
            username: form.value.username,
            password: form.value.passwordType === 'auto' ? autoGeneratedPassword.value : form.value.password,
            nip: form.value.nip || undefined,
            nkki: form.value.nkki || undefined,
            kategori: form.value.kategori,
            jabatan: form.value.jabatan,
            rombel_guru_kelas_id: form.value.rombelGuruKelasId || undefined,
            rombel_bidang_studi: form.value.rombelBidangStudi.length > 0 ? form.value.rombelBidangStudi : undefined,
            bidang_studi_id: form.value.bidangStudiId || undefined,
            role_ids: Object.values(form.value.roleIds).filter(role => role !== null && role !== undefined) as number[],
            status: form.value.status
        }

        const result = await kepegawaianStore.addKepegawaian(payload)

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
        
        // Try to extract error message from different possible response structures
        if (err.data?.message) {
           message = err.data.message
        } else if (err.data?.errors) {
           // Backend returns validation errors as {"errors": {"field": "message"}}
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

// Load data on mount
onMounted(() => {
    loadRombels()
    loadBidangStudis()
    loadRoles()
})

// Watch for model value changes
watch(() => props.modelValue, (newVal) => {
    if (newVal) {
        resetForm()
        loadRombels()
        loadBidangStudis()
        loadRoles()
    }
})
</script>
