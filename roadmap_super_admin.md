# Roadmap Pengembangan: Fase Super Admin

Dokumen ini merinci langkah-langkah teknis untuk sisi Frontend (Svelte) dan Backend (Fastify) guna membangun kontrol Super Admin.

---

## 1. Svelte: Implementasi Role (One Design, Two Views)
Anda **TIDAK PERLU** membuat 2 desain file berbeda. Gunakan logika kondisional pada file yang sama agar kode tetap rapi.

### Konsep Dasar
Simpan data user di `authStore`. Gunakan blok `{#if}` untuk membatasi UI:

```svelte
<!-- Contoh di Sidebar atau Tabel -->
{#if $authStore.user?.role === 'ADMIN'} <!-- Di backend Anda saat ini 'ADMIN' = Super Admin -->
  <button class="btn-delete" onclick={handleDelete}>
    Hapus Barang
  </button>
  <a href="/staff-management">Manajemen Staff</a>
{/if}
```

### Langkah di Frontend:
- [ ] **Auth Check**: Pastikan `src/lib/types/types.ts` memiliki properti `role` pada interface User.
- [ ] **Navigation Guard**: Di `+layout.svelte`, sembunyikan menu Admin/Staff jika user bukan Super Admin.
- [ ] **Button Protection**: Sembunyikan tombol "Hapus" dan "Edit User" pada komponen tabel.

---

## 2. Backend: Perubahan di `fastify-products-api`
Setelah saya cek, backend Anda sudah punya Enum Role di Prisma (`ADMIN` & `STAFF`), tapi belum ada proteksi ketat di route.

### Langkah di Backend:
1. **Update Enum (Opsional tapi disarankan)**:
   Di `prisma/schema.prisma`, ubah agar lebih jelas:
   ```prisma
   enum UserRole {
     SUPER_ADMIN
     ADMIN
   }
   ```
   *(Ingat: Jalankan `npx prisma migrate dev` setelah merubah ini).*

2. **Middleware Role Guard**:
   Buat middleware baru (misal: `authorize.ts`) untuk mengecek role sebelum menghapus data:
   ```typescript
   // Logic di backend:
   if (request.user.role !== 'SUPER_ADMIN') {
     return reply.forbidden("Hanya Super Admin yang boleh menghapus data");
   }
   ```

3. **Proteksi Route Produk**:
   Di `src/routes/products/index.ts`, tambahkan pengecekan role khusus untuk fitur hapus:
   - `fastify.delete("/:id", { preHandler: [authenticate, authorizeSuperAdmin] }, ...)`

4. **Endpoint User Management**:
   Siapkan route baru `src/routes/users` untuk fitur kelola staff (Super Admin bisa melihat daftar staff gudang).

---

## 3. Workflow Integrasi

1. **Backend**: Tambahkan field `role` saat generate JWT Token (saat ini sudah ada di `auth/handler.ts`).
2. **Frontend**: Saat login berhasil, simpan `role` ke LocalStorage.
3. **UI**: Gunakan satu komponen `InventoryTable.svelte`, tapi kirimkan prop `isSuperAdmin` untuk menentukan tombol apa saja yang muncul.

---

## Task List Segera:
- [ ] **Frontend**: Tambahkan pengecekan `{#if user.role === 'ADMIN'}` pada tombol Delete di `InventoryTableRow.svelte`.
- [ ] **Backend**: Coba buat satu middleware sederhana untuk membatasi akses `DELETE` pada produk agar tidak bisa dilakukan oleh role `STAFF`.
