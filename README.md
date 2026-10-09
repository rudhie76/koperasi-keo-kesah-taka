# Aplikasi Koperasi Simpan Pinjam "Keo Kesah Taka" Kecamatan Waru

Aplikasi sistem informasi terpadu Koperasi Simpan Pinjam (KSP) dan Kasir PPOB (Pulsa, Paket Data, Token Listrik PLN, dan Pembayaran Gas PGN/LPG) untuk **Koperasi Keo Kesah Taka Kecamatan Waru**.

Aplikasi ini berdiri sendiri (*standalone*), dilengkapi sistem **Login Multi-Role Pengguna (Pengurus & Anggota)**, serta menggunakan **Google Sheets** sebagai database utama.

---

## 🔑 Hak Akses & Akun Pengujian (Login Multi-Role)

Aplikasi mewajibkan pengguna untuk melakukan **Login** terlebih dahulu sebelum masuk. Hak akses dibedakan berdasarkan **Role**:

### 👑 1. Role: Pengurus (Admin / Pengurus Koperasi)
- **Akses Penuh** ke seluruh modul aplikasi:
  - Dashboard Rekapitulasi Seluruh Koperasi.
  - Master Data Anggota (Tambah Anggota Baru, Detail Kartu Anggota).
  - Setor Simpanan & Kelola Simpanan Seluruh Anggota.
  - Persetujuan / Approval Pengajuan Pinjaman & Pencairan Kas.
  - Pembayaran Angsuran & Cetak Struk.
  - Jurnal Arus Kas Masuk & Keluar.
  - Pengaturan Integrasi & Deploy Google Sheets Database.
- **Akun Demo Pengurus**:
  - Username: `admin` | Password: `admin123`
  - Username: `pengurus` | Password: `pengurus123`

### 👤 2. Role: Anggota (Anggota Koperasi)
- **Akses Personal / Mandiri**:
  - Dashboard Ringkasan Pribadi (Total Simpanan Saya, Status Pinjaman Saya).
  - Riwayat Simpanan Pribadi & Cetak Struk Setoran.
  - Pengajuan Pinjaman Baru & Riwayat Angsuran Mandiri.
  - Kasir PPOB Mandiri (Beli Pulsa, Token PLN, & Gas untuk kebutuhan sendiri).
  - *Diisolasi dari data pribadi anggota lain, jurnal kas umum, dan pengaturan database*.
- **Akun Demo Anggota**:
  - Username: `KKT-001` | Password: `user123` *(Nama: Ahmad Sahroni)*
  - Username: `KKT-002` | Password: `user123` *(Nama: Siti Aminah)*

---

## 🌟 Fitur Utama Aplikasi

### 1. 🔑 Autentikasi Login & Role Access Control (RBAC)
- Layar Login Modern dengan pilihan akun demo instan.
- Sesi login aman (`sessionStorage`) dan otomatis menyesuaikan tampilan menu sesuai Role pengguna aktif.

### 2. 👥 Manajemen Data Anggota
- Pendaftaran Anggota Baru (NIK, Nama, Jenis Kelamin, Alamat Desa di Kec. Waru, No. HP/WA).
- Otomatis membuatkan akun pengguna anggota baru dengan username Nomor Anggota.

### 3. 💰 Koperasi Simpanan
- Pencatatan **Simpanan Pokok**, **Simpanan Wajib**, dan **Simpanan Sukarela**.
- Cetak Struk Bukti Setoran Simpanan Thermal.

### 4. 💳 Koperasi Pinjaman & Angsuran
- Hitung otomatis **Suku Bunga (%)**, **Tenor (Bulan)**, **Cicilan per Bulan**, dan **Total Pengembalian**.
- Approval Pengurus untuk pencairan dana pinjaman.
- Pembayaran Angsuran bulanan & Cetak Struk Angsuran.

### 5. 📱 Kasir Transaksi PPOB (Pulsa/Data/PLN/Gas)
- Penjualan Pulsa & Data HP, Token Listrik PLN, dan Pembayaran Gas (PGN & Tabung LPG 3kg).
- Hitung otomatis **Margin Profit/Keuntungan** dan cetak struk pembelian.

### 6. 📈 Arus Kas & Export Excel
- Jurnal Kas Masuk & Keluar secara real-time.
- Export data ke file **Excel (.xlsx)** secara bebas biaya.

---

## 🛠️ Cara Menghubungkan ke Google Sheets (Database)

1. Buat Spreadsheet Baru di [Google Sheets](https://sheets.google.com) dengan nama: `Database_Koperasi_Keo_Kesah_Taka`.
2. Klik menu **Extensions > Apps Script**, paste isi file `google-apps-script/Code.gs`, lalu klik **Save**.
3. Klik **Deploy > New Deployment**, set tipe **Web App** dengan akses *"Anyone" (Siapa Saja)*. Copy Web App URL-nya.
4. Login sebagai **Pengurus** (`admin`), buka menu **Settings**, paste URL Web App lalu klik **Simpan Pengaturan URL** & **Otomatis Setup Tab Sheet**.

---

## 🚀 Cara Menjalankan
Buka file `index.html` langsung menggunakan browser Chrome / Edge / Firefox.

---
© 2026 Koperasi Simpan Pinjam "Keo Kesah Taka" Kecamatan Waru. Standalone System.
