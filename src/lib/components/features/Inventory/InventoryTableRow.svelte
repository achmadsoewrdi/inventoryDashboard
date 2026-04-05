<script lang="ts">
	import type { InventoryItem } from '$lib/types/types';
	import Badge from '$lib/components/global/Badge.svelte';

	interface Props {
		item: InventoryItem;
		selected?: boolean;
		onToggleSelection?: (id: number) => void;
	}

	let { item, selected = false, onToggleSelection }: Props = $props();

	function handleSelection() {
		if (onToggleSelection) {
			onToggleSelection(item.id);
		}
	}
</script>

<tr class="border-b border-slate-100 pb-2 transition-colors last:border-b-0 hover:bg-slate-50">
	<!-- Checkbox Column -->
	<td class="w-12 p-4 text-center">
		<input
			type="checkbox"
			checked={selected}
			onchange={handleSelection}
			class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
		/>
	</td>

	<!-- Product Info Column -->
	<td class="p-4">
		<div class="flex items-center gap-3">
			{#if item.imageUrl}
				<img
					src={item.imageUrl}
					alt={item.name}
					class="h-10 w-10 rounded-md bg-slate-100 object-cover"
				/>
			{:else}
				<div
					class="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-400"
				>
					<!-- Fallback icon (can use lucide-svelte here) -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="opacity-50"
						><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle
							cx="9"
							cy="9"
							r="2"
						/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg
					>
				</div>
			{/if}
			<div>
				<div class="font-medium text-slate-900">{item.name}</div>
				<div class="text-xs text-slate-500">SKU: {item.sku}</div>
			</div>
		</div>
	</td>

	<!-- Category Column -->
	<td class="p-4 text-sm text-slate-600">
		<div>{item.category}</div>
		<div class="text-xs text-slate-400">{item.subCategory}</div>
	</td>

	<!-- Stock Column -->
	<td class="p-4">
		<div class="flex items-center gap-2">
			<span class="text-sm font-medium text-slate-900">{item.currentStock}</span>
			<span class="text-xs text-slate-500">/ {item.stockThreshold}</span>
		</div>
	</td>

	<!-- Status Column -->
	<td class="p-4">
		<Badge status={item.status} />
	</td>

	<!-- Location Column -->
	<td class="p-4 text-sm text-slate-600">
		{#if item.location}
			<span>{item.location.warehouse}</span>
			<span class="block text-xs text-slate-400">{item.location.aisle}, {item.location.shelf}</span>
		{:else}
			<span class="text-slate-400 italic">Not Assigned</span>
		{/if}
	</td>

	<!-- Actions Column (can be expanded later) -->
	<td class="p-4 text-right">
		<button class="p-2 text-slate-400 transition-colors hover:text-slate-600">
			<!-- Three dots 'more options' icon -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle
					cx="12"
					cy="19"
					r="1"
				/></svg
			>
		</button>
	</td>
</tr>
