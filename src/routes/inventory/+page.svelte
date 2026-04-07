<script lang="ts">
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { goto } from '$app/navigation';
	import FilterBar from '$lib/components/global/FilterBar.svelte';
	import InventoryTable from '$lib/components/features/Inventory/InventoryTable.svelte';
	import type {
		InventoryItem,
		InventoryFilter,
		BulkActionOption,
		InventoryListResponse
	} from '$lib/types/types';
	import { toInventoryItem } from '$lib/types/types';
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
		goto(`/inventory/edit/${item.id}`);
	}

	// ==== STATE & HANDLER UNTUK FILTER BAR ====
	let filterData = $state<InventoryFilter>({
		search: '',
		tab: 'all',
		category: null,
		warehouseId: null,
		dateRange: null
	});

	// Ambil categories & warehouses dari data loader (real dari DB)
	const categoriesList = $derived(
		(data?.categories ?? []).map((c: { id: number; name: string }) => c.name)
	);
	const warehousesList = $derived(data?.warehouses ?? []);

	const bulkActionsList: BulkActionOption[] = [
		{ id: 'delete', label: 'Delete Selected', destructive: true },
		{ id: 'export', label: 'Export Selected' }
	];

	let selectedItemIds = $state<number[]>([]);
	let countSelected = $derived(selectedItemIds.length);

	async function handleFilterChange(newFilter: InventoryFilter) {
		console.log('Filter berubah:', newFilter);
		const params = new SvelteURLSearchParams();

		if (newFilter.search) {
			params.append('search', newFilter.search);
		}

		// Category: cari id berdasarkan nama yang dipilih
		if (newFilter.category && newFilter.category !== 'all') {
			const matched = (data?.categories ?? []).find(
				(c: { id: number; name: string }) => c.name === newFilter.category
			);
			if (matched) {
				params.append('categoryId', String(matched.id));
			}
		}

		// Warehouse: kirim warehouseId langsung (sudah number)
		if (newFilter.warehouseId != null) {
			params.append('warehouseId', String(newFilter.warehouseId));
		}

		// Tab: kirim tab ke API (backend support low_stock filtering)
		if (newFilter.tab && newFilter.tab !== 'all') {
			params.append('tab', newFilter.tab);
		}

		try {
			const res = await fetch(`${env.PUBLIC_API_URL}/products?${params.toString()}`);

			if (res.ok) {
				const responseData = (await res.json()) as InventoryListResponse;
				items = responseData.data.map(toInventoryItem);
				console.log('Data tabel berhasil diupdate sesuai filter!');
			} else {
				console.error('Gagal mengambil data filter. Status:', res.status);
			}
		} catch (error) {
			console.error('Error saat fetch data filter:', error);
		}
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
