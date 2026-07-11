<template>
    <DashboardLayout>
        <!-- Header -->
        <div class="mb-6">
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Profil Saya</h1>
            <p class="text-sm sm:text-base text-gray-600 mt-1">Kelola informasi profil dan dokumen Anda</p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-20">
            <div class="text-center">
                <div class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600 mb-4"></div>
                <p class="text-gray-600 font-medium">Memuat profil...</p>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <i class="fa-solid fa-exclamation-circle text-3xl text-red-600"></i>
            </div>
            <p class="text-red-900 font-bold text-lg mb-2">Gagal memuat profil</p>
            <p class="text-red-700 text-sm mb-6">{{ error }}</p>
            <button @click="loadProfile" class="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold">
                <i class="fa-solid fa-refresh mr-2"></i>Coba Lagi
            </button>
        </div>

        <!-- Profile Content -->
        <div v-else-if="profileData" class="space-y-6">
            <!-- Profile Header Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <!-- Header Background -->
                <div class="h-32 sm:h-40 bg-gradient-to-r from-red-600 via-red-500 to-pink-600 relative">
                    <div class="absolute inset-0 bg-black/10 -z-10"></div>
                    <!-- Action Buttons - Top Right -->
                    <div class="absolute top-4 right-4 flex flex-wrap gap-2 z-20">
                        <button v-if="!isEditMode && hasPermission('UPDATE_PROFILE_USER')" @click="startEdit" 
                            class="inline-flex items-center gap-2 px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition font-semibold text-sm shadow-md cursor-pointer">
                            <i class="fa-solid fa-edit"></i>
                            <span class="hidden sm:inline">Edit Profil</span>
                        </button>
                        <button v-if="!isEditMode && hasPermission('UPDATE_PROFILE_USER')" @click="showChangePassword = true" 
                            class="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold text-sm shadow-md cursor-pointer">
                            <i class="fa-solid fa-key"></i>
                            <span class="hidden sm:inline">Ubah Password</span>
                        </button>
                        <button v-if="isEditMode" @click="saveProfile" :disabled="isSaving"
                            class="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition font-semibold text-sm shadow-md disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
                            <i v-if="isSaving" class="fa-solid fa-spinner fa-spin"></i>
                            <i v-else class="fa-solid fa-save"></i>
                            <span class="hidden sm:inline">{{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}</span>
                        </button>
                        <button v-if="isEditMode" @click="cancelEdit" :disabled="isSaving"
                            class="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition font-semibold text-sm shadow-md disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
                            <i class="fa-solid fa-times"></i>
                            <span class="hidden sm:inline">Batal</span>
                        </button>
                    </div>
                </div>
                
                <!-- Profile Info -->
                <div class="px-6 sm:px-8 pb-6">
                    <!-- Avatar & Name Section -->
                    <div class="flex flex-col sm:flex-row items-center sm:items-center gap-6 -mt-20 sm:-mt-24 relative z-10">
                        <!-- Avatar -->
                        <div class="relative flex-shrink-0">
                            <div v-if="photoPreview || profileData.foto" 
                                class="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl shadow-xl overflow-hidden border-4 border-white bg-white">
                                <img :src="photoPreview || profileData.foto" alt="Foto Profil" 
                                    class="w-full h-full object-cover" />
                            </div>
                            <div v-else class="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl shadow-xl border-4 border-white bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center">
                                <i class="fa-solid fa-user text-5xl sm:text-6xl text-red-300"></i>
                            </div>
                            <!-- Upload Foto Button -->
                            <label v-if="isEditMode" 
                                class="absolute bottom-2 right-2 w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-xl flex items-center justify-center cursor-pointer hover:bg-red-700 transition shadow-lg hover:scale-105">
                                <i class="fa-solid fa-camera text-white text-sm sm:text-base"></i>
                                <input type="file" accept="image/*" @change="handlePhotoChange" class="hidden" />
                            </label>
                        </div>
                        
                        <!-- Name & Info Container -->
                        <div class="flex-1 w-full">
                            <div class="bg-white rounded-xl p-5 shadow-lg border border-gray-200">
                                <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{{ profileData.nama }}</h2>
                                <p class="text-base sm:text-lg text-gray-600 mb-4">{{ profileData.username }}</p>
                                <div class="flex flex-wrap gap-2">
                                    <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-800 rounded-lg text-xs font-semibold">
                                        <i class="fa-solid fa-briefcase"></i>
                                        {{ profileData.jabatan || 'Tidak ada jabatan' }}
                                    </span>
                                    <span :class="[
                                        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold',
                                        profileData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    ]">
                                        <span :class="['w-2 h-2 rounded-full', profileData.status === 'active' ? 'bg-green-600' : 'bg-gray-600']"></span>
                                        {{ profileData.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Divider -->
                    <div class="my-6 border-t border-gray-200"></div>

                    <!-- Info Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Nama Lengkap -->
                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                                <i class="fa-solid fa-user text-red-600"></i>
                                Nama Lengkap
                            </label>
                            <p class="text-gray-900 font-semibold">{{ profileData.nama }}</p>
                        </div>
                        
                        <!-- Username -->
                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                                <i class="fa-solid fa-at text-red-600"></i>
                                Username
                            </label>
                            <p class="text-gray-900 font-semibold">{{ profileData.username }}</p>
                        </div>
                        
                        <!-- NIP -->
                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                                <i class="fa-solid fa-id-card text-red-600"></i>
                                NIP
                            </label>
                            <p class="text-gray-900 font-semibold">{{ profileData.nip || '-' }}</p>
                        </div>
                        
                        <!-- NKKI -->
                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                                <i class="fa-solid fa-id-badge text-red-600"></i>
                                NKKI
                            </label>
                            <p class="text-gray-900 font-semibold">{{ profileData.nkki || '-' }}</p>
                        </div>
                        
                        <!-- Kategori -->
                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                                <i class="fa-solid fa-layer-group text-red-600"></i>
                                Kategori
                            </label>
                            <p class="text-gray-900 font-semibold">{{ profileData.kategori || '-' }}</p>
                        </div>
                        
                        <!-- Jabatan -->
                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                                <i class="fa-solid fa-briefcase text-red-600"></i>
                                Jabatan
                            </label>
                            <p class="text-gray-900 font-semibold">{{ profileData.jabatan || '-' }}</p>
                        </div>
                        
                        <!-- Bidang Studi -->
                        <div v-if="profileData.bidang_studi" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                                <i class="fa-solid fa-book text-red-600"></i>
                                Bidang Studi
                            </label>
                            <p class="text-gray-900 font-semibold">{{ profileData.bidang_studi?.nama || profileData.bidang_studi?.name || '-' }}</p>
                        </div>
                        
                        <!-- Rombel Wali Kelas -->
                        <div v-if="profileData.rombel_guru_kelas" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                                <i class="fa-solid fa-chalkboard-user text-red-600"></i>
                                Rombel Wali Kelas
                            </label>
                            <p class="text-gray-900 font-semibold">{{ profileData.rombel_guru_kelas?.name || '-' }}</p>
                        </div>
                        
                        <!-- Rombel Bidang Studi -->
                        <div v-if="profileData.rombel_bidang_studi && profileData.rombel_bidang_studi.length > 0" class="bg-gray-50 rounded-lg p-4 border border-gray-200 md:col-span-2">
                            <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-3">
                                <i class="fa-solid fa-users-class text-red-600"></i>
                                Rombel yang Diampu (Guru Bidang Studi)
                            </label>
                            <div class="flex flex-wrap gap-2">
                                <span v-for="rombel in profileData.rombel_bidang_studi" :key="rombel.id" 
                                    class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-xs font-semibold">
                                    <i class="fa-solid fa-users"></i>
                                    {{ rombel.name }}
                                </span>
                            </div>
                        </div>
                        
                        <!-- Role -->
                        <div v-if="profileData.roles && profileData.roles.length > 0" class="bg-gray-50 rounded-lg p-4 border border-gray-200 md:col-span-2">
                            <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-3">
                                <i class="fa-solid fa-shield-halved text-red-600"></i>
                                Role & Hak Akses
                            </label>
                            <div class="flex flex-wrap gap-2">
                                <span v-for="role in profileData.roles" :key="role.id" 
                                    class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-xs font-semibold">
                                    <i class="fa-solid fa-user-shield"></i>
                                    {{ role.name }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Dokumen Section -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-5 relative overflow-hidden">
                    <div class="absolute inset-0 bg-black/10"></div>
                    <div class="relative z-10">
                        <h3 class="text-xl font-bold text-white flex items-center gap-2">
                            <i class="fa-solid fa-folder-open"></i>
                            Dokumen Kepegawaian
                        </h3>
                        <p class="text-sm text-red-100 mt-1">Upload dan kelola dokumen pendukung Anda</p>
                    </div>
                </div>
                
                <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <!-- KK -->
                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-3">
                                <i class="fa-solid fa-file-pdf text-red-600"></i>
                                Kartu Keluarga (KK)
                            </label>
                            <div v-if="profileData.kk" class="mb-3">
                                <a :href="profileData.kk" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-semibold w-full justify-center border border-blue-200">
                                    <i class="fa-solid fa-download"></i><span>Lihat Dokumen</span>
                                </a>
                                <p class="text-xs text-green-600 mt-2"><i class="fa-solid fa-check-circle"></i> Sudah diupload</p>
                            </div>
                            <div v-else class="mb-3">
                                <div class="px-4 py-2 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg text-sm">
                                    <i class="fa-solid fa-exclamation-circle"></i> Belum ada dokumen
                                </div>
                            </div>
                            <div v-if="isEditMode" class="pt-3 border-t border-gray-300">
                                <!-- Preview file yang dipilih -->
                                <div v-if="documentPreviews.kk" class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div class="flex items-start gap-2">
                                        <i class="fa-solid fa-file text-blue-600 text-lg mt-0.5"></i>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-semibold text-blue-900 truncate">{{ documentPreviews.kk.name }}</p>
                                            <p class="text-xs text-blue-700 mt-0.5">{{ documentPreviews.kk.size }}</p>
                                        </div>
                                        <button @click="documentFiles.kk = undefined; documentPreviews.kk = undefined" 
                                            class="text-blue-600 hover:text-blue-800 transition">
                                            <i class="fa-solid fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="relative">
                                    <label class="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition cursor-pointer group">
                                        <i class="fa-solid fa-cloud-arrow-up text-xl text-gray-400 group-hover:text-red-600 transition"></i>
                                        <span class="text-sm font-semibold text-gray-600 group-hover:text-red-600 transition">
                                            Pilih File
                                        </span>
                                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" @change="(e) => handleDocumentChange('kk', e)" class="absolute inset-0 opacity-0 cursor-pointer" />
                                    </label>
                                </div>
                                <p class="text-xs text-gray-500 mt-2 text-center">PDF, JPG, PNG • Maks 2MB</p>
                            </div>
                        </div>

                        <!-- Akta Lahir -->
                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-3">
                                <i class="fa-solid fa-file-pdf text-red-600"></i>
                                Akta Lahir
                            </label>
                            <div v-if="profileData.akta_lahir" class="mb-3">
                                <a :href="profileData.akta_lahir" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-semibold w-full justify-center border border-blue-200">
                                    <i class="fa-solid fa-download"></i><span>Lihat Dokumen</span>
                                </a>
                                <p class="text-xs text-green-600 mt-2"><i class="fa-solid fa-check-circle"></i> Sudah diupload</p>
                            </div>
                            <div v-else class="mb-3">
                                <div class="px-4 py-2 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg text-sm">
                                    <i class="fa-solid fa-exclamation-circle"></i> Belum ada dokumen
                                </div>
                            </div>
                            <div v-if="isEditMode" class="pt-3 border-t border-gray-300">
                                <div v-if="documentPreviews.akta_lahir" class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div class="flex items-start gap-2">
                                        <i class="fa-solid fa-file text-blue-600 text-lg mt-0.5"></i>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-semibold text-blue-900 truncate">{{ documentPreviews.akta_lahir.name }}</p>
                                            <p class="text-xs text-blue-700 mt-0.5">{{ documentPreviews.akta_lahir.size }}</p>
                                        </div>
                                        <button @click="removeDocumentPreview('akta_lahir')" class="text-blue-600 hover:text-blue-800 transition">
                                            <i class="fa-solid fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="relative">
                                    <label class="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition cursor-pointer group">
                                        <i class="fa-solid fa-cloud-arrow-up text-xl text-gray-400 group-hover:text-red-600 transition"></i>
                                        <span class="text-sm font-semibold text-gray-600 group-hover:text-red-600 transition">Pilih File</span>
                                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" @change="(e) => handleDocumentChange('akta_lahir', e)" class="absolute inset-0 opacity-0 cursor-pointer" />
                                    </label>
                                </div>
                                <p class="text-xs text-gray-500 mt-2 text-center">PDF, JPG, PNG • Maks 2MB</p>
                            </div>
                        </div>

                        <!-- KTP -->
                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-3">
                                <i class="fa-solid fa-file-pdf text-red-600"></i>
                                KTP
                            </label>
                            <div v-if="profileData.ktp" class="mb-3">
                                <a :href="profileData.ktp" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-semibold w-full justify-center border border-blue-200">
                                    <i class="fa-solid fa-download"></i><span>Lihat Dokumen</span>
                                </a>
                                <p class="text-xs text-green-600 mt-2"><i class="fa-solid fa-check-circle"></i> Sudah diupload</p>
                            </div>
                            <div v-else class="mb-3">
                                <div class="px-4 py-2 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg text-sm">
                                    <i class="fa-solid fa-exclamation-circle"></i> Belum ada dokumen
                                </div>
                            </div>
                            <div v-if="isEditMode" class="pt-3 border-t border-gray-300">
                                <div v-if="documentPreviews.ktp" class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div class="flex items-start gap-2">
                                        <i class="fa-solid fa-file text-blue-600 text-lg mt-0.5"></i>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-semibold text-blue-900 truncate">{{ documentPreviews.ktp.name }}</p>
                                            <p class="text-xs text-blue-700 mt-0.5">{{ documentPreviews.ktp.size }}</p>
                                        </div>
                                        <button @click="removeDocumentPreview('ktp')" class="text-blue-600 hover:text-blue-800 transition">
                                            <i class="fa-solid fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="relative">
                                    <label class="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition cursor-pointer group">
                                        <i class="fa-solid fa-cloud-arrow-up text-xl text-gray-400 group-hover:text-red-600 transition"></i>
                                        <span class="text-sm font-semibold text-gray-600 group-hover:text-red-600 transition">Pilih File</span>
                                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" @change="(e) => handleDocumentChange('ktp', e)" class="absolute inset-0 opacity-0 cursor-pointer" />
                                    </label>
                                </div>
                                <p class="text-xs text-gray-500 mt-2 text-center">PDF, JPG, PNG • Maks 2MB</p>
                            </div>
                        </div>

                        <!-- Ijazah SD -->
                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-3">
                                <i class="fa-solid fa-file-pdf text-red-600"></i>
                                Ijazah SD
                            </label>
                            <div v-if="profileData.ijazah_sd" class="mb-3">
                                <a :href="profileData.ijazah_sd" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-semibold w-full justify-center border border-blue-200">
                                    <i class="fa-solid fa-download"></i><span>Lihat Dokumen</span>
                                </a>
                                <p class="text-xs text-green-600 mt-2"><i class="fa-solid fa-check-circle"></i> Sudah diupload</p>
                            </div>
                            <div v-else class="mb-3">
                                <div class="px-4 py-2 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg text-sm">
                                    <i class="fa-solid fa-exclamation-circle"></i> Belum ada dokumen
                                </div>
                            </div>
                            <div v-if="isEditMode" class="pt-3 border-t border-gray-300">
                                <div v-if="documentPreviews.ijazah_sd" class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div class="flex items-start gap-2">
                                        <i class="fa-solid fa-file text-blue-600 text-lg mt-0.5"></i>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-semibold text-blue-900 truncate">{{ documentPreviews.ijazah_sd.name }}</p>
                                            <p class="text-xs text-blue-700 mt-0.5">{{ documentPreviews.ijazah_sd.size }}</p>
                                        </div>
                                        <button @click="removeDocumentPreview('ijazah_sd')" class="text-blue-600 hover:text-blue-800 transition">
                                            <i class="fa-solid fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="relative">
                                    <label class="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition cursor-pointer group">
                                        <i class="fa-solid fa-cloud-arrow-up text-xl text-gray-400 group-hover:text-red-600 transition"></i>
                                        <span class="text-sm font-semibold text-gray-600 group-hover:text-red-600 transition">Pilih File</span>
                                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" @change="(e) => handleDocumentChange('ijazah_sd', e)" class="absolute inset-0 opacity-0 cursor-pointer" />
                                    </label>
                                </div>
                                <p class="text-xs text-gray-500 mt-2 text-center">PDF, JPG, PNG • Maks 2MB</p>
                            </div>
                        </div>

                        <!-- Ijazah SMP -->
                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-3">
                                <i class="fa-solid fa-file-pdf text-red-600"></i>
                                Ijazah SMP
                            </label>
                            <div v-if="profileData.ijazah_smp" class="mb-3">
                                <a :href="profileData.ijazah_smp" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-semibold w-full justify-center border border-blue-200">
                                    <i class="fa-solid fa-download"></i><span>Lihat Dokumen</span>
                                </a>
                                <p class="text-xs text-green-600 mt-2"><i class="fa-solid fa-check-circle"></i> Sudah diupload</p>
                            </div>
                            <div v-else class="mb-3">
                                <div class="px-4 py-2 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg text-sm">
                                    <i class="fa-solid fa-exclamation-circle"></i> Belum ada dokumen
                                </div>
                            </div>
                            <div v-if="isEditMode" class="pt-3 border-t border-gray-300">
                                <div v-if="documentPreviews.ijazah_smp" class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div class="flex items-start gap-2">
                                        <i class="fa-solid fa-file text-blue-600 text-lg mt-0.5"></i>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-semibold text-blue-900 truncate">{{ documentPreviews.ijazah_smp.name }}</p>
                                            <p class="text-xs text-blue-700 mt-0.5">{{ documentPreviews.ijazah_smp.size }}</p>
                                        </div>
                                        <button @click="removeDocumentPreview('ijazah_smp')" class="text-blue-600 hover:text-blue-800 transition">
                                            <i class="fa-solid fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="relative">
                                    <label class="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition cursor-pointer group">
                                        <i class="fa-solid fa-cloud-arrow-up text-xl text-gray-400 group-hover:text-red-600 transition"></i>
                                        <span class="text-sm font-semibold text-gray-600 group-hover:text-red-600 transition">Pilih File</span>
                                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" @change="(e) => handleDocumentChange('ijazah_smp', e)" class="absolute inset-0 opacity-0 cursor-pointer" />
                                    </label>
                                </div>
                                <p class="text-xs text-gray-500 mt-2 text-center">PDF, JPG, PNG • Maks 2MB</p>
                            </div>
                        </div>

                        <!-- Continue for remaining documents... -->
                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-3">
                                <i class="fa-solid fa-file-pdf text-red-600"></i>
                                Ijazah SMA
                            </label>
                            <div v-if="profileData.ijazah_sma" class="mb-3">
                                <a :href="profileData.ijazah_sma" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-semibold w-full justify-center border border-blue-200">
                                    <i class="fa-solid fa-download"></i><span>Lihat Dokumen</span>
                                </a>
                                <p class="text-xs text-green-600 mt-2"><i class="fa-solid fa-check-circle"></i> Sudah diupload</p>
                            </div>
                            <div v-else class="mb-3">
                                <div class="px-4 py-2 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg text-sm">
                                    <i class="fa-solid fa-exclamation-circle"></i> Belum ada dokumen
                                </div>
                            </div>
                            <div v-if="isEditMode" class="pt-3 border-t border-gray-300">
                                <div v-if="documentPreviews.ijazah_sma" class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div class="flex items-start gap-2">
                                        <i class="fa-solid fa-file text-blue-600 text-lg mt-0.5"></i>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-semibold text-blue-900 truncate">{{ documentPreviews.ijazah_sma.name }}</p>
                                            <p class="text-xs text-blue-700 mt-0.5">{{ documentPreviews.ijazah_sma.size }}</p>
                                        </div>
                                        <button @click="removeDocumentPreview('ijazah_sma')" class="text-blue-600 hover:text-blue-800 transition">
                                            <i class="fa-solid fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="relative">
                                    <label class="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition cursor-pointer group">
                                        <i class="fa-solid fa-cloud-arrow-up text-xl text-gray-400 group-hover:text-red-600 transition"></i>
                                        <span class="text-sm font-semibold text-gray-600 group-hover:text-red-600 transition">Pilih File</span>
                                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" @change="(e) => handleDocumentChange('ijazah_sma', e)" class="absolute inset-0 opacity-0 cursor-pointer" />
                                    </label>
                                </div>
                                <p class="text-xs text-gray-500 mt-2 text-center">PDF, JPG, PNG • Maks 2MB</p>
                            </div>
                        </div>

                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-3">
                                <i class="fa-solid fa-file-pdf text-red-600"></i>
                                Ijazah S1
                            </label>
                            <div v-if="profileData.ijazah_s1" class="mb-3">
                                <a :href="profileData.ijazah_s1" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-semibold w-full justify-center border border-blue-200">
                                    <i class="fa-solid fa-download"></i><span>Lihat Dokumen</span>
                                </a>
                                <p class="text-xs text-green-600 mt-2"><i class="fa-solid fa-check-circle"></i> Sudah diupload</p>
                            </div>
                            <div v-else class="mb-3">
                                <div class="px-4 py-2 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg text-sm">
                                    <i class="fa-solid fa-exclamation-circle"></i> Belum ada dokumen
                                </div>
                            </div>
                            <div v-if="isEditMode" class="pt-3 border-t border-gray-300">
                                <div v-if="documentPreviews.ijazah_s1" class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div class="flex items-start gap-2">
                                        <i class="fa-solid fa-file text-blue-600 text-lg mt-0.5"></i>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-semibold text-blue-900 truncate">{{ documentPreviews.ijazah_s1.name }}</p>
                                            <p class="text-xs text-blue-700 mt-0.5">{{ documentPreviews.ijazah_s1.size }}</p>
                                        </div>
                                        <button @click="removeDocumentPreview('ijazah_s1')" class="text-blue-600 hover:text-blue-800 transition">
                                            <i class="fa-solid fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="relative">
                                    <label class="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition cursor-pointer group">
                                        <i class="fa-solid fa-cloud-arrow-up text-xl text-gray-400 group-hover:text-red-600 transition"></i>
                                        <span class="text-sm font-semibold text-gray-600 group-hover:text-red-600 transition">Pilih File</span>
                                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" @change="(e) => handleDocumentChange('ijazah_s1', e)" class="absolute inset-0 opacity-0 cursor-pointer" />
                                    </label>
                                </div>
                                <p class="text-xs text-gray-500 mt-2 text-center">PDF, JPG, PNG • Maks 2MB</p>
                            </div>
                        </div>

                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-3">
                                <i class="fa-solid fa-file-pdf text-red-600"></i>
                                Ijazah S2
                            </label>
                            <div v-if="profileData.ijazah_s2" class="mb-3">
                                <a :href="profileData.ijazah_s2" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-semibold w-full justify-center border border-blue-200">
                                    <i class="fa-solid fa-download"></i><span>Lihat Dokumen</span>
                                </a>
                                <p class="text-xs text-green-600 mt-2"><i class="fa-solid fa-check-circle"></i> Sudah diupload</p>
                            </div>
                            <div v-else class="mb-3">
                                <div class="px-4 py-2 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg text-sm">
                                    <i class="fa-solid fa-exclamation-circle"></i> Belum ada dokumen
                                </div>
                            </div>
                            <div v-if="isEditMode" class="pt-3 border-t border-gray-300">
                                <div v-if="documentPreviews.ijazah_s2" class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div class="flex items-start gap-2">
                                        <i class="fa-solid fa-file text-blue-600 text-lg mt-0.5"></i>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-semibold text-blue-900 truncate">{{ documentPreviews.ijazah_s2.name }}</p>
                                            <p class="text-xs text-blue-700 mt-0.5">{{ documentPreviews.ijazah_s2.size }}</p>
                                        </div>
                                        <button @click="removeDocumentPreview('ijazah_s2')" class="text-blue-600 hover:text-blue-800 transition">
                                            <i class="fa-solid fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="relative">
                                    <label class="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition cursor-pointer group">
                                        <i class="fa-solid fa-cloud-arrow-up text-xl text-gray-400 group-hover:text-red-600 transition"></i>
                                        <span class="text-sm font-semibold text-gray-600 group-hover:text-red-600 transition">Pilih File</span>
                                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" @change="(e) => handleDocumentChange('ijazah_s2', e)" class="absolute inset-0 opacity-0 cursor-pointer" />
                                    </label>
                                </div>
                                <p class="text-xs text-gray-500 mt-2 text-center">PDF, JPG, PNG • Maks 2MB</p>
                            </div>
                        </div>

                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-3">
                                <i class="fa-solid fa-file-pdf text-red-600"></i>
                                Ijazah S3
                            </label>
                            <div v-if="profileData.ijazah_s3" class="mb-3">
                                <a :href="profileData.ijazah_s3" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-semibold w-full justify-center border border-blue-200">
                                    <i class="fa-solid fa-download"></i><span>Lihat Dokumen</span>
                                </a>
                                <p class="text-xs text-green-600 mt-2"><i class="fa-solid fa-check-circle"></i> Sudah diupload</p>
                            </div>
                            <div v-else class="mb-3">
                                <div class="px-4 py-2 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg text-sm">
                                    <i class="fa-solid fa-exclamation-circle"></i> Belum ada dokumen
                                </div>
                            </div>
                            <div v-if="isEditMode" class="pt-3 border-t border-gray-300">
                                <div v-if="documentPreviews.ijazah_s3" class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div class="flex items-start gap-2">
                                        <i class="fa-solid fa-file text-blue-600 text-lg mt-0.5"></i>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-semibold text-blue-900 truncate">{{ documentPreviews.ijazah_s3.name }}</p>
                                            <p class="text-xs text-blue-700 mt-0.5">{{ documentPreviews.ijazah_s3.size }}</p>
                                        </div>
                                        <button @click="removeDocumentPreview('ijazah_s3')" class="text-blue-600 hover:text-blue-800 transition">
                                            <i class="fa-solid fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="relative">
                                    <label class="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition cursor-pointer group">
                                        <i class="fa-solid fa-cloud-arrow-up text-xl text-gray-400 group-hover:text-red-600 transition"></i>
                                        <span class="text-sm font-semibold text-gray-600 group-hover:text-red-600 transition">Pilih File</span>
                                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" @change="(e) => handleDocumentChange('ijazah_s3', e)" class="absolute inset-0 opacity-0 cursor-pointer" />
                                    </label>
                                </div>
                                <p class="text-xs text-gray-500 mt-2 text-center">PDF, JPG, PNG • Maks 2MB</p>
                            </div>
                        </div>

                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-3">
                                <i class="fa-solid fa-file-pdf text-red-600"></i>
                                Sertifikat Pendidik
                            </label>
                            <div v-if="profileData.sertifikat_pendidik" class="mb-3">
                                <a :href="profileData.sertifikat_pendidik" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-semibold w-full justify-center border border-blue-200">
                                    <i class="fa-solid fa-download"></i><span>Lihat Dokumen</span>
                                </a>
                                <p class="text-xs text-green-600 mt-2"><i class="fa-solid fa-check-circle"></i> Sudah diupload</p>
                            </div>
                            <div v-else class="mb-3">
                                <div class="px-4 py-2 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg text-sm">
                                    <i class="fa-solid fa-exclamation-circle"></i> Belum ada dokumen
                                </div>
                            </div>
                            <div v-if="isEditMode" class="pt-3 border-t border-gray-300">
                                <div v-if="documentPreviews.sertifikat_pendidik" class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div class="flex items-start gap-2">
                                        <i class="fa-solid fa-file text-blue-600 text-lg mt-0.5"></i>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-semibold text-blue-900 truncate">{{ documentPreviews.sertifikat_pendidik.name }}</p>
                                            <p class="text-xs text-blue-700 mt-0.5">{{ documentPreviews.sertifikat_pendidik.size }}</p>
                                        </div>
                                        <button @click="removeDocumentPreview('sertifikat_pendidik')" class="text-blue-600 hover:text-blue-800 transition">
                                            <i class="fa-solid fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="relative">
                                    <label class="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition cursor-pointer group">
                                        <i class="fa-solid fa-cloud-arrow-up text-xl text-gray-400 group-hover:text-red-600 transition"></i>
                                        <span class="text-sm font-semibold text-gray-600 group-hover:text-red-600 transition">Pilih File</span>
                                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" @change="(e) => handleDocumentChange('sertifikat_pendidik', e)" class="absolute inset-0 opacity-0 cursor-pointer" />
                                    </label>
                                </div>
                                <p class="text-xs text-gray-500 mt-2 text-center">PDF, JPG, PNG • Maks 2MB</p>
                            </div>
                        </div>

                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-3">
                                <i class="fa-solid fa-file-pdf text-red-600"></i>
                                SK Pengangkatan
                            </label>
                            <div v-if="profileData.sk" class="mb-3">
                                <a :href="profileData.sk" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-semibold w-full justify-center border border-blue-200">
                                    <i class="fa-solid fa-download"></i><span>Lihat Dokumen</span>
                                </a>
                                <p class="text-xs text-green-600 mt-2"><i class="fa-solid fa-check-circle"></i> Sudah diupload</p>
                            </div>
                            <div v-else class="mb-3">
                                <div class="px-4 py-2 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg text-sm">
                                    <i class="fa-solid fa-exclamation-circle"></i> Belum ada dokumen
                                </div>
                            </div>
                            <div v-if="isEditMode" class="pt-3 border-t border-gray-300">
                                <div v-if="documentPreviews.sk" class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div class="flex items-start gap-2">
                                        <i class="fa-solid fa-file text-blue-600 text-lg mt-0.5"></i>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-semibold text-blue-900 truncate">{{ documentPreviews.sk.name }}</p>
                                            <p class="text-xs text-blue-700 mt-0.5">{{ documentPreviews.sk.size }}</p>
                                        </div>
                                        <button @click="removeDocumentPreview('sk')" class="text-blue-600 hover:text-blue-800 transition">
                                            <i class="fa-solid fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="relative">
                                    <label class="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition cursor-pointer group">
                                        <i class="fa-solid fa-cloud-arrow-up text-xl text-gray-400 group-hover:text-red-600 transition"></i>
                                        <span class="text-sm font-semibold text-gray-600 group-hover:text-red-600 transition">Pilih File</span>
                                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" @change="(e) => handleDocumentChange('sk', e)" class="absolute inset-0 opacity-0 cursor-pointer" />
                                    </label>
                                </div>
                                <p class="text-xs text-gray-500 mt-2 text-center">PDF, JPG, PNG • Maks 2MB</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Change Password Modal -->
        <div v-if="showChangePassword" class="fixed inset-0 backdrop-blur-sm bg-black/20 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-xl shadow-2xl max-w-md w-full animate-scale-in">
                <div class="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-4 rounded-t-xl">
                    <div class="flex items-center justify-between">
                        <h3 class="text-xl font-bold text-white flex items-center gap-2">
                            <i class="fa-solid fa-key"></i>
                            Ubah Password
                        </h3>
                        <button @click="cancelChangePassword" class="text-white hover:text-red-100 transition cursor-pointer">
                            <i class="fa-solid fa-times text-2xl"></i>
                        </button>
                    </div>
                </div>
                
                <form @submit.prevent="changePassword" class="p-6 space-y-4">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Password Baru</label>
                        <div class="relative">
                            <input v-model="passwordForm.newPassword" :type="showNewPassword ? 'text' : 'password'" required minlength="6"
                                class="w-full px-4 py-2.5 pr-12 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition">
                            <button type="button" @click="showNewPassword = !showNewPassword" 
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer">
                                <i :class="showNewPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                            </button>
                        </div>
                        <p class="text-xs text-gray-500 mt-1">Minimal 6 karakter</p>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Konfirmasi Password Baru</label>
                        <div class="relative">
                            <input v-model="passwordForm.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" required
                                class="w-full px-4 py-2.5 pr-12 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition">
                            <button type="button" @click="showConfirmPassword = !showConfirmPassword" 
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer">
                                <i :class="showConfirmPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                            </button>
                        </div>
                    </div>

                    <div class="flex gap-3 pt-4">
                        <button type="submit" :disabled="isSaving"
                            class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
                            <i v-if="isSaving" class="fa-solid fa-spinner fa-spin"></i>
                            <span>{{ isSaving ? 'Menyimpan...' : 'Ubah Password' }}</span>
                        </button>
                        <button type="button" @click="cancelChangePassword" :disabled="isSaving"
                            class="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from '~/composables/useToast'
import { useAuth } from '~/composables/useAuth'
import { getKepegawaianById, updateKepegawaian } from '~/services/kepegawaian'
import DashboardLayout from '~/components/DashboardLayout.vue'

definePageMeta({
    middleware: 'auth',
    layout: 'default'
})

useHead({
    title: 'Profil Saya | PINTU SDN Sukapura 01',
    link: [{ rel: 'icon', type: 'image/jpeg', href: '/logo-sekolah.jpg' }]
})

const { success: showSuccessToast, error: showErrorToast } = useToast()
const { hasPermission } = useAuth()
const isLoading = ref(false)
const isSaving = ref(false)
const error = ref<string | null>(null)
const profileData = ref<any>(null)
const isEditMode = ref(false)
const showChangePassword = ref(false)
const photoPreview = ref<string | null>(null)
const editForm = ref({ nama: '', username: '' })
const documentFiles = ref<Record<string, File>>({})
const documentPreviews = ref<Record<string, { name: string; size: string }>>({})
const photoFile = ref<File | null>(null)
const passwordForm = ref({ newPassword: '', confirmPassword: '' })
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const documentFields = [
    { key: 'akta_lahir', label: 'Akta Lahir' },
    { key: 'ktp', label: 'KTP' },
    { key: 'ijazah_sd', label: 'Ijazah SD' },
    { key: 'ijazah_smp', label: 'Ijazah SMP' },
    { key: 'ijazah_sma', label: 'Ijazah SMA' },
    { key: 'ijazah_s1', label: 'Ijazah S1' },
    { key: 'ijazah_s2', label: 'Ijazah S2' },
    { key: 'ijazah_s3', label: 'Ijazah S3' },
    { key: 'sertifikat_pendidik', label: 'Sertifikat Pendidik' },
    { key: 'sk', label: 'SK Pengangkatan' }
]

const removeDocumentPreview = (field: string) => {
    delete documentFiles.value[field]
    delete documentPreviews.value[field]
}

const loadProfile = async () => {
    isLoading.value = true
    error.value = null
    try {
        const userStr = localStorage.getItem('auth_user')
        if (!userStr) throw new Error('User data tidak ditemukan')
        const user = JSON.parse(userStr)
        const response = await getKepegawaianById(user.id)
        profileData.value = response.data
        editForm.value = { nama: response.data.nama, username: response.data.username }
    } catch (err: any) {
        error.value = err.data?.message || err.message || 'Terjadi kesalahan saat memuat profil'
        showErrorToast('Gagal Memuat Data', error.value)
    } finally {
        isLoading.value = false
    }
}

const handlePhotoChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
        const file = target.files[0]
        if (file.size > 2 * 1024 * 1024) return showErrorToast('Validasi Gagal', 'Ukuran file maksimal 2MB')
        if (!file.type.startsWith('image/')) return showErrorToast('Validasi Gagal', 'File harus berupa gambar')
        photoFile.value = file
        const reader = new FileReader()
        reader.onload = (e) => { photoPreview.value = e.target?.result as string }
        reader.readAsDataURL(file)
    }
}

const handleDocumentChange = (field: string, event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
        const file = target.files[0]
        if (file.size > 2 * 1024 * 1024) return showErrorToast('Validasi Gagal', 'Ukuran file maksimal 2MB')
        
        // Store file
        documentFiles.value[field] = file
        
        // Create preview info
        const sizeInKB = (file.size / 1024).toFixed(2)
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2)
        const sizeText = file.size < 1024 * 1024 ? `${sizeInKB} KB` : `${sizeInMB} MB`
        
        documentPreviews.value[field] = {
            name: file.name,
            size: sizeText
        }
    }
}

const startEdit = () => {
    isEditMode.value = true
    editForm.value = { nama: profileData.value.nama, username: profileData.value.username }
}

const cancelEdit = () => {
    isEditMode.value = false
    photoPreview.value = null
    photoFile.value = null
    documentFiles.value = {}
    documentPreviews.value = {}
    editForm.value = { nama: profileData.value.nama, username: profileData.value.username }
}

const saveProfile = async () => {
    isSaving.value = true
    try {
        // Build update data object
        const updateData: any = {
            nama: profileData.value.nama,
            username: profileData.value.username,
            nip: profileData.value.nip || '',
            nkki: profileData.value.nkki || '',
            kategori: profileData.value.kategori || '',
            jabatan: profileData.value.jabatan || '',
            status: profileData.value.status || 'active'
        }
        
        // Add roles
        if (profileData.value.roles && profileData.value.roles.length > 0) {
            updateData.role_ids = profileData.value.roles.map((role: any) => role.id)
        }
        
        // Add rombel data
        if (profileData.value.rombel_guru_kelas_id) {
            updateData.rombel_guru_kelas_id = profileData.value.rombel_guru_kelas_id
        }
        
        if (profileData.value.bidang_studi_id) {
            updateData.bidang_studi_id = profileData.value.bidang_studi_id
        }
        
        if (profileData.value.rombel_bidang_studi && profileData.value.rombel_bidang_studi.length > 0) {
            updateData.rombel_bidang_studi = profileData.value.rombel_bidang_studi
        }
        
        // Add photo file if exists
        if (photoFile.value) {
            updateData.foto = photoFile.value
        }
        
        // Add document files
        Object.entries(documentFiles.value).forEach(([key, file]) => {
            updateData[key] = file
        })
        
        // Call API
        await updateKepegawaian(profileData.value.id, updateData)
        
        // Reset edit mode and files
        isEditMode.value = false
        photoFile.value = null
        photoPreview.value = null
        documentFiles.value = {}
        documentPreviews.value = {}
        
        // Reload profile to get updated data
        await loadProfile()
        
        // Show success toast after everything is complete
        showSuccessToast('Berhasil', 'Profil berhasil diperbarui')
    } catch (err: any) {
        showErrorToast('Gagal', err.data?.message || err.message || 'Terjadi kesalahan saat memperbarui profil')
    } finally {
        isSaving.value = false
    }
}

const changePassword = async () => {
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) return showErrorToast('Validasi Gagal', 'Konfirmasi password tidak cocok')
    if (passwordForm.value.newPassword.length < 6) return showErrorToast('Validasi Gagal', 'Password baru minimal 6 karakter')
    isSaving.value = true
    try {
        // Use updateKepegawaian API with password field (same as EditPendidikModal)
        const payload = {
            nama: profileData.value.nama,
            username: profileData.value.username,
            nip: profileData.value.nip || '',
            nkki: profileData.value.nkki || '',
            kategori: profileData.value.kategori || '',
            jabatan: profileData.value.jabatan || '',
            status: profileData.value.status || 'active',
            password: passwordForm.value.newPassword // Add password field to update
        }
        
        // Add roles
        if (profileData.value.roles && profileData.value.roles.length > 0) {
            payload.role_ids = profileData.value.roles.map((role: any) => role.id)
        }
        
        // Add rombel data
        if (profileData.value.rombel_guru_kelas_id) {
            payload.rombel_guru_kelas_id = profileData.value.rombel_guru_kelas_id
        }
        
        if (profileData.value.bidang_studi_id) {
            payload.bidang_studi_id = profileData.value.bidang_studi_id
        }
        
        if (profileData.value.rombel_bidang_studi && profileData.value.rombel_bidang_studi.length > 0) {
            payload.rombel_bidang_studi = profileData.value.rombel_bidang_studi
        }
        
        await updateKepegawaian(profileData.value.id, payload)
        showSuccessToast('Berhasil', 'Password berhasil diubah')
        cancelChangePassword()
    } catch (err: any) {
        showErrorToast('Gagal', err.data?.message || err.message || 'Terjadi kesalahan saat mengubah password')
    } finally {
        isSaving.value = false
    }
}

const cancelChangePassword = () => {
    showChangePassword.value = false
    passwordForm.value = { newPassword: '', confirmPassword: '' }
    showNewPassword.value = false
    showConfirmPassword.value = false
}

onMounted(() => { loadProfile() })
</script>

<style scoped>
@keyframes scale-in {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}
.animate-scale-in { animation: scale-in 0.2s ease-out; }
</style>
