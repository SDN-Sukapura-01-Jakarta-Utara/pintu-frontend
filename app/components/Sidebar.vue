<template>
    <!-- Backdrop untuk Mobile/Tablet -->
    <Transition enter-active-class="transition-opacity duration-300" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="isOpen" @click="$emit('close')" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden">
        </div>
    </Transition>

    <!-- Sidebar -->
    <Transition enter-active-class="transition-all duration-300 md:transition-none"
        enter-from-class="-translate-x-full md:translate-x-0" enter-to-class="translate-x-0"
        leave-active-class="transition-all duration-300 md:transition-none" leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full md:translate-x-0">
        <div v-if="isOpen || isMd" :class="[
            'fixed left-0 top-0 h-screen bg-red-800 text-white z-40 overflow-y-auto flex flex-col',
            isOpen ? 'w-72' : 'w-20',
            !isOpen && 'hidden md:flex md:w-20'
        ]">
            <!-- Sidebar Header dengan Logo -->
            <div class="sticky top-0 bg-red-800 border-b border-red-700 w-full"
                :class="isOpen ? 'px-4 py-4' : 'px-2 py-3'">
                <div class="flex flex-col items-center" :class="isOpen ? 'gap-4' : 'gap-0'">
                    <!-- Logo Sekolah -->
                    <img src="~/assets/images/logo-sekolah.jpg" alt="Logo SDN Sukapura 01" :class="[
                        'rounded-full object-cover border-2 border-white flex-shrink-0',
                        isOpen ? 'w-16 h-16' : 'w-12 h-12'
                    ]" />
                    <!-- Sidebar Title -->
                    <p v-if="isOpen" class="text-sm font-bold text-center leading-tight">
                        PINTU SDN Sukapura 01
                    </p>
                </div>
            </div>

            <!-- Divider -->
            <div class="border-b border-red-700"></div>

            <!-- Menu Items -->
            <nav class="flex-1 w-full" :class="[
                isOpen ? 'py-4 px-4 space-y-2' : 'py-4 px-2 space-y-2'
            ]">
                <!-- Dashboard -->
                <NuxtLink to="/backoffice" :class="[
                    'flex items-center rounded-lg transition-all duration-200 hover:bg-red-700 active:bg-red-700',
                    isOpen ? 'gap-4 px-4 py-3' : 'gap-0 justify-center px-2 py-3'
                ]">
                    <i class="fa-solid fa-house w-5 h-5 text-base"></i>
                    <span v-if="isOpen" class="text-sm font-medium">Dashboard</span>
                </NuxtLink>

                <!-- Informasi Sekolah -->
                <div>
                    <button @click="toggleSubmenu('sekolah')" :class="[
                        'w-full flex items-center rounded-lg transition-all duration-200 hover:bg-red-700',
                        isOpen ? 'gap-4 px-4 py-3' : 'gap-0 justify-center px-2 py-3'
                    ]">
                        <i class="fa-solid fa-circle-info w-5 h-5 text-base"></i>
                        <div v-if="isOpen" class="flex-1 flex items-center justify-between">
                            <span class="text-sm font-medium">Informasi Sekolah</span>
                            <i :class="[
                                'fa-solid fa-chevron-right w-4 h-4 transition-transform duration-200 flex-shrink-0',
                                openMenus.sekolah ? 'rotate-90' : ''
                            ]"></i>
                        </div>
                    </button>

                    <!-- Submenu -->
                    <div v-if="isOpen && openMenus.sekolah" class="ml-12 mt-2 space-y-2 border-l border-red-500 pl-4">
                        <NuxtLink to="/backoffice/informasi-sekolah/jumbotron" :class="[
                            'block text-sm py-2 px-2 rounded transition-all duration-200 hover:bg-red-700',
                            route.path.includes('jumbotron') ? 'bg-red-700 font-semibold' : ''
                        ]">
                            Jumbotron
                        </NuxtLink>
                        <NuxtLink to="/backoffice/informasi-sekolah/kutipan" :class="[
                            'block text-sm py-2 px-2 rounded transition-all duration-200 hover:bg-red-700',
                            route.path.includes('kutipan') ? 'bg-red-700 font-semibold' : ''
                        ]">
                            Kutipan Kepala Sekolah
                        </NuxtLink>
                        <NuxtLink to="/backoffice/informasi-sekolah/visi-misi" :class="[
                            'block text-sm py-2 px-2 rounded transition-all duration-200 hover:bg-red-700',
                            route.path.includes('visi-misi') ? 'bg-red-700 font-semibold' : ''
                        ]">
                            Visi Misi
                        </NuxtLink>
                        <NuxtLink to="/backoffice/informasi-sekolah/sarana-prasarana" :class="[
                            'block text-sm py-2 px-2 rounded transition-all duration-200 hover:bg-red-700',
                            route.path.includes('sarana-prasarana') ? 'bg-red-700 font-semibold' : ''
                        ]">
                            Sarana & Prasarana
                        </NuxtLink>
                        <NuxtLink to="/backoffice/informasi-sekolah/struktur" :class="[
                            'block text-sm py-2 px-2 rounded transition-all duration-200 hover:bg-red-700',
                            route.path.includes('struktur') ? 'bg-red-700 font-semibold' : ''
                        ]">
                            Struktur Organisasi
                        </NuxtLink>
                    </div>
                </div>

                <!-- Media dan Publikasi -->
                <div>
                    <button @click="toggleSubmenu('media')" :class="[
                        'w-full flex items-center rounded-lg transition-all duration-200 hover:bg-red-700',
                        isOpen ? 'gap-4 px-4 py-3' : 'gap-0 justify-center px-2 py-3'
                    ]">
                        <i class="fa-solid fa-image w-5 h-5 text-base"></i>
                        <div v-if="isOpen" class="flex-1 flex items-center justify-between">
                            <span class="text-sm font-medium">Media & Publikasi</span>
                            <i :class="[
                                'fa-solid fa-chevron-right w-4 h-4 transition-transform duration-200 flex-shrink-0',
                                openMenus.media ? 'rotate-90' : ''
                            ]"></i>
                        </div>
                    </button>

                    <!-- Submenu -->
                    <div v-if="isOpen && openMenus.media" class="ml-12 mt-2 space-y-2 border-l border-red-500 pl-4">
                        <NuxtLink to="/backoffice/media/artikel"
                            class="block text-sm py-2 px-2 rounded transition-all duration-200 hover:bg-red-700">
                            Artikel
                        </NuxtLink>
                        <NuxtLink to="/backoffice/media/pengumuman"
                            class="block text-sm py-2 px-2 rounded transition-all duration-200 hover:bg-red-700">
                            Pengumuman
                        </NuxtLink>
                        <NuxtLink to="/backoffice/media/galeri"
                            class="block text-sm py-2 px-2 rounded transition-all duration-200 hover:bg-red-700">
                            Galeri Kegiatan
                        </NuxtLink>
                    </div>
                </div>

                <!-- Peserta Didik -->
                <NuxtLink to="/backoffice/peserta-didik" :class="[
                    'flex items-center rounded-lg transition-all duration-200 hover:bg-red-700',
                    isOpen ? 'gap-4 px-4 py-3' : 'gap-0 justify-center px-2 py-3'
                ]">
                    <i class="fa-solid fa-users w-5 h-5 text-base"></i>
                    <span v-if="isOpen" class="text-sm font-medium">Peserta Didik</span>
                </NuxtLink>

                <!-- Kepegawaian -->
                <div>
                    <button @click="toggleSubmenu('kepegawaian')" :class="[
                        'w-full flex items-center rounded-lg transition-all duration-200 hover:bg-red-700',
                        isOpen ? 'gap-4 px-4 py-3' : 'gap-0 justify-center px-2 py-3'
                    ]">
                        <i class="fa-solid fa-users w-5 h-5 text-base"></i>
                        <div v-if="isOpen" class="flex-1 flex items-center justify-between">
                            <span class="text-sm font-medium">Kepegawaian</span>
                            <i :class="[
                                'fa-solid fa-chevron-right w-4 h-4 transition-transform duration-200 flex-shrink-0',
                                openMenus.kepegawaian ? 'rotate-90' : ''
                            ]"></i>
                        </div>
                    </button>

                    <!-- Submenu -->
                    <div v-if="isOpen && openMenus.kepegawaian"
                        class="ml-12 mt-2 space-y-2 border-l border-red-500 pl-4">
                        <NuxtLink to="/backoffice/kepegawaian/pendidik"
                            class="block text-sm py-2 px-2 rounded transition-all duration-200 hover:bg-red-700">
                            Pendidik
                        </NuxtLink>
                        <NuxtLink to="/backoffice/kepegawaian/tenaga-kependidikan"
                            class="block text-sm py-2 px-2 rounded transition-all duration-200 hover:bg-red-700">
                            Tenaga Kependidikan
                        </NuxtLink>
                    </div>
                </div>

                <!-- Mutasi Siswa -->
                <NuxtLink to="/backoffice/mutasi-siswa" :class="[
                    'flex items-center rounded-lg transition-all duration-200 hover:bg-red-700',
                    isOpen ? 'gap-4 px-4 py-3' : 'gap-0 justify-center px-2 py-3'
                ]">
                    <i class="fa-solid fa-arrow-right-arrow-left w-5 h-5 text-base"></i>
                    <span v-if="isOpen" class="text-sm font-medium">Mutasi Siswa</span>
                </NuxtLink>

                <!-- Kritik dan Saran -->
                <NuxtLink to="/backoffice/kritik-saran" :class="[
                    'flex items-center rounded-lg transition-all duration-200 hover:bg-red-700',
                    isOpen ? 'gap-4 px-4 py-3' : 'gap-0 justify-center px-2 py-3'
                ]">
                    <i class="fa-solid fa-comment w-5 h-5 text-base"></i>
                    <span v-if="isOpen" class="text-sm font-medium">Kritik & Saran</span>
                </NuxtLink>

                <!-- Pertanyaan Pengaduan -->
                <div>
                    <button @click="toggleSubmenu('pertanyaan')" :class="[
                        'w-full flex items-center rounded-lg transition-all duration-200 hover:bg-red-700',
                        isOpen ? 'gap-4 px-4 py-3' : 'gap-0 justify-center px-2 py-3'
                    ]">
                        <i class="fa-solid fa-circle-question w-5 h-5 text-base"></i>
                        <div v-if="isOpen" class="flex-1 flex items-center justify-between">
                            <span class="text-sm font-medium">Pertanyaan Pengaduan</span>
                            <i :class="[
                                'fa-solid fa-chevron-right w-4 h-4 transition-transform duration-200 flex-shrink-0',
                                openMenus.pertanyaan ? 'rotate-90' : ''
                            ]"></i>
                        </div>
                    </button>

                    <!-- Submenu -->
                    <div v-if="isOpen && openMenus.pertanyaan"
                        class="ml-12 mt-2 space-y-2 border-l border-red-500 pl-4">
                        <NuxtLink to="/backoffice/pertanyaan"
                            class="block text-sm py-2 px-2 rounded transition-all duration-200 hover:bg-red-700">
                            Pertanyaan
                        </NuxtLink>
                        <NuxtLink to="/backoffice/pengaduan"
                            class="block text-sm py-2 px-2 rounded transition-all duration-200 hover:bg-red-700">
                            Pengaduan
                        </NuxtLink>
                    </div>
                </div>
            </nav>

            <!-- User Info & Logout (Mobile/Tablet Only) -->
            <div class="md:hidden mt-auto border-t border-red-700 bg-red-900 w-full px-4 py-4">
                <div v-if="isOpen" class="flex flex-col gap-3">
                    <div>
                        <p class="text-xs text-red-200 mb-1">Logged in as</p>
                        <p class="text-sm font-semibold text-white truncate">{{ user?.nama }}</p>
                    </div>
                    <button @click="$emit('logout')" :disabled="isLoading"
                        class="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg bg-red-800 text-white text-sm font-bold hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        <i v-if="isLoading" class="fa-solid fa-spinner w-4 h-4 animate-spin"></i>
                        <i v-else class="fa-solid fa-sign-out-alt w-4 h-4"></i>
                        <span>{{ isLoading ? 'Keluar...' : 'Keluar' }}</span>
                    </button>
                </div>
                <div v-else class="flex justify-center">
                    <button @click="$emit('logout')" :disabled="isLoading"
                        class="flex items-center justify-center p-2 rounded-lg bg-red-800 text-white hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Keluar">
                        <i v-if="isLoading" class="fa-solid fa-spinner w-4 h-4 animate-spin"></i>
                        <i v-else class="fa-solid fa-sign-out-alt w-4 h-4"></i>
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

import type { User } from '~/types/AuthType'

const route = useRoute()

defineProps<{
    isOpen: boolean
    user: User | null
    isLoading: boolean
}>()

defineEmits<{
    'close': []
    'logout': []
}>()

// Check if screen is md or larger
const isMd = ref(true)

if (process.client) {
    const updateMdState = () => {
        isMd.value = window.innerWidth >= 768
    }

    onMounted(() => {
        updateMdState()
        window.addEventListener('resize', updateMdState)
    })

    onUnmounted(() => {
        window.removeEventListener('resize', updateMdState)
    })
}

const openMenus = ref({
    sekolah: false,
    media: false,
    kepegawaian: false,
    pertanyaan: false,
})

// Check if submenu should be active based on current route
const isActiveSubmenu = computed(() => ({
    sekolah: route.path.includes('informasi-sekolah'),
    media: route.path.includes('media'),
    kepegawaian: route.path.includes('kepegawaian'),
    pertanyaan: route.path.includes('pertanyaan') || route.path.includes('pengaduan'),
}))

// Auto-open submenu if current path is in that submenu
watch(() => route.path, () => {
    if (isActiveSubmenu.value.sekolah && !openMenus.value.sekolah) {
        openMenus.value.sekolah = true
    }
    if (isActiveSubmenu.value.media && !openMenus.value.media) {
        openMenus.value.media = true
    }
    if (isActiveSubmenu.value.kepegawaian && !openMenus.value.kepegawaian) {
        openMenus.value.kepegawaian = true
    }
    if (isActiveSubmenu.value.pertanyaan && !openMenus.value.pertanyaan) {
        openMenus.value.pertanyaan = true
    }
}, { immediate: true })

const toggleSubmenu = (menu: keyof typeof openMenus.value) => {
    openMenus.value[menu] = !openMenus.value[menu]
}
</script>

<style scoped>
/* Scrollbar Styling untuk Sidebar */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
}

::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
}

/* FontAwesome sizing */
i.fa-solid {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
</style>
