import { env } from '$env/dynamic/public';
import { browser } from '$app/environment';
import type { PageLoad } from './$types';
import {
	toInventoryItem,
	type InventoryListResponse,
	type CategoryResponse,
	type WarehouseResponse
} from '$lib/types/types';

export const ssr = false;

export const load: PageLoad = async ({ fetch }) => {
	try {
		let token = null;
		if (browser) token = localStorage.getItem('token');

		const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

		// Cukup ambil produk default dan metadata dari endpoint barumu
		const [productsRes, metaRes] = await Promise.all([
			fetch(`${env.PUBLIC_API_URL}/products?limit=100`, { headers }),
			fetch(`${env.PUBLIC_API_URL}/products/meta`, { headers })
		]);

		if (!productsRes.ok) {
			console.error(`Gagal memuat produk. Status API: ${productsRes.status}`);
			return { products: [], categories: [], warehouses: [] };
		}

		const rawData = (await productsRes.json()) as InventoryListResponse;
		const safeData = rawData?.data || [];
		const formattedProducts = safeData.map((product) => toInventoryItem(product));

		let categories: CategoryResponse[] = [];
		let warehouses: WarehouseResponse[] = [];

		if (metaRes.ok) {
			const metaData = await metaRes.json();
			categories = metaData.categories || [];
			warehouses = metaData.warehouses || [];
		}

		return {
			products: formattedProducts,
			categories: categories,
			warehouses: warehouses
		};
	} catch (error) {
		console.error('Terjadi kesalahan jaringan:', error);
		return { products: [], categories: [], warehouses: [] };
	}
};
