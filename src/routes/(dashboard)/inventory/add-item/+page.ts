import { env } from '$env/dynamic/public';
import { browser } from '$app/environment';
import type { PageLoad } from './$types';
import type { SupplierResponse, WarehouseResponse, CategoryResponse } from '$lib/types/types';

export const ssr = false;

export const load: PageLoad = async ({ fetch }) => {
	try {
		let token = null;
		if (browser) token = localStorage.getItem('token');
		const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

		const [metaRes, suppliersRes] = await Promise.all([
			fetch(`${env.PUBLIC_API_URL}/products/meta`, { headers }),
			fetch(`${env.PUBLIC_API_URL}/suppliers`, { headers })
		]);

		let categories: CategoryResponse[] = [];
		let warehouses: WarehouseResponse[] = [];
		let suppliers: SupplierResponse[] = [];

		// 2. Ambil Kategori & Gudang
		if (metaRes.ok) {
			const metaData = await metaRes.json();
			const uniqueCategories = new Map();
			(metaData.categories || []).forEach((c: CategoryResponse) => {
				if (!uniqueCategories.has(c.name)) uniqueCategories.set(c.name, c);
			});
			categories = Array.from(uniqueCategories.values());
			warehouses = metaData.warehouses || [];
		}

		// 3. Ambil Supplier dari response mandiri
		if (suppliersRes.ok) {
			suppliers = await suppliersRes.json();
		} else {
			console.error('Gagal ambil supplier');
		}

		return {
			suppliers,
			warehouses,
			categories: categories.sort((a, b) => a.name.localeCompare(b.name))
		};
	} catch (error) {
		console.error('Terjadi kesalahan:', error);
		return { suppliers: [], warehouses: [], categories: [] };
	}
};
