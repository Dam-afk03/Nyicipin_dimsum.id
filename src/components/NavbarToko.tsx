import { useEffect, useState, type ReactNode } from 'react'
import { Container, Button, Badge } from 'react-bootstrap'
import { NAMA_TOKO, urlFoto } from '../config'

interface Props {
    jumlahItem: number
    onKeranjang: () => void
    onBeranda: () => void
}

// pembungkus ikon garis 24x24
const Ikon = ({ children }: { children: ReactNode }) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
         strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
    </svg>
)

const LINK = [
    { id: 'menu', teks: 'Menu', ikon: (
        <Ikon><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></Ikon>
    ) },
    { id: 'cara', teks: 'Cara Pesan', ikon: (
        <Ikon><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></Ikon>
    ) },
    { id: 'tentang', teks: 'Tentang', ikon: (
        <Ikon><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></Ikon>
    ) },
    { id: 'testimoni', teks: 'Testimoni', ikon: (
        <Ikon><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></Ikon>
    ) },
    { id: 'kontak', teks: 'Kontak', ikon: (
        <Ikon><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></Ikon>
    ) },
]

export default function NavbarToko({ jumlahItem, onKeranjang, onBeranda }: Props) {
    // id bagian yang sedang dilihat; kosong kalau belum masuk bagian mana pun
    const [aktif, setAktif] = useState('')

    useEffect(() => {
        const hitung = () => {
            const tengah = window.innerHeight * 0.4
            let id = ''
            for (const l of LINK) {
                const el = document.getElementById(l.id)
                if (el && el.getBoundingClientRect().top <= tengah) id = l.id
            }
            // sudah di dasar halaman: bagian terakhir dianggap aktif
            if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2 && document.getElementById('kontak')) {
                id = 'kontak'
            }
            setAktif(id)
        }
        hitung()
        window.addEventListener('scroll', hitung, { passive: true })
        return () => window.removeEventListener('scroll', hitung)
    }, [])

    // pindah ke beranda dulu (kalau sedang di checkout), lalu meluncur ke bagiannya
    const pergi = (id: string) => {
        onBeranda()
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 50)
    }

    return (
        <>
        <header className="border-bottom sticky-top bg-body">
            <Container className="d-flex align-items-center justify-content-between gap-2 py-2 py-md-3">
                <a href="#" className="d-flex align-items-center gap-2 nama-toko judul-serif text-decoration-none text-reset text-nowrap"
                onClick={e => { e.preventDefault(); onBeranda() }}>
                    <img src={urlFoto('hero.png')} alt="" width={36} height={36} className="logo-bulat"
                        onError={e => { e.currentTarget.style.display = 'none' }} />
                    {NAMA_TOKO}
                </a>

                {/* menu atas: hanya tampil di laptop */}
                <nav className="d-none d-md-flex gap-3" aria-label="Menu utama">
                    {LINK.map(l => (
                        <a key={l.id} href={`#${l.id}`} className="text-reset text-decoration-none"
                        onClick={e => { e.preventDefault(); pergi(l.id) }}>{l.teks}</a>
                    ))}
                </nav>

                <Button className="btn-hijau rounded-pill tombol-keranjang" onClick={onKeranjang}>
                    Keranjang{' '}<Badge bg="warning" text="dark">{jumlahItem}</Badge>
                </Button>
            </Container>
        </header>

            {/* menu bawah: hanya tampil di HP */}
            <nav className="menu-bawah d-md-none" aria-label="Menu utama">
                {LINK.map(l => (
                    <a key={l.id} href={`#${l.id}`} className={aktif === l.id ? 'aktif' : ''}
                       aria-current={aktif === l.id ? 'true' : undefined}
                       onClick={e => { e.preventDefault(); pergi(l.id) }}>
                        {l.ikon}
                        <span>{l.teks}</span>
                    </a>
                ))}
            </nav>
        </>
    )
}