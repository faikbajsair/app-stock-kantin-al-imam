# 🛒 Sistem Manajemen Stok & Konsinyasi Kantin Al-Imam (v2.0)

Aplikasi manajemen operasional stok kantin Al-Imam dengan integrasi Google Apps Script (GAS) dan antarmuka modern berbasis React & Tailwind CSS. Telah disesuaikan secara khusus untuk memenuhi kebutuhan operasional **Bu Shalatina** (Pengelola Kantin) dan **Kak Dini** (Staf Stok Operasional) sesuai dengan 5 kategori bisnis aktual.

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

1. **Tab Navigasi Kategori (Scrollable Pastel Green Pills):**
   - Tab ramah sentuhan di mobile dan desktop: `[Semua Kategori] [Snack] [Minuman] [Ice Cream] [Konsinyasi External] [Konsinyasi Guru]` lengkap dengan badge jumlah item.
2. **Ringkasan Dashboard Terpisah:**
   - **Kartu 1:** *Total Nilai Stok Reguler (Snack, Minuman, Ice Cream)* untuk mengawasi modal kantin.
   - **Kartu 2:** *Total Kewajiban Setor Konsinyasi (External & Guru)* untuk memisahkan uang titipan supplier dan guru agar tidak tercampur dengan modal kantin.
3. **Form Input Dinamis (+ Tambah Stok / Titipan):**
   - Field input berganti otomatis mengikuti kategori yang dipilih.
   - Kalkulator otomatis harga dus snack dan kalkulasi sisa & total konsinyasi.
   - Autocomplete nama guru harian untuk staf Kak Dini.
4. **Buku Stok Responsif (Tabel & Card View):**
   - Tampilan tabel rapi di layar laptop/desktop Bu Shalatina.
   - Tampilan card interaktif di smartphone staf Kak Dini.
5. **Mode Dual (Online Google Sheets / Offline Local):**
   - Berjalan mandiri langsung di browser via LocalStorage dengan data auto-seed lengkap, serta dapat disambungkan ke Web App GAS hanya dengan memasukkan URL deployment.

---

## ⚙️ 3. Panduan Deployment Google Apps Script (GAS)

1. Buka [Google Sheets](https://sheets.new) baru.
2. Beri nama Spreadsheet, misalnya: `Database Kantin Al-Imam`.
3. Klik menu **Ekstensi (Extensions) > Apps Script**.
4. Buat file-file skrip berikut dari folder `gas/`:
   - `Setup.gs`: Berisi fungsi `setupDatabase()` dan konfigurasi schema 5 sheet + header warna pastel + auto-seed.
   - `StockController.gs`: Berisi logika CRUD dan kalkulasi dashboard.
   - `Code.gs`: Berisi endpoint API `doGet` dan `doPost`.
   - `appsscript.json`: Manifest proyek Apps Script.
5. Jalankan fungsi `setupDatabase()` satu kali di editor GAS untuk membuat ke-5 sheet dan mengisinya dengan data awal.
6. Klik tombol **Deploy > New Deployment (Penerapan Baru)**:
   - Pilih jenis: **Web App**.
   - Execute as: **Me (User deploying)**.
   - Who has access: **Anyone (Siapa saja)**.
7. Salin Web App URL yang dihasilkan (misal `https://script.google.com/macros/s/.../exec`).
8. Di aplikasi frontend, klik ikon database di pojok kanan atas, tempelkan URL tersebut, lalu simpan!

---

## 💻 4. Menjalankan Frontend

```bash
# Install dependensi (jika belum)
npm install

# Jalankan server pengembangan lokal
npm run dev

# Build untuk produksi
npm run build
```
Aplikasi siap digunakan oleh Bu Shalatina dan Kak Dini!
