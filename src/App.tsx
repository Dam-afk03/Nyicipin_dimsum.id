import {Siap, Frozen}  from './data/menu'
import {rupiah} from './lib/format'
import {buatPesan} from './lib/pesanan'
import type {itemKeranjang, Pesanan} from './types'


const contohKeranjang: itemKeranjang[] = [
  { kunci: 's|1|3|0', jenis: 'siap', nama: 'Dimsum Goreng Keju', isi: '3 pcs', saus: 'Chili oil', harga: 17000, jumlah: 2 },
]

const contohPesanan: Pesanan = {
  modeSiap: 'ambil', hari: 'Besok', jam: '18.00-18.30', modeFrozen: 'antar', nama: 'Adam', hp: '081234567890', alamat: '', catatan: '', id: '',
}
console.log(buatPesan(contohKeranjang, contohPesanan))

export default function App() {
  return (
    <div className="container py-5">
      <h1>dimcum-id</h1>
      <h2 className="mt-5">Menu Dimsum Siap Saji</h2>
      <ul>
        {Siap.map(p => (
          <li key={p.id}>
            {p.nama}, mulai {rupiah(p.harga[3])}</li>
        ))}
      </ul>
      <h2 className="h5 mt-4">Frozen</h2>
      <ul>
        {Frozen.map(f => (
          <li key={f.ukuran}>{f.nama}, {rupiah(f.harga)}</li>
        ))}
      </ul>
    </div>
  )
}