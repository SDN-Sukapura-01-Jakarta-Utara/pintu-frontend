<template>
  <!-- Backdrop untuk Mobile/Tablet -->
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      @click="$emit('close')"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
    ></div>
  </Transition>

  <!-- Sidebar -->
  <Transition
    enter-active-class="transition-all duration-300 md:transition-none"
    enter-from-class="-translate-x-full md:translate-x-0"
    enter-to-class="translate-x-0"
    leave-active-class="transition-all duration-300 md:transition-none"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full md:translate-x-0"
  >
    <div
      v-if="isOpen || isMd"
      :class="[
        'fixed left-0 top-0 h-screen bg-red-800 text-white z-40 overflow-y-auto flex flex-col',
        isOpen ? 'w-72' : 'w-20',
        !isOpen && 'hidden md:flex md:w-20'
      ]"
    >
      <!-- Sidebar Header dengan Logo -->
      <div
        class="sticky top-0 bg-red-800 border-b border-red-700 w-full"
        :class="isOpen ? 'px-4 py-4' : 'px-2 py-3'"
      >
        <div class="flex flex-col items-center" :class="isOpen ? 'gap-4' : 'gap-0'">
          <!-- Logo Sekolah -->
          <img
            src="~/assets/images/logo-sekolah.jpg"
            alt="Logo SDN Sukapura 01"
            :class="[
              'rounded-full object-cover border-2 border-white flex-shrink-0',
              isOpen ? 'w-16 h-16' : 'w-12 h-12'
            ]"
          />
          <!-- Sidebar Title -->
          <p v-if="isOpen" class="text-xs sm:text-sm font-bold text-center leading-tight">
            PINTU SDN Sukapura 01
          </p>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-b border-red-700"></div>

      <!-- Menu Items -->
      <nav class="flex-1 w-full" :class="[isOpen ? 'py-4 px-4 space-y-2' : 'py-4 px-2 space-y-2']">
        <!-- Dashboard -->
        <NuxtLink
          to="/peserta-didik" @click="handleLinkClick"
          :class="[
            'flex items-center rounded-lg transition-all duration-200 hover:bg-red-700',
            isOpen ? 'gap-4 px-4 py-3' : 'gap-0 justify-center px-2 py-3',
            route.path === '/peserta-didik' ? 'bg-red-700' : ''
          ]"
        >
          <i class="fa-solid fa-house w-4 h-4 sm:w-5 sm:h-5 text-base"></i>
          <span v-if="isOpen" class="text-xs sm:text-sm font-medium">Dashboard</span>
        </NuxtLink>

        <!-- Profil Saya -->
        <NuxtLink
          v-if="hasPermission('READ_PROFILE_PESERTA_DIDIK')"
          to="/peserta-didik/profil-saya" @click="handleLinkClick"
          :class="[
            'flex items-center rounded-lg transition-all duration-200 hover:bg-red-700',
            isOpen ? 'gap-4 px-4 py-3' : 'gap-0 justify-center px-2 py-3',
            route.path === '/peserta-didik/profil-saya' ? 'bg-red-700' : ''
          ]"
        >
          <i class="fa-solid fa-user w-4 h-4 sm:w-5 sm:h-5 text-base"></i>
          <span v-if="isOpen" class="text-xs sm:text-sm font-medium">Profil Saya</span>
        </NuxtLink>

        <!-- Absensi Peserta Didik (dengan submenu) -->
        <div v-if="hasPermission('READ_ABSENSI_PESERTA_DIDIK')">
          <button type="button" @click.stop="toggleSubmenu('absensi')" :class="[
            'w-full flex items-center rounded-lg transition-all duration-200 hover:bg-red-700',
            isOpen ? 'gap-4 px-4 py-3' : 'gap-0 justify-center px-2 py-3'
          ]">
            <i class="fa-solid fa-clipboard-check w-4 h-4 sm:w-5 sm:h-5 text-base"></i>
            <div v-if="isOpen" class="flex-1 flex items-center justify-between">
              <span class="text-xs sm:text-sm font-medium">Absensi</span>
              <i :class="[
                'fa-solid fa-chevron-right w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 flex-shrink-0',
                openMenus.absensi ? 'rotate-90' : ''
              ]"></i>
            </div>
          </button>

          <!-- Submenu Absensi -->
          <div v-if="isOpen && openMenus.absensi" class="ml-12 mt-2 space-y-2 border-l border-red-500 pl-4">
            <NuxtLink to="/peserta-didik/absensi/dashboard-kehadiran" @click="handleLinkClick" :class="[
              'block text-xs sm:text-sm py-2 px-2 rounded transition-all duration-200 hover:bg-red-700',
              route.path.includes('absensi/dashboard-kehadiran') ? 'bg-red-700 font-semibold' : ''
            ]">
              Dashboard Kehadiran
            </NuxtLink>
            <NuxtLink to="/peserta-didik/absensi/rekapitulasi-kehadiran" @click="handleLinkClick" :class="[
              'block text-xs sm:text-sm py-2 px-2 rounded transition-all duration-200 hover:bg-red-700',
              route.path.includes('absensi/rekapitulasi-kehadiran') ? 'bg-red-700 font-semibold' : ''
            ]">
              Rekapitulasi Kehadiran
            </NuxtLink>
          </div>
        </div>

        <!-- Nilai Peserta Didik (dengan submenu) -->
        <div v-if="hasPermission('READ_NILAI_PESERTA_DIDIK')">
          <button type="button" @click.stop="toggleSubmenu('nilai')" :class="[
            'w-full flex items-center rounded-lg transition-all duration-200 hover:bg-red-700',
            isOpen ? 'gap-4 px-4 py-3' : 'gap-0 justify-center px-2 py-3'
          ]">
            <i class="fa-solid fa-file-invoice w-4 h-4 sm:w-5 sm:h-5 text-base"></i>
            <div v-if="isOpen" class="flex-1 flex items-center justify-between">
              <span class="text-xs sm:text-sm font-medium">Nilai Peserta Didik</span>
              <i :class="[
                'fa-solid fa-chevron-right w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 flex-shrink-0',
                openMenus.nilai ? 'rotate-90' : ''
              ]"></i>
            </div>
          </button>

          <!-- Submenu Nilai -->
          <div v-if="isOpen && openMenus.nilai" class="ml-12 mt-2 space-y-2 border-l border-red-500 pl-4">
            <NuxtLink to="/peserta-didik/nilai/monitoring" @click="handleLinkClick" :class="[
              'block text-xs sm:text-sm py-2 px-2 rounded transition-all duration-200 hover:bg-red-700',
              route.path.includes('nilai/monitoring') ? 'bg-red-700 font-semibold' : ''
            ]">
              Monitoring Nilai
            </NuxtLink>
            <NuxtLink to="/peserta-didik/nilai/formatif" @click="handleLinkClick" :class="[
              'block text-xs sm:text-sm py-2 px-2 rounded transition-all duration-200 hover:bg-red-700',
              route.path.includes('nilai/formatif') ? 'bg-red-700 font-semibold' : ''
            ]">
              Nilai Formatif
            </NuxtLink>
            <NuxtLink to="/peserta-didik/nilai/sumatif-harian" @click="handleLinkClick" :class="[
              'block text-xs sm:text-sm py-2 px-2 rounded transition-all duration-200 hover:bg-red-700',
              route.path.includes('nilai/sumatif-harian') ? 'bg-red-700 font-semibold' : ''
            ]">
              Nilai Sumatif Harian
            </NuxtLink>
            <NuxtLink to="/peserta-didik/nilai/sumatif-akhir" @click="handleLinkClick" :class="[
              'block text-xs sm:text-sm py-2 px-2 rounded transition-all duration-200 hover:bg-red-700',
              route.path.includes('nilai/sumatif-akhir') ? 'bg-red-700 font-semibold' : ''
            ]">
              Nilai Sumatif Akhir
            </NuxtLink>
          </div>
        </div>

        <!-- Perkembangan Inklusi -->
        <NuxtLink
          v-if="hasPermission('READ_PERKEMBANGAN_INKLUSI')"
          to="/peserta-didik/perkembangan-inklusi" @click="handleLinkClick"
          :class="[
            'flex items-center rounded-lg transition-all duration-200 hover:bg-red-700',
            isOpen ? 'gap-4 px-4 py-3' : 'gap-0 justify-center px-2 py-3',
            route.path === '/peserta-didik/perkembangan-inklusi' ? 'bg-red-700' : ''
          ]"
        >
          <i class="fa-solid fa-chart-line w-4 h-4 sm:w-5 sm:h-5 text-base"></i>
          <span v-if="isOpen" class="text-xs sm:text-sm font-medium">Perkembangan Inklusi</span>
        </NuxtLink>

        <!-- Ekstrakurikuler (dengan submenu) -->
        <div v-if="hasPermission('READ_EKSTRAKURIKULER_PESERTA_DIDIK')">
          <button type="button" @click.stop="toggleSubmenu('ekstrakurikuler')" :class="[
            'w-full flex items-center rounded-lg transition-all duration-200 hover:bg-red-700',
            isOpen ? 'gap-4 px-4 py-3' : 'gap-0 justify-center px-2 py-3'
          ]">
            <i class="fa-solid fa-futbol w-4 h-4 sm:w-5 sm:h-5 text-base"></i>
            <div v-if="isOpen" class="flex-1 flex items-center justify-between">
              <span class="text-xs sm:text-sm font-medium">Ekstrakurikuler</span>
              <i :class="[
                'fa-solid fa-chevron-right w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 flex-shrink-0',
                openMenus.ekstrakurikuler ? 'rotate-90' : ''
              ]"></i>
            </div>
          </button>

          <!-- Submenu Ekstrakurikuler -->
          <div v-if="isOpen && openMenus.ekstrakurikuler" class="ml-12 mt-2 space-y-2 border-l border-red-500 pl-4">
            <NuxtLink to="/peserta-didik/ekstrakurikuler/pendaftaran" @click="handleLinkClick" :class="[
              'block text-xs sm:text-sm py-2 px-2 rounded transition-all duration-200 hover:bg-red-700',
              route.path.includes('ekstrakurikuler/pendaftaran') ? 'bg-red-700 font-semibold' : ''
            ]">
              Pendaftaran Ekstrakurikuler
            </NuxtLink>
            <NuxtLink to="/peserta-didik/ekstrakurikuler/kehadiran" @click="handleLinkClick" :class="[
              'block text-xs sm:text-sm py-2 px-2 rounded transition-all duration-200 hover:bg-red-700',
              route.path.includes('ekstrakurikuler/kehadiran') ? 'bg-red-700 font-semibold' : ''
            ]">
              Kehadiran Ekstrakurikuler
            </NuxtLink>
          </div>
        </div>

        <!-- Formulir & Survei -->
        <NuxtLink
          v-if="hasPermission('READ_FORMULIR_SURVEI_PESERTA_DIDIK')"
          to="/peserta-didik/formulir" @click="handleLinkClick"
          :class="[
            'flex items-center rounded-lg transition-all duration-200 hover:bg-red-700',
            isOpen ? 'gap-4 px-4 py-3' : 'gap-0 justify-center px-2 py-3',
            route.path === '/peserta-didik/formulir' ? 'bg-red-700' : ''
          ]"
        >
          <i class="fa-solid fa-file-lines w-4 h-4 sm:w-5 sm:h-5 text-base"></i>
          <span v-if="isOpen" class="text-xs sm:text-sm font-medium">Formulir & Survei</span>
        </NuxtLink>

        <!-- Buku Panduan -->
        <NuxtLink
          to="/peserta-didik/buku-panduan" @click="handleLinkClick"
          :class="[
            'flex items-center rounded-lg transition-all duration-200 hover:bg-red-700',
            isOpen ? 'gap-4 px-4 py-3' : 'gap-0 justify-center px-2 py-3',
            route.path === '/peserta-didik/buku-panduan' ? 'bg-red-700' : ''
          ]"
        >
          <i class="fa-solid fa-book w-4 h-4 sm:w-5 sm:h-5 text-base"></i>
          <span v-if="isOpen" class="text-xs sm:text-sm font-medium">Buku Panduan</span>
        </NuxtLink>
      </nav>

      <!-- Logout Button (Mobile Only) -->
      <div v-if="isOpen" class="md:hidden border-t border-red-700 p-4">
        <button
          @click="$emit('logout')"
          :disabled="isLoading"
          class="w-full flex items-center gap-4 px-4 py-3 rounded-lg bg-red-700 hover:bg-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i v-if="isLoading" class="fa-solid fa-spinner w-5 h-5 animate-spin"></i>
          <i v-else class="fa-solid fa-sign-out-alt w-5 h-5"></i>
          <span class="text-sm font-medium">{{ isLoading ? 'Keluar...' : 'Keluar' }}</span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { ref, computed, watch } from 'vue'
import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const { hasPermission } = useAuth()

const props = defineProps<{
  isOpen: boolean
  isLoading: boolean
}>()

const emit = defineEmits<{
  close: []
  logout: []
}>()

const isMd = useMediaQuery('(min-width: 768px)')

const openMenus = ref({
  nilai: false,
  absensi: false,
  ekstrakurikuler: false,
})

// Check if submenu should be active based on current route
const isActiveSubmenu = computed(() => ({
  nilai: route.path.includes('nilai/'),
  absensi: route.path.includes('absensi/'),
  ekstrakurikuler: route.path.includes('ekstrakurikuler/'),
}))

// Auto-open submenu if current path is in that submenu
watch(() => route.path, () => {
  if (isActiveSubmenu.value.nilai && !openMenus.value.nilai) {
    openMenus.value.nilai = true
  }
  if (isActiveSubmenu.value.absensi && !openMenus.value.absensi) {
    openMenus.value.absensi = true
  }
  if (isActiveSubmenu.value.ekstrakurikuler && !openMenus.value.ekstrakurikuler) {
    openMenus.value.ekstrakurikuler = true
  }
}, { immediate: true })

const toggleSubmenu = (menu: keyof typeof openMenus.value) => {
  openMenus.value[menu] = !openMenus.value[menu]
}

const handleLinkClick = () => {
  // Close sidebar on mobile when link is clicked
  if (!isMd.value) {
    emit('close')
  }
}
</script>

