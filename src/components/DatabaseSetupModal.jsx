import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Check, 
  Copy, 
  ExternalLink, 
  AlertCircle, 
  Sparkles, 
  RefreshCw 
} from 'lucide-react';
import { storageService } from '../services/storageService';

export default function DatabaseSetupModal({
  isOpen,
  onClose,
  onTriggerSetup,
  onReloadData
}) {
  if (!isOpen) return null;

  const [gasUrl, setGasUrl] = useState(storageService.getGasUrl());
  const [isSaved, setIsSaved] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const handleSaveUrl = (e) => {
    e.preventDefault();
    storageService.setGasUrl(gasUrl);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    onReloadData();
  };

  const handleRunSetup = async () => {
    setIsProcessing(true);
    setMessage('');
    try {
      const res = await onTriggerSetup();
      setMessage('✅ Berhasil menginisialisasi 5 Sheet dan data Auto-Seed!');
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-emerald-100 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <h3 className="font-bold text-base sm:text-lg">
              Koneksi & Inisialisasi Google Spreadsheet
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs text-slate-600">
          
          {/* Step Guide */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center space-x-1.5 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Struktur 5 Kategori Database Kantin Al-Imam:</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
              <li><strong>Stock_Snack:</strong> Perhitungan bertingkat Karton ➔ Dus ➔ Pcs</li>
              <li><strong>Stock_Minuman:</strong> Auto-seed Stee, Fruit tea, Teh Botol, Prima, dll.</li>
              <li><strong>Stock_IceCream:</strong> Auto-seed Neopolitan, Reguler, Choco dip, dll.</li>
              <li><strong>Konsinyasi_External:</strong> Sari Roti (23/11/2026, 27 Pcs, Rp 127.000)</li>
              <li><strong>Konsinyasi_Guru:</strong> Baso goreng, Titipan Guru dengan Autocomplete</li>
            </ul>
          </div>

          {/* Web App URL Form */}
          <form onSubmit={handleSaveUrl} className="space-y-2">
            <label className="block font-bold text-slate-700">
              URL Web App Google Apps Script (Deployment GAS):
            </label>
            <div className="flex space-x-2">
              <input
                type="url"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={gasUrl}
                onChange={(e) => setGasUrl(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition flex items-center space-x-1"
              >
                {isSaved ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{isSaved ? 'Tersimpan!' : 'Simpan'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Kosongkan jika ingin menggunakan penyimpanan lokal di browser (Demo / Offline).
            </p>
          </form>

          {/* Action Button: setupDatabase() */}
          <div className="pt-3 border-t border-slate-200">
            <button
              onClick={handleRunSetup}
              disabled={isProcessing}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>Inisialisasi / Reset Database (setupDatabase)</span>
            </button>
            {message && (
              <p className="mt-2 text-center text-xs font-semibold text-slate-800">
                {message}
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
