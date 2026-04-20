<template>
  <Transition name="modal-backdrop">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" @click.self="closeModal">
      <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden animate-modal-in relative">
        <!-- Decorative gradient background -->
        <div class="absolute top-0 left-0 right-0 h-48 bg-gradient-to-br from-red-500 via-red-600 to-red-700 opacity-10"></div>
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-yellow-400/20 to-transparent rounded-full blur-3xl"></div>
        
        <!-- Header -->
        <div class="relative bg-gradient-to-r from-red-600 via-red-700 to-red-800 px-6 py-6 overflow-hidden">
          <!-- Decorative circles -->
          <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div class="relative flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
                <i class="fas fa-users text-white text-xl"></i>
              </div>
              <div>
                <h3 class="text-xl font-bold text-white mb-1 tracking-tight">Anggota Tim</h3>
                <p class="text-sm text-yellow-300 font-medium">{{ teamName }}</p>
              </div>
            </div>
            <button @click="closeModal" class="w-10 h-10 rounded-xl hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:rotate-90 group cursor-pointer">
              <i class="fas fa-times text-white text-lg group-hover:scale-110 transition-transform"></i>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="relative p-6 overflow-y-auto max-h-[calc(85vh-180px)] custom-scrollbar">
          <div v-if="members && members.length > 0" class="space-y-3">
            <div 
              v-for="(member, index) in members" 
              :key="index" 
              class="group flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-white hover:from-red-50 hover:to-red-50/50 transition-all duration-300 border border-gray-100 hover:border-red-200 hover:shadow-md cursor-default member-card"
              :style="{ animationDelay: `${index * 50}ms` }"
            >
              <div class="relative">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {{ index + 1 }}
                </div>
                <div class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                  <i class="fas fa-check text-white text-[8px]"></i>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-base font-semibold text-gray-900 group-hover:text-red-700 transition-colors truncate">
                  {{ typeof member === 'string' ? member : member.nama }}
                </p>
                <div v-if="typeof member === 'object' && (member.nis || member.rombel)" class="flex items-center gap-3 mt-1">
                  <div v-if="member.nis" class="flex items-center gap-1.5">
                    <i class="fas fa-id-card text-red-400 text-xs"></i>
                    <span class="text-xs text-gray-600 font-medium">{{ member.nis }}</span>
                  </div>
                  <div v-if="member.rombel" class="flex items-center gap-1.5">
                    <i class="fas fa-door-open text-blue-400 text-xs"></i>
                    <span class="text-xs text-gray-600 font-medium">{{ member.rombel }}</span>
                  </div>
                </div>
                <p v-else class="text-xs text-gray-500 mt-0.5">Anggota Tim</p>
              </div>
              <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <i class="fas fa-user-check text-red-500 text-lg"></i>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-12">
            <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <i class="fas fa-users text-gray-400 text-3xl"></i>
            </div>
            <p class="text-gray-500 font-medium">Tidak ada data anggota tim</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="relative px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200">
          <div class="flex items-center justify-center">
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <i class="fas fa-users text-red-500"></i>
              <span class="font-medium">{{ members.length }} Anggota</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Member {
  nama?: string
  nis?: string
  rombel?: string
}

interface Props {
  isOpen: boolean
  teamName: string
  members: (Member | string)[]
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-modal-in {
  animation: modal-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes member-slide-in {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.member-card {
  animation: member-slide-in 0.4s ease-out forwards;
  opacity: 0;
}

.modal-backdrop-enter-active {
  transition: all 0.3s ease-out;
}

.modal-backdrop-leave-active {
  transition: all 0.2s ease-in;
}

.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

.modal-backdrop-enter-from .animate-modal-in {
  transform: scale(0.9) translateY(20px);
}

.modal-backdrop-leave-to .animate-modal-in {
  transform: scale(0.95) translateY(10px);
}

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #dc2626, #b91c1c);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #b91c1c, #991b1b);
}
</style>
