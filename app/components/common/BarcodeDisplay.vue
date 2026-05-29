<template>
    <div v-if="value" class="flex flex-col items-center gap-1">
        <canvas :ref="el => setCanvasRef(el)" class="max-w-full h-auto"></canvas>
        <span v-if="showText" class="text-[10px] sm:text-xs text-gray-600 font-mono">{{ value }}</span>
    </div>
    <span v-else class="text-xs text-gray-400 italic">{{ emptyText }}</span>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import QRCode from 'qrcode'

interface Props {
    value?: string
    size?: number
    showText?: boolean
    emptyText?: string
}

const props = withDefaults(defineProps<Props>(), {
    value: '',
    size: 80,
    showText: true,
    emptyText: 'Belum di-generate'
})

const canvasElement = ref<HTMLCanvasElement | null>(null)

const setCanvasRef = (el: any) => {
    if (el) {
        canvasElement.value = el as HTMLCanvasElement
        generateQRCode()
    }
}

const generateQRCode = async () => {
    if (!canvasElement.value || !props.value) return

    try {
        await QRCode.toCanvas(canvasElement.value, props.value, {
            width: props.size,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        })
    } catch (err) {
        console.error('Error generating QR code:', err)
    }
}

// Watch for value changes
watch(() => props.value, () => {
    generateQRCode()
})

watch(() => props.size, () => {
    generateQRCode()
})

onMounted(() => {
    generateQRCode()
})
</script>
