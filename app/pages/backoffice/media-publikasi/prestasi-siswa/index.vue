<template>
    <DashboardLayout>
        <!-- Create Prestasi Modal -->
        <CreatePrestasiModal v-model="showCreateModal" @success="handleCreateSuccess" @error="handleCreateError" />

        <!-- Edit Prestasi Modal -->
        <EditPrestasiModal v-model="showEditModal" :prestasi-id="selectedPrestasiId" 
            @success="handleEditSuccess" @error="handleEditError" />

        <!-- Delete Confirmation Modal -->
        <ConfirmationDeletePrestasiModal v-model="showDeleteModal" :prestasi-data="selectedPrestasiData"
            @success="handleDeleteSuccess" @error="handleDeleteError" />

        <!-- View Prestasi Modal -->
        <ViewPrestasiModal v-model="showViewModal" :prestasi-id="selectedPrestasiId"
            @open-photo="openPhotoModal" />

        <!-- Photo Lightbox Modal (Teleport to body so it's above all modals) -->
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
                                    <span v-if="currentPhotos.length > 1" class="text-xs font-normal text-white/80 ml-1">
                                        ({{ currentPhotoIndex + 1 }} / {{ currentPhotos.length }})
                                    </span>
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
                            <!-- Prev Button -->
                            <button v-if="currentPhotos.length > 1" @click="prevPhoto"
                                class="absolute left-2 z-10 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors cursor-pointer">
                                <i class="fa-solid fa-chevron-left text-sm"></i>
                            </button>

                            <!-- Image -->
                            <img :src="currentPhotos[currentPhotoIndex]?.url"
                                :alt="currentPhotos[currentPhotoIndex]?.filename"
                                class="max-h-full max-w-full object-contain" />

                            <!-- Next Button -->
                            <button v-if="currentPhotos.length > 1" @click="nextPhoto"
                                class="absolute right-2 z-10 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors cursor-pointer">
                                <i class="fa-solid fa-chevron-right text-sm"></i>
                            </button>
                        </div>

                        <!-- Footer -->
                        <div class="border-t border-gray-200 bg-gray-50 px-4 sm:px-6 py-2.5 flex-shrink-0 flex items-center justify-between">
                            <p class="text-xs text-gray-600 font-medium truncate mr-3">
                                {{ currentPhotos[currentPhotoIndex]?.filename || '' }}
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

        <!-- Header Section -->
        <div class="mb-6 sm:mb-8">
            <div class="flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
                <div>
                    <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                        Prestasi Siswa
                    </h1>
                    <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
                        Kelola data prestasi siswa SDN Sukapura 01
                    </p>
                </div>
                <AddButton label="Tambah Data Prestasi" iconClass="fa-solid fa-plus"
                    @click="showCreateModal = true" />
            </div>
        </div>

        <!-- Main Content -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <!-- Filter Section -->
            <div class="bg-white p-4 sm:p-6 border-b border-gray-200">
                <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Filter Data Prestasi</h3>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <!-- Tahun Pelajaran Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                            Tahun Pelajaran
                        </label>
                        <select v-model.number="filters.tahun_pelajaran_id" @change="applyFilter"
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                            <option v-for="tahun in tahunPelajaranList" :key="tahun.id" :value="tahun.id">
                                {{ tahun.tahun_pelajaran }}
                            </option>
                        </select>
                    </div>

                    <!-- Jenis Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                            Jenis
                        </label>
                        <select v-model="filters.jenis"
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                            <option value="">Semua Jenis</option>
                            <option value="Individu">Individu</option>
                            <option value="Tim">Tim</option>
                        </select>
                    </div>

                    <!-- Nama Siswa Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                            Nama Siswa
                        </label>
                        <div class="relative" ref="filterPesertaDidikDropdownRef">
                            <input type="text" v-model="filterPesertaDidikSearch"
                                @focus="showFilterPesertaDidikDropdown = true"
                                @input="showFilterPesertaDidikDropdown = true"
                                placeholder="Cari nama, NIS, atau rombel..."
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                            <!-- Clear button -->
                            <div v-if="filters.peserta_didik_id && !showFilterPesertaDidikDropdown"
                                class="absolute right-3 top-1/2 -translate-y-1/2">
                                <button type="button" @click="clearFilterPesertaDidik"
                                    class="text-gray-400 hover:text-red-500 cursor-pointer">
                                    <i class="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                            <div v-if="showFilterPesertaDidikDropdown && filteredFilterPesertaDidik.length > 0"
                                class="absolute z-50 mt-1 w-full bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                <button type="button" v-for="pd in filteredFilterPesertaDidik" :key="pd.id"
                                    @click="selectFilterPesertaDidik(pd)"
                                    class="w-full text-left px-4 py-2.5 hover:bg-red-50 transition-colors text-xs sm:text-sm cursor-pointer border-b border-gray-100 last:border-b-0">
                                    {{ pd.nama }} - NIS: <i>{{ pd.nis }}</i> - Rombel: <i>{{ pd.rombel?.name || '-' }}</i>
                                </button>
                            </div>
                            <div v-if="showFilterPesertaDidikDropdown && filteredFilterPesertaDidik.length === 0 && filterPesertaDidikSearch"
                                class="absolute z-50 mt-1 w-full bg-white border-2 border-gray-200 rounded-lg shadow-lg p-4 text-center text-xs sm:text-sm text-gray-500">
                                Peserta didik tidak ditemukan
                            </div>
                        </div>
                    </div>

                    <!-- Nama Grup Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                            Nama Grup
                        </label>
                        <input v-model="filters.nama_grup" type="text" placeholder="Cari nama grup..."
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                    </div>

                    <!-- Nama Prestasi Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                            Nama Prestasi
                        </label>
                        <input v-model="filters.nama_prestasi" type="text" placeholder="Cari nama prestasi..."
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                    </div>

                    <!-- Tingkat Prestasi Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                            Tingkat Prestasi
                        </label>
                        <input v-model="filters.tingkat_prestasi" type="text" placeholder="Cari tingkat prestasi..."
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                    </div>

                    <!-- Penyelenggara Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                            Penyelenggara
                        </label>
                        <input v-model="filters.penyelenggara" type="text" placeholder="Cari penyelenggara..."
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                    </div>

                    <!-- Juara Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                            Juara
                        </label>
                        <select v-model="filters.juara"
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                            <option value="">Semua Juara</option>
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

                    <!-- Ekstrakurikuler Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                            Ekstrakurikuler
                        </label>
                        <select v-model.number="filters.ekstrakurikuler_id"
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                            <option :value="0">Semua Ekstrakurikuler</option>
                            <option v-for="ekskul in ekstrakurikulerList" :key="ekskul.id" :value="ekskul.id">
                                {{ ekskul.name }}
                            </option>
                        </select>
                    </div>

                    <!-- Start Date Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                            Tanggal Lomba (Dari)
                        </label>
                        <input v-model="filters.start_date" type="date"
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                    </div>

                    <!-- End Date Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                            Tanggal Lomba (Sampai)
                        </label>
                        <input v-model="filters.end_date" type="date"
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                    </div>
                </div>

                <!-- Filter Buttons -->
                <div class="flex gap-3 mt-4">
                    <button @click="applyFilter"
                        class="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors duration-200 cursor-pointer">
                        <i class="fa-solid fa-magnifying-glass w-4 h-4"></i>
                        Cari
                    </button>
                    <button @click="clearFilter"
                        class="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                        <i class="fa-solid fa-rotate-left w-4 h-4"></i>
                        Reset Filter
                    </button>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="prestasiStore.isLoading" class="p-8 sm:p-12 flex items-center justify-center">
                <div class="flex flex-col items-center gap-3 sm:gap-4">
                    <div
                        class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600">
                    </div>
                    <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat data prestasi...</p>
                </div>
            </div>

            <!-- Error State -->
            <div v-else-if="prestasiStore.error" class="p-4 sm:p-6">
                <div class="rounded-xl border-2 border-red-200 bg-red-50 p-4 sm:p-6 flex items-start gap-3 sm:gap-4">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 sm:h-6 sm:w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="flex-1">
                        <h3 class="text-base sm:text-lg font-semibold text-red-900">Gagal memuat data</h3>
                        <p class="mt-1 text-sm sm:text-base text-red-800">{{ prestasiStore.error }}</p>
                        <button @click="fetchPrestasiData"
                            class="mt-3 sm:mt-4 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors cursor-pointer">
                            <i class="fa-solid fa-rotate-right w-3 h-3 sm:w-4 sm:h-4"></i>
                            Coba Lagi
                        </button>
                    </div>
                </div>
            </div>

            <!-- Table Section -->
            <template v-else>
                <div v-if="prestasiStore.prestasis.length > 0">
                    <div class="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        <table class="w-full min-w-max">
                            <thead>
                                <tr class="border-b border-gray-200 bg-gray-700">
                                    <th class="px-3 sm:px-4 py-3 sm:py-4 text-center text-xs sm:text-sm md:text-[14.5px] font-semibold uppercase tracking-wider text-white w-10">
                                        #
                                    </th>
                                    <th class="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm md:text-[14.5px] font-semibold uppercase tracking-wider text-white w-12">
                                        No
                                    </th>
                                    <th class="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm md:text-[14.5px] font-semibold uppercase tracking-wider text-white">
                                        Tahun Pelajaran
                                    </th>
                                    <th class="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm md:text-[14.5px] font-semibold uppercase tracking-wider text-white">
                                        Jenis
                                    </th>
                                    <th class="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm md:text-[14.5px] font-semibold uppercase tracking-wider text-white">
                                        Nama Siswa
                                    </th>
                                    <th class="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm md:text-[14.5px] font-semibold uppercase tracking-wider text-white">
                                        NIS
                                    </th>
                                    <th class="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm md:text-[14.5px] font-semibold uppercase tracking-wider text-white">
                                        Rombel
                                    </th>
                                    <th class="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm md:text-[14.5px] font-semibold uppercase tracking-wider text-white">
                                        Nama Prestasi
                                    </th>
                                    <th class="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm md:text-[14.5px] font-semibold uppercase tracking-wider text-white">
                                        Tingkat Prestasi
                                    </th>
                                    <th class="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm md:text-[14.5px] font-semibold uppercase tracking-wider text-white">
                                        Juara
                                    </th>
                                    <th class="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm md:text-[14.5px] font-semibold uppercase tracking-wider text-white">
                                        Penyelenggara
                                    </th>
                                    <th class="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm md:text-[14.5px] font-semibold uppercase tracking-wider text-white">
                                        Tanggal Lomba
                                    </th>
                                    <th class="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm md:text-[14.5px] font-semibold uppercase tracking-wider text-white">
                                        Foto
                                    </th>
                                    <th class="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm md:text-[14.5px] font-semibold uppercase tracking-wider text-white">
                                        Ekstrakurikuler
                                    </th>
                                    <th class="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm md:text-[14.5px] font-semibold uppercase tracking-wider text-white">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                <template v-for="(item, index) in prestasiStore.prestasis" :key="item.id">
                                    <!-- Main Row -->
                                    <tr class="hover:bg-gray-50 transition-colors duration-150">
                                        <!-- # Expand -->
                                        <td class="px-3 sm:px-4 py-2 sm:py-4 text-center">
                                            <button v-if="item.jenis === 'Tim'" @click="toggleExpand(item.id)"
                                                class="flex items-center justify-center w-6 h-6 rounded transition-colors hover:bg-gray-200 cursor-pointer mx-auto">
                                                <i :class="[
                                                    'fa-solid fa-chevron-right text-xs transition-transform duration-200',
                                                    expandedRows.has(item.id) ? 'rotate-90' : ''
                                                ]"></i>
                                            </button>
                                        </td>
                                        <!-- No -->
                                        <td class="px-3 sm:px-6 py-2 sm:py-4 text-[13px] sm:text-sm md:text-[15px] font-medium text-gray-700">
                                            {{ (pagination.page - 1) * pagination.limit + index + 1 }}
                                        </td>
                                        <!-- Tahun Pelajaran -->
                                        <td class="px-3 sm:px-6 py-2 sm:py-4 text-[13px] sm:text-sm md:text-[15px] text-gray-700">
                                            {{ item.tahun_pelajaran?.tahun_pelajaran || '-' }}
                                        </td>
                                        <!-- Jenis -->
                                        <td class="px-3 sm:px-6 py-2 sm:py-4 text-[13px] sm:text-sm md:text-[15px]">
                                            <span :class="[
                                                'inline-flex items-center rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-semibold',
                                                item.jenis === 'Individu'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-purple-100 text-purple-800'
                                            ]">
                                                {{ item.jenis }}
                                            </span>
                                        </td>
                                        <!-- Nama Siswa -->
                                        <td class="px-3 sm:px-6 py-2 sm:py-4 text-[13px] sm:text-sm md:text-[15px] text-gray-700">
                                            <template v-if="item.jenis === 'Individu'">
                                                {{ item.peserta_didik?.nama || '-' }}
                                            </template>
                                            <template v-else>
                                                -
                                            </template>
                                        </td>
                                        <!-- NIS -->
                                        <td class="px-3 sm:px-6 py-2 sm:py-4 text-[13px] sm:text-sm md:text-[15px] text-gray-700">
                                            <template v-if="item.jenis === 'Individu'">
                                                {{ item.peserta_didik?.nis || '-' }}
                                            </template>
                                            <template v-else>
                                                -
                                            </template>
                                        </td>
                                        <!-- Rombel -->
                                        <td class="px-3 sm:px-6 py-2 sm:py-4 text-[13px] sm:text-sm md:text-[15px] text-gray-700">
                                            <template v-if="item.jenis === 'Individu'">
                                                {{ item.peserta_didik?.rombel?.name || '-' }}
                                            </template>
                                            <template v-else>
                                                -
                                            </template>
                                        </td>
                                        <!-- Nama Prestasi -->
                                        <td class="px-3 sm:px-6 py-2 sm:py-4 text-[13px] sm:text-sm md:text-[15px] text-gray-700">
                                            {{ item.nama_prestasi || '-' }}
                                        </td>
                                        <!-- Tingkat Prestasi -->
                                        <td class="px-3 sm:px-6 py-2 sm:py-4 text-[13px] sm:text-sm md:text-[15px] text-gray-700">
                                            {{ item.tingkat_prestasi || '-' }}
                                        </td>
                                        <!-- Juara -->
                                        <td class="px-3 sm:px-6 py-2 sm:py-4 text-[13px] sm:text-sm md:text-[15px]">
                                            <span class="inline-flex items-center rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-semibold bg-yellow-100 text-yellow-800">
                                                {{ item.juara || '-' }}
                                            </span>
                                        </td>
                                        <!-- Penyelenggara -->
                                        <td class="px-3 sm:px-6 py-2 sm:py-4 text-[13px] sm:text-sm md:text-[15px] text-gray-700">
                                            {{ item.penyelenggara || '-' }}
                                        </td>
                                        <!-- Tanggal Lomba -->
                                        <td class="px-3 sm:px-6 py-2 sm:py-4 text-[13px] sm:text-sm md:text-[15px] text-gray-700">
                                            {{ formatDate(item.tanggal_lomba) }}
                                        </td>
                                        <!-- Foto -->
                                        <td class="px-3 sm:px-6 py-2 sm:py-4">
                                            <div v-if="item.foto && item.foto.length > 0" class="flex flex-wrap gap-1.5">
                                                <button v-for="(foto, fotoIndex) in item.foto" :key="foto.id"
                                                    @click="openPhotoModal(item.foto, fotoIndex)"
                                                    class="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
                                                    <i class="fa-solid fa-image text-[10px]"></i>
                                                    Foto {{ fotoIndex + 1 }}
                                                </button>
                                            </div>
                                            <span v-else class="text-[13px] sm:text-sm text-gray-400">-</span>
                                        </td>
                                        <!-- Ekstrakurikuler -->
                                        <td class="px-3 sm:px-6 py-2 sm:py-4 text-[13px] sm:text-sm md:text-[15px] text-gray-700">
                                            {{ item.ekstrakurikuler?.name || '-' }}
                                        </td>
                                        <!-- Aksi -->
                                        <td class="px-3 sm:px-6 py-2 sm:py-4">
                                            <div class="flex items-center justify-center gap-1.5 sm:gap-2">
                                                <ViewButton title="Lihat Detail" @click="openDetailPrestasi(item)" />
                                                <EditButton title="Edit" @click="openEditPrestasi(item)" />
                                                <DeleteButton title="Hapus" @click="openDeletePrestasi(item)" />
                                            </div>
                                        </td>
                                    </tr>

                                    <!-- Expanded Tim Members Row -->
                                    <tr v-if="item.jenis === 'Tim' && expandedRows.has(item.id) && item.anggota_tim_prestasi && item.anggota_tim_prestasi.length > 0">
                                        <td :colspan="15" class="px-3 sm:px-6 py-3 bg-gray-50">
                                            <div class="ml-8">
                                                <p class="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                                    <i class="fa-solid fa-users mr-1"></i>
                                                    Anggota Tim: {{ item.nama_grup }}
                                                </p>
                                                <div class="overflow-x-auto rounded-lg border border-gray-200">
                                                    <table class="w-full">
                                                        <thead>
                                                            <tr class="bg-gray-200">
                                                                <th class="px-3 sm:px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 w-12">
                                                                    No
                                                                </th>
                                                                <th class="px-3 sm:px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                                                                    Nama Siswa
                                                                </th>
                                                                <th class="px-3 sm:px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                                                                    NIS
                                                                </th>
                                                                <th class="px-3 sm:px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                                                                    Rombel
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody class="divide-y divide-gray-200 bg-white">
                                                            <tr v-for="(anggota, anggotaIndex) in item.anggota_tim_prestasi"
                                                                :key="anggota.id" class="hover:bg-gray-50">
                                                                <td class="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700">
                                                                    {{ anggotaIndex + 1 }}
                                                                </td>
                                                                <td class="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700">
                                                                    {{ anggota.peserta_didik?.nama || '-' }}
                                                                </td>
                                                                <td class="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700">
                                                                    {{ anggota.peserta_didik?.nis || '-' }}
                                                                </td>
                                                                <td class="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700">
                                                                    {{ anggota.peserta_didik?.rombel?.name || '-' }}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div class="border-t border-gray-200 bg-white px-4 sm:px-6 py-4">
                        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div class="flex items-center gap-3">
                                <label class="text-xs sm:text-sm text-gray-600 font-medium">Items per page:</label>
                                <select v-model.number="pagination.limit" @change="onLimitChange"
                                    class="px-3 py-1.5 border-2 border-gray-300 rounded-lg text-xs sm:text-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                                    <option :value="10">10</option>
                                    <option :value="25">25</option>
                                    <option :value="50">50</option>
                                    <option :value="100">100</option>
                                </select>
                            </div>
                            <div class="text-xs sm:text-sm text-gray-600">
                                <span class="font-semibold text-gray-900">{{ startItem }}-{{ endItem }}</span>
                                of
                                <span class="font-semibold text-gray-900">{{ prestasiStore.total }}</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <button @click="goToFirstPage" :disabled="pagination.page === 1 || prestasiStore.isLoading"
                                    class="p-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                    <i class="fa-solid fa-chevron-left w-4 h-4 flex items-center justify-center"></i>
                                    <i class="fa-solid fa-chevron-left w-4 h-4 -ml-2 flex items-center justify-center"></i>
                                </button>
                                <button @click="previousPage" :disabled="pagination.page === 1 || prestasiStore.isLoading"
                                    class="p-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                    <i class="fa-solid fa-chevron-left w-4 h-4"></i>
                                </button>
                                <button @click="nextPage" :disabled="pagination.page >= totalPages || prestasiStore.isLoading"
                                    class="p-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                    <i class="fa-solid fa-chevron-right w-4 h-4"></i>
                                </button>
                                <button @click="goToLastPage" :disabled="pagination.page >= totalPages || prestasiStore.isLoading"
                                    class="p-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                    <i class="fa-solid fa-chevron-right w-4 h-4 flex items-center justify-center"></i>
                                    <i class="fa-solid fa-chevron-right w-4 h-4 -ml-2 flex items-center justify-center"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else class="p-8 sm:p-12 flex items-center justify-center">
                    <div class="flex flex-col items-center gap-3 text-center">
                        <i class="fa-solid fa-trophy text-4xl text-gray-300"></i>
                        <p class="text-sm sm:text-base text-gray-500 font-medium">Belum ada data prestasi</p>
                    </div>
                </div>
            </template>
        </div>
    </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { usePrestasiStore } from '~/stores/PrestasiStore'
import { useTahunPelajaranStore } from '~/stores/TahunPelajaranStore'
import { useEkstrakurikulerStore } from '~/stores/EkstrakurikulerStore'
import { getPesertaDidikList } from '~/services/peserta-didik'
import DashboardLayout from '~/components/DashboardLayout.vue'
import CreatePrestasiModal from '~/components/modals/CreatePrestasiModal.vue'
import EditPrestasiModal from '~/components/modals/EditPrestasiModal.vue'
import ConfirmationDeletePrestasiModal from '~/components/modals/ConfirmationDeletePrestasiModal.vue'
import ViewPrestasiModal from '~/components/modals/ViewPrestasiModal.vue'
import AddButton from '~/components/common/AddButton.vue'
import ViewButton from '~/components/common/ViewButton.vue'
import EditButton from '~/components/common/EditButton.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'
import type { PrestasiPhoto } from '~/types/PrestasiType'

const prestasiStore = usePrestasiStore()
const tahunPelajaranStore = useTahunPelajaranStore()
const ekstrakurikulerStore = useEkstrakurikulerStore()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showViewModal = ref(false)
const selectedPrestasiId = ref(0)
const selectedPrestasiData = ref<{
    id: number
    nama_prestasi: string
    jenis: string
    juara: string
} | null>(null)

const tahunPelajaranList = ref<any[]>([])
const ekstrakurikulerList = ref<any[]>([])
const expandedRows = ref<Set<number>>(new Set())

const pagination = ref({
    page: 1,
    limit: 10
})

const filters = ref({
    tahun_pelajaran_id: 0,
    jenis: '',
    peserta_didik_id: 0,
    nama_grup: '',
    nama_prestasi: '',
    tingkat_prestasi: '',
    penyelenggara: '',
    juara: '',
    ekstrakurikuler_id: 0,
    start_date: '',
    end_date: '',
})

// Peserta didik filter dropdown
const pesertaDidikList = ref<any[]>([])
const filterPesertaDidikSearch = ref('')
const showFilterPesertaDidikDropdown = ref(false)
const filterPesertaDidikDropdownRef = ref<HTMLElement>()

// Photo modal state
const showPhotoModal = ref(false)
const currentPhotos = ref<PrestasiPhoto[]>([])
const currentPhotoIndex = ref(0)

// Computed
const totalPages = computed(() => Math.ceil(prestasiStore.total / pagination.value.limit))

const startItem = computed(() => {
    if (prestasiStore.total === 0) return 0
    return (pagination.value.page - 1) * pagination.value.limit + 1
})

const endItem = computed(() => {
    const end = pagination.value.page * pagination.value.limit
    return end > prestasiStore.total ? prestasiStore.total : end
})

const filteredFilterPesertaDidik = computed(() => {
    if (!filterPesertaDidikSearch.value) return pesertaDidikList.value.slice(0, 10)
    const search = filterPesertaDidikSearch.value.toLowerCase()
    return pesertaDidikList.value.filter(pd =>
        pd.nama.toLowerCase().includes(search) ||
        pd.nis.toLowerCase().includes(search) ||
        pd.rombel?.name?.toLowerCase().includes(search)
    ).slice(0, 10)
})

// Methods
const loadPesertaDidikList = async () => {
    try {
        const response = await getPesertaDidikList({}, 1, 1000)
        pesertaDidikList.value = response.data || []
    } catch (err) {
        console.error('Error loading peserta didik:', err)
    }
}

const selectFilterPesertaDidik = (pd: any) => {
    filters.value.peserta_didik_id = pd.id
    filterPesertaDidikSearch.value = `${pd.nama} - NIS: ${pd.nis} - Rombel: ${pd.rombel?.name || '-'}`
    showFilterPesertaDidikDropdown.value = false
}

const clearFilterPesertaDidik = () => {
    filters.value.peserta_didik_id = 0
    filterPesertaDidikSearch.value = ''
}

const handleFilterClickOutside = (event: Event) => {
    const target = event.target as Node
    if (filterPesertaDidikDropdownRef.value && !filterPesertaDidikDropdownRef.value.contains(target)) {
        showFilterPesertaDidikDropdown.value = false
    }
}

const loadTahunPelajaranList = async () => {
    try {
        const result = await tahunPelajaranStore.fetchTahunPelajarans(1, 100)
        if (result.success) {
            tahunPelajaranList.value = tahunPelajaranStore.tahunPelajarans
            const activeTahun = tahunPelajaranList.value.find((t: any) => t.status === 'active')
            if (activeTahun) {
                filters.value.tahun_pelajaran_id = activeTahun.id
            }
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

const fetchPrestasiData = async () => {
    const search: any = {
        tahun_pelajaran_id: filters.value.tahun_pelajaran_id || undefined,
        jenis: filters.value.jenis || undefined,
        peserta_didik_id: filters.value.peserta_didik_id || undefined,
        nama_grup: filters.value.nama_grup || undefined,
        nama_prestasi: filters.value.nama_prestasi || undefined,
        tingkat_prestasi: filters.value.tingkat_prestasi || undefined,
        penyelenggara: filters.value.penyelenggara || undefined,
        juara: filters.value.juara || undefined,
        ekstrakurikuler_id: filters.value.ekstrakurikuler_id || undefined,
        start_date: filters.value.start_date || undefined,
        end_date: filters.value.end_date || undefined,
    }

    await prestasiStore.fetchPrestasi(
        search,
        pagination.value.page,
        pagination.value.limit
    )
}

const applyFilter = async () => {
    pagination.value.page = 1
    await fetchPrestasiData()
}

const clearFilter = async () => {
    const currentTahunPelajaranId = filters.value.tahun_pelajaran_id
    filters.value = {
        tahun_pelajaran_id: currentTahunPelajaranId,
        jenis: '',
        peserta_didik_id: 0,
        nama_grup: '',
        nama_prestasi: '',
        tingkat_prestasi: '',
        penyelenggara: '',
        juara: '',
        ekstrakurikuler_id: 0,
        start_date: '',
        end_date: '',
    }
    filterPesertaDidikSearch.value = ''
    pagination.value.page = 1
    await fetchPrestasiData()
}

const onPageChange = (page: number) => {
    pagination.value.page = page
    fetchPrestasiData()
}

const onLimitChange = () => {
    pagination.value.page = 1
    fetchPrestasiData()
}

const goToFirstPage = () => {
    pagination.value.page = 1
    fetchPrestasiData()
}

const previousPage = () => {
    if (pagination.value.page > 1) {
        pagination.value.page--
        fetchPrestasiData()
    }
}

const nextPage = () => {
    if (pagination.value.page < totalPages.value) {
        pagination.value.page++
        fetchPrestasiData()
    }
}

const goToLastPage = () => {
    pagination.value.page = totalPages.value
    fetchPrestasiData()
}

// Expand/collapse Tim rows
const toggleExpand = (id: number) => {
    if (expandedRows.value.has(id)) {
        expandedRows.value.delete(id)
    } else {
        expandedRows.value.add(id)
    }
}

// Photo modal methods
const openPhotoModal = (photos: PrestasiPhoto[], index: number) => {
    currentPhotos.value = photos
    currentPhotoIndex.value = index
    showPhotoModal.value = true
}

const closePhotoModal = () => {
    showPhotoModal.value = false
}

const prevPhoto = () => {
    if (currentPhotoIndex.value > 0) {
        currentPhotoIndex.value--
    } else {
        currentPhotoIndex.value = currentPhotos.value.length - 1
    }
}

const nextPhoto = () => {
    if (currentPhotoIndex.value < currentPhotos.value.length - 1) {
        currentPhotoIndex.value++
    } else {
        currentPhotoIndex.value = 0
    }
}

const openDetailPrestasi = (item: any) => {
    selectedPrestasiId.value = item.id
    showViewModal.value = true
}

const openEditPrestasi = (item: any) => {
    selectedPrestasiId.value = item.id
    showEditModal.value = true
}

const openDeletePrestasi = (item: any) => {
    selectedPrestasiData.value = {
        id: item.id,
        nama_prestasi: item.nama_prestasi,
        jenis: item.jenis,
        juara: item.juara
    }
    showDeleteModal.value = true
}

const handleCreateSuccess = () => {
    pagination.value.page = 1
    fetchPrestasiData()
}

const handleCreateError = () => {
    // Error already shown via toast
}

const handleEditSuccess = () => {
    fetchPrestasiData()
}

const handleEditError = () => {
    // Error already shown via toast
}

const handleDeleteSuccess = () => {
    fetchPrestasiData()
}

const handleDeleteError = () => {
    // Error already shown via toast
}

const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
}

// Load initial data
onMounted(async () => {
    prestasiStore.clearError()
    document.addEventListener('click', handleFilterClickOutside)
    await Promise.all([
        loadTahunPelajaranList(),
        loadEkstrakurikulerList(),
        loadPesertaDidikList(),
    ])
    await fetchPrestasiData()
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleFilterClickOutside)
})
</script>
