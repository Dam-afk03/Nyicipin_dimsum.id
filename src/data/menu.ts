import type { ProdukSiap, ProdukFrozen } from '../types'

export const Siap: ProdukSiap[] = [
  {
    id: '1',
    nama: 'Dimsum Goreng Keju',
    foto: 'dims.png',
    lencana: 'Best Seller',
    saus: ['Chili Oil'],
    harga: { 3: 17000, 6: 34000, 9: 49000 },
  },
]

export const Frozen: ProdukFrozen[] = [
  { foto: 'dimsF.png', ukuran: 3, nama: 'Dimsum Goreng Keju (Frozen)', harga: 17000 },
  { foto: 'dimsF.png', ukuran: 6, nama: 'Dimsum Goreng Keju (Frozen)', harga: 34000 },
  { foto: 'dimsF.png', ukuran: 9, nama: 'Dimsum Goreng Keju (Frozen)', harga: 49000 },
]