import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import DashboardSummary from './components/DashboardSummary';
import CategoryTabs from './components/CategoryTabs';
import StockList from './components/StockList';
import DynamicStockModal from './components/DynamicStockModal';
import ReportsModal from './components/ReportsModal';
import DatabaseSetupModal from './components/DatabaseSetupModal';
import { gasService } from './services/gasService';

export default function App() {
  const [currentUser, setCurrentUser] = useState('Bu Shalatina');
  const [activeCategory, setActiveCategory] = useState('all');
  const [stockData, setStockData] = useState({
    snack: [],
    minuman: [],
    ice_cream: [],
    konsinyasi_external: [],
    konsinyasi_guru: [],
    teachersList: []
  });
  const [metrics, setMetrics] = useState({});
  const [isRemote, setIsRemote] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  // Load data on startup
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await gasService.fetchData();
      setStockData(res.data);
      setMetrics(res.dashboard);
      setIsRemote(res.isRemote);
    } catch (e) {
      console.error('Error loading data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute item counts for tabs
  const itemCounts = useMemo(() => {
    const snackCount = (stockData.snack || []).length;
    const minumanCount = (stockData.minuman || []).length;
    const iceCreamCount = (stockData.ice_cream || []).length;
    const externalCount = (stockData.konsinyasi_external || []).length;
    const guruCount = (stockData.konsinyasi_guru || []).length;

    return {
      all: snackCount + minumanCount + iceCreamCount + externalCount + guruCount,
      snack: snackCount,
      minuman: minumanCount,
      ice_cream: iceCreamCount,
      konsinyasi_external: externalCount,
      konsinyasi_guru: guruCount
    };
  }, [stockData]);

  // Combine items when category is 'all'
  const displayedItems = useMemo(() => {
    if (activeCategory !== 'all') {
      return stockData[activeCategory] || [];
    }

    // Merge with tag
    const snacks = (stockData.snack || []).map(i => ({ ...i, _category: 'snack' }));
    const drinks = (stockData.minuman || []).map(i => ({ ...i, _category: 'minuman' }));
    const ice = (stockData.ice_cream || []).map(i => ({ ...i, _category: 'ice_cream' }));
    const ext = (stockData.konsinyasi_external || []).map(i => ({ ...i, _category: 'konsinyasi_external' }));
    const guru = (stockData.konsinyasi_guru || []).map(i => ({ ...i, _category: 'konsinyasi_guru' }));

    return [...snacks, ...drinks, ...ice, ...ext, ...guru];
  }, [stockData, activeCategory]);

  // Handlers
  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category, item) => {
    setEditingItem({ ...item, _category: category });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (cat, formData) => {
    setLoading(true);
    try {
      if (editingItem) {
        await gasService.updateItem(cat, editingItem.id, formData, currentUser);
      } else {
        await gasService.addItem(cat, formData, currentUser);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      await loadData();
    } catch (err) {
      alert('Gagal menyimpan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (cat, id) => {
    if (!window.confirm(`Yakin ingin menghapus item ${id}?`)) return;
    setLoading(true);
    try {
      await gasService.deleteItem(cat, id, currentUser);
      await loadData();
    } catch (err) {
      alert('Gagal menghapus: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (cat, id, currentStatus) => {
    let nextStatus = 'Belum';
    if (cat === 'konsinyasi_external') {
      nextStatus = String(currentStatus).toLowerCase().includes('lunas') ? 'Belum' : 'Lunas';
    } else if (cat === 'konsinyasi_guru') {
      nextStatus = String(currentStatus).toLowerCase().includes('sudah') ? 'Belum' : 'Sudah';
    }

    setLoading(true);
    try {
      await gasService.updateStatus(cat, id, nextStatus, currentUser);
      await loadData();
    } catch (err) {
      alert('Gagal memperbarui status: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerSetup = async () => {
    const res = await gasService.triggerSetupDatabase();
    await loadData();
    return res;
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col text-slate-800">
      
      {/* 1. Header Navigation */}
      <Header
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        isRemote={isRemote}
        onRefresh={loadData}
        onOpenSetup={() => setIsSetupOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        loading={loading}
      />

      {/* 2. Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {/* Ringkasan Dashboard Terpisah (Modal Kantin vs Kewajiban Setoran) */}
        <DashboardSummary
          metrics={metrics}
          onFilterCategory={(cat) => setActiveCategory(cat)}
        />

        {/* Tab Navigasi Kategori (Scrollable Pastel Green Pills) */}
        <CategoryTabs
          activeCategory={activeCategory}
          onSelectCategory={(cat) => setActiveCategory(cat)}
          itemCounts={itemCounts}
        />

        {/* Tabel / Card View Master Barang & Buku Stok */}
        <StockList
          category={activeCategory}
          items={displayedItems}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAddItem={handleOpenAdd}
          onEditItem={handleOpenEdit}
          onDeleteItem={handleDeleteItem}
          onToggleStatus={handleToggleStatus}
          currentUser={currentUser}
        />

      </main>

      {/* 3. Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-5 text-center text-xs text-slate-500">
        <div className="flex flex-col items-center justify-center space-y-1.5 px-4">
          <img 
            src="/logo-alimam.png" 
            alt="Al-Imam Logo" 
            className="h-8 w-auto opacity-75 object-contain"
          />
          <p className="font-semibold text-slate-700">
            Sistem Manajemen Stok & Konsinyasi Kantin Al-Imam
          </p>
          <p className="text-[11px] text-slate-400">
            Al-Imam Islamic School • Versi 2.0 (5 Kategori Bisnis Aktual)
          </p>
        </div>
      </footer>

      {/* 4. Modals */}
      <DynamicStockModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveModal}
        initialCategory={activeCategory}
        editItem={editingItem}
        teachersList={stockData.teachersList || []}
      />

      <ReportsModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        stockData={stockData}
        metrics={metrics}
      />

      <DatabaseSetupModal
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        onTriggerSetup={handleTriggerSetup}
        onReloadData={loadData}
      />

    </div>
  );
}
