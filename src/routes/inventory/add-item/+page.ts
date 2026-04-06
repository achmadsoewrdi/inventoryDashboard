import { env } from '$env/dynamic/public';
import type { PageLoad } from './$types';
import type { InventoryListResponse, SupplierResponse, WarehouseResponse, CategoryResponse } from '$lib/types/types';

export const load: PageLoad = async ({ fetch }) => {
	// Fetch semua product dengan limit besar untuk extract dropdown options
	const res = await fetch(`${env.PUBLIC_API_URL}/products?limit=100`);
	const raw = (await res.json()) as InventoryListResponse;

	// Extract unique suppliers dari product list
	const supplierMap = new Map<number, SupplierResponse>();
	const warehouseMap = new Map<number, WarehouseResponse>();
	const categoryMap = new Map<number, CategoryResponse>();

	for (const product of raw.data) {
		if (product.supplier) {
			supplierMap.set(product.supplier.id, product.supplier);
		}
		if (product.location?.warehouse) {
			warehouseMap.set(product.location.warehouse.id, product.location.warehouse);
		}
		if (product.category) {
			categoryMap.set(product.category.id, product.category);
		}
	}

	return {
		suppliers: [...supplierMap.values()],
		warehouses: [...warehouseMap.values()],
		categories: [...categoryMap.values()]
	};
};
