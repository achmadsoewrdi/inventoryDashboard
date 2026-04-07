<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { StockStatus } from '$lib/types/types';

	interface Props {
		status: StockStatus;
		class?: string;
	}

	let { status, class: classname = '' }: Props = $props();

	const config: Record<StockStatus, { label: string; class: string }> = {
		'IN_STOCK': {
			label: 'In Stock',
			class: '[background-color:var(--color-status-in-stock-bg)] [color:var(--color-status-in-stock-text)] ring-1 ring-emerald-200'
		},
		'LOW_STOCK': {
			label: 'Low Stock',
			class: '[background-color:var(--color-status-low-bg)] [color:var(--color-status-low-text)] ring-1 ring-amber-200'
		},
		'OUT_OF_STOCK': {
			label: 'Out',
			class: '[background-color:var(--color-status-out-bg)] [color:var(--color-status-out-text)] ring-1 ring-red-200'
		}
	};

	const badge = $derived(config[status as StockStatus]);
</script>

<span
	class={cn(
		'inline-flex items-center justify-center rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase',
		badge.class,
		classname
	)}
>
	{badge.label}
</span>
