import { env } from '$env/dynamic/public';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type {
	InventoryItemResponse,
	InventoryListResponse,
	SupplierResponse,
	WarehouseResponse,
	CategoryResponse
} from '$lib/types/types';

export const load: PageLoad = async ({ fetch, params }) => {
	const id = Number(params.id);
	if (isNaN(id)) throw error(400, 'ID produk tidak valid');

	// Fetch data
	const [productRes, listRes, categoriesRes] = await Promise.all([
		fetch(`${env.PUBLIC_API_URL}/products/${id}`),
		fetch(`${env.PUBLIC_API_URL}/products?limit=100`),
		fetch(`${env.PUBLIC_API_URL}/categories`)
	]);

	if (!productRes.ok) {
		throw error(productRes.status, 'Produk tidak ditemukan');
	}

	const product = (await productRes.json()) as InventoryItemResponse;
	const list = (await listRes.json()) as InventoryListResponse;

	// Extract unique dropdown options dari product list
	const supplierMap = new Map<number, SupplierResponse>();
	const warehouseMap = new Map<number, WarehouseResponse>();

	for (const p of list.data) {
		if (p.supplier) supplierMap.set(p.supplier.id, p.supplier);
		if (p.location?.warehouse) warehouseMap.set(p.location.warehouse.id, p.location.warehouse);
	}

	const rawCategories: CategoryResponse[] = categoriesRes.ok ? await categoriesRes.json() : [];
	const seen = new Set<string>();
	const categories = rawCategories.filter((c) => {
		if (seen.has(c.name)) return false;
		seen.add(c.name);
		return true;
	});

	return {
		product,
		suppliers: [...supplierMap.values()],
		warehouses: [...warehouseMap.values()],
		categories: categories.sort((a, b) => a.name.localeCompare(b.name))
	};
};
