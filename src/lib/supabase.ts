import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const kunci = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// kalau .env belum diisi, nilainya null dan bagian testimoni menampilkan pesan
export const supabase = url && kunci ? createClient(url, kunci) : null