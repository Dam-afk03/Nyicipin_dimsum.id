import {Siap, Frozen}  from './data/menu'
import {rupiah} from './lib/format'

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