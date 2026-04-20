export interface GaleriKegiatanPublicItem {
    id: number
    judul: string
    tanggal: string
    foto_thumbnail: string
}

export interface GaleriKegiatanPublicResponse {
    data: GaleriKegiatanPublicItem[]
}
