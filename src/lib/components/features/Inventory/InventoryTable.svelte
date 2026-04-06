<script lang="ts">
	import Pagination from '$lib/components/global/Pagination.svelte';
	import type { InventoryItem } from '$lib/types/types';
	import InventoryTableRow from './InventoryTableRow.svelte';
	import Chekbox from '$lib/components/global/Chekbox.svelte';

	interface Props {
		items: InventoryItem[];
	}

	let { items }: Props = $props();

	let selectedId = $state<number[]>([]);
	let currentPage = $state(1);
	let itemsPerPage = 5;

	// Pagination logic
	let totalPages = $derived(Math.ceil(items.length / itemsPerPage));
	let paginatedItems = $derived(
		items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
	);

	// logic select All
	let isAllSelected = $derived(items.length > 0 && selectedId.length === items.length);
	let isIndeterminate = $derived(selectedId.length > 0 && selectedId.length < items.length);

	function toggleSelectAll() {
		if (isAllSelected) {
			selectedId = [];
		} else {
			selectedId = items.map((item) => item.id);
		}
	}

	function toggleItemSelection(id: number) {
		if (selectedId.includes(id)) {
			selectedId = selectedId.filter((itemId) => itemId !== id);
		} else {
			selectedId = [...selectedId, id];
		}
	}

	function handlePageChange(page: number) {
		currentPage = page;
	}
</script>

<div class="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
	<div class="border-b border-slate-100 p-4">
		<h3 class="text-sm font-semibold tracking-wider text-slate-800 uppercase">
			Master Inventory <span class="ml-1 font-normal text-slate-400 normal-case"
				>{items.length}</span
			>
		</h3>
	</div>

	<div class="overflow-x-auto">
		<table class="w-full border-collapse text-left">
			<thead class="bg-slate-50/50">
				<tr class="border-b border-slate-100">
					<th class="w-12 p-4 text-center">
						<Chekbox
							checked={isAllSelected}
							indeterminate={isIndeterminate}
							onChange={toggleSelectAll}
						/>
					</th>
					<th class="p-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">
						Product
					</th>
					<th class="p-4 text-xs font-semibold tracking-wider text-slate-500 uppercase"> SKU </th>
					<th class="p-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">
						Category
					</th>
					<th class="p-4 text-xs font-semibold tracking-wider text-slate-500 uppercase"> Stock </th>
					<th class="p-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">
						Status
					</th>
					<th class="p-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">
						Location
					</th>
					<th class="p-4 text-right text-xs font-semibold tracking-wider text-slate-500 uppercase">
						Actions
					</th>
				</tr>
			</thead>
			<tbody>
				{#each paginatedItems as item (item.id)}
					<InventoryTableRow
						{item}
						selected={selectedId.includes(item.id)}
						onToggleSelection={toggleItemSelection}
					/>
				{:else}
					<tr>
						<td colspan="8" class="p-8 text-center text-slate-400"> No items found </td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Pagination Footer -->
	{#if items.length > itemsPerPage}
		<div class="border-t border-slate-100 bg-slate-50/10 p-4">
			<Pagination
				bind:currentPage
				{totalPages}
				totalItems={items.length}
				perPage={itemsPerPage}
				onPageChange={handlePageChange}
			/>
		</div>
	{/if}
</div>
