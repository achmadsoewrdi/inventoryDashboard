<script lang="ts">
	import type { ProductDetail } from '$lib/types/types';
	import { Warehouse } from 'lucide-svelte';

	interface Props {
		product: ProductDetail;
	}

	let { product }: Props = $props();
</script>

<div class="flex flex-col rounded-xl border border-artisan-border bg-white shadow-sm">
	<div class="flex items-center gap-2 border-b border-artisan-border/60 px-5 py-4">
		<Warehouse class="h-4 w-4 text-artisan-muted" />
		<h2 class="text-sm font-semibold text-artisan-dark">Warehouse Logistics</h2>
	</div>

	<div class="grid grid-cols-2 gap-x-4 gap-y-5 p-5">
		<div class="flex flex-col gap-1.5">
			<p class="text-[10px] font-bold tracking-[0.15em] text-artisan-muted uppercase">Suplier</p>
			<div
				class="rounded-lg border border-green-100/50 bg-green-50/30 px-3 py-2.5 text-sm font-medium text-artisan-dark"
			>
				{product.supplier?.name ?? 'Tidak ada data'}
			</div>
		</div>

		<div class="flex flex-col gap-1.5">
			<p class="text-[10px] font-bold tracking-[0.15em] text-artisan-muted uppercase">
				Lokasi Gudang
			</p>
			<div
				class="rounded-lg border border-green-100/50 bg-green-50/30 px-3 py-2.5 text-sm font-medium text-artisan-dark"
			>
				{product.location?.warehouse?.name ?? 'Tidak ada data'}
			</div>
		</div>

		<div class="flex flex-col gap-1.5">
			<p class="text-[10px] font-bold tracking-[0.15em] text-artisan-muted uppercase">
				Zona / Lorong
			</p>
			<div
				class="rounded-lg border border-green-100/50 bg-green-50/30 px-3 py-2.5 text-sm font-medium text-artisan-dark"
			>
				{product.location?.aisle ?? '-'}
			</div>
		</div>

		<div class="flex flex-col gap-1.5">
			<p class="text-[10px] font-bold tracking-[0.15em] text-artisan-muted uppercase">Nomor Rak</p>
			<div
				class="rounded-lg border border-green-100/50 bg-green-50/30 px-3 py-2.5 text-sm font-medium text-artisan-dark"
			>
				{product.location?.shelf ?? '-'}
			</div>
		</div>
	</div>
</div>
