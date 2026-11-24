import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileText, 
  ExternalLink, 
  GraduationCap, 
  CheckCircle, 
  Clock 
} from 'lucide-react';
import { formatRupiah } from '../types/categoryData';

export default function ReportsModal({ isOpen, onClose, stockData, metrics }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('konsinyasi'); // 'konsinyasi' | 'stok_reguler'

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    let rows = [];
    if (activeTab === 'konsinyasi') {
      rows.push(['Kategori', 'Tanggal', 'Pihak / Guru', 'Nama Produk', 'Jumlah', 'Terjual', 'Sisa', 'Total Harga', 'Status']);
      (stockData.konsinyasi_external || []).forEach(item => {
        rows.push(['External', item.tanggal, item.namaProdukSupplier, item.namaProdukSupplier, item.stockMasukPcs, item.terjual, item.sisaRetur, item.totalHarga, item.statusBayar]);
      });
      (stockData.konsinyasi_guru || []).forEach(item => {
        rows.push(['Guru', item.tanggal, item.namaGuru, item.namaProduk, item.jumlahProdukPcs, item.terjualPcs, item.sisa, item.totalHarga, item.statusSetorKeGuru]);
      });
    } else {
      rows.push(['Kategori', 'Nama Produk', 'Harga Modal', 'Stok Aktual']);
      (stockData.snack || []).forEach(i => rows.push(['Snack', i.namaProduk, i.hargaKartonLamaModal, i.stokAktual]));
      (stockData.minuman || []).forEach(i => rows.push(['Minuman', i.namaProduk, i.harga1Karton, i.stokAktual]));
      (stockData.ice_cream || []).forEach(i => rows.push(['Ice Cream', i.namaProduk, i.harga1Karton, i.stokAktual]));
    }

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Kantin_AlImam_${activeTab}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-emerald-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                Rekapitulasi Laporan Kantin Al-Imam
              </h3>
              <p className="text-xs text-emerald-200">
                Laporan Pemisahan Kas Modal vs Kewajiban Setor Titipan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Header & Actions */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('konsinyasi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'konsinyasi'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Kewajiban Konsinyasi ({formatRupiah(metrics?.totalKewajibanKonsinyasi)})
            </button>
            <button
              onClick={() => setActiveTab('stok_reguler')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'stok_reguler'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Stok Reguler ({formatRupiah(metrics?.nilaiStokReguler)})
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Rekap</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor CSV</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {activeTab === 'konsinyasi' && (
            <div className="space-y-6">
              
              {/* Summary Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
                  <span className="text-xs text-amber-800 font-semibold block">Total Setoran External (Sari Roti, dll):</span>
                  <span className="text-xl font-bold">{formatRupiah(metrics?.kewajibanExternal)}</span>
                  <p className="text-[11px] text-amber-700 mt-1">{metrics?.totalExternalBelumLunas} transaksi belum lunas</p>
                </div>
                <div className="p-4 rounded-xl bg-lime-50 border border-lime-200 text-lime-950">
                  <span className="text-xs text-lime-800 font-semibold block">Total Setoran Titipan Guru:</span>
                  <span className="text-xl font-bold">{formatRupiah(metrics?.kewajibanGuru)}</span>
                  <p className="text-[11px] text-lime-700 mt-1">{metrics?.totalGuruBelumSetor} titipan belum disetor</p>
                </div>
              </div>

              {/* Tabel Konsinyasi Guru */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <GraduationCap className="w-4 h-4 text-lime-700" />
                  <span>Daftar Titipan Guru (Sheet: Konsinyasi_Guru)</span>
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-lime-50/70 border-b border-lime-100 font-semibold text-lime-950">
                      <tr>
                        <th className="p-2.5">Tanggal</th>
                        <th className="p-2.5">Nama Guru</th>
                        <th className="p-2.5">Produk</th>
                        <th className="p-2.5 text-center">Terjual</th>
                        <th className="p-2.5 text-center">Sisa</th>
                        <th className="p-2.5 text-right">Total Setor</th>
                        <th className="p-2.5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(stockData.konsinyasi_guru || []).map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 text-slate-500">{item.tanggal}</td>
                          <td className="p-2.5 font-bold text-slate-800">{item.namaGuru}</td>
                          <td className="p-2.5 text-slate-700">{item.namaProduk}</td>
                          <td className="p-2.5 text-center text-emerald-700 font-bold">{item.terjualPcs}</td>
                          <td className="p-2.5 text-center text-amber-700">{item.sisa}</td>
                          <td className="p-2.5 text-right font-extrabold text-lime-900">{formatRupiah(item.totalHarga)}</td>
                          <td className="p-2.5 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              String(item.statusSetorKeGuru).toLowerCase().includes('sudah')
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {item.statusSetorKeGuru}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tabel Konsinyasi External */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <ExternalLink className="w-4 h-4 text-amber-700" />
                  <span>Daftar Konsinyasi Luar (Sheet: Konsinyasi_External)</span>
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-amber-50/70 border-b border-amber-100 font-semibold text-amber-950">
                      <tr>
                        <th className="p-2.5">Tanggal</th>
                        <th className="p-2.5">Produk / Supplier</th>
                        <th className="p-2.5 text-center">Masuk</th>
                        <th className="p-2.5 text-center">Terjual</th>
                        <th className="p-2.5 text-right">Total Tagihan</th>
                        <th className="p-2.5 text-center">Status Bayar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(stockData.konsinyasi_external || []).map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 text-slate-500">{item.tanggal}</td>
                          <td className="p-2.5 font-bold text-slate-800">{item.namaProdukSupplier}</td>
                          <td className="p-2.5 text-center text-slate-700">{item.stockMasukPcs}</td>
                          <td className="p-2.5 text-center text-emerald-700 font-bold">{item.terjual}</td>
                          <td className="p-2.5 text-right font-extrabold text-amber-900">{formatRupiah(item.totalHarga)}</td>
                          <td className="p-2.5 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              String(item.statusBayar).toLowerCase().includes('lunas')
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {item.statusBayar}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'stok_reguler' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <span className="text-xs text-emerald-800 font-semibold block">Total Estimasi Modal Stok Kantin:</span>
                <span className="text-2xl font-bold">{formatRupiah(metrics?.nilaiStokReguler)}</span>
                <p className="text-[11px] text-emerald-700 mt-1">Total {metrics?.totalItemReguler} varian produk reguler</p>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 font-semibold text-slate-800">
                    <tr>
                      <th className="p-2.5">Kategori</th>
                      <th className="p-2.5">Produk</th>
                      <th className="p-2.5 text-right">Harga Modal</th>
                      <th className="p-2.5">Stok Aktual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(stockData.snack || []).map((i, idx) => (
                      <tr key={`snk-${idx}`} className="hover:bg-slate-50">
                        <td className="p-2.5 text-slate-500">Snack</td>
                        <td className="p-2.5 font-bold text-slate-800">{i.namaProduk}</td>
                        <td className="p-2.5 text-right">{formatRupiah(i.hargaKartonLamaModal)}</td>
                        <td className="p-2.5">{i.stokAktual}</td>
                      </tr>
                    ))}
                    {(stockData.minuman || []).map((i, idx) => (
                      <tr key={`mnm-${idx}`} className="hover:bg-slate-50">
                        <td className="p-2.5 text-slate-500">Minuman</td>
                        <td className="p-2.5 font-bold text-slate-800">{i.namaProduk}</td>
                        <td className="p-2.5 text-right">{formatRupiah(i.harga1Karton)}</td>
                        <td className="p-2.5">{i.stokAktual}</td>
                      </tr>
                    ))}
                    {(stockData.ice_cream || []).map((i, idx) => (
                      <tr key={`ice-${idx}`} className="hover:bg-slate-50">
                        <td className="p-2.5 text-slate-500">Ice Cream</td>
                        <td className="p-2.5 font-bold text-slate-800">{i.namaProduk}</td>
                        <td className="p-2.5 text-right">{formatRupiah(i.harga1Karton)}</td>
                        <td className="p-2.5">{i.stokAktual}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
