# 🛒 Sistem Manajemen Stok & Konsinyasi Kantin Al-Imam (v2.0)

Aplikasi manajemen operasional stok kantin Al-Imam dengan integrasi Google Apps Script (GAS) dan antarmuka modern berbasis React & Tailwind CSS. Telah disesuaikan secara khusus untuk memenuhi kebutuhan operasional **Bu Shalatina** (Pengelola Kantin) dan **Kak Dini** (Staf Stok Operasional) sesuai dengan 5 kategori bisnis aktual.

---

## 🔐 Kredensial Login Pengguna

Sistem dilengkapi fitur autentikasi dengan akun khusus:

| Peran / Nama | Username | Password | Hak Akses |
| :--- | :--- | :--- | :--- |
| **Bu Shalatina** *(Admin / Pengelola)* | `shalatina` *(atau `admin`)* | `shalatina123` | Akses penuh: kelola stok, buku kas konsinyasi, laporan finansial, dan setup database. |
| **Kak Dini** *(Staf Kantin)* | `kakdini` *(atau `dini`)* | `dini123` | Operasional harian: input stok snack, minuman, ice cream, pencatatan titipan guru harian dengan autocomplete. |

> Tersedia tombol **"Pilih Akun Cepat (Demo)"** pada halaman login untuk masuk dalam satu klik.

---

## 📌 1. Struktur 5 Kategori Bisnis Aktual & Skema Sheet

Arsitektur database spreadsheet dinormalisasi menjadi 5 sheet terpisah:

### A. Kategori 1: SNACK (Sheet: `Stock_Snack`)
- **Fokus:** Perhitungan satuan bertingkat (**Karton ➔ Dus ➔ Pcs**).
- **Kolom Sheet:**
  1. `ID` (contoh: `SNK-001`)
  2. `Nama Produk` (contoh: Beng-Beng Wafer, Nabati Richeese)
  3. `Isi 1 Karton (Pcs)`
  4. `Harga Karton (Lama/Modal)`
  5. `Isi Pcs Perdus`
  6. `Harga Perdus` (*Kalkulator otomatis*: `(Harga Karton / Isi Karton) × Isi Perdus`, dapat diedit manual)
  7. `Stok Aktual (Karton/Dus/Pcs)`
  8. `Last Update`

### B. Kategori 2: MINUMAN (Sheet: `Stock_Minuman`)
- **Fokus:** Stok berbasis karton/pack dengan peringatan stok minimum.
- **Kolom Sheet:**
  1. `ID` (`MNM-001`)
  2. `Nama Produk`
  3. `Harga 1 Karton`
  4. `Stok Aktual (Karton/Pcs)`
  5. `Stok Minimum`
  6. `Last Update`
- **Data Awal (Auto-Seed):**
  - Stee (Rp 35.000)
  - Fruit tea (Rp 47.000)
  - Teh Botol (Rp 70.000)
  - Prima 600 (Rp 45.000)
  - Prima 1.5 (Rp 47.000)
  - Minute Maid (Rp 58.200)
  - Es Batu (Rp 20.000)
  - Chokolatos Drink (Rp 19.900)
  - Good Day (Rp 22.900)

### C. Kategori 3: ICE CREAM (Sheet: `Stock_IceCream`)
- **Fokus:** Stok freezer berbasis karton/box.
- **Kolom Sheet:**
  1. `ID` (`ICE-001`)
  2. `Nama Produk`
  3. `Harga 1 Karton`
  4. `Stok Aktual`
  5. `Stok Minimum`
  6. `Last Update`
- **Data Awal (Auto-Seed):**
  - Neopolitan (Rp 115.200)
  - Reguler (Rp 86.400)
  - Choco dip (Rp 96.000)
  - Loly pop (Rp 48.000)
  - Choconut (Rp 135.000)
  - Polar pop (Rp 96.000)
  - Magic (Rp 96.000)
  - Fruty pop / Popeye (Rp 84.000)

### D. Kategori 4: KONSINYASI EXTERNAL (Sheet: `Konsinyasi_External`)
- **Fokus:** Barang titipan supplier luar kantin.
- **Kolom Sheet:**
  1. `ID` (`EXT-001`)
  2. `Tanggal` (`DD/MM/YYYY`)
  3. `Nama Produk / Supplier`
  4. `Stock Masuk (Pcs)`
  5. `Terjual`
  6. `Sisa/Retur` (Otomatis: `Stock Masuk - Terjual`)
  7. `Harga Satuan`
  8. `Total Harga` (Otomatis: `Stock Masuk × Harga Satuan` / manual)
  9. `Status Bayar (Belum/Lunas)` (Tombol 1-klik ubah status)
- **Data Awal (Auto-Seed):**
  - Sari Roti | Tgl: 23/11/2026 | Stock: 27 | Total Harga: Rp 127.000 | Status: Belum

### E. Kategori 5: KONSINYASI GURU (Sheet: `Konsinyasi_Guru`)
- **Fokus:** Makanan/jajanan titipan dari para guru sekolah Al-Imam.
- **Kolom Sheet:**
  1. `ID` (`GRU-001`)
  2. `Tanggal`
  3. `Nama Guru` (Dilengkapi **Autocomplete** untuk mempermudah Kak Dini)
  4. `Nama Produk`
  5. `Jumlah Produk (Pcs)`
  6. `Terjual (Pcs)`
  7. `Sisa` (Otomatis: `Jumlah - Terjual`)
  8. `Harga Satuan`
  9. `Total Harga` (Otomatis: `Terjual × Harga Satuan` / manual)
  10. `Status Setor ke Guru (Belum/Sudah)` (Tombol 1-klik ubah status)
- **Data Awal (Auto-Seed):**
  - Baso goreng (Bu Nurul, Bu Rahma, Ustadz Abdullah, Bu Shalatina, dll.)

---

## 🎨 2. Fitur Unggulan UI/UX Frontend

1. **Logo Resmi Al-Imam:**
   - Terpasang rapi di header, tab browser favicon, kop laporan cetak, dan halaman login.
2. **Tab Navigasi Kategori (Scrollable Pastel Green Pills):**
   - Tab ramah sentuhan di mobile dan desktop: `[Semua Kategori] [Snack] [Minuman] [Ice Cream] [Konsinyasi External] [Konsinyasi Guru]` lengkap dengan badge jumlah item.
3. **Ringkasan Dashboard Terpisah:**
   - **Kartu 1:** *Total Nilai Stok Reguler (Snack, Minuman, Ice Cream)* untuk mengawasi modal kantin.
   - **Kartu 2:** *Total Kewajiban Setor Konsinyasi (External & Guru)* untuk memisahkan uang titipan supplier dan guru agar tidak tercampur dengan modal kantin.
4. **Form Input Dinamis (+ Tambah Stok / Titipan):**
   - Field input berganti otomatis mengikuti kategori yang dipilih.
   - Bottom-sheet ramah mobile dengan sticky button.
   - Kalkulator otomatis harga dus snack dan kalkulasi sisa & total konsinyasi.
   - Autocomplete nama guru harian untuk staf Kak Dini.
5. **Buku Stok Responsif (Tabel & Card View Switcher):**
   - Tampilan tabel rapi di layar laptop/desktop Bu Shalatina.
   - Tampilan card interaktif di smartphone staf Kak Dini.

---

## 🌐 3. Link Deployment

- **Vercel Production:** [https://app-stock-kantin-al-imam.vercel.app](https://app-stock-kantin-al-imam.vercel.app)
- **GitHub Repository:** [https://github.com/faikbajsair/app-stock-kantin-al-imam](https://github.com/faikbajsair/app-stock-kantin-al-imam)
- **Google Apps Script Web App:** [https://script.google.com/macros/s/AKfycby1Pb1b6ElGZ4hR3tIwscdB-GxtIEGek5ZUPIiJy_50PI65AStVXxgkZzgDc_L0iGKHww/exec](https://script.google.com/macros/s/AKfycby1Pb1b6ElGZ4hR3tIwscdB-GxtIEGek5ZUPIiJy_50PI65AStVXxgkZzgDc_L0iGKHww/exec)
