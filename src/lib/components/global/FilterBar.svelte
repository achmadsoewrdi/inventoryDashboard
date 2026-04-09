<script lang="ts">
	import type { InventoryFilter, BulkActionOption, FilterTab } from '$lib/types/types';
	import Input from '$lib/components/global/Input.svelte';
	import { cn } from '$lib/utils/cn';
	import { Download, RotateCcw, ChevronDown } from 'lucide-svelte';

	interface Props {
		filter: InventoryFilter;
		categories?: string[];
		warehouses?: { id: number; name: string }[];
		bulkActions?: BulkActionOption[];
		selectedCount?: number;
		class?: string;
		onFilterChange?: (filter: InventoryFilter) => void;
		onBulkAction?: (action: string) => void;
		onExport?: () => void;
	}

	let {
		filter = $bindable(),
		categories = [],
		warehouses = [],
		bulkActions = [],
		selectedCount = 0,
		class: className = '',
		onFilterChange,
		onBulkAction,
		onExport
	}: Props = $props();

	const tabs: { id: FilterTab; label: string }[] = [
		{ id: 'all', label: 'All Items' },
		{ id: 'low_stock', label: 'Low Stock' },
		{ id: 'out', label: 'Out' }
	];

	let bulkOpen = $state(false);

	function setTab(tab: FilterTab) {
		filter.tab = tab;
		onFilterChange?.(filter);
	}

	function setCategory(e: Event) {
		const val = (e.currentTarget as HTMLSelectElement).value;
		filter.category = val === 'all' ? null : val;
		onFilterChange?.(filter);
	}

	function setWarehouse(e: Event) {
		const val = (e.currentTarget as HTMLSelectElement).value;
		filter.warehouseId = val === 'all' ? null : Number(val); // number sesuai types.ts baru
		onFilterChange?.(filter);
	}

	function handleReset() {
		filter.search = '';
		filter.category = null;
		filter.warehouseId = null; // number | null
		filter.dateRange = null;
		filter.tab = 'all';
		onFilterChange?.(filter);
	}

	function handleBulkAction(actionId: string) {
		bulkOpen = false;
		onBulkAction?.(actionId);
	}

	function handleOutsideClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.bulk-action-wrapper')) {
			bulkOpen = false;
		}
	}
</script>

<svelte:window onclick={handleOutsideClick} />

<div class={cn('flex flex-col gap-3', className)}>
	<!-- Row 1: Search + Tabs -->
	<div class="flex items-center gap-3">
		<!-- Search -->
		<div class="flex-1">
			<Input
				type="search"
				bind:value={filter.search}
				placeholder="Fast search by SKU, Product Name, or Batch Number..."
				oninput={() => onFilterChange?.(filter)}
			/>
		</div>

		<!-- Tabs -->
		<div class="flex items-center rounded-lg border border-artisan-border bg-white p-0.5">
			{#each tabs as tab (tab.id)}
				<button
					type="button"
					onclick={() => setTab(tab.id)}
					class={cn(
						'rounded-md px-4 py-1.5 text-sm font-medium transition-all',
						filter.tab === tab.id
							? 'bg-artisan-primary text-artisan-white shadow-sm'
							: 'text-artisan-muted hover:text-artisan-dark'
					)}
				>
					{tab.label}
				</button>
			{/each}
		</div>
	</div>

	<!-- Row 2: Filters + Bulk Action -->
	<div class="flex items-center justify-between gap-3">
		<!-- Filter controls kiri -->
		<div class="flex items-center gap-2">
			<!-- All Categories -->
			<select
				value={filter.category ?? 'all'}
				onchange={setCategory}
				class="h-9 rounded-lg border border-artisan-border bg-white px-3 text-sm text-artisan-dark transition-all outline-none focus:border-artisan-muted focus:ring-2 focus:ring-artisan-active/20"
			>
				<option value="all">All Categories</option>
				{#each categories as cat (cat)}
					<option value={cat}>{cat}</option>
				{/each}
			</select>

			<!-- Warehouse — value pakai number sesuai WarehouseId: number | null -->
			<select
				value={filter.warehouseId ?? 'all'}
				onchange={setWarehouse}
				class="h-9 rounded-lg border border-artisan-border bg-white px-3 text-sm text-artisan-dark transition-all outline-none focus:border-artisan-muted focus:ring-2 focus:ring-artisan-active/20"
			>
				<option value="all">Warehouse: All</option>
				{#each warehouses as wh (wh.id)}
					<option value={wh.id}>Warehouse: {wh.name}</option>
				{/each}
			</select>

			<!-- Reset -->
			<button
				type="button"
				onclick={handleReset}
				class="flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-artisan-muted transition-colors hover:bg-artisan-sidebar hover:text-artisan-dark"
			>
				<RotateCcw size={13} />
				Reset
			</button>
		</div>

		<!-- Kanan: Bulk Action + Export -->
		<div class="flex items-center gap-2">
			<!-- Bulk Action dropdown -->
			<div class="bulk-action-wrapper relative">
				<button
					type="button"
					onclick={() => (bulkOpen = !bulkOpen)}
					disabled={selectedCount === 0}
					class={cn(
						'flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-medium transition-all',
						selectedCount > 0
							? 'bg-artisan-primary text-artisan-white hover:bg-artisan-dark'
							: 'cursor-not-allowed bg-artisan-primary/40 text-artisan-white/70'
					)}
				>
					Bulk Action
					{#if selectedCount > 0}
						<span class="rounded-md bg-white/20 px-1.5 py-0.5 text-xs">
							{selectedCount}
						</span>
					{/if}
					<ChevronDown size={14} class={cn('transition-transform', bulkOpen && 'rotate-180')} />
				</button>

				{#if bulkOpen && selectedCount > 0}
					<div
						class="absolute top-full right-0 z-50 mt-1 w-44 overflow-hidden rounded-lg border border-artisan-border bg-white shadow-lg"
					>
						{#each bulkActions as action (action.id)}
							<button
								type="button"
								onclick={() => handleBulkAction(action.id)}
								class={cn(
									'flex w-full items-center px-4 py-2.5 text-left text-sm transition-colors hover:bg-artisan-sidebar',
									action.destructive ? 'text-red-500 hover:bg-red-50' : 'text-artisan-dark'
								)}
							>
								{action.label}
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Export button -->
			<button
				type="button"
				onclick={onExport}
				aria-label="Export"
				class="flex size-9 items-center justify-center rounded-lg border border-artisan-border bg-white text-artisan-muted transition-colors hover:bg-artisan-sidebar hover:text-artisan-dark"
			>
				<Download size={15} />
			</button>
		</div>
	</div>
</div>
