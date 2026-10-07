<template>
    <DashboardLayout>
        <!-- Modal -->
        <CreatePPIModal v-model="showCreateModal" 
            :tahunPelajaranList="tahunPelajaranList"
            :guruList="guruList"
            :rombelList="rombelList"
            @success="handleCreateSuccess" />
        <ViewPPIModal v-model="showViewModal" :dataId="selectedDataId" />
        <EditPPIModal v-model="showEditModal" 
            :dataId="selectedDataId"
            :guruList="guruList"
            @success="handleEditSuccess" />
        <ConfirmationDeletePPIModal v-model="showDeleteModal"
            :dataId="selectedDataId"
            :dataInfo="selectedDataInfo"
            @success="handleDeleteSuccess" />

        <!-- Header Section -->
        <div class="mb-6 sm:mb-8">
            <div class="flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
                <div>
                    <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Program Pembelajaran Individu (PPI)</h1>
                    <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
                        Kelola program pembelajaran individu untuk siswa berkebutuhan khusus
                    </p>
                </div>
                <button @click="showCreateModal = true"
                    class="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition-all text-sm cursor-pointer">
                    <i class="fa-solid fa-plus"></i>
                    <span>Tambah Data PPI</span>
                </button>
            </div>
        </div>

        <!-- Summary Section -->
        <div v-if="filters.tahun_pelajaran_id" class="mb-6">
            <!-- Loading Summary -->
            <div v-if="isLoadingSummary" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-center py-8">
                    <div class="flex flex-col items-center gap-3">
                        <div class="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
                        <p class="text-sm text-gray-600 font-medium">Memuat ringkasan...</p>
                    </div>
                </div>
            </div>

            <!-- Summary Content -->
            <div v-else-if="summaryData" class="space-y-4">
                <!-- Main Stats Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <!-- Total PPI Card -->
                    <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
                        <div class="relative z-10">
                            <div class="flex items-center justify-between mb-2">
                                <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-clipboard-list text-2xl"></i>
                                </div>
                                <i class="fas fa-arrow-up text-xs opacity-75"></i>
                            </div>
                            <h3 class="text-sm font-medium opacity-90 mb-1">Total Program PPI</h3>
                            <p class="text-3xl font-bold">{{ summaryData.total_ppi }}</p>
                        </div>
                    </div>

                    <!-- Total Anak Inklusi Card -->
                    <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
                        <div class="relative z-10">
                            <div class="flex items-center justify-between mb-2">
                                <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-users text-2xl"></i>
                                </div>
                                <i class="fas fa-user-check text-xs opacity-75"></i>
                            </div>
                            <h3 class="text-sm font-medium opacity-90 mb-1">Total Anak Inklusi</h3>
                            <p class="text-3xl font-bold">{{ summaryData.total_anak_inklusi }}</p>
                        </div>
                    </div>

                    <!-- Tahun Pelajaran Card -->
                    <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
                        <div class="relative z-10">
                            <div class="flex items-center justify-between mb-2">
                                <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-calendar-alt text-2xl"></i>
                                </div>
                                <span class="px-2 py-1 bg-white/20 rounded-full text-xs font-semibold">
                                    {{ summaryData.tahun_pelajaran?.status === 'active' ? 'Aktif' : 'Non-Aktif' }}
                                </span>
                            </div>
                            <h3 class="text-sm font-medium opacity-90 mb-1">Tahun Pelajaran</h3>
                            <p class="text-2xl font-bold">{{ summaryData.tahun_pelajaran?.tahun_pelajaran || '-' }}</p>
                        </div>
                    </div>
                </div>

                <!-- Status Capaian & Bidang Studi Breakdown -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <!-- Status Capaian Breakdown -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div class="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
                            <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                <i class="fas fa-chart-pie text-white"></i>
                            </div>
                            <div>
                                <h3 class="font-bold text-gray-900">Status Capaian</h3>
                                <p class="text-xs text-gray-600">Distribusi berdasarkan status</p>
                            </div>
                        </div>
                        <div class="space-y-3">
                            <div v-for="status in summaryData.status_capaian_breakdown" :key="status.status_capaian"
                                class="bg-gray-50 rounded-lg p-3">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="flex items-center gap-2">
                                        <div :class="[
                                            'w-3 h-3 rounded-full',
                                            status.status_capaian === 'Selesai' || status.status_capaian === 'Tercapai' ? 'bg-green-500' :
                                            status.status_capaian === 'Sedang Berlangsung' ? 'bg-blue-500' : 'bg-gray-500'
                                        ]"></div>
                                        <span class="text-sm font-semibold text-gray-900">{{ status.status_capaian }}</span>
                                    </div>
                                    <div class="text-right">
                                        <span class="text-sm font-bold text-gray-900">{{ status.total }}</span>
                                        <span class="text-xs text-gray-600 ml-1">({{ status.percentage.toFixed(1) }}%)</span>
                                    </div>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div :class="[
                                        'h-full rounded-full transition-all duration-500',
                                        status.status_capaian === 'Selesai' || status.status_capaian === 'Tercapai' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                                        status.status_capaian === 'Sedang Berlangsung' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-gray-400 to-gray-500'
                                    ]" :style="{ width: status.percentage + '%' }"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Aspek Pembelajaran Breakdown -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div class="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
                            <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                                <i class="fas fa-brain text-white"></i>
                            </div>
                            <div>
                                <h3 class="font-bold text-gray-900">Aspek Pembelajaran</h3>
                                <p class="text-xs text-gray-600">Distribusi berdasarkan aspek pembelajaran</p>
                            </div>
                        </div>
                        <div class="space-y-3 max-h-64 overflow-y-auto pr-2">
                            <div v-for="(aspek, index) in summaryData.aspek_pembelajaran_breakdown" :key="index"
                                class="bg-gray-50 rounded-lg p-3">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="flex items-center gap-2">
                                        <div :class="[
                                            'w-3 h-3 rounded-full',
                                            index === 0 ? 'bg-indigo-500' :
                                            index === 1 ? 'bg-purple-500' :
                                            index === 2 ? 'bg-pink-500' :
                                            index === 3 ? 'bg-blue-500' :
                                            index === 4 ? 'bg-cyan-500' :
                                            index === 5 ? 'bg-teal-500' : 'bg-green-500'
                                        ]"></div>
                                        <span class="text-sm font-semibold text-gray-900">{{ aspek.aspek_pembelajaran || 'Tidak Diketahui' }}</span>
                                    </div>
                                    <div class="text-right">
                                        <span class="text-sm font-bold text-gray-900">{{ aspek.total }}</span>
                                        <span class="text-xs text-gray-600 ml-1">({{ aspek.percentage.toFixed(1) }}%)</span>
                                    </div>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div :class="[
                                        'h-full rounded-full transition-all duration-500',
                                        index === 0 ? 'bg-gradient-to-r from-indigo-500 to-indigo-600' :
                                        index === 1 ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                                        index === 2 ? 'bg-gradient-to-r from-pink-500 to-pink-600' :
                                        index === 3 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                                        index === 4 ? 'bg-gradient-to-r from-cyan-500 to-cyan-600' :
                                        index === 5 ? 'bg-gradient-to-r from-teal-500 to-teal-600' : 'bg-gradient-to-r from-green-500 to-green-600'
                                    ]" :style="{ width: aspek.percentage + '%' }"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <!-- Filter Section -->
            <div class="bg-white p-4 sm:p-6 border-b border-gray-200">
                <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Filter PPI</h3>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <!-- Tahun Pelajaran Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">Tahun Pelajaran</label>
                        <select v-model="filters.tahun_pelajaran_id" @change="handleTahunPelajaranChange"
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer">
                            <option value="">Pilih Tahun Pelajaran</option>
                            <option v-for="tp in tahunPelajaranList" :key="tp.id" :value="tp.id">
                                {{ tp.tahun_pelajaran }}
                            </option>
                        </select>
                    </div>

                    <!-- Rombel Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">Rombel</label>
                        <select v-model="filters.rombel_id" @change="handleRombelChange"
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer">
                            <option value="">Semua Rombel</option>
                            <option v-for="rombel in rombelList" :key="rombel.id" :value="rombel.id">
                                {{ rombel.name }}
                            </option>
                        </select>
                    </div>

                    <!-- Anak Inklusi Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">Anak Inklusi</label>
                        <select v-model="filters.anak_inklusi_rombel_id" @change="loadData"
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer">
                            <option value="">Semua Anak Inklusi</option>
                            <option v-for="anak in anakInklusiList" :key="anak.id" :value="anak.id">
                                {{ anak.anak_inklusi?.peserta_didik?.nama }} - {{ anak.peserta_didik_rombel?.rombel?.name }}
                            </option>
                        </select>
                    </div>

                    <!-- Aspek Pembelajaran Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">Aspek Pembelajaran</label>
                        <select v-model="filters.aspek_pembelajaran" @change="loadData"
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer">
                            <option value="">Semua Aspek</option>
                            <option v-for="aspek in aspekPembelajaranList" :key="aspek" :value="aspek">
                                {{ aspek }}
                            </option>
                        </select>
                    </div>

                    <!-- Guru Pembuat Filter -->
                    <div>
                        <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">Guru Pembuat</label>
                        <select v-model="filters.guru_pembuat_id" @change="loadData"
                            class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer">
                            <option value="">Semua Guru</option>
                            <option v-for="guru in guruList" :key="guru.id" :value="guru.id">
                                {{ guru.nama }} - {{ guru.jabatan }}
                            </option>
                        </select>
                    </div>
                </div>

                <div class="flex gap-2">
                    <button @click="resetFilters"
                        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer">
                        <i class="fas fa-redo"></i>
                        Reset Filter
                    </button>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="flex items-center justify-center py-12 px-4 sm:px-6">
                <div class="flex flex-col items-center gap-3">
                    <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
                    <p class="text-sm text-gray-600 font-medium">Memuat data...</p>
                </div>
            </div>

            <!-- Table Section -->
            <div v-else-if="dataList.length > 0">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-gray-700 border-b-2 border-gray-600">
                            <tr>
                                <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">No</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Nama Siswa</th>
                                <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">NISN</th>
                                <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Rombel</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Aspek Pembelajaran</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Nama Program</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Target Waktu</th>
                                <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Status Capaian</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Guru Pembuat</th>
                                <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            <tr v-for="(item, index) in dataList" :key="item.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-3 text-center text-gray-900">
                                    {{ (pagination.page - 1) * pagination.limit + index + 1 }}
                                </td>
                                <td class="px-4 py-3 text-gray-900 font-medium">
                                    {{ item.anak_inklusi_rombel?.anak_inklusi?.peserta_didik?.nama || '-' }}
                                </td>
                                <td class="px-4 py-3 text-center text-gray-600">
                                    {{ item.anak_inklusi_rombel?.anak_inklusi?.peserta_didik?.nisn || '-' }}
                                </td>
                                <td class="px-4 py-3 text-center text-gray-600">
                                    {{ item.anak_inklusi_rombel?.peserta_didik_rombel?.rombel?.name || '-' }}
                                </td>
                                <td class="px-4 py-3">
                                    <span :class="[
                                        'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold shadow-md border-l-4 transition-all hover:scale-105 hover:shadow-lg',
                                        item.aspek_pembelajaran === 'Kognitif' ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-600' :
                                        item.aspek_pembelajaran === 'Bahasa & Komunikasi' ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-600' :
                                        item.aspek_pembelajaran === 'Motorik' ? 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-600' :
                                        item.aspek_pembelajaran === 'Sensori/Persepsi' ? 'bg-gradient-to-r from-pink-100 to-pink-200 text-pink-800 border-pink-600' :
                                        item.aspek_pembelajaran === 'Sosial & Emosional' ? 'bg-gradient-to-r from-teal-100 to-teal-200 text-teal-800 border-teal-600' :
                                        item.aspek_pembelajaran === 'Bina Diri/Kemandirian' ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-600' :
                                        item.aspek_pembelajaran === 'Perilaku Adaptif' ? 'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 border-indigo-600' :
                                        'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-600'
                                    ]">
                                        <i :class="[
                                            'fas text-sm',
                                            item.aspek_pembelajaran === 'Kognitif' ? 'fa-brain' :
                                            item.aspek_pembelajaran === 'Bahasa & Komunikasi' ? 'fa-comments' :
                                            item.aspek_pembelajaran === 'Motorik' ? 'fa-running' :
                                            item.aspek_pembelajaran === 'Sensori/Persepsi' ? 'fa-eye' :
                                            item.aspek_pembelajaran === 'Sosial & Emosional' ? 'fa-heart' :
                                            item.aspek_pembelajaran === 'Bina Diri/Kemandirian' ? 'fa-user-check' :
                                            item.aspek_pembelajaran === 'Perilaku Adaptif' ? 'fa-sync-alt' : 'fa-question'
                                        ]"></i>
                                        {{ item.aspek_pembelajaran || '-' }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-gray-600">
                                    {{ item.nama_program || '-' }}
                                </td>
                                <td class="px-4 py-3 text-gray-600">
                                    {{ item.target_waktu || '-' }}
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <span :class="[
                                        'px-3 py-1.5 rounded-full text-xs font-bold shadow-sm',
                                        item.status_capaian === 'Selesai'
                                            ? 'bg-green-500 text-white'
                                            : item.status_capaian === 'Sedang Berlangsung'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-500 text-white'
                                    ]">
                                        {{ item.status_capaian || 'Belum Dimulai' }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-gray-600">
                                    {{ item.guru_pembuat?.nama || '-' }}
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-center gap-1.5 sm:gap-2">
                                        <!-- View Button -->
                                        <ViewButton title="Lihat Detail" @click="viewDetail(item)" />

                                        <!-- Edit Button -->
                                        <EditButton title="Edit" @click="editData(item)" />

                                        <!-- Delete Button -->
                                        <DeleteButton title="Hapus" @click="confirmDelete(item)" />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="border-t border-gray-200 bg-white px-4 sm:px-6 py-4">
                    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <!-- Items Per Page -->
                        <div class="flex items-center gap-3">
                            <label class="text-xs sm:text-sm text-gray-600 font-medium">Items per page:</label>
                            <select v-model.number="pagination.limit" @change="handleLimitChange"
                                class="px-3 py-1.5 border-2 border-gray-300 rounded-lg text-xs sm:text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer">
                                <option :value="10">10</option>
                                <option :value="25">25</option>
                                <option :value="50">50</option>
                                <option :value="100">100</option>
                            </select>
                        </div>

                        <!-- Pagination Info -->
                        <div class="text-xs sm:text-sm text-gray-600">
                            <span class="font-semibold text-gray-900">{{ startItem }}-{{ endItem }}</span>
                            of
                            <span class="font-semibold text-gray-900">{{ total }}</span>
                        </div>

                        <!-- Pagination Buttons -->
                        <div class="flex items-center gap-1.5">
                            <!-- First Page -->
                            <button @click="goToFirstPage" :disabled="pagination.page === 1 || isLoading"
                                class="p-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                title="First page">
                                <i class="fa-solid fa-chevron-left w-4 h-4 inline-block"></i><i class="fa-solid fa-chevron-left w-4 h-4 -ml-2 inline-block"></i>
                            </button>

                            <!-- Previous Page -->
                            <button @click="previousPage" :disabled="pagination.page === 1 || isLoading"
                                class="p-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                title="Previous page">
                                <i class="fa-solid fa-chevron-left w-4 h-4"></i>
                            </button>

                            <!-- Next Page -->
                            <button @click="nextPage" :disabled="pagination.page >= totalPages || isLoading"
                                class="p-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                title="Next page">
                                <i class="fa-solid fa-chevron-right w-4 h-4"></i>
                            </button>

                            <!-- Last Page -->
                            <button @click="goToLastPage" :disabled="pagination.page >= totalPages || isLoading"
                                class="p-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                title="Last page">
                                <i class="fa-solid fa-chevron-right w-4 h-4 inline-block"></i><i class="fa-solid fa-chevron-right w-4 h-4 -ml-2 inline-block"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="flex flex-col items-center justify-center py-12 px-4 bg-gray-50">
                <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <i class="fas fa-filter text-3xl text-gray-400"></i>
                </div>
                <h3 class="text-base font-semibold text-gray-900 mb-1">
                    {{ !filters.tahun_pelajaran_id || !filters.rombel_id ? 'Filter Belum Lengkap' : 'Tidak Ada Data' }}
                </h3>
                <p class="text-sm text-gray-600 text-center">
                    {{ !filters.tahun_pelajaran_id || !filters.rombel_id 
                        ? 'Pilih Tahun Pelajaran dan Rombel terlebih dahulu untuk menampilkan data' 
                        : 'Belum ada data PPI untuk filter yang dipilih' }}
                </p>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from '~/composables/useToast'
import { useAuthGuard } from '~/composables/useAuthGuard'
import DashboardLayout from '~/components/DashboardLayout.vue'
import CreatePPIModal from '~/components/modals/CreatePPIModal.vue'
import ViewPPIModal from '~/components/modals/ViewPPIModal.vue'
import EditPPIModal from '~/components/modals/EditPPIModal.vue'
import ConfirmationDeletePPIModal from '~/components/modals/ConfirmationDeletePPIModal.vue'
import ViewButton from '~/components/common/ViewButton.vue'
import EditButton from '~/components/common/EditButton.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'

definePageMeta({
    layout: 'default',
    middleware: 'auth',
})

useHead({
    title: 'Program Pembelajaran Individu (PPI) | PINTU SDN Sukapura 01',
    link: [
        {
            rel: 'icon',
            type: 'image/jpeg',
            href: '/logo-sekolah.jpg'
        },
        {
            rel: 'stylesheet',
            href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
        }
    ]
})

const { success: showToast, error: showErrorToast } = useToast()
const { handle401 } = useAuthGuard()

// State
const isLoading = ref(false)
const isLoadingSummary = ref(false)
const dataList = ref<any[]>([])
const total = ref(0)
const summaryData = ref<any>(null)
const showCreateModal = ref(false)
const showViewModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedDataId = ref<number | null>(null)
const selectedDataInfo = ref<any>(null)

// Dropdown Lists
const tahunPelajaranList = ref<any[]>([])
const rombelList = ref<any[]>([])
const anakInklusiList = ref<any[]>([])
const guruList = ref<any[]>([])

// Daftar Aspek Pembelajaran
const aspekPembelajaranList = [
    'Kognitif',
    'Bahasa & Komunikasi',
    'Motorik',
    'Sensori/Persepsi',
    'Sosial & Emosional',
    'Bina Diri/Kemandirian',
    'Perilaku Adaptif'
]

const filters = ref({
    tahun_pelajaran_id: '' as string | number,
    rombel_id: '' as string | number,
    anak_inklusi_rombel_id: '' as string | number,
    aspek_pembelajaran: '' as string,
    guru_pembuat_id: '' as string | number
})

const pagination = ref({
    limit: 10,
    page: 1
})

const totalPages = computed(() => Math.ceil(total.value / pagination.value.limit))

const startItem = computed(() => {
    if (total.value === 0) return 0
    return (pagination.value.page - 1) * pagination.value.limit + 1
})

const endItem = computed(() => {
    const end = pagination.value.page * pagination.value.limit
    return end > total.value ? total.value : end
})

onMounted(() => {
    loadTahunPelajaran()
    loadRombel()
    loadGuru()
})

// Watch for tahun_pelajaran_id changes to load summary
watch(() => filters.value.tahun_pelajaran_id, (newVal) => {
    if (newVal) {
        loadSummary()
    } else {
        summaryData.value = null
    }
})

// Load Tahun Pelajaran
async function loadTahunPelajaran() {
    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        const response = await $fetch<any>(
            `${config.public.apiBase}/api/v1/tahun-pelajaran/get-tahun-pelajaran`,
            {
                method: 'POST',
                body: {
                    search: {
                        status: ''
                    },
                    pagination: {
                        limit: 100,
                        page: 1
                    }
                },
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }
        )

        tahunPelajaranList.value = response.data || []
        
        // Set default tahun pelajaran yang aktif
        const activeTp = tahunPelajaranList.value.find((tp: any) => tp.status === 'active')
        if (activeTp) {
            filters.value.tahun_pelajaran_id = activeTp.id
            loadSummary()
        }
    } catch (error: any) {
        console.error('Error loading tahun pelajaran:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }
    }
}

// Load Rombel
async function loadRombel() {
    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        const response = await $fetch<any>(
            `${config.public.apiBase}/api/v1/rombel/get-rombel`,
            {
                method: 'POST',
                body: {
                    search: {},
                    pagination: {
                        limit: 100,
                        page: 1
                    }
                },
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }
        )

        rombelList.value = response.data || []
        
        // Load semua anak inklusi dan data
        if (filters.value.tahun_pelajaran_id) {
            loadAnakInklusi()
            loadData()
        }
    } catch (error: any) {
        console.error('Error loading rombel:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }
    }
}

// Load Anak Inklusi
async function loadAnakInklusi() {
    if (!filters.value.tahun_pelajaran_id) return

    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        const tahunPelajaranId = typeof filters.value.tahun_pelajaran_id === 'string'
            ? parseInt(filters.value.tahun_pelajaran_id)
            : filters.value.tahun_pelajaran_id

        const searchBody: any = {}

        // Add rombel_id to filter if selected
        if (filters.value.rombel_id) {
            searchBody.rombel_id = typeof filters.value.rombel_id === 'string' 
                ? parseInt(filters.value.rombel_id) 
                : filters.value.rombel_id
        }

        const response = await $fetch<any>(
            `${config.public.apiBase}/api/v1/monitoring-inklusi/get-data-induk-inklusi-rombel`,
            {
                method: 'POST',
                body: {
                    tahun_pelajaran_id: tahunPelajaranId,
                    search: searchBody,
                    pagination: {
                        limit: 1000,
                        page: 1
                    }
                },
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }
        )

        anakInklusiList.value = response.data || []
    } catch (error: any) {
        console.error('Error loading anak inklusi:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }
    }
}

// Load Guru
async function loadGuru() {
    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        const response = await $fetch<any>(
            `${config.public.apiBase}/api/v1/kepegawaian/get-kepegawaian`,
            {
                method: 'POST',
                body: {
                    search: {
                        status: 'active'
                    },
                    pagination: {
                        limit: 100,
                        page: 1
                    }
                },
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }
        )

        // Filter hanya jabatan Guru Kelas, Guru Bidang Studi, Guru Kelas dan Guru Bidang Studi
        const allowedJabatan = ['Guru Kelas', 'Guru Bidang Studi', 'Guru Kelas dan Guru Bidang Studi', 'Guru Pendamping Khusus']
        guruList.value = (response.data || []).filter((guru: any) => 
            allowedJabatan.includes(guru.jabatan)
        )
    } catch (error: any) {
        console.error('Error loading guru:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }
    }
}

// Load Summary PPI
async function loadSummary() {
    if (!filters.value.tahun_pelajaran_id) {
        summaryData.value = null
        return
    }

    isLoadingSummary.value = true
    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        const tahunPelajaranId = typeof filters.value.tahun_pelajaran_id === 'string'
            ? parseInt(filters.value.tahun_pelajaran_id)
            : filters.value.tahun_pelajaran_id

        const searchBody: any = {}

        // Add optional filters (hanya yang ada nilainya)
        if (filters.value.rombel_id) {
            searchBody.rombel_id = typeof filters.value.rombel_id === 'string'
                ? parseInt(filters.value.rombel_id)
                : filters.value.rombel_id
        }

        if (filters.value.guru_pembuat_id) {
            searchBody.guru_pembuat_id = typeof filters.value.guru_pembuat_id === 'string'
                ? parseInt(filters.value.guru_pembuat_id)
                : filters.value.guru_pembuat_id
        }

        if (filters.value.anak_inklusi_rombel_id) {
            searchBody.anak_inklusi_rombel_id = typeof filters.value.anak_inklusi_rombel_id === 'string'
                ? parseInt(filters.value.anak_inklusi_rombel_id)
                : filters.value.anak_inklusi_rombel_id
        }

        if (filters.value.aspek_pembelajaran) {
            searchBody.aspek_pembelajaran = filters.value.aspek_pembelajaran
        }

        const response = await $fetch<any>(
            `${config.public.apiBase}/api/v1/monitoring-inklusi/summary-ppi`,
            {
                method: 'POST',
                body: {
                    tahun_pelajaran_id: tahunPelajaranId,
                    search: searchBody
                },
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }
        )

        summaryData.value = response.data || null
    } catch (error: any) {
        console.error('Error loading summary:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }

        summaryData.value = null
    } finally {
        isLoadingSummary.value = false
    }
}

// Load Data PPI
async function loadData() {
    loadSummary()
    
    isLoading.value = true
    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        const searchBody: any = {}

        if (filters.value.tahun_pelajaran_id) {
            searchBody.tahun_pelajaran_id = typeof filters.value.tahun_pelajaran_id === 'string'
                ? parseInt(filters.value.tahun_pelajaran_id)
                : filters.value.tahun_pelajaran_id
        }

        if (filters.value.rombel_id) {
            searchBody.rombel_id = typeof filters.value.rombel_id === 'string'
                ? parseInt(filters.value.rombel_id)
                : filters.value.rombel_id
        }

        if (filters.value.anak_inklusi_rombel_id) {
            searchBody.anak_inklusi_rombel_id = typeof filters.value.anak_inklusi_rombel_id === 'string'
                ? parseInt(filters.value.anak_inklusi_rombel_id)
                : filters.value.anak_inklusi_rombel_id
        }

        if (filters.value.aspek_pembelajaran) {
            searchBody.aspek_pembelajaran = filters.value.aspek_pembelajaran
        }

        if (filters.value.guru_pembuat_id) {
            searchBody.guru_pembuat_id = typeof filters.value.guru_pembuat_id === 'string'
                ? parseInt(filters.value.guru_pembuat_id)
                : filters.value.guru_pembuat_id
        }

        const response = await $fetch<any>(
            `${config.public.apiBase}/api/v1/monitoring-inklusi/get-ppi`,
            {
                method: 'POST',
                body: {
                    search: searchBody,
                    pagination: {
                        limit: pagination.value.limit,
                        page: pagination.value.page
                    }
                },
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }
        )

        dataList.value = response.data || []
        total.value = response.pagination?.total || 0
    } catch (error: any) {
        console.error('Error loading data:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }

        showErrorToast('Gagal Memuat Data', 'Gagal memuat data PPI.')
    } finally {
        isLoading.value = false
    }
}

function resetFilters() {
    const activeTp = tahunPelajaranList.value.find((tp: any) => tp.status === 'active' || tp.status === 'Aktif')
    
    filters.value = {
        tahun_pelajaran_id: activeTp ? activeTp.id : '',
        rombel_id: '',
        anak_inklusi_rombel_id: '',
        aspek_pembelajaran: '',
        guru_pembuat_id: ''
    }
    pagination.value.page = 1
    
    loadAnakInklusi()
    loadData()
}

function handleTahunPelajaranChange() {
    filters.value.rombel_id = ''
    filters.value.anak_inklusi_rombel_id = ''
    anakInklusiList.value = []
    
    loadAnakInklusi()
    loadData()
}

function handleRombelChange() {
    filters.value.anak_inklusi_rombel_id = ''
    loadAnakInklusi()
    loadData()
}

function goToFirstPage() {
    pagination.value.page = 1
    loadData()
}

function previousPage() {
    if (pagination.value.page > 1) {
        pagination.value.page--
        loadData()
    }
}

function nextPage() {
    if (pagination.value.page < totalPages.value) {
        pagination.value.page++
        loadData()
    }
}

function goToLastPage() {
    pagination.value.page = totalPages.value
    loadData()
}

function handleLimitChange() {
    pagination.value.page = 1
    loadData()
}

function viewDetail(item: any) {
    selectedDataId.value = item.id
    showViewModal.value = true
}

function editData(item: any) {
    selectedDataId.value = item.id
    showEditModal.value = true
}

function confirmDelete(item: any) {
    selectedDataId.value = item.id
    selectedDataInfo.value = {
        nama_siswa: item.anak_inklusi_rombel?.anak_inklusi?.peserta_didik?.nama || '-',
        nama_program: item.nama_program || '-',
        bidang_studi: item.bidang_studi?.name || '-'
    }
    showDeleteModal.value = true
}

function handleCreateSuccess() {
    loadData()
}

function handleEditSuccess() {
    loadData()
}

function handleDeleteSuccess() {
    loadData()
}
</script>
