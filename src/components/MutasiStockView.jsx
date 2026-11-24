import React, { useState, useMemo } from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Plus, 
  Minus, 
  Calendar, 
  Filter, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Layers, 
  User 
} from 'lucide-react';
import { formatRupiah } from '../types/categoryData';

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

export default function MutasiStockView({
  mutasiList = [],
  mutasiAnalytics = {},
  onOpenRecordMutasi,
  currentUser
}) {
  const [period, setPeriod] = useState('daily'); // 'daily' | 'weekly' | 'monthly' | 'all'
  const [filterType, setFilterType] = useState('all'); // 'all' | 'MASUK' | 'KELUAR'
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filter list by period, category, type, and search
  const filteredMutasi = useMemo(() => {
    return mutasiList.filter(item => {
      const tgl = parseDate(item.tanggal);
      
      // Period filter
      if (period === 'daily') {
        if (!tgl) return false;
        const isToday = tgl.getDate() === now.getDate() && tgl.getMonth() === now.getMonth() && tgl.getFullYear() === now.getFullYear();
        if (!isToday) return false;
      } else if (period === 'weekly') {
        if (!tgl || tgl < sevenDaysAgo) return false;
      } else if (period === 'monthly') {
        if (!tgl || tgl.getMonth() !== currentMonth || tgl.getFullYear() !== currentYear) return false;
      }

      // Type filter
      if (filterType !== 'all' && item.tipe !== filterType) {
        return false;
      }

      // Category filter
      if (filterCategory !== 'all' && String(item.kategori).toLowerCase() !== filterCategory.toLowerCase()) {
        return false;
      }

      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const nama = (item.namaProduk || '').toLowerCase();
        const ket = (item.keterangan || '').toLowerCase();
        const id = (item.id || '').toLowerCase();
        const pet = (item.petugas || '').toLowerCase();
        return nama.includes(q) || ket.includes(q) || id.includes(q) || pet.includes(q);
      }

      return true;
    });
  }, [mutasiList, period, filterType, filterCategory, searchQuery]);

  // Compute live totals for current filtered view
  const currentSummary = useMemo(() => {
    let masukQty = 0;
    let masukNominal = 0;
    let keluarQty = 0;
    let keluarNominal = 0;

    filteredMutasi.forEach(item => {
      const q = Number(item.jumlah) || 0;
      const nom = Number(item.totalNominal) || 0;
      if (item.tipe === 'MASUK') {
        masukQty += q;
        masukNominal += nom;
      } else {
        keluarQty += q;
        keluarNominal += nom;
      }
    });

    return {
      masukQty,
      masukNominal,
      keluarQty,
      keluarNominal,
      netNominal: keluarNominal - masukNominal,
      count: filteredMutasi.length
    };
  }, [filteredMutasi]);

  const handleExportCsv = () => {
    const rows = [
      ['ID Transaksi', 'Tanggal', 'Waktu', 'Tipe', 'Kategori', 'ID Produk', 'Nama Produk', 'Jumlah', 'Satuan', 'Harga Satuan', 'Total Nominal', 'Keterangan', 'Petugas']
    ];
    filteredMutasi.forEach(m => {
      rows.push([
        m.id,
        m.tanggal,
        m.waktu,
        m.tipe,
        m.kategori,
        m.idProduk,
        m.namaProduk,
        m.jumlah,
        m.satuan,
        m.hargaSatuan,
        m.totalNominal,
        m.keterangan,
        m.petugas
      ]);
    });

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Mutasi_Stok_Kantin_AlImam_${period}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 mb-16">
      
      {/* 1. Header Toolbar & Period Pill Selector */}
      <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Period Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-xs font-bold text-slate-500 mr-1 hidden sm:inline flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Periode:
          </span>
          <button
            onClick={() => setPeriod('daily')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition active:scale-95 ${
              period === 'daily'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Hari Ini
          </button>
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition active:scale-95 ${
              period === 'weekly'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Minggu Ini (7 Hari)
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition active:scale-95 ${
              period === 'monthly'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Bulan Ini
          </button>
          <button
            onClick={() => setPeriod('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition active:scale-95 ${
              period === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Semua
          </button>
        </div>

        {/* Quick Action Buttons: Masuk & Keluar */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onOpenRecordMutasi('MASUK')}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs shadow-emerald-200 transition"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>+ Catat Stok Masuk</span>
          </button>

          <button
            onClick={() => onOpenRecordMutasi('KELUAR')}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs shadow-rose-200 transition"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>- Catat Stok Keluar</span>
          </button>
        </div>

      </div>

      {/* 2. Three Analytics Summary Cards (Hari Ini, Minggu Ini, Bulan Ini) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* CARD 1: STOK MASUK */}
        <div className="bg-gradient-to-br from-white to-emerald-50/60 p-4 rounded-2xl border border-emerald-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center space-x-1">
              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600 inline" />
              <span>Pemasukan Stok (Masuk)</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {currentSummary.masukQty} Unit / Pack
            </span>
          </div>
          <div className="mt-2">
            <h4 className="text-xl sm:text-2xl font-extrabold text-emerald-700">
              {formatRupiah(currentSummary.masukNominal)}
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Total Pembelian / Kulakan / Titipan Masuk
            </p>
          </div>
        </div>

        {/* CARD 2: STOK KELUAR */}
        <div className="bg-gradient-to-br from-white to-rose-50/60 p-4 rounded-2xl border border-rose-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider flex items-center space-x-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-rose-600 inline" />
              <span>Pengeluaran Stok (Keluar)</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
              {currentSummary.keluarQty} Unit / Pack
            </span>
          </div>
          <div className="mt-2">
            <h4 className="text-xl sm:text-2xl font-extrabold text-rose-600">
              {formatRupiah(currentSummary.keluarNominal)}
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Total Omzet / Penjualan Terjual
            </p>
          </div>
        </div>

        {/* CARD 3: ARUS KAS / SELISIH NETTO */}
        <div className="bg-gradient-to-br from-white to-teal-50/60 p-4 rounded-2xl border border-teal-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-teal-900 uppercase tracking-wider flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5 text-teal-600 inline" />
              <span>Estimasi Arus Kas / Margin</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
              {filteredMutasi.length} Transaksi
            </span>
          </div>
          <div className="mt-2">
            <h4 className={`text-xl sm:text-2xl font-extrabold ${
              currentSummary.netNominal >= 0 ? 'text-teal-700' : 'text-amber-700'
            }`}>
              {formatRupiah(currentSummary.netNominal)}
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Selisih Kas (Penjualan − Modal Kulakan)
            </p>
          </div>
        </div>

      </div>

      {/* 3. Filter Bar & Table of Transactions */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-xs overflow-hidden">
        
        {/* Filter controls */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 bg-slate-50/60">
          
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari transaksi mutasi produk atau petugas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            {/* Type selector */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2.5 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700"
            >
              <option value="all">Semua Jenis</option>
              <option value="MASUK">Hanya Masuk</option>
              <option value="KELUAR">Hanya Keluar</option>
            </select>

            {/* Category selector */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2.5 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700"
            >
              <option value="all">Semua Kategori</option>
              <option value="Snack">Snack</option>
              <option value="Minuman">Minuman</option>
              <option value="Ice Cream">Ice Cream</option>
              <option value="Konsinyasi External">Konsinyasi External</option>
              <option value="Konsinyasi Guru">Konsinyasi Guru</option>
            </select>

            {/* Export CSV button */}
            <button
              onClick={handleExportCsv}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition"
              title="Unduh Data CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ekspor</span>
            </button>
          </div>

        </div>

        {/* Transaction Table / Cards */}
        {filteredMutasi.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            <Package className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-slate-600 text-sm">Tidak ada mutasi stok pada periode ini</p>
            <p className="text-xs text-slate-400 mt-1">Gunakan tombol Catat Stok Masuk / Keluar di atas.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-emerald-50/60 border-b border-emerald-100 font-extrabold text-emerald-950 text-[11px] uppercase">
                  <tr>
                    <th className="py-3 px-3.5">ID / Waktu</th>
                    <th className="py-3 px-3.5 text-center">Tipe</th>
                    <th className="py-3 px-3.5">Kategori</th>
                    <th className="py-3 px-3.5">Nama Produk</th>
                    <th className="py-3 px-3.5 text-center">Jumlah</th>
                    <th className="py-3 px-3.5 text-right">Harga Satuan</th>
                    <th className="py-3 px-3.5 text-right">Total Nominal</th>
                    <th className="py-3 px-3.5">Keterangan</th>
                    <th className="py-3 px-3.5">Petugas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMutasi.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-500 block text-[11px]">
                          {item.id}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {item.tanggal} {item.waktu}
                        </span>
                      </td>

                      <td className="py-3 px-3.5 text-center">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          item.tipe === 'MASUK'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                          {item.tipe === 'MASUK' ? (
                            <>
                              <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
                              <span>MASUK</span>
                            </>
                          ) : (
                            <>
                              <ArrowUpRight className="w-3 h-3 text-rose-600" />
                              <span>KELUAR</span>
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-3 px-3.5 text-slate-600 font-medium whitespace-nowrap">
                        {item.kategori}
                      </td>

                      <td className="py-3 px-3.5 font-bold text-slate-800">
                        {item.namaProduk}
                      </td>

                      <td className="py-3 px-3.5 text-center font-extrabold text-slate-800">
                        {item.jumlah} {item.satuan}
                      </td>

                      <td className="py-3 px-3.5 text-right text-slate-600">
                        {formatRupiah(item.hargaSatuan)}
                      </td>

                      <td className={`py-3 px-3.5 text-right font-extrabold ${
                        item.tipe === 'MASUK' ? 'text-emerald-800' : 'text-rose-700'
                      }`}>
                        {formatRupiah(item.totalNominal)}
                      </td>

                      <td className="py-3 px-3.5 text-slate-500 text-[11px]">
                        {item.keterangan}
                      </td>

                      <td className="py-3 px-3.5 text-slate-700 font-medium whitespace-nowrap">
                        <span className="inline-flex items-center space-x-1">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>{item.petugas}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredMutasi.map((item, idx) => (
                <div key={item.id || idx} className="p-3.5 space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          item.tipe === 'MASUK'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {item.tipe}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.id}
                        </span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 text-sm mt-1">
                        {item.namaProduk}
                      </h5>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {item.kategori} • {item.tanggal} {item.waktu}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className={`font-extrabold text-sm block ${
                        item.tipe === 'MASUK' ? 'text-emerald-700' : 'text-rose-700'
                      }`}>
                        {formatRupiah(item.totalNominal)}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {item.jumlah} {item.satuan}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate max-w-[200px]">
                      {item.keterangan}
                    </span>
                    <span className="font-semibold text-slate-700 flex items-center space-x-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>{item.petugas}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>

    </div>
  );
}
