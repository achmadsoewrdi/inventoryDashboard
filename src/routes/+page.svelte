<script lang="ts">
	import FilterBar from '$lib/components/global/FilterBar.svelte';
	import type { InventoryFilter, BulkActionOption } from '$lib/types/types';

	// Dummy state for FilterBar test
	let filter = $state<InventoryFilter>({
		tab: 'all',
		category: null,
		warehouseId: null,
		dateRange: null,
		search: ''
	});

	let selectedCount = $state(2);

	const categories = ['Ceramics', 'Tools', 'Materials'];
	const warehouses = [
		{ id: 1, name: 'North Warehouse' },
		{ id: 2, name: 'South Warehouse' }
	];

	const bulkActions: BulkActionOption[] = [
		{ id: 'export', label: 'Export Selected' },
		{ id: 'delete', label: 'Delete Selected', destructive: true }
	];

	function handleFilterChange(newFilter: InventoryFilter) {
		console.log('Filter changed:', newFilter);
	}

	function handleBulkAction(actionId: string) {
		console.log('Bulk action triggered:', actionId);
		// Reset selection for demo purposes
		if (actionId === 'delete') {
			selectedCount = 0;
		}
	}

	function handleExport() {
		console.log('Export button clicked');
	}
</script>

<div class="min-h-screen bg-stone-50">
	<!-- FilterBar Component Test -->
	<FilterBar
		bind:filter
		{categories}
		{warehouses}
		{bulkActions}
		{selectedCount}
		onFilterChange={handleFilterChange}
		onBulkAction={handleBulkAction}
		onExport={handleExport}
	/>

	<!-- Debug Output to display current state -->
	<div class="mt-8 rounded-lg border border-stone-200 bg-white p-4">
		<h2 class="mb-2 text-sm font-semibold tracking-wider text-stone-500 uppercase">
			Debug Internal State
		</h2>
		<pre class="overflow-auto text-xs text-stone-600">{JSON.stringify(
				{ filter, selectedCount },
				null,
				2
			)}</pre>
	</div>
</div>
