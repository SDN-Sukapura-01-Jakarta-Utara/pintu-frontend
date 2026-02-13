<template>
    <div class="flex h-screen bg-gray-50 overflow-hidden">
        <!-- Sidebar Component -->
        <Sidebar :isOpen="isSidebarOpen" :user="user" :isLoading="isLoading" @close="isSidebarOpen = false"
            @logout="handleLogout" />

        <!-- Main Content -->
        <div :class="[
            'flex-1 flex flex-col transition-all duration-300 overflow-hidden',
            'md:ml-20',
            isSidebarOpen ? 'md:ml-72' : 'md:ml-20'
        ]">
            <!-- Navbar Component -->
            <Navbar :user="user" :isLoading="isLoading" :pageTitle="pageTitle"
                @toggle-sidebar="isSidebarOpen = !isSidebarOpen" @logout="handleLogout" />

            <!-- Page Content -->
            <div class="flex-1 overflow-y-auto overflow-x-hidden w-full">
                <div class="p-6 w-full max-w-full">
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useRoute } from 'vue-router'

const { getCurrentUser, performLogout, isLoading } = useAuth()
const route = useRoute()

const isSidebarOpen = ref(true)
const user = computed(() => getCurrentUser())

// Get page title from route path
const pageTitle = computed(() => {
    const path = route.path

    if (path === '/backoffice') return 'Dashboard'
    if (path.includes('jumbotron')) return 'Jumbotron'
    if (path.includes('visi-misi')) return 'Visi Misi'
    if (path.includes('kutipan')) return 'Kutipan Kepala Sekolah'
    if (path.includes('sarana-prasarana')) return 'Sarana & Prasarana'
    if (path.includes('struktur')) return 'Struktur Organisasi'
    if (path.includes('artikel')) return 'Artikel'
    if (path.includes('pengumuman')) return 'Pengumuman'
    if (path.includes('galeri')) return 'Galeri Kegiatan'
    if (path.includes('peserta-didik')) return 'Peserta Didik'
    if (path.includes('pendidik')) return 'Pendidik'
    if (path.includes('tenaga-kependidikan')) return 'Tenaga Kependidikan'
    if (path.includes('mutasi-siswa')) return 'Mutasi Siswa'
    if (path.includes('kritik-saran')) return 'Kritik & Saran'
    if (path.includes('pertanyaan')) return 'Pertanyaan'
    if (path.includes('pengaduan')) return 'Pengaduan'

    return 'Dashboard'
})

const handleLogout = async () => {
    const result = await performLogout()
    if (result.success) {
        console.log('Logout successful')
    }
}
</script>
