import React from 'react';
import { 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Search, 
  Plus, 
  FileSpreadsheet, 
  Tag, 
  User, 
  Building 
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
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden mb-12">
      
      {/* Header Bar with Search & Add Button */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Cari produk, supplier, atau guru...`}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white"
          />
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onAddItem}
            className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Stok / Titipan</span>
          </button>
        </div>
      </div>

      {/* Main Content: Table on Desktop, Cards on Mobile */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center text-slate-400">
          <FileSpreadsheet className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p className="font-medium text-slate-600">Tidak ada data stok ditemukan</p>
          <p className="text-xs text-slate-400 mt-1">Gunakan tombol "+ Tambah Stok / Titipan" untuk menambahkan item baru.</p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-emerald-50/60 border-b border-emerald-100 text-emerald-950 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">ID</th>
                  
                  {category === 'snack' && (
                    <>
                      <th className="py-3.5 px-4">Nama Produk</th>
                      <th className="py-3.5 px-4 text-center">Isi 1 Karton</th>
                      <th className="py-3.5 px-4 text-right">Harga Karton (Modal)</th>
                      <th className="py-3.5 px-4 text-center">Isi Pcs Perdus</th>
                      <th className="py-3.5 px-4 text-right">Harga Perdus</th>
                      <th className="py-3.5 px-4">Stok Aktual</th>
                      <th className="py-3.5 px-4">Last Update</th>
                    </>
                  )}

                  {(category === 'minuman' || category === 'ice_cream') && (
                    <>
                      <th className="py-3.5 px-4">Nama Produk</th>
                      <th className="py-3.5 px-4 text-right">Harga 1 Karton</th>
                      <th className="py-3.5 px-4">Stok Aktual</th>
                      <th className="py-3.5 px-4 text-center">Stok Minimum</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Last Update</th>
                    </>
                  )}

                  {category === 'konsinyasi_external' && (
                    <>
                      <th className="py-3.5 px-4">Tanggal</th>
                      <th className="py-3.5 px-4">Nama Produk / Supplier</th>
                      <th className="py-3.5 px-4 text-center">Stock Masuk</th>
                      <th className="py-3.5 px-4 text-center">Terjual</th>
                      <th className="py-3.5 px-4 text-center">Sisa/Retur</th>
                      <th className="py-3.5 px-4 text-right">Harga Satuan</th>
                      <th className="py-3.5 px-4 text-right">Total Harga</th>
                      <th className="py-3.5 px-4 text-center">Status Bayar</th>
                    </>
                  )}

                  {category === 'konsinyasi_guru' && (
                    <>
                      <th className="py-3.5 px-4">Tanggal</th>
                      <th className="py-3.5 px-4">Nama Guru</th>
                      <th className="py-3.5 px-4">Nama Produk</th>
                      <th className="py-3.5 px-4 text-center">Jumlah (Pcs)</th>
                      <th className="py-3.5 px-4 text-center">Terjual</th>
                      <th className="py-3.5 px-4 text-center">Sisa</th>
                      <th className="py-3.5 px-4 text-right">Harga Satuan</th>
                      <th className="py-3.5 px-4 text-right">Total Harga</th>
                      <th className="py-3.5 px-4 text-center">Status Setor</th>
                    </>
                  )}

                  {category === 'all' && (
                    <>
                      <th className="py-3.5 px-4">Kategori</th>
                      <th className="py-3.5 px-4">Nama Produk / Item</th>
                      <th className="py-3.5 px-4">Detail Info</th>
                      <th className="py-3.5 px-4 text-right">Nilai / Harga</th>
                      <th className="py-3.5 px-4">Status / Stok</th>
                    </>
                  )}

                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item, idx) => {
                  const itemCat = item._category || category;
                  const isEven = idx % 2 === 0;

                  return (
                    <tr 
                      key={item.id || idx} 
                      className={`hover:bg-emerald-50/40 transition ${isEven ? 'bg-white' : 'bg-slate-50/30'}`}
                    >
                      <td className="py-3 px-4 font-mono font-medium text-slate-500">
                        {item.id}
                      </td>

                      {/* SNACK ROW */}
                      {itemCat === 'snack' && (
                        <>
                          <td className="py-3 px-4 font-semibold text-slate-800">
                            {item.namaProduk}
                          </td>
                          <td className="py-3 px-4 text-center text-slate-600">
                            {item.isi1KartonPcs} pcs
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-slate-700">
                            {formatRupiah(item.hargaKartonLamaModal)}
                          </td>
                          <td className="py-3 px-4 text-center text-slate-600">
                            {item.isiPcsPerdus} pcs
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-emerald-700">
                            {formatRupiah(item.hargaPerdus)}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-800">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                              {item.stokAktual}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-400 text-[11px]">
                            {item.lastUpdate}
                          </td>
                        </>
                      )}

                      {/* MINUMAN & ICE CREAM ROW */}
                      {(itemCat === 'minuman' || itemCat === 'ice_cream') && (
                        <>
                          <td className="py-3 px-4 font-semibold text-slate-800">
                            {item.namaProduk}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-slate-800">
                            {formatRupiah(item.harga1Karton)}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-800">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                              {item.stokAktual}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center text-slate-600">
                            {item.stokMinimum}
                          </td>
                          <td className="py-3 px-4">
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
                                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-800">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Aman</span>
                                </span>
                              );
                            })()}
                          </td>
                          <td className="py-3 px-4 text-slate-400 text-[11px]">
                            {item.lastUpdate}
                          </td>
                        </>
                      )}

                      {/* KONSINYASI EXTERNAL ROW */}
                      {itemCat === 'konsinyasi_external' && (
                        <>
                          <td className="py-3 px-4 text-slate-600">
                            {item.tanggal}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-800">
                            <div className="flex items-center space-x-1.5">
                              <Building className="w-3.5 h-3.5 text-amber-600" />
                              <span>{item.namaProdukSupplier}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center text-slate-700 font-medium">
                            {item.stockMasukPcs} pcs
                          </td>
                          <td className="py-3 px-4 text-center text-emerald-700 font-semibold">
                            {item.terjual} pcs
                          </td>
                          <td className="py-3 px-4 text-center text-amber-700 font-semibold">
                            {item.sisaRetur} pcs
                          </td>
                          <td className="py-3 px-4 text-right text-slate-600">
                            {formatRupiah(item.hargaSatuan)}
                          </td>
                          <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                            {formatRupiah(item.totalHarga)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => onToggleStatus('konsinyasi_external', item.id, item.statusBayar)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition flex items-center justify-center space-x-1 mx-auto ${
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

                      {/* KONSINYASI GURU ROW */}
                      {itemCat === 'konsinyasi_guru' && (
                        <>
                          <td className="py-3 px-4 text-slate-600">
                            {item.tanggal}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-800">
                            <div className="flex items-center space-x-1.5">
                              <User className="w-3.5 h-3.5 text-lime-700" />
                              <span className="font-bold text-lime-900">{item.namaGuru}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-700">
                            {item.namaProduk}
                          </td>
                          <td className="py-3 px-4 text-center text-slate-700">
                            {item.jumlahProdukPcs} pcs
                          </td>
                          <td className="py-3 px-4 text-center text-emerald-700 font-semibold">
                            {item.terjualPcs} pcs
                          </td>
                          <td className="py-3 px-4 text-center text-amber-700 font-semibold">
                            {item.sisa} pcs
                          </td>
                          <td className="py-3 px-4 text-right text-slate-600">
                            {formatRupiah(item.hargaSatuan)}
                          </td>
                          <td className="py-3 px-4 text-right font-extrabold text-lime-800">
                            {formatRupiah(item.totalHarga)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => onToggleStatus('konsinyasi_guru', item.id, item.statusSetorKeGuru)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition flex items-center justify-center space-x-1 mx-auto ${
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

                      {/* ACTION BUTTONS */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => onEditItem(itemCat, item)}
                            title="Edit Data"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteItem(itemCat, item.id)}
                            title="Hapus Data"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS VIEW */}
          <div className="lg:hidden divide-y divide-slate-100">
            {filteredItems.map((item, idx) => {
              const itemCat = item._category || category;
              return (
                <div key={item.id || idx} className="p-4 space-y-3 bg-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                          {item.id}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {itemCat.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm mt-1">
                        {item.namaProduk || item.namaProdukSupplier}
                      </h4>
                      {item.namaGuru && (
                        <p className="text-xs text-lime-800 font-semibold flex items-center space-x-1 mt-0.5">
                          <User className="w-3 h-3" />
                          <span>Titipan: {item.namaGuru}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onEditItem(itemCat, item)}
                        className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteItem(itemCat, item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Mobile Spec Details */}
                  {itemCat === 'snack' && (
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Harga Karton:</span>
                        <span className="font-semibold text-slate-700">{formatRupiah(item.hargaKartonLamaModal)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Harga Perdus:</span>
                        <span className="font-bold text-emerald-700">{formatRupiah(item.hargaPerdus)}</span>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-slate-200/50 flex justify-between">
                        <span className="text-slate-500">Stok: <strong>{item.stokAktual}</strong></span>
                        <span className="text-slate-400 text-[10px]">Isi: {item.isi1KartonPcs} pcs / ktn</span>
                      </div>
                    </div>
                  )}

                  {(itemCat === 'minuman' || itemCat === 'ice_cream') && (
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Harga 1 Karton:</span>
                        <span className="font-bold text-slate-800">{formatRupiah(item.harga1Karton)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Stok Aktual:</span>
                        <span className="font-semibold text-emerald-700">{item.stokAktual}</span>
                      </div>
                    </div>
                  )}

                  {itemCat === 'konsinyasi_external' && (
                    <div className="space-y-2 text-xs bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Tanggal: {item.tanggal}</span>
                        <span className="font-extrabold text-amber-900">{formatRupiah(item.totalHarga)}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-600">
                        <span>Masuk: {item.stockMasukPcs} pcs</span>
                        <span>Terjual: {item.terjual} pcs</span>
                        <span>Sisa: {item.sisaRetur} pcs</span>
                      </div>
                      <button
                        onClick={() => onToggleStatus('konsinyasi_external', item.id, item.statusBayar)}
                        className={`w-full py-1.5 rounded-lg font-bold text-xs ${
                          String(item.statusBayar).toLowerCase().includes('lunas')
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        Status: {item.statusBayar} (Klik untuk Ubah)
                      </button>
                    </div>
                  )}

                  {itemCat === 'konsinyasi_guru' && (
                    <div className="space-y-2 text-xs bg-lime-50/50 p-2.5 rounded-xl border border-lime-100">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Tgl: {item.tanggal}</span>
                        <span className="font-extrabold text-lime-900">{formatRupiah(item.totalHarga)}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-600">
                        <span>Jumlah: {item.jumlahProdukPcs} pcs</span>
                        <span>Terjual: {item.terjualPcs} pcs</span>
                        <span>Sisa: {item.sisa} pcs</span>
                      </div>
                      <button
                        onClick={() => onToggleStatus('konsinyasi_guru', item.id, item.statusSetorKeGuru)}
                        className={`w-full py-1.5 rounded-lg font-bold text-xs ${
                          String(item.statusSetorKeGuru).toLowerCase().includes('sudah')
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        Status Setor: {item.statusSetorKeGuru} (Klik untuk Ubah)
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
