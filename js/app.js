/**
 * MAIN JAVASCRIPT APPLICATION FOR KOPERASI KEO KESAH TAKA (KECAMATAN WARU)
 * Standalone Engine + API Integration + Multi-Role Auth System + Collapsible Sidebar Nav
 */

// =========================================================================
// DEFAULT API ENDPOINT (DATABASE PIPELINE)
// Auto-connected Pipeline
// =========================================================================
const DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyKPlwaCC3Yu0HcXQnSmNkIMnQxrvpuO7Cw_lHqT5jg98mdNwVgBAWwUer4g7e4pXagiQ/exec';

// Global State
let currentUser = null;

let db = {
  scriptUrl: localStorage.getItem('kkt_script_url') || DEFAULT_SCRIPT_URL,
  pengguna: [],
  anggota: [],
  simpanan: [],
  pinjaman: [],
  angsuran: [],
  ppob: [],
  kas: [],
  katalog_ppob: []
};

// Default Sample Data
const defaultData = {
  pengguna: [
    { ID_User: 'USR-001', Username: 'admin', Password: 'admin123', Nama_Lengkap: 'Pengurus Utama Koperasi', Role: 'Pengurus', ID_Anggota: '', Status: 'Aktif' },
    { ID_User: 'USR-002', Username: 'pengurus', Password: 'pengurus123', Nama_Lengkap: 'Bapak Pengurus Waru', Role: 'Pengurus', ID_Anggota: '', Status: 'Aktif' },
    { ID_User: 'USR-003', Username: 'KKT-001', Password: 'user123', Nama_Lengkap: 'Ahmad Sahroni', Role: 'Anggota', ID_Anggota: 'ANG-001', Status: 'Aktif' },
    { ID_User: 'USR-004', Username: 'KKT-002', Password: 'user123', Nama_Lengkap: 'Siti Aminah', Role: 'Anggota', ID_Anggota: 'ANG-002', Status: 'Aktif' }
  ],
  anggota: [
    { ID_Anggota: 'ANG-001', No_Anggota: 'KKT-001', NIK: '3515011010900001', Nama_Lengkap: 'Ahmad Sahroni', Jenis_Kelamin: 'Laki-Laki', Alamat_Desa: 'Waluya', No_HP: '081234567890', Tanggal_Daftar: '2026-01-10', Status_Anggota: 'Aktif' },
    { ID_Anggota: 'ANG-002', No_Anggota: 'KKT-002', NIK: '3515012010900002', Nama_Lengkap: 'Siti Aminah', Jenis_Kelamin: 'Perempuan', Alamat_Desa: 'Kedungrejo', No_HP: '082198765432', Tanggal_Daftar: '2026-01-15', Status_Anggota: 'Aktif' },
    { ID_Anggota: 'ANG-003', No_Anggota: 'KKT-003', NIK: '3515013010900003', Nama_Lengkap: 'Badrus Sholeh', Jenis_Kelamin: 'Laki-Laki', Alamat_Desa: 'Sana Laok', No_HP: '085712349876', Tanggal_Daftar: '2026-02-01', Status_Anggota: 'Aktif' }
  ],
  simpanan: [
    { ID_Simpanan: 'SMP-101', Tanggal: '2026-01-10', ID_Anggota: 'ANG-001', Nama_Anggota: 'Ahmad Sahroni', Jenis_Simpanan: 'Simpanan Pokok', Jumlah: 100000, Keterangan: 'Setoran Awal Pokok' },
    { ID_Simpanan: 'SMP-102', Tanggal: '2026-01-10', ID_Anggota: 'ANG-001', Nama_Anggota: 'Ahmad Sahroni', Jenis_Simpanan: 'Simpanan Wajib', Jumlah: 50000, Keterangan: 'Setoran Wajib Januari' },
    { ID_Simpanan: 'SMP-103', Tanggal: '2026-01-15', ID_Anggota: 'ANG-002', Nama_Anggota: 'Siti Aminah', Jenis_Simpanan: 'Simpanan Pokok', Jumlah: 100000, Keterangan: 'Setoran Awal Pokok' },
    { ID_Simpanan: 'SMP-104', Tanggal: '2026-02-01', ID_Anggota: 'ANG-003', Nama_Anggota: 'Badrus Sholeh', Jenis_Simpanan: 'Simpanan Pokok', Jumlah: 100000, Keterangan: 'Setoran Awal Pokok' }
  ],
  pinjaman: [
    { ID_Pinjaman: 'PJM-201', Tanggal_Pengajuan: '2026-02-01', ID_Anggota: 'ANG-001', Nama_Anggota: 'Ahmad Sahroni', Jumlah_Pinjaman: 2000000, Tenor_Bulan: 10, Bunga_Persen: 1.5, Total_Bunga: 300000, Total_Pinjaman: 2300000, Angsuran_Per_Bulan: 230000, Sisa_Pinjaman: 1840000, Status: 'Disetujui', Keterangan: 'Modal Usaha Warung' },
    { ID_Pinjaman: 'PJM-202', Tanggal_Pengajuan: '2026-03-05', ID_Anggota: 'ANG-002', Nama_Anggota: 'Siti Aminah', Jumlah_Pinjaman: 1500000, Tenor_Bulan: 6, Bunga_Persen: 1.5, Total_Bunga: 135000, Total_Pinjaman: 1635000, Angsuran_Per_Bulan: 272500, Sisa_Pinjaman: 1635000, Status: 'Pending', Keterangan: 'Pengembangan Usaha Tani' }
  ],
  angsuran: [
    { ID_Angsuran: 'ANGS-301', Tanggal: '2026-03-01', ID_Pinjaman: 'PJM-201', ID_Anggota: 'ANG-001', Nama_Anggota: 'Ahmad Sahroni', Angsuran_Ke: 1, Jumlah_Bayar: 230000, Denda: 0, Total_Bayar: 230000, Keterangan: 'Angsuran Bulan ke-1' },
    { ID_Angsuran: 'ANGS-302', Tanggal: '2026-04-01', ID_Pinjaman: 'PJM-201', ID_Anggota: 'ANG-001', Nama_Anggota: 'Ahmad Sahroni', Angsuran_Ke: 2, Jumlah_Bayar: 230000, Denda: 0, Total_Bayar: 230000, Keterangan: 'Angsuran Bulan ke-2' }
  ],
  ppob: [
    { ID_Transaksi: 'PPOB-501', Tanggal: '2026-03-10', Kategori_Produk: 'Pulsa & Data', Nama_Produk: 'Telkomsel 50rb', Nomor_Tujuan: '081234567890', Harga_Modal: 50200, Harga_Jual: 53000, Keuntungan: 2800, Status_Pembayaran: 'Lunas', Keterangan: 'Pulsa Utama' },
    { ID_Transaksi: 'PPOB-502', Tanggal: '2026-03-12', Kategori_Produk: 'Token PLN', Nama_Produk: 'Token PLN 100rb', Nomor_Tujuan: '541200987612', Harga_Modal: 100500, Harga_Jual: 103000, Keuntungan: 2500, Status_Pembayaran: 'Lunas', Keterangan: 'Meteran Rumah' },
    { ID_Transaksi: 'PPOB-503', Tanggal: '2026-03-15', Kategori_Produk: 'Pembayaran Gas', Nama_Produk: 'Gas PGN Rumah Tangga', Nomor_Tujuan: '9812739182', Harga_Modal: 75000, Harga_Jual: 78000, Keuntungan: 3000, Status_Pembayaran: 'Lunas', Keterangan: 'Pelanggan Waru' }
  ],
  kas: [
    { ID_Kas: 'KAS-001', Tanggal: '2026-01-01', Jenis_Transaksi: 'Masuk', Kategori: 'Modal Awal Koperasi', Jumlah: 10000000, Keterangan: 'Saldo Kas Awal Koperasi Keo Kesah Taka' },
    { ID_Kas: 'KAS-002', Tanggal: '2026-01-10', Jenis_Transaksi: 'Masuk', Kategori: 'Simpanan Pokok & Wajib', Jumlah: 350000, Keterangan: 'Penerimaan Simpanan Sahroni & Aminah' },
    { ID_Kas: 'KAS-003', Tanggal: '2026-02-01', Jenis_Transaksi: 'Keluar', Kategori: 'Pencairan Pinjaman', Jumlah: 2000000, Keterangan: 'Pencairan Pinjaman PJM-201' }
  ],
  katalog_ppob: [
    { ID_Produk: 'PRD-01', Kategori: 'Pulsa & Data', Nama_Produk: 'Telkomsel 10rb', Harga_Modal: 10300, Harga_Jual: 12000, Keuntungan_Margin: 1700, Status: 'Tersedia' },
    { ID_Produk: 'PRD-02', Kategori: 'Pulsa & Data', Nama_Produk: 'Telkomsel 50rb', Harga_Modal: 50200, Harga_Jual: 53000, Keuntungan_Margin: 2800, Status: 'Tersedia' },
    { ID_Produk: 'PRD-03', Kategori: 'Token PLN', Nama_Produk: 'Token PLN 20rb', Harga_Modal: 20200, Harga_Jual: 22500, Keuntungan_Margin: 2300, Status: 'Tersedia' },
    { ID_Produk: 'PRD-04', Kategori: 'Token PLN', Nama_Produk: 'Token PLN 50rb', Harga_Modal: 50200, Harga_Jual: 52500, Keuntungan_Margin: 2300, Status: 'Tersedia' },
    { ID_Produk: 'PRD-05', Kategori: 'Token PLN', Nama_Produk: 'Token PLN 100rb', Harga_Modal: 100500, Harga_Jual: 103000, Keuntungan_Margin: 2500, Status: 'Tersedia' },
    { ID_Produk: 'PRD-06', Kategori: 'Pembayaran Gas', Nama_Produk: 'Gas PGN Rumah Tangga', Harga_Modal: 0, Harga_Jual: 3000, Keuntungan_Margin: 3000, Status: 'Tersedia' },
    { ID_Produk: 'PRD-07', Kategori: 'Pembayaran Gas', Nama_Produk: 'Tabung LPG 3kg Subsidized', Harga_Modal: 17000, Harga_Jual: 19000, Keuntungan_Margin: 2000, Status: 'Tersedia' },
    { ID_Produk: 'PRD-08', Kategori: 'Lainnya', Nama_Produk: 'Voucher Game / TV Cable', Harga_Modal: 20000, Harga_Jual: 23000, Keuntungan_Margin: 3000, Status: 'Tersedia' }
  ]
};

// Chart Instances
let chartSimpanPinjamInstance = null;
let chartPPOBInstance = null;

// On Page Load
document.addEventListener('DOMContentLoaded', () => {
  loadLocalDatabase();
  document.getElementById('settingScriptUrl').value = db.scriptUrl;

  const savedUser = sessionStorage.getItem('kkt_current_user');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    showMainApp();
  } else {
    showLoginScreen();
  }

  if (db.scriptUrl) {
    syncWithGoogleSheets();
  }
});

// Load database from LocalStorage
function loadLocalDatabase() {
  const stored = localStorage.getItem('kkt_database');
  if (stored) {
    try {
      db = { ...db, ...JSON.parse(stored) };
    } catch (e) {
      db = { ...db, ...defaultData };
    }
  } else {
    db = { ...db, ...defaultData };
    saveLocalDatabase();
  }
  if (DEFAULT_SCRIPT_URL) {
    db.scriptUrl = DEFAULT_SCRIPT_URL;
  }
}

function saveLocalDatabase() {
  localStorage.setItem('kkt_database', JSON.stringify({
    pengguna: db.pengguna,
    anggota: db.anggota,
    simpanan: db.simpanan,
    pinjaman: db.pinjaman,
    angsuran: db.angsuran,
    ppob: db.ppob,
    kas: db.kas,
    katalog_ppob: db.katalog_ppob
  }));
}

// ==========================================
// COLLAPSIBLE SIDEBAR NAV TOGGLE
// ==========================================
function toggleSidebarNav() {
  const sidebar = document.getElementById('appSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const iconChevron = document.getElementById('iconSidebarChevron');
  
  if (window.innerWidth < 768) {
    // Mobile View: Toggle drawer off-canvas
    sidebar.classList.toggle('mobile-hidden');
    if (overlay) overlay.classList.toggle('hidden');
  } else {
    // Desktop View: Toggle collapsed icon mode
    sidebar.classList.toggle('sidebar-collapsed');
    if (iconChevron) {
      if (sidebar.classList.contains('sidebar-collapsed')) {
        iconChevron.className = 'fa-solid fa-angles-right';
      } else {
        iconChevron.className = 'fa-solid fa-angles-left';
      }
    }
  }
}

// Close mobile sidebar when clicking outside on overlay
function closeMobileSidebar() {
  const sidebar = document.getElementById('appSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.add('mobile-hidden');
  if (overlay) overlay.classList.add('hidden');
}

// ==========================================
// AUTHENTICATION & LOGIN MANAGEMENT
// ==========================================
function quickFillLogin(username, password) {
  document.getElementById('loginUsername').value = username;
  document.getElementById('loginPassword').value = password;
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const userInp = document.getElementById('loginUsername').value.trim();
  const passInp = document.getElementById('loginPassword').value.trim();

  const user = db.pengguna.find(u => 
    (u.Username.toLowerCase() === userInp.toLowerCase() || u.ID_Anggota === userInp || u.Username === userInp) && 
    u.Password === passInp
  );

  if (user) {
    currentUser = {
      ID_User: user.ID_User,
      Username: user.Username,
      Nama_Lengkap: user.Nama_Lengkap,
      Role: user.Role,
      ID_Anggota: user.ID_Anggota
    };
    sessionStorage.setItem('kkt_current_user', JSON.stringify(currentUser));
    showMainApp();
    Swal.fire({ icon: 'success', title: 'Login Berhasil!', text: 'Selamat Datang, ' + currentUser.Nama_Lengkap, timer: 1200, showConfirmButton: false });
  } else {
    Swal.fire({ icon: 'error', title: 'Login Gagal', text: 'Username atau Password salah!' });
  }
}

function showLoginScreen() {
  document.getElementById('screenLogin').classList.remove('hidden');
}

function showMainApp() {
  document.getElementById('screenLogin').classList.add('hidden');
  
  // Profile Bar Setup
  document.getElementById('userNameDisplay').innerText = currentUser.Nama_Lengkap;
  document.getElementById('welcomeUserName').innerText = currentUser.Nama_Lengkap;
  document.getElementById('userRoleBadge').innerText = 'Role: ' + currentUser.Role;
  document.getElementById('footerUserRole').innerText = currentUser.Role + ' (' + currentUser.Nama_Lengkap + ')';
  document.getElementById('userAvatar').innerText = currentUser.Nama_Lengkap.charAt(0).toUpperCase();

  applyRolePermissions();
  refreshUI();
}

function logout() {
  currentUser = null;
  sessionStorage.removeItem('kkt_current_user');
  document.getElementById('formLogin').reset();
  showLoginScreen();
}

function applyRolePermissions() {
  const isPengurus = currentUser.Role === 'Pengurus';

  document.querySelectorAll('.role-pengurus').forEach(el => {
    if (isPengurus) el.classList.remove('hidden');
    else el.classList.add('hidden');
  });

  if (!isPengurus) {
    document.getElementById('titleStatAnggota').innerText = 'Status Keanggotaan';
    document.getElementById('titleStatSimpanan').innerText = 'Simpanan Saya';
    document.getElementById('titleStatKas').innerText = 'Status Akun';
    document.getElementById('labelTabSimpanan').innerText = 'Simpanan Saya';
  } else {
    document.getElementById('titleStatAnggota').innerText = 'Total Anggota';
    document.getElementById('titleStatSimpanan').innerText = 'Total Simpanan';
    document.getElementById('titleStatKas').innerText = 'Saldo Kas Koperasi';
    document.getElementById('labelTabSimpanan').innerText = 'Simpanan Anggota';
  }
}

// Navigation Tabs
function switchTab(tabId) {
  if (currentUser.Role === 'Anggota' && (tabId === 'tab-kas' || tabId === 'tab-settings' || tabId === 'tab-anggota')) {
    Swal.fire({ icon: 'warning', title: 'Akses Terbatas', text: 'Menu ini hanya dapat diakses oleh Pengurus Koperasi.' });
    return;
  }

  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.sidebar-link').forEach(btn => btn.classList.remove('active'));

  document.getElementById(tabId).classList.remove('hidden');
  const activeBtn = document.getElementById('nav-' + tabId);
  if (activeBtn) activeBtn.classList.add('active');

  if (tabId === 'tab-ppob') loadProdukPPOBOptions();

  // Auto-close sidebar on mobile after selecting a menu tab
  if (window.innerWidth < 768) {
    closeMobileSidebar();
  }
}

function switchSubPinjaman(subId) {
  if (subId === 'pinjaman-daftar') {
    document.getElementById('sub-pinjaman-daftar').classList.remove('hidden');
    document.getElementById('sub-pinjaman-angsuran').classList.add('hidden');
    document.getElementById('sub-btn-daftar').className = 'px-4 py-2 text-xs font-bold rounded-xl bg-emerald-800 text-white shadow-sm';
    document.getElementById('sub-btn-angsuran').className = 'px-4 py-2 text-xs font-bold rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300';
  } else {
    document.getElementById('sub-pinjaman-daftar').classList.add('hidden');
    document.getElementById('sub-pinjaman-angsuran').classList.remove('hidden');
    document.getElementById('sub-btn-angsuran').className = 'px-4 py-2 text-xs font-bold rounded-xl bg-emerald-800 text-white shadow-sm';
    document.getElementById('sub-btn-daftar').className = 'px-4 py-2 text-xs font-bold rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300';
  }
}

// Refresh Entire UI
function refreshUI() {
  if (!currentUser) return;
  renderDashboard();
  renderAnggota();
  renderSimpanan();
  renderPinjaman();
  renderAngsuran();
  renderPPOB();
  renderKas();
  populateDropdowns();
}

function refreshData() {
  if (db.scriptUrl) {
    syncWithGoogleSheets();
  } else {
    refreshUI();
    Swal.fire({ icon: 'success', title: 'Data diperbarui!', timer: 1200, showConfirmButton: false });
  }
}

function formatRupiah(num) {
  return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
}

function updateSyncBadge(status, message) {
  const badge = document.getElementById('syncBadge');
  const text = document.getElementById('syncText');

  if (status === 'online') {
    text.innerText = 'Sistem Online';
    badge.className = 'hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-semibold text-[11px]';
  } else if (status === 'connecting') {
    text.innerText = 'Menghubungkan...';
    badge.className = 'hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-semibold text-[11px]';
  } else {
    text.innerText = 'Sistem Offline';
    badge.className = 'hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-200 border border-amber-400/30 font-semibold text-[11px]';
  }
}

// ==========================================
// RENDER DASHBOARD & CHARTS
// ==========================================
function renderDashboard() {
  const isPengurus = currentUser.Role === 'Pengurus';
  const myId = currentUser.ID_Anggota;

  const filteredSimpanan = isPengurus ? db.simpanan : db.simpanan.filter(s => s.ID_Anggota === myId);
  const filteredPinjaman = isPengurus ? db.pinjaman.filter(p => p.Status === 'Disetujui') : db.pinjaman.filter(p => p.ID_Anggota === myId && p.Status === 'Disetujui');

  const totalAnggota = db.anggota.length;
  const totalSimpananVal = filteredSimpanan.reduce((acc, curr) => acc + Number(curr.Jumlah || 0), 0);
  const totalPinjamanAktifVal = filteredPinjaman.reduce((acc, curr) => acc + Number(curr.Sisa_Pinjaman || 0), 0);
  const totalProfitPPOB = db.ppob.reduce((acc, curr) => acc + Number(curr.Keuntungan || 0), 0);

  const totalKasMasuk = db.kas.filter(k => k.Jenis_Transaksi === 'Masuk').reduce((acc, curr) => acc + Number(curr.Jumlah || 0), 0);
  const totalKasKeluar = db.kas.filter(k => k.Jenis_Transaksi === 'Keluar').reduce((acc, curr) => acc + Number(curr.Jumlah || 0), 0);
  const saldoKas = totalKasMasuk - totalKasKeluar;

  if (isPengurus) {
    document.getElementById('statTotalAnggota').innerText = totalAnggota;
    document.getElementById('subStatAnggota').innerHTML = `<i class="fa-solid fa-circle-check"></i> Terdaftar di Waru`;
    document.getElementById('statTotalSimpanan').innerText = formatRupiah(totalSimpananVal);
    document.getElementById('statPinjamanAktif').innerText = formatRupiah(totalPinjamanAktifVal);
    document.getElementById('statCountPinjaman').innerText = filteredPinjaman.length + ' Kontrak Berjalan';
    document.getElementById('statProfitPPOB').innerText = formatRupiah(totalProfitPPOB);
    document.getElementById('statSaldoKas').innerText = formatRupiah(saldoKas);
  } else {
    document.getElementById('statTotalAnggota').innerText = 'AKTIF';
    document.getElementById('subStatAnggota').innerHTML = `<i class="fa-solid fa-user-check"></i> Anggota Resmi`;
    document.getElementById('statTotalSimpanan').innerText = formatRupiah(totalSimpananVal);
    document.getElementById('statPinjamanAktif').innerText = formatRupiah(totalPinjamanAktifVal);
    document.getElementById('statCountPinjaman').innerText = filteredPinjaman.length + ' Pinjaman Berjalan';
    document.getElementById('statProfitPPOB').innerText = db.ppob.length + ' Transaksi';
    document.getElementById('statSaldoKas').innerText = 'LANCAR';
  }

  // Recent Transactions Table
  const recentTable = document.getElementById('tableRecentTransactions');
  recentTable.innerHTML = '';

  let recentList = [
    ...filteredSimpanan.map(s => ({ ...s, type: 'Simpanan', info: s.Jenis_Simpanan + ' - ' + s.Nama_Anggota, amount: s.Jumlah, status: 'Berhasil' })),
    ...db.angsuran.filter(a => isPengurus || a.ID_Anggota === myId).map(a => ({ ...a, type: 'Angsuran', info: 'Angsuran Pinjaman ' + a.ID_Pinjaman, amount: a.Total_Bayar, status: 'Berhasil' })),
    ...db.ppob.map(p => ({ ...p, type: 'PPOB', info: p.Nama_Produk + ' (' + p.Nomor_Tujuan + ')', amount: p.Harga_Jual, status: p.Status_Pembayaran || 'Lunas' }))
  ];

  recentList.sort((a, b) => new Date(b.Tanggal) - new Date(a.Tanggal));
  recentList.slice(0, 5).forEach(item => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition';
    tr.innerHTML = `
      <td class="px-4 py-3 font-mono text-[11px]">${item.Tanggal}</td>
      <td class="px-4 py-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">${item.type}</span></td>
      <td class="px-4 py-3 font-medium text-slate-800">${item.info}</td>
      <td class="px-4 py-3 font-semibold text-slate-800">${formatRupiah(item.amount)}</td>
      <td class="px-4 py-3"><span class="badge-aktif px-2 py-0.5 rounded-full text-[10px] font-bold">${item.status}</span></td>
    `;
    recentTable.appendChild(tr);
  });

  renderCharts(totalSimpananVal, totalPinjamanAktifVal);
}

function renderCharts(simpananVal, pinjamanVal) {
  const ctx1 = document.getElementById('chartSimpanPinjam').getContext('2d');
  if (chartSimpanPinjamInstance) chartSimpanPinjamInstance.destroy();

  chartSimpanPinjamInstance = new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: ['Simpanan', 'Pinjaman Aktif'],
      datasets: [{
        label: 'Nilai Keuangan (Rp)',
        data: [simpananVal, pinjamanVal],
        backgroundColor: ['#059669', '#6366f1'],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  });

  const ctx2 = document.getElementById('chartPPOB').getContext('2d');
  if (chartPPOBInstance) chartPPOBInstance.destroy();

  const ppobCategoryCount = {
    'Pulsa & Data': db.ppob.filter(p=>p.Kategori_Produk==='Pulsa & Data').length,
    'Token PLN': db.ppob.filter(p=>p.Kategori_Produk==='Token PLN').length,
    'Pembayaran Gas': db.ppob.filter(p=>p.Kategori_Produk==='Pembayaran Gas').length,
    'Lainnya': db.ppob.filter(p=>p.Kategori_Produk==='Lainnya').length
  };

  chartPPOBInstance = new Chart(ctx2, {
    type: 'doughnut',
    data: {
      labels: Object.keys(ppobCategoryCount),
      datasets: [{
        data: Object.values(ppobCategoryCount),
        backgroundColor: ['#f59e0b', '#06b6d4', '#10b981', '#8b5cf6']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } }
    }
  });
}

// ==========================================
// MASTER ANGGOTA MANAGEMENT
// ==========================================
function renderAnggota() {
  const tbody = document.getElementById('tableAnggota');
  tbody.innerHTML = '';

  if (db.anggota.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center py-6 text-slate-400">Belum ada data anggota terdaftar.</td></tr>`;
    return;
  }

  db.anggota.forEach(item => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition';
    tr.innerHTML = `
      <td class="px-4 py-3 font-mono font-bold text-emerald-700">${item.No_Anggota || item.ID_Anggota}</td>
      <td class="px-4 py-3 font-mono">${item.NIK}</td>
      <td class="px-4 py-3 font-semibold text-slate-800">${item.Nama_Lengkap}</td>
      <td class="px-4 py-3">${item.Jenis_Kelamin === 'Laki-Laki' ? 'L' : 'P'}</td>
      <td class="px-4 py-3">${item.Alamat_Desa}</td>
      <td class="px-4 py-3 font-mono">${item.No_HP}</td>
      <td class="px-4 py-3 font-mono">${item.Tanggal_Daftar}</td>
      <td class="px-4 py-3"><span class="badge-aktif px-2 py-0.5 rounded-full text-[10px] font-bold">${item.Status_Anggota || 'Aktif'}</span></td>
      <td class="px-4 py-3 text-center">
        <button onclick="viewAnggotaDetail('${item.ID_Anggota}')" class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-medium transition">
          <i class="fa-solid fa-eye text-emerald-600"></i> Detail
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function filterAnggota() {
  const query = document.getElementById('searchAnggota').value.toLowerCase();
  const rows = document.querySelectorAll('#tableAnggota tr');

  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(query) ? '' : 'none';
  });
}

function saveAnggota(e) {
  e.preventDefault();
  const idAngg = 'ANG-' + (Date.now().toString().slice(-4));
  const noAngg = 'KKT-' + (db.anggota.length + 1).toString().padStart(3, '0');

  const newAnggota = {
    ID_Anggota: idAngg,
    No_Anggota: noAngg,
    NIK: document.getElementById('anggotaNIK').value,
    Nama_Lengkap: document.getElementById('anggotaNama').value,
    Jenis_Kelamin: document.getElementById('anggotaJK').value,
    Alamat_Desa: document.getElementById('anggotaAlamat').value,
    No_HP: document.getElementById('anggotaHP').value,
    Tanggal_Daftar: new Date().toISOString().split('T')[0],
    Status_Anggota: 'Aktif'
  };

  db.anggota.push(newAnggota);

  db.pengguna.push({
    ID_User: 'USR-' + Date.now(),
    Username: noAngg,
    Password: 'user123',
    Nama_Lengkap: newAnggota.Nama_Lengkap,
    Role: 'Anggota',
    ID_Anggota: idAngg,
    Status: 'Aktif'
  });

  saveLocalDatabase();
  refreshUI();
  closeModal('modalAnggota');
  document.getElementById('formAnggota').reset();

  if (db.scriptUrl) {
    postDataToAPI('addAnggota', newAnggota);
  }

  Swal.fire({ icon: 'success', title: 'Anggota Terdaftar!', text: 'Login Username: ' + noAngg + ' | Pass: user123', timer: 2000 });
}

function viewAnggotaDetail(id) {
  const item = db.anggota.find(a => a.ID_Anggota === id);
  if (!item) return;

  const totalSimpanan = db.simpanan.filter(s => s.ID_Anggota === id).reduce((a, c) => a + Number(c.Jumlah || 0), 0);
  const pinjamanAktif = db.pinjaman.filter(p => p.ID_Anggota === id && p.Status === 'Disetujui');
  const sisaPinjaman = pinjamanAktif.reduce((a, c) => a + Number(c.Sisa_Pinjaman || 0), 0);

  Swal.fire({
    title: '<strong>Kartu Anggota Digital</strong>',
    html: `
      <div class="text-left text-xs space-y-2 p-2 font-sans">
        <div class="p-3 bg-emerald-800 text-white rounded-xl space-y-1">
          <p class="font-bold text-sm">${item.Nama_Lengkap}</p>
          <p class="text-[11px] font-mono text-emerald-200">No. Anggota: ${item.No_Anggota || item.ID_Anggota}</p>
          <p class="text-[11px]">NIK: ${item.NIK}</p>
        </div>
        <div class="space-y-1 text-slate-700">
          <p><strong>Alamat Desa:</strong> ${item.Alamat_Desa} (Kecamatan Waru)</p>
          <p><strong>No. HP/WA:</strong> ${item.No_HP}</p>
          <p><strong>Tanggal Bergabung:</strong> ${item.Tanggal_Daftar}</p>
          <hr class="my-2"/>
          <div class="flex justify-between p-2 bg-emerald-50 rounded-lg text-emerald-900 font-semibold">
            <span>Total Simpanan:</span>
            <span>${formatRupiah(totalSimpanan)}</span>
          </div>
          <div class="flex justify-between p-2 bg-indigo-50 rounded-lg text-indigo-900 font-semibold">
            <span>Sisa Pinjaman:</span>
            <span>${formatRupiah(sisaPinjaman)}</span>
          </div>
        </div>
      </div>
    `,
    confirmButtonText: 'Tutup',
    confirmButtonColor: '#059669'
  });
}

// ==========================================
// SIMPANAN MANAGEMENT
// ==========================================
function renderSimpanan() {
  const tbody = document.getElementById('tableSimpanan');
  tbody.innerHTML = '';

  const isPengurus = currentUser.Role === 'Pengurus';
  const myId = currentUser.ID_Anggota;

  const dataList = isPengurus ? db.simpanan : db.simpanan.filter(s => s.ID_Anggota === myId);

  if (dataList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-slate-400">Belum ada catatan transaksi simpanan.</td></tr>`;
    return;
  }

  dataList.forEach(item => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition';
    tr.innerHTML = `
      <td class="px-4 py-3 font-mono font-bold text-emerald-700">${item.ID_Simpanan}</td>
      <td class="px-4 py-3 font-mono">${item.Tanggal}</td>
      <td class="px-4 py-3 font-semibold text-slate-800">${item.Nama_Anggota}</td>
      <td class="px-4 py-3"><span class="px-2 py-0.5 bg-teal-100 text-teal-800 rounded-full font-semibold text-[10px]">${item.Jenis_Simpanan}</span></td>
      <td class="px-4 py-3 font-bold text-slate-800">${formatRupiah(item.Jumlah)}</td>
      <td class="px-4 py-3">${item.Keterangan || '-'}</td>
      <td class="px-4 py-3 text-center">
        <button onclick="printStrukSimpanan('${item.ID_Simpanan}')" class="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-2.5 py-1 rounded-lg text-[11px] font-bold transition">
          <i class="fa-solid fa-print"></i> Struk
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function saveSimpanan(e) {
  e.preventDefault();
  const anggotaId = document.getElementById('simpananAnggota').value;
  const anggotaObj = db.anggota.find(a => a.ID_Anggota === anggotaId);

  const newSimpanan = {
    ID_Simpanan: 'SMP-' + (Date.now().toString().slice(-4)),
    Tanggal: new Date().toISOString().split('T')[0],
    ID_Anggota: anggotaId,
    Nama_Anggota: anggotaObj ? anggotaObj.Nama_Lengkap : currentUser.Nama_Lengkap,
    Jenis_Simpanan: document.getElementById('simpananJenis').value,
    Jumlah: Number(document.getElementById('simpananJumlah').value),
    Keterangan: document.getElementById('simpananKeterangan').value
  };

  db.simpanan.push(newSimpanan);

  db.kas.push({
    ID_Kas: 'KAS-' + Date.now(),
    Tanggal: newSimpanan.Tanggal,
    Jenis_Transaksi: 'Masuk',
    Kategori: 'Simpanan ' + newSimpanan.Jenis_Simpanan,
    Jumlah: newSimpanan.Jumlah,
    Keterangan: 'Penerimaan ' + newSimpanan.Jenis_Simpanan + ' - ' + newSimpanan.Nama_Anggota
  });

  saveLocalDatabase();
  refreshUI();
  closeModal('modalSimpanan');
  document.getElementById('formSimpanan').reset();

  if (db.scriptUrl) {
    postDataToAPI('addSimpanan', newSimpanan);
  }

  Swal.fire({ icon: 'success', title: 'Setoran Simpanan Berhasil!', text: formatRupiah(newSimpanan.Jumlah), timer: 1500, showConfirmButton: false });
  printStrukSimpanan(newSimpanan.ID_Simpanan);
}

function printStrukSimpanan(id) {
  const item = db.simpanan.find(s => s.ID_Simpanan === id);
  if (!item) return;

  const html = `
    <div class="space-y-1">
      <p class="font-bold text-center text-xs">BUKTI SETORAN SIMPANAN</p>
      <div class="border-b border-dashed border-slate-300 my-1"></div>
      <div class="flex justify-between"><span>No. Struk:</span><strong class="font-mono">${item.ID_Simpanan}</strong></div>
      <div class="flex justify-between"><span>Tanggal:</span><span>${item.Tanggal}</span></div>
      <div class="flex justify-between"><span>Nama Anggota:</span><strong>${item.Nama_Anggota}</strong></div>
      <div class="flex justify-between"><span>Jenis Simpanan:</span><span>${item.Jenis_Simpanan}</span></div>
      <div class="border-b border-dashed border-slate-300 my-1"></div>
      <div class="flex justify-between font-bold text-sm"><span>TOTAL SETOR:</span><span>${formatRupiah(item.Jumlah)}</span></div>
      <div class="text-[10px] text-slate-500 mt-1">Keterangan: ${item.Keterangan || '-'}</div>
    </div>
  `;
  document.getElementById('strukContent').innerHTML = html;
  openModal('modalStruk');
}

// ==========================================
// PINJAMAN & ANGSURAN MANAGEMENT
// ==========================================
function calculateKalkulasiPinjaman() {
  const jumlah = Number(document.getElementById('pinjamanJumlah').value || 0);
  const tenor = Number(document.getElementById('pinjamanTenor').value || 1);
  const bungaPersen = Number(document.getElementById('pinjamanBunga').value || 0);

  const totalBunga = Math.round(jumlah * (bungaPersen / 100) * tenor);
  const totalPengembalian = jumlah + totalBunga;
  const angsuranPerBulan = Math.round(totalPengembalian / tenor);

  document.getElementById('calcTotalBunga').innerText = formatRupiah(totalBunga);
  document.getElementById('calcTotalPinjaman').innerText = formatRupiah(totalPengembalian);
  document.getElementById('calcAngsuranBulan').innerText = formatRupiah(angsuranPerBulan);
}

function renderPinjaman() {
  const tbody = document.getElementById('tablePinjaman');
  tbody.innerHTML = '';

  const isPengurus = currentUser.Role === 'Pengurus';
  const myId = currentUser.ID_Anggota;

  const dataList = isPengurus ? db.pinjaman : db.pinjaman.filter(p => p.ID_Anggota === myId);

  if (dataList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" class="text-center py-6 text-slate-400">Belum ada pengajuan pinjaman.</td></tr>`;
    return;
  }

  dataList.forEach(item => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition';

    let statusClass = 'badge-pending';
    if (item.Status === 'Disetujui') statusClass = 'badge-aktif';
    if (item.Status === 'Lunas') statusClass = 'badge-lunas';

    tr.innerHTML = `
      <td class="px-4 py-3 font-mono font-bold text-emerald-700">${item.ID_Pinjaman}</td>
      <td class="px-4 py-3 font-mono">${item.Tanggal_Pengajuan}</td>
      <td class="px-4 py-3 font-semibold text-slate-800">${item.Nama_Anggota}</td>
      <td class="px-4 py-3 font-semibold">${formatRupiah(item.Jumlah_Pinjaman)}</td>
      <td class="px-4 py-3 font-mono text-center">${item.Tenor_Bulan} Bln</td>
      <td class="px-4 py-3 font-mono text-center">${item.Bunga_Persen}%</td>
      <td class="px-4 py-3 font-bold text-slate-800">${formatRupiah(item.Angsuran_Per_Bulan)}</td>
      <td class="px-4 py-3 font-bold text-indigo-700">${formatRupiah(item.Sisa_Pinjaman)}</td>
      <td class="px-4 py-3"><span class="${statusClass} px-2 py-0.5 rounded-full text-[10px] font-bold">${item.Status}</span></td>
      <td class="px-4 py-3 text-center">
        ${(isPengurus && item.Status === 'Pending') ? `
          <button onclick="approvePinjaman('${item.ID_Pinjaman}')" class="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition shadow">
            <i class="fa-solid fa-check"></i> Setujui & Cairkan
          </button>
        ` : `
          <span class="text-[10px] text-slate-400 font-medium"><i class="fa-solid fa-circle-check text-emerald-600"></i> ${item.Status}</span>
        `}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function savePinjaman(e) {
  e.preventDefault();
  const anggotaId = document.getElementById('pinjamanAnggota').value;
  const anggotaObj = db.anggota.find(a => a.ID_Anggota === anggotaId);

  const jumlah = Number(document.getElementById('pinjamanJumlah').value);
  const tenor = Number(document.getElementById('pinjamanTenor').value);
  const bungaPersen = Number(document.getElementById('pinjamanBunga').value);

  const totalBunga = Math.round(jumlah * (bungaPersen / 100) * tenor);
  const totalPinjaman = jumlah + totalBunga;
  const cicilanBulan = Math.round(totalPinjaman / tenor);

  const newPinjaman = {
    ID_Pinjaman: 'PJM-' + (Date.now().toString().slice(-4)),
    Tanggal_Pengajuan: new Date().toISOString().split('T')[0],
    ID_Anggota: anggotaId,
    Nama_Anggota: anggotaObj ? anggotaObj.Nama_Lengkap : currentUser.Nama_Lengkap,
    Jumlah_Pinjaman: jumlah,
    Tenor_Bulan: tenor,
    Bunga_Persen: bungaPersen,
    Total_Bunga: totalBunga,
    Total_Pinjaman: totalPinjaman,
    Angsuran_Per_Bulan: cicilanBulan,
    Sisa_Pinjaman: totalPinjaman,
    Status: 'Pending',
    Keterangan: document.getElementById('pinjamanKeterangan').value
  };

  db.pinjaman.push(newPinjaman);
  saveLocalDatabase();
  refreshUI();
  closeModal('modalPinjaman');
  document.getElementById('formPinjaman').reset();

  if (db.scriptUrl) {
    postDataToAPI('addPinjaman', newPinjaman);
  }

  Swal.fire({ icon: 'info', title: 'Pengajuan Pinjaman Dikirim!', text: 'Status: Menunggu Persetujuan Pengurus Koperasi', timer: 1800, showConfirmButton: false });
}

function approvePinjaman(id) {
  if (currentUser.Role !== 'Pengurus') return;

  const item = db.pinjaman.find(p => p.ID_Pinjaman === id);
  if (!item) return;

  Swal.fire({
    title: 'Setujui & Cairkan Pinjaman?',
    text: `Pencairan dana ${formatRupiah(item.Jumlah_Pinjaman)} untuk ${item.Nama_Anggota} akan dicatat di Kas Keluar.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#059669',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Ya, Setujui & Cairkan!'
  }).then((res) => {
    if (res.isConfirmed) {
      item.Status = 'Disetujui';

      db.kas.push({
        ID_Kas: 'KAS-' + Date.now(),
        Tanggal: new Date().toISOString().split('T')[0],
        Jenis_Transaksi: 'Keluar',
        Kategori: 'Pencairan Pinjaman',
        Jumlah: item.Jumlah_Pinjaman,
        Keterangan: 'Pencairan Pinjaman ' + item.ID_Pinjaman + ' (' + item.Nama_Anggota + ')'
      });

      saveLocalDatabase();
      refreshUI();

      if (db.scriptUrl) {
        postDataToAPI('updatePinjamanStatus', { ID_Pinjaman: item.ID_Pinjaman, Status: 'Disetujui', Jumlah_Pinjaman: item.Jumlah_Pinjaman });
      }

      Swal.fire({ icon: 'success', title: 'Pinjaman Disetujui & Dicairkan!', timer: 1500, showConfirmButton: false });
    }
  });
}

function renderAngsuran() {
  const tbody = document.getElementById('tableAngsuran');
  tbody.innerHTML = '';

  const isPengurus = currentUser.Role === 'Pengurus';
  const myId = currentUser.ID_Anggota;

  const dataList = isPengurus ? db.angsuran : db.angsuran.filter(a => a.ID_Anggota === myId);

  if (dataList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center py-6 text-slate-400">Belum ada riwayat pembayaran angsuran.</td></tr>`;
    return;
  }

  dataList.forEach(item => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition';
    tr.innerHTML = `
      <td class="px-4 py-3 font-mono font-bold text-indigo-700">${item.ID_Angsuran}</td>
      <td class="px-4 py-3 font-mono">${item.Tanggal}</td>
      <td class="px-4 py-3 font-mono">${item.ID_Pinjaman}</td>
      <td class="px-4 py-3 font-semibold text-slate-800">${item.Nama_Anggota}</td>
      <td class="px-4 py-3 font-bold text-center">Ke-${item.Angsuran_Ke}</td>
      <td class="px-4 py-3 font-semibold">${formatRupiah(item.Jumlah_Bayar)}</td>
      <td class="px-4 py-3 text-red-600">${formatRupiah(item.Denda)}</td>
      <td class="px-4 py-3 font-bold text-emerald-700">${formatRupiah(item.Total_Bayar)}</td>
      <td class="px-4 py-3 text-center">
        <button onclick="printStrukAngsuran('${item.ID_Angsuran}')" class="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-2.5 py-1 rounded-lg text-[11px] font-bold transition">
          <i class="fa-solid fa-print"></i> Struk
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function autoFillDetailPinjaman() {
  const pjmId = document.getElementById('angsuranPinjaman').value;
  const pjmObj = db.pinjaman.find(p => p.ID_Pinjaman === pjmId);
  const detailBox = document.getElementById('detailPinjamanBox');

  if (pjmObj) {
    detailBox.classList.remove('hidden');
    document.getElementById('detailNamaAnggota').innerText = pjmObj.Nama_Anggota;
    document.getElementById('detailAngsuranBulan').innerText = formatRupiah(pjmObj.Angsuran_Per_Bulan);
    document.getElementById('detailSisaPinjaman').innerText = formatRupiah(pjmObj.Sisa_Pinjaman);
    document.getElementById('angsuranJumlah').value = pjmObj.Angsuran_Per_Bulan;

    const historyCount = db.angsuran.filter(a => a.ID_Pinjaman === pjmId).length;
    document.getElementById('angsuranKe').value = historyCount + 1;
  } else {
    detailBox.classList.add('hidden');
  }
}

function saveAngsuran(e) {
  e.preventDefault();
  const pjmId = document.getElementById('angsuranPinjaman').value;
  const pjmObj = db.pinjaman.find(p => p.ID_Pinjaman === pjmId);
  if (!pjmObj) return;

  const jumlahBayar = Number(document.getElementById('angsuranJumlah').value);
  const denda = Number(document.getElementById('angsuranDenda').value || 0);
  const totalBayar = jumlahBayar + denda;

  const newAngsuran = {
    ID_Angsuran: 'ANGS-' + (Date.now().toString().slice(-4)),
    Tanggal: new Date().toISOString().split('T')[0],
    ID_Pinjaman: pjmId,
    ID_Anggota: pjmObj.ID_Anggota,
    Nama_Anggota: pjmObj.Nama_Anggota,
    Angsuran_Ke: Number(document.getElementById('angsuranKe').value),
    Jumlah_Bayar: jumlahBayar,
    Denda: denda,
    Total_Bayar: totalBayar,
    Keterangan: document.getElementById('angsuranKeterangan').value
  };

  db.angsuran.push(newAngsuran);

  pjmObj.Sisa_Pinjaman = Math.max(0, Number(pjmObj.Sisa_Pinjaman) - jumlahBayar);
  if (pjmObj.Sisa_Pinjaman <= 0) pjmObj.Status = 'Lunas';

  db.kas.push({
    ID_Kas: 'KAS-' + Date.now(),
    Tanggal: newAngsuran.Tanggal,
    Jenis_Transaksi: 'Masuk',
    Kategori: 'Pembayaran Angsuran',
    Jumlah: totalBayar,
    Keterangan: 'Angsuran Pinjaman ' + pjmId + ' (' + pjmObj.Nama_Anggota + ')'
  });

  saveLocalDatabase();
  refreshUI();
  closeModal('modalAngsuran');
  document.getElementById('formAngsuran').reset();

  if (db.scriptUrl) {
    postDataToAPI('addAngsuran', newAngsuran);
  }

  Swal.fire({ icon: 'success', title: 'Pembayaran Angsuran Berhasil!', text: 'Sisa Pinjaman: ' + formatRupiah(pjmObj.Sisa_Pinjaman), timer: 1500, showConfirmButton: false });
  printStrukAngsuran(newAngsuran.ID_Angsuran);
}

function printStrukAngsuran(id) {
  const item = db.angsuran.find(a => a.ID_Angsuran === id);
  if (!item) return;

  const html = `
    <div class="space-y-1">
      <p class="font-bold text-center text-xs">BUKTI ANGSURAN PINJAMAN</p>
      <div class="border-b border-dashed border-slate-300 my-1"></div>
      <div class="flex justify-between"><span>ID Angsuran:</span><strong class="font-mono">${item.ID_Angsuran}</strong></div>
      <div class="flex justify-between"><span>No. Kontrak:</span><strong class="font-mono">${item.ID_Pinjaman}</strong></div>
      <div class="flex justify-between"><span>Tanggal:</span><span>${item.Tanggal}</span></div>
      <div class="flex justify-between"><span>Peminjam:</span><strong>${item.Nama_Anggota}</strong></div>
      <div class="flex justify-between"><span>Angsuran Ke:</span><span>Ke-${item.Angsuran_Ke}</span></div>
      <div class="border-b border-dashed border-slate-300 my-1"></div>
      <div class="flex justify-between"><span>Pokok/Cicilan:</span><span>${formatRupiah(item.Jumlah_Bayar)}</span></div>
      <div class="flex justify-between"><span>Denda:</span><span>${formatRupiah(item.Denda)}</span></div>
      <div class="flex justify-between font-bold text-sm mt-1"><span>TOTAL DIBAYAR:</span><span>${formatRupiah(item.Total_Bayar)}</span></div>
    </div>
  `;
  document.getElementById('strukContent').innerHTML = html;
  openModal('modalStruk');
}

// ==========================================
// TRANSAKSI PPOB (PULSA, DATA, TOKEN PLN, GAS)
// ==========================================
function loadProdukPPOBOptions() {
  const kat = document.getElementById('ppobKategori').value;
  const select = document.getElementById('ppobProduk');
  select.innerHTML = '';

  const filtered = db.katalog_ppob.filter(p => p.Kategori === kat);
  filtered.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.ID_Produk;
    opt.innerText = `${p.Nama_Produk} - Jual: ${formatRupiah(p.Harga_Jual)}`;
    select.appendChild(opt);
  });

  autoFillPPOBPrice();
}

function autoFillPPOBPrice() {
  const prdId = document.getElementById('ppobProduk').value;
  const prdObj = db.katalog_ppob.find(p => p.ID_Produk === prdId);

  if (prdObj) {
    document.getElementById('ppobHargaModal').value = prdObj.Harga_Modal;
    document.getElementById('ppobHargaJual').value = prdObj.Harga_Jual;
    calculateMarginPPOB();
  }
}

function calculateMarginPPOB() {
  const modal = Number(document.getElementById('ppobHargaModal').value || 0);
  const jual = Number(document.getElementById('ppobHargaJual').value || 0);
  const margin = jual - modal;

  document.getElementById('ppobMarginText').innerText = formatRupiah(margin);
}

function renderPPOB() {
  const tbody = document.getElementById('tablePPOB');
  tbody.innerHTML = '';

  const isPengurus = currentUser.Role === 'Pengurus';

  if (db.ppob.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-slate-400">Belum ada transaksi PPOB.</td></tr>`;
    return;
  }

  db.ppob.forEach(item => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition';
    tr.innerHTML = `
      <td class="px-3 py-2.5 font-mono font-bold text-amber-700">${item.ID_Transaksi}</td>
      <td class="px-3 py-2.5 font-mono text-[11px]">${item.Tanggal}</td>
      <td class="px-3 py-2.5 font-semibold text-slate-800">${item.Nama_Produk}</td>
      <td class="px-3 py-2.5 font-mono text-[11px]">${item.Nomor_Tujuan}</td>
      <td class="px-3 py-2.5 font-bold">${formatRupiah(item.Harga_Jual)}</td>
      ${isPengurus ? `<td class="px-3 py-2.5 font-bold text-amber-600">+${formatRupiah(item.Keuntungan)}</td>` : ''}
      <td class="px-3 py-2.5 text-center">
        <button onclick="printStrukPPOB('${item.ID_Transaksi}')" class="bg-amber-100 hover:bg-amber-200 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold transition">
          <i class="fa-solid fa-print"></i> Struk
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function savePPOB(e) {
  e.preventDefault();
  const prdId = document.getElementById('ppobProduk').value;
  const prdObj = db.katalog_ppob.find(p => p.ID_Produk === prdId);

  const modal = Number(document.getElementById('ppobHargaModal').value);
  const jual = Number(document.getElementById('ppobHargaJual').value);
  const margin = jual - modal;

  const newPPOB = {
    ID_Transaksi: 'PPOB-' + (Date.now().toString().slice(-4)),
    Tanggal: new Date().toISOString().split('T')[0],
    Kategori_Produk: document.getElementById('ppobKategori').value,
    Nama_Produk: prdObj ? prdObj.Nama_Produk : 'Produk PPOB',
    Nomor_Tujuan: document.getElementById('ppobNoTujuan').value,
    Harga_Modal: modal,
    Harga_Jual: jual,
    Keuntungan: margin,
    Status_Pembayaran: 'Lunas',
    Keterangan: document.getElementById('ppobKeterangan').value
  };

  db.ppob.push(newPPOB);

  db.kas.push({
    ID_Kas: 'KAS-' + Date.now(),
    Tanggal: newPPOB.Tanggal,
    Jenis_Transaksi: 'Masuk',
    Kategori: 'Pendapatan PPOB',
    Jumlah: margin,
    Keterangan: 'Keuntungan PPOB ' + newPPOB.Nama_Produk + ' (' + newPPOB.Nomor_Tujuan + ')'
  });

  saveLocalDatabase();
  refreshUI();
  document.getElementById('formPPOB').reset();
  loadProdukPPOBOptions();

  if (db.scriptUrl) {
    postDataToAPI('addPPOB', newPPOB);
  }

  Swal.fire({ icon: 'success', title: 'Transaksi PPOB Berhasil!', text: 'Pembelian ' + newPPOB.Nama_Produk + ' Berhasil', timer: 1500, showConfirmButton: false });
  printStrukPPOB(newPPOB.ID_Transaksi);
}

function printStrukPPOB(id) {
  const item = db.ppob.find(p => p.ID_Transaksi === id);
  if (!item) return;

  const html = `
    <div class="space-y-1">
      <p class="font-bold text-center text-xs">STRUK TRANSAKSI PPOB & PULSA</p>
      <div class="border-b border-dashed border-slate-300 my-1"></div>
      <div class="flex justify-between"><span>No. Transaksi:</span><strong class="font-mono">${item.ID_Transaksi}</strong></div>
      <div class="flex justify-between"><span>Tanggal:</span><span>${item.Tanggal}</span></div>
      <div class="flex justify-between"><span>Kategori:</span><span>${item.Kategori_Produk}</span></div>
      <div class="flex justify-between"><span>Produk:</span><strong>${item.Nama_Produk}</strong></div>
      <div class="flex justify-between"><span>No. Tujuan/Meter:</span><strong class="font-mono text-xs">${item.Nomor_Tujuan}</strong></div>
      <div class="border-b border-dashed border-slate-300 my-1"></div>
      <div class="flex justify-between font-bold text-sm"><span>TOTAL BAYAR:</span><span>${formatRupiah(item.Harga_Jual)}</span></div>
      <div class="flex justify-between text-emerald-800 text-[10px]"><span>STATUS:</span><strong>${item.Status_Pembayaran || 'LUNAS SUCCESS'}</strong></div>
    </div>
  `;
  document.getElementById('strukContent').innerHTML = html;
  openModal('modalStruk');
}

// ==========================================
// KAS & SHU MANAGEMENT (Pengurus Only)
// ==========================================
function renderKas() {
  const tbody = document.getElementById('tableKas');
  tbody.innerHTML = '';

  if (currentUser.Role !== 'Pengurus') return;

  if (db.kas.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-slate-400">Belum ada catatan jurnal kas.</td></tr>`;
    return;
  }

  db.kas.forEach(item => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition';
    const isMasuk = item.Jenis_Transaksi === 'Masuk';

    tr.innerHTML = `
      <td class="px-3 py-2.5 font-mono font-bold text-slate-700">${item.ID_Kas}</td>
      <td class="px-3 py-2.5 font-mono text-[11px]">${item.Tanggal}</td>
      <td class="px-3 py-2.5"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${isMasuk ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}">${item.Jenis_Transaksi}</span></td>
      <td class="px-3 py-2.5 font-semibold text-slate-800">${item.Kategori}</td>
      <td class="px-3 py-2.5 font-bold ${isMasuk ? 'text-emerald-700' : 'text-red-600'}">${isMasuk ? '+' : '-'}${formatRupiah(item.Jumlah)}</td>
      <td class="px-3 py-2.5">${item.Keterangan || '-'}</td>
    `;
    tbody.appendChild(tr);
  });
}

function saveKas(e) {
  e.preventDefault();
  if (currentUser.Role !== 'Pengurus') return;

  const newKas = {
    ID_Kas: 'KAS-' + (Date.now().toString().slice(-4)),
    Tanggal: document.getElementById('kasTanggal').value || new Date().toISOString().split('T')[0],
    Jenis_Transaksi: document.getElementById('kasJenis').value,
    Kategori: document.getElementById('kasKategori').value,
    Jumlah: Number(document.getElementById('kasJumlah').value),
    Keterangan: document.getElementById('kasKeterangan').value
  };

  db.kas.push(newKas);
  saveLocalDatabase();
  refreshUI();
  document.getElementById('formKas').reset();

  if (db.scriptUrl) {
    postDataToAPI('addKas', newKas);
  }

  Swal.fire({ icon: 'success', title: 'Catatan Kas Disimpan!', timer: 1200, showConfirmButton: false });
}

// ==========================================
// DROPDOWNS & MODALS HELPERS
// ==========================================
function populateDropdowns() {
  const simpananSelect = document.getElementById('simpananAnggota');
  const pinjamanSelect = document.getElementById('pinjamanAnggota');

  simpananSelect.innerHTML = '';
  pinjamanSelect.innerHTML = '';

  const isPengurus = currentUser.Role === 'Pengurus';
  const myId = currentUser.ID_Anggota;

  const anggotaList = isPengurus ? db.anggota : db.anggota.filter(a => a.ID_Anggota === myId);

  anggotaList.forEach(a => {
    const opt1 = document.createElement('option');
    opt1.value = a.ID_Anggota;
    opt1.innerText = `${a.Nama_Lengkap} (${a.No_Anggota || a.ID_Anggota}) - ${a.Alamat_Desa}`;
    simpananSelect.appendChild(opt1);

    const opt2 = document.createElement('option');
    opt2.value = a.ID_Anggota;
    opt2.innerText = `${a.Nama_Lengkap} (${a.No_Anggota || a.ID_Anggota}) - ${a.Alamat_Desa}`;
    pinjamanSelect.appendChild(opt2);
  });

  const angsuranSelect = document.getElementById('angsuranPinjaman');
  angsuranSelect.innerHTML = '<option value="">-- Pilih Kontrak Pinjaman --</option>';

  const activeLoans = isPengurus 
    ? db.pinjaman.filter(p => p.Status === 'Disetujui') 
    : db.pinjaman.filter(p => p.ID_Anggota === myId && p.Status === 'Disetujui');

  activeLoans.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.ID_Pinjaman;
    opt.innerText = `${p.ID_Pinjaman} - ${p.Nama_Anggota} (Sisa: ${formatRupiah(p.Sisa_Pinjaman)})`;
    angsuranSelect.appendChild(opt);
  });
}

function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

function exportExcel(type) {
  let exportData = [];
  let filename = `Koperasi_Keo_Kesah_Taka_${type}_${new Date().toISOString().split('T')[0]}.xlsx`;

  const isPengurus = currentUser.Role === 'Pengurus';
  const myId = currentUser.ID_Anggota;

  if (type === 'Simpanan') exportData = isPengurus ? db.simpanan : db.simpanan.filter(s => s.ID_Anggota === myId);
  else if (type === 'Pinjaman') exportData = isPengurus ? db.pinjaman : db.pinjaman.filter(p => p.ID_Anggota === myId);
  else if (type === 'PPOB') exportData = db.ppob;
  else if (type === 'Kas') exportData = db.kas;
  else if (type === 'Anggota') exportData = db.anggota;

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, type);
  XLSX.writeFile(wb, filename);

  Swal.fire({ icon: 'success', title: 'File Excel Diunduh!', text: filename, timer: 1500, showConfirmButton: false });
}

// ==========================================
// BACKEND API CONNECTOR
// ==========================================
function saveSettings() {
  if (currentUser.Role !== 'Pengurus') return;

  const url = document.getElementById('settingScriptUrl').value.trim();
  db.scriptUrl = url;
  localStorage.setItem('kkt_script_url', url);

  if (url) {
    updateSyncBadge('connecting', 'Mencoba terhubung...');
    testConnection();
  } else {
    updateSyncBadge('offline', 'Mode Offline');
    Swal.fire({ icon: 'info', title: 'Pengaturan Disimpan', text: 'Menggunakan penyimpanan lokal browser.' });
  }
}

function testConnection() {
  if (!db.scriptUrl) {
    Swal.fire({ icon: 'warning', title: 'URL Belum Diisi', text: 'Silahkan masukkan Endpoint Web App API.' });
    return;
  }

  fetch(db.scriptUrl + '?action=ping')
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        updateSyncBadge('online', 'Sistem Online');
        Swal.fire({ icon: 'success', title: 'Koneksi Berhasil!', text: data.message });
      } else {
        updateSyncBadge('offline', 'Gagal Terhubung');
        Swal.fire({ icon: 'error', title: 'Gagal', text: data.message });
      }
    })
    .catch(err => {
      updateSyncBadge('offline', 'Koneksi Error');
      Swal.fire({ icon: 'error', title: 'Kesalahan Koneksi', text: err.toString() });
    });
}

function inisiateSheetDB() {
  if (!db.scriptUrl) {
    Swal.fire({ icon: 'warning', title: 'URL API Belum Diisi', text: 'Masukkan Endpoint Web App API terlebih dahulu.' });
    return;
  }

  Swal.fire({ title: 'Menyiapkan Database...', didOpen: () => Swal.showLoading() });

  fetch(db.scriptUrl + '?action=setupSheets')
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        Swal.fire({ icon: 'success', title: 'Setup Database Selesai!', text: data.message });
        syncWithGoogleSheets();
      } else {
        Swal.fire({ icon: 'error', title: 'Gagal Setup', text: data.message });
      }
    })
    .catch(err => {
      Swal.fire({ icon: 'error', title: 'Error Setup', text: err.toString() });
    });
}

function syncWithGoogleSheets() {
  if (!db.scriptUrl) return;

  fetch(db.scriptUrl + '?action=getAllData')
    .then(res => res.json())
    .then(resData => {
      if (resData.status === 'success' && resData.data) {
        const d = resData.data;
        if (d.pengguna && d.pengguna.length > 0) db.pengguna = d.pengguna;
        if (d.anggota && d.anggota.length > 0) db.anggota = d.anggota;
        if (d.simpanan && d.simpanan.length > 0) db.simpanan = d.simpanan;
        if (d.pinjaman && d.pinjaman.length > 0) db.pinjaman = d.pinjaman;
        if (d.angsuran && d.angsuran.length > 0) db.angsuran = d.angsuran;
        if (d.ppob && d.ppob.length > 0) db.ppob = d.ppob;
        if (d.kas && d.kas.length > 0) db.kas = d.kas;
        if (d.katalog_ppob && d.katalog_ppob.length > 0) db.katalog_ppob = d.katalog_ppob;

        saveLocalDatabase();
        updateSyncBadge('online', 'Sistem Online');
        refreshUI();
      }
    })
    .catch(err => {
      console.warn('Sync failed, using offline cache:', err);
      updateSyncBadge('offline', 'Sistem Offline');
    });
}

function postDataToAPI(action, payload) {
  if (!db.scriptUrl) return;

  fetch(db.scriptUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: action, payload: payload })
  }).then(() => {
    console.log('POST action sent to API:', action);
  }).catch(err => {
    console.warn('POST API failed:', err);
  });
}
