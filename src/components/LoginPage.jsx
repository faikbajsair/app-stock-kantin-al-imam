import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  LogIn, 
  ShieldCheck, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { authService, USERS } from '../services/authService';

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      const res = authService.login(username, password);
      if (res.success) {
        onLoginSuccess(res.user);
      } else {
        setErrorMsg(res.message);
      }
      setLoading(false);
    }, 200);
  };

  const handleQuickLogin = (userConfig) => {
    setUsername(userConfig.username);
    setPassword(userConfig.password);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/60 via-slate-50 to-white flex flex-col justify-center items-center px-4 py-8 sm:px-6">
      
      <div className="max-w-md w-full space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Brand Card Header */}
        <div className="text-center space-y-3">
          <div className="inline-block p-3 rounded-2xl bg-white shadow-sm border border-emerald-100">
            <img 
              src="/logo-alimam.png" 
              alt="Logo Al-Imam Islamic School" 
              className="h-16 sm:h-20 w-auto mx-auto object-contain"
            />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
              Kantin Al-Imam
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Sistem Manajemen Stok & Konsinyasi Terpadu
            </p>
          </div>
        </div>

        {/* Login Form Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-950/5 border border-emerald-100/80">
          
          <div className="mb-5">
            <h3 className="text-base font-bold text-slate-800">
              Masuk ke Aplikasi
            </h3>
            <p className="text-xs text-slate-500">
              Silakan login sebagai Pengelola atau Staf Kantin
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Masukkan username..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition bg-slate-50/40 focus:bg-white"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Masukkan password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition bg-slate-50/40 focus:bg-white"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-md shadow-emerald-200 transition flex items-center justify-center space-x-2 text-sm mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Memeriksa Akun...' : 'Masuk Sekarang'}</span>
            </button>

          </form>

          {/* Quick Login Helper */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Pilih Akun Cepat (Demo):</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {USERS.map((u) => (
                <button
                  key={u.username}
                  type="button"
                  onClick={() => handleQuickLogin(u)}
                  className="p-2 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-emerald-50 hover:border-emerald-300 text-left transition group active:scale-95"
                >
                  <p className="font-extrabold text-xs text-slate-800 group-hover:text-emerald-900">
                    {u.name}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    User: {u.username}
                  </p>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400">
          Al-Imam Islamic School • Manajemen Kantin v2.0
        </p>

      </div>

    </div>
  );
}
