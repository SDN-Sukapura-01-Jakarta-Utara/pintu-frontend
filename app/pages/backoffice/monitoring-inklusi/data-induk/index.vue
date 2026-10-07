<template>
    <DashboardLayout>
        <!-- Modal -->
        <CreateDataIndukInklusiModal v-model="showCreateModal" @success="handleCreateSuccess" />
        <ViewDataIndukInklusiModal v-model="showViewModal" :dataId="selectedDataId" />
        <EditDataIndukInklusiModal v-model="showEditModal" :dataId="selectedDataId" @success="handleEditSuccess" />
        <ConfirmationDeleteDataIndukInklusiModal v-model="showDeleteModal" :dataId="selectedDataId" @success="handleDeleteSuccess" />
        <SyncDataIndukInklusiModal v-model="showSyncModal" :tahunPelajaranList="tahunPelajaranList" @success="handleSyncSuccess" />
        <ViewDataInklusiRombelModal v-model="showViewRombelModal" :dataId="selectedRombelDataId" />
        <EditDataInklusiRombelModal v-model="showEditRombelModal" :dataId="selectedRombelDataId" @success="handleEditRombelSuccess" />
        <ConfirmationDeleteDataInklusiRombelModal v-model="showDeleteRombelModal" :dataId="selectedRombelDataId" @success="handleDeleteRombelSuccess" />

        <!-- Header Section -->
        <div class="mb-6 sm:mb-8">
            <div class="flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
                <div>
                    <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Data Induk Inklusi</h1>
                    <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
                        Kelola data induk siswa berkebutuhan khusus
                    </p>
                </div>
                <button v-if="mainTab === 'data-induk'" @click="showCreateModal = true"
                    class="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition-all text-sm cursor-pointer">
                    <i class="fa-solid fa-plus"></i>
                    <span>Tambah Data Induk Inklusi</span>
                </button>
            </div>
        </div>

        <!-- Main Content -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <!-- Main Tabs -->
            <div class="border-b border-gray-200">
                <nav class="flex overflow-x-auto" aria-label="Tabs">
                    <button @click="mainTab = 'data-induk'" :class="[
                        'flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer',
                        mainTab === 'data-induk'
                            ? 'border-red-600 text-red-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    ]">
                        <i class="fas fa-database"></i>
                        <span>Data Induk Anak Inklusi</span>
                    </button>
                    <button @click="mainTab = 'per-rombel'" :class="[
                        'flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer',
                        mainTab === 'per-rombel'
                            ? 'border-red-600 text-red-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    ]">
                        <i class="fas fa-users-rectangle"></i>
                        <span>Data Anak Inklusi Per Rombel</span>
                    </button>
                    <button @click="mainTab = 'history'" :class="[
                        'flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer',
                        mainTab === 'history'
                            ? 'border-red-600 text-red-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    ]">
                        <i class="fas fa-clock-rotate-left"></i>
                        <span>History Anak Inklusi</span>
                    </button>
                </nav>
            </div>

            <!-- Tab Content: Data Induk Anak Inklusi -->
            <div v-if="mainTab === 'data-induk'">
                <!-- Filter Section -->
                <div class="bg-white p-4 sm:p-6 border-b border-gray-200">
                    <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Filter Data Inklusi</h3>

                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            <!-- Nama Filter -->
                            <div>
                                <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">Nama</label>
                                <input v-model="filters.nama_peserta_didik" @keyup.enter="loadData" type="text"
                                    placeholder="Cari nama..."
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                            </div>

                            <!-- NISN Filter -->
                            <div>
                                <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">NISN</label>
                                <input v-model="filters.nisn" @keyup.enter="loadData" type="text"
                                    placeholder="Cari NISN..."
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                            </div>

                            <!-- Jenis Hambatan Filter -->
                            <div>
                                <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">Jenis Hambatan</label>
                                <select v-model="filters.jenis_hambatan" @change="loadData"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                                    <option value="">Semua Jenis</option>
                                    <option value="Tunanetra / hambatan penglihatan">Tunanetra / hambatan penglihatan
                                    </option>
                                    <option value="Tunarungu / hambatan pendengaran">Tunarungu / hambatan pendengaran
                                    </option>
                                    <option value="Tunadaksa / hambatan fisik-motorik">Tunadaksa / hambatan
                                        fisik-motorik</option>
                                    <option value="Tunagrahita / hambatan intelektual">Tunagrahita / hambatan
                                        intelektual</option>
                                    <option value="Kesulitan belajar spesifik">Kesulitan belajar spesifik</option>
                                    <option value="Lamban belajar (slow learner)">Lamban belajar (slow learner)
                                    </option>
                                    <option value="Gangguan komunikasi/bahasa">Gangguan komunikasi/bahasa</option>
                                    <option value="Autisme / ASD">Autisme / ASD</option>
                                    <option value="ADHD / gangguan perhatian dan hiperaktivitas">ADHD / gangguan
                                        perhatian dan hiperaktivitas</option>
                                    <option value="Hambatan sosial-emosional/perilaku">Hambatan
                                        sosial-emosional/perilaku</option>
                                    <option value="Hambatan Psikososial / Mental-Emosional">Hambatan Psikososial /
                                        Mental-Emosional</option>
                                    <option value="Anak berbakat/cerdas istimewa">Anak berbakat/cerdas istimewa
                                    </option>
                                    <option value="Multiple disabilities / Hambatan Majemuk">Multiple disabilities /
                                        Hambatan Majemuk</option>
                                </select>
                            </div>

                            <!-- Status Filter -->
                            <div>
                                <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">Status</label>
                                <select v-model="filters.status" @change="loadData"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                                    <option value="">Semua Status</option>
                                    <option value="identified">Identified</option>
                                    <option value="diagnosed">Diagnosed</option>
                                </select>
                            </div>

                            <!-- Tanggal Mulai -->
                            <div>
                                <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">Tanggal Mulai</label>
                                <input v-model="filters.start_date" type="date"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                            </div>

                            <!-- Tanggal Akhir -->
                            <div>
                                <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">Tanggal Akhir</label>
                                <input v-model="filters.end_date" type="date"
                                    class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                            </div>
                        </div>

                        <div class="flex gap-2">
                            <button @click="loadData"
                                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer">
                                <i class="fas fa-search"></i>
                                Cari
                            </button>
                            <button @click="resetFilters"
                                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer">
                                <i class="fas fa-redo"></i>
                                Reset
                            </button>
                        </div>
                </div>

                <!-- Loading State -->
                <div v-if="isLoading" class="flex items-center justify-center py-12 px-4 sm:px-6">
                        <div class="flex flex-col items-center gap-3">
                            <div
                                class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600">
                            </div>
                            <p class="text-sm text-gray-600 font-medium">Memuat data...</p>
                        </div>
                    </div>

                    <!-- Table Section -->
                    <div v-else-if="dataList.length > 0">
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm">
                                <thead class="bg-gray-700 border-b-2 border-gray-600">
                                    <tr>
                                        <th
                                            class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                                            No</th>
                                        <th
                                            class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                            Nama Lengkap</th>
                                        <th
                                            class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                                            NISN</th>
                                        <th
                                            class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                            Nama Ayah</th>
                                        <th
                                            class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                            Nama Ibu</th>
                                        <th
                                            class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                            Jenis Hambatan</th>
                                        <th
                                            class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                                            Tgl Identifikasi</th>
                                        <th
                                            class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                                            Tgl Diagnosa</th>
                                        <th
                                            class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                                            Tgl Kadaluarsa Surat</th>
                                        <th
                                            class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                                            Status</th>
                                        <th
                                            class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                            Catatan</th>
                                        <th
                                            class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                                            File Surat</th>
                                        <th
                                            class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                                            Aksi</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-200">
                                    <tr v-for="(item, index) in dataList" :key="item.id"
                                        class="hover:bg-gray-50 transition-colors">
                                        <td class="px-4 py-3 text-center text-gray-900">
                                            {{ (pagination.page - 1) * pagination.limit + index + 1 }}
                                        </td>
                                        <td class="px-4 py-3 text-gray-900 font-medium">
                                            {{ item.peserta_didik?.nama || '-' }}
                                        </td>
                                        <td class="px-4 py-3 text-center text-gray-600">
                                            {{ item.peserta_didik?.nisn || '-' }}
                                        </td>
                                        <td class="px-4 py-3 text-gray-600">
                                            {{ item.peserta_didik?.nama_ayah || '-' }}
                                        </td>
                                        <td class="px-4 py-3 text-gray-600">
                                            {{ item.peserta_didik?.nama_ibu || '-' }}
                                        </td>
                                        <td class="px-4 py-3 text-gray-600">
                                            {{ item.jenis_hambatan || '-' }}
                                        </td>
                                        <td class="px-4 py-3 text-center text-gray-600">
                                            {{ formatDate(item.tanggal_identifikasi) }}
                                        </td>
                                        <td class="px-4 py-3 text-center text-gray-600">
                                            {{ formatDate(item.tanggal_diagnosa) }}
                                        </td>
                                        <td class="px-4 py-3 text-center text-gray-600">
                                            {{ formatDate(item.tanggal_kadaluarsa_surat) }}
                                        </td>
                                        <td class="px-4 py-3 text-center">
                                            <span :class="[
                                                'px-2 py-1 rounded-full text-xs font-medium',
                                                item.status === 'diagnosed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            ]">
                                                {{ item.status === 'diagnosed' ? 'Diagnosed' : 'Identified' }}
                                            </span>
                                        </td>
                                        <td class="px-4 py-3 text-gray-600">
                                            {{ item.catatan || '-' }}
                                        </td>
                                        <td class="px-4 py-3 text-center">
                                            <button v-if="item.file_surat_dokter_url"
                                                @click="openFile(item.file_surat_dokter_url)" title="Lihat File Surat"
                                                class="inline-flex items-center justify-center gap-1.5 px-3 sm:px-2.5 py-2 sm:pt-2.5 sm:pb-1.5 rounded-lg bg-gradient-to-br from-purple-50 to-violet-100 text-purple-700 font-semibold text-xs border border-purple-200 shadow-sm hover:shadow-md hover:from-purple-100 hover:to-violet-200 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                                                <i class="fa-solid fa-file-lines w-3.5 h-3.5 sm:w-5 sm:h-5"></i>
                                                <span class="hidden sm:inline">Lihat Surat</span>
                                            </button>
                                            <span v-else class="text-gray-400 text-sm">-</span>
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
                                        class="px-3 py-1.5 border-2 border-gray-300 rounded-lg text-xs sm:text-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
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
                        <i class="fas fa-inbox text-3xl text-gray-400"></i>
                    </div>
                    <h3 class="text-base font-semibold text-gray-900 mb-1">Tidak Ada Data</h3>
                    <p class="text-sm text-gray-600 text-center">Belum ada data induk inklusi</p>
                </div>
            </div>

            <!-- Tab Content: Data Per Rombel -->
            <div v-if="mainTab === 'per-rombel'">
                <!-- Filter Section -->
                <div class="bg-white p-4 sm:p-6 border-b border-gray-200">
                    <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Filter Data Inklusi Per Rombel</h3>

                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <!-- Tahun Pelajaran Filter -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">Tahun Pelajaran</label>
                            <select v-model="rombelFilters.tahun_pelajaran_id" @change="loadRombelData"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                                <option value="">Pilih Tahun Pelajaran</option>
                                <option v-for="tp in tahunPelajaranList" :key="tp.id" :value="tp.id">
                                    {{ tp.tahun_pelajaran }}
                                </option>
                            </select>
                        </div>

                        <!-- Nama Filter -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">Nama</label>
                            <input v-model="rombelFilters.nama_peserta_didik" @keyup.enter="loadRombelData" type="text"
                                placeholder="Cari nama..."
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                        </div>

                        <!-- NISN Filter -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">NISN</label>
                            <input v-model="rombelFilters.nisn" @keyup.enter="loadRombelData" type="text"
                                placeholder="Cari NISN..."
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                        </div>

                        <!-- Jenis Hambatan Filter -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">Jenis Hambatan</label>
                            <select v-model="rombelFilters.jenis_hambatan" @change="loadRombelData"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                                <option value="">Semua Jenis</option>
                                <option value="Tunanetra / hambatan penglihatan">Tunanetra / hambatan penglihatan</option>
                                <option value="Tunarungu / hambatan pendengaran">Tunarungu / hambatan pendengaran</option>
                                <option value="Tunadaksa / hambatan fisik-motorik">Tunadaksa / hambatan fisik-motorik</option>
                                <option value="Tunagrahita / hambatan intelektual">Tunagrahita / hambatan intelektual</option>
                                <option value="Kesulitan belajar spesifik">Kesulitan belajar spesifik</option>
                                <option value="Lamban belajar (slow learner)">Lamban belajar (slow learner)</option>
                                <option value="Gangguan komunikasi/bahasa">Gangguan komunikasi/bahasa</option>
                                <option value="Autisme / ASD">Autisme / ASD</option>
                                <option value="ADHD / gangguan perhatian dan hiperaktivitas">ADHD / gangguan perhatian dan hiperaktivitas</option>
                                <option value="Hambatan sosial-emosional/perilaku">Hambatan sosial-emosional/perilaku</option>
                                <option value="Hambatan Psikososial / Mental-Emosional">Hambatan Psikososial / Mental-Emosional</option>
                                <option value="Anak berbakat/cerdas istimewa">Anak berbakat/cerdas istimewa</option>
                                <option value="Multiple disabilities / Hambatan Majemuk">Multiple disabilities / Hambatan Majemuk</option>
                            </select>
                        </div>

                        <!-- Status Filter -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">Status Inklusi</label>
                            <select v-model="rombelFilters.status" @change="loadRombelData"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                                <option value="">Semua Status</option>
                                <option value="identified">Identified</option>
                                <option value="diagnosed">Diagnosed</option>
                            </select>
                        </div>
                    </div>

                    <div class="flex gap-2">
                        <button @click="loadRombelData"
                            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer">
                            <i class="fas fa-search"></i>
                            Cari
                        </button>
                        <button @click="resetRombelFilters"
                            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer">
                            <i class="fas fa-redo"></i>
                            Reset
                        </button>
                        <button @click="showSyncModal = true"
                            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer">
                            <i class="fas fa-sync-alt"></i>
                            Sync Data Induk Inklusi
                        </button>
                    </div>
                </div>

                <!-- Loading State -->
                <div v-if="isLoadingRombel" class="flex items-center justify-center py-12 px-4 sm:px-6">
                    <div class="flex flex-col items-center gap-3">
                        <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
                        <p class="text-sm text-gray-600 font-medium">Memuat data...</p>
                    </div>
                </div>

                <!-- Table Section -->
                <div v-else-if="rombelList.length > 0">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-gray-700 border-b-2 border-gray-600">
                                <tr>
                                    <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">No</th>
                                    <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Nama Peserta Didik</th>
                                    <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">NISN</th>
                                    <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Jenis Hambatan</th>
                                    <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Status Inklusi</th>
                                    <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Rombel</th>
                                    <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Tahun Pelajaran</th>
                                    <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Guru Kelas</th>
                                    <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Guru Pendamping Khusus</th>
                                    <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                <tr v-for="(item, index) in rombelList" :key="item.id" class="hover:bg-gray-50 transition-colors">
                                    <td class="px-4 py-3 text-center text-gray-900">
                                        {{ (rombelPagination.page - 1) * rombelPagination.limit + index + 1 }}
                                    </td>
                                    <td class="px-4 py-3 text-gray-900 font-medium">
                                        {{ item.anak_inklusi?.peserta_didik?.nama || '-' }}
                                    </td>
                                    <td class="px-4 py-3 text-center text-gray-600">
                                        {{ item.anak_inklusi?.peserta_didik?.nisn || '-' }}
                                    </td>
                                    <td class="px-4 py-3 text-gray-600">
                                        {{ item.anak_inklusi?.jenis_hambatan || '-' }}
                                    </td>
                                    <td class="px-4 py-3 text-center">
                                        <span :class="[
                                            'px-2 py-1 rounded-full text-xs font-medium',
                                            item.anak_inklusi?.status === 'diagnosed'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        ]">
                                            {{ item.anak_inklusi?.status === 'diagnosed' ? 'Diagnosed' : 'Identified' }}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 text-center text-gray-600">
                                        {{ item.peserta_didik_rombel?.rombel?.name || '-' }}
                                    </td>
                                    <td class="px-4 py-3 text-center text-gray-600">
                                        {{ item.peserta_didik_rombel?.tahun_pelajaran?.tahun_pelajaran || '-' }}
                                    </td>
                                    <td class="px-4 py-3 text-gray-600">
                                        {{ item.guru_kelas?.nama || '-' }}
                                    </td>
                                    <td class="px-4 py-3 text-gray-600">
                                        {{ item.guru_pendamping_khusus?.nama || '-' }}
                                    </td>
                                    <td class="px-4 py-3">
                                        <div class="flex items-center justify-center gap-1.5 sm:gap-2">
                                            <!-- View Button -->
                                            <ViewButton title="Lihat Detail" @click="viewRombelDetail(item)" />

                                            <!-- Edit Button -->
                                            <EditButton title="Edit" @click="editRombelData(item)" />

                                            <!-- Delete Button -->
                                            <DeleteButton title="Hapus" @click="confirmDeleteRombel(item)" />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div class="border-t border-gray-200 bg-white px-4 sm:px-6 py-4">
                        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div class="flex items-center gap-3">
                                <label class="text-xs sm:text-sm text-gray-600 font-medium">Items per page:</label>
                                <select v-model.number="rombelPagination.limit" @change="handleRombelLimitChange"
                                    class="px-3 py-1.5 border-2 border-gray-300 rounded-lg text-xs sm:text-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                                    <option :value="10">10</option>
                                    <option :value="25">25</option>
                                    <option :value="50">50</option>
                                    <option :value="100">100</option>
                                </select>
                            </div>

                            <div class="text-xs sm:text-sm text-gray-600">
                                <span class="font-semibold text-gray-900">{{ rombelStartItem }}-{{ rombelEndItem }}</span>
                                of
                                <span class="font-semibold text-gray-900">{{ rombelTotal }}</span>
                            </div>

                            <div class="flex items-center gap-1.5">
                                <button @click="goToFirstRombelPage" :disabled="rombelPagination.page === 1 || isLoadingRombel"
                                    class="p-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    title="First page">
                                    <i class="fa-solid fa-chevron-left w-4 h-4 inline-block"></i><i class="fa-solid fa-chevron-left w-4 h-4 -ml-2 inline-block"></i>
                                </button>

                                <button @click="previousRombelPage" :disabled="rombelPagination.page === 1 || isLoadingRombel"
                                    class="p-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    title="Previous page">
                                    <i class="fa-solid fa-chevron-left w-4 h-4"></i>
                                </button>

                                <button @click="nextRombelPage" :disabled="rombelPagination.page >= rombelTotalPages || isLoadingRombel"
                                    class="p-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    title="Next page">
                                    <i class="fa-solid fa-chevron-right w-4 h-4"></i>
                                </button>

                                <button @click="goToLastRombelPage" :disabled="rombelPagination.page >= rombelTotalPages || isLoadingRombel"
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
                        <i class="fas fa-users-rectangle text-3xl text-gray-400"></i>
                    </div>
                    <h3 class="text-base font-semibold text-gray-900 mb-1">Tidak Ada Data</h3>
                    <p class="text-sm text-gray-600 text-center">Belum ada data inklusi per rombel</p>
                </div>
            </div>

            <!-- Tab Content: History -->
            <div v-if="mainTab === 'history'">
                <!-- Filter Section -->
                <div class="bg-white p-4 sm:p-6 border-b border-gray-200">
                    <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Filter History Inklusi</h3>

                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <!-- Nama Filter -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">Nama</label>
                            <input v-model="historyFilters.nama_peserta_didik" @keyup.enter="loadHistoryData" type="text"
                                placeholder="Cari nama..."
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                        </div>

                        <!-- NIS Filter -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">NIS</label>
                            <input v-model="historyFilters.nis" @keyup.enter="loadHistoryData" type="text"
                                placeholder="Cari NIS..."
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                        </div>

                        <!-- NISN Filter -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">NISN</label>
                            <input v-model="historyFilters.nisn" @keyup.enter="loadHistoryData" type="text"
                                placeholder="Cari NISN..."
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                        </div>

                        <!-- Jenis Hambatan Filter -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">Jenis Hambatan</label>
                            <select v-model="historyFilters.jenis_hambatan" @change="loadHistoryData"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                                <option value="">Semua Jenis</option>
                                <option value="Tunanetra / hambatan penglihatan">Tunanetra / hambatan penglihatan</option>
                                <option value="Tunarungu / hambatan pendengaran">Tunarungu / hambatan pendengaran</option>
                                <option value="Tunadaksa / hambatan fisik-motorik">Tunadaksa / hambatan fisik-motorik</option>
                                <option value="Tunagrahita / hambatan intelektual">Tunagrahita / hambatan intelektual</option>
                                <option value="Kesulitan belajar spesifik">Kesulitan belajar spesifik</option>
                                <option value="Lamban belajar (slow learner)">Lamban belajar (slow learner)</option>
                                <option value="Gangguan komunikasi/bahasa">Gangguan komunikasi/bahasa</option>
                                <option value="Autisme / ASD">Autisme / ASD</option>
                                <option value="ADHD / gangguan perhatian dan hiperaktivitas">ADHD / gangguan perhatian dan hiperaktivitas</option>
                                <option value="Hambatan sosial-emosional/perilaku">Hambatan sosial-emosional/perilaku</option>
                                <option value="Hambatan Psikososial / Mental-Emosional">Hambatan Psikososial / Mental-Emosional</option>
                                <option value="Anak berbakat/cerdas istimewa">Anak berbakat/cerdas istimewa</option>
                                <option value="Multiple disabilities / Hambatan Majemuk">Multiple disabilities / Hambatan Majemuk</option>
                            </select>
                        </div>

                        <!-- Status Filter -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">Status</label>
                            <select v-model="historyFilters.status" @change="loadHistoryData"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                                <option value="">Semua Status</option>
                                <option value="identified">Identified</option>
                                <option value="diagnosed">Diagnosed</option>
                            </select>
                        </div>

                        <!-- Tanggal Mulai -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">Tanggal Mulai</label>
                            <input v-model="historyFilters.start_date" type="date"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                        </div>

                        <!-- Tanggal Akhir -->
                        <div>
                            <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">Tanggal Akhir</label>
                            <input v-model="historyFilters.end_date" type="date"
                                class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                        </div>
                    </div>

                    <div class="flex gap-2">
                        <button @click="loadHistoryData"
                            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer">
                            <i class="fas fa-search"></i>
                            Cari
                        </button>
                        <button @click="resetHistoryFilters"
                            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer">
                            <i class="fas fa-redo"></i>
                            Reset
                        </button>
                    </div>
                </div>

                <!-- Loading State -->
                <div v-if="isLoadingHistory" class="flex items-center justify-center py-12 px-4 sm:px-6">
                    <div class="flex flex-col items-center gap-3">
                        <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>
                        <p class="text-sm text-gray-600 font-medium">Memuat data history...</p>
                    </div>
                </div>

                <!-- Table Section -->
                <div v-else-if="historyList.length > 0">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-gray-700 border-b-2 border-gray-600">
                                <tr>
                                    <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">No</th>
                                    <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Nama Lengkap</th>
                                    <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">NIS</th>
                                    <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">NISN</th>
                                    <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Nama Ayah</th>
                                    <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Nama Ibu</th>
                                    <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Jenis Hambatan</th>
                                    <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Tgl Identifikasi</th>
                                    <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Tgl Diagnosa</th>
                                    <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Tgl Kadaluarsa Surat</th>
                                    <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Status Inklusi</th>
                                    <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Status Keaktifan</th>
                                    <th class="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Catatan</th>
                                    <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">File Surat</th>
                                    <th class="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                <tr v-for="(item, index) in historyList" :key="item.id" class="hover:bg-gray-50 transition-colors">
                                    <td class="px-4 py-3 text-center text-gray-900">
                                        {{ (historyPagination.page - 1) * historyPagination.limit + index + 1 }}
                                    </td>
                                    <td class="px-4 py-3 text-gray-900 font-medium">
                                        {{ item.peserta_didik?.nama || '-' }}
                                    </td>
                                    <td class="px-4 py-3 text-center text-gray-600">
                                        {{ item.peserta_didik?.nis || '-' }}
                                    </td>
                                    <td class="px-4 py-3 text-center text-gray-600">
                                        {{ item.peserta_didik?.nisn || '-' }}
                                    </td>
                                    <td class="px-4 py-3 text-gray-600">
                                        {{ item.peserta_didik?.nama_ayah || '-' }}
                                    </td>
                                    <td class="px-4 py-3 text-gray-600">
                                        {{ item.peserta_didik?.nama_ibu || '-' }}
                                    </td>
                                    <td class="px-4 py-3 text-gray-600">
                                        {{ item.jenis_hambatan || '-' }}
                                    </td>
                                    <td class="px-4 py-3 text-center text-gray-600">
                                        {{ formatDate(item.tanggal_identifikasi) }}
                                    </td>
                                    <td class="px-4 py-3 text-center text-gray-600">
                                        {{ formatDate(item.tanggal_diagnosa) }}
                                    </td>
                                    <td class="px-4 py-3 text-center text-gray-600">
                                        {{ formatDate(item.tanggal_kadaluarsa_surat) }}
                                    </td>
                                    <td class="px-4 py-3 text-center">
                                        <span :class="[
                                            'px-2 py-1 rounded-full text-xs font-medium',
                                            item.status === 'diagnosed'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        ]">
                                            {{ item.status === 'diagnosed' ? 'Diagnosed' : 'Identified' }}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 text-center">
                                        <span :class="[
                                            'px-2 py-1 rounded-full text-xs font-medium',
                                            item.peserta_didik?.status === 'active'
                                                ? 'bg-blue-100 text-blue-800'
                                                : item.peserta_didik?.status === 'mutasi'
                                                ? 'bg-orange-100 text-orange-800'
                                                : item.peserta_didik?.status === 'lulus'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-gray-100 text-gray-800'
                                        ]">
                                            {{ getStatusKeaktifanLabel(item.peserta_didik?.status) }}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 text-gray-600">
                                        {{ item.catatan || '-' }}
                                    </td>
                                    <td class="px-4 py-3 text-center">
                                        <button v-if="item.file_surat_dokter_url"
                                            @click="openFile(item.file_surat_dokter_url)" title="Lihat File Surat"
                                            class="inline-flex items-center justify-center gap-1.5 px-3 sm:px-2.5 py-2 sm:pt-2.5 sm:pb-1.5 rounded-lg bg-gradient-to-br from-purple-50 to-violet-100 text-purple-700 font-semibold text-xs border border-purple-200 shadow-sm hover:shadow-md hover:from-purple-100 hover:to-violet-200 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                                            <i class="fa-solid fa-file-lines w-3.5 h-3.5 sm:w-5 sm:h-5"></i>
                                            <span class="hidden sm:inline">Lihat Surat</span>
                                        </button>
                                        <span v-else class="text-gray-400 text-sm">-</span>
                                    </td>
                                    <td class="px-4 py-3">
                                        <div class="flex items-center justify-center gap-1.5 sm:gap-2">
                                            <!-- View Button -->
                                            <ViewButton title="Lihat Detail" @click="viewHistoryDetail(item)" />

                                            <!-- Delete Button -->
                                            <DeleteButton title="Hapus" @click="confirmDeleteHistory(item)" />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div class="border-t border-gray-200 bg-white px-4 sm:px-6 py-4">
                        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div class="flex items-center gap-3">
                                <label class="text-xs sm:text-sm text-gray-600 font-medium">Items per page:</label>
                                <select v-model.number="historyPagination.limit" @change="handleHistoryLimitChange"
                                    class="px-3 py-1.5 border-2 border-gray-300 rounded-lg text-xs sm:text-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                                    <option :value="10">10</option>
                                    <option :value="25">25</option>
                                    <option :value="50">50</option>
                                    <option :value="100">100</option>
                                </select>
                            </div>

                            <div class="text-xs sm:text-sm text-gray-600">
                                <span class="font-semibold text-gray-900">{{ historyStartItem }}-{{ historyEndItem }}</span>
                                of
                                <span class="font-semibold text-gray-900">{{ historyTotal }}</span>
                            </div>

                            <div class="flex items-center gap-1.5">
                                <button @click="goToFirstHistoryPage" :disabled="historyPagination.page === 1 || isLoadingHistory"
                                    class="p-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    title="First page">
                                    <i class="fa-solid fa-chevron-left w-4 h-4 inline-block"></i><i class="fa-solid fa-chevron-left w-4 h-4 -ml-2 inline-block"></i>
                                </button>

                                <button @click="previousHistoryPage" :disabled="historyPagination.page === 1 || isLoadingHistory"
                                    class="p-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    title="Previous page">
                                    <i class="fa-solid fa-chevron-left w-4 h-4"></i>
                                </button>

                                <button @click="nextHistoryPage" :disabled="historyPagination.page >= historyTotalPages || isLoadingHistory"
                                    class="p-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    title="Next page">
                                    <i class="fa-solid fa-chevron-right w-4 h-4"></i>
                                </button>

                                <button @click="goToLastHistoryPage" :disabled="historyPagination.page >= historyTotalPages || isLoadingHistory"
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
                        <i class="fas fa-clock-rotate-left text-3xl text-gray-400"></i>
                    </div>
                    <h3 class="text-base font-semibold text-gray-900 mb-1">Tidak Ada Data History</h3>
                    <p class="text-sm text-gray-600 text-center">Belum ada data history inklusi</p>
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from '~/composables/useToast'
import { useAuthGuard } from '~/composables/useAuthGuard'
import DashboardLayout from '~/components/DashboardLayout.vue'
import CreateDataIndukInklusiModal from '~/components/modals/CreateDataIndukInklusiModal.vue'
import ViewDataIndukInklusiModal from '~/components/modals/ViewDataIndukInklusiModal.vue'
import EditDataIndukInklusiModal from '~/components/modals/EditDataIndukInklusiModal.vue'
import ConfirmationDeleteDataIndukInklusiModal from '~/components/modals/ConfirmationDeleteDataIndukInklusiModal.vue'
import SyncDataIndukInklusiModal from '~/components/modals/SyncDataIndukInklusiModal.vue'
import ViewDataInklusiRombelModal from '~/components/modals/ViewDataInklusiRombelModal.vue'
import EditDataInklusiRombelModal from '~/components/modals/EditDataInklusiRombelModal.vue'
import ConfirmationDeleteDataInklusiRombelModal from '~/components/modals/ConfirmationDeleteDataInklusiRombelModal.vue'
import ViewButton from '~/components/common/ViewButton.vue'
import EditButton from '~/components/common/EditButton.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'

definePageMeta({
    layout: 'default',
    middleware: 'auth',
})

useHead({
    title: 'Data Induk Inklusi | PINTU SDN Sukapura 01',
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
const mainTab = ref('data-induk')
const isLoading = ref(false)
const dataList = ref<any[]>([])
const total = ref(0)
const showCreateModal = ref(false)
const showViewModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showSyncModal = ref(false)
const showViewRombelModal = ref(false)
const showEditRombelModal = ref(false)
const showDeleteRombelModal = ref(false)
const selectedDataId = ref<number | null>(null)
const selectedRombelDataId = ref<number | null>(null)

// History State
const isLoadingHistory = ref(false)
const historyList = ref<any[]>([])
const historyTotal = ref(0)

// Rombel State
const isLoadingRombel = ref(false)
const rombelList = ref<any[]>([])
const rombelTotal = ref(0)
const tahunPelajaranList = ref<any[]>([])

const filters = ref({
    nama_peserta_didik: '',
    nisn: '',
    jenis_hambatan: '',
    start_date: '',
    end_date: '',
    status: ''
})

const pagination = ref({
    limit: 10,
    page: 1
})

const historyFilters = ref({
    nama_peserta_didik: '',
    nis: '',
    nisn: '',
    jenis_hambatan: '',
    start_date: '',
    end_date: '',
    status: ''
})

const historyPagination = ref({
    limit: 10,
    page: 1
})

const rombelFilters = ref({
    tahun_pelajaran_id: '' as string | number,
    nama_peserta_didik: '',
    nisn: '',
    jenis_hambatan: '',
    status: ''
})

const rombelPagination = ref({
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

const historyTotalPages = computed(() => Math.ceil(historyTotal.value / historyPagination.value.limit))

const historyStartItem = computed(() => {
    if (historyTotal.value === 0) return 0
    return (historyPagination.value.page - 1) * historyPagination.value.limit + 1
})

const historyEndItem = computed(() => {
    const end = historyPagination.value.page * historyPagination.value.limit
    return end > historyTotal.value ? historyTotal.value : end
})

const rombelTotalPages = computed(() => Math.ceil(rombelTotal.value / rombelPagination.value.limit))

const rombelStartItem = computed(() => {
    if (rombelTotal.value === 0) return 0
    return (rombelPagination.value.page - 1) * rombelPagination.value.limit + 1
})

const rombelEndItem = computed(() => {
    const end = rombelPagination.value.page * rombelPagination.value.limit
    return end > rombelTotal.value ? rombelTotal.value : end
})

onMounted(() => {
    loadData()
    loadTahunPelajaran()
})

watch(mainTab, (newTab) => {
    if (newTab === 'history' && historyList.value.length === 0) {
        loadHistoryData()
    }
    if (newTab === 'per-rombel' && rombelList.value.length === 0) {
        loadRombelData()
    }
})

async function loadData() {
    isLoading.value = true
    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        const response = await $fetch<any>(
            `${config.public.apiBase}/api/v1/monitoring-inklusi/get-data-induk-inklusi`,
            {
                method: 'POST',
                body: {
                    search: {
                        nama_peserta_didik: filters.value.nama_peserta_didik || '',
                        nisn: filters.value.nisn || '',
                        jenis_hambatan: filters.value.jenis_hambatan || '',
                        start_date: filters.value.start_date || '',
                        end_date: filters.value.end_date || '',
                        status: filters.value.status || ''
                    },
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

        showErrorToast('Gagal Memuat Data', 'Gagal memuat data induk inklusi.')
    } finally {
        isLoading.value = false
    }
}

function resetFilters() {
    filters.value = {
        nama_peserta_didik: '',
        nisn: '',
        jenis_hambatan: '',
        start_date: '',
        end_date: '',
        status: ''
    }
    pagination.value.page = 1
    loadData()
}

function changePage(page: number) {
    pagination.value.page = page
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
    pagination.value.page = 1 // Reset to first page when limit changes
    loadData()
}

function formatDate(date: string) {
    if (!date) return '-'
    const d = new Date(date)
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    const day = d.getDate()
    const month = months[d.getMonth()]
    const year = d.getFullYear()
    return `${day} ${month} ${year}`
}

function openFile(url: string) {
    window.open(url, '_blank')
}

function handleCreateSuccess() {
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

function handleEditSuccess() {
    loadData()
    if (mainTab.value === 'per-rombel') {
        loadRombelData()
    }
}

function confirmDelete(item: any) {
    selectedDataId.value = item.id
    showDeleteModal.value = true
}

function handleDeleteSuccess() {
    loadData()
    if (mainTab.value === 'per-rombel') {
        loadRombelData()
    }
}

// History Functions
async function loadHistoryData() {
    isLoadingHistory.value = true
    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        const response = await $fetch<any>(
            `${config.public.apiBase}/api/v1/monitoring-inklusi/get-history-data-induk-inklusi`,
            {
                method: 'POST',
                body: {
                    search: {
                        nama_peserta_didik: historyFilters.value.nama_peserta_didik || '',
                        nis: historyFilters.value.nis || '',
                        nisn: historyFilters.value.nisn || '',
                        jenis_hambatan: historyFilters.value.jenis_hambatan || '',
                        start_date: historyFilters.value.start_date || '',
                        end_date: historyFilters.value.end_date || '',
                        status: historyFilters.value.status || ''
                    },
                    pagination: {
                        limit: historyPagination.value.limit,
                        page: historyPagination.value.page
                    }
                },
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }
        )

        historyList.value = response.data || []
        historyTotal.value = response.pagination?.total || 0
    } catch (error: any) {
        console.error('Error loading history data:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }

        showErrorToast('Gagal Memuat Data', 'Gagal memuat data history inklusi.')
    } finally {
        isLoadingHistory.value = false
    }
}

function resetHistoryFilters() {
    historyFilters.value = {
        nama_peserta_didik: '',
        nis: '',
        nisn: '',
        jenis_hambatan: '',
        start_date: '',
        end_date: '',
        status: ''
    }
    historyPagination.value.page = 1
    loadHistoryData()
}

function goToFirstHistoryPage() {
    historyPagination.value.page = 1
    loadHistoryData()
}

function previousHistoryPage() {
    if (historyPagination.value.page > 1) {
        historyPagination.value.page--
        loadHistoryData()
    }
}

function nextHistoryPage() {
    if (historyPagination.value.page < historyTotalPages.value) {
        historyPagination.value.page++
        loadHistoryData()
    }
}

function goToLastHistoryPage() {
    historyPagination.value.page = historyTotalPages.value
    loadHistoryData()
}

function handleHistoryLimitChange() {
    historyPagination.value.page = 1
    loadHistoryData()
}

function viewHistoryDetail(item: any) {
    selectedDataId.value = item.id
    showViewModal.value = true
}

function confirmDeleteHistory(item: any) {
    selectedDataId.value = item.id
    showDeleteModal.value = true
}

function getStatusKeaktifanLabel(status: string) {
    const labels: Record<string, string> = {
        'active': 'Aktif',
        'mutasi': 'Mutasi',
        'lulus': 'Lulus',
        'tidak_aktif': 'Tidak Aktif'
    }
    return labels[status] || '-'
}

// Tahun Pelajaran Functions
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
            rombelFilters.value.tahun_pelajaran_id = activeTp.id
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

// Rombel Functions
async function loadRombelData() {
    if (!rombelFilters.value.tahun_pelajaran_id) {
        showErrorToast('Peringatan', 'Silakan pilih tahun pelajaran terlebih dahulu.')
        return
    }

    isLoadingRombel.value = true
    try {
        const config = useRuntimeConfig()
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        const tahunPelajaranId = typeof rombelFilters.value.tahun_pelajaran_id === 'string' 
            ? parseInt(rombelFilters.value.tahun_pelajaran_id) 
            : rombelFilters.value.tahun_pelajaran_id

        const response = await $fetch<any>(
            `${config.public.apiBase}/api/v1/monitoring-inklusi/get-data-induk-inklusi-rombel`,
            {
                method: 'POST',
                body: {
                    tahun_pelajaran_id: tahunPelajaranId,
                    search: {
                        nama_peserta_didik: rombelFilters.value.nama_peserta_didik || '',
                        nisn: rombelFilters.value.nisn || '',
                        jenis_hambatan: rombelFilters.value.jenis_hambatan || '',
                        status: rombelFilters.value.status || ''
                    },
                    pagination: {
                        limit: rombelPagination.value.limit,
                        page: rombelPagination.value.page
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
        rombelTotal.value = response.pagination?.total || 0
    } catch (error: any) {
        console.error('Error loading rombel data:', error)

        if (error.status === 401 || error.statusCode === 401 ||
            (error.data && error.data.error && error.data.error.includes('token'))) {
            await handle401()
            return
        }

        showErrorToast('Gagal Memuat Data', 'Gagal memuat data inklusi per rombel.')
    } finally {
        isLoadingRombel.value = false
    }
}

function resetRombelFilters() {
    const activeTp = tahunPelajaranList.value.find((tp: any) => tp.status === 'active')
    rombelFilters.value = {
        tahun_pelajaran_id: activeTp ? activeTp.id : '',
        nama_peserta_didik: '',
        nisn: '',
        jenis_hambatan: '',
        status: ''
    }
    rombelPagination.value.page = 1
    loadRombelData()
}

function goToFirstRombelPage() {
    rombelPagination.value.page = 1
    loadRombelData()
}

function previousRombelPage() {
    if (rombelPagination.value.page > 1) {
        rombelPagination.value.page--
        loadRombelData()
    }
}

function nextRombelPage() {
    if (rombelPagination.value.page < rombelTotalPages.value) {
        rombelPagination.value.page++
        loadRombelData()
    }
}

function goToLastRombelPage() {
    rombelPagination.value.page = rombelTotalPages.value
    loadRombelData()
}

function handleRombelLimitChange() {
    rombelPagination.value.page = 1
    loadRombelData()
}

function handleSyncSuccess() {
    loadRombelData()
}

function viewRombelDetail(item: any) {
    selectedRombelDataId.value = item.id
    showViewRombelModal.value = true
}

function editRombelData(item: any) {
    selectedRombelDataId.value = item.id
    showEditRombelModal.value = true
}

function confirmDeleteRombel(item: any) {
    selectedRombelDataId.value = item.id
    showDeleteRombelModal.value = true
}

function handleEditRombelSuccess() {
    loadRombelData()
}

function handleDeleteRombelSuccess() {
    loadRombelData()
}

</script>
