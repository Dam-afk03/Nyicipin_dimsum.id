import { useState } from 'react'
import { Container, Nav, Row, Col } from 'react-bootstrap'
import { Siap, Frozen } from '../data/menu'
import { CFG } from '../config'
import type { itemKeranjang } from '../types'
import KartuSiap from './KartuSiap'
import KartuFrozen from './KartuFrozen'

interface Props { onTambah: (item: itemKeranjang) => void }

export default function MenuSection({ onTambah }: Props) {
  // tab aktif: 'siap' atau 'frz'
  const [tab, setTab] = useState('siap')

  return (
    <Container id="menu" className="py-5">
      <h2 className="judul-serif">Pilih bahagiamu.</h2>
      <Nav variant="pills" activeKey={tab} onSelect={k => setTab(k ?? 'siap')} className="my-3 gap-2">
        <Nav.Item><Nav.Link eventKey="siap" className="rounded-pill">Siap Makan (Dalam Kota)</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="frz" className="rounded-pill">Frozen Vacuum (Luar/Dalam Kota)</Nav.Link></Nav.Item>
      </Nav>
      <p className="small">
        {tab === 'siap'
          ? `Dimasak saat dipesan • Pre-order maksimal ${CFG.batasPesanan}.00 • Estimasi siap 30–45 menit, sesuai antrean`
          : 'Mentah & beku • Simpan di freezer • Goreng tanpa dicairkan dulu • Dikirim saat stok tersedia'}
      </p>
      <Row xs={2} md={3} className="g-4">
        {tab === 'siap'
          ? Siap.map(p => <Col key={p.id}><KartuSiap produk={p} onTambah={onTambah} /></Col>)
          : Frozen.map(p => <Col key={p.ukuran}><KartuFrozen produk={p} onTambah={onTambah} /></Col>)}
      </Row>
    </Container>
  )
}