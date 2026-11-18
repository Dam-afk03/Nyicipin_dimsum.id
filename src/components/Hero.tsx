import { Container, Row, Col, Button } from 'react-bootstrap'
import FotoSlot from './FotoSlot'
import { FOTO } from '../config'

export default function Hero() {
  return (
    <Container className="py-5">
      <Row className="align-items-center g-4">
        <Col md={6}>
          <div className="small fw-semibold" style={{ color: 'var(--merah)' }}>
            RENYAH DI LUAR, LUMER DI DALAM.
          </div>
          <h1 className="judul-serif display-4 my-3">
            Sekali gigit, langsung <span className="sorot">jatuh keju.</span>
          </h1>
          <p className="lead">Dimsum goreng keju yang bikin susah berhenti. Mau hangat sekarang atau stok untuk nanti?</p>
          <Button href="#menu" className="btn-merah rounded-pill px-4 me-2">Pilih Bahagiamu</Button>
          <Button href="#cara" variant="light" className="rounded-pill px-4">Cara Pemesanan</Button>
        </Col>
        <Col md={6}>
          <FotoSlot nama={FOTO.hero} alt="Dimsum goreng keju dmcum.id" className="foto-hero">
            <div className="kartu-melayang">
            </div>
          </FotoSlot>
        </Col>
      </Row>
    </Container>
  )
}