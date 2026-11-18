import { Offcanvas, Button } from 'react-bootstrap'
import type { itemKeranjang } from '../types'
import { rupiah } from '../lib/format'
import { subtotal } from '../lib/pesanan'
import BarisItem from './BarisItem'

interface Props {
  tampil: boolean
  tutup: () => void
  keranjang: itemKeranjang[]
  ubah: (kunci: string, selisih: number) => void
  onCheckout: () => void
}

export default function KeranjangLaci({ tampil, tutup, keranjang, ubah, onCheckout }: Props) {
  return (
    <Offcanvas show={tampil} onHide={tutup} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title className="judul-serif">Keranjang</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column">
        {keranjang.length === 0 ? (
          <div className="text-center my-auto">
            <p>Belum ada dimsum di keranjang.</p>
            <Button className="btn-merah rounded-pill" onClick={tutup}>Lihat menu</Button>
          </div>
        ) : (
          <>
            {keranjang.map(i => <BarisItem key={i.kunci} item={i} ubah={ubah} />)}
            <div className="d-flex justify-content-between mt-3 fs-5">
              <span>Subtotal</span><strong>{rupiah(subtotal(keranjang))}</strong>
            </div>
            <Button className="btn-merah rounded-pill mt-3" onClick={onCheckout}>Lanjut ke checkout</Button>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  )
}