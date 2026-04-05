<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { StockStatus } from '$lib/types/types';

	interface Props {
		status: StockStatus;
		class?: string;
	}

	let { status, class: classname = '' }: Props = $props();

	const config: Record<StockStatus, { label: string; class: string }> = {
		'IN STOCK': {
			label: 'In Stock',
			class: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
		},
		'LOW STOCK': {
			label: 'Low Stock',
			class: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
		},
		'OUT OF STOCK': {
			label: 'Out',
			class: 'bg-red-50 text-red-500 ring-1 ring-red-200'
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
