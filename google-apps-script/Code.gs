/**
 * GOOGLE APPS SCRIPT BACKEND FOR KOPERASI KEO KESAH TAKA (KECAMATAN WARU)
 * Database: Google Sheets
 * Standalone System + Authentication & Role Access Control (Pengurus & Anggota)
 */

const SHEET_NAMES = {
  PENGGUNA: 'Data_Pengguna',
  ANGGOTA: 'Data_Anggota',
  SIMPANAN: 'Data_Simpanan',
  PINJAMAN: 'Data_Pinjaman',
  ANGSURAN: 'Data_Angsuran',
  PPOB: 'Transaksi_PPOB',
  KAS: 'Kas_Keuangan',
  PRODUK_PPOB: 'Katalog_PPOB'
};

/**
 * Handle GET Requests
 */
function doGet(e) {
  const action = e.parameter.action || 'ping';
  let result = {};

  try {
    switch (action) {
      case 'ping':
        result = { status: 'success', message: 'Koperasi Keo Kesah Taka API Active' };
        break;
      case 'getAllData':
        result = { status: 'success', data: getAllData() };
        break;
      case 'getPengguna':
        result = { status: 'success', data: getSheetData(SHEET_NAMES.PENGGUNA) };
        break;
      case 'getAnggota':
        result = { status: 'success', data: getSheetData(SHEET_NAMES.ANGGOTA) };
        break;
      case 'getSimpanan':
        result = { status: 'success', data: getSheetData(SHEET_NAMES.SIMPANAN) };
        break;
      case 'getPinjaman':
        result = { status: 'success', data: getSheetData(SHEET_NAMES.PINJAMAN) };
        break;
      case 'getAngsuran':
        result = { status: 'success', data: getSheetData(SHEET_NAMES.ANGSURAN) };
        break;
      case 'getPPOB':
        result = { status: 'success', data: getSheetData(SHEET_NAMES.PPOB) };
        break;
      case 'getKas':
        result = { status: 'success', data: getSheetData(SHEET_NAMES.KAS) };
        break;
      case 'getKatalogPPOB':
        result = { status: 'success', data: getSheetData(SHEET_NAMES.PRODUK_PPOB) };
        break;
      case 'setupSheets':
        result = setupSpreadsheet();
        break;
      default:
        result = { status: 'error', message: 'Action tidak dikenal: ' + action };
    }
  } catch (err) {
    result = { status: 'error', message: err.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle POST Requests
 */
function doPost(e) {
  let result = {};
  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;
    const payload = postData.payload;

    switch (action) {
      case 'setupSheets':
        result = setupSpreadsheet();
        break;
      case 'login':
        result = handleLogin(payload);
        break;
      case 'addAnggota':
        result = handleAddAnggotaWithUser(payload);
        break;
      case 'addSimpanan':
        result = handleAddSimpanan(payload);
        break;
      case 'addPinjaman':
        result = handleAddPinjaman(payload);
        break;
      case 'updatePinjamanStatus':
        result = handleUpdatePinjamanStatus(payload);
        break;
      case 'addAngsuran':
        result = handleAddAngsuran(payload);
        break;
      case 'addPPOB':
        result = handleAddPPOB(payload);
        break;
      case 'addKas':
        result = appendRow(SHEET_NAMES.KAS, payload);
        break;
      case 'saveKatalogPPOB':
        result = handleSaveKatalogPPOB(payload);
        break;
      default:
        result = { status: 'error', message: 'Action POST tidak dikenal' };
    }
  } catch (err) {
    result = { status: 'error', message: err.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Inisialisasi Sheet & Struktur Tabel Koperasi Keo Kesah Taka
 */
function setupSpreadsheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const structures = [
    {
      name: SHEET_NAMES.PENGGUNA,
      headers: ['ID_User', 'Username', 'Password', 'Nama_Lengkap', 'Role', 'ID_Anggota', 'Status'],
      initialData: [
        ['USR-001', 'admin', 'admin123', 'Pengurus Koperasi Utama', 'Pengurus', '', 'Aktif'],
        ['USR-002', 'pengurus', 'pengurus123', 'Bapak Pengurus Waru', 'Pengurus', '', 'Aktif'],
        ['USR-003', 'KKT-001', 'user123', 'Ahmad Sahroni', 'Anggota', 'ANG-001', 'Aktif'],
        ['USR-004', 'KKT-002', 'user123', 'Siti Aminah', 'Anggota', 'ANG-002', 'Aktif']
      ]
    },
    {
      name: SHEET_NAMES.ANGGOTA,
      headers: ['ID_Anggota', 'No_Anggota', 'NIK', 'Nama_Lengkap', 'Jenis_Kelamin', 'Alamat_Desa', 'No_HP', 'Tanggal_Daftar', 'Status_Anggota'],
      initialData: [
        ['ANG-001', 'KKT-001', '3515011010900001', 'Ahmad Sahroni', 'Laki-Laki', 'Waluya', '081234567890', '2026-01-10', 'Aktif'],
        ['ANG-002', 'KKT-002', '3515012010900002', 'Siti Aminah', 'Perempuan', 'Kedungrejo', '082198765432', '2026-01-15', 'Aktif']
      ]
    },
    {
      name: SHEET_NAMES.SIMPANAN,
      headers: ['ID_Simpanan', 'Tanggal', 'ID_Anggota', 'Nama_Anggota', 'Jenis_Simpanan', 'Jumlah', 'Keterangan'],
      initialData: [
        ['SMP-101', '2026-01-10', 'ANG-001', 'Ahmad Sahroni', 'Simpanan Pokok', 100000, 'Setoran Awal Pokok'],
        ['SMP-102', '2026-01-10', 'ANG-001', 'Ahmad Sahroni', 'Simpanan Wajib', 50000, 'Setoran Wajib Januari'],
        ['SMP-103', '2026-01-15', 'ANG-002', 'Siti Aminah', 'Simpanan Pokok', 100000, 'Setoran Awal Pokok']
      ]
    },
    {
      name: SHEET_NAMES.PINJAMAN,
      headers: ['ID_Pinjaman', 'Tanggal_Pengajuan', 'ID_Anggota', 'Nama_Anggota', 'Jumlah_Pinjaman', 'Tenor_Bulan', 'Bunga_Persen', 'Total_Bunga', 'Total_Pinjaman', 'Angsuran_Per_Bulan', 'Sisa_Pinjaman', 'Status', 'Keterangan'],
      initialData: [
        ['PJM-201', '2026-02-01', 'ANG-001', 'Ahmad Sahroni', 2000000, 10, 1.5, 300000, 2300000, 230000, 1840000, 'Disetujui', 'Modal Usaha Warung']
      ]
    },
    {
      name: SHEET_NAMES.ANGSURAN,
      headers: ['ID_Angsuran', 'Tanggal', 'ID_Pinjaman', 'ID_Anggota', 'Nama_Anggota', 'Angsuran_Ke', 'Jumlah_Bayar', 'Denda', 'Total_Bayar', 'Keterangan'],
      initialData: [
        ['ANGS-301', '2026-03-01', 'PJM-201', 'ANG-001', 'Ahmad Sahroni', 1, 230000, 0, 230000, 'Angsuran Bulan ke-1'],
        ['ANGS-302', '2026-04-01', 'PJM-201', 'ANG-001', 'Ahmad Sahroni', 2, 230000, 0, 230000, 'Angsuran Bulan ke-2']
      ]
    },
    {
      name: SHEET_NAMES.PPOB,
      headers: ['ID_Transaksi', 'Tanggal', 'Kategori_Produk', 'Nama_Produk', 'Nomor_Tujuan', 'Harga_Modal', 'Harga_Jual', 'Keuntungan', 'Status_Pembayaran', 'Keterangan'],
      initialData: [
        ['PPOB-501', '2026-03-10', 'Pulsa & Data', 'Telkomsel 50rb', '081234567890', 50200, 53000, 2800, 'Lunas', 'Pulsa Utama'],
        ['PPOB-502', '2026-03-12', 'Token PLN', 'Token PLN 100rb', '541200987612', 100500, 103000, 2500, 'Lunas', 'Meteran Rumah'],
        ['PPOB-503', '2026-03-15', 'Pembayaran Gas', 'Gas PGN Rumah Tangga', '9812739182', 75000, 78000, 3000, 'Lunas', 'Pelanggan Waru']
      ]
    },
    {
      name: SHEET_NAMES.KAS,
      headers: ['ID_Kas', 'Tanggal', 'Jenis_Transaksi', 'Kategori', 'Jumlah', 'Keterangan'],
      initialData: [
        ['KAS-001', '2026-01-01', 'Masuk', 'Modal Awal Koperasi', 10000000, 'Saldo Kas Awal Koperasi Keo Kesah Taka'],
        ['KAS-002', '2026-01-10', 'Masuk', 'Simpanan Pokok & Wajib', 250000, 'Penerimaan Simpanan Sahroni'],
        ['KAS-003', '2026-02-01', 'Keluar', 'Pencairan Pinjaman', 2000000, 'Pencairan Pinjaman PJM-201']
      ]
    },
    {
      name: SHEET_NAMES.PRODUK_PPOB,
      headers: ['ID_Produk', 'Kategori', 'Nama_Produk', 'Harga_Modal', 'Harga_Jual', 'Keuntungan_Margin', 'Status'],
      initialData: [
        ['PRD-01', 'Pulsa & Data', 'Telkomsel 10rb', 10300, 12000, 1700, 'Tersedia'],
        ['PRD-02', 'Pulsa & Data', 'Telkomsel 50rb', 50200, 53000, 2800, 'Tersedia'],
        ['PRD-03', 'Token PLN', 'Token PLN 20rb', 20200, 22500, 2300, 'Tersedia'],
        ['PRD-04', 'Token PLN', 'Token PLN 50rb', 50200, 52500, 2300, 'Tersedia'],
        ['PRD-05', 'Token PLN', 'Token PLN 100rb', 100500, 103000, 2500, 'Tersedia'],
        ['PRD-06', 'Pembayaran Gas', 'Gas PGN Rumah Tangga', 0, 3000, 3000, 'Tersedia'],
        ['PRD-07', 'Pembayaran Gas', 'Tabung LPG 3kg Subsidized', 17000, 19000, 2000, 'Tersedia'],
        ['PRD-08', 'Lainnya', 'Voucher Game / TV Cable', 20000, 23000, 3000, 'Tersedia']
      ]
    }
  ];

  structures.forEach(struct => {
    let sheet = ss.getSheetByName(struct.name);
    if (!sheet) {
      sheet = ss.insertSheet(struct.name);
    }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(struct.headers);
      const headerRange = sheet.getRange(1, 1, 1, struct.headers.length);
      headerRange.setBackground('#047857').setFontColor('#FFFFFF').setFontWeight('bold');

      if (struct.initialData && struct.initialData.length > 0) {
        struct.initialData.forEach(row => sheet.appendRow(row));
      }
    }
  });

  return { status: 'success', message: 'Seluruh Sheet Database & User Auth Koperasi Keo Kesah Taka berhasil disiapkan!' };
}

/**
 * Handle Login Verification
 */
function handleLogin(payload) {
  const users = getSheetData(SHEET_NAMES.PENGGUNA);
  const user = users.find(u => 
    (u.Username.toString().toLowerCase() === payload.username.toString().toLowerCase() || u.ID_Anggota === payload.username) &&
    u.Password.toString() === payload.password.toString()
  );

  if (user) {
    return {
      status: 'success',
      message: 'Login berhasil',
      user: {
        ID_User: user.ID_User,
        Username: user.Username,
        Nama_Lengkap: user.Nama_Lengkap,
        Role: user.Role,
        ID_Anggota: user.ID_Anggota
      }
    };
  } else {
    return { status: 'error', message: 'Username atau Password salah!' };
  }
}

/**
 * Fetch all data from sheet
 */
function getSheetData(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const headers = data[0];
  const rows = data.slice(1);

  return rows.map(row => {
    let obj = {};
    headers.forEach((h, idx) => {
      let val = row[idx];
      if (val instanceof Date) {
        val = Utilities.formatDate(val, Session.getScriptTimeZone(), 'yyyy-MM-dd');
      }
      obj[h] = val;
    });
    return obj;
  });
}

/**
 * Fetch all sheets in single request
 */
function getAllData() {
  return {
    pengguna: getSheetData(SHEET_NAMES.PENGGUNA),
    anggota: getSheetData(SHEET_NAMES.ANGGOTA),
    simpanan: getSheetData(SHEET_NAMES.SIMPANAN),
    pinjaman: getSheetData(SHEET_NAMES.PINJAMAN),
    angsuran: getSheetData(SHEET_NAMES.ANGSURAN),
    ppob: getSheetData(SHEET_NAMES.PPOB),
    kas: getSheetData(SHEET_NAMES.KAS),
    katalog_ppob: getSheetData(SHEET_NAMES.PRODUK_PPOB)
  };
}

/**
 * Helper append single row
 */
function appendRow(sheetName, payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    setupSpreadsheet();
    sheet = ss.getSheetByName(sheetName);
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const newRow = headers.map(h => payload[h] !== undefined ? payload[h] : '');
  sheet.appendRow(newRow);

  return { status: 'success', message: 'Data berhasil disimpan', data: payload };
}

/**
 * Handle Add Anggota + Auto Create User Account for Anggota
 */
function handleAddAnggotaWithUser(payload) {
  const res = appendRow(SHEET_NAMES.ANGGOTA, payload);

  // Auto Create Account for Member
  const userPayload = {
    'ID_User': 'USR-' + Date.now(),
    'Username': payload.No_Anggota || payload.ID_Anggota,
    'Password': 'user123',
    'Nama_Lengkap': payload.Nama_Lengkap,
    'Role': 'Anggota',
    'ID_Anggota': payload.ID_Anggota,
    'Status': 'Aktif'
  };
  appendRow(SHEET_NAMES.PENGGUNA, userPayload);

  return res;
}

/**
 * Handle Simpanan Addition + Auto Kas Record
 */
function handleAddSimpanan(payload) {
  const res = appendRow(SHEET_NAMES.SIMPANAN, payload);

  const kasPayload = {
    'ID_Kas': 'KAS-' + Date.now(),
    'Tanggal': payload.Tanggal,
    'Jenis_Transaksi': 'Masuk',
    'Kategori': 'Simpanan ' + (payload.Jenis_Simpanan || 'Anggota'),
    'Jumlah': payload.Jumlah,
    'Keterangan': 'Penerimaan ' + payload.Jenis_Simpanan + ' - ' + payload.Nama_Anggota
  };
  appendRow(SHEET_NAMES.KAS, kasPayload);

  return res;
}

/**
 * Handle Pinjaman Addition
 */
function handleAddPinjaman(payload) {
  return appendRow(SHEET_NAMES.PINJAMAN, payload);
}

/**
 * Update Status Pinjaman
 */
function handleUpdatePinjamanStatus(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.PINJAMAN);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === payload.ID_Pinjaman) {
      sheet.getRange(i + 1, 12).setValue(payload.Status);

      if (payload.Status === 'Disetujui' && payload.CatatKas !== false) {
        const kasPayload = {
          'ID_Kas': 'KAS-' + Date.now(),
          'Tanggal': payload.Tanggal || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd'),
          'Jenis_Transaksi': 'Keluar',
          'Kategori': 'Pencairan Pinjaman',
          'Jumlah': payload.Jumlah_Pinjaman || data[i][4],
          'Keterangan': 'Pencairan Pinjaman ' + payload.ID_Pinjaman + ' (' + data[i][3] + ')'
        };
        appendRow(SHEET_NAMES.KAS, kasPayload);
      }
      return { status: 'success', message: 'Status Pinjaman berhasil diperbarui' };
    }
  }
  return { status: 'error', message: 'ID Pinjaman tidak ditemukan' };
}

/**
 * Handle Angsuran Addition
 */
function handleAddAngsuran(payload) {
  const res = appendRow(SHEET_NAMES.ANGSURAN, payload);

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetPjm = ss.getSheetByName(SHEET_NAMES.PINJAMAN);
  const dataPjm = sheetPjm.getDataRange().getValues();

  for (let i = 1; i < dataPjm.length; i++) {
    if (dataPjm[i][0] === payload.ID_Pinjaman) {
      let sisaLama = Number(dataPjm[i][10]) || 0;
      let sisaBaru = Math.max(0, sisaLama - Number(payload.Jumlah_Bayar));
      sheetPjm.getRange(i + 1, 11).setValue(sisaBaru);

      if (sisaBaru <= 0) {
        sheetPjm.getRange(i + 1, 12).setValue('Lunas');
      }
      break;
    }
  }

  const kasPayload = {
    'ID_Kas': 'KAS-' + Date.now(),
    'Tanggal': payload.Tanggal,
    'Jenis_Transaksi': 'Masuk',
    'Kategori': 'Pembayaran Angsuran',
    'Jumlah': payload.Total_Bayar,
    'Keterangan': 'Angsuran Pinjaman ' + payload.ID_Pinjaman + ' (' + payload.Nama_Anggota + ')'
  };
  appendRow(SHEET_NAMES.KAS, kasPayload);

  return res;
}

/**
 * Handle Transaksi PPOB
 */
function handleAddPPOB(payload) {
  const res = appendRow(SHEET_NAMES.PPOB, payload);

  const kasPayload = {
    'ID_Kas': 'KAS-' + Date.now(),
    'Tanggal': payload.Tanggal,
    'Jenis_Transaksi': 'Masuk',
    'Kategori': 'Pendapatan PPOB',
    'Jumlah': payload.Keuntungan,
    'Keterangan': 'Keuntungan PPOB ' + payload.Nama_Produk + ' (' + payload.Nomor_Tujuan + ')'
  };
  appendRow(SHEET_NAMES.KAS, kasPayload);

  return res;
}

/**
 * Handle Katalog PPOB Batch Save
 */
function handleSaveKatalogPPOB(katalogList) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAMES.PRODUK_PPOB);

  sheet.clearContents();
  const headers = ['ID_Produk', 'Kategori', 'Nama_Produk', 'Harga_Modal', 'Harga_Jual', 'Keuntungan_Margin', 'Status'];
  sheet.appendRow(headers);

  katalogList.forEach(item => {
    sheet.appendRow([
      item.ID_Produk,
      item.Kategori,
      item.Nama_Produk,
      item.Harga_Modal,
      item.Harga_Jual,
      item.Keuntungan_Margin,
      item.Status || 'Tersedia'
    ]);
  });

  return { status: 'success', message: 'Katalog PPOB berhasil diperbarui' };
}
