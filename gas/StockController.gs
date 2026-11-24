/**
 * STOCK CONTROLLER - KANTIN AL-IMAM
 * Backend Controller untuk Pengelolaan 5 Kategori Produk & Sistem Mutasi Stok:
 * - SNACK (Sheet: Stock_Snack)
 * - MINUMAN (Sheet: Stock_Minuman)
 * - ICE CREAM (Sheet: Stock_IceCream)
 * - KONSINYASI EXTERNAL (Sheet: Konsinyasi_External)
 * - KONSINYASI GURU (Sheet: Konsinyasi_Guru)
 * - MUTASI STOCK (Sheet: Mutasi_Stock) -> Pemasukan & Pengeluaran Stok
 */

const CATEGORY_MAP = {
  snack: 'Stock_Snack',
  minuman: 'Stock_Minuman',
  ice_cream: 'Stock_IceCream',
  konsinyasi_external: 'Konsinyasi_External',
  konsinyasi_guru: 'Konsinyasi_Guru',
  mutasi_stock: 'Mutasi_Stock'
};

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

function getTimeFormatted() {
  const d = new Date();
  const pad = (n) => (n < 10 ? '0' + n : n);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/**
 * Mengambil semua data lengkap + ringkasan mutasi & dashboard
 */
function getAllData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const mutasiRows = getSheetRows(ss, CATEGORY_MAP.mutasi_stock);

  const result = {
    snack: getSheetRows(ss, CATEGORY_MAP.snack),
    minuman: getSheetRows(ss, CATEGORY_MAP.minuman),
    ice_cream: getSheetRows(ss, CATEGORY_MAP.ice_cream),
    konsinyasi_external: getSheetRows(ss, CATEGORY_MAP.konsinyasi_external),
    konsinyasi_guru: getSheetRows(ss, CATEGORY_MAP.konsinyasi_guru),
    mutasi: mutasiRows,
    mutasiAnalytics: calculateMutasiAnalytics(mutasiRows),
    teachersList: getUniqueTeachers(ss),
    dashboard: calculateDashboardMetrics(ss),
    lastSynced: getNowFormatted()
  };
  return result;
}

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

function normalizeKey(header) {
  return header
    .toString()
    .trim()
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s+(.)/g, (_, c) => c.toUpperCase())
    .replace(/\s/g, '')
    .replace(/^(.)/, (_, c) => c.toLowerCase());
}

function getUniqueTeachers(ss) {
  const sheet = ss.getSheetByName(CATEGORY_MAP.konsinyasi_guru);
  if (!sheet) return ['Bu Nurul', 'Bu Rahma', 'Ustadz Abdullah', 'Bu Shalatina', 'Kak Dini'];
  
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return ['Bu Nurul', 'Bu Rahma', 'Ustadz Abdullah', 'Bu Shalatina', 'Kak Dini'];
  
  const values = sheet.getRange(2, 3, lastRow - 1, 1).getValues().flat();
  const set = new Set(values.filter(v => v && String(v).trim().length > 0));
  
  ['Bu Nurul', 'Bu Rahma', 'Ustadz Abdullah', 'Bu Shalatina', 'Kak Dini'].forEach(t => set.add(t));
  return Array.from(set);
}

/**
 * Kalkulasi Analitik Mutasi Stok: Harian, Mingguan, Bulanan
 */
function calculateMutasiAnalytics(rows) {
  const todayStr = getTodayFormatted(); // "DD/MM/YYYY"
  const now = new Date();

  // Helper parsing date DD/MM/YYYY
  function parseDate(str) {
    if (!str) return null;
    if (str instanceof Date) return str;
    const s = String(str).trim();
    if (s.includes('/')) {
      const parts = s.split('/');
      if (parts.length === 3) {
        return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      }
    }
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }

  const daily = { masukQty: 0, masukNominal: 0, keluarQty: 0, keluarNominal: 0, transaksiCount: 0 };
  const weekly = { masukQty: 0, masukNominal: 0, keluarQty: 0, keluarNominal: 0, transaksiCount: 0 };
  const monthly = { masukQty: 0, masukNominal: 0, keluarQty: 0, keluarNominal: 0, transaksiCount: 0 };
  const allTime = { masukQty: 0, masukNominal: 0, keluarQty: 0, keluarNominal: 0, transaksiCount: 0 };

  const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  rows.forEach(item => {
    const tgl = parseDate(item.tanggal);
    const tipe = String(item.tipe || '').toUpperCase();
    const qty = Number(item.jumlah) || 0;
    const nominal = Number(item.totalNominal) || 0;

    allTime.transaksiCount++;
    if (tipe === 'MASUK') {
      allTime.masukQty += qty;
      allTime.masukNominal += nominal;
    } else {
      allTime.keluarQty += qty;
      allTime.keluarNominal += nominal;
    }

    if (!tgl) return;

    // 1. Harian (Hari Ini)
    const isToday = tgl.getDate() === now.getDate() && tgl.getMonth() === now.getMonth() && tgl.getFullYear() === now.getFullYear();
    if (isToday) {
      daily.transaksiCount++;
      if (tipe === 'MASUK') {
        daily.masukQty += qty;
        daily.masukNominal += nominal;
      } else {
        daily.keluarQty += qty;
        daily.keluarNominal += nominal;
      }
    }

    // 2. Mingguan (7 Hari Terakhir)
    if (tgl >= sevenDaysAgo) {
      weekly.transaksiCount++;
      if (tipe === 'MASUK') {
        weekly.masukQty += qty;
        weekly.masukNominal += nominal;
      } else {
        weekly.keluarQty += qty;
        weekly.keluarNominal += nominal;
      }
    }

    // 3. Bulanan (Bulan Ini)
    if (tgl.getMonth() === currentMonth && tgl.getFullYear() === currentYear) {
      monthly.transaksiCount++;
      if (tipe === 'MASUK') {
        monthly.masukQty += qty;
        monthly.masukNominal += nominal;
      } else {
        monthly.keluarQty += qty;
        monthly.keluarNominal += nominal;
      }
    }
  });

  return {
    daily: { ...daily, netNominal: daily.keluarNominal - daily.masukNominal },
    weekly: { ...weekly, netNominal: weekly.keluarNominal - weekly.masukNominal },
    monthly: { ...monthly, netNominal: monthly.keluarNominal - monthly.masukNominal },
    allTime: { ...allTime, netNominal: allTime.keluarNominal - allTime.masukNominal }
  };
}

/**
 * Catat Transaksi Mutasi Stok Masuk / Keluar Baru
 */
function recordMutasi(data, user = 'Petugas Kantin') {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CATEGORY_MAP.mutasi_stock);
  if (!sheet) {
    sheet = ss.insertSheet(CATEGORY_MAP.mutasi_stock);
  }

  const today = getTodayFormatted();
  const time = getTimeFormatted();
  const dateCompact = today.replace(/\//g, '');
  const count = Math.max(sheet.getLastRow(), 1);
  const newId = `MUT-${dateCompact}-${String(count).padStart(3, '0')}`;

  const jumlah = Number(data.jumlah) || 1;
  const hargaSatuan = Number(data.hargaSatuan) || 0;
  const totalNominal = Number(data.totalNominal) || (jumlah * hargaSatuan);

  const row = [
    newId,
    data.tanggal || today,
    data.waktu || time,
    String(data.tipe || 'MASUK').toUpperCase(),
    data.kategori || 'Umum',
    data.idProduk || '-',
    data.namaProduk || '',
    jumlah,
    data.satuan || 'Pcs',
    hargaSatuan,
    totalNominal,
    data.keterangan || '-',
    user
  ];

  sheet.appendRow(row);
  logAction('Mutasi_Stock', newId, data.tipe, `Mutasi ${data.tipe}: ${data.namaProduk} (${jumlah} ${data.satuan})`, user);

  return {
    success: true,
    message: `Mutasi ${data.tipe} berhasil dicatat: ${newId}`,
    mutasi: row
  };
}

function calculateDashboardMetrics(ss) {
  let nilaiStokReguler = 0;
  let totalItemReguler = 0;
  let totalStokMenipis = 0;

  // 1. SNACK
  const snackRows = getSheetRows(ss, CATEGORY_MAP.snack);
  snackRows.forEach(row => {
    totalItemReguler++;
    const hargaKarton = Number(row.hargaKartonLamaModal) || 0;
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

function updateItem(category, id, data, user = 'Staf Kantin') {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = CATEGORY_MAP[category];
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error('Sheet tidak ditemukan: ' + sheetName);
  
  const lastRow = sheet.getLastRow();
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
