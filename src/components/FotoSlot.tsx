import { useState, type ReactNode } from 'react'
import { urlFoto } from '../config'

interface Props {
  nama?: string // nama file di public/img
  alt: string
  frozen?: boolean
  className?: string
  children?: ReactNode // label atau kartu di atas foto
}

export default function FotoSlot({ nama, alt, frozen, className = '', children }: Props) {
  // gagal = file belum ada, tampilkan kotak template
  const [gagal, setGagal] = useState(false)
  return (
    <div className={`foto-menu ${frozen ? 'foto-frozen' : ''} ${className}`}>
      {nama && !gagal ? (
        <img src={urlFoto(nama)} alt={alt} className="foto-isi" onError={() => setGagal(true)} />
      ) : (
        <div className="foto-kosong">
          <span>📷</span>
          {import.meta.env.DEV && nama && <small>public/img/{nama}</small>}
        </div>
      )}
      {children}
    </div>
  )
}