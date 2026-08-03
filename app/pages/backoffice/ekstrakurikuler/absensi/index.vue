<template>
  <DashboardLayout>
    <!-- Header Section -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Absensi Ekstrakurikuler</h1>
      <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
        Kelola dan monitoring absensi kegiatan ekstrakurikuler
      </p>
    </div>

    <!-- Under Development Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12">
      <div class="flex flex-col items-center justify-center py-12">
        <div class="w-24 h-24 rounded-full bg-yellow-100 flex items-center justify-center mb-6">
          <i class="fas fa-tools text-4xl text-yellow-600"></i>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-3">Fitur Dalam Pengembangan</h2>
        <p class="text-base text-gray-600 text-center max-w-md mb-6">
          Fitur Absensi Ekstrakurikuler sedang dalam tahap pengembangan dan akan segera tersedia.
        </p>
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <i class="fas fa-calendar-alt"></i>
          <span>Estimasi: Coming Soon</span>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '~/components/DashboardLayout.vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

useHead({
  title: 'Absensi Ekstrakurikuler | PINTU SDN Sukapura 01',
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
</script>
