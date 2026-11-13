import {CFG} from '../config'
import type {itemKeranjang,jenis,Pesanan} from '../types'
import {rupiah} from './format'

const jam = (m: number)=>
    String(Math.floor(m / 60)).padStart(2, '0') + '.' + String(m % 60 ).padStart(2, '0')


export function slotJam(hari: string): string[] {
    const n = new Date()
    const sekarang = n.getHours() * 60 + n.getMinutes()
    const hasil: string[] = []
    for (let m = CFG.jamMulai * 60; m < CFG.jamSelesai * 60; m += 30) {
    if(hari === 'hari ini' && m < sekarang + 35) continue
    hasil.push(jam(m) + '-' + jam(m + 30))
    }
    return hasil
}

export const pilihanHari = () => 
    new Date().getHours() < CFG.batasPesanan && slotJam('hari ini').length > 0 ? ['hari ini', 'besok'] : ['besok']

export const itemJenis = (k: itemKeranjang[], j: jenis) => k.filter(i => i.jenis === j)

export const subtotal = (k: itemKeranjang[], j?: jenis) =>
    k.filter(i => !j || i.jenis === j).reduce((a, i) => a + i.harga * i.jumlah, 0)

export const perluAlamat = (k:itemKeranjang[], p: Pesanan) =>
(itemJenis (k, 'siap').length > 0 && p.modeSiap === 'antar') ||
(itemJenis (k, 'frz').length > 0 && p.modeFrozen === 'antar')

const baris = (i: itemKeranjang) => 
    `${i.jumlah} x ${i.nama} • ${[i.isi, i.saus].filter(Boolean).join(' • ')} • {rupiah(i.harga * i.jumlah)}`


export function buatPesan(k: itemKeranjang[], p: Pesanan): string {
    const siap = itemJenis(k, 'siap')
    const frz = itemJenis(k, 'frz')
    let t = `Hallo dimcum-id, saya ${p.nama} ingin memesan:\n`
    if (siap.length) 
        t += `\n*Siap Makan*\n${siap.map(baris).join('\n')}\n${p.modeSiap === 'antar' ? 'antar' : 'Ambil Sendiri'}: ${p.hari.toLowerCase()}, ${p.jam}\n`
    
    if (frz.length) 
        t += `\n*Frozen*\n${frz.map(baris).join('\n')}\n${p.modeFrozen === 'antar' ? 'antar' : 'Ambil Sendiri'}\n`
    
    if (perluAlamat(k, p)) t += `\nAlamat: ${p.alamat || '[alamat]'}\n`

    if (p.catatan) t += `Catatan: ${p.catatan}\n`
        t += `\nSubtotal: ${rupiah (subtotal(k))}\nMohon konfirmasi stok, jadwal, packing dan ongkir.`
        if (p.id) t += `\nID Pesanan: ${p.id}`
    return t
}

export function cekPesanan(k: itemKeranjang [], p: Pesanan ): string{
    if (!k.length) return 'Keranjang kosong'
    if (!p.nama) return 'Nama belum diisi'
    if (!/^(\+?62|0)8\d{7,12}$/ .test(p.hp.replace(/[\s-]/g, '')))
        return 'Nomor wa salah. Contoh: 081234567890'
    if (perluAlamat(k, p) && p.alamat.trim().length < 10) return 'isi alamat pengantaran dengan lengkap'
    if (itemJenis(k, 'siap').length > 0 && !p.jam) return 'Pilih jam pengantaran'
    return ''
}

export const walink = (teks: string) => `https://wa.me/${CFG.wa}?text=${encodeURIComponent(teks)}`

export const nomerPesanan = () =>
    'DMC-' + new Date().toISOString().slice(2,10).replace(/-/g, '') + '-' + Math.floor(100 + Math.random() * 900)