export interface ArtikelItem {
  id: number
  judul: string
  tanggal: string
  kategori: string
  deskripsi: string
  gambar: string
  penulis: string
}

export interface PublicArtikelResponse {
  data: ArtikelItem[]
}
