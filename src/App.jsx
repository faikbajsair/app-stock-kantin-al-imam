import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import DashboardSummary from './components/DashboardSummary';
import CategoryTabs from './components/CategoryTabs';
import StockList from './components/StockList';
import DynamicStockModal from './components/DynamicStockModal';
import ReportsModal from './components/ReportsModal';
import DatabaseSetupModal from './components/DatabaseSetupModal';
import LoginPage from './components/LoginPage';
import MutasiStockView from './components/MutasiStockView';
import RecordMutasiModal from './components/RecordMutasiModal';
import { gasService } from './services/gasService';
import { authService } from './services/authService';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());

  // Main View State: 'stock' (Master 5 Kategori) or 'mutasi' (Masuk/Keluar)
  const [currentView, setCurrentView] = useState('stock');

  const [activeCategory, setActiveCategory] = useState('all');
  const [stockData, setStockData] = useState({
    snack: [],
    minuman: [],
    ice_cream: [],
    konsinyasi_external: [],
    konsinyasi_guru: [],
    mutasi: [],
    teachersList: []
  });
  const [metrics, setMetrics] = useState({});
  const [mutasiAnalytics, setMutasiAnalytics] = useState({});
  const [isRemote, setIsRemote] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  // Mutasi Modal
  const [isMutasiModalOpen, setIsMutasiModalOpen] = useState(false);
  const [mutasiDefaultType, setMutasiDefaultType] = useState('MASUK');

  // Load data on startup if logged in
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await gasService.fetchData();
      setStockData(res.data);
      setMetrics(res.dashboard);
      setMutasiAnalytics(res.mutasiAnalytics || {});
      setIsRemote(res.isRemote);
    } catch (e) {
      console.error('Error loading data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  // Auth Handlers
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

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

    const snacks = (stockData.snack || []).map(i => ({ ...i, _category: 'snack' }));
    const drinks = (stockData.minuman || []).map(i => ({ ...i, _category: 'minuman' }));
    const ice = (stockData.ice_cream || []).map(i => ({ ...i, _category: 'ice_cream' }));
    const ext = (stockData.konsinyasi_external || []).map(i => ({ ...i, _category: 'konsinyasi_external' }));
    const guru = (stockData.konsinyasi_guru || []).map(i => ({ ...i, _category: 'konsinyasi_guru' }));

    return [...snacks, ...drinks, ...ice, ...ext, ...guru];
  }, [stockData, activeCategory]);

  // If user is not authenticated, show LoginPage
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Stock CRUD Handlers
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
      const activeUserName = currentUser?.name || 'Petugas Kantin';
      if (editingItem) {
        await gasService.updateItem(cat, editingItem.id, formData, activeUserName);
      } else {
        await gasService.addItem(cat, formData, activeUserName);
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
      await gasService.deleteItem(cat, id, currentUser?.name || 'Petugas Kantin');
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
      await gasService.updateStatus(cat, id, nextStatus, currentUser?.name || 'Petugas Kantin');
      await loadData();
    } catch (err) {
      alert('Gagal memperbarui status: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mutasi Handlers
  const handleOpenRecordMutasi = (type = 'MASUK') => {
    setMutasiDefaultType(type);
    setIsMutasiModalOpen(true);
  };

  const handleSaveMutasi = async (mutasiData) => {
    setLoading(true);
    try {
      await gasService.recordMutasi(mutasiData, currentUser?.name || 'Petugas Kantin');
      setIsMutasiModalOpen(false);
      await loadData();
    } catch (err) {
      alert('Gagal mencatat mutasi: ' + err.message);
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
        onLogout={handleLogout}
        isRemote={isRemote}
        onRefresh={loadData}
        onOpenSetup={() => setIsSetupOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        loading={loading}
        currentView={currentView}
        onChangeView={setCurrentView}
      />

      {/* 2. Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {/* VIEW A: MUTASI MASUK & KELUAR (Harian, Mingguan, Bulanan) */}
        {currentView === 'mutasi' ? (
          <MutasiStockView
            mutasiList={stockData.mutasi || []}
            mutasiAnalytics={mutasiAnalytics}
            onOpenRecordMutasi={handleOpenRecordMutasi}
            currentUser={currentUser}
          />
        ) : (
          /* VIEW B: BUKU STOK MASTER (5 Kategori) */
          <>
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
          </>
        )}

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
            Al-Imam Islamic School • Petugas Aktif: <strong>{currentUser.name}</strong> ({currentUser.roleLabel})
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

      <RecordMutasiModal
        isOpen={isMutasiModalOpen}
        onClose={() => setIsMutasiModalOpen(false)}
        onSave={handleSaveMutasi}
        stockData={stockData}
        currentUser={currentUser}
        defaultType={mutasiDefaultType}
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
