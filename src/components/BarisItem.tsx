import { Button } from 'react-bootstrap'
import type { itemKeranjang } from '../types'
import { rupiah } from '../lib/format'

interface Props {
  item: itemKeranjang
  ubah: (kunci: string, selisih: number) => void
}

export default function BarisItem({ item, ubah }: Props) {
  return (
    <div className="d-flex justify-content-between align-items-center border-bottom py-2 gap-2">
      <div>
        <div>{item.nama}</div>
        <small className="text-muted">
          {[item.isi, item.saus].filter(Boolean).join(' • ')} • {rupiah(item.harga)}
        </small>
      </div>
      <div className="d-flex align-items-center gap-2">
        <Button size="sm" variant="light" aria-label="Kurangi" onClick={() => ubah(item.kunci, -1)}>−</Button>
        <strong>{item.jumlah}</strong>
        <Button size="sm" variant="light" aria-label="Tambah" onClick={() => ubah(item.kunci, 1)}>+</Button>
      </div>
    </div>
  )
}