import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calculator, 
  Sparkles, 
  Check, 
  User, 
  Building, 
  Package, 
  Calendar, 
  Coins 
} from 'lucide-react';
import { CATEGORIES, formatRupiah } from '../types/categoryData';

export default function DynamicStockModal({
  isOpen,
  onClose,
  onSave,
  initialCategory = 'snack',
  editItem = null,
  teachersList = []
}) {
  const [category, setCategory] = useState(initialCategory === 'all' ? 'snack' : initialCategory);
  const isEditing = !!editItem;

  // Form State
  const [formData, setFormData] = useState({});
  const [isCalculatedPriceEdited, setIsCalculatedPriceEdited] = useState(false);
  const [teacherSuggestions, setTeacherSuggestions] = useState([]);
  const [showTeacherSuggestions, setShowTeacherSuggestions] = useState(false);

  // Initialize or reset form
  useEffect(() => {
    if (editItem) {
      setCategory(editItem._category || initialCategory);
      setFormData({ ...editItem });
    } else {
      const today = new Date();
      const pad = (n) => (n < 10 ? '0' + n : n);
      const todayStr = `${pad(today.getDate())}/${pad(today.getMonth() + 1)}/${today.getFullYear()}`;

      setCategory(initialCategory === 'all' ? 'snack' : initialCategory);
      setFormData({
        tanggal: todayStr,
        isi1KartonPcs: 120,
        isiPcsPerdus: 20,
        hargaKartonLamaModal: '',
        hargaPerdus: '',
        stokAktual: '',
        stokMinimum: 5,
        stockMasukPcs: '',
        terjual: 0,
        terjualPcs: 0,
        jumlahProdukPcs: '',
        hargaSatuan: '',
        totalHarga: '',
        statusBayar: 'Belum',
        statusSetorKeGuru: 'Belum',
        namaGuru: '',
        namaProduk: '',
        namaProdukSupplier: ''
      });
      setIsCalculatedPriceEdited(false);
    }
  }, [editItem, initialCategory, isOpen]);

  // AUTO CALCULATOR: Snack (Harga Karton & Isi Pcs Perdus -> Harga Perdus)
  useEffect(() => {
    if (category === 'snack' && !isCalculatedPriceEdited) {
      const hargaKarton = Number(formData.hargaKartonLamaModal) || 0;
      const isiKarton = Number(formData.isi1KartonPcs) || 1;
      const isiPerdus = Number(formData.isiPcsPerdus) || 1;
      
      if (hargaKarton > 0 && isiKarton > 0) {
        const computed = Math.round((hargaKarton / isiKarton) * isiPerdus);
        setFormData(prev => ({ ...prev, hargaPerdus: computed }));
      }
    }
  }, [category, formData.hargaKartonLamaModal, formData.isi1KartonPcs, formData.isiPcsPerdus, isCalculatedPriceEdited]);

  // AUTO CALCULATOR: Konsinyasi External (Stock * Harga Satuan & Sisa)
  useEffect(() => {
    if (category === 'konsinyasi_external') {
      const stock = Number(formData.stockMasukPcs) || 0;
      const terjual = Number(formData.terjual) || 0;
      const hargaSatuan = Number(formData.hargaSatuan) || 0;
      
      const sisa = Math.max(0, stock - terjual);
      setFormData(prev => {
        const autoTotal = stock * hargaSatuan;
        return {
          ...prev,
          sisaRetur: sisa,
          // Only overwrite total if not manually edited or total is 0
          totalHarga: prev.totalHarga && isCalculatedPriceEdited ? prev.totalHarga : (autoTotal > 0 ? autoTotal : prev.totalHarga)
        };
      });
    }
  }, [category, formData.stockMasukPcs, formData.terjual, formData.hargaSatuan]);

  // AUTO CALCULATOR: Konsinyasi Guru (Jumlah, Terjual, Sisa, Total Harga)
  useEffect(() => {
    if (category === 'konsinyasi_guru') {
      const jumlah = Number(formData.jumlahProdukPcs) || 0;
      const terjual = Number(formData.terjualPcs) || 0;
      const hargaSatuan = Number(formData.hargaSatuan) || 0;
      
      const sisa = Math.max(0, jumlah - terjual);
      setFormData(prev => {
        const autoTotal = terjual * hargaSatuan;
        return {
          ...prev,
          sisa: sisa,
          totalHarga: prev.totalHarga && isCalculatedPriceEdited ? prev.totalHarga : (autoTotal > 0 ? autoTotal : prev.totalHarga)
        };
      });
    }
  }, [category, formData.jumlahProdukPcs, formData.terjualPcs, formData.hargaSatuan]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTeacherSearch = (value) => {
    handleChange('namaGuru', value);
    if (!value) {
      setTeacherSuggestions(teachersList);
    } else {
      const filtered = teachersList.filter(t => t.toLowerCase().includes(value.toLowerCase()));
      setTeacherSuggestions(filtered);
    }
    setShowTeacherSuggestions(true);
  };

  const handleSelectTeacher = (teacherName) => {
    handleChange('namaGuru', teacherName);
    setShowTeacherSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(category, formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-emerald-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <h3 className="font-bold text-base sm:text-lg">
              {isEditing ? 'Edit Data Produk / Titipan' : '+ Tambah Stok / Titipan Baru'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* 1. Pilih Kategori Bisnis (Disabled if editing) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Pilih Kategori Bisnis Kantin
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                <button
                  type="button"
                  key={cat.id}
                  disabled={isEditing}
                  onClick={() => {
                    setCategory(cat.id);
                    setIsCalculatedPriceEdited(false);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-left border transition ${
                    category === cat.id
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-500 ring-2 ring-emerald-500/30'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  } ${isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <span className="block truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* 2. FORM DINAMIS SESUAI KATEGORI */}

          {/* KATEGORI A: SNACK */}
          {category === 'snack' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Produk Snack *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Beng-Beng Wafer, Chitato..."
                  value={formData.namaProduk || ''}
                  onChange={(e) => handleChange('namaProduk', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Isi 1 Karton (Pcs)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="120"
                    value={formData.isi1KartonPcs || ''}
                    onChange={(e) => handleChange('isi1KartonPcs', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Harga Karton (Modal)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Rp 210.000"
                    value={formData.hargaKartonLamaModal || ''}
                    onChange={(e) => handleChange('hargaKartonLamaModal', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
                <div>
                  <label className="block text-xs font-semibold text-emerald-900 mb-1">
                    Isi Pcs Perdus
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="20"
                    value={formData.isiPcsPerdus || ''}
                    onChange={(e) => handleChange('isiPcsPerdus', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-white rounded-lg border border-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-emerald-900">
                      Harga Perdus
                    </label>
                    <span className="text-[10px] text-emerald-700 font-medium flex items-center">
                      <Calculator className="w-2.5 h-2.5 mr-0.5" /> Auto-Hitung
                    </span>
                  </div>
                  <input
                    type="number"
                    placeholder="Terhitung otomatis"
                    value={formData.hargaPerdus || ''}
                    onChange={(e) => {
                      setIsCalculatedPriceEdited(true);
                      handleChange('hargaPerdus', e.target.value);
                    }}
                    className="w-full px-3 py-1.5 text-sm bg-white font-bold text-emerald-800 rounded-lg border border-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <p className="col-span-2 text-[11px] text-emerald-700 italic">
                  💡 Kalkulator Otomatis: (Harga Karton / Isi Karton) × Isi Perdus. Dapat diedit manual jika ada penyesuaian modal.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Stok Aktual (Karton / Dus / Pcs)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 2 Karton, 3 Dus (atau 45 pcs)"
                  value={formData.stokAktual || ''}
                  onChange={(e) => handleChange('stokAktual', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* KATEGORI B & C: MINUMAN & ICE CREAM */}
          {(category === 'minuman' || category === 'ice_cream') && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Produk {category === 'minuman' ? 'Minuman' : 'Ice Cream'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={category === 'minuman' ? 'Contoh: Stee, Teh Botol, Prima 600...' : 'Contoh: Neopolitan, Choco dip...'}
                  value={formData.namaProduk || ''}
                  onChange={(e) => handleChange('namaProduk', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Harga 1 Karton / Box *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="Rp 45.000"
                    value={formData.harga1Karton || ''}
                    onChange={(e) => handleChange('harga1Karton', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Stok Minimum (Alert)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="5"
                    value={formData.stokMinimum || ''}
                    onChange={(e) => handleChange('stokMinimum', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Stok Aktual ({category === 'minuman' ? 'Karton / Pcs' : 'Box / Karton'})
                </label>
                <input
                  type="text"
                  placeholder={category === 'minuman' ? 'Contoh: 15 Karton' : 'Contoh: 6 Box'}
                  value={formData.stokAktual || ''}
                  onChange={(e) => handleChange('stokAktual', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* KATEGORI D: KONSINYASI EXTERNAL */}
          {category === 'konsinyasi_external' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal (DD/MM/YYYY)
                  </label>
                  <input
                    type="text"
                    value={formData.tanggal || ''}
                    onChange={(e) => handleChange('tanggal', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status Bayar
                  </label>
                  <select
                    value={formData.statusBayar || 'Belum'}
                    onChange={(e) => handleChange('statusBayar', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-700"
                  >
                    <option value="Belum">Belum Lunas</option>
                    <option value="Lunas">Lunas</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Produk / Supplier Luar *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sari Roti, Roti Aoka..."
                  value={formData.namaProdukSupplier || ''}
                  onChange={(e) => handleChange('namaProdukSupplier', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Stock Masuk (Pcs)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="27"
                    value={formData.stockMasukPcs || ''}
                    onChange={(e) => handleChange('stockMasukPcs', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Terjual (Pcs)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="20"
                    value={formData.terjual || ''}
                    onChange={(e) => handleChange('terjual', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sisa / Retur
                  </label>
                  <input
                    type="number"
                    readOnly
                    placeholder="Auto"
                    value={formData.sisaRetur !== undefined ? formData.sisaRetur : ''}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-100 text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-amber-50/70 rounded-xl border border-amber-200">
                <div>
                  <label className="block text-xs font-semibold text-amber-900 mb-1">
                    Harga Satuan
                  </label>
                  <input
                    type="number"
                    placeholder="Rp 4.700"
                    value={formData.hargaSatuan || ''}
                    onChange={(e) => handleChange('hargaSatuan', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-white rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-900 mb-1">
                    Total Harga (Otomatis / Input Manual)
                  </label>
                  <input
                    type="number"
                    placeholder="Rp 127.000"
                    value={formData.totalHarga || ''}
                    onChange={(e) => {
                      setIsCalculatedPriceEdited(true);
                      handleChange('totalHarga', e.target.value);
                    }}
                    className="w-full px-3 py-1.5 text-sm bg-white font-bold text-amber-900 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* KATEGORI E: KONSINYASI GURU */}
          {category === 'konsinyasi_guru' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal (DD/MM/YYYY)
                  </label>
                  <input
                    type="text"
                    value={formData.tanggal || ''}
                    onChange={(e) => handleChange('tanggal', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status Setor ke Guru
                  </label>
                  <select
                    value={formData.statusSetorKeGuru || 'Belum'}
                    onChange={(e) => handleChange('statusSetorKeGuru', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-700"
                  >
                    <option value="Belum">Belum Disetor</option>
                    <option value="Sudah">Sudah Disetor</option>
                  </select>
                </div>
              </div>

              {/* Autocomplete Nama Guru untuk Kak Dini */}
              <div className="relative">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Nama Guru / Penitip *
                  </label>
                  <span className="text-[10px] text-lime-700 font-medium">
                    ⚡ Autocomplete Staf Kak Dini
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Ketik atau pilih nama guru..."
                    value={formData.namaGuru || ''}
                    onFocus={() => {
                      setTeacherSuggestions(teachersList);
                      setShowTeacherSuggestions(true);
                    }}
                    onChange={(e) => handleTeacherSearch(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Autocomplete Popup List */}
                {showTeacherSuggestions && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {teacherSuggestions.length > 0 ? (
                      teacherSuggestions.map((teacher, i) => (
                        <div
                          key={i}
                          onClick={() => handleSelectTeacher(teacher)}
                          className="px-3.5 py-2 text-xs hover:bg-emerald-50 hover:text-emerald-900 cursor-pointer border-b border-slate-50 last:border-none flex items-center justify-between"
                        >
                          <span className="font-medium">{teacher}</span>
                          <span className="text-[10px] text-slate-400">Pilih</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-xs text-slate-400 italic">
                        Nama guru baru akan otomatis tersimpan
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Makanan / Produk Titipan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Baso goreng, Pastel Ayam, Lemper..."
                  value={formData.namaProduk || ''}
                  onChange={(e) => handleChange('namaProduk', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jumlah (Pcs)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="30"
                    value={formData.jumlahProdukPcs || ''}
                    onChange={(e) => handleChange('jumlahProdukPcs', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Terjual (Pcs)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="28"
                    value={formData.terjualPcs || ''}
                    onChange={(e) => handleChange('terjualPcs', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sisa
                  </label>
                  <input
                    type="number"
                    readOnly
                    placeholder="Auto"
                    value={formData.sisa !== undefined ? formData.sisa : ''}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-100 text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-lime-50/70 rounded-xl border border-lime-200">
                <div>
                  <label className="block text-xs font-semibold text-lime-900 mb-1">
                    Harga Satuan
                  </label>
                  <input
                    type="number"
                    placeholder="Rp 2.000"
                    value={formData.hargaSatuan || ''}
                    onChange={(e) => handleChange('hargaSatuan', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-white rounded-lg border border-lime-300 focus:ring-2 focus:ring-lime-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-lime-900 mb-1">
                    Total Setor (Terjual × Harga)
                  </label>
                  <input
                    type="number"
                    placeholder="Rp 56.000"
                    value={formData.totalHarga || ''}
                    onChange={(e) => {
                      setIsCalculatedPriceEdited(true);
                      handleChange('totalHarga', e.target.value);
                    }}
                    className="w-full px-3 py-1.5 text-sm bg-white font-bold text-lime-900 rounded-lg border border-lime-300 focus:ring-2 focus:ring-lime-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-200 transition"
            >
              {isEditing ? 'Simpan Perubahan' : 'Tambahkan ke Buku Stok'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
