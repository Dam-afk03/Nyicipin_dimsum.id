import { Container, Row, Col, Card } from 'react-bootstrap'

const LANGKAH = [
  { no: '01', judul: 'Pilih favoritmu', isi: 'Siap makan, frozen, atau keduanya. Masukkan ke keranjang.' },
  { no: '02', judul: 'Atur pesanan', isi: 'Pilih antar atau ambil sendiri, lalu isi data pemesan.' },
  { no: '03', judul: 'Bayar dengan QRIS', isi: 'Scan QRIS, bayar sesuai total, lalu pilih screenshot bukti transfer.' },
  { no: '04', judul: 'Kirim ke WhatsApp', isi: 'Pesanan terbuka di WhatsApp admin. Lampirkan bukti bayar, lalu kami proses.' },
]

export default function CaraPesan() {
  return (
    <section id="cara" className="bagian-krem py-5">
      <Container>
        <h2 className="judul-serif mb-4">Dari klik, ke kriuk.</h2>
        <Row xs={1} md={4} className="g-3">
          {LANGKAH.map(l => (
            <Col key={l.no}>
              <Card className="kartu-menu h-100 p-3">
                <span className="nomor-langkah">{l.no}</span>
                <h3 className="h5 mt-1">{l.judul}</h3>
                <p className="mb-0 small">{l.isi}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  )
}