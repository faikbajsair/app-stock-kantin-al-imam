import React, { useState } from 'react';
import { 
  UserCheck, 
  RefreshCw, 
  FileText, 
  Database, 
  Menu, 
  X, 
  ChevronDown,
  CheckCircle2
} from 'lucide-react';

export default function Header({ 
  currentUser, 
  setCurrentUser, 
  isRemote, 
  onRefresh, 
  onOpenSetup, 
  onOpenReport,
  loading 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-emerald-100 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & School Branding */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5">
            <img 
              src="/logo-alimam.png" 
              alt="Logo Al-Imam Islamic School" 
              className="h-9 sm:h-12 w-auto object-contain flex-shrink-0 drop-shadow-xs"
            />
            <div className="border-l border-slate-200 pl-2.5 sm:pl-3.5">
              <div className="flex items-center space-x-1.5">
                <h1 className="text-sm sm:text-lg font-extrabold text-slate-800 tracking-tight leading-tight">
                  Kantin Al-Imam
                </h1>
                <span className="text-[10px] sm:text-xs px-1.5 py-0.2 rounded font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium hidden xs:block">
                Al-Imam Islamic School
              </p>
            </div>
          </div>

          {/* Desktop Right Controls (hidden on mobile, visible sm+) */}
          <div className="hidden md:flex items-center space-x-2.5">
            
            {/* Status Connection */}
            <button
              onClick={onOpenSetup}
              title="Pengaturan Koneksi Google Sheets"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                isRemote 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isRemote ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>{isRemote ? 'Sheets Terhubung' : 'Mode Offline / Lokal'}</span>
              <Database className="w-3.5 h-3.5 opacity-70" />
            </button>

            {/* Active User Switch */}
            <div className="flex items-center bg-slate-100/90 rounded-xl px-2 py-1 border border-slate-200 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-emerald-700 mr-1.5" />
              <select
                value={currentUser}
                onChange={(e) => setCurrentUser(e.target.value)}
                className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer py-0.5 text-xs"
              >
                <option value="Bu Shalatina">Bu Shalatina (Pengelola)</option>
                <option value="Kak Dini">Kak Dini (Staf Stok)</option>
                <option value="Admin Kantin">Admin Kantin</option>
              </select>
            </div>

            {/* Report Button */}
            <button
              onClick={onOpenReport}
              className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 flex items-center space-x-1.5 transition shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Laporan</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition border border-transparent hover:border-emerald-200"
              title="Sinkronkan Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
            </button>

          </div>

          {/* Mobile Right Controls: Compact Buttons + Menu Toggle */}
          <div className="flex md:hidden items-center space-x-1.5">
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg active:scale-95 transition"
              title="Sinkronkan"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 active:scale-95 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 px-1 border-t border-slate-100 space-y-2.5 animate-in slide-in-from-top-2 duration-150">
            {/* User Selector */}
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 flex items-center">
                <UserCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Petugas:
              </span>
              <select
                value={currentUser}
                onChange={(e) => setCurrentUser(e.target.value)}
                className="bg-white font-bold text-slate-800 text-xs px-2 py-1 rounded-lg border border-slate-200"
              >
                <option value="Bu Shalatina">Bu Shalatina (Pengelola)</option>
                <option value="Kak Dini">Kak Dini (Staf Stok)</option>
                <option value="Admin Kantin">Admin Kantin</option>
              </select>
            </div>

            {/* Connection Status & Report Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSetup();
                }}
                className={`p-2.5 rounded-xl text-xs font-bold border flex items-center justify-center space-x-1.5 ${
                  isRemote 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${isRemote ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span>{isRemote ? 'Google Sheets' : 'Mode Offline'}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenReport();
                }}
                className="p-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Buka Laporan</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
