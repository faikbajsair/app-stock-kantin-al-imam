import { INITIAL_SEED_DATA } from '../types/categoryData';

const STORAGE_KEY = 'kantin_alimam_stock_data_v2';
const GAS_URL_KEY = 'kantin_alimam_gas_url';

export const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycby1Pb1b6ElGZ4hR3tIwscdB-GxtIEGek5ZUPIiJy_50PI65AStVXxgkZzgDc_L0iGKHww/exec';

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

export const storageService = {
  getGasUrl() {
    const saved = localStorage.getItem(GAS_URL_KEY);
    if (saved !== null) {
      return saved;
    }
    localStorage.setItem(GAS_URL_KEY, DEFAULT_GAS_URL);
    return DEFAULT_GAS_URL;
  },

  setGasUrl(url) {
    if (url) {
      localStorage.setItem(GAS_URL_KEY, url.trim());
    } else {
      localStorage.setItem(GAS_URL_KEY, '');
    }
  },

  loadLocalData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.mutasi || parsed.mutasi.length === 0) {
          parsed.mutasi = INITIAL_SEED_DATA.mutasi;
        }
        return parsed;
      }
    } catch (e) {
      console.error('Gagal membaca local storage:', e);
    }
    
    const initial = JSON.parse(JSON.stringify(INITIAL_SEED_DATA));
    this.saveLocalData(initial);
    return initial;
  },

  saveLocalData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Gagal menyimpan ke local storage:', e);
    }
  },

  resetSeed() {
    const initial = JSON.parse(JSON.stringify(INITIAL_SEED_DATA));
    this.saveLocalData(initial);
    return initial;
  },

  calculateMutasiAnalytics(mutasiList = []) {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const daily = { masukQty: 0, masukNominal: 0, keluarQty: 0, keluarNominal: 0, count: 0 };
    const weekly = { masukQty: 0, masukNominal: 0, keluarQty: 0, keluarNominal: 0, count: 0 };
    const monthly = { masukQty: 0, masukNominal: 0, keluarQty: 0, keluarNominal: 0, count: 0 };
    const allTime = { masukQty: 0, masukNominal: 0, keluarQty: 0, keluarNominal: 0, count: 0 };

    mutasiList.forEach(item => {
      const tgl = parseDate(item.tanggal);
      const tipe = String(item.tipe || '').toUpperCase();
      const qty = Number(item.jumlah) || 0;
      const nominal = Number(item.totalNominal) || 0;

      allTime.count++;
      if (tipe === 'MASUK') {
        allTime.masukQty += qty;
        allTime.masukNominal += nominal;
      } else {
        allTime.keluarQty += qty;
        allTime.keluarNominal += nominal;
      }

      if (!tgl) return;

      // 1. Hari ini (Daily)
      const isToday = tgl.getDate() === now.getDate() && tgl.getMonth() === now.getMonth() && tgl.getFullYear() === now.getFullYear();
      if (isToday) {
        daily.count++;
        if (tipe === 'MASUK') {
          daily.masukQty += qty;
          daily.masukNominal += nominal;
        } else {
          daily.keluarQty += qty;
          daily.keluarNominal += nominal;
        }
      }

      // 2. Minggu ini (Weekly / 7 Hari)
      if (tgl >= sevenDaysAgo) {
        weekly.count++;
        if (tipe === 'MASUK') {
          weekly.masukQty += qty;
          weekly.masukNominal += nominal;
        } else {
          weekly.keluarQty += qty;
          weekly.keluarNominal += nominal;
        }
      }

      // 3. Bulan ini (Monthly)
      if (tgl.getMonth() === currentMonth && tgl.getFullYear() === currentYear) {
        monthly.count++;
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
  },

  calculateMetrics(data) {
    if (!data) return {};

    // 1. Nilai Stok Reguler (Snack, Minuman, Ice Cream)
    let nilaiStokReguler = 0;
    let totalItemReguler = 0;
    let stokMenipis = 0;

    (data.snack || []).forEach(item => {
      totalItemReguler++;
      const hargaKarton = Number(item.hargaKartonLamaModal || item.hargaKarton) || 0;
      const stokStr = String(item.stokAktual || '');
      const kMatch = stokStr.match(/(\d+)\s*karton/i);
      const dMatch = stokStr.match(/(\d+)\s*dus/i);
      const kQty = kMatch ? Number(kMatch[1]) : 1;
      const dQty = dMatch ? Number(dMatch[1]) : 0;
      const hargaDus = Number(item.hargaPerdus) || (hargaKarton > 0 ? Math.round(hargaKarton / 6) : 0);
      const totalNilai = (kQty * hargaKarton) + (dQty * hargaDus);
      nilaiStokReguler += totalNilai > 0 ? totalNilai : hargaKarton;
    });

    (data.minuman || []).forEach(item => {
      totalItemReguler++;
      const harga = Number(item.harga1Karton) || 0;
      const stokStr = String(item.stokAktual || '');
      const num = Number(stokStr.replace(/[^0-9.]/g, '')) || 0;
      nilaiStokReguler += harga * (num > 0 ? num : 1);
      
      const min = Number(item.stokMinimum) || 0;
      if (num <= min) stokMenipis++;
    });

    (data.ice_cream || []).forEach(item => {
      totalItemReguler++;
      const harga = Number(item.harga1Karton) || 0;
      const stokStr = String(item.stokAktual || '');
      const num = Number(stokStr.replace(/[^0-9.]/g, '')) || 0;
      nilaiStokReguler += harga * (num > 0 ? num : 1);

      const min = Number(item.stokMinimum) || 0;
      if (num <= min) stokMenipis++;
    });

    // 2. Kewajiban Setor Konsinyasi (External & Guru)
    let kewajibanExternal = 0;
    let totalExternalBelumLunas = 0;
    (data.konsinyasi_external || []).forEach(item => {
      const status = String(item.statusBayar || '').toLowerCase();
      const total = Number(item.totalHarga) || 0;
      if (status.includes('belum')) {
        kewajibanExternal += total;
        totalExternalBelumLunas++;
      }
    });

    let kewajibanGuru = 0;
    let totalGuruBelumSetor = 0;
    (data.konsinyasi_guru || []).forEach(item => {
      const status = String(item.statusSetorKeGuru || '').toLowerCase();
      const total = Number(item.totalHarga) || 0;
      if (status.includes('belum')) {
        kewajibanGuru += total;
        totalGuruBelumSetor++;
      }
    });

    return {
      nilaiStokReguler,
      totalItemReguler,
      stokMenipis,
      kewajibanExternal,
      kewajibanGuru,
      totalKewajibanKonsinyasi: kewajibanExternal + kewajibanGuru,
      totalExternalBelumLunas,
      totalGuruBelumSetor
    };
  }
};
