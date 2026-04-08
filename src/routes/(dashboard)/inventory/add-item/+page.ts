import { env } from '$env/dynamic/public';
import { browser } from '$app/environment';
import type { PageLoad } from './$types';
import type {
	InventoryListResponse,
	SupplierResponse,
	WarehouseResponse,
	CategoryResponse
} from '$lib/types/types';

// 1. Matikan SSR
export const ssr = false;

export const load: PageLoad = async ({ fetch }) => {
	try {
		// 2. Ambil token dan siapkan header
		let token = null;
		if (browser) token = localStorage.getItem('token');

		const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

		// 3. Panggil API dengan menyisipkan headers
		const [productsRes, categoriesRes] = await Promise.all([
			fetch(`${env.PUBLIC_API_URL}/products?limit=100`, { headers }),
			fetch(`${env.PUBLIC_API_URL}/categories`, { headers })
		]);

		// 4. Proses Produk secara AMAN untuk ekstrak Supplier dan Warehouse
		const supplierMap = new Map<number, SupplierResponse>();
		const warehouseMap = new Map<number, WarehouseResponse>();

		if (productsRes.ok) {
			const raw = (await productsRes.json()) as InventoryListResponse;
			const safeData = raw?.data || []; // Sabuk pengaman!

			for (const product of safeData) {
				if (product?.supplier?.id) {
					supplierMap.set(product.supplier.id, product.supplier);
				}
				if (product?.location?.warehouse?.id) {
					warehouseMap.set(product.location.warehouse.id, product.location.warehouse);
				}
			}
		} else {
			console.error(`Gagal memuat produk. Status: ${productsRes.status}`);
		}

		// 5. Proses Kategori secara AMAN
		let categories: CategoryResponse[] = [];
		if (categoriesRes.ok) {
			const rawCategories: CategoryResponse[] = await categoriesRes.json();
			const seen = new Set<string>();

			categories = rawCategories.filter((c) => {
				if (seen.has(c.name)) return false;
				seen.add(c.name);
				return true;
			});
		} else {
			console.error(`Gagal memuat kategori. Status: ${categoriesRes.status}`);
		}

		// 6. Kembalikan data yang sudah rapi
		return {
			suppliers: [...supplierMap.values()],
			warehouses: [...warehouseMap.values()],
			categories: categories.sort((a, b) => a.name.localeCompare(b.name))
		};
	} catch (error) {
		console.error('Terjadi kesalahan jaringan:', error);
		return { suppliers: [], warehouses: [], categories: [] };
	}
};
