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
                class="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-2xl w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">

                <!-- Header -->
                <div
                    class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-8 py-3 sm:py-4 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
                    <div class="absolute top-0 right-0 w-40 h-40 bg-red-400/20 rounded-full blur-3xl -z-0"></div>
                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl -z-0"></div>

                    <div class="relative z-10 flex-1">
                        <h2 class="text-lg sm:text-xl font-bold text-white">Edit Data Prestasi</h2>
                    </div>

                    <button type="button" @click.stop="closeModal" :disabled="isSubmitting"
                        class="relative z-10 flex-shrink-0 inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-150 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Loading State -->
                <div v-if="isLoading" class="p-8 sm:p-12 flex items-center justify-center">
                    <div class="flex flex-col items-center gap-3 sm:gap-4">
                        <div
                            class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600">
                        </div>
                        <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat data prestasi...</p>
                    </div>
                </div>

                <!-- Body -->
                <div v-else class="p-4 sm:p-8 relative z-10 overflow-y-auto flex-1 space-y-4 sm:space-y-6">
                    <!-- Form -->
                    <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
                        <!-- Tahun Pelajaran -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                Tahun Pelajaran <span class="text-red-600 ml-1">*</span>
                            </label>
                            <select v-model.number="form.tahun_pelajaran_id" :disabled="isSubmitting"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                <option value="0">Pilih Tahun Pelajaran</option>
                                <option v-for="tahun in tahunPelajaranList" :key="tahun.id" :value="tahun.id">
                                    {{ tahun.tahun_pelajaran }}
                                </option>
                            </select>
                        </div>

                        <!-- Jenis -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                Jenis <span class="text-red-600 ml-1">*</span>
                            </label>
                            <select v-model="form.jenis" :disabled="isSubmitting"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                <option value="">Pilih Jenis</option>
                                <option value="Individu">Individu</option>
                                <option value="Tim">Tim</option>
                            </select>
                        </div>

                        <!-- === INDIVIDU FIELDS === -->
                        <template v-if="form.jenis === 'Individu'">
                            <!-- Peserta Didik Saat Ini -->
                            <div>
                                <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                    Peserta Didik Saat Ini
                                </label>
                                <input type="text" :value="currentPesertaDidikLabel" disabled
                                    class="w-full rounded-lg border-2 border-gray-200 bg-gray-100 px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 cursor-not-allowed" />
                            </div>

                            <!-- Ganti Peserta Didik -->
                            <div>
                                <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                    Ganti Peserta Didik <span class="text-xs text-gray-400 font-normal ml-1">(kosongkan jika tidak ingin mengubah)</span>
                                </label>
                                <div class="relative" ref="pesertaDidikDropdownRef">
                                    <input type="text" v-model="pesertaDidikSearch"
                                        @focus="showPesertaDidikDropdown = true"
                                        @input="showPesertaDidikDropdown = true"
                                        placeholder="Cari nama, NIS, atau rombel..."
                                        :disabled="isSubmitting"
                                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                                    <!-- Clear button -->
                                    <div v-if="selectedNewPesertaDidik && !showPesertaDidikDropdown"
                                        class="absolute right-3 top-1/2 -translate-y-1/2">
                                        <button type="button" @click="clearSelectedPesertaDidik"
                                            class="text-gray-400 hover:text-red-500 cursor-pointer">
                                            <i class="fa-solid fa-xmark"></i>
                                        </button>
                                    </div>
                                    <div v-if="showPesertaDidikDropdown && filteredPesertaDidik.length > 0"
                                        class="absolute z-50 mt-1 w-full bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                        <button type="button" v-for="pd in filteredPesertaDidik" :key="pd.id"
                                            @click="selectPesertaDidik(pd)"
                                            class="w-full text-left px-4 py-2.5 hover:bg-red-50 transition-colors text-xs sm:text-sm cursor-pointer border-b border-gray-100 last:border-b-0">
                                            {{ pd.nama }} - NIS: <i>{{ pd.nis }}</i> - Rombel: <i>{{ pd.rombel?.name || '-' }}</i>
                                        </button>
                                    </div>
                                    <div v-if="showPesertaDidikDropdown && filteredPesertaDidik.length === 0 && pesertaDidikSearch"
                                        class="absolute z-50 mt-1 w-full bg-white border-2 border-gray-200 rounded-lg shadow-lg p-4 text-center text-xs sm:text-sm text-gray-500">
                                        Peserta didik tidak ditemukan
                                    </div>
                                </div>
                                <!-- Selected new peserta didik indicator -->
                                <div v-if="selectedNewPesertaDidik" class="mt-2 flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                                    <i class="fa-solid fa-circle-check text-green-600 text-xs"></i>
                                    <span class="text-xs sm:text-sm font-medium text-green-800">
                                        Akan diganti ke: {{ selectedNewPesertaDidik.nama }} - NIS: {{ selectedNewPesertaDidik.nis }}
                                    </span>
                                </div>
                            </div>
                        </template>

                        <!-- === TIM FIELDS === -->
                        <template v-if="form.jenis === 'Tim'">
                            <!-- Nama Grup -->
                            <div>
                                <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                    Nama Grup / Tim <span class="text-red-600 ml-1">*</span>
                                </label>
                                <input v-model="form.nama_grup" type="text" placeholder="Masukkan nama grup/tim..."
                                    :disabled="isSubmitting"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                            </div>
                        </template>
                        <!-- === COMMON FIELDS === -->
                        <!-- Nama Prestasi -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                Nama Prestasi <span class="text-red-600 ml-1">*</span>
                            </label>
                            <input v-model="form.nama_prestasi" type="text" placeholder="Masukkan nama prestasi..."
                                :disabled="isSubmitting"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>

                        <!-- Tingkat Prestasi & Juara -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                    Tingkat Prestasi <span class="text-red-600 ml-1">*</span>
                                </label>
                                <select v-model="form.tingkat_prestasi" :disabled="isSubmitting"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                    <option value="">Pilih Tingkat Prestasi</option>
                                    <option value="Sekolah">Sekolah</option>
                                    <option value="Kecamatan">Kecamatan</option>
                                    <option value="Kota/Kabupaten">Kota/Kabupaten</option>
                                    <option value="Provinsi">Provinsi</option>
                                    <option value="Nasional">Nasional</option>
                                    <option value="Internasional">Internasional</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                    Juara <span class="text-red-600 ml-1">*</span>
                                </label>
                                <select v-model="form.juara" :disabled="isSubmitting"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                    <option value="">Pilih Juara</option>
                                    <option value="Juara 1">Juara 1</option>
                                    <option value="Juara 2">Juara 2</option>
                                    <option value="Juara 3">Juara 3</option>
                                    <option value="Juara 4">Juara 4</option>
                                    <option value="Juara 5">Juara 5</option>
                                    <option value="Harapan 1">Harapan 1</option>
                                    <option value="Harapan 2">Harapan 2</option>
                                    <option value="Harapan 3">Harapan 3</option>
                                    <option value="Harapan 4">Harapan 4</option>
                                    <option value="Harapan 5">Harapan 5</option>
                                </select>
                            </div>
                        </div>

                        <!-- Penyelenggara & Tanggal Lomba -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                    Penyelenggara <span class="text-xs text-gray-400 font-normal ml-1">(opsional)</span>
                                </label>
                                <input v-model="form.penyelenggara" type="text"
                                    placeholder="Masukkan penyelenggara..." :disabled="isSubmitting"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                            </div>
                            <div>
                                <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                    Tanggal Lomba <span class="text-red-600 ml-1">*</span>
                                </label>
                                <input v-model="form.tanggal_lomba" type="date" :disabled="isSubmitting"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" />
                            </div>
                        </div>

                        <!-- Keterangan -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                Keterangan
                            </label>
                            <textarea v-model="form.keterangan" placeholder="Masukkan keterangan..."
                                :disabled="isSubmitting" rows="3"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed resize-none"></textarea>
                        </div>

                        <!-- Ekstrakurikuler -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                Ekstrakurikuler <span class="text-xs text-gray-400 font-normal ml-1">(opsional)</span>
                            </label>
                            <select v-model.number="form.ekstrakurikuler_id" :disabled="isSubmitting"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                <option :value="0">Pilih Ekstrakurikuler</option>
                                <option v-for="ekskul in ekstrakurikulerList" :key="ekskul.id" :value="ekskul.id">
                                    {{ ekskul.name }}
                                </option>
                            </select>
                        </div>
                        <!-- === TIM: Anggota Tim === -->
                        <template v-if="form.jenis === 'Tim'">
                            <div class="border-t border-gray-200 pt-4">
                                <div class="flex items-center justify-between mb-3">
                                    <label class="text-xs sm:text-sm font-semibold text-gray-900">
                                        Anggota Tim <span class="text-red-600 ml-1">*</span>
                                    </label>
                                    <button type="button" @click="showAddAnggota = true" :disabled="isSubmitting"
                                        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                        <i class="fa-solid fa-plus text-[10px]"></i>
                                        Tambah Anggota
                                    </button>
                                </div>

                                <!-- Add Anggota Inline Form -->
                                <div v-if="showAddAnggota"
                                    class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <label class="block text-xs font-semibold text-gray-700 mb-2">Pilih Peserta
                                        Didik</label>
                                    <div class="relative" ref="anggotaDropdownRef">
                                        <input type="text" v-model="anggotaSearch"
                                            @focus="showAnggotaDropdown = true"
                                            @input="showAnggotaDropdown = true"
                                            placeholder="Cari nama, NIS, atau rombel..."
                                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                                        <div v-if="showAnggotaDropdown && filteredAnggotaPesertaDidik.length > 0"
                                            class="absolute z-50 mt-1 w-full bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                            <button type="button" v-for="pd in filteredAnggotaPesertaDidik"
                                                :key="pd.id" @click="addAnggotaTim(pd)"
                                                class="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors text-xs sm:text-sm cursor-pointer border-b border-gray-100 last:border-b-0">
                                                    {{ pd.nama }} - NIS: <i>{{ pd.nis }}</i> - Rombel: <i>{{ pd.rombel?.name || '-' }}</i>
                                            </button>
                                        </div>
                                        <div v-if="showAnggotaDropdown && filteredAnggotaPesertaDidik.length === 0 && anggotaSearch"
                                            class="absolute z-50 mt-1 w-full bg-white border-2 border-gray-200 rounded-lg shadow-lg p-4 text-center text-xs sm:text-sm text-gray-500">
                                            Peserta didik tidak ditemukan
                                        </div>
                                    </div>
                                    <div class="flex justify-end mt-2">
                                        <button type="button" @click="showAddAnggota = false; anggotaSearch = ''"
                                            class="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-800 cursor-pointer">
                                            Batal
                                        </button>
                                    </div>
                                </div>

                                <!-- Anggota Tim List -->
                                <div v-if="anggotaTimList.length > 0"
                                    class="overflow-x-auto rounded-lg border border-gray-200">
                                    <table class="w-full">
                                        <thead>
                                            <tr class="bg-gray-100">
                                                <th
                                                    class="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-600 w-10">
                                                    No</th>
                                                <th
                                                    class="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-600">
                                                    Nama Siswa</th>
                                                <th
                                                    class="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-600">
                                                    NIS</th>
                                                <th
                                                    class="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-600">
                                                    Rombel</th>
                                                <th
                                                    class="px-3 py-2 text-center text-xs font-semibold uppercase text-gray-600 w-16">
                                                    Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-gray-200">
                                            <tr v-for="(anggota, idx) in anggotaTimList" :key="anggota.peserta_didik_id"
                                                class="hover:bg-gray-50">
                                                <td class="px-3 py-2 text-xs sm:text-sm text-gray-700">{{ idx + 1 }}
                                                </td>
                                                <td class="px-3 py-2 text-xs sm:text-sm text-gray-700 font-medium">{{
                                                    anggota.nama }}</td>
                                                <td class="px-3 py-2 text-xs sm:text-sm text-gray-700">{{ anggota.nis
                                                    }}</td>
                                                <td class="px-3 py-2 text-xs sm:text-sm text-gray-700">{{
                                                    anggota.rombel_name }}</td>
                                                <td class="px-3 py-2 text-center">
                                                    <button type="button" @click="removeAnggotaTim(idx)"
                                                        :disabled="isSubmitting"
                                                        class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer disabled:opacity-50">
                                                        <i class="fa-solid fa-trash-can text-xs"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p v-else class="text-xs sm:text-sm text-gray-400 italic">Belum ada anggota tim
                                    ditambahkan</p>
                            </div>
                        </template>
                        <!-- Foto Upload -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                Foto Prestasi
                                <span class="text-xs text-gray-500 font-normal ml-2">(Maks. 3 foto, 2MB/foto)</span>
                            </label>

                            <!-- Existing Photos -->
                            <div v-if="existingPhotos.length > 0" class="mb-4">
                                <h4 class="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Foto Saat Ini</h4>
                                <div class="space-y-2">
                                    <div v-for="(photo, index) in existingPhotos" :key="photo.id"
                                        class="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                        <img :src="photo.url" :alt="photo.filename"
                                            @click="openPhotoModal(photo.url, photo.filename)"
                                            class="w-16 h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity" />
                                        <div class="flex-1 min-w-0">
                                            <p class="text-xs sm:text-sm font-medium text-gray-900 truncate">{{ photo.filename }}</p>
                                            <p class="text-xs text-gray-500">Foto tersimpan</p>
                                        </div>
                                        <!-- Thumbnail checkbox -->
                                        <label class="flex items-center gap-1.5 cursor-pointer flex-shrink-0 mr-2"
                                            :title="photo.isThumbnail ? 'Thumbnail aktif' : 'Jadikan thumbnail'">
                                            <input type="checkbox" :checked="photo.isThumbnail"
                                                @change="setExistingThumbnail(index)" :disabled="isSubmitting"
                                                class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer" />
                                            <span class="text-xs font-medium"
                                                :class="photo.isThumbnail ? 'text-green-700' : 'text-gray-500'">
                                                Thumbnail
                                            </span>
                                        </label>
                                        <button type="button" @click="removeExistingPhoto(index)" :disabled="isSubmitting"
                                            class="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                            <i class="fa-solid fa-xmark text-sm"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Photo Previews -->
                            <div v-if="photoPreviews.length > 0" class="mb-3">
                                <h4 class="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Foto Baru</h4>
                                <div class="space-y-2">
                                    <div v-for="(preview, index) in photoPreviews" :key="index"
                                        class="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                        <img :src="preview.url" :alt="preview.file.name"
                                            @click="openPhotoModal(preview.url, preview.file.name)"
                                            class="w-16 h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity" />
                                        <div class="flex-1 min-w-0">
                                            <p class="text-xs sm:text-sm font-medium text-gray-900 truncate">{{
                                                preview.file.name }}</p>
                                            <p class="text-xs text-gray-500">{{ (preview.size / 1024).toFixed(1) }} KB</p>
                                        </div>
                                        <!-- Thumbnail checkbox -->
                                        <label class="flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                                            :title="preview.isThumbnail ? 'Thumbnail aktif' : 'Jadikan thumbnail'">
                                            <input type="checkbox" :checked="preview.isThumbnail"
                                                @change="setThumbnail(index)" :disabled="isSubmitting"
                                                class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer" />
                                            <span class="text-xs font-medium"
                                                :class="preview.isThumbnail ? 'text-green-700' : 'text-gray-500'">
                                                Thumbnail
                                            </span>
                                        </label>
                                        <!-- Remove -->
                                        <button type="button" @click="removePhoto(index)" :disabled="isSubmitting"
                                            class="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer disabled:opacity-50">
                                            <i class="fa-solid fa-xmark text-sm"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Upload Counter -->
                            <div class="mb-2 text-xs text-gray-500 font-medium">
                                {{ existingPhotos.length + photoPreviews.length }} / 3 foto
                            </div>

                            <!-- Upload Area -->
                            <div v-if="existingPhotos.length + photoPreviews.length < 3" @click="photoInput?.click()"
                                @dragover.prevent="isDragging = true" @dragleave="isDragging = false"
                                @drop.prevent="handlePhotoDrop" :class="[
                                    'relative border-2 border-dashed rounded-xl p-4 sm:p-6 text-center cursor-pointer transition-all duration-300',
                                    isDragging
                                        ? 'border-blue-500 bg-blue-50 scale-[1.02]'
                                        : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
                                ]">
                                <input ref="photoInput" type="file" accept="image/jpeg,image/png,image/webp"
                                    multiple class="hidden" @change="handlePhotoSelect" :disabled="isSubmitting" />
                                <div class="flex flex-col items-center gap-2">
                                    <div
                                        class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <i class="fa-solid fa-cloud-arrow-up text-blue-600"></i>
                                    </div>
                                    <p class="text-xs sm:text-sm font-semibold text-gray-900">Klik atau drag foto di
                                        sini</p>
                                    <p class="text-xs text-gray-500">Format: JPG, PNG, WebP (Maks. 2MB/foto)</p>
                                </div>
                            </div>
                        </div>

                        <!-- Error Alert -->
                        <div v-if="formError"
                            class="p-3 sm:p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                            <div class="flex gap-2 sm:gap-3">
                                <svg class="h-4 sm:h-5 w-4 sm:w-5 text-red-600 flex-shrink-0 mt-0.5"
                                    fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clip-rule="evenodd"></path>
                                </svg>
                                <p class="text-xs sm:text-sm font-medium text-red-800">{{ formError }}</p>
                            </div>
                        </div>

                        <!-- Buttons -->
                        <div class="flex gap-2 sm:gap-3 pt-3 sm:pt-4 flex-shrink-0">
                            <button type="button" @click="closeModal" :disabled="isSubmitting"
                                class="flex-1 px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                Batal
                            </button>
                            <button type="submit" :disabled="isSubmitting"
                                class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                <i v-if="!isSubmitting" class="fa-solid fa-check w-4 h-4"></i>
                                <i v-else class="fa-solid fa-spinner animate-spin w-4 h-4"></i>
                                {{ isSubmitting ? 'Menyimpan...' : 'Update Prestasi' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </Transition>

    <!-- Photo Modal -->
    <Teleport to="body">
        <!-- Backdrop -->
        <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="showPhotoModal" @click="closePhotoModal"
                class="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"></div>
        </Transition>
        <!-- Modal -->
        <Transition enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-4">
            <div v-if="showPhotoModal"
                class="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 pointer-events-none">
                <div
                    class="bg-white rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-2xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[85vh]">

                    <!-- Header -->
                    <div
                        class="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 px-4 sm:px-6 py-2.5 sm:py-3 relative overflow-hidden flex-shrink-0 flex items-center justify-between gap-4">
                        <div class="relative z-10 flex-1">
                            <h2 class="text-sm sm:text-base font-bold text-white">
                                Foto Prestasi
                            </h2>
                        </div>
                        <button type="button" @click="closePhotoModal"
                            class="relative z-10 flex-shrink-0 inline-flex items-center justify-center p-1.5 sm:p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-150 cursor-pointer">
                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                                <path d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    <!-- Body -->
                    <div class="flex items-center justify-center bg-gray-900 p-3 sm:p-4 relative overflow-hidden h-[50vh] sm:h-[55vh]">
                        <!-- Image -->
                        <img :src="currentPhotoUrl" :alt="currentPhotoFilename"
                            class="max-h-full max-w-full object-contain" />
                    </div>

                    <!-- Footer -->
                    <div class="border-t border-gray-200 bg-gray-50 px-4 sm:px-6 py-2.5 flex-shrink-0 flex items-center justify-between">
                        <p class="text-xs text-gray-600 font-medium truncate mr-3">
                            {{ currentPhotoFilename }}
                        </p>
                        <button @click="closePhotoModal"
                            class="px-3 py-1.5 rounded-lg bg-gray-200 text-gray-900 font-semibold text-xs hover:bg-gray-300 transition-colors cursor-pointer flex-shrink-0">
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { usePrestasiStore } from '~/stores/PrestasiStore'
import { useTahunPelajaranStore } from '~/stores/TahunPelajaranStore'
import { useEkstrakurikulerStore } from '~/stores/EkstrakurikulerStore'
import { useToastStore } from '~/stores/ToastStore'
import { getPrestasiById } from '~/services/prestasi'
import { getPesertaDidikList } from '~/services/peserta-didik'
import { compressImage } from '~/utils/imageCompressor'

interface Props {
    modelValue: boolean
    prestasiId: number
}

interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'success'): void
    (e: 'error'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const prestasiStore = usePrestasiStore()
const tahunPelajaranStore = useTahunPelajaranStore()
const ekstrakurikulerStore = useEkstrakurikulerStore()
const toastStore = useToastStore()

const isLoading = ref(false)
const isSubmitting = ref(false)
const formError = ref('')
const photoInput = ref<HTMLInputElement>()

// Form data
const form = ref({
    id: 0,
    tahun_pelajaran_id: 0,
    jenis: '',
    peserta_didik_id: 0,
    nama_grup: '',
    nama_prestasi: '',
    tingkat_prestasi: '',
    juara: '',
    penyelenggara: '',
    tanggal_lomba: '',
    keterangan: '',
    ekstrakurikuler_id: 0
})

// Lists
const tahunPelajaranList = ref<any[]>([])
const ekstrakurikulerList = ref<any[]>([])
const pesertaDidikList = ref<any[]>([])

// Peserta Didik dropdown
const pesertaDidikSearch = ref('')
const showPesertaDidikDropdown = ref(false)
const pesertaDidikDropdownRef = ref<HTMLElement>()
const currentPesertaDidikLabel = ref('')
const selectedNewPesertaDidik = ref<{ id: number; nama: string; nis: string } | null>(null)

// Team members
const anggotaTimList = ref<Array<{
    peserta_didik_id: number
    nama: string
    nis: string
    rombel_name: string
}>>([])
const showAddAnggota = ref(false)
const anggotaSearch = ref('')
const showAnggotaDropdown = ref(false)
const anggotaDropdownRef = ref<HTMLElement>()

// Photos
const photoPreviews = ref<Array<{
    file: File
    url: string
    size: number
    isThumbnail: boolean
}>>([])
const existingPhotos = ref<Array<{
    id: string
    filename: string
    url: string
    isThumbnail: boolean
}>>([])
const photosToDelete = ref<string[]>([])
const isDragging = ref(false)

// Photo modal state
const showPhotoModal = ref(false)
const currentPhotoUrl = ref('')
const currentPhotoFilename = ref('')
// Computed
const filteredPesertaDidik = computed(() => {
    if (!pesertaDidikSearch.value) return pesertaDidikList.value.slice(0, 10)
    
    const search = pesertaDidikSearch.value.toLowerCase()
    return pesertaDidikList.value.filter(pd => 
        pd.nama.toLowerCase().includes(search) ||
        pd.nis.toLowerCase().includes(search) ||
        pd.rombel?.name?.toLowerCase().includes(search)
    ).slice(0, 10)
})

const filteredAnggotaPesertaDidik = computed(() => {
    const usedIds = anggotaTimList.value.map(a => a.peserta_didik_id)
    let list = pesertaDidikList.value.filter(pd => !usedIds.includes(pd.id))
    
    if (anggotaSearch.value) {
        const search = anggotaSearch.value.toLowerCase()
        list = list.filter(pd => 
            pd.nama.toLowerCase().includes(search) ||
            pd.nis.toLowerCase().includes(search) ||
            pd.rombel?.name?.toLowerCase().includes(search)
        )
    }
    
    return list.slice(0, 10)
})

// Methods
const closeModal = () => {
    if (!isSubmitting.value) {
        emit('update:modelValue', false)
    }
}

const loadPrestasiData = async () => {
    if (!props.prestasiId) return

    isLoading.value = true
    formError.value = ''

    try {
        const response = await getPrestasiById(props.prestasiId)
        const prestasi = response.data

        form.value = {
            id: prestasi.id,
            tahun_pelajaran_id: prestasi.tahun_pelajaran_id || 0,
            jenis: prestasi.jenis || '',
            peserta_didik_id: prestasi.peserta_didik_id || 0,
            nama_grup: prestasi.nama_grup || '',
            nama_prestasi: prestasi.nama_prestasi || '',
            tingkat_prestasi: prestasi.tingkat_prestasi || '',
            juara: prestasi.juara || '',
            penyelenggara: prestasi.penyelenggara || '',
            tanggal_lomba: prestasi.tanggal_lomba ? prestasi.tanggal_lomba.substring(0, 10) : '',
            keterangan: prestasi.keterangan || '',
            ekstrakurikuler_id: prestasi.ekstrakurikuler_id || 0
        }

        // Set peserta didik label if individu
        if (prestasi.jenis === 'Individu' && prestasi.peserta_didik) {
            currentPesertaDidikLabel.value = `${prestasi.peserta_didik.nama} - NIS: ${prestasi.peserta_didik.nis} - Rombel: ${prestasi.peserta_didik.rombel?.name || '-'}`
        }

        // Set team members if tim
        if (prestasi.jenis === 'Tim' && prestasi.anggota_tim_prestasi && prestasi.anggota_tim_prestasi.length > 0) {
            anggotaTimList.value = prestasi.anggota_tim_prestasi.map((anggota: any) => ({
                peserta_didik_id: anggota.peserta_didik_id,
                nama: anggota.peserta_didik?.nama || '',
                nis: anggota.peserta_didik?.nis || '',
                rombel_name: anggota.peserta_didik?.rombel?.name || '-'
            }))
            console.log('Loaded anggota tim:', anggotaTimList.value)
        } else if (prestasi.jenis === 'Tim') {
            console.log('No anggota_tim_prestasi in response:', prestasi.anggota_tim_prestasi)
        }

        // Set existing photos
        if (prestasi.foto && prestasi.foto.length > 0) {
            existingPhotos.value = prestasi.foto.map((foto: any, index: number) => ({
                id: foto.id,
                filename: foto.filename,
                url: foto.url,
                isThumbnail: foto.thumbnail === 'active' || (index === 0 && !prestasi.foto.some((f: any) => f.thumbnail === 'active'))
            }))
        }

    } catch (error: any) {
        formError.value = 'Gagal memuat data prestasi'
        console.error('Error loading prestasi:', error)
    } finally {
        isLoading.value = false
    }
}

const loadTahunPelajaranList = async () => {
    try {
        const result = await tahunPelajaranStore.fetchTahunPelajarans(1, 100)
        if (result.success) {
            tahunPelajaranList.value = tahunPelajaranStore.tahunPelajarans
        }
    } catch (err) {
        console.error('Error loading tahun pelajaran:', err)
    }
}

const loadEkstrakurikulerList = async () => {
    try {
        const result = await ekstrakurikulerStore.fetchEkstrakurikulers(1, 100, { status: 'active' })
        if (result.success) {
            ekstrakurikulerList.value = ekstrakurikulerStore.ekstrakurikulers
        }
    } catch (err) {
        console.error('Error loading ekstrakurikuler:', err)
    }
}

const loadPesertaDidikList = async () => {
    try {
        const response = await getPesertaDidikList({}, 1, 1000)
        pesertaDidikList.value = response.data || []
    } catch (err) {
        console.error('Error loading peserta didik:', err)
    }
}
// Peserta Didik methods
const selectPesertaDidik = (pd: any) => {
    selectedNewPesertaDidik.value = { id: pd.id, nama: pd.nama, nis: pd.nis }
    pesertaDidikSearch.value = `${pd.nama} - NIS: ${pd.nis} - Rombel: ${pd.rombel?.name || '-'}`
    showPesertaDidikDropdown.value = false
}

const clearSelectedPesertaDidik = () => {
    selectedNewPesertaDidik.value = null
    pesertaDidikSearch.value = ''
}

// Team methods
const addAnggotaTim = (pd: any) => {
    anggotaTimList.value.push({
        peserta_didik_id: pd.id,
        nama: pd.nama,
        nis: pd.nis,
        rombel_name: pd.rombel?.name || '-'
    })
    showAddAnggota.value = false
    anggotaSearch.value = ''
    showAnggotaDropdown.value = false
}

const removeAnggotaTim = (index: number) => {
    anggotaTimList.value.splice(index, 1)
}

// Photo methods
const handlePhotoSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files) {
        handlePhotoFiles(Array.from(target.files))
    }
}

const handlePhotoDrop = (event: DragEvent) => {
    isDragging.value = false
    if (event.dataTransfer?.files) {
        handlePhotoFiles(Array.from(event.dataTransfer.files))
    }
}

const handlePhotoFiles = async (files: File[]) => {
    const totalExisting = existingPhotos.value.length + photoPreviews.value.length
    const remaining = 3 - totalExisting
    if (files.length > remaining) {
        formError.value = `Maksimal 3 foto. Sisa slot: ${remaining}`
        return
    }

    for (const file of files) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            formError.value = `File "${file.name}" bukan file gambar yang valid.`
            continue
        }

        // Validate file size (2MB)
        const maxSize = 2 * 1024 * 1024
        if (file.size > maxSize) {
            formError.value = `File "${file.name}" terlalu besar. Maksimal 2MB per foto.`
            continue
        }

        try {
            // Compress image
            const compressedFile = await compressImage(file, {
                maxWidth: 1200,
                maxHeight: 1200,
                quality: 0.8
            })

            // Create preview
            const reader = new FileReader()
            reader.onload = (e) => {
                if (e.target?.result) {
                    const hasAnyThumbnail = existingPhotos.value.some(p => p.isThumbnail) || 
                                          photoPreviews.value.some(p => p.isThumbnail)
                    
                    photoPreviews.value.push({
                        file: compressedFile,
                        url: e.target.result as string,
                        size: compressedFile.size,
                        isThumbnail: !hasAnyThumbnail && photoPreviews.value.length === 0 // First photo is thumbnail if no thumbnail exists
                    })
                }
            }
            reader.readAsDataURL(compressedFile)
        } catch (error) {
            console.error('Error compressing image:', error)
            formError.value = `Gagal memproses foto "${file.name}"`
        }
    }
}

const removePhoto = (index: number) => {
    const photo = photoPreviews.value[index]
    if (photo) {
        photoPreviews.value.splice(index, 1)
    }
}

const setThumbnail = (index: number) => {
    // Reset all thumbnails (both existing and new photos)
    existingPhotos.value.forEach(p => p.isThumbnail = false)
    photoPreviews.value.forEach(p => p.isThumbnail = false)
    
    // Set selected new photo as thumbnail
    const selectedPhoto = photoPreviews.value[index]
    if (selectedPhoto) {
        selectedPhoto.isThumbnail = true
    }
}

const setExistingThumbnail = (index: number) => {
    // Reset all thumbnails (both existing and new photos)
    existingPhotos.value.forEach(p => p.isThumbnail = false)
    photoPreviews.value.forEach(p => p.isThumbnail = false)
    
    // Set selected existing photo as thumbnail
    const selectedPhoto = existingPhotos.value[index]
    if (selectedPhoto) {
        selectedPhoto.isThumbnail = true
    }
}

// Photo modal methods
const openPhotoModal = (url: string, filename: string) => {
    currentPhotoUrl.value = url
    currentPhotoFilename.value = filename
    showPhotoModal.value = true
}

const closePhotoModal = () => {
    showPhotoModal.value = false
    currentPhotoUrl.value = ''
    currentPhotoFilename.value = ''
}

const removeExistingPhoto = (index: number) => {
    const photo = existingPhotos.value[index]
    if (photo) {
        // Add photo ID to delete list
        photosToDelete.value.push(photo.id)
        // Remove from existing photos
        existingPhotos.value.splice(index, 1)
    }
}
// Validation
const validateForm = () => {
    if (!form.value.tahun_pelajaran_id) {
        formError.value = 'Tahun pelajaran harus dipilih'
        return false
    }
    if (!form.value.jenis) {
        formError.value = 'Jenis harus dipilih'
        return false
    }
    if (form.value.jenis === 'Individu' && !form.value.peserta_didik_id) {
        formError.value = 'Peserta didik harus dipilih untuk jenis individu'
        return false
    }
    if (form.value.jenis === 'Tim' && !form.value.nama_grup.trim()) {
        formError.value = 'Nama grup harus diisi untuk jenis tim'
        return false
    }
    if (form.value.jenis === 'Tim' && anggotaTimList.value.length === 0) {
        formError.value = 'Minimal harus ada 1 anggota tim'
        return false
    }
    if (!form.value.nama_prestasi.trim()) {
        formError.value = 'Nama prestasi harus diisi'
        return false
    }
    if (!form.value.tingkat_prestasi) {
        formError.value = 'Tingkat prestasi harus dipilih'
        return false
    }
    if (!form.value.juara) {
        formError.value = 'Juara harus dipilih'
        return false
    }
    if (!form.value.tanggal_lomba) {
        formError.value = 'Tanggal lomba harus diisi'
        return false
    }
    return true
}

// Form submission
const handleSubmit = async () => {
    formError.value = ''

    if (!validateForm()) {
        return
    }

    isSubmitting.value = true

    try {
        const formData = new FormData()
        formData.append('id', form.value.id.toString())
        formData.append('jenis', form.value.jenis)
        formData.append('nama_prestasi', form.value.nama_prestasi)
        formData.append('tingkat_prestasi', form.value.tingkat_prestasi)
        formData.append('juara', form.value.juara)
        formData.append('penyelenggara', form.value.penyelenggara)
        formData.append('tanggal_lomba', form.value.tanggal_lomba)
        formData.append('keterangan', form.value.keterangan)
        formData.append('tahun_pelajaran_id', form.value.tahun_pelajaran_id.toString())

        if (form.value.jenis === 'Individu') {
            const pesertaDidikId = selectedNewPesertaDidik.value
                ? selectedNewPesertaDidik.value.id
                : form.value.peserta_didik_id
            formData.append('peserta_didik_id', pesertaDidikId.toString())
        } else {
            formData.append('nama_grup', form.value.nama_grup)
            formData.append('anggota_tim', JSON.stringify(anggotaTimList.value.map(a => ({
                peserta_didik_id: a.peserta_didik_id
            }))))
        }

        if (form.value.ekstrakurikuler_id > 0) {
            formData.append('ekstrakurikuler_id', form.value.ekstrakurikuler_id.toString())
        }

        // Add photos to delete
        if (photosToDelete.value.length > 0) {
            console.log('Photos to delete (IDs):', photosToDelete.value)
            formData.append('foto_to_delete', JSON.stringify(photosToDelete.value))
        }

        // Add existing photos thumbnail info
        const existingThumbnails = existingPhotos.value.map(p => ({
            filename: p.filename,
            is_thumbnail: p.isThumbnail
        }))
        if (existingThumbnails.length > 0) {
            formData.append('existing_thumbnails', JSON.stringify(existingThumbnails))
        }

        // Add photos
        photoPreviews.value.forEach((preview) => {
            formData.append('foto', preview.file)
        })

        // Add thumbnails for new photos
        const thumbnails = photoPreviews.value.map(p => p.isThumbnail ? 'active' : 'inactive')
        if (thumbnails.length > 0) {
            formData.append('foto_thumbnails', JSON.stringify(thumbnails))
        }

        const result = await prestasiStore.editPrestasi(formData)

        if (result.success) {
            isSubmitting.value = false
            toastStore.success('Berhasil!', 'Prestasi berhasil diperbarui')
            emit('success')
            closeModal()
        } else {
            formError.value = result.message
            emit('error')
        }
    } catch (error: any) {
        let message = 'Terjadi kesalahan saat memperbarui prestasi'
        
        if (error?.data?.errors && typeof error.data.errors === 'object') {
            const msgs = Object.values(error.data.errors).filter(m => m && typeof m === 'string') as string[]
            if (msgs.length > 0) {
                message = msgs[0] as string
            }
        } else if (error?.data?.error && typeof error.data.error === 'string') {
            message = error.data.error
        } else if (error?.data?.message && typeof error.data.message === 'string') {
            message = error.data.message
        } else if (error?.message && typeof error.message === 'string') {
            message = error.message
        }

        formError.value = message
        toastStore.error('Gagal memperbarui!', message)
        emit('error')
    } finally {
        isSubmitting.value = false
    }
}
// Click outside handlers
const handleClickOutside = (event: Event) => {
    const target = event.target as Node
    if (pesertaDidikDropdownRef.value && !pesertaDidikDropdownRef.value.contains(target)) {
        showPesertaDidikDropdown.value = false
    }
    if (anggotaDropdownRef.value && !anggotaDropdownRef.value.contains(target)) {
        showAnggotaDropdown.value = false
    }
}

// Watch for modal open/close
watch(() => props.modelValue, (newValue) => {
    if (newValue && props.prestasiId) {
        loadPrestasiData()
    } else {
        // Reset form when modal closes
        form.value = {
            id: 0,
            tahun_pelajaran_id: 0,
            jenis: '',
            peserta_didik_id: 0,
            nama_grup: '',
            nama_prestasi: '',
            tingkat_prestasi: '',
            juara: '',
            penyelenggara: '',
            tanggal_lomba: '',
            keterangan: '',
            ekstrakurikuler_id: 0
        }
        pesertaDidikSearch.value = ''
        currentPesertaDidikLabel.value = ''
        selectedNewPesertaDidik.value = null
        anggotaTimList.value = []
        photoPreviews.value = []
        existingPhotos.value = []
        photosToDelete.value = []
        formError.value = ''
        showPesertaDidikDropdown.value = false
        showAddAnggota.value = false
        anggotaSearch.value = ''
        showAnggotaDropdown.value = false
    }
})

// Load initial data
onMounted(async () => {
    await Promise.all([
        loadTahunPelajaranList(),
        loadEkstrakurikulerList(),
        loadPesertaDidikList()
    ])
    
    // Add click outside listeners
    document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>