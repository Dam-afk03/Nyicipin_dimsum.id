import { Container, Row, Col } from 'react-bootstrap'
import FotoSlot from './FotoSlot'
import { FOTO } from '../config'

export default function TentangKami() {
  return (
    <section id="tentang" className="py-5">
      <Container>
        <div className="small fw-semibold" style={{ color: 'var(--merah)' }}>TENTANG KAMI</div>
        <Row className="align-items-center g-4">
          <Col md={6}>
            <FotoSlot nama={FOTO.tentang} alt="Dapur dmcum.id" />
          </Col>
          <Col md={6}>
            <h2 className="judul-serif">Dibuat Fresh dan Tanpa Bahan Pengawet</h2>
            {/* ganti teks ini dengan ceritamu sendiri */}
            <p>
              Berawal dari kecintaan terhadap dimsum goreng isi keju mozzarella, Nyicipin_Dimsum.id hadir membawa cemilan renyah diluar dan lumer di dalam.
            </p>
            <p className="mb-0">Untuk menjaga kualitas hingga ke tangan pelanggan luar kota, kami menggunakan teknologi Vacum Sealer-Food sehingga kesegaran adonan ayam pilihan dan keju tetap terkunci sempurna tanpa bahan pengawet.</p>
          </Col>
        </Row>
      </Container>
    </section>
  )
}