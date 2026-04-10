<script module>
	// Shared across all row instances — hanya satu menu yang boleh terbuka
	let activeItemId = $state<number | null>(null);
</script>

<script lang="ts">
	import type { InventoryItem } from '$lib/types/types';
	import Badge from '$lib/components/global/Badge.svelte';
	import Chekbox from '$lib/components/global/Chekbox.svelte';
	import { EllipsisVertical, Pencil, Trash2, Eye } from 'lucide-svelte';
	import { cn } from '$lib/utils/cn';

	interface Props {
		item: InventoryItem;
		selected?: boolean;
		isAdmin: boolean; // [TAMBAHKAN INI] Agar sinkron dengan parent
		onToggleSelection?: (id: number) => void;
		onView?: (item: InventoryItem) => void;
		onEdit?: (item: InventoryItem) => void;
		onDelete?: (item: InventoryItem) => void;
		onHistory?: (item: InventoryItem) => void;
	}

	// [TAMBAHKAN isAdmin] di destructuring props
	let {
		item,
		selected = false,
		isAdmin = false,
		onToggleSelection,
		onView,
		onEdit,
		onDelete
	}: Props = $props();

	let menuOpen = $derived(activeItemId === item.id);
	let btnEl = $state<HTMLButtonElement | null>(null);
	let menuPos = $state({ top: 0, left: 0 });

	function handleSelection() {
		onToggleSelection?.(item.id);
	}

	function toggleMenu(e: MouseEvent) {
		e.stopPropagation();

		if (activeItemId === item.id) {
			activeItemId = null;
		} else {
			if (btnEl) {
				const rect = btnEl.getBoundingClientRect();
				menuPos = {
					top: rect.bottom + window.scrollY + 4,
					left: rect.right + window.scrollX - 160
				};
			}
			activeItemId = item.id;
		}
	}

	function handleAction(fn?: () => void) {
		activeItemId = null; // Tutup menu setelah aksi dipilih
		fn?.();
	}

	function handleOutsideClick(e: MouseEvent) {
		if (activeItemId === item.id && btnEl && !btnEl.contains(e.target as Node)) {
			activeItemId = null;
		}
	}
</script>

<svelte:window onclick={handleOutsideClick} />

{#if menuOpen}
	<div
		role="menu"
		style="position: fixed; top: {menuPos.top}px; left: {menuPos.left}px; z-index: 9999;"
		class="w-40 overflow-hidden rounded-lg border border-artisan-border bg-white shadow-lg"
	>
		<button
			type="button"
			onclick={() => handleAction(() => onView?.(item))}
			class="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-artisan-dark transition-colors hover:bg-artisan-sidebar"
		>
			<Eye size={14} class="text-artisan-muted" />
			View Detail
		</button>

		<button
			type="button"
			onclick={() => handleAction(() => onEdit?.(item))}
			class="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-artisan-dark transition-colors hover:bg-artisan-sidebar"
		>
			<Pencil size={14} class="text-artisan-muted" />
			Edit
		</button>

		{#if isAdmin}
			<div class="mx-3 border-t border-artisan-border"></div>

			<button
				type="button"
				onclick={() => handleAction(() => onDelete?.(item))}
				class="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-red-500 transition-colors hover:bg-red-50"
			>
				<Trash2 size={14} />
				Delete
			</button>
		{/if}
	</div>
{/if}

<tr class="border-b border-artisan-border/50 transition-colors last:border-b-0 hover:bg-artisan-bg">
	<td class="w-12 p-4 text-center">
		<Chekbox checked={selected} onChange={handleSelection} />
	</td>

	<td class="p-4">
		<div class="flex items-center gap-3">
			{#if item.imageUrl}
				<img
					src={item.imageUrl}
					alt={item.name}
					class="h-10 w-10 rounded-md bg-artisan-sidebar object-cover"
				/>
			{:else}
				<div
					class="flex h-10 w-10 items-center justify-center rounded-md bg-artisan-sidebar text-artisan-muted"
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
						><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle
							cx="9"
							cy="9"
							r="2"
						/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg
					>
				</div>
			{/if}
			<div>
				<div class="font-medium text-artisan-dark">{item.name}</div>
			</div>
		</div>
	</td>

	<td class="p-4 text-sm text-artisan-muted">{item.sku}</td>

	<td class="p-4 text-sm text-artisan-dark">
		<div>{item.category}</div>
		<div class="text-xs text-artisan-muted">{item.subCategory}</div>
	</td>

	<td class="p-4">
		<div class="flex items-center gap-2">
			<span class="text-sm font-medium text-artisan-dark">{item.currentStock}</span>
			<span class="text-xs text-artisan-muted">/ {item.stockThreshold}</span>
		</div>
	</td>

	<td class="p-4">
		<Badge status={item.status} />
	</td>

	<td class="p-4 text-center">
		<button
			bind:this={btnEl}
			type="button"
			onclick={toggleMenu}
			class={cn(
				'rounded-lg p-2 transition-colors hover:bg-artisan-sidebar hover:text-artisan-dark',
				menuOpen ? 'bg-artisan-sidebar text-artisan-dark' : 'text-artisan-muted'
			)}
			aria-label="Row actions"
		>
			<EllipsisVertical size={16} />
		</button>
	</td>
</tr>
