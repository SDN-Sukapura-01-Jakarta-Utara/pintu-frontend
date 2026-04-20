export interface JamBukaItem {
    hari: string
    jam_buka: string
    jam_tutup: string
}

export interface KontakPublicData {
    id: number
    alamat: string
    telepon: string
    email: string
    jam_buka: JamBukaItem[]
    gmaps: string
    website: string
    youtube: string
    instagram: string
    tiktok: string
    facebook: string
    twitter: string
}

export interface KontakPublicResponse extends KontakPublicData {}
