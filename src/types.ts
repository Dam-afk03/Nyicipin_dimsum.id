
// foto: taruh file di folder public/img, lalu tulis namanya saja

export type jenis ='siap' | 'frz'
export type ukuran = 3 | 6 | 9

export interface ProdukSiap{
    id: string
    nama: string
    foto: string
    lencana: string
    saus: string[]
    harga: Record<ukuran, number>
}

export interface ProdukFrozen{
    ukuran: ukuran
    foto: string
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

export interface LangkahPesan {
  nomor: number;
  judul: string;
  deskripsi: string;
  ikon?: string; // Opsional: nama ikon atau path gambar
}

export interface Testimoni {
  id: string;
  namaBuyer: string;
  varianDipesan?: string; // Opsional: misal "Dimsum Mentai (M)"
  rating: number;         // Skala 1 - 5
  ulasan: string;
  foto?: string;          // URL hasil upload atau Data URL (Base64) untuk preview lokal
  tanggal: string;
}

export interface InfoKontak {
  whatsapp: string;
  instagram: string;
  alamat: string;
  jamBuka: string;
  linkMaps?: string;
}

// satu baris testimoni dari database
export interface DataTestimoni {
  id: number
  nama: string
  varian: string
  rating: number
  ulasan: string
  foto_url: string | null
  dibuat: string
}