<script lang="ts">
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { goto } from '$app/navigation';
	import FilterBar from '$lib/components/global/FilterBar.svelte';
	import InventoryTable from '$lib/components/features/Inventory/InventoryTable.svelte';
	import Pagination from '$lib/components/global/Pagination.svelte';
	import type {
		InventoryItem,
		InventoryFilter,
		BulkActionOption,
		InventoryListResponse
	} from '$lib/types/types';
	import { toInventoryItem } from '$lib/types/types';
	import { env } from '$env/dynamic/public';

	let { data } = $props();
	let items = $state<InventoryItem[]>([]);

	$effect.pre(() => {
		if (data?.products) {
			items = data.products;
		}
	});

	const PER_PAGE = 5;
	let currentPage = $state(1);

	const totalPages = $derived(Math.max(1, Math.ceil(items.length / PER_PAGE)));
	const pagedItems = $derived(items.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE));

	function handlePageChange(page: number) {
		currentPage = page;
	}

	async function handleDeleteItem(id: number) {
		const token = localStorage.getItem('token');

		const res = await fetch(`${env.PUBLIC_API_URL}/products/${id}`, {
			method: 'DELETE',
			headers: token ? { Authorization: `Bearer ${token}` } : {}
		});

		if (res.ok) {
			items = items.filter((item) => item.id !== id);
			if (currentPage > Math.ceil(items.length / PER_PAGE)) {
				currentPage = Math.max(1, currentPage - 1);
			}
			console.log('Sip, data beneran kehapus dari DB!');
		} else {
			console.error('Gagal menghapus data. Status:', res.status);
		}
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

	const categoriesList = $derived([
		...new Set((data?.categories ?? []).map((c: { id: number; name: string }) => c.name))
	]);
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

		if (newFilter.category && newFilter.category !== 'all') {
			const matched = (data?.categories ?? []).find(
				(c: { id: number; name: string }) => c.name === newFilter.category
			);
			if (matched) {
				params.append('categoryId', String(matched.id));
			}
		}

		if (newFilter.warehouseId != null) {
			params.append('warehouseId', String(newFilter.warehouseId));
		}

		if (newFilter.tab && newFilter.tab !== 'all') {
			params.append('tab', newFilter.tab);
		}

		try {
			const token = localStorage.getItem('token');
			const res = await fetch(`${env.PUBLIC_API_URL}/products?${params.toString()}`, {
				headers: token ? { Authorization: `Bearer ${token}` } : {}
			});

			if (res.ok) {
				const responseData = (await res.json()) as InventoryListResponse;
				items = responseData.data.map(toInventoryItem);
				currentPage = 1;
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
			currentPage = 1;
		} else if (actionId === 'export') {
			// Panggil fungsi handleExport yang baru saja kita buat!
			handleExport();
		}
	}

	async function handleExport() {
		try {
			const params = new SvelteURLSearchParams();

			// 1. Masukkan filter yang sedang aktif
			if (filterData.search) params.append('search', filterData.search);

			if (filterData.category && filterData.category !== 'all') {
				const matched = (data?.categories ?? []).find(
					(c: { id: number; name: string }) => c.name === filterData.category
				);
				if (matched) params.append('categoryId', String(matched.id));
			}

			if (filterData.warehouseId != null) {
				params.append('warehouseId', String(filterData.warehouseId));
			}

			if (filterData.tab && filterData.tab !== 'all') {
				params.append('tab', filterData.tab);
			}

			// 2. Masukkan list ID jika ada yang dicentang (selectedItemIds)
			selectedItemIds.forEach((id) => params.append('ids', String(id)));

			const token = localStorage.getItem('token');

			// 3. Panggil API Export
			const res = await fetch(`${env.PUBLIC_API_URL}/products/export?${params.toString()}`, {
				method: 'GET',
				headers: token ? { Authorization: `Bearer ${token}` } : {}
			});

			if (!res.ok) throw new Error('Gagal mengekspor data');

			// 4. Handle Blob untuk download file
			const blob = await res.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;

			// Nama file dinamis dengan timestamp
			a.download = `inventory_export_${new Date().getTime()}.xlsx`;

			document.body.appendChild(a);
			a.click();

			// Cleanup
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);

			console.log('Export berhasil!');
		} catch (error) {
			console.error('Error saat export:', error);
		}
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
		items={pagedItems}
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

	{#if items.length > PER_PAGE}
		<Pagination
			bind:currentPage
			{totalPages}
			totalItems={items.length}
			perPage={PER_PAGE}
			onPageChange={handlePageChange}
		/>
	{/if}
</div>
