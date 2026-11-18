export const FOTO = { hero: 'dims.png', tentang: 'tentang.png' }
export const urlFoto = (nama?: string) => (nama ? import.meta.env.BASE_URL + 'images/' + nama : '')
export const NAMA_TOKO = 'Nyicipin_Dimsum.ID'

export const CFG = {
    wa: (import.meta.env.VITE_WA_NUMBER as string | undefined) ?? '6281234567890',
    batasPesanan: 16,
    jamMulai: 10,
    jamSelesai: 20,
}

// info toko, isi sesuai tokomu
export const INFO = {
  instagram: 'nyicipin_dimsum.id',
  caraBayar: 'QRIS (semua e-wallet dan m-banking)',
}