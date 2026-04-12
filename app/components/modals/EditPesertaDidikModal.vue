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
                        <h2 class="text-lg sm:text-xl font-bold text-white">Edit Peserta Didik</h2>
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
                <div v-if="!pesertaDidik" class="p-4 sm:p-8 flex items-center justify-center flex-1">
                    <div class="flex flex-col items-center gap-3 sm:gap-4">
                        <div
                            class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600">
                        </div>
                        <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat data peserta didik...</p>
                    </div>
                </div>

                <div v-else class="p-4 sm:p-8 relative z-10 overflow-y-auto flex-1">

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
                            <div>
                                <label
                                    class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">RT<span
                                        class="text-red-600 ml-1">*</span></label>
                                <input v-model="form.rt" type="text" placeholder="RT" required maxlength="5"
                                    :disabled="isSubmitting"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                            </div>
                            <div>
                                <label
                                    class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">RW<span
                                        class="text-red-600 ml-1">*</span></label>
                                <input v-model="form.rw" type="text" placeholder="RW" required maxlength="5"
                                    :disabled="isSubmitting"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                            </div>
                            <div>
                                <label
                                    class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">Kelurahan<span
                                        class="text-red-600 ml-1">*</span></label>
                                <input v-model="form.kelurahan" type="text" placeholder="Kelurahan" required
                                    :disabled="isSubmitting"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                            </div>
                            <div>
                                <label
                                    class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">Kecamatan<span
                                        class="text-red-600 ml-1">*</span></label>
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

                        <!-- Rombel and Tahun Pelajaran Row -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <label
                                    class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                    Rombel
                                    <span class="text-red-600 ml-1">*</span>
                                </label>
                                <select v-model.number="form.rombel_id" required :disabled="isSubmitting"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                    <option :value="0">Pilih Rombel</option>
                                    <option v-for="rombel in activeRombels" :key="rombel.id" :value="rombel.id">
                                        {{ rombel.name }}
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label
                                    class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                    Tahun Pelajaran
                                    <span class="text-red-600 ml-1">*</span>
                                </label>
                                <select v-model.number="form.tahun_pelajaran_id" required :disabled="isSubmitting"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                    <option :value="0">Pilih Tahun Pelajaran</option>
                                    <option v-for="tahun in activeTahunPelajaran" :key="tahun.id" :value="tahun.id"
                                        :disabled="tahun.status !== 'active'">
                                        {{ tahun.tahun_pelajaran }}{{ tahun.status !== 'active' ? ' (Nonaktif)' : '' }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <!-- Username/Password Setting -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-3 sm:mb-4">
                                Ubah Username dan Password (Opsional)
                            </label>

                            <!-- Radio Options -->
                            <div class="flex gap-3 sm:gap-4 mb-4">
                                <!-- No Change Option -->
                                <label class="flex items-center gap-2 cursor-pointer"
                                    :class="form.passwordType === '' ? 'text-red-600 font-semibold' : 'text-gray-900'">
                                    <input type="radio" v-model="form.passwordType" value=""
                                        :disabled="isSubmitting" class="w-4 h-4 text-red-600 cursor-pointer" />
                                    <span class="text-xs sm:text-sm font-medium">Tidak Ubah</span>
                                </label>

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
                            </div>

                            <!-- Generate Otomatis - Username & Password Display -->
                            <div v-if="form.passwordType === 'auto'" class="space-y-3">
                                <!-- Username -->
                                <div>
                                    <label
                                        class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                        Username
                                    </label>
                                    <div class="relative flex items-center">
                                        <input :value="form.nis" type="text" readonly :disabled="isSubmitting"
                                            class="w-full rounded-lg border-2 border-gray-300 bg-gray-50 px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed" />
                                        <div class="absolute right-4 flex items-center justify-center text-gray-600">
                                            <i class="fa-solid fa-user w-4 h-4 sm:w-5 sm:h-5"></i>
                                        </div>
                                    </div>
                                </div>

                                <!-- Password -->
                                <div>
                                    <label
                                        class="block text-[13px] sm:text-[15px] font-semibold text-gray-900 mb-2 sm:mb-3">
                                        Password
                                    </label>
                                    <div class="relative flex items-center">
                                        <input :value="form.nis" type="text" readonly :disabled="isSubmitting"
                                            class="w-full rounded-lg border-2 border-gray-300 bg-gray-50 px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed" />
                                        <div class="absolute right-4 flex items-center justify-center text-gray-600">
                                            <i class="fa-solid fa-lock w-4 h-4 sm:w-5 sm:h-5"></i>
                                        </div>
                                    </div>
                                </div>
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
                                        Password (Opsional - Kosongkan jika tidak ingin mengubah)
                                    </label>
                                    <div class="relative flex items-center">
                                        <input v-model="form.password" :type="showPassword ? 'text' : 'password'"
                                            placeholder="Minimum 3 karakter" :disabled="isSubmitting"
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
                                        <span v-if="form.password" class="text-red-600 ml-1">*</span>
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
                                                        <span class="text-xs sm:text-sm font-medium text-gray-700 block">{{
                                                            role.name }}</span>
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
                        <div class="flex gap-3 pt-4 sm:pt-6 border-t border-gray-200">
                            <button type="button" @click="closeModal" :disabled="isSubmitting"
                                class="flex-1 px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                Batal
                            </button>
                            <button type="submit" :disabled="isSubmitting"
                                class="flex-1 flex items-center justify-center gap-2 px-4 py-2 sm:py-3 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                <span v-if="isSubmitting"
                                    class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
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
import { ref, watch, computed, onMounted } from 'vue'
import { usePesertaDidikStore } from '~/stores/PesertaDidikStore'
import { useRombelStore } from '~/stores/RombelStore'
import { useTahunPelajaranStore } from '~/stores/TahunPelajaranStore'
import { useToastStore } from '~/stores/ToastStore'
import { getPesertaDidikById } from '~/services/peserta-didik'
import { getRoleList } from '~/services/user'

const props = defineProps({
    modelValue: Boolean,
    pesertaDidik: Object,
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'success': []
    'error': []
}>()

const pesertaDidikStore = usePesertaDidikStore()
const rombelStore = useRombelStore()
const tahunPelajaranStore = useTahunPelajaranStore()
const toastStore = useToastStore()

const isSubmitting = ref(false)
const pesertaDidik = ref<any>(null)
const rombelLoading = ref(false)
const tahunLoading = ref(false)
const roleLoading = ref(false)
const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const showPasswordOptions = ref(false)

const activeRombels = ref<any[]>([])
const activeTahunPelajaran = ref<any[]>([])
const rolesBySystem = ref<Record<string, any[]>>({})

const resetRoleGroup = (systemName: string) => {
    form.value.roleIds[systemName] = null
}

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
    rombel_id: 0,
    tahun_pelajaran_id: 0,
    status: 'active',
    username: '',
    password: '',
    passwordConfirm: '',
    passwordType: '',
    roleIds: {} as Record<string, number | null>,
})

watch(() => props.modelValue, async (newVal) => {
    if (newVal && props.pesertaDidik) {
        await loadData()
    }
})

const loadData = async () => {
    try {
        // Load full peserta didik data
        const response = await getPesertaDidikById(props.pesertaDidik.id)
        pesertaDidik.value = response.data

        // Populate form with existing data
        form.value = {
            nama: pesertaDidik.value.nama,
            nis: pesertaDidik.value.nis,
            jenis_kelamin: pesertaDidik.value.jenis_kelamin,
            nisn: pesertaDidik.value.nisn,
            tempat_lahir: pesertaDidik.value.tempat_lahir,
            tanggal_lahir: pesertaDidik.value.tanggal_lahir,
            nik: pesertaDidik.value.nik,
            agama: pesertaDidik.value.agama,
            alamat: pesertaDidik.value.alamat,
            rt: pesertaDidik.value.rt,
            rw: pesertaDidik.value.rw,
            kelurahan: pesertaDidik.value.kelurahan,
            kecamatan: pesertaDidik.value.kecamatan,
            kode_pos: pesertaDidik.value.kode_pos,
            nama_ayah: pesertaDidik.value.nama_ayah,
            nama_ibu: pesertaDidik.value.nama_ibu,
            rombel_id: pesertaDidik.value.rombel_id,
            tahun_pelajaran_id: pesertaDidik.value.tahun_pelajaran_id,
            status: pesertaDidik.value.status,
            username: pesertaDidik.value.username || '',
            password: '',
            passwordConfirm: '',
            passwordType: '',
            roleIds: {},
        }

        // Load rombel, tahun pelajaran, dan roles
        await loadRombels()
        await loadTahunPelajaran()
        await loadRoles()
    } catch (err) {
        console.error('Error loading peserta didik data:', err)
        toastStore.error('Gagal', 'Tidak bisa memuat data peserta didik')
    }
}

const loadRombels = async () => {
    rombelLoading.value = true
    try {
        const result = await rombelStore.fetchRombels(1, 100, { status: 'active' })
        if (result.success) {
            activeRombels.value = rombelStore.rombels
        }
    } catch (err) {
        console.error('Error loading rombels:', err)
    } finally {
        rombelLoading.value = false
    }
}

const loadTahunPelajaran = async () => {
    tahunLoading.value = true
    try {
        const result = await tahunPelajaranStore.fetchTahunPelajarans(1, 100)
        if (result.success) {
            const activeList = tahunPelajaranStore.tahunPelajarans.filter((t: any) => t.status === 'active')

            // Include current student's tahun pelajaran if it's inactive
            const currentTahunId = pesertaDidik.value?.tahun_pelajaran_id
            if (currentTahunId) {
                const currentTahun = tahunPelajaranStore.tahunPelajarans.find((t: any) => t.id === currentTahunId)
                if (currentTahun && currentTahun.status !== 'active' && !activeList.some((t: any) => t.id === currentTahunId)) {
                    activeList.push(currentTahun)
                }
            }

            activeTahunPelajaran.value = activeList
        }
    } catch (err) {
        console.error('Error loading tahun pelajaran:', err)
    } finally {
        tahunLoading.value = false
    }
}

const loadRoles = async () => {
    roleLoading.value = true
    try {
        const response = await getRoleList()
        const roles = response.data || []

        const grouped: Record<string, any[]> = {}
        roles.forEach((role: any) => {
            const systemName = role.system?.nama || 'Tanpa Sistem'
            if (!grouped[systemName]) {
                grouped[systemName] = []
            }
            grouped[systemName].push(role)
        })

        rolesBySystem.value = grouped

        // Initialize roleIds object dengan existing roles
        if (pesertaDidik.value && pesertaDidik.value.roles && pesertaDidik.value.roles.length > 0) {
            Object.keys(grouped).forEach(systemName => {
                const existingRole = pesertaDidik.value.roles.find((r: any) => r.system?.nama === systemName)
                form.value.roleIds[systemName] = existingRole ? existingRole.id : null
            })
        }
    } catch (err) {
        console.error('Error loading roles:', err)
    } finally {
        roleLoading.value = false
    }
}

const getErrorMessage = (error: any): string => {
    if (error?.data?.errors && typeof error.data.errors === 'object') {
        const errors = error.data.errors
        const errorMessages = Object.values(errors).filter(msg => msg && typeof msg === 'string') as string[]
        if (errorMessages.length > 0) {
            return errorMessages[0]
        }
    }

    if (error?.data?.error) {
        return error.data.error
    }

    if (error?.data?.message) {
        return error.data.message
    }

    if (error?.message) {
        return error.message
    }

    return 'Terjadi kesalahan saat menyimpan'
}

const handleSubmit = async () => {
    // Validate password type selection - optional for edit, but if user wants to change they must validate
    // If passwordType is empty ('Tidak Ubah'), we won't change anything
    if (form.value.passwordType === 'auto') {
        // Auto generate: no validation needed, will use NIS
    } else if (form.value.passwordType === 'manual') {
        // Manual setting: validate username and password
        if (!form.value.username.trim()) {
            toastStore.error('Validasi', 'Username harus diisi')
            return
        }
        if (!form.value.password || form.value.password.length === 0) {
            toastStore.error('Validasi', 'Password harus diisi saat memilih manual setting')
            return
        }
        if (form.value.password.length < 3) {
            toastStore.error('Validasi', 'Password minimal 3 karakter')
            return
        }
        if (form.value.password !== form.value.passwordConfirm) {
            toastStore.error('Validasi', 'Password tidak cocok')
            return
        }
    }
    // If passwordType is '' (empty), no password validation needed

    // Validate role selection
    const selectedRoles = Object.values(form.value.roleIds).filter(id => id !== null && id !== undefined)
    if (selectedRoles.length === 0) {
        toastStore.error('Validasi', 'Pilih minimal satu role')
        return
    }

    isSubmitting.value = true

    try {
        const requestData: any = {
            nama: form.value.nama,
            nis: form.value.nis,
            jenis_kelamin: form.value.jenis_kelamin,
            nisn: form.value.nisn,
            tempat_lahir: form.value.tempat_lahir,
            tanggal_lahir: form.value.tanggal_lahir,
            nik: form.value.nik,
            agama: form.value.agama,
            alamat: form.value.alamat,
            rt: form.value.rt,
            rw: form.value.rw,
            kelurahan: form.value.kelurahan,
            kecamatan: form.value.kecamatan,
            kode_pos: form.value.kode_pos,
            nama_ayah: form.value.nama_ayah,
            nama_ibu: form.value.nama_ibu,
            rombel_id: form.value.rombel_id,
            tahun_pelajaran_id: form.value.tahun_pelajaran_id,
            status: form.value.status,
            role_ids: selectedRoles,
        }

        // Handle username and password based on selection
        if (form.value.passwordType === 'auto') {
            // Generate automatic: use NIS for both username and password
            requestData.username = form.value.nis
            requestData.password = form.value.nis
        } else if (form.value.passwordType === 'manual') {
            // Manual setting: use form values
            requestData.username = form.value.username
            // Only include password if it's filled
            if (form.value.password && form.value.password.length > 0) {
                requestData.password = form.value.password
            }
        }
        // If passwordType is empty, don't send username/password fields (keep existing)

        const result = await pesertaDidikStore.editPesertaDidik(pesertaDidik.value.id, requestData)

        if (result.success) {
            toastStore.success('Sukses', 'Peserta didik berhasil diperbarui')
            closeModal()
            emit('success')
        } else {
            toastStore.error('Gagal', result.message)
            emit('error')
        }
    } catch (error: any) {
        console.error('Error:', error)
        const errorMessage = getErrorMessage(error)
        toastStore.error('Gagal', errorMessage)
        emit('error')
    } finally {
        isSubmitting.value = false
    }
}

const closeModal = () => {
     pesertaDidikStore.clearError()
     emit('update:modelValue', false)
     pesertaDidik.value = null
     showPasswordOptions.value = false
     form.value.passwordType = ''
 }
</script>

