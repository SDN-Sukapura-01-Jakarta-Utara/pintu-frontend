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
