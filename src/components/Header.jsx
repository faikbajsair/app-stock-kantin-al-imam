import React from 'react';
import { Store, UserCheck, RefreshCw, FileSpreadsheet, FileText, Database } from 'lucide-react';

export default function Header({ 
  currentUser, 
  setCurrentUser, 
  isRemote, 
  onRefresh, 
  onOpenSetup, 
  onOpenReport,
  loading 
}) {
  return (
    <header className="bg-white border-b border-emerald-100 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & School Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-200">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
                  Kantin Al-Imam
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Master Barang & Buku Stok 5 Kategori Operasional
              </p>
            </div>
          </div>

          {/* Right Controls: User Switch, Connection Badge, Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Status Connection */}
            <button
              onClick={onOpenSetup}
              title="Pengaturan Koneksi Google Sheets"
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
                isRemote 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isRemote ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="hidden md:inline">{isRemote ? 'Terkoneksi Sheets' : 'Mode Offline / Lokal'}</span>
              <Database className="w-3.5 h-3.5" />
            </button>

            {/* Active User Switch */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-slate-500 ml-1 mr-1 hidden sm:inline" />
              <select
                value={currentUser}
                onChange={(e) => setCurrentUser(e.target.value)}
                className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer py-0.5 px-1 text-xs"
              >
                <option value="Bu Shalatina">Bu Shalatina (Pengelola)</option>
                <option value="Kak Dini">Kak Dini (Staf Stok)</option>
                <option value="Admin Kantin">Admin Kantin</option>
              </select>
            </div>

            {/* Report Button */}
            <button
              onClick={onOpenReport}
              className="p-2 sm:px-3 sm:py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 flex items-center space-x-1 transition"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Laporan</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition"
              title="Sinkronkan Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
