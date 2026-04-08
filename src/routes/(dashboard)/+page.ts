import { env } from '$env/dynamic/public';
import { browser } from '$app/environment';
import type { PageLoad } from './$types';
import {
	toInventoryItem,
	type InventoryListResponse,
	type CategoryResponse,
	type WarehouseResponse
} from '$lib/types/types';

// 1. Matikan SSR agar bisa membaca token dari localStorage
export const ssr = false;

export const load: PageLoad = async ({ fetch }) => {
	try {
		// 2. Ambil token dan siapkan header
		let token = null;
		if (browser) token = localStorage.getItem('token');

		const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

		// 3. Panggil API secara paralel (Products untuk tabel, Categories untuk filter)
		const [productsRes, categoriesRes] = await Promise.all([
			fetch(`${env.PUBLIC_API_URL}/products?limit=100`, { headers }),
			fetch(`${env.PUBLIC_API_URL}/categories`, { headers })
		]);

		// 4. Proses Produk secara AMAN
		if (!productsRes.ok) {
			console.error(`Gagal memuat produk. Status API: ${productsRes.status}`);
			return { products: [], categories: [], warehouses: [] };
		}

		const rawData = (await productsRes.json()) as InventoryListResponse;
		const safeData = rawData?.data || [];
		const formattedProducts = safeData.map((product) => toInventoryItem(product));

		// 5. Proses Kategori secara AMAN
		const rawCategories: CategoryResponse[] = categoriesRes.ok ? await categoriesRes.json() : [];
		const seen = new Set<string>();
		const categories = rawCategories.filter((c) => {
			if (seen.has(c.name)) return false;
			seen.add(c.name);
			return true;
		});

		// 6. Ekstrak Warehouse dari Produk
		const warehouseMap = new Map<number, WarehouseResponse>();
		for (const p of safeData) {
			if (p?.location?.warehouse && !warehouseMap.has(p.location.warehouse.id)) {
				warehouseMap.set(p.location.warehouse.id, p.location.warehouse);
			}
		}

		return {
			products: formattedProducts,
			categories: categories.sort((a, b) => a.name.localeCompare(b.name)),
			warehouses: Array.from(warehouseMap.values()).sort((a, b) => a.name.localeCompare(b.name))
		};
	} catch (error) {
		console.error('Terjadi kesalahan jaringan:', error);
		return { products: [], categories: [], warehouses: [] };
	}
};
