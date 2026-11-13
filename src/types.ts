import type { ModuleNamespace } from "vite/types/hot.js"

export type jenis ='siap' | 'frz'
export type ukuran = 3 | 6 | 9

export interface ProdukSiap{
    id: string
    nama: string
    lencana: string
    saus: string[]
    harga: Record<ukuran, number>
}

export interface ProdukFrozen{
    ukuran: ukuran
    nama : string
    harga: number
    lencana?: string
}

export interface itemKeranjang{
    kunci: string
    jenis: jenis
    nama: string
    isi: string
    saus: string
    harga: number
    jumlah: number
}

export type Mode = 'antar' | 'ambil'

export interface Pesanan{
    modeSiap: Mode
    hari: string
    jam: string
    modeFrozen: Mode
    nama: string
    hp: string
    alamat: string
    catatan: string
    id: string
}