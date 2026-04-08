import { env } from '$env/dynamic/public';
import { browser } from '$app/environment';
import type { PageLoad } from './$types';
import type {
	InventoryListResponse,
	SupplierResponse,
	WarehouseResponse,
	CategoryResponse
} from '$lib/types/types';

export const ssr = false;

export const load: PageLoad = async ({ fetch }) => {
	try {
		let token = null;
		if (browser) token = localStorage.getItem('token');

		const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

		// Panggil endpoint /meta untuk Gudang & Kategori, dan /products untuk Supplier
		const [productsRes, metaRes] = await Promise.all([
			fetch(`${env.PUBLIC_API_URL}/products?limit=100`, { headers }),
			fetch(`${env.PUBLIC_API_URL}/products/meta`, { headers })
		]);

		// 1. Ekstrak Kategori & Gudang dari metadata
		let categories: CategoryResponse[] = [];
		let warehouses: WarehouseResponse[] = [];

		if (metaRes.ok) {
			const metaData = await metaRes.json();

			// Filter duplikat nama kategori untuk mencegah error 'each_key_duplicate' Svelte
			const uniqueCategories = new Map();
			(metaData.categories || []).forEach((c: CategoryResponse) => {
				if (!uniqueCategories.has(c.name)) uniqueCategories.set(c.name, c);
			});

			categories = Array.from(uniqueCategories.values());
			warehouses = metaData.warehouses || [];
		} else {
			console.error(`Gagal memuat metadata. Status: ${metaRes.status}`);
		}

		// 2. Ekstrak Supplier dari list produk
		const supplierMap = new Map<number, SupplierResponse>();
		if (productsRes.ok) {
			const raw = (await productsRes.json()) as InventoryListResponse;
			const safeData = raw?.data || [];
			for (const product of safeData) {
				if (product?.supplier?.id) {
					supplierMap.set(product.supplier.id, product.supplier);
				}
			}
		} else {
			console.error(`Gagal memuat produk. Status: ${productsRes.status}`);
		}

		return {
			suppliers: Array.from(supplierMap.values()),
			warehouses: warehouses, // Sudah bersih
			categories: categories.sort((a, b) => a.name.localeCompare(b.name)) // Sudah unik & bersih
		};
	} catch (error) {
		console.error('Terjadi kesalahan jaringan:', error);
		return { suppliers: [], warehouses: [], categories: [] };
	}
};
