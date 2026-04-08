import { env } from '$env/dynamic/public';
import { browser } from '$app/environment';
import type { PageLoad } from './$types';
import type {
	InventoryListResponse,
	CategoryResponse,
	WarehouseResponse,
	SupplierResponse
} from '$lib/types/types';

// 1. Matikan SSR
export const ssr = false;

export const load: PageLoad = async ({ fetch, params }) => {
	try {
		// 2. Ambil token
		let token = null;
		if (browser) token = localStorage.getItem('token');

		const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

		// 3. Tangkap ID produk yang mau diedit dari URL
		const productId = params.id;

		// 4. Fetch data produk spesifik, sekaligus fetch data untuk dropdown
		const [productRes, productsListRes, categoriesRes] = await Promise.all([
			fetch(`${env.PUBLIC_API_URL}/products/${productId}`, { headers }), // Data produk spesifik
			fetch(`${env.PUBLIC_API_URL}/products?limit=100`, { headers }), // Untuk cari opsi warehouse & supplier
			fetch(`${env.PUBLIC_API_URL}/categories`, { headers })
		]);

		if (!productRes.ok) {
			console.error(`Gagal memuat produk ID ${productId}`);
			return { product: null, categories: [], warehouses: [], suppliers: [] };
		}

		const rawProduct = await productRes.json();
		const productData = rawProduct?.data || rawProduct;

		// Ekstrak Warehouse & Supplier secara aman
		const supplierMap = new Map<number, SupplierResponse>();
		const warehouseMap = new Map<number, WarehouseResponse>();

		if (productsListRes.ok) {
			const rawList = (await productsListRes.json()) as InventoryListResponse;
			const safeData = rawList?.data || [];
			for (const p of safeData) {
				if (p?.supplier?.id) supplierMap.set(p.supplier.id, p.supplier);
				if (p?.location?.warehouse?.id)
					warehouseMap.set(p.location.warehouse.id, p.location.warehouse);
			}
		}

		// Ekstrak Kategori
		let categories: CategoryResponse[] = [];
		if (categoriesRes.ok) {
			const rawCategories: CategoryResponse[] = await categoriesRes.json();
			const seen = new Set<string>();
			categories = rawCategories.filter((c) => {
				if (seen.has(c.name)) return false;
				seen.add(c.name);
				return true;
			});
		}

		return {
			product: productData,
			categories: categories.sort((a, b) => a.name.localeCompare(b.name)),
			warehouses: Array.from(warehouseMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
			suppliers: Array.from(supplierMap.values())
		};
	} catch (error) {
		console.error('Terjadi kesalahan jaringan:', error);
		return { product: null, categories: [], warehouses: [], suppliers: [] };
	}
};
