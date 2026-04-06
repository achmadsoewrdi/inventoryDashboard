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

	// Format angka jadi currency display
	function formatCurrency(val: number) {
		return val.toFixed(2);
	}

	function handleBasePriceInput(e: Event) {
		const raw = (e.currentTarget as HTMLInputElement).value;
		basePrice = parseFloat(raw) || 0;
	}

	function handleSalePriceInput(e: Event) {
		const raw = (e.currentTarget as HTMLInputElement).value;
		salePrice = parseFloat(raw) || 0;
	}
</script>

<div class={cn('rounded-xl border border-slate-200 bg-[#E0E4D9] p-6', className)}>
	<!-- Section Title -->
	<div class="mb-5 flex items-center gap-2">
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="text-artisan-dark">
			<rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5" />
			<path d="M2 10h20" stroke="currentColor" stroke-width="1.5" />
		</svg>
		<h2 class="text-sm font-semibold text-slate-700">Value & Stock</h2>
	</div>

	<!-- Base Price + Sale Price -->
	<div class="mb-5 grid grid-cols-2 gap-4">
		<!-- Base Price -->
		<div class="flex flex-col gap-1.5">
			<span class="text-[11px] font-semibold tracking-widest text-[#5C5C55] uppercase">
				Base Price
			</span>
			<div class="flex items-baseline gap-1">
				<span class="text-lg font-semibold text-[#5C5C55]">$</span>
				<input
					type="number"
					min="0"
					step="0.01"
					value={formatCurrency(basePrice)}
					oninput={handleBasePriceInput}
					class="w-full [appearance:textfield] bg-transparent text-2xl font-bold text-slate-800 outline-none placeholder:text-slate-300 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
					placeholder="0.00"
				/>
			</div>
		</div>

		<!-- Sale Price -->
		<div class="flex flex-col gap-1.5">
			<span class="text-[11px] font-semibold tracking-widest text-[#5C5C55] uppercase">
				Sale Price
			</span>
			<div class="flex items-baseline gap-1">
				<span class="text-lg font-semibold text-[#5C5C55]">$</span>
				<input
					type="number"
					min="0"
					step="0.01"
					value={formatCurrency(salePrice)}
					oninput={handleSalePriceInput}
					class="w-full [appearance:textfield] bg-transparent text-2xl font-bold text-slate-800 outline-none placeholder:text-slate-300 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
					placeholder="0.00"
				/>
			</div>
		</div>
	</div>

	<div class="flex flex-col gap-4 border-t border-slate-200 pt-5">
		<!-- Current Inventory -->
		<div class="flex items-center justify-between">
			<span class="text-sm text-slate-600">Current Inventory</span>
			<input
				type="number"
				min="0"
				step="1"
				bind:value={currentStock}
				class="w-20 [appearance:textfield] rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-center text-sm font-semibold text-slate-800 transition-all outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
			/>
		</div>

		<!-- Stock Threshold -->
		<div class="flex items-center justify-between">
			<span class="text-sm text-slate-600">Stock Threshold</span>
			<input
				type="number"
				min="0"
				step="1"
				bind:value={stockThreshold}
				class="w-20 [appearance:textfield] rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-center text-sm font-semibold text-slate-800 transition-all outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
			/>
		</div>
	</div>
</div>
