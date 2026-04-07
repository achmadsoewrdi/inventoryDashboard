<script lang="ts">
	import type { CreateProductForm } from '$lib/types/types';
	import { cn } from '$lib/utils/cn';

	interface Props {
		basePrice: CreateProductForm['basePrice'];
		salePrice: CreateProductForm['salePrice'];
		currentStock: CreateProductForm['currentStock'];
		stockThreshold: CreateProductForm['stockThreshold'];
		class?: string;
	}

	let {
		basePrice = $bindable(0),
		salePrice = $bindable(0),
		currentStock = $bindable(0),
		stockThreshold = $bindable(10),
		class: className = ''
	}: Props = $props();

	// format rupiah buat display di input text
	function formatRupiah(val: number) {
		return new Intl.NumberFormat('id-ID').format(val);
	}

	// pas user ngetik, stripping non-digit dulu baru parse
	function parseRupiah(raw: string): number {
		return parseInt(raw.replace(/\D/g, '')) || 0;
	}

	// state display string buat input text
	let basePriceDisplay = $state(formatRupiah(basePrice));
	let salePriceDisplay = $state(formatRupiah(salePrice));

	function handleBasePriceInput(e: Event) {
		const raw = (e.currentTarget as HTMLInputElement).value;
		basePrice = parseRupiah(raw);
		basePriceDisplay = formatRupiah(basePrice);
	}

	function handleSalePriceInput(e: Event) {
		const raw = (e.currentTarget as HTMLInputElement).value;
		salePrice = parseRupiah(raw);
		salePriceDisplay = formatRupiah(salePrice);
	}
</script>

<div class={cn('rounded-xl border border-artisan-border bg-white p-6', className)}>
	<!-- Section Title -->
	<div class="mb-5 flex items-center gap-2">
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="text-artisan-dark">
			<rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5" />
			<path d="M2 10h20" stroke="currentColor" stroke-width="1.5" />
		</svg>
		<h2 class="text-sm font-semibold text-artisan-dark">Value & Stock</h2>
	</div>

	<!-- Base Price + Sale Price -->
	<div class="mb-5 grid grid-cols-2 gap-4">
		<!-- Base Price -->
		<div class="flex flex-col gap-1.5">
			<span class="text-[11px] font-semibold tracking-widest text-artisan-muted uppercase">
				Base Price
			</span>
			<div class="flex items-baseline gap-1">
				<span class="text-lg font-semibold text-artisan-dark">Rp</span>
				<input
					type="text"
					inputmode="numeric"
					value={basePriceDisplay}
					oninput={handleBasePriceInput}
					class="w-full bg-transparent text-2xl font-bold text-artisan-dark outline-none placeholder:text-artisan-muted/50"
					placeholder="0"
				/>
			</div>
		</div>

		<!-- Sale Price -->
		<div class="flex flex-col gap-1.5">
			<span class="text-[11px] font-semibold tracking-widest text-artisan-muted uppercase">
				Sale Price
			</span>
			<div class="flex items-baseline gap-1">
				<span class="text-lg font-semibold text-artisan-dark">Rp</span>
				<input
					type="text"
					inputmode="numeric"
					value={salePriceDisplay}
					oninput={handleSalePriceInput}
					class="w-full bg-transparent text-2xl font-bold text-artisan-dark outline-none placeholder:text-artisan-muted/50"
					placeholder="0"
				/>
			</div>
		</div>
	</div>

	<div class="flex flex-col gap-4 border-t border-artisan-border/40 pt-5">
		<!-- Current Inventory -->
		<div class="flex items-center justify-between">
			<span class="text-sm text-artisan-dark">Current Inventory</span>
			<input
				type="number"
				min="0"
				step="1"
				bind:value={currentStock}
				class="w-20 [appearance:textfield] rounded-lg border border-artisan-border bg-white px-3 py-1.5 text-center text-sm font-semibold text-artisan-dark transition-all outline-none focus:border-artisan-muted focus:ring-2 focus:ring-artisan-active/20 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
			/>
		</div>

		<!-- Stock Threshold -->
		<div class="flex items-center justify-between">
			<span class="text-sm text-artisan-dark">Stock Threshold</span>
			<input
				type="number"
				min="0"
				step="1"
				bind:value={stockThreshold}
				class="w-20 [appearance:textfield] rounded-lg border border-artisan-border bg-white px-3 py-1.5 text-center text-sm font-semibold text-artisan-dark transition-all outline-none focus:border-artisan-muted focus:ring-2 focus:ring-artisan-active/20 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
			/>
		</div>
	</div>
</div>
