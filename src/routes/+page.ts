import { env } from '$env/dynamic/public';
import type { PageLoad } from './$types';
import {
    toInventoryItem,
    type InventoryListResponse,
    type CategoryResponse,
    type WarehouseResponse
} from '$lib/types/types';

export const load: PageLoad = async ({ fetch }) => {
    const response = await fetch(`${env.PUBLIC_API_URL}/products?limit=100`);
    const rawData = (await response.json()) as InventoryListResponse;

    const formattedProducts = rawData.data.map(product => toInventoryItem(product));

    // Extract unique categories dari products yang ada
    const categoryMap = new Map<number, CategoryResponse>();
    for (const p of rawData.data) {
        if (p.category && !categoryMap.has(p.category.id)) {
            categoryMap.set(p.category.id, p.category);
        }
    }

    // Extract unique warehouses dari products yang ada
    const warehouseMap = new Map<number, WarehouseResponse>();
    for (const p of rawData.data) {
        if (p.location?.warehouse && !warehouseMap.has(p.location.warehouse.id)) {
            warehouseMap.set(p.location.warehouse.id, p.location.warehouse);
        }
    }

    return {
        products: formattedProducts,
        categories: Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
        warehouses: Array.from(warehouseMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
    };
};
