import { Container } from 'react-bootstrap'
import { CFG, INFO, NAMA_TOKO } from '../config'

export default function Footer() {
  return (
    <footer className="bagian-gelap py-4">
      <Container className="d-flex flex-wrap justify-content-between gap-3">
        <div>
          <div className="judul-serif fs-4">{NAMA_TOKO}</div>
          <small>Dibuat fresh, dinikmati hangat.</small>
        </div>
        <div className="small">
          <a href={`https://wa.me/${CFG.wa}`} target="_blank" rel="noopener">WhatsApp</a>
          {' • '}
          <a href={`https://instagram.com/${INFO.instagram}`} target="_blank" rel="noopener">Instagram @{INFO.instagram}</a>
        </div>
      </Container>
    </footer>
  )
}