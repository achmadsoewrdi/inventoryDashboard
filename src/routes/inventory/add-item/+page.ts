import { env } from '$env/dynamic/public';
import type { PageLoad } from './$types';
import type {
	InventoryListResponse,
	SupplierResponse,
	WarehouseResponse,
	CategoryResponse
} from '$lib/types/types';

export const load: PageLoad = async ({ fetch }) => {
	const [productsRes, categoriesRes] = await Promise.all([
		fetch(`${env.PUBLIC_API_URL}/products?limit=100`),
		fetch(`${env.PUBLIC_API_URL}/categories`)
	]);

	const raw = (await productsRes.json()) as InventoryListResponse;

	// Extract unique suppliers & warehouses dari products (belum ada endpoint-nya)
	const supplierMap = new Map<number, SupplierResponse>();
	const warehouseMap = new Map<number, WarehouseResponse>();

	for (const product of raw.data) {
		if (product.supplier) {
			supplierMap.set(product.supplier.id, product.supplier);
		}
		if (product.location?.warehouse) {
			warehouseMap.set(product.location.warehouse.id, product.location.warehouse);
		}
	}

	// Categories langsung dari endpoint, dedupe berdasarkan nama
	const rawCategories: CategoryResponse[] = categoriesRes.ok ? await categoriesRes.json() : [];
	const seen = new Set<string>();
	const categories = rawCategories.filter((c) => {
		if (seen.has(c.name)) return false;
		seen.add(c.name);
		return true;
	});

	return {
		suppliers: [...supplierMap.values()],
		warehouses: [...warehouseMap.values()],
		categories: categories.sort((a, b) => a.name.localeCompare(b.name))
	};
};
