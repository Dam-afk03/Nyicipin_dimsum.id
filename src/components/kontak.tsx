import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { CFG, INFO } from '../config'

export default function Kontak() {
  return (
    <section id="kontak" className="bagian-krem py-5">
      <Container>
        <h2 className="judul-serif mb-4">Ada pertanyaan? Hubungi kami.</h2>
        <Row xs={1} md={3} className="g-3">
          <Col>
            <Card className="kartu-menu h-100 p-3">
              <h3 className="h5">WhatsApp</h3>
              <p className="small">Tanya stok, jadwal, atau ongkir.</p>
              <Button className="btn-merah rounded-pill mt-auto" href={`https://wa.me/${CFG.wa}`} target="_blank" rel="noopener">
                Chat WhatsApp
              </Button>
            </Card>
          </Col>
          <Col>
            <Card className="kartu-menu h-100 p-3">
              <h3 className="h5">Instagram</h3>
              <p className="small">Lihat menu terbaru dan promo.</p>
              <Button variant="dark" className="rounded-pill mt-auto" href={`https://instagram.com/${INFO.instagram}`} target="_blank" rel="noopener">
                @{INFO.instagram}
              </Button>
            </Card>
          </Col>
    
        </Row>
      </Container>
    </section>
  )
}