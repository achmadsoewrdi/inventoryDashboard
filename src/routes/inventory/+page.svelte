<script lang="ts">
	import FilterBar from '$lib/components/global/FilterBar.svelte';
	import InventoryTable from '$lib/components/features/Inventory/InventoryTable.svelte';
	import type { InventoryItem, InventoryFilter, BulkActionOption } from '$lib/types/types';
	import { env } from '$env/dynamic/public';

	// Mengambil data dari +page.ts
	let { data } = $props();
	let items = $state<InventoryItem[]>([]);

	// Gunakan effect.pre agar sinkron sebelum render jika data products ada
	$effect.pre(() => {
		if (data?.products) {
			items = data.products;
		}
	});

	// Fungsi untuk menangani aksi Delete menggunakan fetch API ke Fastify
	async function handleDeleteItem(id: number) {
		const res = await fetch(`${env.PUBLIC_API_URL}/products/${id}`, {
			method: 'DELETE'
		});

		if (res.ok) {
			items = items.filter((item) => item.id !== id);
			console.log('Sip, data beneran kehapus dari DB!');
		}
	}

	function handleEditItem(item: InventoryItem) {
		console.log('Klik edit untuk item:', item);
		alert(`Aksi edit untuk ${item.name} belum ada halaman/formnya.`);
	}

	// ==== STATE & HANDLER UNTUK FILTER BAR ====
	let filterData = $state<InventoryFilter>({
		search: '',
		tab: 'all',
		category: null,
		warehouseId: null,
		dateRange: null
	});

	const categoriesList = ['Ceramics', 'Furniture', 'Lighting', 'Textiles'];
	const warehousesList = [
		{ id: 1, name: 'North Warehouse' },
		{ id: 2, name: 'East Warehouse' },
		{ id: 3, name: 'Central Hub' }
	];

	const bulkActionsList: BulkActionOption[] = [
		{ id: 'delete', label: 'Delete Selected', destructive: true },
		{ id: 'export', label: 'Export Selected' }
	];

	let selectedItemIds = $state<number[]>([]);
	let countSelected = $derived(selectedItemIds.length);

	async function handleFilterChange(newFilter: InventoryFilter) {
		console.log('Filter berubah:', newFilter);
	}

	function handleBulkAction(actionId: string) {
		if (actionId === 'delete') {
			alert('Bulk delete belum dikonfigurasi ke endpoint API Fastify.');
			items = items.filter((item) => !selectedItemIds.includes(item.id));
			selectedItemIds = [];
		}
	}

	function handleExport() {
		console.log('Export data...');
	}
</script>

<svelte:head>
	<title>Inventory | Artisan Ops</title>
</svelte:head>

<div class="flex flex-col gap-6 p-6">
	<div class="flex flex-col gap-1">
		<h1 class="text-2xl font-bold tracking-tight text-slate-900">Inventory Items</h1>
		<p class="text-slate-500">Kelola dan lihat list inventory Anda dari backend Fastify.</p>
	</div>

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
