import React from 'react';
import { 
  Coins, 
  HandCoins, 
  AlertTriangle, 
  Boxes, 
  ExternalLink, 
  GraduationCap, 
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
    <div className="space-y-3.5 mb-5 sm:mb-6">
      
      {/* Notice Bar for Bu Shalatina & Kak Dini */}
      <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 text-xs text-emerald-950 shadow-2xs">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <span className="text-[11px] sm:text-xs">
            <strong>Pemisahan Finansial Kantin:</strong> Modal Kantin terpisah dari Uang Titipan Supplier & Guru.
          </span>
        </div>
        {stokMenipis > 0 && (
          <div className="self-start xs:self-auto inline-flex items-center space-x-1 font-bold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full text-[10px] sm:text-xs">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>{stokMenipis} Produk Menipis</span>
          </div>
        )}
      </div>

      {/* Main 2 Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        
        {/* CARD 1: TOTAL NILAI STOK REGULER (Snack, Minuman, Ice Cream) */}
        <div className="bg-gradient-to-br from-white to-emerald-50/50 rounded-2xl p-4 sm:p-5 border border-emerald-200 shadow-xs hover:shadow-sm transition">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Coins className="w-3 h-3 text-emerald-700" />
                <span>Modal Kantin Al-Imam</span>
              </span>
              <h3 className="text-xs sm:text-sm font-semibold text-slate-500 pt-0.5">
                Total Nilai Stok Reguler (Snack, Minuman, Ice Cream)
              </h3>
              <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-emerald-700 tracking-tight">
                {formatRupiah(nilaiStokReguler)}
              </div>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <Boxes className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          <div className="mt-3.5 pt-2.5 border-t border-emerald-100 flex flex-wrap items-center justify-between text-[11px] sm:text-xs text-slate-600 gap-2">
            <div className="flex items-center space-x-2">
              <span><strong>{totalItemReguler}</strong> Varian Produk</span>
              <span>•</span>
              <span className={stokMenipis > 0 ? 'text-amber-700 font-bold' : 'text-slate-500'}>
                {stokMenipis} Menipis
              </span>
            </div>
            <span className="text-slate-400 text-[10px] sm:text-[11px]">
              Snack • Minuman • Ice Cream
            </span>
          </div>
        </div>

        {/* CARD 2: TOTAL KEWAJIBAN SETOR KONSINYASI (External & Guru) */}
        <div className="bg-gradient-to-br from-white to-amber-50/50 rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-xs hover:shadow-sm transition">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                <HandCoins className="w-3 h-3 text-amber-700" />
                <span>Titipan Belum Disetor</span>
              </span>
              <h3 className="text-xs sm:text-sm font-semibold text-slate-500 pt-0.5">
                Total Kewajiban Setor Konsinyasi (External & Guru)
              </h3>
              <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-amber-600 tracking-tight">
                {formatRupiah(totalKewajibanKonsinyasi)}
              </div>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 flex-shrink-0">
              <HandCoins className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          {/* Breakdown: External vs Guru (Stacks smoothly on small mobile) */}
          <div className="mt-3.5 pt-2.5 border-t border-amber-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => onFilterCategory('konsinyasi_external')}
              className="p-2 sm:p-2.5 rounded-xl bg-white/90 border border-amber-200 hover:border-amber-300 active:scale-[0.98] text-left transition flex items-center justify-between shadow-2xs"
            >
              <div>
                <p className="text-slate-500 text-[10px] sm:text-xs flex items-center space-x-1">
                  <ExternalLink className="w-3 h-3 text-amber-600 inline mr-0.5" />
                  <span>External (Sari Roti, dll)</span>
                </p>
                <p className="font-bold text-slate-800 text-xs sm:text-sm">{formatRupiah(kewajibanExternal)}</p>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-md">
                {totalExternalBelumLunas} Belum
              </span>
            </button>

            <button
              onClick={() => onFilterCategory('konsinyasi_guru')}
              className="p-2 sm:p-2.5 rounded-xl bg-white/90 border border-lime-200 hover:border-lime-300 active:scale-[0.98] text-left transition flex items-center justify-between shadow-2xs"
            >
              <div>
                <p className="text-slate-500 text-[10px] sm:text-xs flex items-center space-x-1">
                  <GraduationCap className="w-3 h-3 text-lime-600 inline mr-0.5" />
                  <span>Titipan Guru</span>
                </p>
                <p className="font-bold text-slate-800 text-xs sm:text-sm">{formatRupiah(kewajibanGuru)}</p>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-lime-100 text-lime-800 rounded-md">
                {totalGuruBelumSetor} Belum
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
