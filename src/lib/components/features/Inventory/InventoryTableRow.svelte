<script lang="ts">
	import type { InventoryItem } from '$lib/types/types';
	import Badge from '$lib/components/global/Badge.svelte';
	import Chekbox from '$lib/components/global/Chekbox.svelte';
	import { EllipsisVertical, Pencil, Trash2, Eye } from 'lucide-svelte';
	import { cn } from '$lib/utils/cn';

	interface Props {
		item: InventoryItem;
		selected?: boolean;
		onToggleSelection?: (id: number) => void;
		onView?: (item: InventoryItem) => void;
		onEdit?: (item: InventoryItem) => void;
		onDelete?: (item: InventoryItem) => void;
		onHistory?: (item: InventoryItem) => void;
	}

	let { item, selected = false, onToggleSelection, onView, onEdit, onDelete }: Props = $props();

	let menuOpen = $state(false);
	let btnEl = $state<HTMLButtonElement | null>(null);
	let menuPos = $state({ top: 0, left: 0 });

	function handleSelection() {
		onToggleSelection?.(item.id);
	}

	function toggleMenu(e: MouseEvent) {
		e.stopPropagation();

		if (!menuOpen && btnEl) {
			// Hitung posisi button relatif ke viewport
			const rect = btnEl.getBoundingClientRect();
			menuPos = {
				top: rect.bottom + window.scrollY + 4,
				left: rect.right + window.scrollX - 160 // 160 = lebar menu (w-40)
			};
		}

		menuOpen = !menuOpen;
	}

	function handleAction(fn?: () => void) {
		menuOpen = false;
		fn?.();
	}

	function handleOutsideClick(e: MouseEvent) {
		if (btnEl && !btnEl.contains(e.target as Node)) {
			menuOpen = false;
		}
	}
</script>

<svelte:window onclick={handleOutsideClick} />

<!-- Dropdown dirender di luar table pakai fixed position via style -->
{#if menuOpen}
	<div
		role="menu"
		style="position: fixed; top: {menuPos.top}px; left: {menuPos.left}px; z-index: 9999;"
		class="w-40 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg"
	>
		<button
			type="button"
			onclick={() => handleAction(() => onView?.(item))}
			class="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
		>
			<Eye size={14} class="text-slate-400" />
			View Detail
		</button>

		<button
			type="button"
			onclick={() => handleAction(() => onEdit?.(item))}
			class="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
		>
			<Pencil size={14} class="text-slate-400" />
			Edit
		</button>

		<div class="mx-3 border-t border-slate-100"></div>

		<button
			type="button"
			onclick={() => handleAction(() => onDelete?.(item))}
			class="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-red-500 transition-colors hover:bg-red-50"
		>
			<Trash2 size={14} />
			Delete
		</button>
	</div>
{/if}

<tr class="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50">
	<!-- Checkbox -->
	<td class="w-12 p-4 text-center">
		<Chekbox checked={selected} onChange={handleSelection} />
	</td>

	<!-- Product Info -->
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
					>
						<rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
						<circle cx="9" cy="9" r="2" />
						<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
					</svg>
				</div>
			{/if}
			<div>
				<div class="font-medium text-slate-900">{item.name}</div>
			</div>
		</div>
	</td>

	<!-- SKU -->
	<td class="p-4 text-sm text-slate-600">
		{item.sku}
	</td>

	<!-- Category -->
	<td class="p-4 text-sm text-slate-600">
		<div>{item.category}</div>
		<div class="text-xs text-slate-400">{item.subCategory}</div>
	</td>

	<!-- Stock -->
	<td class="p-4">
		<div class="flex items-center gap-2">
			<span class="text-sm font-medium text-slate-900">{item.currentStock}</span>
			<span class="text-xs text-slate-500">/ {item.stockThreshold}</span>
		</div>
	</td>

	<!-- Status -->
	<td class="p-4">
		<Badge status={item.status} />
	</td>

	<!-- Actions -->
	<td class="p-4 text-center">
		<button
			bind:this={btnEl}
			type="button"
			onclick={toggleMenu}
			class={cn(
				'rounded-lg p-2 transition-colors hover:bg-slate-100 hover:text-slate-700',
				menuOpen ? 'bg-slate-100 text-slate-700' : 'text-slate-400'
			)}
			aria-label="Row actions"
		>
			<EllipsisVertical size={16} />
		</button>
	</td>
</tr>
