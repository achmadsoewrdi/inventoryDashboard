<script lang="ts">
	import type { CreateProductForm, SupplierResponse, WarehouseResponse } from '$lib/types/types';
	import { cn } from '$lib/utils/cn';
	import { ChevronDown, Check } from 'lucide-svelte';

	interface Props {
		supplierId: CreateProductForm['supplierId'];
		location: CreateProductForm['location'];
		suppliers?: SupplierResponse[];
		warehouses?: WarehouseResponse[];
		class?: string;
	}

	let {
		supplierId = $bindable(null),
		location = $bindable({ warehouseId: null, aisle: '', shelf: '' }),
		suppliers = [],
		warehouses = [],
		class: className = ''
	}: Props = $props();

	let supplierOpen = $state(false);
	let warehouseOpen = $state(false);

	let supplierEl = $state<HTMLDivElement | null>(null);
	let warehouseEl = $state<HTMLDivElement | null>(null);

	const selectedSupplier = $derived(suppliers.find((s) => s.id === supplierId));
	const selectedWarehouse = $derived(warehouses.find((w) => w.id === location.warehouseId));

	// preview lokasi gabungan
	const locationPreview = $derived(() => {
		const parts = [];
		if (location.aisle) parts.push(`Zona ${location.aisle}`);
		if (location.shelf) parts.push(`Rak ${location.shelf}`);
		return parts.length > 0 ? parts.join(' · ') : null;
	});

	function selectSupplier(id: number) {
		supplierId = id;
		supplierOpen = false;
	}

	function selectWarehouse(id: number) {
		location.warehouseId = id;
		warehouseOpen = false;
	}

	function handleOutsideClick(e: MouseEvent) {
		const target = e.target as Node;
		if (supplierEl && !supplierEl.contains(target)) supplierOpen = false;
		if (warehouseEl && !warehouseEl.contains(target)) warehouseOpen = false;
	}
</script>

<svelte:window onclick={handleOutsideClick} />

<div class={cn('rounded-xl border border-slate-200 bg-slate-50 p-6', className)}>
	<!-- Section Title -->
	<div class="mb-5 flex items-center gap-2">
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="text-slate-400">
			<path
				d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linejoin="round"
			/>
			<circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="1.5" />
		</svg>
		<h2 class="text-sm font-semibold text-slate-700">Warehouse Logistics</h2>
	</div>

	<div class="flex flex-col gap-4">
		<!-- Supplier Dropdown -->
		<div class="flex flex-col gap-1.5">
			<span
				id="supplier-label"
				class="text-[11px] font-semibold tracking-widest text-slate-400 uppercase"
			>
				Supplier Name
			</span>
			<div class="relative" bind:this={supplierEl}>
				<button
					type="button"
					aria-labelledby="supplier-label"
					onclick={() => (supplierOpen = !supplierOpen)}
					class={cn(
						'flex w-full items-center justify-between rounded-lg border bg-white px-3 py-2.5 text-left text-sm transition-all',
						supplierOpen
							? 'border-slate-400 ring-2 ring-slate-100'
							: 'border-slate-200 hover:border-slate-300'
					)}
				>
					<span class={selectedSupplier ? 'text-slate-700' : 'text-slate-400'}>
						{selectedSupplier?.name ?? 'Pilih supplier...'}
					</span>
					<ChevronDown
						size={14}
						class={cn('shrink-0 text-slate-400 transition-transform', supplierOpen && 'rotate-180')}
					/>
				</button>

				{#if supplierOpen}
					<div
						class="absolute top-full left-0 z-50 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg"
					>
						{#if suppliers.length === 0}
							<div class="px-4 py-3 text-sm text-slate-400">Tidak ada supplier tersedia</div>
						{:else}
							{#each suppliers as supplier (supplier.id)}
								<button
									type="button"
									onclick={() => selectSupplier(supplier.id)}
									class={cn(
										'flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-50',
										supplierId === supplier.id ? 'text-slate-800' : 'text-slate-600'
									)}
								>
									<span>{supplier.name}</span>
									{#if supplierId === supplier.id}
										<Check size={13} class="text-slate-800" />
									{/if}
								</button>
							{/each}
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<!-- Warehouse Location -->
		<div class="flex flex-col gap-1.5">
			<span
				id="warehouse-label"
				class="text-[11px] font-semibold tracking-widest text-slate-400 uppercase"
			>
				Lokasi Gudang
			</span>

			<!-- Warehouse Dropdown -->
			<div class="relative mb-2" bind:this={warehouseEl}>
				<button
					type="button"
					aria-labelledby="warehouse-label"
					onclick={() => (warehouseOpen = !warehouseOpen)}
					class={cn(
						'flex w-full items-center justify-between rounded-lg border bg-white px-3 py-2.5 text-left text-sm transition-all',
						warehouseOpen
							? 'border-slate-400 ring-2 ring-slate-100'
							: 'border-slate-200 hover:border-slate-300'
					)}
				>
					<span class={selectedWarehouse ? 'text-slate-700' : 'text-slate-400'}>
						{selectedWarehouse?.name ?? 'Pilih gudang...'}
					</span>
					<ChevronDown
						size={14}
						class={cn(
							'shrink-0 text-slate-400 transition-transform',
							warehouseOpen && 'rotate-180'
						)}
					/>
				</button>

				{#if warehouseOpen}
					<div
						class="absolute top-full left-0 z-50 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg"
					>
						{#if warehouses.length === 0}
							<div class="px-4 py-3 text-sm text-slate-400">Tidak ada gudang tersedia</div>
						{:else}
							{#each warehouses as warehouse (warehouse.id)}
								<button
									type="button"
									onclick={() => selectWarehouse(warehouse.id)}
									class={cn(
										'flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-50',
										location.warehouseId === warehouse.id ? 'text-slate-800' : 'text-slate-600'
									)}
								>
									<span>{warehouse.name}</span>
									{#if location.warehouseId === warehouse.id}
										<Check size={13} class="text-slate-800" />
									{/if}
								</button>
							{/each}
						{/if}
					</div>
				{/if}
			</div>

			<!-- Zona + Nomor Rak -->
			<div class="grid grid-cols-2 gap-2">
				<div class="flex flex-col gap-1">
					<label for="location-aisle" class="text-[11px] font-medium text-slate-400">
						Zona / Lorong
					</label>
					<input
						id="location-aisle"
						type="text"
						bind:value={location.aisle}
						placeholder="Contoh: A, B, C"
						class="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 transition-all outline-none placeholder:text-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
					/>
				</div>
				<div class="flex flex-col gap-1">
					<label for="location-shelf" class="text-[11px] font-medium text-slate-400">
						Nomor Rak
					</label>
					<input
						id="location-shelf"
						type="text"
						bind:value={location.shelf}
						placeholder="Contoh: 1, 2, 3"
						class="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 transition-all outline-none placeholder:text-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
					/>
				</div>
			</div>

			<!-- Preview lokasi gabungan -->
			{#if locationPreview()}
				<div class="mt-1 flex items-center gap-1.5 rounded-md bg-slate-100 px-3 py-2">
					<svg
						width="12"
						height="12"
						viewBox="0 0 24 24"
						fill="none"
						class="shrink-0 text-slate-400"
					>
						<path
							d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linejoin="round"
						/>
						<circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="1.5" />
					</svg>
					<span class="text-xs text-slate-500">
						Lokasi: <span class="font-semibold text-slate-700">{locationPreview()}</span>
					</span>
				</div>
			{/if}
		</div>
	</div>
</div>
