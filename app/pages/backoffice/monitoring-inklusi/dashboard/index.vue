<template>
    <DashboardLayout>
        <!-- Header -->
        <div class="mb-6 sm:mb-8">
            <div class="flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
                <div>
                    <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Dashboard Inklusi</h1>
                    <p class="text-[13px] sm:text-sm md:text-[15px] text-gray-600 mt-1 sm:mt-2">
                        Monitoring dan statistik data inklusi
                    </p>
                </div>
            </div>
        </div>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            <div class="group bg-white rounded-xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-20 h-20 bg-blue-500 opacity-5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-300"></div>
                <div class="flex items-center justify-between relative z-10">
                    <div>
                        <p class="text-xs sm:text-sm text-gray-600 font-semibold">Total Siswa Inklusi</p>
                        <p class="text-2xl sm:text-3xl font-bold text-gray-800 mt-2">0</p>
                    </div>
                    <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 shadow-lg">
                        <i class="fa-solid fa-users text-white text-xl sm:text-2xl"></i>
                    </div>
                </div>
            </div>

            <div class="group bg-white rounded-xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-green-500 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-20 h-20 bg-green-500 opacity-5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-300"></div>
                <div class="flex items-center justify-between relative z-10">
                    <div>
                        <p class="text-xs sm:text-sm text-gray-600 font-semibold">Program PPI Aktif</p>
                        <p class="text-2xl sm:text-3xl font-bold text-gray-800 mt-2">0</p>
                    </div>
                    <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-3 shadow-lg">
                        <i class="fa-solid fa-clipboard-check text-white text-xl sm:text-2xl"></i>
                    </div>
                </div>
            </div>

            <div class="group bg-white rounded-xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-yellow-500 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-20 h-20 bg-yellow-500 opacity-5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-300"></div>
                <div class="flex items-center justify-between relative z-10">
                    <div>
                        <p class="text-xs sm:text-sm text-gray-600 font-semibold">Monitoring Bulan Ini</p>
                        <p class="text-2xl sm:text-3xl font-bold text-gray-800 mt-2">0</p>
                    </div>
                    <div class="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-3 shadow-lg">
                        <i class="fa-solid fa-calendar text-white text-xl sm:text-2xl"></i>
                    </div>
                </div>
            </div>

            <div class="group bg-white rounded-xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-20 h-20 bg-purple-500 opacity-5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-300"></div>
                <div class="flex items-center justify-between relative z-10">
                    <div>
                        <p class="text-xs sm:text-sm text-gray-600 font-semibold">Total GPK</p>
                        <p class="text-2xl sm:text-3xl font-bold text-gray-800 mt-2">0</p>
                    </div>
                    <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 shadow-lg">
                        <i class="fa-solid fa-chalkboard-user text-white text-xl sm:text-2xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Content Placeholder -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 class="text-base sm:text-lg font-semibold text-gray-800 mb-4">Grafik Perkembangan</h2>
            <div class="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div class="text-center">
                    <i class="fa-solid fa-chart-line text-gray-400 text-4xl sm:text-5xl mb-4"></i>
                    <p class="text-sm sm:text-base text-gray-500">Grafik akan ditampilkan di sini</p>
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '~/components/DashboardLayout.vue'

definePageMeta({
    layout: 'default',
    middleware: 'auth'
})

useHead({
    title: 'Dashboard Inklusi | PINTU SDN Sukapura 01',
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
