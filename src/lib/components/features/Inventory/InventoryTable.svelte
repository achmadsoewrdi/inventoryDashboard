<script lang="ts">
	import type { InventoryItem } from '$lib/types/types';
	import InventoryTableRow from './InventoryTableRow.svelte';
	import Chekbox from '$lib/components/global/Chekbox.svelte';
	import Button from '$lib/components/global/Button.svelte';

	interface Props {
		items: InventoryItem[];
		selectedIds?: Set<number>;
		onToggleSelection?: (id: number) => void;
		onSelectAll?: (checked: boolean) => void;
		onEdit?: (item: InventoryItem) => void;
		onDelete?: (id: number) => void;
	}

	let {
		items,
		selectedIds = new Set(),
		onToggleSelection,
		onSelectAll,
		onEdit,
		onDelete
	}: Props = $props();

	// logic select All
	let isAllSelected = $derived(items.length > 0 && selectedIds.size === items.length);
	let isIndeterminate = $derived(selectedIds.size > 0 && selectedIds.size < items.length);

	function toggleSelectAll() {
		onSelectAll?.(!isAllSelected);
	}

	function toggleItemSelection(id: number) {
		onToggleSelection?.(id);
	}
</script>

<div class="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
	<div class="flex items-center justify-between border-b border-slate-100 p-4">
		<h3 class="text-sm font-semibold tracking-wider text-slate-800 uppercase">
			Master Inventory List <span class="ml-1 font-normal text-slate-400 normal-case"
				>({items.length} items)</span
			>
		</h3>
		<Button size="sm">Tambah Item</Button>
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
				{#each items as item (item.id)}
					<InventoryTableRow
						{item}
						selected={selectedIds.has(item.id)}
						onToggleSelection={toggleItemSelection}
						onEdit={onEdit}
						onDelete={(item) => onDelete?.(item.id)}
					/>
				{:else}
					<tr>
						<td colspan="8" class="p-8 text-center text-slate-400"> No items found </td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
