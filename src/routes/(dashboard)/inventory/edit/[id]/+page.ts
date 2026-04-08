import { env } from '$env/dynamic/public';
import { browser } from '$app/environment';
import type { PageLoad } from './$types';
import type {
	InventoryListResponse,
	CategoryResponse,
	WarehouseResponse,
	SupplierResponse
} from '$lib/types/types';

export const ssr = false;

export const load: PageLoad = async ({ fetch, params }) => {
	try {
		let token = null;
		if (browser) token = localStorage.getItem('token');

		const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
		const productId = params.id;

		// Panggil 3 endpoint: Spesifik Produk, Metadata (Gudang & Kategori), dan List Produk (untuk Supplier)
		const [productRes, metaRes, productsListRes] = await Promise.all([
			fetch(`${env.PUBLIC_API_URL}/products/${productId}`, { headers }),
			fetch(`${env.PUBLIC_API_URL}/products/meta`, { headers }), // Pakai endpoint baru!
			fetch(`${env.PUBLIC_API_URL}/products?limit=100`, { headers }) // Ekstrak supplier dari sini
		]);

		if (!productRes.ok) {
			console.error(`Gagal memuat produk ID ${productId}`);
			return { product: null, categories: [], warehouses: [], suppliers: [] };
		}

		const rawProduct = await productRes.json();
		const productData = rawProduct?.data || rawProduct;

		// 1. Ekstrak Kategori & Gudang langsung dari /meta
		let categories: CategoryResponse[] = [];
		let warehouses: WarehouseResponse[] = [];

		if (metaRes.ok) {
			const metaData = await metaRes.json();

			// Filter duplikat berdasarkan nama agar aman dari bug Svelte (seperti kasus 'Elektronik')
			const uniqueCategories = new Map();
			(metaData.categories || []).forEach((c: CategoryResponse) => {
				if (!uniqueCategories.has(c.name)) uniqueCategories.set(c.name, c);
			});

			categories = Array.from(uniqueCategories.values());
			warehouses = metaData.warehouses || [];
		}

		// 2. Ekstrak Supplier dari products list
		const supplierMap = new Map<number, SupplierResponse>();
		if (productsListRes.ok) {
			const rawList = (await productsListRes.json()) as InventoryListResponse;
			const safeData = rawList?.data || [];
			for (const p of safeData) {
				if (p?.supplier?.id) supplierMap.set(p.supplier.id, p.supplier);
			}
		}

		return {
			product: productData,
			categories: categories.sort((a, b) => a.name.localeCompare(b.name)),
			warehouses: warehouses, // Sudah bersih dari backend
			suppliers: Array.from(supplierMap.values())
		};
	} catch (error) {
		console.error('Terjadi kesalahan jaringan:', error);
		return { product: null, categories: [], warehouses: [], suppliers: [] };
	}
};
