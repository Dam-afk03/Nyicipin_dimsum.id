// kecilkan foto: sisi terpanjang maks 1000 px, simpan sebagai JPEG kualitas 0.8
export async function kecilkanFoto(file: File, maks = 1000): Promise<Blob> {
  const bmp = await createImageBitmap(file)
  const skala = Math.min(1, maks / Math.max(bmp.width, bmp.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bmp.width * skala)
  canvas.height = Math.round(bmp.height * skala)
  canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height)
  return new Promise((ok, gagal) =>
    canvas.toBlob(b => (b ? ok(b) : gagal(new Error('Foto gagal diproses'))), 'image/jpeg', 0.8),
  )
}