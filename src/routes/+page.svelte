<script lang="ts">
	import { goto } from '$app/navigation';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import FilterBar from '$lib/components/global/FilterBar.svelte';
	import InventoryTable from '$lib/components/features/Inventory/InventoryTable.svelte';
	import type { InventoryItem, InventoryFilter, BulkActionOption, InventoryListResponse } from '$lib/types/types';
	import { toInventoryItem } from '$lib/types/types';
	import { env } from '$env/dynamic/public';

	let { data } = $props();
	let items = $state<InventoryItem[]>([]);

	$effect.pre(() => {
		if (data?.products) {
			items = data.products;
		}
	});

	function handleDeleteItem(id: number) {
		items = items.filter((item) => item.id !== id);
	}

	function handleEditItem(item: InventoryItem) {
		goto(`/inventory/edit/${item.id}`);
	}

	let filterData = $state<InventoryFilter>({
		search: '',
		tab: 'all',
		category: null,
		warehouseId: null,
		dateRange: null
	});

	// Real data dari DB via loader
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
		const params = new SvelteURLSearchParams();

		if (newFilter.search) params.append('search', newFilter.search);

		if (newFilter.category && newFilter.category !== 'all') {
			const matched = (data?.categories ?? []).find(
				(c: { id: number; name: string }) => c.name === newFilter.category
			);
			if (matched) params.append('categoryId', String(matched.id));
		}

		if (newFilter.warehouseId != null) {
			params.append('warehouseId', String(newFilter.warehouseId));
		}

		if (newFilter.tab && newFilter.tab !== 'all') {
			params.append('tab', newFilter.tab);
		}

		try {
			const res = await fetch(`${env.PUBLIC_API_URL}/products?${params.toString()}`);
			if (res.ok) {
				const responseData = (await res.json()) as InventoryListResponse;
				items = responseData.data.map(toInventoryItem);
			}
		} catch (error) {
			console.error('Error fetching filtered data:', error);
		}
	}

	function handleBulkAction(actionId: string) {
		if (actionId === 'delete') {
			items = items.filter((item) => !selectedItemIds.includes(item.id));
			selectedItemIds = [];
		}
	}

	function handleExport() {
		console.log('Exporting data...');
	}
</script>

<svelte:head>
	<title>Admin Home | Artisan Ops</title>
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
