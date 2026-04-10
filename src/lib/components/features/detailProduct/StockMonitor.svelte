<script lang="ts">
	import { TrendingUp, AlertCircle, PackagePlus } from 'lucide-svelte';
	import Button from '$lib/components/global/Button.svelte';
	import { cn } from '$lib/utils/cn';

	interface Props {
		currentStock: number;
		stockThreshold: number;
		onRestock?: () => void;
	}

	let { currentStock, stockThreshold, onRestock }: Props = $props();

	// Logika untuk menentukan apakah stok sedang kritis (di bawah atau pas threshold)
	let isLowStock = $derived(currentStock <= stockThreshold);
</script>

<div class="flex flex-col rounded-xl border border-artisan-border bg-white shadow-sm">
	<div class="flex items-center gap-2 border-b border-artisan-border/60 px-5 py-4">
		<TrendingUp class="h-4 w-4 text-artisan-muted" />
		<h2 class="text-sm font-semibold text-artisan-dark">Stock Monitoring</h2>
	</div>

	<div class="p-5">
		<div class="mb-5 grid grid-cols-2 gap-4">
			<div
				class={cn(
					'flex flex-col items-center justify-center rounded-xl border py-4 transition-colors',
					isLowStock ? 'border-amber-100 bg-amber-50/50' : 'border-green-100/50 bg-green-50/30'
				)}
			>
				<p class="text-[10px] font-bold tracking-widest text-artisan-dark/70 uppercase">Current</p>
				<p
					class={cn(
						'my-1 text-5xl font-bold tracking-tight',
						isLowStock ? 'text-amber-600' : 'text-green-600'
					)}
				>
					{currentStock}
				</p>
				<p class="text-[11px] font-medium text-artisan-muted">Unit Tersedia</p>
			</div>

			<div
				class="flex flex-col items-center justify-center rounded-xl border border-red-100/50 bg-red-50/30 py-4"
			>
				<p class="text-[10px] font-bold tracking-widest text-artisan-dark/70 uppercase">
					Threshold
				</p>
				<p class="my-1 text-5xl font-bold tracking-tight text-red-500/90">
					{stockThreshold}
				</p>
				<p class="text-[11px] font-medium text-artisan-muted">Batas Minimum</p>
			</div>
		</div>

		{#if isLowStock}
			<div class="mb-5 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-amber-700">
				<AlertCircle class="mt-0.5 h-4 w-4 shrink-0" />
				<p class="text-xs leading-relaxed font-medium">
					Stok hampir habis! Segera lakukan pengadaan barang sebelum stok mencapai 0.
				</p>
			</div>
		{/if}

		<Button variant="primary" class="w-full" Icon={PackagePlus} onClick={onRestock}>
			Add Stock / Restock
		</Button>
	</div>
</div>
