/**
 * SETUP DATABASE SPREADSHEET KANTIN AL-IMAM
 * Menyiapkan 6 Sheet Terpisah sesuai Kategori Bisnis Aktual Kantin:
 * 1. Stock_Snack
 * 2. Stock_Minuman
 * 3. Stock_IceCream
 * 4. Konsinyasi_External
 * 5. Konsinyasi_Guru
 * 6. Mutasi_Stock (Pemasukan & Pengeluaran Stok Harian, Mingguan, Bulanan)
 * 7. Log_Transaksi (Audit Trail)
 */

const SHEET_NAMES = {
  SNACK: 'Stock_Snack',
  MINUMAN: 'Stock_Minuman',
  ICE_CREAM: 'Stock_IceCream',
  KONSINYASI_EXTERNAL: 'Konsinyasi_External',
  KONSINYASI_GURU: 'Konsinyasi_Guru',
  MUTASI_STOCK: 'Mutasi_Stock',
  LOG_TRANSAKSI: 'Log_Transaksi'
};

const SHEET_SCHEMAS = {
  [SHEET_NAMES.SNACK]: {
    headers: [
      'ID',
      'Nama Produk',
      'Isi 1 Karton (Pcs)',
      'Harga Karton (Lama/Modal)',
      'Isi Pcs Perdus',
      'Harga Perdus',
      'Stok Aktual (Karton/Dus/Pcs)',
      'Last Update'
    ],
    headerColor: '#A7D7C5',
    seedData: [
      ['SNK-001', 'Beng-Beng Wafer', 120, 210000, 20, 35000, '2 Karton, 3 Dus', '24/11/2026 10:00:00'],
      ['SNK-002', 'Nabati Richeese Wafer', 120, 180000, 20, 30000, '1 Karton, 5 Dus', '24/11/2026 10:00:00'],
      ['SNK-003', 'Chitato Lite Truffle', 60, 240000, 10, 40000, '3 Karton, 0 Dus', '24/11/2026 10:00:00'],
      ['SNK-004', 'Oreo Biscuit Roll', 144, 288000, 24, 48000, '1 Karton, 2 Dus', '24/11/2026 10:00:00'],
      ['SNK-005', 'SilverQueen Chunky Bar', 60, 450000, 12, 90000, '0 Karton, 4 Dus', '24/11/2026 10:00:00']
    ]
  },

  [SHEET_NAMES.MINUMAN]: {
    headers: [
      'ID',
      'Nama Produk',
      'Harga 1 Karton',
      'Stok Aktual (Karton/Pcs)',
      'Stok Minimum',
      'Last Update'
    ],
    headerColor: '#BEE7E8',
    seedData: [
      ['MNM-001', 'Stee', 35000, '15 Karton', 5, '24/11/2026 10:00:00'],
      ['MNM-002', 'Fruit tea', 47000, '12 Karton', 4, '24/11/2026 10:00:00'],
      ['MNM-003', 'Teh Botol', 70000, '20 Karton', 5, '24/11/2026 10:00:00'],
      ['MNM-004', 'Prima 600', 45000, '25 Karton', 8, '24/11/2026 10:00:00'],
      ['MNM-005', 'Prima 1.5', 47000, '18 Karton', 6, '24/11/2026 10:00:00'],
      ['MNM-006', 'Minute Maid', 58200, '8 Karton', 3, '24/11/2026 10:00:00'],
      ['MNM-007', 'Es Batu', 20000, '30 Bungkus', 10, '24/11/2026 10:00:00'],
      ['MNM-008', 'Chokolatos Drink', 19900, '14 Karton', 4, '24/11/2026 10:00:00'],
      ['MNM-009', 'Good Day', 22900, '16 Karton', 5, '24/11/2026 10:00:00']
    ]
  },

  [SHEET_NAMES.ICE_CREAM]: {
    headers: [
      'ID',
      'Nama Produk',
      'Harga 1 Karton',
      'Stok Aktual',
      'Stok Minimum',
      'Last Update'
    ],
    headerColor: '#D8F3DC',
    seedData: [
      ['ICE-001', 'Neopolitan', 115200, '6 Box', 2, '24/11/2026 10:00:00'],
      ['ICE-002', 'Reguler', 86400, '8 Box', 3, '24/11/2026 10:00:00'],
      ['ICE-003', 'Choco dip', 96000, '5 Box', 2, '24/11/2026 10:00:00'],
      ['ICE-004', 'Loly pop', 48000, '10 Box', 3, '24/11/2026 10:00:00'],
      ['ICE-005', 'Choconut', 135000, '4 Box', 2, '24/11/2026 10:00:00'],
      ['ICE-006', 'Polar pop', 96000, '7 Box', 2, '24/11/2026 10:00:00'],
      ['ICE-007', 'Magic', 96000, '9 Box', 3, '24/11/2026 10:00:00'],
      ['ICE-008', 'Fruty pop / Popeye', 84000, '6 Box', 2, '24/11/2026 10:00:00']
    ]
  },

  [SHEET_NAMES.KONSINYASI_EXTERNAL]: {
    headers: [
      'ID',
      'Tanggal',
      'Nama Produk / Supplier',
      'Stock Masuk (Pcs)',
      'Terjual',
      'Sisa/Retur',
      'Harga Satuan',
      'Total Harga',
      'Status Bayar (Belum/Lunas)'
    ],
    headerColor: '#FFE5D9',
    seedData: [
      ['EXT-001', '23/11/2026', 'Sari Roti', 27, 27, 0, 4703, 127000, 'Belum'],
      ['EXT-002', '24/11/2026', 'Roti Aoka', 40, 35, 5, 2500, 87500, 'Belum'],
      ['EXT-003', '24/11/2026', 'Donat Madu Cihanjuang', 24, 24, 0, 3500, 84000, 'Lunas']
    ]
  },

  [SHEET_NAMES.KONSINYASI_GURU]: {
    headers: [
      'ID',
      'Tanggal',
      'Nama Guru',
      'Nama Produk',
      'Jumlah Produk (Pcs)',
      'Terjual (Pcs)',
      'Sisa',
      'Harga Satuan',
      'Total Harga',
      'Status Setor ke Guru (Belum/Sudah)'
    ],
    headerColor: '#D8E2DC',
    seedData: [
      ['GRU-001', '24/11/2026', 'Bu Nurul', 'Baso goreng', 30, 28, 2, 2000, 56000, 'Belum'],
      ['GRU-002', '24/11/2026', 'Bu Rahma', 'Pastel Ayam Sayur', 25, 25, 0, 3000, 75000, 'Belum'],
      ['GRU-003', '24/11/2026', 'Ustadz Abdullah', 'Kue Lemper Bakar', 20, 20, 0, 2500, 50000, 'Sudah'],
      ['GRU-004', '24/11/2026', 'Bu Shalatina', 'Puding Coklat Fla', 15, 12, 3, 3000, 36000, 'Belum']
    ]
  },

  [SHEET_NAMES.MUTASI_STOCK]: {
    headers: [
      'ID Transaksi',
      'Tanggal',
      'Waktu',
      'Tipe',
      'Kategori',
      'ID Produk',
      'Nama Produk',
      'Jumlah',
      'Satuan',
      'Harga Satuan (Rp)',
      'Total Nominal (Rp)',
      'Keterangan',
      'Petugas'
    ],
    headerColor: '#C8E6C9', // Soft Mint Green
    seedData: [
      // HARI INI (24/11/2026)
      ['MUT-20261124-001', '24/11/2026', '07:30:00', 'MASUK', 'Minuman', 'MNM-003', 'Teh Botol', 5, 'Karton', 70000, 350000, 'Kulakan agen pagi', 'Kak Dini'],
      ['MUT-20261124-002', '24/11/2026', '07:45:00', 'MASUK', 'Konsinyasi Guru', 'GRU-001', 'Baso goreng', 30, 'Pcs', 2000, 60000, 'Titipan harian Bu Nurul', 'Kak Dini'],
      ['MUT-20261124-003', '24/11/2026', '09:40:00', 'KELUAR', 'Snack', 'SNK-001', 'Beng-Beng Wafer', 20, 'Pcs', 2500, 50000, 'Penjualan istirahat 1', 'Kak Dini'],
      ['MUT-20261124-004', '24/11/2026', '12:15:00', 'KELUAR', 'Minuman', 'MNM-003', 'Teh Botol', 24, 'Botol', 4000, 96000, 'Penjualan istirahat 2', 'Kak Dini'],
      ['MUT-20261124-005', '24/11/2026', '13:00:00', 'KELUAR', 'Konsinyasi Guru', 'GRU-001', 'Baso goreng', 28, 'Pcs', 2500, 70000, 'Penjualan titipan harian', 'Kak Dini'],
      ['MUT-20261124-006', '24/11/2026', '13:30:00', 'KELUAR', 'Konsinyasi External', 'EXT-001', 'Sari Roti', 27, 'Pcs', 5500, 148500, 'Penjualan Sari Roti habis', 'Kak Dini'],

      // MINGGU INI (20/11 - 23/11/2026)
      ['MUT-20261123-001', '23/11/2026', '08:00:00', 'MASUK', 'Konsinyasi External', 'EXT-001', 'Sari Roti', 27, 'Pcs', 4700, 126900, 'Dropping supplier Sari Roti', 'Bu Shalatina'],
      ['MUT-20261122-001', '22/11/2026', '09:00:00', 'MASUK', 'Minuman', 'MNM-001', 'Stee', 10, 'Karton', 35000, 350000, 'Restock agen minuman', 'Kak Dini'],
      ['MUT-20261122-002', '22/11/2026', '14:00:00', 'KELUAR', 'Minuman', 'MNM-001', 'Stee', 8, 'Karton', 48000, 384000, 'Penjualan kantin harian', 'Kak Dini'],
      ['MUT-20261121-001', '21/11/2026', '10:00:00', 'MASUK', 'Ice Cream', 'ICE-001', 'Neopolitan', 4, 'Box', 115200, 460800, 'Restock freezer Campina', 'Bu Shalatina'],
      ['MUT-20261121-002', '21/11/2026', '14:30:00', 'KELUAR', 'Ice Cream', 'ICE-001', 'Neopolitan', 2, 'Box', 140000, 280000, 'Penjualan es krim siang', 'Kak Dini'],

      // BULAN INI (November 2026)
      ['MUT-20261110-001', '10/11/2026', '08:30:00', 'MASUK', 'Minuman', 'MNM-004', 'Prima 600', 20, 'Karton', 45000, 900000, 'Stok air mineral bulanan', 'Bu Shalatina'],
      ['MUT-20261115-001', '15/11/2026', '15:00:00', 'KELUAR', 'Minuman', 'MNM-004', 'Prima 600', 15, 'Karton', 60000, 900000, 'Penjualan air mineral', 'Kak Dini']
    ]
  },

  [SHEET_NAMES.LOG_TRANSAKSI]: {
    headers: [
      'Timestamp',
      'Kategori',
      'ID Produk',
      'Aksi',
      'Keterangan',
      'Petugas'
    ],
    headerColor: '#ECE4DB',
    seedData: [
      ['24/11/2026 08:00:00', 'SISTEM', 'ALL', 'SETUP_DATABASE', 'Inisialisasi Database Kantin Al-Imam v2.1', 'Sistem']
    ]
  }
};

/**
 * Eksekusi inisialisasi / reset database kantin Al-Imam
 */
function setupDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  Object.keys(SHEET_SCHEMAS).forEach(sheetName => {
    let sheet = ss.getSheetByName(sheetName);
    const config = SHEET_SCHEMAS[sheetName];
    
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    } else {
      sheet.clear();
    }
    
    // Set Header
    const headerRange = sheet.getRange(1, 1, 1, config.headers.length);
    headerRange.setValues([config.headers]);
    headerRange.setBackground(config.headerColor);
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
    headerRange.setVerticalAlignment('middle');
    headerRange.setFontColor('#1E3A2F');
    
    // Auto Freeze Row 1
    sheet.setFrozenRows(1);
    
    // Isi Seed Data jika ada
    if (config.seedData && config.seedData.length > 0) {
      const dataRange = sheet.getRange(2, 1, config.seedData.length, config.headers.length);
      dataRange.setValues(config.seedData);
      dataRange.setVerticalAlignment('middle');
    }
    
    // Auto Resize Columns
    sheet.autoResizeColumns(1, config.headers.length);
    sheet.setRowHeight(1, 36);
  });
  
  // Hapus sheet default "Sheet1" jika ada
  const defaultSheet = ss.getSheetByName('Sheet1') || ss.getSheetByName('Sheet 1');
  if (defaultSheet && ss.getSheets().length > 1) {
    try {
      ss.deleteSheet(defaultSheet);
    } catch (e) {
      console.log('Sheet1 tidak dihapus:', e.message);
    }
  }
  
  return {
    success: true,
    message: 'Database Kantin Al-Imam berhasil di-setup lengkap dengan Sistem Mutasi Stok Masuk & Keluar!',
    sheets: Object.keys(SHEET_SCHEMAS)
  };
}
