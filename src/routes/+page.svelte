<script lang="ts">
	// Sesuaikan path import ini dengan struktur folder kamu
	import FilterBar from '$lib/components/global/FilterBar.svelte';
	import InventoryTable from '$lib/components/features/Inventory/InventoryTable.svelte';
	import type { InventoryItem, InventoryFilter, BulkActionOption } from '$lib/types/types';

	// Menggunakan $state agar tabel reaktif saat ada item yang dihapus/diedit
	let items = $state<InventoryItem[]>([
		{
			id: 1,
			name: 'Handcrafted Ceramic Vase',
			sku: 'ART-7729-CV',
			category: 'Ceramics',
			subCategory: 'Home Decor',
			currentStock: 42,
			stockThreshold: 50,
			status: 'IN_STOCK',
			location: { warehouseId: 1, warehouse: 'North Warehouse', aisle: 'Aisle 4', shelf: 'Shelf B' },
			supplier: 'Artisan Clayworks Co.',
			supplierId: 1,
			updatedAt: 'Oct 24, 2023',
			imageUrl: '' // Kosongkan untuk test fallback icon lucide
		},
		{
			id: 2,
			name: 'Sculpted Oak Dining Chair',
			sku: 'FUR-1022-OC',
			category: 'Furniture',
			subCategory: 'Seating',
			currentStock: 8,
			stockThreshold: 20,
			status: 'LOW_STOCK',
			location: { warehouseId: 2, warehouse: 'East Warehouse', aisle: 'Aisle 12', shelf: 'Floor' },
			supplier: 'WoodCrafters Inc.',
			supplierId: 2,
			updatedAt: 'Oct 23, 2023',
			imageUrl: ''
		},
		{
			id: 3,
			name: 'Aura Brass Table Lamp',
			sku: 'LGT-3341-BL',
			category: 'Lighting',
			subCategory: 'Tech',
			currentStock: 0,
			stockThreshold: 15,
			status: 'OUT_OF_STOCK',
			location: { warehouseId: 1, warehouse: 'North Warehouse', aisle: 'Aisle 2', shelf: 'Bin 9' },
			supplier: 'Lumina Industries',
			supplierId: 3,
			updatedAt: 'Oct 25, 2023',
			imageUrl: ''
		}
	]);

	// Fungsi untuk menangani aksi Delete dari baris tabel
	function handleDeleteItem(id: number) {
		// Logika sementara untuk UI: filter out item yang dihapus
		// Nanti di sini kita panggil API Fastify: await fetch(`/api/products/${id}`, { method: 'DELETE' })
		items = items.filter((item) => item.id !== id);
		console.log(`Item ${id} deleted`);
	}

	// Fungsi untuk menangani aksi Edit dari baris tabel
	function handleEditItem(item: InventoryItem) {
		console.log('Edit item:', item);
		// Nanti bisa buka modal edit atau navigasi ke halaman form edit
	}

	let filterData = $state<InventoryFilter>({
		search: '',
		tab: 'all',
		category: null,
		warehouseId: null,
		dateRange: null
	});

	// Dummy data untuk dropdown filter
	const categoriesList = ['Ceramics', 'Furniture', 'Lighting', 'Textiles'];
	const warehousesList = [
		{ id: 1, name: 'North Warehouse' },
		{ id: 2, name: 'East Warehouse' },
		{ id: 3, name: 'Central Hub' }
	];

	// Opsi untuk Bulk Action
	const bulkActionsList: BulkActionOption[] = [
		{ id: 'delete', label: 'Delete Selected', destructive: true },
		{ id: 'export', label: 'Export Selected' }
	];

	// State untuk menghitung berapa baris yang dicentang (di-bind dari tabel nanti)
	let selectedItemIds = $state<number[]>([]);

	// Derived value untuk diteruskan ke FilterBar
	let countSelected = $derived(selectedItemIds.length);

	// 3. Handlers
	function handleFilterChange(newFilter: InventoryFilter) {
		console.log('Filter berubah:', newFilter);
		// Nanti di sini kita panggil API Fastify dengan query params
		// fetch(`/api/products?search=${newFilter.search}&category=${newFilter.category}...`)
	}

	function handleBulkAction(actionId: string) {
		console.log(`Menjalankan bulk action: ${actionId} pada item:`, selectedItemIds);
		if (actionId === 'delete') {
			// Contoh implementasi hapus massal di UI
			items = items.filter((item) => !selectedItemIds.includes(item.id));
			selectedItemIds = []; // Reset pilihan
		}
	}

	function handleExport() {
		console.log('Exporting data...');
	}
</script>

<svelte:head>
	<title>Inventory - Artisan Ops</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<FilterBar
		bind:filter={filterData}
		categories={categoriesList}
		warehouses={warehousesList}
		bulkActions={bulkActionsList}
		selectedCount={countSelected}
		onFilterChange={handleFilterChange}
		onBulkAction={handleBulkAction}
		onExport={handleExport}
	/>

	<InventoryTable
		{items}
		onEdit={handleEditItem}
		onDelete={handleDeleteItem}
		selectedIds={new Set(selectedItemIds)}
		onToggleSelection={(id) => {
			if (selectedItemIds.includes(id)) {
				selectedItemIds = selectedItemIds.filter((i) => i !== id);
			} else {
				selectedItemIds = [...selectedItemIds, id];
			}
		}}
		onSelectAll={(checked) => {
			if (checked) {
				selectedItemIds = items.map((item) => item.id);
			} else {
				selectedItemIds = [];
			}
		}}
	/>
</div>
