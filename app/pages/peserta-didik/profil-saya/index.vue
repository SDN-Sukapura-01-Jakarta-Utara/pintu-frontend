<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <!-- Sidebar -->
    <StudentSidebar
      :is-open="isSidebarOpen"
      :is-loading="isLoggingOut"
      @close="isSidebarOpen = false"
      @logout="handleLogout"
    />

    <!-- Main Content -->
    <div :class="[
      'flex-1 flex flex-col transition-all duration-300 overflow-hidden',
      'md:ml-20',
      isSidebarOpen ? 'md:ml-72' : 'md:ml-20'
    ]">
      <!-- Navbar -->
      <StudentNavbar
        :student="student"
        :is-loading="isLoggingOut"
        page-title="Profil Saya"
        @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
        @logout="handleLogout"
      />

      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto overflow-x-hidden w-full">
        <div class="p-6 w-full max-w-full">
          <!-- Header -->
          <div class="mb-6">
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Profil Saya</h1>
            <p class="text-sm sm:text-base text-gray-600 mt-1">Informasi profil dan data pribadi Anda</p>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="flex justify-center items-center py-20">
            <div class="text-center">
              <div class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600 mb-4"></div>
              <p class="text-gray-600 font-medium">Memuat profil...</p>
            </div>
          </div>

          <!-- Profile Content -->
          <div v-else-if="studentDetail" class="space-y-6">
            <!-- Profile Header Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <!-- Header Background -->
              <div class="h-32 sm:h-40 bg-gradient-to-r from-red-600 via-red-500 to-pink-600 relative">
                <div class="absolute inset-0 bg-black/10"></div>
                <!-- Action Buttons - Top Right -->
                <div class="absolute top-4 right-4 flex flex-wrap gap-2 z-20">
                  <button v-if="!isEditMode && hasPermission('UPDATE_PROFILE_PESERTA_DIDIK')" @click="startEdit" 
                    class="inline-flex items-center gap-2 px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition font-semibold text-sm shadow-md cursor-pointer">
                    <i class="fa-solid fa-edit"></i>
                    <span class="hidden sm:inline">Edit Profil</span>
                  </button>
                  <button v-if="isEditMode" @click="saveProfile" :disabled="isSaving"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition font-semibold text-sm shadow-md disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
                    <i v-if="isSaving" class="fa-solid fa-spinner fa-spin"></i>
                    <i v-else class="fa-solid fa-save"></i>
                    <span class="hidden sm:inline">{{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}</span>
                  </button>
                  <button v-if="isEditMode" @click="cancelEdit" :disabled="isSaving"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition font-semibold text-sm shadow-md disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
                    <i class="fa-solid fa-times"></i>
                    <span class="hidden sm:inline">Batal</span>
                  </button>
                </div>
              </div>
              
              <!-- Profile Info -->
              <div class="px-6 sm:px-8 pb-6">
                <!-- Avatar & Name Section -->
                <div class="flex flex-col sm:flex-row items-center sm:items-center gap-6 -mt-20 sm:-mt-24 relative z-10">
                  <!-- Avatar -->
                  <div class="relative flex-shrink-0">
                    <div class="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl shadow-xl overflow-hidden border-4 border-white bg-gradient-to-br from-red-400 to-red-600">
                      <img
                        v-if="photoPreview || studentDetail.photo"
                        :src="photoPreview || studentDetail.photo"
                        :alt="studentDetail.nama"
                        class="w-full h-full object-cover"
                      />
                      <div v-else class="w-full h-full flex items-center justify-center">
                        <i class="fa-solid fa-user-graduate text-white text-5xl sm:text-6xl"></i>
                      </div>
                    </div>
                    <!-- Upload Foto Button -->
                    <label v-if="isEditMode" 
                      class="absolute bottom-2 right-2 w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center cursor-pointer hover:bg-blue-700 transition shadow-lg hover:scale-105">
                      <i class="fa-solid fa-camera text-white text-sm sm:text-base"></i>
                      <input type="file" accept="image/*" @change="handlePhotoChange" class="hidden" />
                    </label>
                  </div>
                  
                  <!-- Name & Info Container -->
                  <div class="flex-1 w-full">
                    <div class="bg-white rounded-xl p-5 shadow-lg border border-gray-200">
                      <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{{ studentDetail.nama }}</h2>
                      <p class="text-base sm:text-lg text-gray-600 mb-4">Peserta Didik SDN Sukapura 01</p>
                      <div class="flex flex-wrap gap-2">
                        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-800 rounded-lg text-xs font-semibold">
                          <i class="fa-solid fa-graduation-cap"></i>
                          {{ studentDetail.nis }}
                        </span>
                        <span :class="[
                          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold',
                          studentDetail.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        ]">
                          <span :class="['w-2 h-2 rounded-full', studentDetail.status === 'active' ? 'bg-green-600' : 'bg-gray-600']"></span>
                          {{ studentDetail.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Divider -->
                <div class="my-6 border-t border-gray-200"></div>

                <!-- Data Pribadi -->
                <div class="mb-6">
                  <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <i class="fa-solid fa-user text-red-600"></i>
                    Data Pribadi
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                        <i class="fa-solid fa-user text-red-600"></i>
                        Nama Lengkap
                      </label>
                      <p class="text-gray-900 font-semibold">{{ studentDetail.nama }}</p>
                    </div>

                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                        <i class="fa-solid fa-id-badge text-red-600"></i>
                        NIK
                      </label>
                      <p class="text-gray-900 font-semibold">{{ studentDetail.nik || '-' }}</p>
                    </div>

                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                        <i class="fa-solid fa-id-card text-red-600"></i>
                        NIS
                      </label>
                      <p class="text-gray-900 font-semibold">{{ studentDetail.nis }}</p>
                    </div>

                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                        <i class="fa-solid fa-hashtag text-red-600"></i>
                        NISN
                      </label>
                      <p class="text-gray-900 font-semibold">{{ studentDetail.nisn }}</p>
                    </div>

                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                        <i class="fa-solid fa-venus-mars text-red-600"></i>
                        Jenis Kelamin
                      </label>
                      <p class="text-gray-900 font-semibold">{{ studentDetail.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}</p>
                    </div>

                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                        <i class="fa-solid fa-book-quran text-red-600"></i>
                        Agama
                      </label>
                      <p class="text-gray-900 font-semibold">{{ studentDetail.agama || '-' }}</p>
                    </div>

                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                        <i class="fa-solid fa-map-marker-alt text-red-600"></i>
                        Tempat Lahir
                      </label>
                      <p class="text-gray-900 font-semibold">{{ studentDetail.tempat_lahir }}</p>
                    </div>

                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                        <i class="fa-solid fa-calendar text-red-600"></i>
                        Tanggal Lahir
                      </label>
                      <p class="text-gray-900 font-semibold">{{ formatDate(studentDetail.tanggal_lahir) }}</p>
                    </div>
                  </div>
                </div>

                <!-- Alamat -->
                <div class="mb-6">
                  <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <i class="fa-solid fa-location-dot text-red-600"></i>
                    Alamat
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200 md:col-span-2">
                      <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                        <i class="fa-solid fa-home text-red-600"></i>
                        Alamat Lengkap
                      </label>
                      <p class="text-gray-900 font-semibold">{{ studentDetail.alamat || '-' }}</p>
                    </div>

                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                        <i class="fa-solid fa-map-pin text-red-600"></i>
                        RT / RW
                      </label>
                      <p class="text-gray-900 font-semibold">{{ studentDetail.rt || '-' }} / {{ studentDetail.rw || '-' }}</p>
                    </div>

                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                        <i class="fa-solid fa-building text-red-600"></i>
                        Kelurahan
                      </label>
                      <p class="text-gray-900 font-semibold">{{ studentDetail.kelurahan || '-' }}</p>
                    </div>

                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                        <i class="fa-solid fa-city text-red-600"></i>
                        Kecamatan
                      </label>
                      <p class="text-gray-900 font-semibold">{{ studentDetail.kecamatan || '-' }}</p>
                    </div>

                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                        <i class="fa-solid fa-mailbox text-red-600"></i>
                        Kode Pos
                      </label>
                      <p class="text-gray-900 font-semibold">{{ studentDetail.kode_pos || '-' }}</p>
                    </div>
                  </div>
                </div>

                <!-- Data Orang Tua -->
                <div class="mb-6">
                  <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <i class="fa-solid fa-users text-red-600"></i>
                    Data Orang Tua
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                        <i class="fa-solid fa-user-tie text-red-600"></i>
                        Nama Ayah
                      </label>
                      <p class="text-gray-900 font-semibold">{{ studentDetail.nama_ayah || '-' }}</p>
                    </div>

                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                        <i class="fa-solid fa-user-nurse text-red-600"></i>
                        Nama Ibu
                      </label>
                      <p class="text-gray-900 font-semibold">{{ studentDetail.nama_ibu || '-' }}</p>
                    </div>
                  </div>
                </div>

                <!-- Informasi Sistem -->
                <div>
                  <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <i class="fa-solid fa-info-circle text-red-600"></i>
                    Informasi Sistem
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                        <i class="fa-solid fa-clock text-red-600"></i>
                        Terdaftar Sejak
                      </label>
                      <p class="text-gray-900 font-semibold">{{ formatDate(studentDetail.created_at) }}</p>
                    </div>

                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <label class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                        <i class="fa-solid fa-rotate text-red-600"></i>
                        Terakhir Diperbarui
                      </label>
                      <p class="text-gray-900 font-semibold">{{ formatDate(studentDetail.updated_at) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { useToast } from '~/composables/useToast'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: false
})

useHead({
  title: 'Profil Saya | Portal Peserta Didik',
  link: [
    {
      rel: 'icon',
      type: 'image/jpeg',
      href: '/logo-sekolah.jpg'
    }
  ]
})

const router = useRouter()
const { success, error } = useToast()
const { hasPermission } = useAuth()
// Check if screen is md or larger
const isMd = useMediaQuery('(min-width: 768px)')

// Sidebar closed on mobile by default, open on desktop
const isSidebarOpen = ref(isMd.value)
const isLoggingOut = ref(false)
const isLoading = ref(true)
const isEditMode = ref(false)
const isSaving = ref(false)
const student = ref<any>(null)
const studentDetail = ref<any>(null)
const photoPreview = ref<string | null>(null)
const photoFile = ref<File | null>(null)

const loadProfile = async () => {
  const studentData = localStorage.getItem('student_user')
  const token = localStorage.getItem('student_token')
  
  if (studentData && token) {
    student.value = JSON.parse(studentData)
    
    // Fetch full student detail from API
    try {
      const config = useRuntimeConfig()
      const response: any = await $fetch(
        `${config.public.apiBase}/api/v1/peserta-didik/get-peserta-didik-by-id`,
        {
          method: 'POST',
          body: { id: student.value.id },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include',
        }
      )
      studentDetail.value = response.data
    } catch (err: any) {
      console.error('Error fetching student detail:', err)
      
      // Check if it's a 401 error (invalid or expired token)
      if (err.status === 401 || err.statusCode === 401 || 
          (err.data && (err.data.error === 'invalid or expired token' || err.data.error?.includes('token')))) {
        error('Sesi Habis', 'Sesi login Anda telah habis. Silakan login kembali.')
        localStorage.removeItem('student_token')
        localStorage.removeItem('student_user')
        localStorage.removeItem('student_permissions')
        localStorage.removeItem('student_expires_at')
        await router.replace('/peserta-didik/login')
        return
      }
      
      studentDetail.value = student.value // Fallback to localStorage data
    } finally {
      isLoading.value = false
    }
  } else {
    router.replace('/peserta-didik/login')
  }
}

onMounted(() => {
  loadProfile()
})

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}

const startEdit = () => {
  isEditMode.value = true
}

const cancelEdit = () => {
  isEditMode.value = false
  photoPreview.value = null
  photoFile.value = null
}

const handlePhotoChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      error('Validasi Gagal', 'File harus berupa gambar')
      return
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      error('Validasi Gagal', 'Ukuran file maksimal 2MB')
      return
    }
    
    photoFile.value = file
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const saveProfile = async () => {
  if (!photoFile.value) {
    error('Validasi Gagal', 'Tidak ada perubahan untuk disimpan')
    return
  }
  
  isSaving.value = true
  console.log('Starting save profile...')
  
  try {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('student_token')
    const formData = new FormData()
    formData.append('id', student.value.id.toString())
    formData.append('photo', photoFile.value)
    
    console.log('Uploading photo...')
    const response: any = await $fetch(
      `${config.public.apiBase}/api/v1/peserta-didik/update-peserta-didik`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
      }
    )
    console.log('Photo uploaded:', response)
    
    // Fetch updated student detail to get fresh data
    console.log('Fetching updated profile...')
    const updatedResponse: any = await $fetch(
      `${config.public.apiBase}/api/v1/peserta-didik/get-peserta-didik-by-id`,
      {
        method: 'POST',
        body: { id: student.value.id },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
      }
    )
    console.log('Updated profile fetched:', updatedResponse)
    
    // Update student detail with fresh data (photo URL is already full URL)
    studentDetail.value = updatedResponse.data
    
    // Update localStorage
    const studentData = JSON.parse(localStorage.getItem('student_user') || '{}')
    studentData.photo = updatedResponse.data.photo
    localStorage.setItem('student_user', JSON.stringify(studentData))
    student.value = studentData
    
    console.log('Resetting edit mode...')
    // Reset edit mode and preview - MUST be done before showing toast
    isEditMode.value = false
    photoPreview.value = null
    photoFile.value = null
    
    console.log('Showing success toast...')
    // Show success toast after everything is complete
    success('Berhasil', 'Foto profil berhasil diperbarui')
    console.log('Save profile completed successfully')
  } catch (errorData: any) {
    console.error('Error updating profile:', errorData)
    
    // Check if it's a 401 error (invalid or expired token)
    if (errorData.status === 401 || errorData.statusCode === 401 || 
        (errorData.data && (errorData.data.error === 'invalid or expired token' || errorData.data.error?.includes('token')))) {
      error('Sesi Habis', 'Sesi login Anda telah habis. Silakan login kembali.')
      localStorage.removeItem('student_token')
      localStorage.removeItem('student_user')
      localStorage.removeItem('student_permissions')
      localStorage.removeItem('student_expires_at')
      await router.replace('/peserta-didik/login')
      return
    }
    
    error('Gagal', errorData.data?.message || 'Gagal memperbarui profil')
  } finally {
    isSaving.value = false
    console.log('isSaving set to false')
  }
}

const handleLogout = async () => {
  isLoggingOut.value = true
  
  try {
    localStorage.removeItem('student_token')
    localStorage.removeItem('student_user')
    localStorage.removeItem('student_permissions')
    localStorage.removeItem('student_expires_at')
    
    await router.replace('/peserta-didik/login')
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    isLoggingOut.value = false
  }
}
</script>
