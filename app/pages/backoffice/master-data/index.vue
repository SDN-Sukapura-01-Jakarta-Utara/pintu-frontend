<template>
    <DashboardLayout>
        <!-- Create User Modal -->
        <CreateUserModal v-model="showCreateUserModal" @success="handleCreateUserSuccess"
            @error="handleCreateUserError" />

        <!-- User Detail Modal -->
        <UserDetailModal v-model="showDetailUserModal" :user-id="selectedUserId ?? 0" />

        <!-- Edit User Modal -->
        <EditUserModal v-model="showEditUserModal" :user-data="selectedUser" @success="handleEditUserSuccess"
            @error="handleEditUserError" />

        <!-- Delete Confirmation Modal -->
        <ConfirmationDeleteModal v-model="showDeleteConfirm" title="Hapus User"
            :message="`Apakah Anda yakin ingin menghapus user ${selectedUser?.nama}? Tindakan ini tidak dapat dibatalkan.`"
            :is-loading="isDeleting" @confirm="handleDeleteConfirm" />

        <!-- Create Role Modal -->
        <CreateRoleModal v-model="showCreateRoleModal" @success="handleCreateRoleSuccess"
            @error="handleCreateRoleError" />

        <!-- Role Detail Modal -->
        <RoleDetailModal v-model="showDetailRoleModal" :role-id="selectedRoleId ?? 0" />

        <!-- Edit Role Modal -->
        <EditRoleModal v-model="showEditRoleModal" :role-data="selectedRole" @success="handleEditRoleSuccess"
            @error="handleEditRoleError" />

        <!-- Delete Role Confirmation Modal -->
        <ConfirmationDeleteModal v-model="showDeleteRoleConfirm" title="Hapus Role"
            :message="`Apakah Anda yakin ingin menghapus role ${selectedRole?.name}? Tindakan ini tidak dapat dibatalkan.`"
            :is-loading="isDeletingRole" @confirm="handleDeleteRoleConfirm" />

        <!-- Create System Modal -->
        <CreateSystemModal v-model="showCreateSystemModal" @success="handleCreateSystemSuccess"
            @error="handleCreateSystemError" />

        <!-- System Detail Modal -->
        <SystemDetailModal v-model="showDetailSystemModal" :system-id="selectedSystemId ?? 0" />

        <!-- Edit System Modal -->
        <EditSystemModal v-model="showEditSystemModal" :system-data="selectedSystem" @success="handleEditSystemSuccess"
            @error="handleEditSystemError" />

        <!-- Delete System Confirmation Modal -->
        <ConfirmationDeleteModal v-model="showDeleteSystemConfirm" title="Hapus Sistem"
            :message="`Apakah Anda yakin ingin menghapus sistem ${selectedSystem?.nama}? Tindakan ini tidak dapat dibatalkan.`"
            :is-loading="isDeletingSystem" @confirm="handleDeleteSystemConfirm" />

        <!-- Create Permission Modal -->
        <CreatePermissionModal v-model="showCreatePermissionModal" @success="handleCreatePermissionSuccess"
            @error="handleCreatePermissionError" />

        <!-- Permission Detail Modal -->
        <PermissionDetailModal v-model="showDetailPermissionModal" :permission-id="selectedPermissionId ?? 0" />

        <!-- Edit Permission Modal -->
        <EditPermissionModal v-model="showEditPermissionModal" :permission-data="selectedPermission"
            @success="handleEditPermissionSuccess" @error="handleEditPermissionError" />

        <!-- Delete Permission Confirmation Modal -->
        <ConfirmationDeleteModal v-model="showDeletePermissionConfirm" title="Hapus Permission"
            :message="`Apakah Anda yakin ingin menghapus permission ${selectedPermission?.name}? Tindakan ini tidak dapat dibatalkan.`"
            :is-loading="isDeletingPermission" @confirm="handleDeletePermissionConfirm" />

        <!-- Create Tahun Pelajaran Modal -->
        <CreateTahunPelajaranModal v-model="showCreateTahunPelajaranModal" @success="handleCreateTahunPelajaranSuccess"
            @error="handleCreateTahunPelajaranError" />

        <!-- Edit Tahun Pelajaran Modal -->
        <EditTahunPelajaranModal v-model="showEditTahunPelajaranModal" :tahun-pelajaran-data="selectedTahunPelajaran"
            @success="handleEditTahunPelajaranSuccess" @error="handleEditTahunPelajaranError" />

        <!-- Delete Tahun Pelajaran Confirmation Modal -->
        <ConfirmationDeleteModal v-model="showDeleteTahunPelajaranConfirm" title="Hapus Tahun Pelajaran"
            :message="`Apakah Anda yakin ingin menghapus tahun pelajaran ${selectedTahunPelajaran?.tahun_pelajaran}? Tindakan ini tidak dapat dibatalkan.`"
            :is-loading="isDeletingTahunPelajaran" @confirm="handleDeleteTahunPelajaranConfirm" />

        <!-- Create Kelas Modal -->
        <CreateKelasModal v-model="showCreateKelasModal" @success="handleCreateKelasSuccess"
            @error="handleCreateKelasError" />

        <!-- Edit Kelas Modal -->
        <EditKelasModal v-model="showEditKelasModal" :kelas-data="selectedKelas" @success="handleEditKelasSuccess"
            @error="handleEditKelasError" />

        <!-- Delete Kelas Confirmation Modal -->
        <ConfirmationDeleteModal v-model="showDeleteKelasConfirm" title="Hapus Kelas"
            :message="`Apakah Anda yakin ingin menghapus kelas ${selectedKelas?.name}? Tindakan ini tidak dapat dibatalkan.`"
            :is-loading="isDeletingKelas" @confirm="handleDeleteKelasConfirm" />

        <!-- Create Rombel Modal -->
        <CreateRombelModal v-model="showCreateRombelModal" @success="handleCreateRombelSuccess"
            @error="handleCreateRombelError" />

        <!-- Edit Rombel Modal -->
        <EditRombelModal v-model="showEditRombelModal" :rombel-data="selectedRombel" @success="handleEditRombelSuccess"
            @error="handleEditRombelError" />

        <!-- Delete Rombel Confirmation Modal -->
        <ConfirmationDeleteModal v-model="showDeleteRombelConfirm" title="Hapus Rombel"
            :message="`Apakah Anda yakin ingin menghapus rombel ${selectedRombel?.name}? Tindakan ini tidak dapat dibatalkan.`"
            :is-loading="isDeletingRombel" @confirm="handleDeleteRombelConfirm" />

        <!-- Header Section -->
        <div class="mb-6 sm:mb-8">
            <div class="flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
                <div>
                    <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                        Master Data
                    </h1>
                    <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
                        Kelola data master sistem PINTU SDN Sukapura 01
                    </p>
                </div>
                <AddButton v-if="activeTab === 'user'" label="Tambah User" iconClass="fa-solid fa-plus"
                    @click="openCreateUserModal" />
                <AddButton v-if="activeTab === 'system'" label="Tambah Sistem" iconClass="fa-solid fa-plus"
                    @click="openCreateSystemModal" />
                <AddButton v-if="activeTab === 'role'" label="Tambah Role" iconClass="fa-solid fa-plus"
                    @click="openCreateRoleModal" />
                <AddButton v-if="activeTab === 'permission'" label="Tambah Permission" iconClass="fa-solid fa-plus"
                    @click="openCreatePermissionModal" />
                <AddButton v-if="activeTab === 'tahun-pelajaran'" label="Tambah Tahun Pelajaran"
                    iconClass="fa-solid fa-plus" @click="openCreateTahunPelajaranModal" />
                <AddButton v-if="activeTab === 'kelas'" label="Tambah Kelas" iconClass="fa-solid fa-plus"
                    @click="openCreateKelasModal" />
                <AddButton v-if="activeTab === 'rombel'" label="Tambah Rombel" iconClass="fa-solid fa-plus"
                    @click="openCreateRombelModal" />
            </div>
        </div>

        <!-- Tabs Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <!-- Tab Navigation -->
            <div class="flex flex-nowrap border-b border-gray-200 overflow-x-auto overflow-y-hidden">
                <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                    'flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm md:text-[15px] font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer hover:bg-gray-50',
                    activeTab === tab.id
                        ? 'text-red-600 border-b-2 border-red-600'
                        : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
                ]">
                    <i :class="[tab.icon, 'mr-2 hidden sm:inline-block']"></i>
                    {{ tab.label }}
                </button>
            </div>

            <!-- Tab Content -->
            <div class="p-6 sm:p-8">
                <!-- User Tab -->
                <div v-if="activeTab === 'user'" class="animate-slide-up">
                    <!-- Loading State -->
                    <div v-if="userStore.isLoading" class="flex items-center justify-center py-8 sm:py-12">
                        <div class="flex flex-col items-center gap-3 sm:gap-4">
                            <div
                                class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600">
                            </div>
                            <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat data user...</p>
                        </div>
                    </div>

                    <!-- Error State - Only show if there's no filter applied (actual error, not empty results) -->
                    <div v-else-if="userStore.error && !hasActiveFilters"
                        class="rounded-xl border-2 border-red-200 bg-red-50 p-4 sm:p-6">
                        <div class="flex items-start gap-3 sm:gap-4">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 sm:h-6 sm:w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="flex-1">
                                <h3 class="text-base sm:text-lg font-semibold text-red-900">Gagal memuat data</h3>
                                <p class="mt-1 text-sm sm:text-base text-red-800">{{ userStore.error }}</p>
                                <button @click="fetchUserData"
                                    class="mt-3 sm:mt-4 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors">
                                    <i class="fa-solid fa-rotate-right w-3 h-3 sm:w-4 sm:h-4"></i>
                                    Coba Lagi
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Success State: Filter & Table Section -->
                    <template v-else>
                        <!-- Filter Section -->
                        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
                            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Filter Data User</h3>

                            <!-- Filter Form -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <!-- Nama Filter -->
                                <div>
                                    <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                        Nama
                                    </label>
                                    <input v-model="filters.nama" type="text" placeholder="Cari nama..."
                                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                                </div>

                                <!-- Username Filter -->
                                <div>
                                    <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                        Username
                                    </label>
                                    <input v-model="filters.username" type="text" placeholder="Cari username..."
                                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                                </div>

                                <!-- Role Filter -->
                                <div>
                                    <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                        Role
                                    </label>
                                    <select v-model.number="filters.role_id_selected"
                                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                                        <option :value="0">Semua Role</option>
                                        <option v-for="role in roles.filter(r => r.status === 'active')" :key="role.id"
                                            :value="role.id">
                                            {{ role.name }}
                                        </option>
                                    </select>
                                </div>

                                <!-- System Filter -->
                                <div>
                                    <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                        Sistem
                                    </label>
                                    <select v-model.number="filters.system_id"
                                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                                        <option :value="0">Semua Sistem</option>
                                        <option v-for="system in systems" :key="system.id" :value="system.id">
                                            {{ system.nama }}
                                        </option>
                                    </select>
                                </div>

                                <!-- Status Filter -->
                                <div>
                                    <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                        Status
                                    </label>
                                    <select v-model="filters.status"
                                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                                        <option value="">Semua Status</option>
                                        <option value="active">Aktif</option>
                                        <option value="inactive">Nonaktif</option>
                                    </select>
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

                        <!-- Table Section -->
                        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                            <!-- Data Table -->
                            <div v-if="userStore.users.length > 0">
                                <Table :items="userStore.users" :columns="userTableColumns"
                                    :current-page="pagination.page" :current-limit="pagination.limit"
                                    :total="userStore.total" :is-loading="userStore.isLoading" @edit="openEditUserModal"
                                    @delete="openDeleteConfirm" @pageChange="onPageChange" @limitChange="onLimitChange">
                                    <!-- Custom cell for Status column -->
                                    <template #cell-status="{ item }">
                                        <span :class="[
                                            'inline-flex items-center rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm md:text-[15px] font-semibold',
                                            item.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800',
                                        ]">
                                            <span :class="[
                                                'inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full mr-1 sm:mr-2',
                                                item.status === 'active' ? 'bg-green-600' : 'bg-red-600',
                                            ]"></span>
                                            {{ item.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                                        </span>
                                    </template>

                                    <!-- Custom actions slot -->
                                    <template #actions="{ item }">
                                        <div class="flex items-center justify-center gap-1.5 sm:gap-2">
                                            <!-- View Button -->
                                            <ViewButton title="Lihat Detail" label="Lihat"
                                                @click="openDetailUserModal(item)" />

                                            <!-- Edit Button (Disabled for user id 1) -->
                                            <EditButton :disabled="item.id === 1" title="Edit" label="Edit"
                                                @click="openEditUserModal(item)" />

                                            <!-- Delete Button (Disabled for user id 1) -->
                                            <DeleteButton :disabled="item.id === 1" title="Hapus" label="Hapus"
                                                @click="openDeleteConfirm(item)" />
                                        </div>
                                    </template>
                                </Table>
                            </div>

                            <!-- Empty State -->
                            <div v-else class="flex flex-col items-center justify-center py-10 sm:py-16 px-4 sm:px-6">
                                <div
                                    class="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 sm:mb-6">
                                    <i :class="[
                                        hasActiveFilters ? 'fa-solid fa-magnifying-glass' : 'fa-solid fa-users',
                                        'text-2xl sm:text-4xl text-gray-400'
                                    ]"></i>
                                </div>
                                <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                                    {{ hasActiveFilters ? 'Data tidak ditemukan' : 'Belum ada user' }}
                                </h3>
                                <p class="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6 max-w-sm">{{ hasActiveFilters ? 'Data tidak ditemukan dalam pencarian' : 'Mulai dengan menambahkan user baru ke sistem' }}</p>
                            </div>
                        </div>
                    </template>
                </div>

                <!-- System Tab -->
                <div v-if="activeTab === 'system'" class="animate-slide-up">
                    <!-- Loading State -->
                    <div v-if="systemLoading" class="flex items-center justify-center py-8 sm:py-12">
                        <div class="flex flex-col items-center gap-3 sm:gap-4">
                            <div
                                class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600">
                            </div>
                            <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat data sistem...</p>
                        </div>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="systemError" class="rounded-xl border-2 border-red-200 bg-red-50 p-4 sm:p-6">
                        <div class="flex items-start gap-3 sm:gap-4">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 sm:h-6 sm:w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="flex-1">
                                <h3 class="text-base sm:text-lg font-semibold text-red-900">Gagal memuat data</h3>
                                <p class="mt-1 text-sm sm:text-base text-red-800">{{ systemError }}</p>
                                <button @click="fetchSystemData"
                                    class="mt-3 sm:mt-4 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors">
                                    <i class="fa-solid fa-rotate-right w-3 h-3 sm:w-4 sm:h-4"></i>
                                    Coba Lagi
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Success State: Filter & Table Section -->
                    <template v-else>
                        <!-- Filter Section -->
                        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
                            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Filter Data Sistem</h3>

                            <!-- Filter Form -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <!-- Nama Filter -->
                                <div>
                                    <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                        Nama Sistem
                                    </label>
                                    <input v-model="systemFilters.nama" type="text" placeholder="Cari nama sistem..."
                                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                                </div>

                                <!-- Status Filter -->
                                <div>
                                    <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                        Status
                                    </label>
                                    <select v-model="systemFilters.status"
                                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                                        <option value="">Semua Status</option>
                                        <option value="active">Aktif</option>
                                        <option value="inactive">Nonaktif</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Filter Buttons -->
                            <div class="flex gap-3 mt-4">
                                <button @click="applySystemFilter"
                                    class="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors duration-200 cursor-pointer">
                                    <i class="fa-solid fa-magnifying-glass w-4 h-4"></i>
                                    Cari
                                </button>
                                <button @click="clearSystemFilter"
                                    class="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                                    <i class="fa-solid fa-rotate-left w-4 h-4"></i>
                                    Reset Filter
                                </button>
                            </div>
                        </div>

                        <!-- Table Section -->
                        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                            <!-- Data Table -->
                            <div v-if="systems.length > 0">
                                <Table :items="systems" :columns="systemTableColumns" :is-loading="systemLoading"
                                    :current-page="1" :current-limit="10" :total="systemTotal">
                                    <!-- Custom cell for Status column -->
                                    <template #cell-status="{ item }">
                                        <span :class="[
                                            'inline-flex items-center rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm md:text-[15px] font-semibold',
                                            item.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800',
                                        ]">
                                            <span :class="[
                                                'inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full mr-1 sm:mr-2',
                                                item.status === 'active' ? 'bg-green-600' : 'bg-red-600',
                                            ]"></span>
                                            {{ item.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                                        </span>
                                    </template>

                                    <!-- Custom actions slot (override default) -->
                                    <template #actions="{ item }">
                                        <div class="flex items-center justify-center gap-1.5 sm:gap-2">
                                            <!-- View Button -->
                                            <ViewButton title="Lihat Detail" label="Lihat"
                                                @click="openDetailSystemModal(item)" />

                                            <!-- Edit Button (Disabled for system id 1) -->
                                            <EditButton :disabled="item.id === 1" title="Edit" label="Edit"
                                                @click="openEditSystemModal(item)" />

                                            <!-- Delete Button (Disabled for system id 1) -->
                                            <DeleteButton :disabled="item.id === 1" title="Hapus" label="Hapus"
                                                @click="openDeleteSystemConfirm(item)" />
                                        </div>
                                    </template>
                                </Table>
                            </div>

                            <!-- Empty State -->
                            <div v-else class="flex flex-col items-center justify-center py-10 sm:py-16 px-4 sm:px-6">
                                <div
                                    class="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 sm:mb-6">
                                    <i class="fa-solid fa-server text-2xl sm:text-4xl text-gray-400"></i>
                                </div>
                                <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                                    Belum ada sistem
                                </h3>
                                <p class="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6 max-w-sm">
                                    Mulai dengan menambahkan sistem baru
                                </p>
                            </div>
                        </div>
                    </template>
                </div>

                <!-- Role Tab -->
                <div v-if="activeTab === 'role'" class="animate-slide-up">
                    <!-- Loading State -->
                    <div v-if="roleStore.isLoading" class="flex items-center justify-center py-8 sm:py-12">
                        <div class="flex flex-col items-center gap-3 sm:gap-4">
                            <div
                                class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600">
                            </div>
                            <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat data role...</p>
                        </div>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="roleStore.error && !hasActiveRoleFilters"
                        class="rounded-xl border-2 border-red-200 bg-red-50 p-4 sm:p-6">
                        <div class="flex items-start gap-3 sm:gap-4">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 sm:h-6 sm:w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="flex-1">
                                <h3 class="text-base sm:text-lg font-semibold text-red-900">Gagal memuat data</h3>
                                <p class="mt-1 text-sm sm:text-base text-red-800">{{ roleStore.error }}</p>
                                <button @click="fetchRoleData"
                                    class="mt-3 sm:mt-4 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors">
                                    <i class="fa-solid fa-rotate-right w-3 h-3 sm:w-4 sm:h-4"></i>
                                    Coba Lagi
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Success State: Filter & Table Section -->
                    <template v-else>
                        <!-- Filter Section -->
                        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
                            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Filter Data Role</h3>

                            <!-- Filter Form -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <!-- Nama Filter -->
                                <div>
                                    <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                        Nama Role
                                    </label>
                                    <input v-model="roleFilters.name" type="text" placeholder="Cari nama role..."
                                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                                </div>

                                <!-- System Filter -->
                                <div>
                                    <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                        Sistem
                                    </label>
                                    <select v-model.number="roleFilters.system_id"
                                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                                        <option :value="0">Semua Sistem</option>
                                        <option v-for="system in systems" :key="system.id" :value="system.id">
                                            {{ system.nama }}
                                        </option>
                                    </select>
                                </div>

                                <!-- Status Filter -->
                                <div>
                                    <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                        Status
                                    </label>
                                    <select v-model="roleFilters.status"
                                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                                        <option value="">Semua Status</option>
                                        <option value="active">Aktif</option>
                                        <option value="inactive">Nonaktif</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Filter Buttons -->
                            <div class="flex gap-3 mt-4">
                                <button @click="applyRoleFilter"
                                    class="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors duration-200 cursor-pointer">
                                    <i class="fa-solid fa-magnifying-glass w-4 h-4"></i>
                                    Cari
                                </button>
                                <button @click="clearRoleFilter"
                                    class="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                                    <i class="fa-solid fa-rotate-left w-4 h-4"></i>
                                    Reset Filter
                                </button>
                            </div>
                        </div>

                        <!-- Table Section -->
                        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                            <!-- Data Table -->
                            <div v-if="roleStore.roles.length > 0">
                                <Table :items="roleStore.roles" :columns="roleTableColumns"
                                    :current-page="rolePagination.page" :current-limit="rolePagination.limit"
                                    :total="roleStore.total" :is-loading="roleStore.isLoading" @edit="openEditRoleModal"
                                    @delete="openDeleteRoleConfirm" @pageChange="onRolePageChange"
                                    @limitChange="onRoleLimitChange">
                                    <!-- Custom cell for System column -->
                                    <template #cell-system_name="{ item }">
                                        {{ item.system?.nama || '-' }}
                                    </template>

                                    <!-- Custom cell for Status column -->
                                    <template #cell-status="{ item }">
                                        <span :class="[
                                            'inline-flex items-center rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm md:text-[15px] font-semibold',
                                            item.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800',
                                        ]">
                                            <span :class="[
                                                'inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full mr-1 sm:mr-2',
                                                item.status === 'active' ? 'bg-green-600' : 'bg-red-600',
                                            ]"></span>
                                            {{ item.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                                        </span>
                                    </template>

                                    <!-- Custom actions slot -->
                                    <template #actions="{ item }">
                                        <div class="flex items-center justify-center gap-1.5 sm:gap-2">
                                            <!-- View Button -->
                                            <ViewButton title="Lihat Detail" label="Lihat"
                                                @click="openDetailRoleModal(item)" />

                                            <!-- Edit Button (Disabled for role id 1) -->
                                            <EditButton :disabled="item.id === 1" title="Edit" label="Edit"
                                                @click="openEditRoleModal(item)" />

                                            <!-- Delete Button (Disabled for role id 1) -->
                                            <DeleteButton :disabled="item.id === 1" title="Hapus" label="Hapus"
                                                @click="openDeleteRoleConfirm(item)" />
                                        </div>
                                    </template>
                                </Table>
                            </div>

                            <!-- Empty State -->
                            <div v-else class="flex flex-col items-center justify-center py-10 sm:py-16 px-4 sm:px-6">
                                <div
                                    class="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 sm:mb-6">
                                    <i :class="[
                                        hasActiveRoleFilters ? 'fa-solid fa-magnifying-glass' : 'fa-solid fa-shield',
                                        'text-2xl sm:text-4xl text-gray-400'
                                    ]"></i>
                                </div>
                                <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                                    {{ hasActiveRoleFilters ? 'Data tidak ditemukan' : 'Belum ada role' }}
                                </h3>
                                <p class="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6 max-w-sm">{{ hasActiveRoleFilters ? 'Data tidak ditemukan dalam pencarian' : 'Mulai dengan menambahkan role baru ke sistem' }}</p>
                            </div>
                        </div>
                    </template>
                </div>

                <!-- Permission Tab -->
                <div v-if="activeTab === 'permission'" class="animate-slide-up">
                    <!-- Loading State -->
                    <div v-if="permissionStore.isLoading" class="flex items-center justify-center py-8 sm:py-12">
                        <div class="flex flex-col items-center gap-3 sm:gap-4">
                            <div
                                class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600">
                            </div>
                            <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat data permission...</p>
                        </div>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="permissionStore.error"
                        class="rounded-xl border-2 border-red-200 bg-red-50 p-4 sm:p-6">
                        <div class="flex items-start gap-3 sm:gap-4">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 sm:h-6 sm:w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="flex-1">
                                <h3 class="text-base sm:text-lg font-semibold text-red-900">Gagal memuat data</h3>
                                <p class="mt-1 text-sm sm:text-base text-red-800">{{ permissionStore.error }}</p>
                                <button @click="fetchPermissionData"
                                    class="mt-3 sm:mt-4 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors">
                                    <i class="fa-solid fa-rotate-right w-3 h-3 sm:w-4 sm:h-4"></i>
                                    Coba Lagi
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Success State: Filter & Table Section -->
                    <template v-else>
                        <!-- Filter Section -->
                        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
                            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Filter Data Permission
                            </h3>

                            <!-- Filter Form -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <!-- Nama Hak Akses Filter -->
                                <div>
                                    <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                        Nama Hak Akses
                                    </label>
                                    <input v-model="permissionFilters.name" type="text"
                                        placeholder="Cari nama hak akses..."
                                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                                </div>

                                <!-- Nama Grup Filter -->
                                <div>
                                    <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                        Nama Grup Akses
                                    </label>
                                    <input v-model="permissionFilters.group_name" type="text"
                                        placeholder="Cari nama grup..."
                                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                                </div>

                                <!-- Sistem Filter -->
                                <div>
                                    <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                        Sistem
                                    </label>
                                    <select v-model.number="permissionFilters.system_id"
                                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                                        <option :value="0">Semua Sistem</option>
                                        <option v-for="system in systems" :key="system.id" :value="system.id">
                                            {{ system.nama }}
                                        </option>
                                    </select>
                                </div>

                                <!-- Status Filter -->
                                <div>
                                    <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                        Status
                                    </label>
                                    <select v-model="permissionFilters.status"
                                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                                        <option value="">Semua Status</option>
                                        <option value="active">Aktif</option>
                                        <option value="inactive">Nonaktif</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Filter Buttons -->
                            <div class="flex gap-3 mt-4">
                                <button @click="applyPermissionFilter"
                                    class="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors duration-200 cursor-pointer">
                                    <i class="fa-solid fa-magnifying-glass w-4 h-4"></i>
                                    Cari
                                </button>
                                <button @click="clearPermissionFilter"
                                    class="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                                    <i class="fa-solid fa-rotate-left w-4 h-4"></i>
                                    Reset Filter
                                </button>
                            </div>
                        </div>

                        <!-- Table Section -->
                        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                            <!-- Data Table -->
                            <div v-if="permissionStore.permissions.length > 0">
                                <Table :items="permissionStore.permissions" :columns="permissionTableColumns"
                                    :current-page="permissionPagination.page"
                                    :current-limit="permissionPagination.limit" :total="permissionStore.total"
                                    :is-loading="permissionStore.isLoading" @edit="openEditPermissionModal"
                                    @delete="openDeletePermissionConfirm" @pageChange="onPermissionPageChange"
                                    @limitChange="onPermissionLimitChange">
                                    <!-- Custom cell for System Name column -->
                                    <template #cell-system_name="{ item }">
                                        {{ item.system?.nama || '-' }}
                                    </template>

                                    <!-- Custom cell for Status column -->
                                    <template #cell-status="{ item }">
                                        <span :class="[
                                            'inline-flex items-center rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm md:text-[15px] font-semibold',
                                            item.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800',
                                        ]">
                                            <span :class="[
                                                'inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full mr-1 sm:mr-2',
                                                item.status === 'active' ? 'bg-green-600' : 'bg-red-600',
                                            ]"></span>
                                            {{ item.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                                        </span>
                                    </template>

                                    <!-- Custom actions slot -->
                                    <template #actions="{ item }">
                                        <div class="flex items-center justify-center gap-1.5 sm:gap-2">
                                            <!-- View Button -->
                                            <ViewButton title="Lihat Detail" label="Lihat"
                                                @click="openDetailPermissionModal(item)" />

                                            <!-- Edit Button -->
                                            <EditButton title="Edit" label="Edit"
                                                @click="openEditPermissionModal(item)" />

                                            <!-- Delete Button -->
                                            <DeleteButton title="Hapus" label="Hapus"
                                                @click="openDeletePermissionConfirm(item)" />
                                        </div>
                                    </template>
                                </Table>
                            </div>

                            <!-- Empty State -->
                            <div v-else class="flex flex-col items-center justify-center py-10 sm:py-16 px-4 sm:px-6">
                                <div
                                    class="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 sm:mb-6">
                                    <i :class="[
                                        hasActivePermissionFilters ? 'fa-solid fa-magnifying-glass' : 'fa-solid fa-lock',
                                        'text-2xl sm:text-4xl text-gray-400'
                                    ]"></i>
                                </div>
                                <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                                    {{ hasActivePermissionFilters ? 'Data tidak ditemukan' : 'Belum ada permission' }}
                                </h3>
                                <p class="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6 max-w-sm">{{ hasActivePermissionFilters ? 'Data tidak ditemukan dalam pencarian' : 'Mulai dengan menambahkan permission baru ke sistem' }}</p>
                            </div>
                        </div>
                    </template>
                </div>

                <!-- Tahun Pelajaran Tab -->
                <div v-if="activeTab === 'tahun-pelajaran'" class="animate-slide-up">
                    <!-- Loading State -->
                    <div v-if="tahunPelajaranStore.isLoading" class="flex items-center justify-center py-8 sm:py-12">
                        <div class="flex flex-col items-center gap-3 sm:gap-4">
                            <div
                                class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600">
                            </div>
                            <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat data tahun pelajaran...</p>
                        </div>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="tahunPelajaranStore.error && !hasActiveTahunPelajaranFilters"
                        class="rounded-xl border-2 border-red-200 bg-red-50 p-4 sm:p-6">
                        <div class="flex items-start gap-3 sm:gap-4">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 sm:h-6 sm:w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="flex-1">
                                <h3 class="text-base sm:text-lg font-semibold text-red-900">Gagal memuat data</h3>
                                <p class="mt-1 text-sm sm:text-base text-red-800">{{ tahunPelajaranStore.error }}</p>
                                <button @click="fetchTahunPelajaranData"
                                    class="mt-3 sm:mt-4 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors">
                                    <i class="fa-solid fa-rotate-right w-3 h-3 sm:w-4 sm:h-4"></i>
                                    Coba Lagi
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Success State: Filter & Table Section -->
                    <template v-else>
                        <!-- Filter Section -->
                        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
                            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Filter Data Tahun
                                Pelajaran</h3>

                            <!-- Filter Form -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <!-- Tahun Pelajaran Filter -->
                                <div>
                                    <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                        Tahun Pelajaran
                                    </label>
                                    <input v-model="tahunPelajaranFilters.tahun_pelajaran" type="text"
                                        placeholder="Cari tahun pelajaran..."
                                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                                </div>

                                <!-- Status Filter -->
                                <div>
                                    <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                        Status
                                    </label>
                                    <select v-model="tahunPelajaranFilters.status"
                                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                                        <option value="">Semua Status</option>
                                        <option value="active">Aktif</option>
                                        <option value="inactive">Nonaktif</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Filter Buttons -->
                            <div class="flex gap-3 mt-4">
                                <button @click="applyTahunPelajaranFilter"
                                    class="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors duration-200 cursor-pointer">
                                    <i class="fa-solid fa-magnifying-glass w-4 h-4"></i>
                                    Cari
                                </button>
                                <button @click="clearTahunPelajaranFilter"
                                    class="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                                    <i class="fa-solid fa-rotate-left w-4 h-4"></i>
                                    Reset Filter
                                </button>
                            </div>
                        </div>

                        <!-- Table Section -->
                        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                            <!-- Data Table -->
                            <div v-if="tahunPelajaranStore.tahunPelajarans.length > 0">
                                <Table :items="tahunPelajaranStore.tahunPelajarans"
                                    :columns="tahunPelajaranTableColumns" :current-page="tahunPelajaranPagination.page"
                                    :current-limit="tahunPelajaranPagination.limit" :total="tahunPelajaranStore.total"
                                    :is-loading="tahunPelajaranStore.isLoading" @edit="openEditTahunPelajaranModal"
                                    @delete="openDeleteTahunPelajaranConfirm" @pageChange="onTahunPelajaranPageChange"
                                    @limitChange="onTahunPelajaranLimitChange">
                                    <!-- Custom cell for Status column -->
                                    <template #cell-status="{ item }">
                                        <span :class="[
                                            'inline-flex items-center rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm md:text-[15px] font-semibold',
                                            item.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800',
                                        ]">
                                            <span :class="[
                                                'inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full mr-1 sm:mr-2',
                                                item.status === 'active' ? 'bg-green-600' : 'bg-red-600',
                                            ]"></span>
                                            {{ item.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                                        </span>
                                    </template>

                                    <!-- Custom actions slot -->
                                    <template #actions="{ item }">
                                        <div class="flex items-center justify-center gap-1.5 sm:gap-2">
                                            <!-- Edit Button -->
                                            <EditButton title="Edit" label="Edit"
                                                @click="openEditTahunPelajaranModal(item)" />

                                            <!-- Delete Button -->
                                            <DeleteButton title="Hapus" label="Hapus"
                                                @click="openDeleteTahunPelajaranConfirm(item)" />
                                        </div>
                                    </template>
                                </Table>
                            </div>

                            <!-- Empty State -->
                            <div v-else class="flex flex-col items-center justify-center py-10 sm:py-16 px-4 sm:px-6">
                                <div
                                    class="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 sm:mb-6">
                                    <i :class="[
                                        hasActiveTahunPelajaranFilters ? 'fa-solid fa-magnifying-glass' : 'fa-solid fa-calendar',
                                        'text-2xl sm:text-4xl text-gray-400'
                                    ]"></i>
                                </div>
                                <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                                    {{ hasActiveTahunPelajaranFilters ? 'Data tidak ditemukan' : 'Belum ada tahun pelajaran' }}
                                </h3>
                                <p class="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6 max-w-sm">{{ hasActiveTahunPelajaranFilters ? 'Data tidak ditemukan dalam pencarian' : 'Mulai dengan menambahkan tahun pelajaran baru ke sistem' }}</p>
                            </div>
                        </div>
                    </template>
                </div>

                <!-- Kelas Tab -->
                <div v-if="activeTab === 'kelas'" class="animate-slide-up">
                    <!-- Loading State -->
                    <div v-if="kelasStore.isLoading" class="flex items-center justify-center py-8 sm:py-12">
                        <div class="flex flex-col items-center gap-3 sm:gap-4">
                            <div
                                class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600">
                            </div>
                            <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat data kelas...</p>
                        </div>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="kelasStore.error && !hasActiveKelasFilters"
                        class="rounded-xl border-2 border-red-200 bg-red-50 p-4 sm:p-6">
                        <div class="flex items-start gap-3 sm:gap-4">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 sm:h-6 sm:w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="flex-1">
                                <h3 class="text-base sm:text-lg font-semibold text-red-900">Gagal memuat data</h3>
                                <p class="mt-1 text-sm sm:text-base text-red-800">{{ kelasStore.error }}</p>
                                <button @click="fetchKelasData"
                                    class="mt-3 sm:mt-4 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors">
                                    <i class="fa-solid fa-rotate-right w-3 h-3 sm:w-4 sm:h-4"></i>
                                    Coba Lagi
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Success State: Filter & Table Section -->
                    <template v-else>
                        <!-- Filter Section -->
                        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
                            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Filter Data Kelas</h3>

                            <!-- Filter Form -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <!-- Nama Kelas Filter -->
                                <div>
                                    <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                        Nama Kelas
                                    </label>
                                    <input v-model="kelasFilters.name" type="text" placeholder="Cari nama kelas..."
                                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                                </div>

                                <!-- Status Filter -->
                                <div>
                                    <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                        Status
                                    </label>
                                    <select v-model="kelasFilters.status"
                                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                                        <option value="">Semua Status</option>
                                        <option value="active">Aktif</option>
                                        <option value="inactive">Nonaktif</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Filter Buttons -->
                            <div class="flex gap-3 mt-4">
                                <button @click="applyKelasFilter"
                                    class="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors duration-200 cursor-pointer">
                                    <i class="fa-solid fa-magnifying-glass w-4 h-4"></i>
                                    Cari
                                </button>
                                <button @click="clearKelasFilter"
                                    class="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                                    <i class="fa-solid fa-rotate-left w-4 h-4"></i>
                                    Reset Filter
                                </button>
                            </div>
                        </div>

                        <!-- Table Section -->
                        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                            <!-- Data Table -->
                            <div v-if="kelasStore.kelases.length > 0">
                                <Table :items="kelasStore.kelases" :columns="kelasTableColumns"
                                    :current-page="kelasPagination.page" :current-limit="kelasPagination.limit"
                                    :total="kelasStore.total" :is-loading="kelasStore.isLoading"
                                    @edit="openEditKelasModal" @delete="openDeleteKelasConfirm"
                                    @pageChange="onKelasPageChange" @limitChange="onKelasLimitChange">
                                    <!-- Custom cell for Status column -->
                                    <template #cell-status="{ item }">
                                        <span :class="[
                                            'inline-flex items-center rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm md:text-[15px] font-semibold',
                                            item.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800',
                                        ]">
                                            <span :class="[
                                                'inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full mr-1 sm:mr-2',
                                                item.status === 'active' ? 'bg-green-600' : 'bg-red-600',
                                            ]"></span>
                                            {{ item.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                                        </span>
                                    </template>

                                    <!-- Custom actions slot -->
                                    <template #actions="{ item }">
                                        <div class="flex items-center justify-center gap-1.5 sm:gap-2">
                                            <!-- Edit Button -->
                                            <EditButton title="Edit" label="Edit" @click="openEditKelasModal(item)" />

                                            <!-- Delete Button -->
                                            <DeleteButton title="Hapus" label="Hapus"
                                                @click="openDeleteKelasConfirm(item)" />
                                        </div>
                                    </template>
                                </Table>
                            </div>

                            <!-- Empty State -->
                            <div v-else class="flex flex-col items-center justify-center py-10 sm:py-16 px-4 sm:px-6">
                                <div
                                    class="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 sm:mb-6">
                                    <i :class="[
                                        hasActiveKelasFilters ? 'fa-solid fa-magnifying-glass' : 'fa-solid fa-door-open',
                                        'text-2xl sm:text-4xl text-gray-400'
                                    ]"></i>
                                </div>
                                <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                                    {{ hasActiveKelasFilters ? 'Data tidak ditemukan' : 'Belum ada kelas' }}
                                </h3>
                                <p class="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6 max-w-sm">{{ hasActiveKelasFilters ? 'Data tidak ditemukan dalam pencarian' : 'Mulai dengan menambahkan kelas baru ke sistem' }}</p>
                            </div>
                        </div>
                    </template>
                </div>

                <!-- Rombel Tab -->
                <div v-if="activeTab === 'rombel'" class="animate-slide-up">
                    <!-- Loading State -->
                    <div v-if="rombelStore.isLoading" class="flex items-center justify-center py-8 sm:py-12">
                        <div class="flex flex-col items-center gap-3 sm:gap-4">
                            <div
                                class="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600">
                            </div>
                            <p class="text-sm sm:text-base text-gray-600 font-medium">Memuat data rombel...</p>
                        </div>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="rombelStore.error && !hasActiveRombelFilters"
                        class="rounded-xl border-2 border-red-200 bg-red-50 p-4 sm:p-6">
                        <div class="flex items-start gap-3 sm:gap-4">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 sm:h-6 sm:w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="flex-1">
                                <h3 class="text-base sm:text-lg font-semibold text-red-900">Gagal memuat data</h3>
                                <p class="mt-1 text-sm sm:text-base text-red-800">{{ rombelStore.error }}</p>
                                <button @click="fetchRombelData"
                                    class="mt-3 sm:mt-4 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors">
                                    <i class="fa-solid fa-rotate-right w-3 h-3 sm:w-4 sm:h-4"></i>
                                    Coba Lagi
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Success State: Filter & Table Section -->
                    <template v-else>
                        <!-- Filter Section -->
                        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
                            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Filter Data Rombel</h3>

                            <!-- Filter Form -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <!-- Nama Rombel Filter -->
                                <div>
                                    <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                        Nama Rombel
                                    </label>
                                    <input v-model="rombelFilters.name" type="text" placeholder="Cari nama rombel..."
                                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100" />
                                </div>

                                <!-- Kelas Filter -->
                                <div>
                                    <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                        Kelas
                                    </label>
                                    <select v-model.number="rombelFilters.kelas_id"
                                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                                        <option :value="0">Semua Kelas</option>
                                        <option v-for="kelas in kelasStore.kelases" :key="kelas.id" :value="kelas.id">
                                            {{ kelas.name }}
                                        </option>
                                    </select>
                                </div>

                                <!-- Status Filter -->
                                <div>
                                    <label class="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                                        Status
                                    </label>
                                    <select v-model="rombelFilters.status"
                                        class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                                        <option value="">Semua Status</option>
                                        <option value="active">Aktif</option>
                                        <option value="inactive">Nonaktif</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Filter Buttons -->
                            <div class="flex gap-3 mt-4">
                                <button @click="applyRombelFilter"
                                    class="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors duration-200 cursor-pointer">
                                    <i class="fa-solid fa-magnifying-glass w-4 h-4"></i>
                                    Cari
                                </button>
                                <button @click="clearRombelFilter"
                                    class="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                                    <i class="fa-solid fa-rotate-left w-4 h-4"></i>
                                    Reset Filter
                                </button>
                            </div>
                        </div>

                        <!-- Table Section -->
                        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                            <!-- Data Table -->
                            <div v-if="rombelStore.rombels.length > 0">
                                <Table :items="rombelStore.rombels" :columns="rombelTableColumns"
                                    :current-page="rombelPagination.page" :current-limit="rombelPagination.limit"
                                    :total="rombelStore.total" :is-loading="rombelStore.isLoading"
                                    @edit="openEditRombelModal" @delete="openDeleteRombelConfirm"
                                    @pageChange="onRombelPageChange" @limitChange="onRombelLimitChange">
                                    <!-- Custom cell for Kelas Name column -->
                                    <template #cell-kelas_name="{ item }">
                                        <div class="flex items-center gap-2">
                                            <span>{{ item.kelas?.name || '-' }}</span>
                                            <span v-if="item.kelas?.status === 'inactive'" :class="[
                                                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
                                                'bg-red-100 text-red-800',
                                            ]">
                                                Nonaktif
                                            </span>
                                        </div>
                                    </template>

                                    <!-- Custom cell for Status column -->
                                    <template #cell-status="{ item }">
                                        <span :class="[
                                            'inline-flex items-center rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm md:text-[15px] font-semibold',
                                            item.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800',
                                        ]">
                                            <span :class="[
                                                'inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full mr-1 sm:mr-2',
                                                item.status === 'active' ? 'bg-green-600' : 'bg-red-600',
                                            ]"></span>
                                            {{ item.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                                        </span>
                                    </template>

                                    <!-- Custom actions slot -->
                                    <template #actions="{ item }">
                                        <div class="flex items-center justify-center gap-1.5 sm:gap-2">
                                            <!-- Edit Button -->
                                            <EditButton title="Edit" label="Edit"
                                                @click="openEditRombelModal(item)" />

                                            <!-- Delete Button -->
                                            <DeleteButton title="Hapus" label="Hapus"
                                                @click="openDeleteRombelConfirm(item)" />
                                        </div>
                                    </template>
                                </Table>
                            </div>

                            <!-- Empty State -->
                            <div v-else class="flex flex-col items-center justify-center py-10 sm:py-16 px-4 sm:px-6">
                                <div
                                    class="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 sm:mb-6">
                                    <i :class="[
                                        hasActiveRombelFilters ? 'fa-solid fa-magnifying-glass' : 'fa-solid fa-sitemap',
                                        'text-2xl sm:text-4xl text-gray-400'
                                    ]"></i>
                                </div>
                                <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                                    {{ hasActiveRombelFilters ? 'Data tidak ditemukan' : 'Belum ada rombel' }}
                                </h3>
                                <p class="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6 max-w-sm">{{ hasActiveRombelFilters ? 'Data tidak ditemukan dalam pencarian' : 'Mulai dengan menambahkan rombel baru ke sistem' }}</p>
                            </div>
                        </div>
                    </template>
                </div>

                <!-- Other Tabs -->
                <div v-for="tab in tabs.filter(t => t.id !== 'user' && t.id !== 'system' && t.id !== 'role' && t.id !== 'permission' && t.id !== 'tahun-pelajaran' && t.id !== 'kelas' && t.id !== 'rombel')"
                    :key="tab.id">
                    <div v-if="activeTab === tab.id" class="animate-slide-up">
                        <div class="flex flex-col items-center justify-center py-12">
                            <i :class="[tab.icon, 'text-5xl sm:text-6xl text-gray-300 mb-4 block']"></i>
                            <p class="text-gray-600 text-base sm:text-lg">
                                Ini adalah halaman tab <span class="font-semibold text-gray-900">{{ tab.label }}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import type { TableColumn } from '~/components/Table.vue'
import type { UserData } from '~/types/UserType'
import type { RoleData } from '~/types/RoleType'
import type { PermissionData } from '~/types/PermissionType'
import type { KelasData } from '~/types/KelasType'
import { useUserStore } from '~/stores/UserStore'
import { useRoleStore } from '~/stores/RoleStore'
import { usePermissionStore } from '~/stores/PermissionStore'
import { useKelasStore } from '~/stores/KelasStore'
import { useAuthGuard } from '~/composables/useAuthGuard'
import { useToast } from '~/composables/useToast'
import AddButton from '~/components/common/AddButton.vue'
import ViewButton from '~/components/common/ViewButton.vue'
import EditButton from '~/components/common/EditButton.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'
import CreateUserModal from '~/components/modals/CreateUserModal.vue'
import UserDetailModal from '~/components/modals/UserDetailModal.vue'
import EditUserModal from '~/components/modals/EditUserModal.vue'
import CreateRoleModal from '~/components/modals/CreateRoleModal.vue'
import RoleDetailModal from '~/components/modals/RoleDetailModal.vue'
import EditRoleModal from '~/components/modals/EditRoleModal.vue'
import CreateSystemModal from '~/components/modals/CreateSystemModal.vue'
import SystemDetailModal from '~/components/modals/SystemDetailModal.vue'
import EditSystemModal from '~/components/modals/EditSystemModal.vue'
import CreatePermissionModal from '~/components/modals/CreatePermissionModal.vue'
import PermissionDetailModal from '~/components/modals/PermissionDetailModal.vue'
import EditPermissionModal from '~/components/modals/EditPermissionModal.vue'
import CreateTahunPelajaranModal from '~/components/modals/CreateTahunPelajaranModal.vue'
import EditTahunPelajaranModal from '~/components/modals/EditTahunPelajaranModal.vue'
import CreateKelasModal from '~/components/modals/CreateKelasModal.vue'
import EditKelasModal from '~/components/modals/EditKelasModal.vue'
import CreateRombelModal from '~/components/modals/CreateRombelModal.vue'
import EditRombelModal from '~/components/modals/EditRombelModal.vue'
import ConfirmationDeleteModal from '~/components/modals/ConfirmationDeleteModal.vue'
import type { TahunPelajaranData } from '~/types/TahunPelajaranType'
import type { RombelData } from '~/types/RombelType'
import { useTahunPelajaranStore } from '~/stores/TahunPelajaranStore'
import { useRombelStore } from '~/stores/RombelStore'

definePageMeta({
    middleware: 'auth',
    layout: 'default'
})

const userStore = useUserStore()
const roleStore = useRoleStore()
const permissionStore = usePermissionStore()
const tahunPelajaranStore = useTahunPelajaranStore()
const kelasStore = useKelasStore()
const rombelStore = useRombelStore()
const { success, error } = useToast()

// User Modal state
const showCreateUserModal = ref(false)
const showDetailUserModal = ref(false)
const showEditUserModal = ref(false)
const showDeleteConfirm = ref(false)
const isDeleting = ref(false)
const selectedUser = ref<UserData | null>(null)
const selectedUserId = ref<number | null>(null)

// System Modal state
const showCreateSystemModal = ref(false)
const showDetailSystemModal = ref(false)
const showEditSystemModal = ref(false)
const showDeleteSystemConfirm = ref(false)
const isDeletingSystem = ref(false)
const selectedSystem = ref<any | null>(null)
const selectedSystemId = ref<number | null>(null)
const systemLoading = ref(false)
const systemError = ref<string | null>(null)
const systemTotal = ref(0)

// System Filter state
const systemFilters = ref({
    nama: '',
    status: ''
})

// Role Modal state
const showCreateRoleModal = ref(false)
const showDetailRoleModal = ref(false)
const showEditRoleModal = ref(false)
const showDeleteRoleConfirm = ref(false)
const isDeletingRole = ref(false)
const selectedRole = ref<RoleData | null>(null)
const selectedRoleId = ref<number | null>(null)

// User Pagination state
const pagination = ref({
    page: 1,
    limit: 10
})

// User Filter state
const filters = ref({
    nama: '',
    username: '',
    role_id_selected: 0, // For dropdown display
    system_id: 0,
    status: ''
})

// Role Pagination state
const rolePagination = ref({
    page: 1,
    limit: 10
})

// Role Filter state
const roleFilters = ref({
    name: '',
    system_id: 0,
    status: ''
})

// Permission Modal state
const showCreatePermissionModal = ref(false)
const showDetailPermissionModal = ref(false)
const showEditPermissionModal = ref(false)
const showDeletePermissionConfirm = ref(false)
const isDeletingPermission = ref(false)
const selectedPermission = ref<PermissionData | null>(null)
const selectedPermissionId = ref<number | null>(null)

// Permission Pagination state
const permissionPagination = ref({
    page: 1,
    limit: 10
})

// Permission Filter state
const permissionFilters = ref({
    name: '',
    group_name: '',
    system_id: 0,
    status: ''
})

// Tahun Pelajaran Modal state
const showCreateTahunPelajaranModal = ref(false)
const showEditTahunPelajaranModal = ref(false)
const showDeleteTahunPelajaranConfirm = ref(false)
const isDeletingTahunPelajaran = ref(false)
const selectedTahunPelajaran = ref<TahunPelajaranData | null>(null)

// Tahun Pelajaran Pagination state
const tahunPelajaranPagination = ref({
    page: 1,
    limit: 10
})

// Tahun Pelajaran Filter state
const tahunPelajaranFilters = ref({
    tahun_pelajaran: '',
    status: ''
})

// Kelas Modal state
const showCreateKelasModal = ref(false)
const showEditKelasModal = ref(false)
const showDeleteKelasConfirm = ref(false)
const isDeletingKelas = ref(false)
const selectedKelas = ref<KelasData | null>(null)

// Kelas Pagination state
const kelasPagination = ref({
    page: 1,
    limit: 10
})

// Kelas Filter state
const kelasFilters = ref({
    name: '',
    status: ''
})

// Rombel Modal state
const showCreateRombelModal = ref(false)
const showEditRombelModal = ref(false)
const showDeleteRombelConfirm = ref(false)
const isDeletingRombel = ref(false)
const selectedRombel = ref<RombelData | null>(null)

// Rombel Pagination state
const rombelPagination = ref({
    page: 1,
    limit: 10
})

// Rombel Filter state
const rombelFilters = ref({
    name: '',
    kelas_id: 0,
    status: ''
})

// Roles and Systems for filter dropdowns
const roles = ref<any[]>([])
const systems = ref<any[]>([])

interface Tab {
    id: string
    label: string
    icon: string
}

const activeTab = ref('user')

// Computed: Check if any filter is active
const hasActiveFilters = computed(() => {
    return (
        filters.value.nama !== '' ||
        filters.value.username !== '' ||
        filters.value.role_id_selected !== 0 ||
        filters.value.system_id !== 0 ||
        filters.value.status !== ''
    )
})

// Computed: Check if any role filter is active
const hasActiveRoleFilters = computed(() => {
    return (
        roleFilters.value.name !== '' ||
        roleFilters.value.system_id !== 0 ||
        roleFilters.value.status !== ''
    )
})

// Computed: Check if any permission filter is active
const hasActivePermissionFilters = computed(() => {
    return (
        permissionFilters.value.name !== '' ||
        permissionFilters.value.group_name !== '' ||
        permissionFilters.value.system_id !== 0 ||
        permissionFilters.value.status !== ''
    )
})

// Computed: Check if any rombel filter is active
const hasActiveRombelFilters = computed(() => {
    return (
        rombelFilters.value.name !== '' ||
        rombelFilters.value.kelas_id !== 0 ||
        rombelFilters.value.status !== ''
    )
})

const tabs: Tab[] = [
    {
        id: 'user',
        label: 'User',
        icon: 'fa-solid fa-users'
    },
    {
        id: 'system',
        label: 'Sistem',
        icon: 'fa-solid fa-server'
    },
    {
        id: 'role',
        label: 'Role',
        icon: 'fa-solid fa-shield'
    },
    {
        id: 'permission',
        label: 'Permission',
        icon: 'fa-solid fa-lock'
    },
    {
        id: 'tahun-pelajaran',
        label: 'Tahun Pelajaran',
        icon: 'fa-solid fa-calendar'
    },
    {
        id: 'kelas',
        label: 'Kelas',
        icon: 'fa-solid fa-door-open'
    },
    {
        id: 'rombel',
        label: 'Rombel',
        icon: 'fa-solid fa-sitemap'
    },
    {
        id: 'bidang-studi',
        label: 'Bidang Studi',
        icon: 'fa-solid fa-book'
    },
    {
        id: 'ekstrakurikuler',
        label: 'Ekstrakurikuler',
        icon: 'fa-solid fa-basketball'
    }
]

// Table columns configuration for user
const userTableColumns: TableColumn[] = [
    {
        key: 'nama',
        label: 'Nama',
    },
    {
        key: 'username',
        label: 'Username',
    },
    {
        key: 'role_names',
        label: 'Role',
    },
    {
        key: 'accessible_system_display',
        label: 'Sistem',
    },
    {
        key: 'status',
        label: 'Status',
    },
]

// Table columns configuration for role
const roleTableColumns: TableColumn[] = [
    {
        key: 'name',
        label: 'Nama Role',
    },
    {
        key: 'system_name',
        label: 'Sistem',
    },
    {
        key: 'status',
        label: 'Status',
    },
]

// Table columns configuration for system
const systemTableColumns: TableColumn[] = [
    {
        key: 'nama',
        label: 'Nama Sistem',
    },
    {
        key: 'description',
        label: 'Deskripsi',
    },
    {
        key: 'status',
        label: 'Status',
    },
]

// Table columns configuration for permission
const permissionTableColumns: TableColumn[] = [
    {
        key: 'name',
        label: 'Nama Hak Akses',
    },
    {
        key: 'group_name',
        label: 'Nama Grup Akses',
    },
    {
        key: 'system_name',
        label: 'Sistem',
    },
    {
        key: 'status',
        label: 'Status',
    },
]

// Table columns configuration for tahun pelajaran
const tahunPelajaranTableColumns: TableColumn[] = [
    {
        key: 'tahun_pelajaran',
        label: 'Tahun Pelajaran',
    },
    {
        key: 'status',
        label: 'Status',
    },
]

// Table columns configuration for kelas
const kelasTableColumns: TableColumn[] = [
    {
        key: 'name',
        label: 'Nama Kelas',
    },
    {
        key: 'status',
        label: 'Status',
    },
]

// Table columns configuration for rombel
const rombelTableColumns: TableColumn[] = [
    {
        key: 'name',
        label: 'Nama Rombel',
    },
    {
        key: 'kelas_name',
        label: 'Kelas',
    },
    {
        key: 'status',
        label: 'Status',
    },
]

// Fetch user data with pagination and filters
const fetchUserData = async () => {
    console.log('Fetching user data...', { pagination: pagination.value, filters: filters.value })

    // Build search object (only include non-empty values)
    const search: any = {}
    if (filters.value.nama) search.nama = filters.value.nama
    if (filters.value.username) search.username = filters.value.username
    if (filters.value.role_id_selected && filters.value.role_id_selected !== 0) {
        search.role_ids = [filters.value.role_id_selected]
    }
    if (filters.value.system_id && filters.value.system_id !== 0) search.system_id = filters.value.system_id
    if (filters.value.status) search.status = filters.value.status

    const result = await userStore.fetchUsers(pagination.value.page, pagination.value.limit, search)
    console.log('Fetch result:', result)
    console.log('Users in store:', userStore.users)

    if (!result.success && userStore.error) {
        const { handle401 } = useAuthGuard()
        if (result.message?.includes('401') || result.message?.includes('Unauthorized')) {
            await handle401()
        }
    }
}

// Handle page change
const onPageChange = (newPage: number) => {
    pagination.value.page = newPage
    fetchUserData()
}

// Handle limit change
const onLimitChange = (newLimit: number) => {
    pagination.value.limit = newLimit
    pagination.value.page = 1 // Reset to first page
    fetchUserData()
}

// Apply filter
const applyFilter = () => {
    pagination.value.page = 1 // Reset to first page when filtering
    fetchUserData()
}

// Clear filter
const clearFilter = () => {
    filters.value = {
        nama: '',
        username: '',
        role_id_selected: 0,
        system_id: 0,
        status: ''
    }
    pagination.value.page = 1
    fetchUserData()
}

// Fetch roles for filter dropdown
const fetchRoles = async () => {
    try {
        const { getRoleList } = await import('~/services/user')
        const response = await getRoleList()
        roles.value = response.data || []
    } catch (err: any) {
        console.error('Error fetching roles:', err)
    }
}

// Fetch systems for filter dropdown (only active systems)
const fetchSystems = async () => {
    try {
        const { getSystemList } = await import('~/services/user')
        const response = await getSystemList(1, 100, { status: 'active' })
        systems.value = response.data || []
    } catch (err: any) {
        console.error('Error fetching systems:', err)
    }
}

// Open create user modal
const openCreateUserModal = () => {
    showCreateUserModal.value = true
}

// Handle create user success
const handleCreateUserSuccess = (message: string) => {
    console.log('Create user success:', message)
    success('User Berhasil Ditambahkan', message)

    // Reset to page 1 after successful create
    pagination.value.page = 1
    fetchUserData()
}

// Handle create user error
const handleCreateUserError = (errorMessage: string) => {
    console.error('Create user error:', errorMessage)
    error('Gagal Menambahkan User', errorMessage)
}

// Open detail user modal
const openDetailUserModal = (item: UserData) => {
    console.log('Opening Detail User Modal for:', item)
    selectedUserId.value = item.id
    showDetailUserModal.value = true
}

// Open edit user modal
const openEditUserModal = (item: UserData) => {
    console.log('Opening Edit User Modal for:', item)
    console.log('Selected user accessible_system:', item.accessible_system)
    selectedUser.value = item
    showEditUserModal.value = true
}

// Handle edit user success
const handleEditUserSuccess = (message: string) => {
    console.log('Edit user success:', message)
    success('User Berhasil Diperbarui', message)

    // Reset to page 1 after successful edit
    pagination.value.page = 1
    fetchUserData()
}

// Handle edit user error
const handleEditUserError = (errorMessage: string) => {
    console.error('Edit user error:', errorMessage)
    error('Gagal Mengupdate User', errorMessage)
}

// Open delete confirmation
const openDeleteConfirm = (item: UserData) => {
    selectedUser.value = item
    showDeleteConfirm.value = true
}

// Handle delete confirmation
const handleDeleteConfirm = async () => {
    if (!selectedUser.value) return

    isDeleting.value = true
    try {
        const result = await userStore.removeUser(selectedUser.value.id)

        if (result.success) {
            success('User Berhasil Dihapus', result.message)
            showDeleteConfirm.value = false
            selectedUser.value = null

            // Calculate max page after deletion
            const totalAfterDelete = userStore.total
            const maxPage = Math.ceil(totalAfterDelete / pagination.value.limit)

            // If current page is beyond max page, go to previous page
            if (pagination.value.page > maxPage && maxPage > 0) {
                pagination.value.page = maxPage
            } else if (maxPage === 0) {
                pagination.value.page = 1
            }

            // Fetch data for the appropriate page
            await fetchUserData()
        } else {
            error('Gagal Menghapus User', result.message)
        }
    } catch (err: any) {
        error('Gagal Menghapus User', err.message || 'Terjadi kesalahan saat menghapus user')
        console.error('Delete user error:', err)
    } finally {
        isDeleting.value = false
    }
}

// Fetch role data with pagination and filters
const fetchRoleData = async () => {
    console.log('Fetching role data...', { pagination: rolePagination.value, filters: roleFilters.value })

    // Build search object (only include non-empty values)
    const search: any = {}
    if (roleFilters.value.name) search.name = roleFilters.value.name
    if (roleFilters.value.system_id && roleFilters.value.system_id !== 0) search.system_id = roleFilters.value.system_id
    if (roleFilters.value.status) search.status = roleFilters.value.status

    const result = await roleStore.fetchRoles(rolePagination.value.page, rolePagination.value.limit, search)
    console.log('Fetch role result:', result)

    if (!result.success && roleStore.error) {
        const { handle401 } = useAuthGuard()
        if (result.message?.includes('401') || result.message?.includes('Unauthorized')) {
            await handle401()
        }
    }
}

// Handle role page change
const onRolePageChange = (newPage: number) => {
    rolePagination.value.page = newPage
    fetchRoleData()
}

// Handle role limit change
const onRoleLimitChange = (newLimit: number) => {
    rolePagination.value.limit = newLimit
    rolePagination.value.page = 1 // Reset to first page
    fetchRoleData()
}

// Apply role filter
const applyRoleFilter = () => {
    rolePagination.value.page = 1 // Reset to first page when filtering
    fetchRoleData()
}

// Clear role filter
const clearRoleFilter = () => {
    roleFilters.value = {
        name: '',
        system_id: 0,
        status: ''
    }
    rolePagination.value.page = 1
    fetchRoleData()
}

// Fetch system data
const fetchSystemData = async () => {
    systemLoading.value = true
    systemError.value = null
    try {
        const { getSystemList } = await import('~/services/user')

        // Build search object (only include non-empty values)
        const search: any = {}
        if (systemFilters.value.nama) search.nama = systemFilters.value.nama
        if (systemFilters.value.status) search.status = systemFilters.value.status

        const response = await getSystemList(1, 10, search)
        systems.value = response.data || []
        systemTotal.value = response.pagination?.total || (response.data?.length || 0)
    } catch (err: any) {
        console.error('Error fetching systems:', err)
        systemError.value = err.data?.message || err.message || 'Gagal memuat data sistem'
    } finally {
        systemLoading.value = false
    }
}

// Open create role modal
const openCreateRoleModal = () => {
    showCreateRoleModal.value = true
}

// Open create system modal
const openCreateSystemModal = () => {
    showCreateSystemModal.value = true
}

// Handle create role success
const handleCreateRoleSuccess = (message: string) => {
    console.log('Create role success:', message)
    success('Role Berhasil Ditambahkan', message)

    // Reset to page 1 after successful create
    rolePagination.value.page = 1
    fetchRoleData()
}

// Handle create role error
const handleCreateRoleError = (errorMessage: string) => {
    console.error('Create role error:', errorMessage)
    error('Gagal Menambahkan Role', errorMessage)
}

// Open detail system modal
const openDetailSystemModal = (item: any) => {
    console.log('Opening Detail System Modal for:', item)
    selectedSystemId.value = item.id
    showDetailSystemModal.value = true
}

// Open edit system modal
const openEditSystemModal = (item: any) => {
    console.log('Opening Edit System Modal for:', item)
    selectedSystem.value = item
    showEditSystemModal.value = true
}

// Open delete system confirmation
const openDeleteSystemConfirm = (item: any) => {
    selectedSystem.value = item
    showDeleteSystemConfirm.value = true
}

// Handle delete system confirmation
const handleDeleteSystemConfirm = async () => {
    if (!selectedSystem.value) return

    isDeletingSystem.value = true
    try {
        const { deleteSystem } = await import('~/services/user')
        await deleteSystem(selectedSystem.value.id)

        success('Sistem Berhasil Dihapus', `Sistem ${selectedSystem.value.nama} berhasil dihapus`)
        selectedSystem.value = null
        showDeleteSystemConfirm.value = false
        await fetchSystemData()
    } catch (err: any) {
        const errorMessage = err.data?.message || err.message || 'Gagal menghapus sistem'
        error('Gagal Menghapus Sistem', errorMessage)
        console.error('Error deleting system:', err)
    } finally {
        isDeletingSystem.value = false
    }
}

// Handle create system success
const handleCreateSystemSuccess = (message: string) => {
    console.log('Create system success:', message)
    success('Sistem Berhasil Ditambahkan', message)

    // Reset to initial state
    systemFilters.value = { nama: '', status: '' }
    fetchSystemData()
}

// Handle create system error
const handleCreateSystemError = (errorMessage: string) => {
    console.error('Create system error:', errorMessage)
    error('Gagal Menambahkan Sistem', errorMessage)
}

// Handle edit system success
const handleEditSystemSuccess = (message: string) => {
    console.log('Edit system success:', message)
    success('Sistem Berhasil Diperbarui', message)

    // Reset to initial state
    systemFilters.value = { nama: '', status: '' }
    fetchSystemData()
}

// Handle edit system error
const handleEditSystemError = (errorMessage: string) => {
    console.error('Edit system error:', errorMessage)
    error('Gagal Mengupdate Sistem', errorMessage)
}

// Apply system filter
const applySystemFilter = () => {
    fetchSystemData()
}

// Clear system filter
const clearSystemFilter = () => {
    systemFilters.value = {
        nama: '',
        status: ''
    }
    fetchSystemData()
}

// Open detail role modal
const openDetailRoleModal = (item: RoleData) => {
    console.log('Opening Detail Role Modal for:', item)
    selectedRoleId.value = item.id
    showDetailRoleModal.value = true
}

// Open edit role modal
const openEditRoleModal = (item: RoleData) => {
    console.log('Opening Edit Role Modal for:', item)
    selectedRole.value = item
    showEditRoleModal.value = true
}

// Handle edit role success
const handleEditRoleSuccess = (message: string) => {
    console.log('Edit role success:', message)
    success('Role Berhasil Diperbarui', message)

    // Reset to page 1 after successful edit
    rolePagination.value.page = 1
    fetchRoleData()
}

// Handle edit role error
const handleEditRoleError = (errorMessage: string) => {
    console.error('Edit role error:', errorMessage)
    error('Gagal Mengupdate Role', errorMessage)
}

// Open delete role confirmation
const openDeleteRoleConfirm = (item: RoleData) => {
    selectedRole.value = item
    showDeleteRoleConfirm.value = true
}

// Handle delete role confirmation
const handleDeleteRoleConfirm = async () => {
    if (!selectedRole.value) return

    isDeletingRole.value = true
    try {
        const result = await roleStore.removeRole(selectedRole.value.id)

        if (result.success) {
            success('Role Berhasil Dihapus', result.message)
            showDeleteRoleConfirm.value = false
            selectedRole.value = null

            // Calculate max page after deletion
            const totalAfterDelete = roleStore.total
            const maxPage = Math.ceil(totalAfterDelete / rolePagination.value.limit)

            // If current page is beyond max page, go to previous page
            if (rolePagination.value.page > maxPage && maxPage > 0) {
                rolePagination.value.page = maxPage
            } else if (maxPage === 0) {
                rolePagination.value.page = 1
            }

            // Fetch data for the appropriate page
            await fetchRoleData()
        } else {
            error('Gagal Menghapus Role', result.message)
        }
    } catch (err: any) {
        error('Gagal Menghapus Role', err.message || 'Terjadi kesalahan saat menghapus role')
        console.error('Delete role error:', err)
    } finally {
        isDeletingRole.value = false
    }
}

// Fetch permission data with pagination and filters
const fetchPermissionData = async () => {
    console.log('Fetching permission data...', { pagination: permissionPagination.value, filters: permissionFilters.value })

    // Build search object (only include non-empty values)
    const search: any = {}
    if (permissionFilters.value.name) search.name = permissionFilters.value.name
    if (permissionFilters.value.group_name) search.group_name = permissionFilters.value.group_name
    if (permissionFilters.value.system_id && permissionFilters.value.system_id !== 0) search.system_id = permissionFilters.value.system_id
    if (permissionFilters.value.status) search.status = permissionFilters.value.status

    await permissionStore.fetchPermissions(permissionPagination.value.page, permissionPagination.value.limit, search)
}

// Handle permission page change
const onPermissionPageChange = (newPage: number) => {
    permissionPagination.value.page = newPage
    fetchPermissionData()
}

// Handle permission limit change
const onPermissionLimitChange = (newLimit: number) => {
    permissionPagination.value.limit = newLimit
    permissionPagination.value.page = 1 // Reset to first page
    fetchPermissionData()
}

// Apply permission filter
const applyPermissionFilter = () => {
    permissionPagination.value.page = 1 // Reset to first page when filtering
    fetchPermissionData()
}

// Clear permission filter
const clearPermissionFilter = () => {
    permissionFilters.value = {
        name: '',
        group_name: '',
        system_id: 0,
        status: ''
    }
    permissionPagination.value.page = 1
    fetchPermissionData()
}

// Open create permission modal
const openCreatePermissionModal = () => {
    showCreatePermissionModal.value = true
}

// Open detail permission modal
const openDetailPermissionModal = (item: PermissionData) => {
    console.log('Opening Detail Permission Modal for:', item)
    selectedPermissionId.value = item.id
    showDetailPermissionModal.value = true
}

// Open edit permission modal
const openEditPermissionModal = (item: PermissionData) => {
    console.log('Opening Edit Permission Modal for:', item)
    selectedPermission.value = item
    showEditPermissionModal.value = true
}

// Open delete permission confirmation
const openDeletePermissionConfirm = (item: PermissionData) => {
    selectedPermission.value = item
    showDeletePermissionConfirm.value = true
}

// Handle create permission success
const handleCreatePermissionSuccess = (message: string) => {
    console.log('Create permission success:', message)
    success('Permission Berhasil Ditambahkan', message)

    // Reset to page 1 after successful create
    permissionPagination.value.page = 1
    fetchPermissionData()
}

// Handle create permission error
const handleCreatePermissionError = (errorMessage: string) => {
    console.error('Create permission error:', errorMessage)
    error('Gagal Menambahkan Permission', errorMessage)
}

// Handle edit permission success
const handleEditPermissionSuccess = (message: string) => {
    console.log('Edit permission success:', message)
    success('Permission Berhasil Diperbarui', message)

    // Reset to page 1 after successful edit
    permissionPagination.value.page = 1
    fetchPermissionData()
}

// Handle edit permission error
const handleEditPermissionError = (errorMessage: string) => {
    console.error('Edit permission error:', errorMessage)
    error('Gagal Mengupdate Permission', errorMessage)
}

// Handle delete permission confirmation
const handleDeletePermissionConfirm = async () => {
    if (!selectedPermission.value) return

    isDeletingPermission.value = true
    try {
        const result = await permissionStore.removePermission(selectedPermission.value.id)

        if (result.success) {
            success('Permission Berhasil Dihapus', result.message)
            showDeletePermissionConfirm.value = false
            selectedPermission.value = null

            // Calculate max page after deletion
            const totalAfterDelete = permissionStore.total
            const maxPage = Math.ceil(totalAfterDelete / permissionPagination.value.limit)

            // If current page is beyond max page, go to previous page
            if (permissionPagination.value.page > maxPage && maxPage > 0) {
                permissionPagination.value.page = maxPage
            } else if (maxPage === 0) {
                permissionPagination.value.page = 1
            }

            // Fetch data for the appropriate page
            await fetchPermissionData()
        } else {
            error('Gagal Menghapus Permission', result.message)
        }
    } catch (err: any) {
        error('Gagal Menghapus Permission', err.message || 'Terjadi kesalahan saat menghapus permission')
        console.error('Delete permission error:', err)
    } finally {
        isDeletingPermission.value = false
    }
}

// Computed for active filters check
const hasActiveTahunPelajaranFilters = computed(() => {
    return tahunPelajaranFilters.value.tahun_pelajaran !== '' || tahunPelajaranFilters.value.status !== ''
})

// Fetch tahun pelajaran data with pagination and filters
const fetchTahunPelajaranData = async () => {
    console.log('Fetching tahun pelajaran data...', { pagination: tahunPelajaranPagination.value, filters: tahunPelajaranFilters.value })

    // Build search object (only include non-empty values)
    const search: any = {}
    if (tahunPelajaranFilters.value.tahun_pelajaran) search.tahun_pelajaran = tahunPelajaranFilters.value.tahun_pelajaran
    if (tahunPelajaranFilters.value.status) search.status = tahunPelajaranFilters.value.status

    const result = await tahunPelajaranStore.fetchTahunPelajarans(tahunPelajaranPagination.value.page, tahunPelajaranPagination.value.limit, search)

    if (!result.success && tahunPelajaranStore.error) {
        const { handle401 } = useAuthGuard()
        if (result.message?.includes('401') || result.message?.includes('Unauthorized')) {
            await handle401()
        }
    }
}

// Handle tahun pelajaran page change
const onTahunPelajaranPageChange = (newPage: number) => {
    tahunPelajaranPagination.value.page = newPage
    fetchTahunPelajaranData()
}

// Handle tahun pelajaran limit change
const onTahunPelajaranLimitChange = (newLimit: number) => {
    tahunPelajaranPagination.value.limit = newLimit
    tahunPelajaranPagination.value.page = 1 // Reset to first page
    fetchTahunPelajaranData()
}

// Apply tahun pelajaran filter
const applyTahunPelajaranFilter = () => {
    tahunPelajaranPagination.value.page = 1 // Reset to first page when filtering
    fetchTahunPelajaranData()
}

// Clear tahun pelajaran filter
const clearTahunPelajaranFilter = () => {
    tahunPelajaranFilters.value = {
        tahun_pelajaran: '',
        status: ''
    }
    tahunPelajaranPagination.value.page = 1
    fetchTahunPelajaranData()
}

// Open create tahun pelajaran modal
const openCreateTahunPelajaranModal = () => {
    showCreateTahunPelajaranModal.value = true
}

// Open edit tahun pelajaran modal
const openEditTahunPelajaranModal = (item: TahunPelajaranData) => {
    console.log('Opening Edit Tahun Pelajaran Modal for:', item)
    selectedTahunPelajaran.value = item
    showEditTahunPelajaranModal.value = true
}

// Open delete tahun pelajaran confirmation
const openDeleteTahunPelajaranConfirm = (item: TahunPelajaranData) => {
    selectedTahunPelajaran.value = item
    showDeleteTahunPelajaranConfirm.value = true
}

// Handle create tahun pelajaran success
const handleCreateTahunPelajaranSuccess = (message: string) => {
    console.log('Create tahun pelajaran success:', message)
    success('Tahun Pelajaran Berhasil Ditambahkan', message)

    // Reset to page 1 after successful create
    tahunPelajaranPagination.value.page = 1
    fetchTahunPelajaranData()
}

// Handle create tahun pelajaran error
const handleCreateTahunPelajaranError = (errorMessage: string) => {
    console.error('Create tahun pelajaran error:', errorMessage)
    error('Gagal Menambahkan Tahun Pelajaran', errorMessage)
}

// Handle edit tahun pelajaran success
const handleEditTahunPelajaranSuccess = (message: string) => {
    console.log('Edit tahun pelajaran success:', message)
    success('Tahun Pelajaran Berhasil Diperbarui', message)

    // Reset to page 1 after successful edit
    tahunPelajaranPagination.value.page = 1
    fetchTahunPelajaranData()
}

// Handle edit tahun pelajaran error
const handleEditTahunPelajaranError = (errorMessage: string) => {
    console.error('Edit tahun pelajaran error:', errorMessage)
    error('Gagal Mengupdate Tahun Pelajaran', errorMessage)
}

// Handle delete tahun pelajaran confirmation
const handleDeleteTahunPelajaranConfirm = async () => {
    if (!selectedTahunPelajaran.value) return

    isDeletingTahunPelajaran.value = true
    try {
        const result = await tahunPelajaranStore.removeTahunPelajaran(selectedTahunPelajaran.value.id)

        if (result.success) {
            success('Tahun Pelajaran Berhasil Dihapus', result.message)
            showDeleteTahunPelajaranConfirm.value = false
            selectedTahunPelajaran.value = null

            // Calculate max page after deletion
            const totalAfterDelete = tahunPelajaranStore.total
            const maxPage = Math.ceil(totalAfterDelete / tahunPelajaranPagination.value.limit)

            // If current page is beyond max page, go to previous page
            if (tahunPelajaranPagination.value.page > maxPage && maxPage > 0) {
                tahunPelajaranPagination.value.page = maxPage
            } else if (maxPage === 0) {
                tahunPelajaranPagination.value.page = 1
            }

            // Fetch data for the appropriate page
            await fetchTahunPelajaranData()
        } else {
            error('Gagal Menghapus Tahun Pelajaran', result.message)
        }
    } catch (err: any) {
        error('Gagal Menghapus Tahun Pelajaran', err.message || 'Terjadi kesalahan saat menghapus tahun pelajaran')
        console.error('Delete tahun pelajaran error:', err)
    } finally {
        isDeletingTahunPelajaran.value = false
    }
}

// Computed for active filters check
const hasActiveKelasFilters = computed(() => {
    return kelasFilters.value.name !== '' || kelasFilters.value.status !== ''
})

// Fetch kelas data with pagination and filters
const fetchKelasData = async () => {
    console.log('Fetching kelas data...', { pagination: kelasPagination.value, filters: kelasFilters.value })

    // Build search object (only include non-empty values)
    const search: any = {}
    if (kelasFilters.value.name) search.name = kelasFilters.value.name
    if (kelasFilters.value.status) search.status = kelasFilters.value.status

    const result = await kelasStore.fetchKelases(kelasPagination.value.page, kelasPagination.value.limit, search)

    if (!result.success && kelasStore.error) {
        const { handle401 } = useAuthGuard()
        if (result.message?.includes('401') || result.message?.includes('Unauthorized')) {
            await handle401()
        }
    }
}

// Handle kelas page change
const onKelasPageChange = (newPage: number) => {
    kelasPagination.value.page = newPage
    fetchKelasData()
}

// Handle kelas limit change
const onKelasLimitChange = (newLimit: number) => {
    kelasPagination.value.limit = newLimit
    kelasPagination.value.page = 1 // Reset to first page
    fetchKelasData()
}

// Apply kelas filter
const applyKelasFilter = () => {
    kelasPagination.value.page = 1 // Reset to first page when filtering
    fetchKelasData()
}

// Clear kelas filter
const clearKelasFilter = () => {
    kelasFilters.value = {
        name: '',
        status: ''
    }
    kelasPagination.value.page = 1
    fetchKelasData()
}

// Open create kelas modal
const openCreateKelasModal = () => {
    showCreateKelasModal.value = true
}

// Open edit kelas modal
const openEditKelasModal = (item: KelasData) => {
    console.log('Opening Edit Kelas Modal for:', item)
    selectedKelas.value = item
    showEditKelasModal.value = true
}

// Open delete kelas confirmation
const openDeleteKelasConfirm = (item: KelasData) => {
    selectedKelas.value = item
    showDeleteKelasConfirm.value = true
}

// Handle create kelas success
const handleCreateKelasSuccess = (message: string) => {
    console.log('Create kelas success:', message)
    success('Kelas Berhasil Ditambahkan', message)

    // Reset to page 1 after successful create
    kelasPagination.value.page = 1
    fetchKelasData()
}

// Handle create kelas error
const handleCreateKelasError = (errorMessage: string) => {
    console.error('Create kelas error:', errorMessage)
    error('Gagal Menambahkan Kelas', errorMessage)
}

// Handle edit kelas success
const handleEditKelasSuccess = (message: string) => {
    console.log('Edit kelas success:', message)
    success('Kelas Berhasil Diperbarui', message)

    // Reset to page 1 after successful edit
    kelasPagination.value.page = 1
    fetchKelasData()
}

// Handle edit kelas error
const handleEditKelasError = (errorMessage: string) => {
    console.error('Edit kelas error:', errorMessage)
    error('Gagal Mengupdate Kelas', errorMessage)
}

// Handle delete kelas confirmation
const handleDeleteKelasConfirm = async () => {
    if (!selectedKelas.value) return

    isDeletingKelas.value = true
    try {
        const result = await kelasStore.removeKelas(selectedKelas.value.id)

        if (result.success) {
            success('Kelas Berhasil Dihapus', result.message)
            showDeleteKelasConfirm.value = false
            selectedKelas.value = null

            // Calculate max page after deletion
            const totalAfterDelete = kelasStore.total
            const maxPage = Math.ceil(totalAfterDelete / kelasPagination.value.limit)

            // If current page is beyond max page, go to previous page
            if (kelasPagination.value.page > maxPage && maxPage > 0) {
                kelasPagination.value.page = maxPage
            } else if (maxPage === 0) {
                kelasPagination.value.page = 1
            }

            // Fetch data for the appropriate page
            await fetchKelasData()
        } else {
            error('Gagal Menghapus Kelas', result.message)
        }
    } catch (err: any) {
        error('Gagal Menghapus Kelas', err.message || 'Terjadi kesalahan saat menghapus kelas')
        console.error('Delete kelas error:', err)
    } finally {
        isDeletingKelas.value = false
    }
}

// Fetch rombel data with pagination and filters
const fetchRombelData = async () => {
    console.log('Fetching rombel data...', { pagination: rombelPagination.value, filters: rombelFilters.value })

    // Build search object (only include non-empty values)
    const search: any = {}
    if (rombelFilters.value.name) search.name = rombelFilters.value.name
    if (rombelFilters.value.kelas_id && rombelFilters.value.kelas_id !== 0) search.kelas_id = rombelFilters.value.kelas_id
    if (rombelFilters.value.status) search.status = rombelFilters.value.status

    const result = await rombelStore.fetchRombels(rombelPagination.value.page, rombelPagination.value.limit, search)

    if (!result.success && rombelStore.error) {
        const { handle401 } = useAuthGuard()
        if (result.message?.includes('401') || result.message?.includes('Unauthorized')) {
            await handle401()
        }
    }
}

// Handle rombel page change
const onRombelPageChange = (newPage: number) => {
    rombelPagination.value.page = newPage
    fetchRombelData()
}

// Handle rombel limit change
const onRombelLimitChange = (newLimit: number) => {
    rombelPagination.value.limit = newLimit
    rombelPagination.value.page = 1 // Reset to first page
    fetchRombelData()
}

// Apply rombel filter
const applyRombelFilter = () => {
    rombelPagination.value.page = 1 // Reset to first page when filtering
    fetchRombelData()
}

// Clear rombel filter
const clearRombelFilter = () => {
    rombelFilters.value = {
        name: '',
        kelas_id: 0,
        status: ''
    }
    rombelPagination.value.page = 1
    fetchRombelData()
}

// Open create rombel modal
const openCreateRombelModal = () => {
    showCreateRombelModal.value = true
}

// Open edit rombel modal
const openEditRombelModal = (item: RombelData) => {
    console.log('Opening Edit Rombel Modal for:', item)
    selectedRombel.value = item
    showEditRombelModal.value = true
}

// Open delete rombel confirmation
const openDeleteRombelConfirm = (item: RombelData) => {
    selectedRombel.value = item
    showDeleteRombelConfirm.value = true
}

// Handle create rombel success
const handleCreateRombelSuccess = (message: string) => {
    console.log('Create rombel success:', message)
    success('Rombel Berhasil Ditambahkan', message)

    // Reset to page 1 after successful create
    rombelPagination.value.page = 1
    fetchRombelData()
}

// Handle create rombel error
const handleCreateRombelError = (errorMessage: string) => {
    console.error('Create rombel error:', errorMessage)
    error('Gagal Menambahkan Rombel', errorMessage)
}

// Handle edit rombel success
const handleEditRombelSuccess = (message: string) => {
    console.log('Edit rombel success:', message)
    success('Rombel Berhasil Diperbarui', message)

    // Reset to page 1 after successful edit
    rombelPagination.value.page = 1
    fetchRombelData()
}

// Handle edit rombel error
const handleEditRombelError = (errorMessage: string) => {
    console.error('Edit rombel error:', errorMessage)
    error('Gagal Mengupdate Rombel', errorMessage)
}

// Handle delete rombel confirmation
const handleDeleteRombelConfirm = async () => {
    if (!selectedRombel.value) return

    isDeletingRombel.value = true
    try {
        const result = await rombelStore.removeRombel(selectedRombel.value.id)

        if (result.success) {
            success('Rombel Berhasil Dihapus', result.message)
            showDeleteRombelConfirm.value = false
            selectedRombel.value = null

            // Calculate max page after deletion
            const totalAfterDelete = rombelStore.total
            const maxPage = Math.ceil(totalAfterDelete / rombelPagination.value.limit)

            // If current page is beyond max page, go to previous page
            if (rombelPagination.value.page > maxPage && maxPage > 0) {
                rombelPagination.value.page = maxPage
            } else if (maxPage === 0) {
                rombelPagination.value.page = 1
            }

            // Fetch data for the appropriate page
            await fetchRombelData()
        } else {
            error('Gagal Menghapus Rombel', result.message)
        }
    } catch (err: any) {
        error('Gagal Menghapus Rombel', err.message || 'Terjadi kesalahan saat menghapus rombel')
        console.error('Delete rombel error:', err)
    } finally {
        isDeletingRombel.value = false
    }
}

// Watch activeTab to reload data when switching tabs
watch(() => activeTab.value, (newTab) => {
    console.log('Tab changed to:', newTab)

    // Always reload roles and systems when switching tabs
    // This ensures dropdowns are always up-to-date
    fetchRoles()
    fetchSystems()

    // Reload specific tab data
    if (newTab === 'user') {
        fetchUserData()
    } else if (newTab === 'role') {
        fetchRoleData()
    } else if (newTab === 'permission') {
        fetchPermissionData()
    } else if (newTab === 'tahun-pelajaran') {
        fetchTahunPelajaranData()
    } else if (newTab === 'kelas') {
        fetchKelasData()
    } else if (newTab === 'rombel') {
        fetchRombelData()
    }
})

// Lifecycle
onMounted(() => {
    console.log('Master Data component mounted')
    fetchRoles()
    fetchSystems()
    fetchSystemData()
    fetchUserData()
    fetchRoleData()
    fetchPermissionData()
    fetchTahunPelajaranData()
    fetchKelasData()
    fetchRombelData()
})
</script>

<style scoped>
@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-slide-up {
    animation: slideUp 0.3s ease-out;
}

/* Scrollbar styling untuk tab overflow */
.bg-white::-webkit-scrollbar {
    height: 6px;
}

.bg-white::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 3px;
}

.bg-white::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
}

.bg-white::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}
</style>
