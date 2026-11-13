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