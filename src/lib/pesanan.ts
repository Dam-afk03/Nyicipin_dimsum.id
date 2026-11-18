import type { itemKeranjang, jenis, Pesanan } from '../types'
import { CFG } from '../config'
import { rupiah } from './format'

export const itemJenis = (k: itemKeranjang[], j: jenis) => k.filter(x => x.jenis === j)

export const subtotal = (k: itemKeranjang[], j?: jenis) =>
  (j ? itemJenis(k, j) : k).reduce((a, b) => a + b.harga * b.jumlah, 0)

export const perluAlamat = (k: itemKeranjang[], p: Pesanan) =>
  (itemJenis(k, 'siap').length > 0 && p.modeSiap === 'antar') ||
  (itemJenis(k, 'frz').length > 0 && p.modeFrozen === 'antar')

export function nomerPesanan(): string {
  const acak = Math.floor(100 + Math.random() * 900)
  return `DMC-${Date.now().toString().slice(-4)}${acak}`
}

// Ambil 3 digit terakhir dari ID pesanan sebagai kode unik pembayaran
export function ambilKodeUnik(idPesanan: string): number {
  const angka = idPesanan.replace(/\D/g, '').slice(-3)
  return Number(angka) || 125
}

export function pilihanHari(): string[] {
  const hari = ['Hari ini', 'Besok', 'Lusa']
  return hari
}

export function slotJam(hari: string): string[] {
  const semua = ['11.00', '13.00', '15.00', '17.00', '19.00']
  if (hari !== 'Hari ini') return semua
  const jamSekarang = new Date().getHours()
  const tersedia = semua.filter(j => Number(j.split('.')[0]) > jamSekarang)
  return tersedia.length > 0 ? tersedia : ['Besok Pagi (11.00)']
}

export function cekPesanan(k: itemKeranjang[], p: Pesanan): string {
  if (k.length === 0) return 'Keranjang masih kosong.'
  if (!p.nama.trim()) return 'Nama pemesan wajib diisi.'
  if (!p.hp.trim() || p.hp.replace(/\D/g, '').length < 9) return 'Nomor WhatsApp tidak valid.'
  if (perluAlamat(k, p) && !p.alamat.trim()) return 'Alamat pengantaran wajib diisi.'
  return ''
}

export function buatPesan(k: itemKeranjang[], p: Pesanan, namaFileBukti?: string): string {
  const siap = itemJenis(k, 'siap')
  const frozen = itemJenis(k, 'frz')
  const sub = subtotal(k)
  const kodeUnik = ambilKodeUnik(p.id || '125')
  const totalTransfer = sub + kodeUnik

  const baris: string[] = [
    `*PESANAN BARU - NYICIPIN_DIMSUM_ID*`,
    `No. Order: *${p.id || '(Otomatis)'}*`,
    ``,
    `*DATA PEMESAN*`,
    `Nama: ${p.nama || '-'}`,
    `No. WA: ${p.hp || '-'}`,
  ]

  if (perluAlamat(k, p)) {
    baris.push(`Alamat: ${p.alamat || '-'}`)
  }
  if (p.catatan.trim()) {
    baris.push(`Catatan: ${p.catatan}`)
  }

  if (siap.length > 0) {
    baris.push(
      ``,
      `*01 / SIAP MAKAN (${p.modeSiap === 'antar' ? 'Antar Kurir' : 'Ambil Sendiri'})*`,
      `Jadwal: ${p.hari}, pukul ${p.jam} WIB`,
      ...siap.map(i => `- ${i.nama} (${i.isi}, ${i.saus}) x${i.jumlah} = ${rupiah(i.harga * i.jumlah)}`)
    )
  }

  if (frozen.length > 0) {
    baris.push(
      ``,
      `*02 / FROZEN VACUUM (${p.modeFrozen === 'antar' ? 'Kirim Ekspedisi/Kurir' : 'Ambil Sendiri'})*`,
      ...frozen.map(i => `- ${i.nama} (${i.isi}) x${i.jumlah} = ${rupiah(i.harga * i.jumlah)}`)
    )
  }

  baris.push(
    ``,
    `*RINCIAN PEMBAYARAN (QRIS)*`,
    `Subtotal Produk: ${rupiah(sub)}`,
    `Kode Unik: +${kodeUnik}`,
    `*Total Transfer QRIS: ${rupiah(totalTransfer)}*`,
    `Bukti Transfer: ${namaFileBukti ? `Terlampir (${namaFileBukti}) — *kirim gambar bukti di chat ini*` : 'Belum dilampirkan'}`,
    ``,
    `_Mohon konfirmasi pesanan saya ya Min!_`
  )

  return baris.join('\n')
}

export function walink(pesan: string): string {
  const nomorAdmin = CFG.wa || '6282117503964'
  return `https://wa.me/${nomorAdmin}?text=${encodeURIComponent(pesan)}`
}