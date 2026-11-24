import React from 'react';
import { 
  Coins, 
  HandCoins, 
  AlertTriangle, 
  Boxes, 
  ExternalLink, 
  GraduationCap, 
  CheckCircle2, 
  Info 
} from 'lucide-react';
import { formatRupiah } from '../types/categoryData';

export default function DashboardSummary({ metrics, onFilterCategory }) {
  const {
    nilaiStokReguler = 0,
    totalItemReguler = 0,
    stokMenipis = 0,
    kewajibanExternal = 0,
    kewajibanGuru = 0,
    totalKewajibanKonsinyasi = 0,
    totalExternalBelumLunas = 0,
    totalGuruBelumSetor = 0
  } = metrics || {};

  return (
    <div className="space-y-4 mb-6">
      
      {/* Notice Bar for Bu Shalatina & Kak Dini */}
      <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-emerald-900 shadow-sm">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            <strong>Pemisahan Finansial Kantin Al-Imam:</strong> Modal Stok Kantin dipisahkan secara tegas dari Kewajiban Setoran Konsinyasi.
          </span>
        </div>
        {stokMenipis > 0 && (
          <div className="hidden sm:flex items-center space-x-1 font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{stokMenipis} Produk Menipis</span>
          </div>
        )}
      </div>

      {/* Main 2 Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* CARD 1: TOTAL NILAI STOK REGULER (Snack, Minuman, Ice Cream) */}
        <div className="bg-gradient-to-br from-white to-emerald-50/40 rounded-2xl p-5 border border-emerald-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Coins className="w-3 h-3 text-emerald-700" />
                <span>Modal Kantin Al-Imam</span>
              </span>
              <h3 className="text-sm font-medium text-slate-500 pt-1">
                Total Nilai Stok Reguler (Snack, Minuman, Ice Cream)
              </h3>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-emerald-700">
                {formatRupiah(nilaiStokReguler)}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <Boxes className="w-6 h-6" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-100/80 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center space-x-3">
              <span><strong>{totalItemReguler}</strong> Varian Produk</span>
              <span>•</span>
              <span className={stokMenipis > 0 ? 'text-amber-600 font-semibold flex items-center space-x-1' : 'text-slate-500'}>
                {stokMenipis > 0 && <AlertTriangle className="w-3 h-3 inline mr-0.5" />}
                {stokMenipis} Menipis
              </span>
            </div>
            <div className="flex items-center space-x-1 text-slate-400">
              <span>Snack • Minuman • Ice Cream</span>
            </div>
          </div>
        </div>

        {/* CARD 2: TOTAL KEWAJIBAN SETOR KONSINYASI (External & Guru) */}
        <div className="bg-gradient-to-br from-white to-amber-50/40 rounded-2xl p-5 border border-amber-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                <HandCoins className="w-3 h-3 text-amber-700" />
                <span>Titipan Belum Disetor</span>
              </span>
              <h3 className="text-sm font-medium text-slate-500 pt-1">
                Total Kewajiban Setor Konsinyasi (External & Guru)
              </h3>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-amber-600">
                {formatRupiah(totalKewajibanKonsinyasi)}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
              <HandCoins className="w-6 h-6" />
            </div>
          </div>

          {/* Breakdown: External vs Guru */}
          <div className="mt-4 pt-3 border-t border-amber-100/80 grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => onFilterCategory('konsinyasi_external')}
              className="p-2 rounded-lg bg-white/80 border border-amber-100 hover:border-amber-300 text-left transition flex items-center justify-between"
            >
              <div>
                <p className="text-slate-500 flex items-center space-x-1">
                  <ExternalLink className="w-3 h-3 text-amber-600" />
                  <span>External (Sari Roti, dll)</span>
                </p>
                <p className="font-bold text-slate-800">{formatRupiah(kewajibanExternal)}</p>
              </div>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded">
                {totalExternalBelumLunas} Belum
              </span>
            </button>

            <button
              onClick={() => onFilterCategory('konsinyasi_guru')}
              className="p-2 rounded-lg bg-white/80 border border-lime-100 hover:border-lime-300 text-left transition flex items-center justify-between"
            >
              <div>
                <p className="text-slate-500 flex items-center space-x-1">
                  <GraduationCap className="w-3 h-3 text-lime-600" />
                  <span>Titipan Guru</span>
                </p>
                <p className="font-bold text-slate-800">{formatRupiah(kewajibanGuru)}</p>
              </div>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-lime-100 text-lime-800 rounded">
                {totalGuruBelumSetor} Belum
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
