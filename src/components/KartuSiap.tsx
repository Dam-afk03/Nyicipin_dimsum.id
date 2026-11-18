import { useState } from 'react'
import { Card, Button, ButtonGroup, Form } from 'react-bootstrap'
import type { itemKeranjang, ProdukSiap, ukuran } from '../types'
import { rupiah } from '../lib/format'
import FotoSlot  from './FotoSlot'

const UKURAN: ukuran[] = [3, 6, 9]

interface Props {
  produk: ProdukSiap
  onTambah: (item: itemKeranjang) => void
}

export default function KartuSiap({ produk, onTambah }: Props) {
  // state: pilihan isi dan saus untuk kartu ini
  const [ukuran, setUkuran] = useState<ukuran>(3)
  const [saus, setSaus] = useState(0)

  const tambah = () =>
    onTambah({
      kunci: `s|${produk.id}|${ukuran}|${saus}`,
      jenis: 'siap',
      nama: produk.nama,
      isi: `${ukuran} pcs`,
      saus: produk.saus[saus],
      harga: produk.harga[ukuran],
      jumlah: 1,
    })

  return (
    <Card className="kartu-menu h-100 p-2">
      <FotoSlot nama={produk.foto} alt={produk.nama}><span className="lencana-menu">{produk.lencana}</span></FotoSlot>
      <Card.Body className="d-flex flex-column gap-2">
        <Card.Title>{produk.nama}</Card.Title>
        <div className="harga-menu">{rupiah(produk.harga[ukuran])}</div>
        <small>Pilih isi<span className="d-md-none"> (pcs)</span></small>
        <ButtonGroup size="sm">
          {UKURAN.map(u => (
            <Button key={u} variant={u === ukuran ? 'dark' : 'outline-dark'} onClick={() => setUkuran(u)}>
              {u}<span className="d-none d-md-inline"> pcs</span>
            </Button>
          ))}
        </ButtonGroup>
        <Form.Select size="sm" value={saus} onChange={e => setSaus(Number(e.target.value))} aria-label="Pilih saus">
          {produk.saus.map((s, i) => <option key={s} value={i}>{s}</option>)}
        </Form.Select>
        <Button size="sm" className="btn-merah rounded-pill mt-auto" onClick={tambah}>
          <span className="d-none d-md-inline">+ Tambah ke keranjang</span>
          <span className="d-md-none">+ Keranjang</span>
        </Button>
      </Card.Body>
    </Card>
  )
}