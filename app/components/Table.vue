<template>
    <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden w-full">
        <div class="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <table class="w-full min-w-max">
                <!-- Header -->
                <thead>
                    <tr class="border-b border-gray-200 bg-gray-700">
                        <th class="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm md:text-[14.5px] font-semibold uppercase tracking-wider text-white w-12">
                            No
                        </th>
                        <th
                            v-for="column in columns"
                            :key="column.key"
                            :class="[
                                'px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm md:text-[14.5px] font-semibold uppercase tracking-wider text-white',
                                column.align === 'center' ? 'text-center' : 'text-left',
                                column.width ? `w-${column.width}` : '',
                            ]"
                        >
                            {{ column.label }}
                        </th>
                        <th class="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm md:text-[14.5px] font-semibold uppercase tracking-wider text-white">
                            Aksi
                        </th>
                    </tr>
                </thead>

                <!-- Body -->
                <tbody class="divide-y divide-gray-200">
                    <tr v-for="(item, index) in items" :key="getItemKey(item, index)" class="hover:bg-gray-50 transition-colors duration-150">
                        <!-- No Column -->
                        <td class="px-3 sm:px-6 py-2 sm:py-4 text-[13px] sm:text-sm md:text-[15px] font-medium text-gray-700">
                            {{ index + 1 }}
                        </td>

                        <!-- Dynamic Columns -->
                        <td
                            v-for="column in columns"
                            :key="column.key"
                            :class="[
                                'px-3 sm:px-6 py-2 sm:py-4 text-[13px] sm:text-sm md:text-[15px]',
                                column.align === 'center' ? 'text-center' : 'text-left',
                                column.cellClass || 'text-gray-700',
                            ]"
                        >
                            <slot :name="`cell-${column.key}`" :item="item" :column="column">
                                {{ getValue(item, column.key) }}
                            </slot>
                        </td>

                        <!-- Action Column -->
                        <td class="px-3 sm:px-6 py-2 sm:py-4">
                            <slot name="actions" :item="item">
                                <div class="flex items-center justify-center gap-1.5 sm:gap-2">
                                    <!-- Edit Button -->
                                    <EditButton
                                        title="Edit"
                                        @click="$emit('edit', item)"
                                    />

                                    <!-- Delete Button -->
                                    <DeleteButton
                                        title="Hapus"
                                        @click="$emit('delete', item)"
                                    />
                                </div>
                            </slot>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination Info -->
        <div v-if="items.length > 0"
            class="border-t border-gray-200 bg-white px-4 sm:px-6 py-3 sm:py-4 text-[13px] sm:text-sm md:text-[15px] text-gray-600">
            Menampilkan <span class="font-semibold text-gray-900">{{ items.length }}</span> dari
            <span class="font-semibold text-gray-900">{{ total }}</span> data
        </div>
    </div>
</template>

<script setup lang="ts">
import EditButton from '~/components/common/EditButton.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'

export interface TableColumn {
    key: string
    label: string
    align?: 'left' | 'center' | 'right'
    width?: string
    cellClass?: string
}

defineProps<{
    items: any[]
    total: number
    columns: TableColumn[]
}>()

defineEmits<{
    edit: [item: any]
    delete: [item: any]
}>()

const getValue = (item: any, key: string) => {
    return item[key] || '-'
}

const getItemKey = (item: any, index: number) => {
    return item.id || item.key || index
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
