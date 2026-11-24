import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Package, 
  Calculator, 
  Calendar, 
  User, 
  Tag, 
  Check 
} from 'lucide-react';
import { formatRupiah } from '../types/categoryData';

export default function RecordMutasiModal({
  isOpen,
  onClose,
  onSave,
  stockData = {},
  currentUser,
  defaultType = 'MASUK'
}) {
  const [tipe, setTipe] = useState(defaultType); // 'MASUK' or 'KELUAR'
  const [kategori, setKategori] = useState('Minuman');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [namaProduk, setNamaProduk] = useState('');
  const [jumlah, setJumlah] = useState(1);
  const [satuan, setSatuan] = useState('Pcs');
  const [hargaSatuan, setHargaSatuan] = useState('');
  const [totalNominal, setTotalNominal] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [isTotalManuallyEdited, setIsTotalManuallyEdited] = useState(false);

  // Initialize
  useEffect(() => {
    const today = new Date();
    const pad = (n) => (n < 10 ? '0' + n : n);
    setTanggal(`${pad(today.getDate())}/${pad(today.getMonth() + 1)}/${today.getFullYear()}`);
    setTipe(defaultType);
    setJumlah(1);
    setKeterangan('');
    setIsTotalManuallyEdited(false);
  }, [isOpen, defaultType]);

  // Compute product list based on selected category
  const availableProducts = React.useMemo(() => {
    let list = [];
    if (kategori === 'Snack') list = stockData.snack || [];
    else if (kategori === 'Minuman') list = stockData.minuman || [];
    else if (kategori === 'Ice Cream') list = stockData.ice_cream || [];
    else if (kategori === 'Konsinyasi External') list = stockData.konsinyasi_external || [];
    else if (kategori === 'Konsinyasi Guru') list = stockData.konsinyasi_guru || [];
    else {
      list = [
        ...(stockData.snack || []),
        ...(stockData.minuman || []),
        ...(stockData.ice_cream || []),
        ...(stockData.konsinyasi_external || []),
        ...(stockData.konsinyasi_guru || [])
      ];
    }
    return list;
  }, [kategori, stockData]);

  // Handle product selection
  const handleSelectProduct = (prodId) => {
    setSelectedProductId(prodId);
    const found = availableProducts.find(p => p.id === prodId);
    if (found) {
      setNamaProduk(found.namaProduk || found.namaProdukSupplier);
      
      // Auto default price & unit
      if (kategori === 'Snack') {
        setSatuan('Dus');
        setHargaSatuan(found.hargaPerdus || 25000);
      } else if (kategori === 'Minuman') {
        setSatuan('Karton');
        setHargaSatuan(found.harga1Karton || 35000);
      } else if (kategori === 'Ice Cream') {
        setSatuan('Box');
        setHargaSatuan(found.harga1Karton || 80000);
      } else {
        setSatuan('Pcs');
        setHargaSatuan(found.hargaSatuan || 2500);
      }
    }
  };

  // Auto calculate total
  useEffect(() => {
    if (!isTotalManuallyEdited) {
      const q = Number(jumlah) || 0;
      const h = Number(hargaSatuan) || 0;
      setTotalNominal(q * h);
    }
  }, [jumlah, hargaSatuan, isTotalManuallyEdited]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!namaProduk) {
      alert('Silakan pilih produk atau isi nama produk!');
      return;
    }

    onSave({
      tipe,
      kategori,
      idProduk: selectedProductId || '-',
      namaProduk,
      jumlah: Number(jumlah) || 1,
      satuan,
      hargaSatuan: Number(hargaSatuan) || 0,
      totalNominal: Number(totalNominal) || (Number(jumlah) * Number(hargaSatuan)),
      keterangan: keterangan || (tipe === 'MASUK' ? 'Stok masuk harian' : 'Penjualan kantin harian'),
      tanggal,
      petugas: currentUser?.name || 'Petugas Kantin'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full shadow-2xl border border-emerald-100 overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom sm:zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className={`px-4 sm:px-6 py-4 text-white flex items-center justify-between flex-shrink-0 ${
          tipe === 'MASUK' ? 'bg-emerald-700' : 'bg-rose-700'
        }`}>
          <div className="flex items-center space-x-2">
            {tipe === 'MASUK' ? (
              <ArrowDownLeft className="w-5 h-5 text-emerald-200" />
            ) : (
              <ArrowUpRight className="w-5 h-5 text-rose-200" />
            )}
            <h3 className="font-extrabold text-sm sm:text-base leading-tight">
              {tipe === 'MASUK' ? 'Catat Stok MASUK (Restock / Kulakan / Titipan)' : 'Catat Stok KELUAR (Penjualan / Habis / Retur)'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-black/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* 1. Toggle Tipe Masuk vs Keluar */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
              Jenis Mutasi Stok
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTipe('MASUK')}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 border transition ${
                  tipe === 'MASUK'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                <span>[+] Stok Masuk (Kulakan)</span>
              </button>

              <button
                type="button"
                onClick={() => setTipe('KELUAR')}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 border transition ${
                  tipe === 'KELUAR'
                    ? 'bg-rose-50 text-rose-800 border-rose-500 ring-2 ring-rose-500/20'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <ArrowUpRight className="w-4 h-4 text-rose-600" />
                <span>[-] Stok Keluar (Penjualan)</span>
              </button>
            </div>
          </div>

          {/* 2. Pilih Kategori & Produk */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kategori Produk
              </label>
              <select
                value={kategori}
                onChange={(e) => {
                  setKategori(e.target.value);
                  setSelectedProductId('');
                  setNamaProduk('');
                }}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold bg-white"
              >
                <option value="Snack">Snack</option>
                <option value="Minuman">Minuman</option>
                <option value="Ice Cream">Ice Cream</option>
                <option value="Konsinyasi External">Konsinyasi External</option>
                <option value="Konsinyasi Guru">Konsinyasi Guru</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pilih Produk Terdaftar
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => handleSelectProduct(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
              >
                <option value="">-- Pilih dari Stok --</option>
                {availableProducts.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.id} - {p.namaProduk || p.namaProdukSupplier}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Produk *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Teh Botol, Beng-Beng, Sari Roti..."
              value={namaProduk}
              onChange={(e) => setNamaProduk(e.target.value)}
              className="w-full px-3.5 py-2 text-base sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-slate-800"
            />
          </div>

          {/* 3. Kuantitas, Satuan, Harga */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jumlah *
              </label>
              <input
                type="number"
                min="1"
                required
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
                className="w-full px-2.5 py-2 text-base sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-center font-extrabold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Satuan
              </label>
              <select
                value={satuan}
                onChange={(e) => setSatuan(e.target.value)}
                className="w-full px-2 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-bold text-slate-800 text-center"
              >
                <option value="Karton">Karton</option>
                <option value="Dus">Dus</option>
                <option value="Box">Box</option>
                <option value="Pcs">Pcs</option>
                <option value="Bungkus">Bungkus</option>
                <option value="Botol">Botol</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Harga Satuan
              </label>
              <input
                type="number"
                min="0"
                placeholder="Rp"
                value={hargaSatuan}
                onChange={(e) => setHargaSatuan(e.target.value)}
                className="w-full px-2.5 py-2 text-base sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-right font-bold"
              />
            </div>
          </div>

          {/* Total Nominal Box */}
          <div className={`p-3 rounded-xl border flex items-center justify-between ${
            tipe === 'MASUK' 
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' 
              : 'bg-rose-50/80 border-rose-200 text-rose-950'
          }`}>
            <div>
              <span className="text-[11px] font-bold block">
                {tipe === 'MASUK' ? 'Total Nilai Pembelian / Modal Masuk:' : 'Total Nilai Penjualan / Omset Keluar:'}
              </span>
              <span className="text-base sm:text-lg font-extrabold">
                {formatRupiah(totalNominal)}
              </span>
            </div>
            <input
              type="number"
              placeholder="Atau ubah manual"
              value={totalNominal}
              onChange={(e) => {
                setIsTotalManuallyEdited(true);
                setTotalNominal(e.target.value);
              }}
              className="w-32 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-bold text-right"
            />
          </div>

          {/* Tanggal & Keterangan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tanggal Mutasi
              </label>
              <input
                type="text"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Keterangan / Sumber
              </label>
              <input
                type="text"
                placeholder={tipe === 'MASUK' ? 'Contoh: Restock agen mingguan' : 'Contoh: Penjualan istirahat siang'}
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Sticky Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2.5 sticky bottom-0 bg-white pb-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-5 py-2.5 text-xs font-extrabold text-white rounded-xl shadow-md transition active:scale-95 ${
                tipe === 'MASUK' 
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' 
                  : 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
              }`}
            >
              {tipe === 'MASUK' ? 'Simpan Stok Masuk' : 'Simpan Stok Keluar'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
