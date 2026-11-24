export const CATEGORIES = [
  { id: 'all', label: 'Semua Kategori', icon: 'LayoutGrid', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'snack', label: 'Snack', sheet: 'Stock_Snack', icon: 'Cookie', color: 'bg-green-100 text-green-800 border-green-300' },
  { id: 'minuman', label: 'Minuman', sheet: 'Stock_Minuman', icon: 'CupSoda', color: 'bg-teal-100 text-teal-800 border-teal-300' },
  { id: 'ice_cream', label: 'Ice Cream', sheet: 'Stock_IceCream', icon: 'IceCream', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'konsinyasi_external', label: 'Konsinyasi External', sheet: 'Konsinyasi_External', icon: 'Truck', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'konsinyasi_guru', label: 'Konsinyasi Guru', sheet: 'Konsinyasi_Guru', icon: 'GraduationCap', color: 'bg-lime-100 text-lime-800 border-lime-300' }
];

export const INITIAL_SEED_DATA = {
  snack: [
    {
      id: 'SNK-001',
      namaProduk: 'Beng-Beng Wafer',
      isi1KartonPcs: 120,
      hargaKartonLamaModal: 210000,
      isiPcsPerdus: 20,
      hargaPerdus: 35000,
      stokAktual: '2 Karton, 3 Dus',
      lastUpdate: '24/11/2026 10:00'
    },
    {
      id: 'SNK-002',
      namaProduk: 'Nabati Richeese Wafer',
      isi1KartonPcs: 120,
      hargaKartonLamaModal: 180000,
      isiPcsPerdus: 20,
      hargaPerdus: 30000,
      stokAktual: '1 Karton, 5 Dus',
      lastUpdate: '24/11/2026 10:00'
    },
    {
      id: 'SNK-003',
      namaProduk: 'Chitato Lite Truffle',
      isi1KartonPcs: 60,
      hargaKartonLamaModal: 240000,
      isiPcsPerdus: 10,
      hargaPerdus: 40000,
      stokAktual: '3 Karton, 0 Dus',
      lastUpdate: '24/11/2026 10:00'
    },
    {
      id: 'SNK-004',
      namaProduk: 'Oreo Biscuit Roll',
      isi1KartonPcs: 144,
      hargaKartonLamaModal: 288000,
      isiPcsPerdus: 24,
      hargaPerdus: 48000,
      stokAktual: '1 Karton, 2 Dus',
      lastUpdate: '24/11/2026 10:00'
    },
    {
      id: 'SNK-005',
      namaProduk: 'SilverQueen Chunky Bar',
      isi1KartonPcs: 60,
      hargaKartonLamaModal: 450000,
      isiPcsPerdus: 12,
      hargaPerdus: 90000,
      stokAktual: '0 Karton, 4 Dus',
      lastUpdate: '24/11/2026 10:00'
    }
  ],

  minuman: [
    { id: 'MNM-001', namaProduk: 'Stee', harga1Karton: 35000, stokAktual: '15 Karton', stokMinimum: 5, lastUpdate: '24/11/2026 10:00' },
    { id: 'MNM-002', namaProduk: 'Fruit tea', harga1Karton: 47000, stokAktual: '12 Karton', stokMinimum: 4, lastUpdate: '24/11/2026 10:00' },
    { id: 'MNM-003', namaProduk: 'Teh Botol', harga1Karton: 70000, stokAktual: '20 Karton', stokMinimum: 5, lastUpdate: '24/11/2026 10:00' },
    { id: 'MNM-004', namaProduk: 'Prima 600', harga1Karton: 45000, stokAktual: '25 Karton', stokMinimum: 8, lastUpdate: '24/11/2026 10:00' },
    { id: 'MNM-005', namaProduk: 'Prima 1.5', harga1Karton: 47000, stokAktual: '18 Karton', stokMinimum: 6, lastUpdate: '24/11/2026 10:00' },
    { id: 'MNM-006', namaProduk: 'Minute Maid', harga1Karton: 58200, stokAktual: '8 Karton', stokMinimum: 3, lastUpdate: '24/11/2026 10:00' },
    { id: 'MNM-007', namaProduk: 'Es Batu', harga1Karton: 20000, stokAktual: '30 Bungkus', stokMinimum: 10, lastUpdate: '24/11/2026 10:00' },
    { id: 'MNM-008', namaProduk: 'Chokolatos Drink', harga1Karton: 19900, stokAktual: '14 Karton', stokMinimum: 4, lastUpdate: '24/11/2026 10:00' },
    { id: 'MNM-009', namaProduk: 'Good Day', harga1Karton: 22900, stokAktual: '16 Karton', stokMinimum: 5, lastUpdate: '24/11/2026 10:00' }
  ],

  ice_cream: [
    { id: 'ICE-001', namaProduk: 'Neopolitan', harga1Karton: 115200, stokAktual: '6 Box', stokMinimum: 2, lastUpdate: '24/11/2026 10:00' },
    { id: 'ICE-002', namaProduk: 'Reguler', harga1Karton: 86400, stokAktual: '8 Box', stokMinimum: 3, lastUpdate: '24/11/2026 10:00' },
    { id: 'ICE-003', namaProduk: 'Choco dip', harga1Karton: 96000, stokAktual: '5 Box', stokMinimum: 2, lastUpdate: '24/11/2026 10:00' },
    { id: 'ICE-004', namaProduk: 'Loly pop', harga1Karton: 48000, stokAktual: '10 Box', stokMinimum: 3, lastUpdate: '24/11/2026 10:00' },
    { id: 'ICE-005', namaProduk: 'Choconut', harga1Karton: 135000, stokAktual: '4 Box', stokMinimum: 2, lastUpdate: '24/11/2026 10:00' },
    { id: 'ICE-006', namaProduk: 'Polar pop', harga1Karton: 96000, stokAktual: '7 Box', stokMinimum: 2, lastUpdate: '24/11/2026 10:00' },
    { id: 'ICE-007', namaProduk: 'Magic', harga1Karton: 96000, stokAktual: '9 Box', stokMinimum: 3, lastUpdate: '24/11/2026 10:00' },
    { id: 'ICE-008', namaProduk: 'Fruty pop / Popeye', harga1Karton: 84000, stokAktual: '6 Box', stokMinimum: 2, lastUpdate: '24/11/2026 10:00' }
  ],

  konsinyasi_external: [
    {
      id: 'EXT-001',
      tanggal: '23/11/2026',
      namaProdukSupplier: 'Sari Roti',
      stockMasukPcs: 27,
      terjual: 27,
      sisaRetur: 0,
      hargaSatuan: 4703,
      totalHarga: 127000,
      statusBayar: 'Belum'
    },
    {
      id: 'EXT-002',
      tanggal: '24/11/2026',
      namaProdukSupplier: 'Roti Aoka',
      stockMasukPcs: 40,
      terjual: 35,
      sisaRetur: 5,
      hargaSatuan: 2500,
      totalHarga: 87500,
      statusBayar: 'Belum'
    },
    {
      id: 'EXT-003',
      tanggal: '24/11/2026',
      namaProdukSupplier: 'Donat Madu Cihanjuang',
      stockMasukPcs: 24,
      terjual: 24,
      sisaRetur: 0,
      hargaSatuan: 3500,
      totalHarga: 84000,
      statusBayar: 'Lunas'
    }
  ],

  konsinyasi_guru: [
    {
      id: 'GRU-001',
      tanggal: '24/11/2026',
      namaGuru: 'Bu Nurul',
      namaProduk: 'Baso goreng',
      jumlahProdukPcs: 30,
      terjualPcs: 28,
      sisa: 2,
      hargaSatuan: 2000,
      totalHarga: 56000,
      statusSetorKeGuru: 'Belum'
    },
    {
      id: 'GRU-002',
      tanggal: '24/11/2026',
      namaGuru: 'Bu Rahma',
      namaProduk: 'Pastel Ayam Sayur',
      jumlahProdukPcs: 25,
      terjualPcs: 25,
      sisa: 0,
      hargaSatuan: 3000,
      totalHarga: 75000,
      statusSetorKeGuru: 'Belum'
    },
    {
      id: 'GRU-003',
      tanggal: '24/11/2026',
      namaGuru: 'Ustadz Abdullah',
      namaProduk: 'Kue Lemper Bakar',
      jumlahProdukPcs: 20,
      terjualPcs: 20,
      sisa: 0,
      hargaSatuan: 2500,
      totalHarga: 50000,
      statusSetorKeGuru: 'Sudah'
    },
    {
      id: 'GRU-004',
      tanggal: '24/11/2026',
      namaGuru: 'Bu Shalatina',
      namaProduk: 'Puding Coklat Fla',
      jumlahProdukPcs: 15,
      terjualPcs: 12,
      sisa: 3,
      hargaSatuan: 3000,
      totalHarga: 36000,
      statusSetorKeGuru: 'Belum'
    }
  ],

  teachersList: [
    'Bu Nurul',
    'Bu Rahma',
    'Ustadz Abdullah',
    'Bu Shalatina',
    'Kak Dini',
    'Pak Farhan',
    'Ustadzah Maryam',
    'Pak Faisal'
  ]
};

export const formatRupiah = (val) => {
  const num = Number(val) || 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(num);
};
