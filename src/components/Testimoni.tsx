import { useEffect, useState, type FormEvent } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { supabase } from '../lib/supabase'
import { kecilkanFoto } from '../lib/foto'
import { Siap, Frozen } from '../data/menu'
import type { DataTestimoni } from '../types'

// pilihan varian diambil dari data menu
const VARIAN = [...new Set([...Siap.map(p => p.nama), ...Frozen.map(p => p.nama)])]
const KUNCI_JEDA = 'dmc-testimoni-terakhir'
const bintang = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

export default function Testimoni() {
  const [daftar, setDaftar] = useState<DataTestimoni[]>([])
  const [memuat, setMemuat] = useState(true)
  const [versi, setVersi] = useState(0) // naik 1 = muat ulang daftar

  const [nama, setNama] = useState('')
  const [varian, setVarian] = useState(VARIAN[0] ?? '')
  const [rating, setRating] = useState(5)
  const [ulasan, setUlasan] = useState('')
  const [foto, setFoto] = useState<File | null>(null)
  const [mengirim, setMengirim] = useState(false)
  const [info, setInfo] = useState<{ jenis: 'success' | 'danger'; teks: string } | null>(null)

  // ambil testimoni dari database
  useEffect(() => {
    if (!supabase) {
      setMemuat(false)
      return
    }
    supabase
      .from('testimoni')
      .select('id, nama, varian, rating, ulasan, foto_url, dibuat')
      .order('dibuat', { ascending: false })
      .limit(12)
      .then(({ data }) => {
        setDaftar((data as DataTestimoni[] | null) ?? [])
        setMemuat(false)
      })
  }, [versi])

  const gagal = (teks: string) => setInfo({ jenis: 'danger', teks })

  async function kirim(e: FormEvent) {
    e.preventDefault()
    setInfo(null)
    if (!supabase) return gagal('Koneksi database belum diatur (cek file .env).')
    if (nama.trim().length < 2) return gagal('Isi nama dulu (minimal 2 huruf).')
    if (ulasan.trim().length < 10) return gagal('Ulasan minimal 10 karakter.')
    if (foto && foto.size > 8 * 1024 * 1024) return gagal('Ukuran foto maksimal 8 MB.')

    // jeda 60 detik antar pengiriman supaya tidak mudah di-spam
    let terakhir = 0
    try { terakhir = Number(localStorage.getItem(KUNCI_JEDA) ?? 0) } catch { /* abaikan */ }
    if (Date.now() - terakhir < 60_000) return gagal('Tunggu sebentar sebelum mengirim lagi.')

    setMengirim(true)
    try {
      let fotoUrl: string | null = null
      if (foto) {
        const blob = await kecilkanFoto(foto)
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
        const { error: eFoto } = await supabase.storage.from('testimoni').upload(path, blob, { contentType: 'image/jpeg' })
        if (eFoto) throw eFoto
        fotoUrl = supabase.storage.from('testimoni').getPublicUrl(path).data.publicUrl
      }
      const { error } = await supabase.from('testimoni').insert({
        nama: nama.trim(), varian, rating, ulasan: ulasan.trim(), foto_url: fotoUrl,
      })
      if (error) throw error

      try { localStorage.setItem(KUNCI_JEDA, String(Date.now())) } catch { /* abaikan */ }
      setNama(''); setUlasan(''); setFoto(null); setRating(5)
      ;(document.getElementById('foto-testimoni') as HTMLInputElement | null)?.value && ((document.getElementById('foto-testimoni') as HTMLInputElement).value = '')
      setVersi(v => v + 1)
      setInfo({ jenis: 'success', teks: 'Terima kasih! Testimonimu sudah tampil.' })
    } catch {
      gagal('Gagal mengirim testimoni. Pastikan foto berformat JPG atau PNG, lalu coba lagi.')
    } finally {
      setMengirim(false)
    }
  }

  return (
    <section id="testimoni" className="py-5">
      <Container>
        <div className="small fw-semibold" style={{ color: 'var(--merah)' }}>APA KATA MEREKA</div>

        {memuat ? (
          <p>Memuat testimoni...</p>
        ) : daftar.length === 0 ? (
          <p>Belum ada testimoni. Jadilah yang pertama!</p>
        ) : (
          <Row xs={1} md={3} className="g-3 mb-5">
            {daftar.map(t => (
              <Col key={t.id}>
                <Card className="kartu-menu h-100 p-3">
                  <div className="bintang">{bintang(t.rating)}</div>
                  <p className="my-2">“{t.ulasan}”</p>
                  {t.foto_url && <img src={t.foto_url} alt={`Foto dari ${t.nama}`} className="foto-testimoni mb-2" loading="lazy" />}
                  <div className="mt-auto">
                    <strong>{t.nama}</strong>
                    <div className="small text-muted">{t.varian}</div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <Card className="kartu-menu p-4 mx-auto" style={{ maxWidth: 640 }}>
          <h3 className="h5">Tulis testimoni kamu</h3>
          <p className="small text-muted">Ulasanmu akan langsung tampil dan membantu pembeli lain.</p>
          <Form onSubmit={kirim}>
            <Row className="g-2">
              <Col md={6}>
                <Form.Label>Nama kamu *</Form.Label>
                <Form.Control value={nama} maxLength={60} placeholder="Contoh: Alya" onChange={e => setNama(e.target.value)} />
              </Col>
              <Col md={6}>
                <Form.Label>Varian yang dipesan</Form.Label>
                <Form.Select value={varian} onChange={e => setVarian(e.target.value)}>
                  {VARIAN.map(v => <option key={v}>{v}</option>)}
                </Form.Select>
              </Col>
            </Row>
            <Form.Label className="mt-3 d-block">Rating kepuasan</Form.Label>
            <div className="mb-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button type="button" key={n} className="tombol-bintang" aria-label={`${n} bintang`} onClick={() => setRating(n)}>
                  {n <= rating ? '★' : '☆'}
                </button>
              ))}
              <small className="ms-2">{rating}/5</small>
            </div>
            <Form.Label>Ulasan kamu *</Form.Label>
            <Form.Control as="textarea" rows={3} maxLength={500} value={ulasan}
              placeholder="Ceritakan rasa kejunya, kemrenyesannya, atau pengirimannya..." onChange={e => setUlasan(e.target.value)} />
            <Form.Label className="mt-3">Foto dimsum / pesanan (opsional)</Form.Label>
            <Form.Control id="foto-testimoni" type="file" accept="image/*"
              onChange={e => setFoto((e.target as HTMLInputElement).files?.[0] ?? null)} />
            {info && <Alert variant={info.jenis} className="mt-3 mb-0 py-2">{info.teks}</Alert>}
            <Button type="submit" className="btn-merah rounded-pill mt-3 w-100" disabled={mengirim}>
              {mengirim ? 'Mengirim...' : 'Kirim testimoni'}
            </Button>
          </Form>
        </Card>
      </Container>
    </section>
  )
}