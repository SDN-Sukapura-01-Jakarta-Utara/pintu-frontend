<template>
    <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden w-full">
        <div class="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <table class="w-full min-w-max">
                <!-- Header -->
                <thead>
                    <tr class="border-b border-gray-200 bg-slate-700">
                        <th class="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm md:text-[14.5px] font-semibold uppercase tracking-wider text-white w-12">
                            No
                        </th>
                        <th class="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm md:text-[14.5px] font-semibold uppercase tracking-wider text-white w-32">
                            Gambar
                        </th>
                        <th class="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm md:text-[14.5px] font-semibold uppercase tracking-wider text-white">
                            Status
                        </th>
                        <th class="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm md:text-[14.5px] font-semibold uppercase tracking-wider text-white">
                            Dibuat
                        </th>
                        <th class="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm md:text-[14.5px] font-semibold uppercase tracking-wider text-white">
                            Aksi
                        </th>
                    </tr>
                </thead>

                <!-- Body -->
                <tbody class="divide-y divide-gray-200">
                    <tr v-for="(item, index) in items" :key="item.id" class="hover:bg-gray-50 transition-colors duration-150">
                        <!-- No Column -->
                        <td class="px-3 sm:px-6 py-2 sm:py-4 text-[13px] sm:text-sm md:text-[15px] font-medium text-gray-700">
                            {{ index + 1 }}
                        </td>

                        <!-- Image Column -->
                        <td class="px-3 sm:px-6 py-2 sm:py-4">
                            <img :src="item.file" :alt="`Jumbotron ${item.id}`"
                                class="h-12 w-16 sm:h-16 sm:w-24 rounded-lg object-cover shadow-sm border border-gray-200 hover:shadow-md transition-shadow" />
                        </td>

                        <!-- Status Column -->
                        <td class="px-3 sm:px-6 py-2 sm:py-4">
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
                        </td>

                        <!-- Created Date Column -->
                        <td class="px-3 sm:px-6 py-2 sm:py-4 text-[13px] sm:text-sm md:text-[15px] text-gray-700">
                            {{ formatDate(item.created_at) }}
                        </td>

                        <!-- Action Column -->
                        <td class="px-3 sm:px-6 py-2 sm:py-4">
                            <div class="flex items-center justify-center gap-1.5 sm:gap-2">
                                <!-- Edit Button -->
                                <button @click="$emit('edit', item)"
                                    class="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-yellow-100 text-yellow-700 font-semibold text-xs hover:bg-yellow-200 transition-colors duration-200"
                                    title="Edit">
                                    <i class="fa-solid fa-pen w-3 h-3 sm:w-4 sm:h-4"></i>
                                </button>

                                <!-- Delete Button -->
                                <button @click="$emit('delete', item)"
                                    class="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-red-100 text-red-700 font-semibold text-xs hover:bg-red-200 transition-colors duration-200"
                                    title="Hapus">
                                    <i class="fa-solid fa-trash w-3 h-3 sm:w-4 sm:h-4"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination Info -->
        <div v-if="items.length > 0"
            class="border-t border-gray-200 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 text-[13px] sm:text-sm md:text-[15px] text-gray-600">
            Menampilkan <span class="font-semibold text-gray-900">{{ items.length }}</span> dari
            <span class="font-semibold text-gray-900">{{ total }}</span> data
        </div>
    </div>
</template>

<script setup lang="ts">
import type { JumbotronData } from '~/types/JumbotronType'

defineProps<{
    items: JumbotronData[]
    total: number
}>()

defineEmits<{
    edit: [item: JumbotronData]
    delete: [item: JumbotronData]
}>()

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}
</script>

<style scoped>
/* Scrollbar styling untuk table */
::-webkit-scrollbar {
    height: 8px;
}

::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}
</style>
