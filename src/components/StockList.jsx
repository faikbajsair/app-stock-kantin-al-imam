import React, { useState } from 'react';
import { 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Search, 
  Plus, 
  FileSpreadsheet, 
  LayoutList,
  LayoutGrid,
  User, 
  Building,
  RotateCcw
} from 'lucide-react';
import { formatRupiah } from '../types/categoryData';

export default function StockList({
  category,
  items = [],
  searchQuery,
  setSearchQuery,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onToggleStatus,
  currentUser
}) {
  // View mode toggle: 'auto' (cards on mobile, table on desktop), 'cards', or 'table'
  const [viewMode, setViewMode] = useState('auto');

  // Filter items based on search query
  const filteredItems = items.filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const nama = (item.namaProduk || item.namaProdukSupplier || '').toLowerCase();
    const guru = (item.namaGuru || '').toLowerCase();
    const id = (item.id || '').toLowerCase();
    return nama.includes(q) || guru.includes(q) || id.includes(q);
  });

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-xs overflow-hidden mb-16 sm:mb-12">
      
      {/* Header Bar with Search & Add Button */}
      <div className="p-3.5 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
        
        {/* Search Input */}
        <div className="flex-1 relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari produk, supplier, atau nama guru..."
            className="w-full pl-9.5 pr-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white shadow-2xs"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ×
            </button>
          )}
        </div>

        {/* View Switcher & Add Button */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
          
          {/* View Mode Toggle (Desktop & Tablet) */}
          <div className="hidden sm:flex items-center bg-slate-200/70 p-1 rounded-xl text-xs">
            <button
              onClick={() => setViewMode('auto')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'auto' ? 'bg-white text-emerald-800 shadow-2xs font-bold' : 'text-slate-600'
              }`}
              title="Tampilan Otomatis"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'cards' ? 'bg-white text-emerald-800 shadow-2xs font-bold' : 'text-slate-600'
              }`}
              title="Tampilan Kartu"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table' ? 'bg-white text-emerald-800 shadow-2xs font-bold' : 'text-slate-600'
              }`}
              title="Tampilan Tabel"
            >
              <LayoutList className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={onAddItem}
            className="flex-1 sm:flex-initial px-4 py-2 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-sm shadow-emerald-200 transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Stok / Titipan</span>
          </button>
        </div>
      </div>

      {/* Main Content: Table or Cards */}
      {filteredItems.length === 0 ? (
        <div className="p-8 sm:p-14 text-center text-slate-400">
          <img 
            src="/logo-alimam.png" 
            alt="Al-Imam" 
            className="h-12 w-auto mx-auto opacity-30 grayscale mb-3"
          />
          <p className="font-bold text-slate-600 text-sm">Tidak ada data stok ditemukan</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Gunakan tombol "+ Tambah Stok / Titipan" di atas untuk menambahkan barang baru.
          </p>
        </div>
      ) : (
        <>
          {/* DESKTOP / TABLET TABLE VIEW (Visible if viewMode is 'table' or if 'auto' on screens md+) */}
          <div className={`${viewMode === 'cards' ? 'hidden' : viewMode === 'table' ? 'block' : 'hidden md:block'} overflow-x-auto`}>
            <table className="w-full text-left border-collapse text-xs min-w-[760px]">
              <thead>
                <tr className="bg-emerald-50/70 border-b border-emerald-100 text-emerald-950 font-extrabold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3.5">ID</th>
                  
                  {category === 'snack' && (
                    <>
                      <th className="py-3 px-3.5">Nama Produk</th>
                      <th className="py-3 px-3.5 text-center">Isi 1 Karton</th>
                      <th className="py-3 px-3.5 text-right">Harga Karton (Modal)</th>
                      <th className="py-3 px-3.5 text-center">Isi Pcs Perdus</th>
                      <th className="py-3 px-3.5 text-right">Harga Perdus</th>
                      <th className="py-3 px-3.5">Stok Aktual</th>
                      <th className="py-3 px-3.5">Last Update</th>
                    </>
                  )}

                  {(category === 'minuman' || category === 'ice_cream') && (
                    <>
                      <th className="py-3 px-3.5">Nama Produk</th>
                      <th className="py-3 px-3.5 text-right">Harga 1 Karton</th>
                      <th className="py-3 px-3.5">Stok Aktual</th>
                      <th className="py-3 px-3.5 text-center">Stok Min</th>
                      <th className="py-3 px-3.5">Status</th>
                      <th className="py-3 px-3.5">Last Update</th>
                    </>
                  )}

                  {category === 'konsinyasi_external' && (
                    <>
                      <th className="py-3 px-3.5">Tanggal</th>
                      <th className="py-3 px-3.5">Nama Produk / Supplier</th>
                      <th className="py-3 px-3.5 text-center">Masuk</th>
                      <th className="py-3 px-3.5 text-center">Terjual</th>
                      <th className="py-3 px-3.5 text-center">Sisa</th>
                      <th className="py-3 px-3.5 text-right">Harga Satuan</th>
                      <th className="py-3 px-3.5 text-right">Total Tagihan</th>
                      <th className="py-3 px-3.5 text-center">Status Bayar</th>
                    </>
                  )}

                  {category === 'konsinyasi_guru' && (
                    <>
                      <th className="py-3 px-3.5">Tanggal</th>
                      <th className="py-3 px-3.5">Nama Guru</th>
                      <th className="py-3 px-3.5">Nama Produk</th>
                      <th className="py-3 px-3.5 text-center">Jumlah</th>
                      <th className="py-3 px-3.5 text-center">Terjual</th>
                      <th className="py-3 px-3.5 text-center">Sisa</th>
                      <th className="py-3 px-3.5 text-right">Harga Satuan</th>
                      <th className="py-3 px-3.5 text-right">Total Setor</th>
                      <th className="py-3 px-3.5 text-center">Status Setor</th>
                    </>
                  )}

                  {category === 'all' && (
                    <>
                      <th className="py-3 px-3.5">Kategori</th>
                      <th className="py-3 px-3.5">Nama Produk / Item</th>
                      <th className="py-3 px-3.5">Detail & Kuantitas</th>
                      <th className="py-3 px-3.5 text-right">Nilai Modal / Tagihan</th>
                      <th className="py-3 px-3.5">Status</th>
                    </>
                  )}

                  <th className="py-3 px-3.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item, idx) => {
                  const itemCat = item._category || category;
                  const isEven = idx % 2 === 0;

                  return (
                    <tr 
                      key={item.id || idx} 
                      className={`hover:bg-emerald-50/50 transition ${isEven ? 'bg-white' : 'bg-slate-50/40'}`}
                    >
                      <td className="py-3 px-3.5 font-mono font-bold text-slate-500 whitespace-nowrap">
                        {item.id}
                      </td>

                      {/* SNACK */}
                      {itemCat === 'snack' && (
                        <>
                          <td className="py-3 px-3.5 font-bold text-slate-800">
                            {item.namaProduk}
                          </td>
                          <td className="py-3 px-3.5 text-center text-slate-600">
                            {item.isi1KartonPcs} pcs
                          </td>
                          <td className="py-3 px-3.5 text-right font-medium text-slate-700">
                            {formatRupiah(item.hargaKartonLamaModal)}
                          </td>
                          <td className="py-3 px-3.5 text-center text-slate-600">
                            {item.isiPcsPerdus} pcs
                          </td>
                          <td className="py-3 px-3.5 text-right font-extrabold text-emerald-700">
                            {formatRupiah(item.hargaPerdus)}
                          </td>
                          <td className="py-3 px-3.5 font-semibold text-slate-800">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                              {item.stokAktual}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 text-slate-400 text-[11px] whitespace-nowrap">
                            {item.lastUpdate}
                          </td>
                        </>
                      )}

                      {/* MINUMAN & ICE CREAM */}
                      {(itemCat === 'minuman' || itemCat === 'ice_cream') && (
                        <>
                          <td className="py-3 px-3.5 font-bold text-slate-800">
                            {item.namaProduk}
                          </td>
                          <td className="py-3 px-3.5 text-right font-extrabold text-slate-800">
                            {formatRupiah(item.harga1Karton)}
                          </td>
                          <td className="py-3 px-3.5 font-semibold text-slate-800">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                              {item.stokAktual}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 text-center text-slate-600">
                            {item.stokMinimum}
                          </td>
                          <td className="py-3 px-3.5">
                            {(() => {
                              const num = Number(String(item.stokAktual || '').replace(/[^0-9.]/g, '')) || 0;
                              const min = Number(item.stokMinimum) || 0;
                              const isLow = num <= min;
                              return isLow ? (
                                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                  <AlertTriangle className="w-3 h-3" />
                                  <span>Menipis</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Aman</span>
                                </span>
                              );
                            })()}
                          </td>
                          <td className="py-3 px-3.5 text-slate-400 text-[11px] whitespace-nowrap">
                            {item.lastUpdate}
                          </td>
                        </>
                      )}

                      {/* KONSINYASI EXTERNAL */}
                      {itemCat === 'konsinyasi_external' && (
                        <>
                          <td className="py-3 px-3.5 text-slate-600 whitespace-nowrap">
                            {item.tanggal}
                          </td>
                          <td className="py-3 px-3.5 font-bold text-slate-800">
                            <div className="flex items-center space-x-1.5">
                              <Building className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                              <span>{item.namaProdukSupplier}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3.5 text-center text-slate-700 font-semibold">
                            {item.stockMasukPcs}
                          </td>
                          <td className="py-3 px-3.5 text-center text-emerald-700 font-bold">
                            {item.terjual}
                          </td>
                          <td className="py-3 px-3.5 text-center text-amber-700 font-bold">
                            {item.sisaRetur}
                          </td>
                          <td className="py-3 px-3.5 text-right text-slate-600">
                            {formatRupiah(item.hargaSatuan)}
                          </td>
                          <td className="py-3 px-3.5 text-right font-extrabold text-amber-950">
                            {formatRupiah(item.totalHarga)}
                          </td>
                          <td className="py-3 px-3.5 text-center">
                            <button
                              onClick={() => onToggleStatus('konsinyasi_external', item.id, item.statusBayar)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition flex items-center justify-center space-x-1 mx-auto active:scale-95 ${
                                String(item.statusBayar).toLowerCase().includes('lunas')
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                                  : 'bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300'
                              }`}
                            >
                              {String(item.statusBayar).toLowerCase().includes('lunas') ? (
                                <>
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Lunas</span>
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3" />
                                  <span>Belum Lunas</span>
                                </>
                              )}
                            </button>
                          </td>
                        </>
                      )}

                      {/* KONSINYASI GURU */}
                      {itemCat === 'konsinyasi_guru' && (
                        <>
                          <td className="py-3 px-3.5 text-slate-600 whitespace-nowrap">
                            {item.tanggal}
                          </td>
                          <td className="py-3 px-3.5 font-bold text-slate-800">
                            <div className="flex items-center space-x-1.5">
                              <User className="w-3.5 h-3.5 text-lime-700 flex-shrink-0" />
                              <span className="font-extrabold text-lime-900">{item.namaGuru}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3.5 font-medium text-slate-700">
                            {item.namaProduk}
                          </td>
                          <td className="py-3 px-3.5 text-center text-slate-700 font-semibold">
                            {item.jumlahProdukPcs}
                          </td>
                          <td className="py-3 px-3.5 text-center text-emerald-700 font-bold">
                            {item.terjualPcs}
                          </td>
                          <td className="py-3 px-3.5 text-center text-amber-700 font-bold">
                            {item.sisa}
                          </td>
                          <td className="py-3 px-3.5 text-right text-slate-600">
                            {formatRupiah(item.hargaSatuan)}
                          </td>
                          <td className="py-3 px-3.5 text-right font-extrabold text-lime-950">
                            {formatRupiah(item.totalHarga)}
                          </td>
                          <td className="py-3 px-3.5 text-center">
                            <button
                              onClick={() => onToggleStatus('konsinyasi_guru', item.id, item.statusSetorKeGuru)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition flex items-center justify-center space-x-1 mx-auto active:scale-95 ${
                                String(item.statusSetorKeGuru).toLowerCase().includes('sudah')
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300'
                              }`}
                            >
                              {String(item.statusSetorKeGuru).toLowerCase().includes('sudah') ? (
                                <>
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Sudah Setor</span>
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3" />
                                  <span>Belum Setor</span>
                                </>
                              )}
                            </button>
                          </td>
                        </>
                      )}

                      {/* ALL CATEGORIES SUMMARY ROW */}
                      {category === 'all' && (
                        <>
                          <td className="py-3 px-3.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                              {itemCat.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 font-bold text-slate-800">
                            {item.namaProduk || item.namaProdukSupplier}
                            {item.namaGuru && (
                              <span className="block text-[11px] font-normal text-lime-800">
                                Guru: {item.namaGuru}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3.5 text-slate-600">
                            {item.stokAktual || `${item.terjual || item.terjualPcs || 0} terjual`}
                          </td>
                          <td className="py-3 px-3.5 text-right font-bold text-slate-800">
                            {formatRupiah(item.hargaKartonLamaModal || item.harga1Karton || item.totalHarga)}
                          </td>
                          <td className="py-3 px-3.5">
                            <span className="text-[11px] text-slate-500">
                              {item.statusBayar || item.statusSetorKeGuru || 'Aktif'}
                            </span>
                          </td>
                        </>
                      )}

                      {/* ACTIONS */}
                      <td className="py-3 px-3.5 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => onEditItem(itemCat, item)}
                            title="Edit Data"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteItem(itemCat, item.id)}
                            title="Hapus Data"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS VIEW (Visible if viewMode is 'cards' or if 'auto' on screens < md) */}
          <div className={`${viewMode === 'table' ? 'hidden' : viewMode === 'cards' ? 'block' : 'block md:hidden'} divide-y divide-slate-100`}>
            {filteredItems.map((item, idx) => {
              const itemCat = item._category || category;
              return (
                <div key={item.id || idx} className="p-4 space-y-3 bg-white">
                  
                  {/* Top Bar: ID, Category, Action buttons */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                          {item.id}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {itemCat.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base mt-1 leading-snug">
                        {item.namaProduk || item.namaProdukSupplier}
                      </h4>
                      {item.namaGuru && (
                        <p className="text-xs text-lime-900 font-bold flex items-center space-x-1 mt-0.5">
                          <User className="w-3.5 h-3.5 text-lime-700 inline" />
                          <span>Titipan: {item.namaGuru}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <button
                        onClick={() => onEditItem(itemCat, item)}
                        className="p-2 text-slate-600 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 rounded-xl border border-slate-200 transition"
                        title="Edit Data"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteItem(itemCat, item.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-xl border border-slate-200 transition"
                        title="Hapus Data"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Category Details */}
                  {itemCat === 'snack' && (
                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-slate-400 block text-[10px] font-semibold">Harga Karton (Modal):</span>
                          <span className="font-bold text-slate-700">{formatRupiah(item.hargaKartonLamaModal)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] font-semibold">Harga Perdus (Jual):</span>
                          <span className="font-extrabold text-emerald-700 text-sm">{formatRupiah(item.hargaPerdus)}</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-slate-600">Stok: <strong className="text-slate-800">{item.stokAktual}</strong></span>
                        <span className="text-slate-400 text-[10px]">1 Karton = {item.isi1KartonPcs} pcs</span>
                      </div>
                    </div>
                  )}

                  {(itemCat === 'minuman' || itemCat === 'ice_cream') && (
                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-slate-400 block text-[10px] font-semibold">Harga 1 Karton/Box:</span>
                          <span className="font-extrabold text-slate-900 text-sm">{formatRupiah(item.harga1Karton)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] font-semibold">Stok Aktual:</span>
                          <span className="font-bold text-emerald-800">{item.stokAktual}</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Min. Alert: {item.stokMinimum}</span>
                        {(() => {
                          const num = Number(String(item.stokAktual || '').replace(/[^0-9.]/g, '')) || 0;
                          const min = Number(item.stokMinimum) || 0;
                          return num <= min ? (
                            <span className="text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full text-[10px]">
                              ⚠️ Stok Menipis
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-medium">Stok Cukup</span>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {itemCat === 'konsinyasi_external' && (
                    <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/80 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[11px]">Tgl: {item.tanggal}</span>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">Total Tagihan:</span>
                          <span className="font-extrabold text-amber-950 text-sm">{formatRupiah(item.totalHarga)}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-1 bg-white p-2 rounded-lg border border-amber-100 text-center text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Masuk</span>
                          <span className="font-bold text-slate-800">{item.stockMasukPcs} pcs</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Terjual</span>
                          <span className="font-bold text-emerald-700">{item.terjual} pcs</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Sisa</span>
                          <span className="font-bold text-amber-700">{item.sisaRetur} pcs</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onToggleStatus('konsinyasi_external', item.id, item.statusBayar)}
                        className={`w-full py-2 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow-2xs active:scale-[0.98] transition ${
                          String(item.statusBayar).toLowerCase().includes('lunas')
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {String(item.statusBayar).toLowerCase().includes('lunas') ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Status: Lunas (Klik untuk Ubah)</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5" />
                            <span>Status: Belum Lunas (Klik untuk Tandai Lunas)</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {itemCat === 'konsinyasi_guru' && (
                    <div className="bg-lime-50/60 p-3 rounded-xl border border-lime-200/80 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[11px]">Tgl: {item.tanggal}</span>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">Total Disetor:</span>
                          <span className="font-extrabold text-lime-950 text-sm">{formatRupiah(item.totalHarga)}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-1 bg-white p-2 rounded-lg border border-lime-100 text-center text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Titip</span>
                          <span className="font-bold text-slate-800">{item.jumlahProdukPcs} pcs</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Terjual</span>
                          <span className="font-bold text-emerald-700">{item.terjualPcs} pcs</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Sisa</span>
                          <span className="font-bold text-amber-700">{item.sisa} pcs</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onToggleStatus('konsinyasi_guru', item.id, item.statusSetorKeGuru)}
                        className={`w-full py-2 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow-2xs active:scale-[0.98] transition ${
                          String(item.statusSetorKeGuru).toLowerCase().includes('sudah')
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {String(item.statusSetorKeGuru).toLowerCase().includes('sudah') ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Status: Sudah Disetor (Klik untuk Ubah)</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5" />
                            <span>Status: Belum Disetor (Klik untuk Tandai Sudah)</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </>
      )}

    </div>
  );
}
