import { useEffect, useState } from 'react'
import { Container, Button } from 'react-bootstrap'
import type { itemKeranjang, Pesanan } from './types'
import { buatPesan, nomerPesanan, walink } from './lib/pesanan'
import NavbarToko from './components/NavbarToko'
import Hero from './components/Hero'
import MenuSection from './components/MenuSection'
import KeranjangLaci from './components/KeranjangLaci'
import Checkout from './components/Checkout'
import CaraPesan from './components/CaraPesan'
import Tentangkami from './components/Tentangkami'
import Kontak from './components/kontak'
import Footer from './components/Footer'
import Testimoni from './components/Testimoni'

function buatPesananBaru(): Pesanan {
  return {
    modeSiap: 'antar',
    hari: '',
    jam: '',
    modeFrozen: 'antar',
    nama: '',
    hp: '',
    alamat: '',
    catatan: '',
    id: nomerPesanan(),
  }
}

function muatKeranjang(): itemKeranjang[] {
  try {
    return JSON.parse(localStorage.getItem('dmc-keranjang') ?? '[]')
  } catch {
    return []
  }
}

export default function App() {
  const [keranjang, setKeranjang] = useState<itemKeranjang[]>(muatKeranjang)
  const [halaman, setHalaman] = useState<'beranda' | 'checkout' | 'sukses'>('beranda')
  const [laciTampil, setLaciTampil] = useState(false)
  const [pesanan, setPesanan] = useState<Pesanan>(buatPesananBaru)

  useEffect(() => {
    try {
      localStorage.setItem('dmc-keranjang', JSON.stringify(keranjang))
    } catch {
      // abaikan jika penyimpanan penuh
    }
  }, [keranjang])

  const tambah = (item: itemKeranjang) =>
    setKeranjang(k =>
      k.some(x => x.kunci === item.kunci)
        ? k.map(x => (x.kunci === item.kunci ? { ...x, jumlah: x.jumlah + item.jumlah } : x))
        : [...k, item],
    )

  const ubah = (kunci: string, selisih: number) =>
    setKeranjang(k =>
      k.map(x => (x.kunci === kunci ? { ...x, jumlah: x.jumlah + selisih } : x)).filter(x => x.jumlah > 0),
    )

  const ke = (h: 'beranda' | 'checkout' | 'sukses') => {
    setHalaman(h)
    setLaciTampil(false)
    window.scrollTo(0, 0)
  }

  // Langkah 6: Kirim pesanan + info bukti transfer QRIS ke WhatsApp, lalu bersihkan keranjang
  const kirim = (p: Pesanan, namaFileBukti?: string) => {
    const akhir = { ...p, id: p.id || nomerPesanan() }
    setPesanan(akhir)
    window.open(walink(buatPesan(keranjang, akhir, namaFileBukti)), '_blank')
    setKeranjang([])
    ke('sukses')
  }

  const mulaiOrderBaru = () => {
    setPesanan(buatPesananBaru())
    ke('beranda')
  }

  return (
    <>
      <NavbarToko
        jumlahItem={keranjang.reduce((a, i) => a + i.jumlah, 0)}
        onKeranjang={() => setLaciTampil(true)}
        onBeranda={() => ke('beranda')}
      />

      {halaman === 'beranda' && (
        <>
          <Hero />
          <MenuSection onTambah={tambah} />
          <CaraPesan />
          <Tentangkami />
          <Testimoni/>
          <Kontak/>
        </>
      )}

      {halaman === 'checkout' && (
        <Checkout
          keranjang={keranjang}
          ubah={ubah}
          kosongkan={() => setKeranjang([])}
          pesanan={pesanan}
          setPesanan={setPesanan}
          onKirim={kirim}
          onKembali={() => ke('beranda')}
        />
      )}

      {halaman === 'sukses' && (
        <Container className="py-5 text-center" style={{ maxWidth: 540 }}>
          <div className="bg-white p-5 rounded-4 shadow-sm border">
            <span className="badge rounded-pill bg-success-subtle text-success px-3 py-2 mb-3">
              Pesanan Diteruskan ke WhatsApp
            </span>
            <h2 className="judul-serif mb-2">Terima kasih, {pesanan.nama}!</h2>
            <p className="text-muted small mb-4">
              Nomor pesanan kamu <strong>{pesanan.id}</strong> telah dialihkan ke chat WhatsApp admin. Jangan lupa kirimkan <strong>foto screenshot bukti transfer QRIS</strong> di chat WhatsApp tersebut agar pesanan segera diproses.
            </p>
            <Button className="btn-merah rounded-pill px-4 py-2" onClick={mulaiOrderBaru}>
              Kembali ke Beranda
            </Button>
          </div>
        </Container>
      )}

      <Footer />

      <KeranjangLaci
        tampil={laciTampil}
        tutup={() => setLaciTampil(false)}
        keranjang={keranjang}
        ubah={ubah}
        onCheckout={() => ke('checkout')}
      />
    </>
  )
}