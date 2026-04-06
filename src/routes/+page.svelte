<script lang="ts">
	import FilterBar from '$lib/components/global/FilterBar.svelte';
	import InventoryTable from '$lib/components/features/Inventory/InventoryTable.svelte';
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
		status: 'LOW_STOCK',
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

	<!-- InventoryTable Component Test -->
	<div class="mt-8">
		<InventoryTable
			items={[
				dummyItem,
				{ ...dummyItem, id: 2, name: 'Clay Pot', sku: 'CRM-POT-002' },
				{ ...dummyItem, id: 3, name: 'Glass Vase', sku: 'GLS-VSE-003', status: 'IN_STOCK' },
				{ ...dummyItem, id: 4, name: 'Wooden Bowl', sku: 'WOD-BWL-004' },
				{ ...dummyItem, id: 5, name: 'Metal Tray', sku: 'MTL-TRY-005', status: 'OUT_OF_STOCK' },
				{ ...dummyItem, id: 6, name: 'Silk Flowers', sku: 'SLK-FLW-006' },
				{ ...dummyItem, id: 7, name: 'Candle Holder', sku: 'CND-HLD-007', status: 'IN_STOCK' }
			]}
		/>
	</div>
</div>
