/**
 * Public Home Service
 * Handle API calls untuk halaman beranda publik (tanpa auth)
 */

import type { PublicJumbotronResponse, PublicTotalSiswaResponse, PublicTotalPendidikResponse, PublicTotalTendikResponse, PublicTotalRombelResponse, PublicTotalEkskulResponse } from '~/types/PublicHomeType'
import type { PublicPrestasiResponse } from '~/types/PrestasiType'
import type { PublicArtikelResponse } from '~/types/ArtikelType'
import type { PublicPengumumanLatestResponse, PublicPengumumanResponse } from '~/types/PengumumanType'
import type { GaleriKegiatanPublicResponse } from '~/types/GaleriKegiatanPublicType'
import type { KontakPublicResponse } from '~/types/KontakPublicType'

/**
 * Get public jumbotron data (no auth required)
 * @returns Public jumbotron data
 */
export async function getPublicJumbotron(): Promise<PublicJumbotronResponse> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-jumbotron`
  
  console.log('Fetching from URL:', url)
  
  try {
    const response = await $fetch<PublicJumbotronResponse>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('API Response:', response)
    return response
  } catch (error: any) {
    console.error('Error fetching public jumbotron:', error)
    console.error('Error details:', {
      status: error?.status,
      statusText: error?.statusText,
      data: error?.data,
      message: error?.message
    })
    throw error
  }
}

/**
 * Get total siswa data (no auth required)
 * @returns Total siswa data
 */
export async function getPublicTotalSiswa(): Promise<PublicTotalSiswaResponse> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-total-siswa`
  
  try {
    const response = await $fetch<PublicTotalSiswaResponse>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return response
  } catch (error: any) {
    console.error('Error fetching public total siswa:', error)
    throw error
  }
}

/**
 * Get total pendidik data (no auth required)
 * @returns Total pendidik data
 */
export async function getPublicTotalPendidik(): Promise<PublicTotalPendidikResponse> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-total-pendidik`
  
  try {
    const response = await $fetch<PublicTotalPendidikResponse>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return response
  } catch (error: any) {
    console.error('Error fetching public total pendidik:', error)
    throw error
  }
}

/**
 * Get total tendik data (no auth required)
 * @returns Total tendik data
 */
export async function getPublicTotalTendik(): Promise<PublicTotalTendikResponse> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-total-tendik`
  
  try {
    const response = await $fetch<PublicTotalTendikResponse>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return response
  } catch (error: any) {
    console.error('Error fetching public total tendik:', error)
    throw error
  }
}

/**
 * Get total rombel data (no auth required)
 * @returns Total rombel data
 */
export async function getPublicTotalRombel(): Promise<PublicTotalRombelResponse> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-total-rombel`
  
  try {
    const response = await $fetch<PublicTotalRombelResponse>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return response
  } catch (error: any) {
    console.error('Error fetching public total rombel:', error)
    throw error
  }
}

/**
 * Get total ekstrakurikuler data (no auth required)
 * @returns Total ekstrakurikuler data
 */
export async function getPublicTotalEkskul(): Promise<PublicTotalEkskulResponse> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-total-ekskul`
  
  try {
    const response = await $fetch<PublicTotalEkskulResponse>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return response
  } catch (error: any) {
    console.error('Error fetching public total ekskul:', error)
    throw error
  }
}

/**
 * Get data prestasi (no auth required)
 * @returns Data prestasi
 */
export async function getPublicDataPrestasi(): Promise<PublicPrestasiResponse> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-data-prestasi`
  
  try {
    const response = await $fetch<PublicPrestasiResponse>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return response
  } catch (error: any) {
    console.error('Error fetching public data prestasi:', error)
    throw error
  }
}

/**
 * Get data artikel (no auth required)
 * @returns Data artikel
 */
export async function getPublicDataArtikel(): Promise<PublicArtikelResponse> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-data-artikel`
  
  try {
    const response = await $fetch<PublicArtikelResponse>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return response
  } catch (error: any) {
    console.error('Error fetching public data artikel:', error)
    throw error
  }
}

/**
 * Get latest pengumuman (no auth required)
 * @returns Latest pengumuman data
 */
export async function getPublicPengumumanLatest(): Promise<PublicPengumumanLatestResponse> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-data-pengumuman-latest`
  
  try {
    const response = await $fetch<PublicPengumumanLatestResponse>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return response
  } catch (error: any) {
    console.error('Error fetching public pengumuman latest:', error)
    throw error
  }
}

/**
 * Get data pengumuman (no auth required)
 * @returns Data pengumuman
 */
export async function getPublicDataPengumuman(): Promise<PublicPengumumanResponse> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-data-pengumuman`
  
  try {
    const response = await $fetch<PublicPengumumanResponse>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return response
  } catch (error: any) {
    console.error('Error fetching public data pengumuman:', error)
    throw error
  }
}

/**
 * Get data galeri kegiatan (no auth required)
 * @returns Data galeri kegiatan
 */
export async function getPublicDataGaleriKegiatan(): Promise<GaleriKegiatanPublicResponse> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-data-galeri-kegiatan`
  
  try {
    const response = await $fetch<GaleriKegiatanPublicResponse>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return response
  } catch (error: any) {
    console.error('Error fetching public data galeri kegiatan:', error)
    throw error
  }
}

/**
 * Get data kontak (no auth required)
 * @returns Data kontak
 */
export async function getPublicDataKontak(): Promise<KontakPublicResponse> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-data-kontak`
  
  try {
    const response = await $fetch<KontakPublicResponse>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return response
  } catch (error: any) {
    console.error('Error fetching public data kontak:', error)
    throw error
  }
}

/**
 * Get data kutipan kepala sekolah (no auth required)
 * @returns Data kutipan kepsek
 */
export async function getPublicKutipanKepsek(): Promise<any> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-data-kutipan-kepsek`
  
  console.log('Fetching kutipan kepsek from URL:', url)
  
  try {
    const response = await $fetch<any>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('Kutipan kepsek API Response:', response)
    return response
  } catch (error: any) {
    console.error('Error fetching public kutipan kepsek:', error)
    console.error('Error details:', {
      status: error?.status,
      statusText: error?.statusText,
      data: error?.data,
      message: error?.message
    })
    throw error
  }
}

/**
 * Get data visi misi (no auth required)
 * @returns Data visi misi
 */
export async function getPublicVisiMisi(): Promise<any> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-data-visi-misi`
  
  console.log('Fetching visi misi from URL:', url)
  
  try {
    const response = await $fetch<any>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('Visi misi API Response:', response)
    return response
  } catch (error: any) {
    console.error('Error fetching public visi misi:', error)
    console.error('Error details:', {
      status: error?.status,
      statusText: error?.statusText,
      data: error?.data,
      message: error?.message
    })
    throw error
  }
}

/**
 * Get data sarana prasarana (no auth required)
 * @returns Data sarpras
 */
export async function getPublicSarpras(): Promise<any> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-data-sarpras`
  
  console.log('Fetching sarpras from URL:', url)
  
  try {
    const response = await $fetch<any>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('Sarpras API Response:', response)
    return response
  } catch (error: any) {
    console.error('Error fetching public sarpras:', error)
    console.error('Error details:', {
      status: error?.status,
      statusText: error?.statusText,
      data: error?.data,
      message: error?.message
    })
    throw error
  }
}

/**
 * Get data struktur organisasi (no auth required)
 * @returns Data struktur organisasi
 */
export async function getPublicStrukturOrganisasi(): Promise<any> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-data-struktur-organisasi`
  
  console.log('Fetching struktur organisasi from URL:', url)
  
  try {
    const response = await $fetch<any>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('Struktur organisasi API Response:', response)
    return response
  } catch (error: any) {
    console.error('Error fetching public struktur organisasi:', error)
    console.error('Error details:', {
      status: error?.status,
      statusText: error?.statusText,
      data: error?.data,
      message: error?.message
    })
    throw error
  }
}

/**
 * Get data pendidik (no auth required)
 * @returns Data pendidik
 */
export async function getPublicDataPendidik(): Promise<any> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-data-pendidik`
  
  console.log('Fetching pendidik from URL:', url)
  
  try {
    const response = await $fetch<any>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('Pendidik API Response:', response)
    return response
  } catch (error: any) {
    console.error('Error fetching public data pendidik:', error)
    console.error('Error details:', {
      status: error?.status,
      statusText: error?.statusText,
      data: error?.data,
      message: error?.message
    })
    throw error
  }
}

/**
 * Get data tenaga kependidikan (no auth required)
 * @returns Data tendik
 */
export async function getPublicDataTendik(): Promise<any> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-data-tendik`
  
  console.log('Fetching tendik from URL:', url)
  
  try {
    const response = await $fetch<any>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('Tendik API Response:', response)
    return response
  } catch (error: any) {
    console.error('Error fetching public data tendik:', error)
    console.error('Error details:', {
      status: error?.status,
      statusText: error?.statusText,
      data: error?.data,
      message: error?.message
    })
    throw error
  }
}

/**
 * Get daftar artikel with filters (no auth required)
 * @param filter - Filter object with kategori and sort
 * @param offset - Offset for pagination
 * @returns Daftar artikel data
 */
export async function getPublicDaftarArtikel(filter: any, offset: number = 0): Promise<any> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-data-daftar-artikel`
  
  console.log('Fetching daftar artikel from URL:', url)
  
  try {
    const response = await $fetch<any>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        filter,
        offset
      }
    })

    console.log('Daftar artikel API Response:', response)
    return response
  } catch (error: any) {
    console.error('Error fetching public daftar artikel:', error)
    console.error('Error details:', {
      status: error?.status,
      statusText: error?.statusText,
      data: error?.data,
      message: error?.message
    })
    throw error
  }
}

/**
 * Get detail artikel by ID (no auth required)
 * @param id - Artikel ID
 * @returns Detail artikel data
 */
export async function getPublicDetailArtikel(id: number | string): Promise<any> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-data-detail-artikel`
  
  console.log('Fetching detail artikel from URL:', url, 'with ID:', id)
  
  try {
    const response = await $fetch<any>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        id: Number(id)
      }
    })

    console.log('Detail artikel API Response:', response)
    return response
  } catch (error: any) {
    console.error('Error fetching public detail artikel:', error)
    console.error('Error details:', {
      status: error?.status,
      statusText: error?.statusText,
      data: error?.data,
      message: error?.message
    })
    throw error
  }
}

/**
 * Get artikel lainnya (other articles) by ID (no auth required)
 * @param id - Current artikel ID to exclude
 * @returns Other artikel data
 */
export async function getPublicArtikelLainnya(id: number | string): Promise<any> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-data-artikel-lainnya`
  
  console.log('Fetching artikel lainnya from URL:', url, 'with ID:', id)
  
  try {
    const response = await $fetch<any>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        id: Number(id)
      }
    })

    console.log('Artikel lainnya API Response:', response)
    return response
  } catch (error: any) {
    console.error('Error fetching public artikel lainnya:', error)
    console.error('Error details:', {
      status: error?.status,
      statusText: error?.statusText,
      data: error?.data,
      message: error?.message
    })
    throw error
  }
}

/**
 * Get daftar pengumuman with filters (no auth required)
 * @param filter - Filter object with sort
 * @param offset - Offset for pagination
 * @returns Daftar pengumuman data
 */
export async function getPublicDaftarPengumuman(filter: any, offset: number = 0): Promise<any> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-data-daftar-pengumuman`
  
  console.log('Fetching daftar pengumuman from URL:', url)
  
  try {
    const response = await $fetch<any>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        filter,
        offset
      }
    })

    console.log('Daftar pengumuman API Response:', response)
    return response
  } catch (error: any) {
    console.error('Error fetching public daftar pengumuman:', error)
    console.error('Error details:', {
      status: error?.status,
      statusText: error?.statusText,
      data: error?.data,
      message: error?.message
    })
    throw error
  }
}

/**
 * Get detail pengumuman by ID (no auth required)
 * @param id - Pengumuman ID
 * @returns Detail pengumuman data
 */
export async function getPublicDetailPengumuman(id: number | string): Promise<any> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-data-detail-pengumuman`
  
  console.log('Fetching detail pengumuman from URL:', url, 'with ID:', id)
  
  try {
    const response = await $fetch<any>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        id: Number(id)
      }
    })

    console.log('Detail pengumuman API Response:', response)
    return response
  } catch (error: any) {
    console.error('Error fetching public detail pengumuman:', error)
    console.error('Error details:', {
      status: error?.status,
      statusText: error?.statusText,
      data: error?.data,
      message: error?.message
    })
    throw error
  }
}

/**
 * Get pengumuman lainnya (other announcements) by ID (no auth required)
 * @param id - Current pengumuman ID to exclude
 * @returns Other pengumuman data
 */
export async function getPublicPengumumanLainnya(id: number | string): Promise<any> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-data-pengumuman-lainnya`
  
  console.log('Fetching pengumuman lainnya from URL:', url, 'with ID:', id)
  
  try {
    const response = await $fetch<any>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        id: Number(id)
      }
    })

    console.log('Pengumuman lainnya API Response:', response)
    return response
  } catch (error: any) {
    console.error('Error fetching public pengumuman lainnya:', error)
    console.error('Error details:', {
      status: error?.status,
      statusText: error?.statusText,
      data: error?.data,
      message: error?.message
    })
    throw error
  }
}

/**
 * Get daftar galeri kegiatan with filters (no auth required)
 * @param filter - Filter object with sort
 * @param offset - Offset for pagination
 * @returns Daftar galeri kegiatan data
 */
export async function getPublicDaftarGaleri(filter: any, offset: number = 0): Promise<any> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-data-daftar-galeri`
  
  console.log('Fetching daftar galeri from URL:', url)
  
  try {
    const response = await $fetch<any>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        filter,
        offset
      }
    })

    console.log('Daftar galeri API Response:', response)
    return response
  } catch (error: any) {
    console.error('Error fetching public daftar galeri:', error)
    console.error('Error details:', {
      status: error?.status,
      statusText: error?.statusText,
      data: error?.data,
      message: error?.message
    })
    throw error
  }
}

/**
 * Get detail galeri kegiatan by ID (no auth required)
 * @param id - Galeri ID
 * @returns Detail galeri data
 */
export async function getPublicDetailGaleri(id: number | string): Promise<any> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-data-detail-galeri`
  
  console.log('Fetching detail galeri from URL:', url, 'with ID:', id)
  
  try {
    const response = await $fetch<any>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        id: Number(id)
      }
    })

    console.log('Detail galeri API Response:', response)
    return response
  } catch (error: any) {
    console.error('Error fetching public detail galeri:', error)
    console.error('Error details:', {
      status: error?.status,
      statusText: error?.statusText,
      data: error?.data,
      message: error?.message
    })
    throw error
  }
}

/**
 * Get galeri lainnya (other galleries) by ID (no auth required)
 * @param id - Current galeri ID to exclude
 * @returns Other galeri data
 */
export async function getPublicGaleriLainnya(id: number | string): Promise<any> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-data-galeri-lainnya`
  
  console.log('Fetching galeri lainnya from URL:', url, 'with ID:', id)
  
  try {
    const response = await $fetch<any>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        id: Number(id)
      }
    })

    console.log('Galeri lainnya API Response:', response)
    return response
  } catch (error: any) {
    console.error('Error fetching public galeri lainnya:', error)
    console.error('Error details:', {
      status: error?.status,
      statusText: error?.statusText,
      data: error?.data,
      message: error?.message
    })
    throw error
  }
}

/**
 * Get public daftar prestasi (no auth required)
 * @param filter - Filter object with sort
 * @param offset - Offset for pagination
 * @returns Prestasi list data
 */
export async function getPublicDaftarPrestasi(filter: any, offset: number = 0): Promise<any> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-data-daftar-prestasi`
  
  console.log('Fetching public daftar prestasi from URL:', url, 'with filter:', filter, 'offset:', offset)
  
  try {
    const response = await $fetch<any>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        filter,
        offset
      }
    })

    console.log('Public daftar prestasi API Response:', response)
    return response
  } catch (error: any) {
    console.error('Error fetching public daftar prestasi:', error)
    console.error('Error details:', {
      status: error?.status,
      statusText: error?.statusText,
      data: error?.data,
      message: error?.message
    })
    throw error
  }
}

/**
 * Get public detail prestasi (no auth required)
 * @param id - Prestasi ID
 * @returns Prestasi detail data
 */
export async function getPublicDetailPrestasi(id: number | string): Promise<any> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-data-detail-prestasi`
  
  console.log('Fetching public detail prestasi from URL:', url, 'with ID:', id)
  
  try {
    const response = await $fetch<any>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        id: Number(id)
      }
    })

    console.log('Public detail prestasi API Response:', response)
    return response
  } catch (error: any) {
    console.error('Error fetching public detail prestasi:', error)
    console.error('Error details:', {
      status: error?.status,
      statusText: error?.statusText,
      data: error?.data,
      message: error?.message
    })
    throw error
  }
}


/**
 * Get public aplikasi sekolah data
 * @returns Aplikasi sekolah data
 */
export async function getPublicAplikasiSekolah(): Promise<any> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-data-aplikasi-sekolah`
  
  try {
    const response = await $fetch(url, {
      method: 'POST',
      body: {
        filter: {
          show_in_jumbotron: null
        }
      }
    })
    return response
  } catch (error) {
    console.error('Error fetching public aplikasi sekolah:', error)
    throw error
  }
}


/**
 * Get public aplikasi sekolah jumbotron data
 * @returns Aplikasi sekolah jumbotron data
 */
export async function getPublicAplikasiJumbotron(): Promise<any> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/public/get-data-aplikasi-sekolah`
  
  try {
    const response = await $fetch(url, {
      method: 'POST',
      body: {
        filter: {
          show_in_jumbotron: true
        }
      }
    })
    return response
  } catch (error) {
    console.error('Error fetching public aplikasi jumbotron:', error)
    throw error
  }
}
