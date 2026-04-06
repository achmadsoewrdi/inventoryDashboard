<script lang="ts">
	import Input from '$lib/components/global/Input.svelte';
	import type { CreateProductForm } from '$lib/types/types';
	import { cn } from '$lib/utils/cn';

	interface Props {
		// Hanya ambil field yang relevan dari CreateProductForm
		name: CreateProductForm['name'];
		sku: CreateProductForm['sku'];
		description: CreateProductForm['description'];
		class?: string;
	}

	let {
		name = $bindable(''),
		sku = $bindable(''),
		description = $bindable(''),
		class: className = ''
	}: Props = $props();
</script>

<div class={cn('rounded-xl border border-slate-200 bg-white p-6', className)}>
	<!-- Section Title -->
	<div class="mb-6 flex items-center gap-2">
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="text-slate-400">
			<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" />
			<path d="M12 8v4M12 16v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
		</svg>
		<h2 class="text-sm font-semibold text-slate-700">Basic Information</h2>
	</div>

	<!-- Product Name + SKU -->
	<div class="mb-4 grid grid-cols-2 gap-4">
		<div class="flex flex-col gap-1.5">
			<label
				for="product-name"
				class="text-[11px] font-semibold tracking-widest text-slate-400 uppercase"
			>
				Product Name
			</label>
			<Input
				id="product-name"
				bind:value={name}
				placeholder="e.g. Hand-Carved Oak Chair"
				size="md"
			/>
		</div>

		<div class="flex flex-col gap-1.5">
			<label for="sku" class="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
				SKU / Identifier
			</label>
			<Input id="sku" bind:value={sku} placeholder="ART-OK-001" size="md" />
		</div>
	</div>

	<!-- Description -->
	<div class="flex flex-col gap-1.5">
		<label
			for="description"
			class="text-[11px] font-semibold tracking-widest text-slate-400 uppercase"
		>
			Description & Notes
		</label>
		<textarea
			id="description"
			bind:value={description}
			placeholder="Detailed product specifications, material origin, and handling instructions..."
			rows={5}
			class="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 transition-all outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
		></textarea>
	</div>
</div>
