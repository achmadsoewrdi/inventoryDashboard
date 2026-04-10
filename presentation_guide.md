# Artisan Ops — Manajemen Inventaris Gudang Tunggal

Dokumen ini menjelaskan tujuan, alur penggunaan, dan peran user pada aplikasi **Artisan Ops** yang telah disederhanakan untuk fokus pada manajemen barang di satu lokasi gudang saja.

---

## 1. Tentang Website Ini (Overview)
**Artisan Ops** adalah sistem manajemen barang gudang tunggal yang dirancang untuk efisiensi pelacakan stok. Fokus utamanya adalah memastikan admin tahu **apa** yang ada di dalam gudang, **berapa** jumlahnya, dan **di mana** lokasinya secara akurat.

### Penyesuaian Fitur (Fokus Satu Gudang):
Untuk menyederhanakan penggunaan, beberapa fitur disesuaikan:
- **Dihapus/Disembunyikan:** Filter pilih gudang (karena hanya ada satu gudang utama).
- **Dipertahankan:** Pelacakan lokasi presisi berdasarkan **Aisle (Lorong)** dan **Shelf (Rak)** tetap penting untuk navigasi di dalam gudang.
- **Dipertahankan:** Status stok (*Low Stock*, *Out of Stock*) untuk memicu pengadaan barang kembali.

---

## 2. Fitur: Apa yang Dihapus vs Dibiarkan?

Untuk fokus pada manajemen barang gudang tunggal, berikut adalah strateginya:

| Fitur | Status | Alasan |
| :--- | :--- | :--- |
| **Tabel Inventaris** | **Dibiarkan** | Inti dari aplikasi untuk melihat semua barang. |
| **Filter Warehouse** | **Dihapus** | Tidak relevan jika hanya ada 1 gudang. |
| **Aisle & Shelf Detail** | **Dibiarkan** | Sangat penting agar admin tahu letak barang di rak mana. |
| **Tambah/Edit Barang** | **Dibiarkan** | Diperlukan untuk update data barang masuk/keluar. |
| **Manajemen User** | **Dibiarkan** | Untuk membedakan akses Super Admin dan Admin. |
| **Ekspor Excel** | **Dibiarkan** | Untuk laporan berkala atau evaluasi stok. |

---

## 3. Peran User (Role)

Sesuai kebutuhan otoritas, sistem membagi peran menjadi dua tingkat:

### 1. Super Admin (Otoritas Penuh)
Pemilik atau kepala gudang yang memiliki kontrol total:
- **Menu Produk:** Menambah, mengedit, dan memiliki tombol khusus untuk **menghapus** produk.
- **Master Data:** Mengelola kategori barang, supplier, dan konfigurasi gudang utama.
- **Reporting:** Melakukan ekspor data laporan inventaris secara massal.
- **User Management:** Mengelola akun staff (tambah/hapus akses Admin biasa).

### 2. Admin (Operasional Gudang)
Staff yang fokus pada aktivitas harian gudang:
- **Monitoring:** Melihat daftar stok dan lokasi penyimpanan barang (Rak/Lorong).
- **Update Operasional:** Memperbarui jumlah stok barang (stok masuk/stok keluar).
- **Entri Data:** Menambah produk baru ke dalam sistem (sesuai kebijakan).
- **Pembatasan:** Tidak memiliki akses untuk menghapus data secara massal atau mengganti pengaturan utama sistem/user lain.

---

## 4. Alur Penggunaan (Layout Gudang Tunggal)

1. **Dashboard**: Admin melihat ringkasan barang yang stoknya hampir habis di satu-satunya gudang tersebut.
2. **Pencarian**: Admin mencari barang berdasarkan Nama atau SKU.
3. **Navigasi Rak**: Admin melihat kolom "Location" (Contoh: Aisle 4 - Shelf B) untuk mengambil/menaruh barang.
4. **Update Stok**: Admin mengubah jumlah stok setelah melakukan pengecekan fisik di rak.
5. **Pelaporan (Super Admin)**: Setiap bulan, Super Admin mendownload laporan Excel untuk audit stok fisik.


---

## Ringkasan Teknis (Untuk Presentasi)
- **Frontend**: SvelteKit dengan Tailwind CSS (modern, cepat, dan responsif).
- **Backend**: Fastify API dengan Prisma ORM.
- **Database**: PostgreSQL/MySQL (menyimpan data relasional produk dan gudang).
- **State Management**: Svelte Runes & Stores untuk sinkronisasi data yang mulus.
