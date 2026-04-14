/**
 * Public Home Page types
 */

export interface PublicJumbotronData {
  file: string
  status: 'active' | 'inactive'
}

export interface PublicJumbotronResponse {
  data: PublicJumbotronData[]
}

export interface PublicTotalSiswaData {
  total_siswa: number
}

export interface PublicTotalSiswaResponse {
  data: PublicTotalSiswaData
}

export interface PublicTotalPendidikData {
  total_pendidik: number
}

export interface PublicTotalPendidikResponse {
  data: PublicTotalPendidikData
}

export interface PublicTotalTendikData {
  total_tendik: number
}

export interface PublicTotalTendikResponse {
  data: PublicTotalTendikData
}
