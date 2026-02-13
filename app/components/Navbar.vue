<template>
    <nav class="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
        <div class="flex items-center justify-between h-16 px-6">
            <!-- Left: Hamburger & Title -->
            <div class="flex items-center gap-4">
                <button @click="$emit('toggle-sidebar')"
                    class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <i class="fa-solid fa-bars w-6 h-6 text-gray-700"></i>
                </button>
                <h1 class="text-xl font-bold text-gray-900">{{ pageTitle }}</h1>
            </div>

            <!-- Right: User Info & Logout (Desktop Only) -->
            <div class="hidden md:flex items-center gap-4">
                <!-- User Info Container -->
                <div class="bg-gray-100 rounded-lg px-4 py-2">
                    <p class="text-sm font-semibold text-gray-900">{{ user?.nama }}</p>
                    <p class="text-xs text-gray-600">{{ user?.nama }} SDN Sukapura 01</p>
                </div>

                <!-- Logout Button -->
                <button @click="$emit('logout')" :disabled="isLoading"
                    class="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    <i v-if="isLoading" class="fa-solid fa-spinner w-4 h-4 animate-spin"></i>
                    <i v-else class="fa-solid fa-sign-out-alt w-4 h-4"></i>
                    <span>{{ isLoading ? 'Keluar...' : 'Keluar' }}</span>
                </button>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import type { User } from '~/types/AuthType'

defineProps<{
    user: User | null
    isLoading: boolean
    pageTitle: string
}>()

defineEmits<{
    'toggle-sidebar': []
    'logout': []
}>()
</script>
