import { useState } from 'react'
import { Card, Button } from 'react-bootstrap'
import type { itemKeranjang, ProdukFrozen } from '../types'
import { rupiah } from '../lib/format'
import FotoSlot from './FotoSlot'

interface Props {
  produk: ProdukFrozen
  onTambah: (item: itemKeranjang) => void
}

export default function KartuFrozen({ produk, onTambah }: Props) {
  const [jumlah, setJumlah] = useState(0)

  const tambah = () => {
    if (jumlah === 0) return
    onTambah({
      kunci: `f|${produk.ukuran}`,
      jenis: 'frz',
      nama: produk.nama,
      isi: `${produk.ukuran} pcs/pack`,
      saus: '',
      harga: produk.harga,
      jumlah,
    })
    setJumlah(0)
  }

  return (
    <Card className="kartu-menu h-100 p-2">
      <FotoSlot nama={produk.foto} alt={produk.nama} frozen>
  {produk.lencana && <span className="lencana-menu">{produk.lencana}</span>}
</FotoSlot>
      <Card.Body className="d-flex flex-column gap-2">
        <Card.Title>{produk.nama}</Card.Title>
        <small>{produk.ukuran} pcs / pack • Mentah &amp; beku</small>
        <div className="harga-menu">{rupiah(produk.harga)}</div>
        <div className="mt-auto d-flex flex-column flex-md-row gap-2">
          <div className="d-flex align-items-center justify-content-between gap-2">
            <Button size="sm" variant="light" aria-label="Kurangi" onClick={() => setJumlah(j => Math.max(0, j - 1))}>−</Button>
            <strong>{jumlah}</strong>
            <Button size="sm" variant="light" aria-label="Tambah" onClick={() => setJumlah(j => j + 1)}>+</Button>
          </div>
          <Button size="sm" className="btn-merah rounded-pill flex-grow-1" onClick={tambah}>Tambah pack</Button>
        </div>
      </Card.Body>
    </Card>
  )
}