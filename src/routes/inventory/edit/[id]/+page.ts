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

	// Fetch produk by ID + semua produk untuk extract dropdown options (paralel)
	const [productRes, listRes] = await Promise.all([
		fetch(`${env.PUBLIC_API_URL}/products/${id}`),
		fetch(`${env.PUBLIC_API_URL}/products?limit=100`)
	]);

	if (!productRes.ok) {
		throw error(productRes.status, 'Produk tidak ditemukan');
	}

	const product = (await productRes.json()) as InventoryItemResponse;
	const list = (await listRes.json()) as InventoryListResponse;

	// Extract unique dropdown options dari product list
	const supplierMap = new Map<number, SupplierResponse>();
	const warehouseMap = new Map<number, WarehouseResponse>();
	const categoryMap = new Map<number, CategoryResponse>();

	for (const p of list.data) {
		if (p.supplier) supplierMap.set(p.supplier.id, p.supplier);
		if (p.location?.warehouse) warehouseMap.set(p.location.warehouse.id, p.location.warehouse);
		if (p.category) categoryMap.set(p.category.id, p.category);
	}

	return {
		product,
		suppliers: [...supplierMap.values()],
		warehouses: [...warehouseMap.values()],
		categories: [...categoryMap.values()]
	};
};
