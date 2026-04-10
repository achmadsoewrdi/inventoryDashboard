<script lang="ts">
	import type { ProductDetail } from '$lib/types/types';
	import { Info } from 'lucide-svelte';
	import Badge from '$lib/components/global/Badge.svelte';

	interface Props {
		product: ProductDetail;
	}

	let { product }: Props = $props();

	const FormatRupiah = (angka: number) => {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(angka);
	};
</script>

<div class="flex h-full flex-col rounded-xl border border-artisan-border bg-white shadow-sm">
	<div class="flex items-center justify-between border-b border-artisan-border/60 px-5 py-4">
		<div class="flex items-center gap-2">
			<Info class="h-4 w-4 text-artisan-muted" />
			<h2 class="text-sm font-semibold text-artisan-dark">Informasi Dasar</h2>
		</div>
		<Badge status={product.status} />
	</div>

	<div class="flex flex-col p-5">
		<div class="mb-6">
			<h3 class="text-2xl font-bold tracking-tight text-artisan-dark">
				{product.name}
			</h3>
			<p class="mt-1 text-sm text-artisan-muted">
				{product.category?.name ?? 'Kategori'} - {product.category?.subCategory ?? 'SubKategori'}
			</p>
		</div>

		<div class="flex flex-col gap-4 border-b border-artisan-border/60 pb-6">
			<div class="flex justify-between text-sm">
				<span class="text-artisan-muted">SKU / ID</span>
				<span class="font-mono font-semibold text-artisan-dark">{product.sku}</span>
			</div>
			<div class="flex justify-between text-sm">
				<span class="text-artisan-muted">Kategori</span>
				<span class="font-semibold text-artisan-dark">{product.category?.name ?? 'Kategori'}</span>
			</div>
			<div class="flex justify-between text-sm">
				<span class="text-artisan-muted">Harga Dasar</span>
				<span class="font-semibold text-artisan-dark">{FormatRupiah(product.basePrice)}</span>
			</div>
			<div class="flex justify-between text-sm">
				<span class="text-artisan-muted">Harga Jual</span>
				<span class="font-semibold text-artisan-dark">
					{FormatRupiah(product.salePrice ?? product.basePrice)}
				</span>
			</div>
		</div>

		<div class="mt-6 flex-1">
			<p class="mb-2 text-[10px] font-bold tracking-[0.15em] text-artisan-muted/70 uppercase">
				DESKRIPSI
			</p>
			<p class="text-sm leading-relaxed text-artisan-dark/80">
				{product.description || 'Tidak ada deskripsi untuk produk ini.'}
			</p>
		</div>
	</div>
</div>
