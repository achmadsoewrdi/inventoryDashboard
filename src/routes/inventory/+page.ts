import { env } from '$env/dynamic/public';
import type { PageLoad } from './$types';
import {
	toInventoryItem,
	type InventoryListResponse,
	type CategoryResponse,
	type WarehouseResponse
} from '$lib/types/types';

export const load: PageLoad = async ({ fetch }) => {
	const [productsRes, categoriesRes] = await Promise.all([
		fetch(`${env.PUBLIC_API_URL}/products?limit=100`),
		fetch(`${env.PUBLIC_API_URL}/categories`)
	]);

	const rawData = (await productsRes.json()) as InventoryListResponse;
	const formattedProducts = rawData.data.map((product) => toInventoryItem(product));

	// Ambil semua categories langsung dari endpoint
	const rawCategories: CategoryResponse[] = categoriesRes.ok ? await categoriesRes.json() : [];

	// Dedupe berdasarkan nama
	const seen = new Set<string>();
	const categories = rawCategories.filter((c) => {
		if (seen.has(c.name)) return false;
		seen.add(c.name);
		return true;
	});

	// Warehouses tetap dari products (belum ada endpoint-nya)
	const warehouseMap = new Map<number, WarehouseResponse>();
	for (const p of rawData.data) {
		if (p.location?.warehouse && !warehouseMap.has(p.location.warehouse.id)) {
			warehouseMap.set(p.location.warehouse.id, p.location.warehouse);
		}
	}

	return {
		products: formattedProducts,
		categories: categories.sort((a, b) => a.name.localeCompare(b.name)),
		warehouses: Array.from(warehouseMap.values()).sort((a, b) => a.name.localeCompare(b.name))
	};
};
