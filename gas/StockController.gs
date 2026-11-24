/**
 * STOCK CONTROLLER - KANTIN AL-IMAM
 * Backend Controller untuk Pengelolaan 5 Kategori Produk Kantin:
 * - SNACK (Sheet: Stock_Snack)
 * - MINUMAN (Sheet: Stock_Minuman)
 * - ICE CREAM (Sheet: Stock_IceCream)
 * - KONSINYASI EXTERNAL (Sheet: Konsinyasi_External)
 * - KONSINYASI GURU (Sheet: Konsinyasi_Guru)
 */

const CATEGORY_MAP = {
  snack: 'Stock_Snack',
  minuman: 'Stock_Minuman',
  ice_cream: 'Stock_IceCream',
  konsinyasi_external: 'Konsinyasi_External',
  konsinyasi_guru: 'Konsinyasi_Guru'
};

/**
 * Format tanggal Indonesia DD/MM/YYYY HH:mm:ss
 */
function getNowFormatted() {
  const d = new Date();
  const pad = (n) => (n < 10 ? '0' + n : n);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function getTodayFormatted() {
  const d = new Date();
  const pad = (n) => (n < 10 ? '0' + n : n);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/**
 * Mengambil semua data dari ke-5 kategori + ringkasan dashboard
 */
function getAllData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const result = {
    snack: getSheetRows(ss, CATEGORY_MAP.snack),
    minuman: getSheetRows(ss, CATEGORY_MAP.minuman),
    ice_cream: getSheetRows(ss, CATEGORY_MAP.ice_cream),
    konsinyasi_external: getSheetRows(ss, CATEGORY_MAP.konsinyasi_external),
    konsinyasi_guru: getSheetRows(ss, CATEGORY_MAP.konsinyasi_guru),
    teachersList: getUniqueTeachers(ss),
    dashboard: calculateDashboardMetrics(ss),
    lastSynced: getNowFormatted()
  };
  return result;
}

/**
 * Helper membaca baris sheet menjadi array of object
 */
function getSheetRows(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow <= 1 || lastCol === 0) return [];
  
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const data = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  
  return data.map((row, index) => {
    const item = { rowIndex: index + 2 };
    headers.forEach((header, colIdx) => {
      const key = normalizeKey(header);
      item[key] = row[colIdx];
    });
    return item;
  });
}

/**
 * Normalisasi header menjadi camelCase key
 */
function normalizeKey(header) {
  return header
    .toString()
    .trim()
    .replace(/\s*\([^)]*\)/g, '') // hilangkan kurung (Pcs), dll.
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s+(.)/g, (_, c) => c.toUpperCase())
    .replace(/\s/g, '')
    .replace(/^(.)/, (_, c) => c.toLowerCase());
}

/**
 * Autocomplete nama guru dari riwayat Konsinyasi_Guru
 */
function getUniqueTeachers(ss) {
  const sheet = ss.getSheetByName(CATEGORY_MAP.konsinyasi_guru);
  if (!sheet) return ['Bu Nurul', 'Bu Rahma', 'Ustadz Abdullah', 'Bu Shalatina', 'Kak Dini'];
  
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return ['Bu Nurul', 'Bu Rahma', 'Ustadz Abdullah', 'Bu Shalatina', 'Kak Dini'];
  
  // Kolom C adalah Nama Guru (index col 3)
  const values = sheet.getRange(2, 3, lastRow - 1, 1).getValues().flat();
  const set = new Set(values.filter(v => v && String(v).trim().length > 0));
  
  // Default minimal
  ['Bu Nurul', 'Bu Rahma', 'Ustadz Abdullah', 'Bu Shalatina', 'Kak Dini'].forEach(t => set.add(t));
  return Array.from(set);
}

/**
 * Hitung Metrik Dashboard:
 * 1. Total Nilai Stok Reguler (Snack, Minuman, Ice Cream)
 * 2. Total Kewajiban Setor Konsinyasi (External & Guru) yang Belum Lunas/Disetor
 */
function calculateDashboardMetrics(ss) {
  let nilaiStokReguler = 0;
  let totalItemReguler = 0;
  let totalStokMenipis = 0;

  // 1. SNACK
  const snackRows = getSheetRows(ss, CATEGORY_MAP.snack);
  snackRows.forEach(row => {
    totalItemReguler++;
    const hargaKarton = Number(row.hargaKartonLamaModal) || 0;
    // Ekstrak perkiraan karton jika ada angka
    const stokStr = String(row.stokAktual || '');
    const kartonMatch = stokStr.match(/(\d+)\s*karton/i);
    const dusMatch = stokStr.match(/(\d+)\s*dus/i);
    const kartonQty = kartonMatch ? Number(kartonMatch[1]) : 1;
    const dusQty = dusMatch ? Number(dusMatch[1]) : 0;
    const hargaDus = Number(row.hargaPerdus) || (hargaKarton > 0 ? hargaKarton / 6 : 0);
    
    const nilaiItem = (kartonQty * hargaKarton) + (dusQty * hargaDus);
    nilaiStokReguler += nilaiItem > 0 ? nilaiItem : hargaKarton;
  });

  // 2. MINUMAN
  const minumanRows = getSheetRows(ss, CATEGORY_MAP.minuman);
  minumanRows.forEach(row => {
    totalItemReguler++;
    const harga = Number(row.harga1Karton) || 0;
    const stokStr = String(row.stokAktual || '');
    const num = Number(stokStr.replace(/[^0-9.]/g, '')) || 0;
    nilaiStokReguler += harga * (num > 0 ? num : 1);
    
    const min = Number(row.stokMinimum) || 0;
    if (num <= min) totalStokMenipis++;
  });

  // 3. ICE CREAM
  const iceRows = getSheetRows(ss, CATEGORY_MAP.ice_cream);
  iceRows.forEach(row => {
    totalItemReguler++;
    const harga = Number(row.harga1Karton) || 0;
    const stokStr = String(row.stokAktual || '');
    const num = Number(stokStr.replace(/[^0-9.]/g, '')) || 0;
    nilaiStokReguler += harga * (num > 0 ? num : 1);
    
    const min = Number(row.stokMinimum) || 0;
    if (num <= min) totalStokMenipis++;
  });

  // 4. KONSINYASI EXTERNAL
  let kewajibanExternal = 0;
  let totalExternalBelumLunas = 0;
  const extRows = getSheetRows(ss, CATEGORY_MAP.konsinyasi_external);
  extRows.forEach(row => {
    const status = String(row.statusBayar || '').toLowerCase();
    const totalHarga = Number(row.totalHarga) || 0;
    if (status.includes('belum')) {
      kewajibanExternal += totalHarga;
      totalExternalBelumLunas++;
    }
  });

  // 5. KONSINYASI GURU
  let kewajibanGuru = 0;
  let totalGuruBelumSetor = 0;
  const guruRows = getSheetRows(ss, CATEGORY_MAP.konsinyasi_guru);
  guruRows.forEach(row => {
    const status = String(row.statusSetorKeGuru || '').toLowerCase();
    const totalHarga = Number(row.totalHarga) || 0;
    if (status.includes('belum')) {
      kewajibanGuru += totalHarga;
      totalGuruBelumSetor++;
    }
  });

  return {
    nilaiStokReguler,
    totalItemReguler,
    totalStokMenipis,
    kewajibanExternal,
    kewajibanGuru,
    totalKewajibanKonsinyasi: kewajibanExternal + kewajibanGuru,
    totalExternalBelumLunas,
    totalGuruBelumSetor
  };
}

/**
 * Tambah Item Baru ke Kategori Tertentu
 */
function addItem(category, data, user = 'Staf Kantin') {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = CATEGORY_MAP[category];
  if (!sheetName) throw new Error('Kategori tidak valid: ' + category);
  
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error('Sheet tidak ditemukan: ' + sheetName);
  
  const now = getNowFormatted();
  const today = getTodayFormatted();
  const idPrefix = {
    snack: 'SNK',
    minuman: 'MNM',
    ice_cream: 'ICE',
    konsinyasi_external: 'EXT',
    konsinyasi_guru: 'GRU'
  }[category] || 'PRD';
  
  const rowCount = Math.max(sheet.getLastRow(), 1);
  const newId = `${idPrefix}-${String(rowCount).padStart(3, '0')}`;
  
  let newRow = [];
  
  switch (category) {
    case 'snack': {
      // Kalkulasi Harga Perdus otomatis jika belum diisi
      const isiKarton = Number(data.isi1KartonPcs) || 1;
      const hargaKarton = Number(data.hargaKartonLamaModal) || 0;
      const isiPerdus = Number(data.isiPcsPerdus) || 1;
      const hargaPerdus = Number(data.hargaPerdus) || Math.round((hargaKarton / isiKarton) * isiPerdus);
      
      newRow = [
        newId,
        data.namaProduk || '',
        isiKarton,
        hargaKarton,
        isiPerdus,
        hargaPerdus,
        data.stokAktual || '0 Karton, 0 Dus',
        now
      ];
      break;
    }
    
    case 'minuman': {
      newRow = [
        newId,
        data.namaProduk || '',
        Number(data.harga1Karton) || 0,
        data.stokAktual || '0 Karton',
        Number(data.stokMinimum) || 5,
        now
      ];
      break;
    }
    
    case 'ice_cream': {
      newRow = [
        newId,
        data.namaProduk || '',
        Number(data.harga1Karton) || 0,
        data.stokAktual || '0 Box',
        Number(data.stokMinimum) || 2,
        now
      ];
      break;
    }
    
    case 'konsinyasi_external': {
      const stock = Number(data.stockMasukPcs) || 0;
      const hargaSatuan = Number(data.hargaSatuan) || 0;
      const totalHarga = Number(data.totalHarga) || (stock * hargaSatuan);
      const terjual = Number(data.terjual) || 0;
      const sisa = data.sisaRetur !== undefined ? Number(data.sisaRetur) : (stock - terjual);
      
      newRow = [
        newId,
        data.tanggal || today,
        data.namaProdukSupplier || '',
        stock,
        terjual,
        sisa,
        hargaSatuan,
        totalHarga,
        data.statusBayar || 'Belum'
      ];
      break;
    }
    
    case 'konsinyasi_guru': {
      const jumlah = Number(data.jumlahProdukPcs) || 0;
      const terjual = Number(data.terjualPcs) || 0;
      const sisa = data.sisa !== undefined ? Number(data.sisa) : (jumlah - terjual);
      const hargaSatuan = Number(data.hargaSatuan) || 0;
      const totalHarga = Number(data.totalHarga) || (terjual * hargaSatuan);
      
      newRow = [
        newId,
        data.tanggal || today,
        data.namaGuru || '',
        data.namaProduk || '',
        jumlah,
        terjual,
        sisa,
        hargaSatuan,
        totalHarga,
        data.statusSetorKeGuru || 'Belum'
      ];
      break;
    }
  }
  
  sheet.appendRow(newRow);
  logAction(sheetName, newId, 'CREATE', `Tambah item: ${data.namaProduk || data.namaProdukSupplier}`, user);
  
  return {
    success: true,
    message: `Item berhasil ditambahkan ke ${sheetName}`,
    id: newId,
    item: newRow
  };
}

/**
 * Update Data Item berdasarkan ID
 */
function updateItem(category, id, data, user = 'Staf Kantin') {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = CATEGORY_MAP[category];
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error('Sheet tidak ditemukan: ' + sheetName);
  
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  const idColValues = sheet.getRange(2, 1, Math.max(lastRow - 1, 1), 1).getValues().flat();
  
  const rowIndex = idColValues.findIndex(val => String(val).trim() === String(id).trim());
  if (rowIndex === -1) throw new Error('Item ID ' + id + ' tidak ditemukan');
  
  const targetRow = rowIndex + 2;
  const now = getNowFormatted();
  
  switch (category) {
    case 'snack': {
      const isiKarton = Number(data.isi1KartonPcs) || 1;
      const hargaKarton = Number(data.hargaKartonLamaModal) || 0;
      const isiPerdus = Number(data.isiPcsPerdus) || 1;
      const hargaPerdus = Number(data.hargaPerdus) || Math.round((hargaKarton / isiKarton) * isiPerdus);
      
      sheet.getRange(targetRow, 2, 1, 7).setValues([[
        data.namaProduk,
        isiKarton,
        hargaKarton,
        isiPerdus,
        hargaPerdus,
        data.stokAktual,
        now
      ]]);
      break;
    }
    
    case 'minuman': {
      sheet.getRange(targetRow, 2, 1, 5).setValues([[
        data.namaProduk,
        Number(data.harga1Karton) || 0,
        data.stokAktual,
        Number(data.stokMinimum) || 5,
        now
      ]]);
      break;
    }
    
    case 'ice_cream': {
      sheet.getRange(targetRow, 2, 1, 5).setValues([[
        data.namaProduk,
        Number(data.harga1Karton) || 0,
        data.stokAktual,
        Number(data.stokMinimum) || 2,
        now
      ]]);
      break;
    }
    
    case 'konsinyasi_external': {
      const stock = Number(data.stockMasukPcs) || 0;
      const terjual = Number(data.terjual) || 0;
      const sisa = data.sisaRetur !== undefined ? Number(data.sisaRetur) : (stock - terjual);
      const hargaSatuan = Number(data.hargaSatuan) || 0;
      const totalHarga = Number(data.totalHarga) || (stock * hargaSatuan);
      
      sheet.getRange(targetRow, 2, 1, 8).setValues([[
        data.tanggal,
        data.namaProdukSupplier,
        stock,
        terjual,
        sisa,
        hargaSatuan,
        totalHarga,
        data.statusBayar
      ]]);
      break;
    }
    
    case 'konsinyasi_guru': {
      const jumlah = Number(data.jumlahProdukPcs) || 0;
      const terjual = Number(data.terjualPcs) || 0;
      const sisa = data.sisa !== undefined ? Number(data.sisa) : (jumlah - terjual);
      const hargaSatuan = Number(data.hargaSatuan) || 0;
      const totalHarga = Number(data.totalHarga) || (terjual * hargaSatuan);
      
      sheet.getRange(targetRow, 2, 1, 9).setValues([[
        data.tanggal,
        data.namaGuru,
        data.namaProduk,
        jumlah,
        terjual,
        sisa,
        hargaSatuan,
        totalHarga,
        data.statusSetorKeGuru
      ]]);
      break;
    }
  }
  
  logAction(sheetName, id, 'UPDATE', `Update item: ${data.namaProduk || data.namaProdukSupplier}`, user);
  
  return {
    success: true,
    message: `Item ID ${id} berhasil diperbarui`
  };
}

/**
 * Update Status Cepat Konsinyasi (Lunas / Belum Lunas atau Sudah / Belum Setor)
 */
function updateKonsinyasiStatus(category, id, newStatus, user = 'Bu Shalatina') {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = CATEGORY_MAP[category];
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error('Sheet tidak ditemukan: ' + sheetName);
  
  const lastRow = sheet.getLastRow();
  const idColValues = sheet.getRange(2, 1, Math.max(lastRow - 1, 1), 1).getValues().flat();
  const rowIndex = idColValues.findIndex(val => String(val).trim() === String(id).trim());
  if (rowIndex === -1) throw new Error('ID ' + id + ' tidak ditemukan');
  
  const targetRow = rowIndex + 2;
  const statusCol = category === 'konsinyasi_external' ? 9 : 10;
  
  sheet.getRange(targetRow, statusCol).setValue(newStatus);
  logAction(sheetName, id, 'UPDATE_STATUS', `Ubah status menjadi ${newStatus}`, user);
  
  return {
    success: true,
    message: `Status ID ${id} berhasil diubah menjadi ${newStatus}`
  };
}

/**
 * Hapus Item
 */
function deleteItem(category, id, user = 'Staf Kantin') {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = CATEGORY_MAP[category];
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error('Sheet tidak ditemukan: ' + sheetName);
  
  const lastRow = sheet.getLastRow();
  const idColValues = sheet.getRange(2, 1, Math.max(lastRow - 1, 1), 1).getValues().flat();
  const rowIndex = idColValues.findIndex(val => String(val).trim() === String(id).trim());
  if (rowIndex === -1) throw new Error('ID ' + id + ' tidak ditemukan');
  
  const targetRow = rowIndex + 2;
  sheet.deleteRow(targetRow);
  logAction(sheetName, id, 'DELETE', `Hapus item ID ${id}`, user);
  
  return {
    success: true,
    message: `Item ID ${id} berhasil dihapus`
  };
}

/**
 * Log Audit Aksi ke sheet Log_Transaksi
 */
function logAction(sheetName, id, action, note, user) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let logSheet = ss.getSheetByName('Log_Transaksi');
    if (!logSheet) {
      logSheet = ss.insertSheet('Log_Transaksi');
      logSheet.appendRow(['Timestamp', 'Kategori', 'ID Produk', 'Aksi', 'Keterangan', 'Petugas']);
    }
    logSheet.appendRow([getNowFormatted(), sheetName, id, action, note, user]);
  } catch (e) {
    console.error('Gagal mencatat log:', e);
  }
}
