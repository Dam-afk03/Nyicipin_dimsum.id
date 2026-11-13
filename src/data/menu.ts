import type {ProdukSiap, ProdukFrozen} from '../types'

export const Siap: ProdukSiap[] = [
    {id: '1', nama: 'Dimsum Goreng Keju', lencana: 'Keju Lumer', saus: ['Chili oil', 'Saus'], harga: {3: 17000, 6: 15000, 9: 20000}}
]

export const Frozen: ProdukFrozen[] = [
    {ukuran: 3, nama: 'Dimsum Goreng Keju', harga: 17000, lencana: 'Keju Lumer'},
    {ukuran: 6, nama: 'Dimsum Goreng Keju', harga: 15000, lencana: 'Keju Lumer'},
    {ukuran: 9, nama: 'Dimsum Goreng Keju', harga: 20000, lencana: 'Keju Lumer'}
]