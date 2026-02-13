<template>
    <div class="w-full">
        <!-- Table Container -->
        <div class="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table class="w-full">
                <!-- Table Header -->
                <thead>
                  <tr class="border-b border-gray-200 bg-red-600">
                                <th v-for="column in columns" :key="column.key" :style="{ width: column.width }"
                                    class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white">
                            {{ column.label }}
                        </th>
                    </tr>
                </thead>

                <!-- Table Body -->
                <tbody class="divide-y divide-gray-200">
                    <tr v-if="rows.length === 0" class="hover:bg-gray-50 transition-colors">
                        <td :colspan="columns.length" class="px-6 py-12 text-center text-gray-500">
                            <div class="flex flex-col items-center justify-center gap-2">
                                <svg class="h-12 w-12 text-gray-300" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p class="text-sm font-medium">Tidak ada data</p>
                            </div>
                        </td>
                    </tr>

                    <tr v-for="(row, rowIndex) in rows" :key="rowIndex"
                        class="hover:bg-gray-50 transition-colors duration-150">
                        <td v-for="column in columns" :key="`${rowIndex}-${column.key}`" class="px-6 py-4">
                            <!-- Render cell content -->
                            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key as keyof typeof row]">
                                <div v-if="column.type === 'image'" class="flex items-center justify-center">
                                    <img :src="row[column.key as keyof typeof row]" :alt="`Image ${rowIndex}`"
                                        class="h-16 w-24 rounded-lg object-cover shadow-sm" />
                                </div>
                                <div v-else-if="column.type === 'badge'" class="flex items-center">
                                    <span :class="[
                                        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                                        row[column.key as keyof typeof row] === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800',
                                    ]">
                                        {{ row[column.key as keyof typeof row] === 'active' ? '✓ Aktif' : '✗ Nonaktif'
                                        }}
                                    </span>
                                </div>
                                <div v-else class="text-sm text-gray-700">
                                    {{ row[column.key as keyof typeof row] }}
                                </div>
                            </slot>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination Info -->
        <div v-if="showPagination && total > 0" class="mt-4 flex items-center justify-between text-sm text-gray-600">
            <div>
                Menampilkan <span class="font-semibold text-gray-900">{{ offset + 1 }}</span> hingga
                <span class="font-semibold text-gray-900">{{ Math.min(offset + limit, total) }}</span>
                dari <span class="font-semibold text-gray-900">{{ total }}</span> data
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Column {
    key: string
    label: string
    width?: string
    type?: 'text' | 'image' | 'badge' | 'custom'
}

defineProps<{
    columns: Column[]
    rows: any[]
    limit?: number
    offset?: number
    total?: number
    showPagination?: boolean
}>()

defineEmits<{
    'row-action': [action: string, rowData: any]
}>()
</script>

<style scoped>
table {
    border-collapse: collapse;
}
</style>
