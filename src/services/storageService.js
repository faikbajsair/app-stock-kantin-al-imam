import { INITIAL_SEED_DATA } from '../types/categoryData';

const STORAGE_KEY = 'kantin_alimam_stock_data_v2';
const GAS_URL_KEY = 'kantin_alimam_gas_url';

// Default GAS URL from user deployment
export const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycby1Pb1b6ElGZ4hR3tIwscdB-GxtIEGek5ZUPIiJy_50PI65AStVXxgkZzgDc_L0iGKHww/exec';

export const storageService = {
  getGasUrl() {
    const saved = localStorage.getItem(GAS_URL_KEY);
    if (saved !== null) {
      return saved;
    }
    // Default to deployed script if not explicitly customized
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
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Gagal membaca local storage:', e);
    }
    
    // Default seed data
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

  calculateMetrics(data) {
    if (!data) return {};

    // 1. Nilai Stok Reguler (Snack, Minuman, Ice Cream)
    let nilaiStokReguler = 0;
    let totalItemReguler = 0;
    let stokMenipis = 0;

    // Snack
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

    // Minuman
    (data.minuman || []).forEach(item => {
      totalItemReguler++;
      const harga = Number(item.harga1Karton) || 0;
      const stokStr = String(item.stokAktual || '');
      const num = Number(stokStr.replace(/[^0-9.]/g, '')) || 0;
      nilaiStokReguler += harga * (num > 0 ? num : 1);
      
      const min = Number(item.stokMinimum) || 0;
      if (num <= min) stokMenipis++;
    });

    // Ice Cream
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
