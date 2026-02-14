<template>
  <div class="overflow-x-hidden">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- Toast Container (from Store) -->
    <Teleport to="body">
      <div class="fixed top-6 right-4 lg:right-8 z-50 w-full max-w-xs lg:max-w-sm px-4 lg:px-0 space-y-3 pointer-events-none">
        <Transition
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="-translate-y-full opacity-0 translate-x-full"
          enter-to-class="translate-y-0 opacity-100 translate-x-0"
          leave-active-class="transition duration-300 ease-in"
          leave-from-class="translate-y-0 opacity-100 translate-x-0"
          leave-to-class="-translate-y-full opacity-0 translate-x-full"
        >
          <div
            :class="[
              'rounded-xl px-4 py-3 sm:px-5 sm:py-4 shadow-xl flex items-start gap-3 pointer-events-auto',
              toast.type === 'success'
                ? 'bg-green-50 border-2 border-green-200'
                : 'bg-red-50 border-2 border-red-200',
            ]"
          >
            <!-- Icon -->
            <div class="flex-shrink-0 pt-0.5" :class="toast.type === 'success' ? 'text-green-600' : 'text-red-600'">
              <svg
                v-if="toast.type === 'success'"
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <p
                :class="[
                  'font-semibold text-sm sm:text-base',
                  toast.type === 'success' ? 'text-green-900' : 'text-red-900',
                ]"
              >
                {{ toast.title }}
              </p>
              <p
                v-if="toast.message"
                :class="[
                  'text-xs sm:text-sm mt-1 line-clamp-2',
                  toast.type === 'success' ? 'text-green-700' : 'text-red-700',
                ]"
              >
                {{ toast.message }}
              </p>
            </div>

            <!-- Close Button -->
            <button
              @click="toastStore.removeToast(toast.id)"
              class="flex-shrink-0 ml-2 transition-colors cursor-pointer"
              :class="[
                toast.type === 'success'
                  ? 'text-green-600 hover:text-green-900'
                  : 'text-red-600 hover:text-red-900',
              ]"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </Transition>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from '~/stores/ToastStore'

const toastStore = useToastStore()
</script>