import { storageService } from './storageService';

function formatDate(val) {
  if (!val) return '';
  if (typeof val === 'string' && val.includes('T')) {
    try {
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        const pad = (n) => (n < 10 ? '0' + n : n);
        return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
      }
    } catch (e) {}
  }
  return String(val);
}

function normalizeItem(item, category) {
  if (!item) return item;

  const id = item.id || item.iD || '';
  const dateFormatted = formatDate(item.tanggal || item.lastUpdate);

  switch (category) {
    case 'snack':
      return {
        ...item,
        id,
        namaProduk: item.namaProduk || '',
        isi1KartonPcs: Number(item.isi1KartonPcs || item.isi1Karton) || 120,
        hargaKartonLamaModal: Number(item.hargaKartonLamaModal || item.hargaKarton) || 0,
        isiPcsPerdus: Number(item.isiPcsPerdus) || 20,
        hargaPerdus: Number(item.hargaPerdus) || 0,
        stokAktual: item.stokAktual || '0 Karton, 0 Dus',
        lastUpdate: dateFormatted
      };

    case 'minuman':
    case 'ice_cream':
      return {
        ...item,
        id,
        namaProduk: item.namaProduk || '',
        harga1Karton: Number(item.harga1Karton) || 0,
        stokAktual: item.stokAktual || '0 Karton',
        stokMinimum: Number(item.stokMinimum) || (category === 'minuman' ? 5 : 2),
        lastUpdate: dateFormatted
      };

    case 'konsinyasi_external':
      return {
        ...item,
        id,
        tanggal: dateFormatted,
        namaProdukSupplier: item.namaProdukSupplier || item.namaProduk || '',
        stockMasukPcs: Number(item.stockMasukPcs !== undefined ? item.stockMasukPcs : item.stockMasuk) || 0,
        terjual: Number(item.terjual) || 0,
        sisaRetur: Number(item.sisaRetur !== undefined ? item.sisaRetur : item.sisa) || 0,
        hargaSatuan: Number(item.hargaSatuan) || 0,
        totalHarga: Number(item.totalHarga) || 0,
        statusBayar: item.statusBayar || 'Belum'
      };

    case 'konsinyasi_guru':
      return {
        ...item,
        id,
        tanggal: dateFormatted,
        namaGuru: item.namaGuru || '',
        namaProduk: item.namaProduk || '',
        jumlahProdukPcs: Number(item.jumlahProdukPcs !== undefined ? item.jumlahProdukPcs : item.jumlahProduk) || 0,
        terjualPcs: Number(item.terjualPcs !== undefined ? item.terjualPcs : item.terjual) || 0,
        sisa: Number(item.sisa) || 0,
        hargaSatuan: Number(item.hargaSatuan) || 0,
        totalHarga: Number(item.totalHarga) || 0,
        statusSetorKeGuru: item.statusSetorKeGuru || 'Belum'
      };

    default:
      return { ...item, id };
  }
}

export const gasService = {
  async fetchData() {
    const gasUrl = storageService.getGasUrl();
    if (!gasUrl) {
      const localData = storageService.loadLocalData();
      return {
        isRemote: false,
        data: localData,
        dashboard: storageService.calculateMetrics(localData),
        mutasiAnalytics: storageService.calculateMutasiAnalytics(localData.mutasi || [])
      };
    }

    try {
      const response = await fetch(`${gasUrl}?action=getAllData`, {
        method: 'GET'
      });
      
      const json = await response.json();
      if (json && json.success && json.data) {
        const raw = json.data;

        const normalizedData = {
          snack: (raw.snack || []).map(i => normalizeItem(i, 'snack')),
          minuman: (raw.minuman || []).map(i => normalizeItem(i, 'minuman')),
          ice_cream: (raw.ice_cream || []).map(i => normalizeItem(i, 'ice_cream')),
          konsinyasi_external: (raw.konsinyasi_external || []).map(i => normalizeItem(i, 'konsinyasi_external')),
          konsinyasi_guru: (raw.konsinyasi_guru || []).map(i => normalizeItem(i, 'konsinyasi_guru')),
          mutasi: (raw.mutasi && raw.mutasi.length > 0) ? raw.mutasi.map(m => ({
            id: m.id || m.iDTransaksi || m.idTransaksi || `MUT-${Date.now()}`,
            tanggal: formatDate(m.tanggal),
            waktu: m.waktu || '12:00:00',
            tipe: String(m.tipe || 'MASUK').toUpperCase(),
            kategori: m.kategori || 'Umum',
            idProduk: m.idProduk || m.iDProduk || '-',
            namaProduk: m.namaProduk || '',
            jumlah: Number(m.jumlah) || 0,
            satuan: m.satuan || 'Pcs',
            hargaSatuan: Number(m.hargaSatuan) || 0,
            totalNominal: Number(m.totalNominal) || 0,
            keterangan: m.keterangan || '-',
            petugas: m.petugas || 'Staf Kantin'
          })) : storageService.loadLocalData().mutasi || [],
          teachersList: raw.teachersList && raw.teachersList.length > 0 ? raw.teachersList : [
            'Bu Nurul', 'Bu Rahma', 'Ustadz Abdullah', 'Bu Shalatina', 'Kak Dini'
          ],
          lastSynced: raw.lastSynced || new Date().toLocaleString('id-ID')
        };

        const metrics = storageService.calculateMetrics(normalizedData);
        const mutasiAnalytics = storageService.calculateMutasiAnalytics(normalizedData.mutasi);
        storageService.saveLocalData(normalizedData);

        return {
          isRemote: true,
          data: normalizedData,
          dashboard: metrics,
          mutasiAnalytics
        };
      }
      throw new Error(json.message || 'Format respon GAS tidak valid');
    } catch (err) {
      console.warn('Gagal koneksi ke GAS, beralih ke data lokal:', err.message);
      const localData = storageService.loadLocalData();
      return {
        isRemote: false,
        warning: `Koneksi Google Sheets: ${err.message}`,
        data: localData,
        dashboard: storageService.calculateMetrics(localData),
        mutasiAnalytics: storageService.calculateMutasiAnalytics(localData.mutasi || [])
      };
    }
  },

  async recordMutasi(mutasiData, user = 'Petugas Kantin') {
    const gasUrl = storageService.getGasUrl();
    const currentData = storageService.loadLocalData();

    const today = new Date().toLocaleDateString('id-ID');
    const now = new Date();
    const pad = (n) => (n < 10 ? '0' + n : n);
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const dateCompact = today.replace(/\//g, '');
    const count = (currentData.mutasi || []).length + 1;
    const newId = `MUT-${dateCompact}-${String(count).padStart(3, '0')}`;

    const jumlah = Number(mutasiData.jumlah) || 1;
    const hargaSatuan = Number(mutasiData.hargaSatuan) || 0;
    const totalNominal = Number(mutasiData.totalNominal) || (jumlah * hargaSatuan);

    const formattedMutasi = {
      id: newId,
      tanggal: mutasiData.tanggal || today,
      waktu: mutasiData.waktu || timeStr,
      tipe: String(mutasiData.tipe || 'MASUK').toUpperCase(),
      kategori: mutasiData.kategori || 'Umum',
      idProduk: mutasiData.idProduk || '-',
      namaProduk: mutasiData.namaProduk || '',
      jumlah,
      satuan: mutasiData.satuan || 'Pcs',
      hargaSatuan,
      totalNominal,
      keterangan: mutasiData.keterangan || '-',
      petugas: user
    };

    if (!currentData.mutasi) currentData.mutasi = [];
    currentData.mutasi.unshift(formattedMutasi);
    storageService.saveLocalData(currentData);

    if (gasUrl) {
      try {
        await fetch(gasUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'recordMutasi',
            data: mutasiData,
            user
          })
        });
      } catch (err) {
        console.warn('Gagal mencatat mutasi ke GAS:', err);
      }
    }

    return { 
      success: true, 
      mutasi: formattedMutasi, 
      allData: currentData,
      mutasiAnalytics: storageService.calculateMutasiAnalytics(currentData.mutasi)
    };
  },

  async addItem(category, itemData, user = 'Staf Kantin') {
    const gasUrl = storageService.getGasUrl();
    const currentData = storageService.loadLocalData();
    const idPrefix = {
      snack: 'SNK',
      minuman: 'MNM',
      ice_cream: 'ICE',
      konsinyasi_external: 'EXT',
      konsinyasi_guru: 'GRU'
    }[category] || 'PRD';

    const count = (currentData[category] || []).length + 1;
    const newId = `${idPrefix}-${String(count).padStart(3, '0')}`;
    const today = new Date().toLocaleDateString('id-ID');
    const now = `${today} ${new Date().toLocaleTimeString('id-ID')}`;

    const formattedItem = {
      id: newId,
      ...itemData,
      lastUpdate: now
    };

    if (!currentData[category]) currentData[category] = [];
    currentData[category].unshift(formattedItem);

    if (category === 'konsinyasi_guru' && itemData.namaGuru) {
      if (!currentData.teachersList) currentData.teachersList = [];
      if (!currentData.teachersList.includes(itemData.namaGuru)) {
        currentData.teachersList.push(itemData.namaGuru);
      }
    }

    // Auto-record mutasi MASUK saat ada item baru
    const nominal = category === 'snack' 
      ? Number(itemData.hargaKartonLamaModal) || 0
      : category === 'minuman' || category === 'ice_cream'
      ? Number(itemData.harga1Karton) || 0
      : Number(itemData.totalHarga) || 0;

    const mutasiEntry = {
      idProduk: newId,
      namaProduk: itemData.namaProduk || itemData.namaProdukSupplier,
      tipe: 'MASUK',
      kategori: category.replace('_', ' ').toUpperCase(),
      jumlah: Number(itemData.stockMasukPcs || itemData.jumlahProdukPcs || 1),
      satuan: category === 'snack' ? 'Karton' : category === 'minuman' ? 'Karton' : category === 'ice_cream' ? 'Box' : 'Pcs',
      hargaSatuan: Number(itemData.hargaSatuan || itemData.harga1Karton || 0),
      totalNominal: nominal,
      keterangan: `Input awal / restock produk baru`,
      petugas: user
    };
    if (!currentData.mutasi) currentData.mutasi = [];
    currentData.mutasi.unshift({
      id: `MUT-${Date.now()}`,
      tanggal: today,
      waktu: new Date().toLocaleTimeString('id-ID'),
      ...mutasiEntry
    });

    storageService.saveLocalData(currentData);

    if (gasUrl) {
      try {
        await fetch(gasUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'addItem',
            category,
            data: itemData,
            user
          })
        });
      } catch (err) {
        console.warn('Gagal mengirim ke GAS:', err);
      }
    }

    return { success: true, item: formattedItem, allData: currentData };
  },

  async updateItem(category, id, itemData, user = 'Staf Kantin') {
    const gasUrl = storageService.getGasUrl();
    const currentData = storageService.loadLocalData();
    
    if (currentData[category]) {
      const idx = currentData[category].findIndex(i => i.id === id);
      if (idx !== -1) {
        currentData[category][idx] = {
          ...currentData[category][idx],
          ...itemData,
          lastUpdate: `${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}`
        };
        storageService.saveLocalData(currentData);
      }
    }

    if (gasUrl) {
      try {
        await fetch(gasUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'updateItem',
            category,
            id,
            data: itemData,
            user
          })
        });
      } catch (err) {
        console.warn('Gagal update ke GAS:', err);
      }
    }

    return { success: true, allData: currentData };
  },

  async updateStatus(category, id, newStatus, user = 'Bu Shalatina') {
    const gasUrl = storageService.getGasUrl();
    const currentData = storageService.loadLocalData();

    if (currentData[category]) {
      const idx = currentData[category].findIndex(i => i.id === id);
      if (idx !== -1) {
        if (category === 'konsinyasi_external') {
          currentData[category][idx].statusBayar = newStatus;
        } else if (category === 'konsinyasi_guru') {
          currentData[category][idx].statusSetorKeGuru = newStatus;
        }
        storageService.saveLocalData(currentData);
      }
    }

    if (gasUrl) {
      try {
        await fetch(gasUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'updateKonsinyasiStatus',
            category,
            id,
            status: newStatus,
            user
          })
        });
      } catch (err) {
        console.warn('Gagal update status ke GAS:', err);
      }
    }

    return { success: true, allData: currentData };
  },

  async deleteItem(category, id, user = 'Staf Kantin') {
    const gasUrl = storageService.getGasUrl();
    const currentData = storageService.loadLocalData();

    if (currentData[category]) {
      currentData[category] = currentData[category].filter(i => i.id !== id);
      storageService.saveLocalData(currentData);
    }

    if (gasUrl) {
      try {
        await fetch(gasUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'deleteItem',
            category,
            id,
            user
          })
        });
      } catch (err) {
        console.warn('Gagal delete ke GAS:', err);
      }
    }

    return { success: true, allData: currentData };
  },

  async triggerSetupDatabase() {
    const gasUrl = storageService.getGasUrl();
    if (!gasUrl) {
      const reset = storageService.resetSeed();
      return { success: true, message: 'Database lokal di-reset ke seed awal', data: reset };
    }

    try {
      const res = await fetch(`${gasUrl}?action=setupDatabase`);
      const json = await res.json();
      return json;
    } catch (err) {
      throw new Error(`Gagal memicu setupDatabase di GAS: ${err.message}`);
    }
  }
};
