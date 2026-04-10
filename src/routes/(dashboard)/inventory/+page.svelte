<script lang="ts">
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { goto } from '$app/navigation';
	import FilterBar from '$lib/components/global/FilterBar.svelte';
	import InventoryTable from '$lib/components/features/Inventory/InventoryTable.svelte';
	import Pagination from '$lib/components/global/Pagination.svelte';
	import AlertOverlay from '$lib/components/global/AlertOverlay.svelte';
	import type {
		InventoryItem,
		InventoryFilter,
		BulkActionOption,
		InventoryListResponse
	} from '$lib/types/types';
	import { toInventoryItem } from '$lib/types/types';
	import { env } from '$env/dynamic/public';
	import { isAdmin } from '$lib/stores/auth';

	// Data Initialization
	let { data } = $props();
	let items = $state<InventoryItem[]>([]);

	$effect.pre(() => {
		if (data?.products) {
			items = data.products;
		}
	});

	// Pagination State
	const PER_PAGE = 5;
	let currentPage = $state(1);
	const totalPages = $derived(Math.max(1, Math.ceil(items.length / PER_PAGE)));
	const pagedItems = $derived(items.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE));

	function handlePageChange(page: number) {
		currentPage = page;
	}

	// Filter & Bulk Actions State
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

	const bulkActionsList = $derived<BulkActionOption[]>(
		$isAdmin
			? [
					{ id: 'delete', label: 'Delete Selected', destructive: true },
					{ id: 'export', label: 'Export Selected' }
				]
			: [{ id: 'export', label: 'Export Selected' }]
	);

	let selectedItemIds = $state<number[]>([]);
	let countSelected = $derived(selectedItemIds.length);

	// Modal State
	let isDeleteModalOpen = $state(false);
	let isDeleting = $state(false);
	let itemToDelete = $state<InventoryItem | null>(null);

	// ─── ROW ACTIONS ───
	function handleViewItem(item: InventoryItem) {
		goto(`/inventory/${item.id}`);
	}

	function handleEditItem(item: InventoryItem) {
		goto(`/inventory/edit/${item.id}`);
	}

	function handleDeleteClick(item: InventoryItem) {
		itemToDelete = item;
		isDeleteModalOpen = true;
	}

	async function executeDelete() {
		if (!itemToDelete) return;
		isDeleting = true;

		try {
			const token = localStorage.getItem('token');
			const res = await fetch(`${env.PUBLIC_API_URL}/products/${itemToDelete.id}`, {
				method: 'DELETE',
				headers: token ? { Authorization: `Bearer ${token}` } : {}
			});

			if (res.ok) {
				items = items.filter((item) => item.id !== itemToDelete!.id);
				if (currentPage > Math.ceil(items.length / PER_PAGE)) {
					currentPage = Math.max(1, currentPage - 1);
				}
				// Hapus dari daftar seleksi jika sebelumnya tercentang
				selectedItemIds = selectedItemIds.filter((id) => id !== itemToDelete!.id);
				console.log('Data berhasil dihapus');
				isDeleteModalOpen = false;
			} else {
				throw new Error(`Gagal menghapus data. Status: ${res.status}`);
			}
		} catch (error) {
			console.error('Error saat hapus:', error);
			alert('Gagal menghapus produk dari database.');
		} finally {
			isDeleting = false;
			itemToDelete = null;
		}
	}

	// ─── FILTER & EXPORT ACTIONS ───
	async function handleFilterChange(newFilter: InventoryFilter) {
		console.log('Filter berubah:', newFilter);
		const params = new SvelteURLSearchParams();

		if (newFilter.search) params.append('search', newFilter.search);
		if (newFilter.category && newFilter.category !== 'all') {
			const matched = (data?.categories ?? []).find(
				(c: { id: number; name: string }) => c.name === newFilter.category
			);
			if (matched) params.append('categoryId', String(matched.id));
		}
		if (newFilter.warehouseId != null) params.append('warehouseId', String(newFilter.warehouseId));
		if (newFilter.tab && newFilter.tab !== 'all') params.append('tab', newFilter.tab);

		try {
			const token = localStorage.getItem('token');
			const res = await fetch(`${env.PUBLIC_API_URL}/products?${params.toString()}`, {
				headers: token ? { Authorization: `Bearer ${token}` } : {}
			});

			if (res.ok) {
				const responseData = (await res.json()) as InventoryListResponse;
				items = responseData.data.map(toInventoryItem);
				currentPage = 1;
				selectedItemIds = []; // Reset seleksi saat filter berubah
			}
		} catch (error) {
			console.error('Error saat fetch data filter:', error);
		}
	}

	async function handleExport() {
		try {
			const params = new SvelteURLSearchParams();

			if (filterData.search) params.append('search', filterData.search);
			if (filterData.category && filterData.category !== 'all') {
				const matched = (data?.categories ?? []).find(
					(c: { id: number; name: string }) => c.name === filterData.category
				);
				if (matched) params.append('categoryId', String(matched.id));
			}
			if (filterData.warehouseId != null)
				params.append('warehouseId', String(filterData.warehouseId));
			if (filterData.tab && filterData.tab !== 'all') params.append('tab', filterData.tab);

			// Masukkan ID yang dicentang
			selectedItemIds.forEach((id) => params.append('ids', String(id)));

			const token = localStorage.getItem('token');
			const res = await fetch(`${env.PUBLIC_API_URL}/products/export?${params.toString()}`, {
				method: 'GET',
				headers: token ? { Authorization: `Bearer ${token}` } : {}
			});

			if (!res.ok) throw new Error('Gagal mengekspor data');

			const blob = await res.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `inventory_export_${new Date().getTime()}.xlsx`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		} catch (error) {
			console.error('Error saat export:', error);
			alert('Gagal mendownload file export.');
		}
	}

	function handleBulkAction(actionId: string) {
		if (actionId === 'delete') {
			alert('Bulk delete belum dikonfigurasi ke endpoint API Fastify.');
		} else if (actionId === 'export') {
			handleExport();
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
		isAdmin={$isAdmin}
		onView={handleViewItem}
		onEdit={handleEditItem}
		onDelete={handleDeleteClick}
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

	<AlertOverlay
		isOpen={isDeleteModalOpen}
		title="Hapus Produk?"
		message={`Apakah Anda yakin ingin menghapus "${itemToDelete?.name}"? Data yang dihapus tidak dapat dikembalikan.`}
		type="danger"
		confirmText="Ya, Hapus"
		cancelText="Batal"
		isLoading={isDeleting}
		onConfirm={executeDelete}
		onCancel={() => {
			isDeleteModalOpen = false;
			itemToDelete = null;
		}}
	/>
</div>
