<script lang="ts">
	import { goto } from '$app/navigation';
	import { env } from '$env/dynamic/public';
	import BasicInformationForm from '$lib/components/features/add-item/BasicInformationForm.svelte';
	import ProductMediaUpload from '$lib/components/features/add-item/ProductMediaUpload.svelte';
	import ValueAndStock from '$lib/components/features/add-item/ValueAndStock.svelte';
	import WarehouseLogistics from '$lib/components/features/add-item/WarehouseLogistics.svelte';
	import type { CreateProductForm } from '$lib/types/types';
	import { ArrowLeft, CheckCircle, AlertCircle, Loader } from 'lucide-svelte';
	import { showHeader } from '$lib/stores/layout';

	let { data } = $props();

	// Sembunyikan header layout saat halaman ini aktif
	$effect(() => {
		showHeader.set(false);
		return () => showHeader.set(true);
	});

	// ─── Form State ───
	let name = $state('');
	let sku = $state('');
	let description = $state('');
	let images = $state<CreateProductForm['images']>([]);
	let basePrice = $state(0);
	let salePrice = $state(0);
	let currentStock = $state(0);
	let stockThreshold = $state(10);
	let supplierId = $state<CreateProductForm['supplierId']>(null);
	let location = $state<CreateProductForm['location']>({
		warehouseId: null,
		aisle: '',
		shelf: ''
	});
	let categoryId = $state<number | null>(null);

	// ─── UI State ───
	let isSubmitting = $state(false);
	let submitError = $state<string | null>(null);
	let submitSuccess = $state(false);
	let errors = $state<Record<string, string>>({});

	function validate(): boolean {
		const e: Record<string, string> = {};
		if (!name.trim()) e.name = 'Product name is required';
		if (!sku.trim()) e.sku = 'SKU is required';
		if (basePrice <= 0) e.basePrice = 'Base price must be greater than 0';
		if (!categoryId) e.categoryId = 'Please select a category';
		if (!supplierId) e.supplierId = 'Please select a supplier';
		errors = e;
		return Object.keys(e).length === 0;
	}

	async function handleSubmit() {
		submitError = null;
		if (!validate()) return;
		isSubmitting = true;

		try {
			const body = {
				name: name.trim(),
				sku: sku.trim(),
				description: description.trim() || undefined,
				basePrice,
				salePrice: salePrice || basePrice,
				currentStock,
				stockThreshold,
				categoryId: categoryId!,
				supplierId: supplierId!,
				...(location.warehouseId
					? {
							location: {
								warehouseId: location.warehouseId,
								aisle: location.aisle,
								shelf: location.shelf
							}
						}
					: {})
			};

			const createRes = await fetch(`${env.PUBLIC_API_URL}/products`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});

			if (!createRes.ok) {
				const err = await createRes.json().catch(() => ({}));
				throw new Error(err?.message ?? `Gagal membuat produk (${createRes.status})`);
			}

			const created = await createRes.json();
			const productId: number = created.id;

			for (let i = 0; i < images.length; i++) {
				const formData = new FormData();
				formData.append('file', images[i]);
				await fetch(`${env.PUBLIC_API_URL}/products/${productId}/images?isPrimary=${i === 0}`, {
					method: 'POST',
					body: formData
				});
			}

			submitSuccess = true;
			setTimeout(() => goto('/inventory'), 1500);
		} catch (err: unknown) {
			submitError = err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title>Add New Item — Artisan Ops</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<!-- ─── Page Header ─── -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<a
				href="/inventory"
				class="flex size-8 items-center justify-center rounded-lg border border-artisan-border bg-white text-artisan-muted shadow-sm transition hover:border-artisan-muted hover:text-artisan-dark"
			>
				<ArrowLeft size={15} />
			</a>
			<div>
				<h1 class="text-xl font-bold tracking-tight text-artisan-dark">Add New Item</h1>
				<p class="text-sm text-artisan-muted">Tambah produk baru ke master inventory</p>
			</div>
		</div>

		<div class="flex items-center gap-2">
			<a
				href="/inventory"
				class="rounded-lg border border-artisan-border bg-white px-4 py-2 text-sm font-medium text-artisan-dark shadow-sm transition hover:bg-artisan-sidebar"
			>
				Batal
			</a>
			<button
				type="button"
				onclick={handleSubmit}
				disabled={isSubmitting || submitSuccess}
				class="flex items-center gap-2 rounded-lg bg-artisan-primary px-4 py-2 text-sm font-medium text-artisan-white shadow-sm transition hover:bg-artisan-dark disabled:cursor-not-allowed disabled:opacity-60"
			>
				{#if isSubmitting}
					<Loader size={14} class="animate-spin" />
					Menyimpan...
				{:else if submitSuccess}
					<CheckCircle size={14} />
					Tersimpan!
				{:else}
					Simpan Item
				{/if}
			</button>
		</div>
	</div>

	<!-- ─── Alerts ─── -->
	{#if submitError}
		<div
			class="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
		>
			<AlertCircle size={16} class="mt-0.5 shrink-0 text-red-500" />
			<span>{submitError}</span>
		</div>
	{/if}

	{#if Object.keys(errors).length > 0}
		<div
			class="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700"
		>
			<AlertCircle size={16} class="mt-0.5 shrink-0 text-amber-500" />
			<div>
				<p class="font-semibold">Harap lengkapi field berikut:</p>
				<ul class="mt-1 list-disc pl-4 leading-relaxed">
					{#each Object.entries(errors) as [key, msg] (key)}
						<li>{msg}</li>
					{/each}
				</ul>
			</div>
		</div>
	{/if}

	<!-- ─── Form Grid ─── -->
	<div class="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_380px]">
		<!-- Kolom Kiri -->
		<div class="flex flex-col gap-5">
			<BasicInformationForm bind:name bind:sku bind:description />
			<ProductMediaUpload bind:images />

			<!-- Category -->
			<div class="rounded-xl border border-artisan-border bg-white p-6 shadow-sm">
				<div class="mb-4 flex items-center gap-2">
					<svg width="15" height="15" viewBox="0 0 24 24" fill="none" class="text-artisan-muted">
						<path
							d="M4 6h16M4 12h10M4 18h7"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
					</svg>
					<h2 class="text-sm font-semibold text-artisan-dark">Category</h2>
				</div>
				<div class="flex flex-col gap-1.5">
					<label
						for="category"
						class="text-[11px] font-semibold tracking-widest text-artisan-muted uppercase"
					>
						Product Category
					</label>
					<select
						id="category"
						bind:value={categoryId}
						class="w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-artisan-dark transition outline-none focus:ring-2 focus:ring-artisan-active/20
						{errors.categoryId
							? 'border-red-300 ring-2 ring-red-100'
							: 'border-artisan-border focus:border-artisan-muted'}"
					>
						<option value={null}>Pilih kategori...</option>
						{#each data.categories as cat (cat.id)}
							<option value={cat.id}>{cat.name} — {cat.subCategory}</option>
						{/each}
					</select>
					{#if errors.categoryId}
						<p class="text-xs text-red-500">{errors.categoryId}</p>
					{/if}
				</div>
			</div>
		</div>

		<!-- Kolom Kanan (fixed width) -->
		<div class="flex flex-col gap-5">
			<ValueAndStock bind:basePrice bind:salePrice bind:currentStock bind:stockThreshold />
			<WarehouseLogistics
				bind:supplierId
				bind:location
				suppliers={data.suppliers}
				warehouses={data.warehouses}
			/>
			{#if errors.supplierId}
				<p class="-mt-3 px-1 text-xs text-red-500">{errors.supplierId}</p>
			{/if}

			<!-- ─── Save Card ─── -->
			<div class="rounded-xl border border-artisan-border bg-white p-5 shadow-sm">
				<p class="mb-3 text-xs text-artisan-muted">
					Pastikan semua informasi sudah benar sebelum menyimpan. Data tidak bisa diubah setelah
					disimpan kecuali diedit manual.
				</p>
				<button
					type="button"
					onclick={handleSubmit}
					disabled={isSubmitting || submitSuccess}
					class="flex w-full items-center justify-center gap-2 rounded-lg bg-artisan-primary py-2.5 text-sm font-medium text-artisan-white transition hover:bg-artisan-dark disabled:cursor-not-allowed disabled:opacity-60"
				>
					{#if isSubmitting}
						<Loader size={14} class="animate-spin" />
						Menyimpan...
					{:else if submitSuccess}
						<CheckCircle size={14} />
						Tersimpan! Mengalihkan...
					{:else}
						Simpan Item
					{/if}
				</button>
				<a
					href="/inventory"
					class="mt-2 flex w-full items-center justify-center rounded-lg border border-artisan-border py-2.5 text-sm font-medium text-artisan-muted transition hover:bg-artisan-sidebar"
				>
					Batal
				</a>
			</div>
		</div>
	</div>
</div>
