import React, { useState } from 'react';
import { 
  UserCheck, 
  RefreshCw, 
  FileText, 
  Database, 
  Menu, 
  X, 
  LogOut,
  ShieldCheck,
  User,
  Boxes,
  ArrowLeftRight
} from 'lucide-react';

export default function Header({ 
  currentUser, 
  onLogout,
  isRemote, 
  onRefresh, 
  onOpenSetup, 
  onOpenReport,
  loading,
  currentView = 'stock', // 'stock' | 'mutasi'
  onChangeView
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userName = currentUser?.name || 'Petugas Kantin';
  const userRole = currentUser?.roleLabel || 'Staf Kantin';
  const isAdmin = currentUser?.role === 'admin';

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

          {/* Center Navigation Switch: Master Stok vs Mutasi Masuk/Keluar (Desktop & Tablet) */}
          <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
            <button
              onClick={() => onChangeView('stock')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl font-bold transition ${
                currentView === 'stock'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>Buku Stok Master (5 Kategori)</span>
            </button>
            <button
              onClick={() => onChangeView('mutasi')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl font-bold transition ${
                currentView === 'mutasi'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Mutasi Masuk / Keluar (Harian/Mingguan/Bulanan)</span>
            </button>
          </div>

          {/* Desktop Right Controls (hidden on mobile, visible md+) */}
          <div className="hidden md:flex items-center space-x-2.5">
            
            {/* Status Connection (Admin can configure) */}
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

            {/* Logged in User Profile Card */}
            <div className="flex items-center bg-slate-100/90 rounded-xl px-2.5 py-1 border border-slate-200 space-x-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs">
                {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className="text-left">
                <p className="text-xs font-extrabold text-slate-800 leading-tight">
                  {userName}
                </p>
                <p className="text-[10px] text-emerald-700 font-semibold leading-none">
                  {userRole}
                </p>
              </div>
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

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 hover:border-rose-200 transition"
              title="Keluar / Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

          {/* Mobile Right Controls: User avatar + Refresh + Menu Toggle */}
          <div className="flex md:hidden items-center space-x-1.5">
            <div className="px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-900 flex items-center space-x-1">
              <span>{userName}</span>
            </div>

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

        {/* Mobile View Toggle Bar (Stock vs Mutasi) */}
        <div className="lg:hidden py-2 border-t border-slate-100 grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onChangeView('stock')}
            className={`py-1.5 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-1 transition ${
              currentView === 'stock'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Buku Stok</span>
          </button>
          <button
            onClick={() => onChangeView('mutasi')}
            className={`py-1.5 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-1 transition ${
              currentView === 'mutasi'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Mutasi Masuk/Keluar</span>
          </button>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 px-1 border-t border-slate-100 space-y-2.5 animate-in slide-in-from-top-2 duration-150">
            {/* User Profile Bar */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-800">
                    {userName}
                  </p>
                  <p className="text-[10px] text-emerald-700 font-semibold">
                    {userRole}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 flex items-center space-x-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
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
