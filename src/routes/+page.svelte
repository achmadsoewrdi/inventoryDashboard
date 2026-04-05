<script lang="ts">
	import FilterBar from '$lib/components/global/FilterBar.svelte';
	import InventoryTableRow from '$lib/components/features/Inventory/InventoryTableRow.svelte';
	import type { InventoryFilter, BulkActionOption, InventoryItem } from '$lib/types/types';

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

	// Dummy data for InventoryTableRow test
	const dummyItem: InventoryItem = {
		id: 1,
		name: 'Aesthetic Ceramic Vase',
		category: 'Ceramics',
		subCategory: 'Home Decor',
		sku: 'CRM-VSE-001',
		currentStock: 120,
		stockThreshold: 50,
		status: 'IN_STOCK',
		location: {
			aisle: 'Aisle 4',
			shelf: 'Shelf B',
			warehouse: 'North Warehouse',
			warehouseId: 1
		},
		supplier: 'Artisan Clayworks Co.',
		supplierId: 1,
		imageUrl:
			'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=200&auto=format&fit=crop',
		updatedAt: new Date().toLocaleDateString()
	};

	let rowSelected = $state(false);

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

	<!-- InventoryTableRow Component Test -->
	<div class="mt-8 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
		<h2
			class="border-b border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold tracking-wider text-stone-500 uppercase"
		>
			Inventory Table Row Test
		</h2>
		<div class="overflow-x-auto">
			<table class="w-full text-left text-sm whitespace-nowrap">
				<thead
					class="border-b border-stone-200 bg-stone-50 text-xs tracking-wider text-stone-500 uppercase"
				>
					<tr>
						<th class="w-12 p-4 text-center">
							<input type="checkbox" class="h-4 w-4 rounded border-stone-300" />
						</th>
						<th class="p-4 font-semibold">Product</th>
						<th class="p-4 font-semibold">Category</th>
						<th class="p-4 font-semibold">Stock</th>
						<th class="p-4 font-semibold">Status</th>
						<th class="p-4 font-semibold">Location</th>
						<th class="p-4 text-right font-semibold">Actions</th>
					</tr>
				</thead>
				<tbody>
					<!-- Preview of the single row -->
					<InventoryTableRow
						item={dummyItem}
						selected={rowSelected}
						onToggleSelection={() => (rowSelected = !rowSelected)}
					/>
				</tbody>
			</table>
		</div>
	</div>

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
