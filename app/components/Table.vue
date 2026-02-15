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
                             {{ (currentPage - 1) * currentLimit + index + 1 }}
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

        <!-- Pagination Controls -->
        <div class="border-t border-gray-200 bg-white px-4 sm:px-6 py-4">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                <!-- Items Per Page -->
                <div class="flex items-center gap-3">
                    <label class="text-xs sm:text-sm text-gray-600 font-medium">Items per page:</label>
                    <select v-model.number="currentLimit" @change="onLimitChange"
                        class="px-3 py-1.5 border-2 border-gray-300 rounded-lg text-xs sm:text-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 cursor-pointer">
                        <option :value="10">10</option>
                        <option :value="25">25</option>
                        <option :value="50">50</option>
                        <option :value="100">100</option>
                    </select>
                </div>

                <!-- Pagination Info -->
                <div class="text-xs sm:text-sm text-gray-600">
                    <span class="font-semibold text-gray-900">{{ startItem }}-{{ endItem }}</span>
                    of
                    <span class="font-semibold text-gray-900">{{ total }}</span>
                </div>

                <!-- Pagination Buttons -->
                <div class="flex items-center gap-1.5">
                    <!-- First Page -->
                    <button @click="goToFirstPage" :disabled="currentPage === 1 || isLoading"
                        class="p-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        title="First page">
                        <i class="fa-solid fa-chevron-left w-4 h-4 flex items-center justify-center"></i>
                        <i class="fa-solid fa-chevron-left w-4 h-4 -ml-2 flex items-center justify-center"></i>
                    </button>

                    <!-- Previous Page -->
                    <button @click="previousPage" :disabled="currentPage === 1 || isLoading"
                        class="p-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        title="Previous page">
                        <i class="fa-solid fa-chevron-left w-4 h-4"></i>
                    </button>

                    <!-- Next Page -->
                    <button @click="nextPage" :disabled="currentPage >= totalPages || isLoading"
                        class="p-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        title="Next page">
                        <i class="fa-solid fa-chevron-right w-4 h-4"></i>
                    </button>

                    <!-- Last Page -->
                    <button @click="goToLastPage" :disabled="currentPage >= totalPages || isLoading"
                        class="p-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        title="Last page">
                        <i class="fa-solid fa-chevron-right w-4 h-4 flex items-center justify-center"></i>
                        <i class="fa-solid fa-chevron-right w-4 h-4 -ml-2 flex items-center justify-center"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import EditButton from '~/components/common/EditButton.vue'
import DeleteButton from '~/components/common/DeleteButton.vue'

export interface TableColumn {
    key: string
    label: string
    align?: 'left' | 'center' | 'right'
    width?: string
    cellClass?: string
}

const props = defineProps<{
    items: any[]
    total: number
    columns: TableColumn[]
    currentPage?: number
    currentLimit?: number
    isLoading?: boolean
}>()

const emit = defineEmits<{
    edit: [item: any]
    delete: [item: any]
    pageChange: [page: number]
    limitChange: [limit: number]
}>()

// Pagination state
const currentPage = ref(props.currentPage || 1)
const currentLimit = ref(props.currentLimit || 10)

// Computed
const totalPages = computed(() => Math.ceil(props.total / currentLimit.value))

const startItem = computed(() => {
    if (props.total === 0) return 0
    return (currentPage.value - 1) * currentLimit.value + 1
})

const endItem = computed(() => {
    const end = currentPage.value * currentLimit.value
    return end > props.total ? props.total : end
})

// Methods
const goToFirstPage = () => {
    currentPage.value = 1
    emit('pageChange', 1)
}

const previousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
        emit('pageChange', currentPage.value)
    }
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
        emit('pageChange', currentPage.value)
    }
}

const goToLastPage = () => {
    currentPage.value = totalPages.value
    emit('pageChange', totalPages.value)
}

const onLimitChange = () => {
    currentPage.value = 1 // Reset to first page when limit changes
    emit('limitChange', currentLimit.value)
}

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
