export interface PrestasiIndividu {
  id: number
  jenis: 'Individu'
  nama_peserta_didik: string
  nama_prestasi: string
  tingkat_prestasi: string
  juara: string
  tanggal_lomba: string
  foto_thumbnail: string
}

export interface AnggotaTim {
  nama: string
  nis: string
  rombel: string
}

export interface PrestasiTim {
  id: number
  jenis: 'Tim'
  nama_grup: string
  anggota_tim: AnggotaTim[]
  nama_prestasi: string
  tingkat_prestasi: string
  juara: string
  tanggal_lomba: string
  foto_thumbnail: string
}

export type PrestasiItem = PrestasiIndividu | PrestasiTim

export interface PublicPrestasiResponse {
  data: PrestasiItem[]
}
