export interface PengumumanItem {
  id: number
  judul: string
  tanggal: string
  deskripsi: string
  gambar: string
  penulis: string
}

export interface PublicPengumumanLatestResponse extends PengumumanItem {}

export interface PublicPengumumanResponse {
  data: PengumumanItem[]
}
