import { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap'
import type { itemKeranjang, Mode, Pesanan } from '../types'
import { CFG } from '../config'
import { rupiah } from '../lib/format'
import { buatPesan, cekPesanan, itemJenis, perluAlamat, pilihanHari, slotJam, subtotal } from '../lib/pesanan'
import BarisItem from './BarisItem'
import { NAMA_TOKO, urlFoto } from '../config'


interface Props {
  keranjang: itemKeranjang[]
  ubah: (kunci: string, selisih: number) => void
  kosongkan?: () => void
  pesanan: Pesanan
  setPesanan: (p: Pesanan) => void
  onKirim: (p: Pesanan, namaFileBukti?: string) => void
  onKembali: () => void
}

function PilihMode({ nilai, onPilih }: { nilai: Mode; onPilih: (m: Mode) => void }) {
  return (
    <div className="d-flex gap-2 my-2">
      <Button
        size="sm"
        className={`rounded-pill px-3 fw-semibold ${nilai === 'antar' ? 'btn-hijau' : 'btn-outline-secondary bg-white text-dark border'}`}
        onClick={() => onPilih('antar')}
      >
        🛵 Antar Kurir
      </Button>
      <Button
        size="sm"
        className={`rounded-pill px-3 fw-semibold ${nilai === 'ambil' ? 'btn-hijau' : 'btn-outline-secondary bg-white text-dark border'}`}
        onClick={() => onPilih('ambil')}
      >
        🛍️ Ambil Sendiri
      </Button>
    </div>
  )
}

export default function Checkout({ keranjang, ubah, kosongkan, pesanan, setPesanan, onKirim, onKembali }: Props) {
  const [galat, setGalat] = useState('')
  const [buktiTransfer, setBuktiTransfer] = useState<string>('')
  const [qrisAda, setQrisAda] = useState(true)

  if (keranjang.length === 0)
    return (
      <Container className="py-5 text-center">
        <div className="display-1 mb-3">🥟</div>
        <h2 className="judul-serif">Keranjang masih kosong.</h2>
        <p className="text-muted">Pilih dimsum favoritmu dulu, lalu kembali ke sini.</p>
        <Button className="btn-merah rounded-pill px-4 py-2 mt-2" onClick={onKembali}>
          Lihat Menu Dimsum
        </Button>
      </Container>
    )

  const daftarHari = pilihanHari()
  const hari = daftarHari.includes(pesanan.hari) ? pesanan.hari : daftarHari[0]
  const daftarJam = slotJam(hari)
  const jam = daftarJam.includes(pesanan.jam) ? pesanan.jam : daftarJam[0] ?? ''
  const pe: Pesanan = { ...pesanan, hari, jam }
  const set = (ubahan: Partial<Pesanan>) => setPesanan({ ...pe, ...ubahan })

  const siap = itemJenis(keranjang, 'siap')
  const frozen = itemJenis(keranjang, 'frz')
  const kata = pe.modeSiap === 'antar' ? 'pengantaran' : 'pengambilan'

  // Kode unik 3 digit dari nomor pesanan atau angka acak sederhana
  const kodeUnik = Number((pesanan.id || '123').replace(/\D/g, '').slice(-3)) || 147
  const totalAkhir = subtotal(keranjang) + kodeUnik

  const pratinjau = buatPesan(keranjang, pe).split('\n').map((t, i) => {
    const tebal = t.match(/^\*(.+)\*$/)
    return <div key={i}>{tebal ? <strong>{tebal[1]}</strong> : t || <br />}</div>
  })

  const kirim = () => {
    const e = cekPesanan(keranjang, pe)
    if (e) {
      setGalat(e)
      return
    }
    if (!buktiTransfer) {
      setGalat('Mohon lampirkan screenshot bukti transfer QRIS terlebih dahulu.')
      return
    }
    setGalat('')
    onKirim(pe)
  }

  return (
    <Container className="py-4">
      <div className="mb-4">
        <Button variant="link" className="p-0 mb-2 text-decoration-none text-dark fw-semibold" onClick={onKembali}>
          ← Kembali ke Beranda
        </Button>
        <h1 className="judul-serif mb-1">Sebentar lagi, jadi milikmu.</h1>
        <p className="text-muted mb-0">Satu pesanan, pengaturan terpisah. Biar semuanya sampai dengan pas.</p>
      </div>

      <Row className="g-4 align-items-start">
        {/* KOLOM KIRI */}
        <Col lg={7}>
          {/* 1. Ringkasan Item Dipilih */}
          <Card className="kartu-menu shadow-sm p-4 mb-3 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="judul-serif mb-0">Ringkasan Item Dipilih</h5>
                <small className="text-muted">{keranjang.reduce((a, b) => a + b.jumlah, 0)} item dalam keranjang</small>
              </div>
              {kosongkan && (
                <Button variant="outline-danger" size="sm" className="rounded-pill px-3" onClick={kosongkan}>
                  Kosongkan
                </Button>
              )}
            </div>

            {siap.length > 0 && (
              <div className="mb-3">
                <Badge bg="warning" text="dark" className="rounded-pill mb-2">Siap Makan</Badge>
                {siap.map(i => <BarisItem key={i.kunci} item={i} ubah={ubah} />)}
              </div>
            )}

            {frozen.length > 0 && (
              <div>
                <Badge bg="info" text="dark" className="rounded-pill mb-2">Frozen Vacuum</Badge>
                {frozen.map(i => <BarisItem key={i.kunci} item={i} ubah={ubah} />)}
              </div>
            )}
          </Card>

          {/* 2. Opsi Pengiriman Terpisah */}
          <Row className="g-3 mb-3">
            {siap.length > 0 && (
              <Col md={frozen.length > 0 ? 6 : 12}>
                <Card className="kartu-menu kartu-siap-bg shadow-sm p-3 h-100">
                  <small className="fw-bold text-uppercase" style={{ color: 'var(--merah)' }}>
                    01 / Opsi Siap Makan
                  </small>
                  <PilihMode nilai={pe.modeSiap} onPilih={m => set({ modeSiap: m })} />
                  <Row className="g-2 mt-1">
                    <Col xs={6}>
                      <Form.Label className="small fw-semibold mb-1">Hari {kata}</Form.Label>
                      <Form.Select size="sm" className="rounded-3" value={hari} onChange={e => set({ hari: e.target.value })}>
                        {daftarHari.map(h => <option key={h}>{h}</option>)}
                      </Form.Select>
                    </Col>
                    <Col xs={6}>
                      <Form.Label className="small fw-semibold mb-1">Jam {kata}</Form.Label>
                      <Form.Select size="sm" className="rounded-3" value={jam} onChange={e => set({ jam: e.target.value })}>
                        {daftarJam.map(j => <option key={j}>{j}</option>)}
                      </Form.Select>
                    </Col>
                  </Row>
                  <small className="text-muted mt-2 d-block" style={{ fontSize: '0.75rem' }}>
                    Pre-order maks. {CFG.batasPesanan}.00 • Siap ±30–45 menit sesuai antrean.
                  </small>
                </Card>
              </Col>
            )}

            {frozen.length > 0 && (
              <Col md={siap.length > 0 ? 6 : 12}>
                <Card className="kartu-menu kartu-frozen-bg shadow-sm p-3 h-100">
                  <small className="fw-bold text-uppercase text-primary">
                    {siap.length ? '02' : '01'} / Opsi Frozen Vacuum
                  </small>
                  <PilihMode nilai={pe.modeFrozen} onPilih={m => set({ modeFrozen: m })} />
                  <small className="text-muted mt-2 d-block" style={{ fontSize: '0.78rem' }}>
                    Tidak perlu pilih jam. Dikirim saat stok tersedia. Jarak jauh menggunakan <em>packing dingin</em> (ongkir dikonfirmasi admin).
                  </small>
                </Card>
              </Col>
            )}
          </Row>

          {/* 3. Data Pemesan */}
          <Card className="kartu-menu shadow-sm p-4 bg-white">
            <small className="fw-bold text-uppercase mb-2 d-block" style={{ color: 'var(--merah)' }}>
              {(siap.length > 0 && frozen.length > 0) ? '03' : '02'} / Data Pemesan
            </small>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label className="small fw-semibold">Nama Lengkap</Form.Label>
                <Form.Control
                  className="rounded-3 py-2"
                  value={pesanan.nama}
                  placeholder="Contoh: Budi Santoso"
                  onChange={e => set({ nama: e.target.value })}
                />
              </Col>
              <Col md={6}>
                <Form.Label className="small fw-semibold">Nomor WhatsApp</Form.Label>
                <Form.Control
                  className="rounded-3 py-2"
                  value={pesanan.hp}
                  inputMode="tel"
                  placeholder="08xx xxxx xxxx"
                  onChange={e => set({ hp: e.target.value })}
                />
              </Col>
            </Row>
            {perluAlamat(keranjang, pe) && (
              <div className="mt-3">
                <Form.Label className="small fw-semibold">Alamat Lengkap Pengiriman</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  className="rounded-3"
                  value={pesanan.alamat}
                  placeholder="Nama jalan, nomor rumah, RT/RW, kecamatan, kota..."
                  onChange={e => set({ alamat: e.target.value })}
                />
              </div>
            )}
            <div className="mt-3">
              <Form.Label className="small fw-semibold">Catatan Tambahan (Opsional)</Form.Label>
              <Form.Control
                className="rounded-3 py-2"
                value={pesanan.catatan}
                placeholder="Contoh: Chili oil dipisah, titip di satpam"
                onChange={e => set({ catatan: e.target.value })}
              />
            </div>
          </Card>
        </Col>

        {/* KOLOM KANAN: QRIS & RINGKASAN BAYAR */}
        <Col lg={5} className="sticky-top" style={{ top: '24px' }}>
          <Card className="kartu-menu shadow p-4 text-white" style={{ background: 'var(--hijau)' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small text-white-50">Total Tagihan (+Kode Unik)</span>
              <Badge bg="warning" text="dark" className="rounded-pill">QRIS All Payment</Badge>
            </div>

            <div className="d-flex justify-content-between align-items-baseline mb-3">
              <h2 className="judul-serif mb-0" style={{ color: 'var(--kuning)' }}>{rupiah(totalAkhir)}</h2>
              <small className="text-white-50">Subtotal {rupiah(subtotal(keranjang))} + {kodeUnik}</small>
            </div>

            {/* Kotak Putih QRIS */}
            <div className="kotak-qris mb-3 shadow-sm">
              <div className="fw-bold small mb-1"></div>
              {qrisAda ? (
                <img
                  src={urlFoto('qris.png')}
                  alt={`QRIS pembayaran ${NAMA_TOKO}`}
                  onError={() => setQrisAda(false)}
                />
              ) : (
                <div className="py-5 small text-muted">
                  {import.meta.env.DEV
                    ? 'Taruh gambar QRIS di public/images/qris.png'
                    : 'QRIS belum tersedia. Silakan hubungi admin lewat WhatsApp.'}
                </div>
              )}
              <div className="small text-muted mt-1" style={{ fontSize: '0.72rem' }}>
                Scan via GoPay, OVO, DANA, ShopeePay, atau M-Banking
              </div>
            </div>

            {/* Upload Bukti Transfer */}
            <div className="mb-3">
              <Form.Label className="small fw-semibold text-warning mb-1">
                Lampiran Screenshot Bukti Transfer *
              </Form.Label>
              <Form.Control
                type="file"
                size="sm"
                accept="image/*"
                className="rounded-3 bg-dark text-white border-secondary"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0]
                  setBuktiTransfer(file ? file.name : '')
                  if (file) setGalat('')
                }}
              />
              {buktiTransfer && (
                <small className="text-success d-block mt-1">✓ Terlampir: {buktiTransfer}</small>
              )}
            </div>

            {/* Pratinjau Pesan WA */}
            <div className="mb-3">
              <small className="text-white-50 d-block mb-1" style={{ fontSize: '0.72rem' }}>PRATINJAU PESAN WHATSAPP</small>
              <div
                className="rounded-3 p-3 small text-white-50"
                style={{ background: '#111111', maxHeight: 160, overflow: 'auto', fontSize: '0.78rem', border: '1px solid #333' }}
              >
                {pratinjau}
              </div>
            </div>

            {galat && <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3">{galat}</div>}

            <Button
              className="btn-merah w-100 rounded-pill py-2 fw-bold"
              onClick={kirim}
            >
              {buktiTransfer ? 'Kirim Pesanan & Bukti ke WhatsApp →' : 'Upload Bukti Transfer Dulu'}
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}