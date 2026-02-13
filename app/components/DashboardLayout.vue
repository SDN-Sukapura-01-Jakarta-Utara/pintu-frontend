<template>
    <div class="flex h-screen bg-gray-50">
        <!-- Sidebar Component -->
        <Sidebar :isOpen="isSidebarOpen" :user="user" :isLoading="isLoading" @close="isSidebarOpen = false"
            @logout="handleLogout" />

        <!-- Main Content -->
        <div :class="[
            'flex-1 flex flex-col transition-all duration-300',
            'md:ml-20',
            isSidebarOpen ? 'md:ml-72' : 'md:ml-20'
        ]">
            <!-- Navbar Component -->
            <Navbar :user="user" :isLoading="isLoading" @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
                @logout="handleLogout" />

            <!-- Page Content -->
            <div class="flex-1 overflow-y-auto">
                <div class="p-6">
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'

const { getCurrentUser, performLogout, isLoading } = useAuth()

const isSidebarOpen = ref(true)
const user = computed(() => getCurrentUser())

const handleLogout = async () => {
    const result = await performLogout()
    if (result.success) {
        console.log('Logout successful')
    }
}
</script>
