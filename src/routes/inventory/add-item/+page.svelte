<script lang="ts">
	import BasicInformationForm from '$lib/components/features/add-item/BasicInformationForm.svelte';
	import ProductMediaUpload from '$lib/components/features/add-item/ProductMediaUpload.svelte';
	import ValueAndStock from '$lib/components/features/add-item/ValueAndStock.svelte';
	import WarehouseLogistics from '$lib/components/features/add-item/WarehouseLogistics.svelte';
	import type { CreateProductForm } from '$lib/types/types';

	let name = $state('');
	let sku = $state('');
	let description = $state('');
	let images = $state<CreateProductForm['images']>([]);
	let basePrice = $state(0);
	let salePrice = $state(0);
	let currentStock = $state(0);
	let stockThreshold = $state(10);
	let supplierId = $state<CreateProductForm['supplierId']>(null); // tambah ini
	let location = $state<CreateProductForm['location']>({
		// tambah ini
		warehouseId: null,
		aisle: '',
		shelf: ''
	});
</script>

<div class="flex flex-col">
	<h1 class="text-xl font-semibold text-slate-800">Add New Item</h1>
	<div class="flex flex-row">
		<div class="flex w-full flex-col gap-3 px-4 py-2">
			<BasicInformationForm bind:name bind:sku bind:description />
			<ProductMediaUpload bind:images />
		</div>
		<div class="flex w-full flex-col gap-3 px-4 py-2">
			<ValueAndStock bind:basePrice bind:salePrice bind:currentStock bind:stockThreshold />
			<WarehouseLogistics
				bind:supplierId
				bind:location
				suppliers={[
					{ id: 1, name: 'Artisan Clayworks Co.' },
					{ id: 2, name: 'Nordic Woodcrafts' }
				]}
				warehouses={[
					{ id: 1, name: 'North Warehouse' },
					{ id: 2, name: 'East Warehouse' },
					{ id: 3, name: 'Central Hub' }
				]}
			/>
		</div>
	</div>
</div>
