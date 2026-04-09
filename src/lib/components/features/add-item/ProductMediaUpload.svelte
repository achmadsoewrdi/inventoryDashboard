<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { X, Plus } from 'lucide-svelte';
	import { untrack } from 'svelte';
	import { env } from '$env/dynamic/public';

	// Tipe data untuk gambar lama dari database
	interface ExistingImage {
		id: number;
		url: string;
		isPrimary: boolean;
	}

	// Tipe data untuk gambar baru yang di-upload
	interface NewImage {
		file: File;
		isPrimary: boolean;
	}

	interface Props {
		existingImages?: ExistingImage[];
		newImages?: NewImage[];
		deletedImageIds?: number[];
		class?: string;
	}

	let {
		existingImages = [],
		newImages = $bindable([]),
		deletedImageIds = $bindable([]),
		class: className = ''
	}: Props = $props();

	$effect(() => {
		// Dengan mencetak nilainya ke console, TypeScript akan menganggap
		// variabel ini "sudah dibaca dan digunakan".
		// Pakai debug agar log-nya tersembunyi/tidak nyampah di console utama
		console.debug('Syncing images...', newImages, deletedImageIds);
	});

	type PreviewItem =
		| { type: 'existing'; id: number; url: string; isPrimary: boolean }
		| { type: 'new'; file: File; url: string; isPrimary: boolean };

	// Inisialisasi awal dengan memetakan gambar dari database
	let previews = $state<PreviewItem[]>(
		untrack(() =>
			existingImages.map((img) => ({
				type: 'existing',
				id: img.id,
				url: img.url,
				isPrimary: img.isPrimary
			}))
		)
	);

	let primaryInputEl = $state<HTMLInputElement | null>(null);
	let additionalInputEl = $state<HTMLInputElement | null>(null);
	let isDragging = $state(false);

	function syncNewImages() {
		newImages = previews
			.filter((p) => p.type === 'new')
			.map((p) => {
				const newItem = p as Extract<PreviewItem, { type: 'new' }>;
				return { file: newItem.file, isPrimary: newItem.isPrimary };
			});
	}

	function handlePrimarySelect(e: Event) {
		const file = (e.currentTarget as HTMLInputElement).files?.[0];
		if (!file) return;
		addFile(file, true);
	}

	function handleAdditionalSelect(e: Event) {
		const files = Array.from((e.currentTarget as HTMLInputElement).files ?? []);
		files.forEach((file) => addFile(file, false));
	}

	function addFile(file: File, isPrimary: boolean) {
		if (!file.type.startsWith('image/')) return;
		const url = URL.createObjectURL(file);

		if (isPrimary) {
			// Replace primary kalau sudah ada
			const existingIdx = previews.findIndex((p) => p.isPrimary);
			if (existingIdx !== -1) {
				const oldItem = previews[existingIdx];
				// Jika gambar lama (DB) diganti, catat ID-nya untuk dihapus
				if (oldItem.type === 'existing') {
					deletedImageIds = [...deletedImageIds, oldItem.id];
				} else {
					URL.revokeObjectURL(oldItem.url); // Bersihkan cache lokal
				}
				previews.splice(existingIdx, 1);
			}
			previews = [
				{ type: 'new', file, url, isPrimary: true },
				...previews.filter((p) => !p.isPrimary)
			];
		} else {
			previews = [...previews, { type: 'new', file, url, isPrimary: false }];
		}

		syncNewImages();
	}

	function removeFile(index: number) {
		const item = previews[index];

		// Jika yang dihapus gambar DB, masukkan ke keranjang "sampah"
		if (item.type === 'existing') {
			deletedImageIds = [...deletedImageIds, item.id];
		} else {
			URL.revokeObjectURL(item.url);
		}

		previews = previews.filter((_, i) => i !== index);
		syncNewImages();
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}
	function handleDragLeave() {
		isDragging = false;
	}
	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		const file = e.dataTransfer?.files?.[0];
		if (file) addFile(file, true);
	}

	// Fungsi untuk memastikan URL gambar selalu lengkap
	function getImageUrl(url: string) {
		if (url.startsWith('blob:') || url.startsWith('http')) return url;
		const cleanPath = url.startsWith('/') ? url : `/${url}`;
		return `${env.PUBLIC_API_URL}${cleanPath}`;
	}

	const primaryPreview = $derived(previews.find((p) => p.isPrimary));
	const additionalPreviews = $derived(previews.filter((p) => !p.isPrimary));
</script>

<div class={cn('rounded-xl border border-artisan-border bg-white p-6', className)}>
	<div class="mb-6 flex items-center gap-2">
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="text-artisan-muted">
			<rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5" />
			<circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
			<path
				d="m21 15-5-5L5 21"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
		<h2 class="text-sm font-semibold text-artisan-dark">Product Media</h2>
	</div>

	<div class="flex gap-3">
		<div class="relative">
			{#if primaryPreview}
				<div
					class="group relative h-36 w-48 overflow-hidden rounded-xl border border-artisan-border"
				>
					<img
						src={getImageUrl(primaryPreview.url)}
						alt="Primary product"
						class="h-full w-full object-cover"
					/>
					<button
						type="button"
						onclick={() => removeFile(previews.indexOf(primaryPreview!))}
						class="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
						aria-label="Remove primary image"
					>
						<X size={12} />
					</button>
					<span
						class="absolute bottom-2 left-2 rounded-md bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white"
					>
						Primary
					</span>
				</div>
			{:else}
				<button
					type="button"
					onclick={() => primaryInputEl?.click()}
					ondragover={handleDragOver}
					ondragleave={handleDragLeave}
					ondrop={handleDrop}
					class={cn(
						'group flex h-36 w-48 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-all duration-200',
						isDragging
							? 'scale-[1.02] border-artisan-primary bg-artisan-bg'
							: 'border-artisan-border bg-artisan-bg hover:border-artisan-primary'
					)}
				>
					<svg
						width="28"
						height="28"
						viewBox="0 0 24 24"
						fill="none"
						class="text-artisan-dark transition-colors group-hover:text-artisan-primary"
					>
						<path
							d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<polyline
							points="17 8 12 3 7 8"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<line
							x1="12"
							y1="3"
							x2="12"
							y2="15"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
					</svg>
					<div class="text-center">
						<p
							class="text-xs font-medium text-artisan-dark transition-colors group-hover:text-artisan-primary"
						>
							Primary Product Image
						</p>
						<p
							class="text-[11px] text-artisan-dark/60 transition-colors group-hover:text-artisan-primary/70"
						>
							Drag and drop or click to browse
						</p>
					</div>
				</button>
			{/if}

			<input
				bind:this={primaryInputEl}
				type="file"
				accept="image/jpeg,image/png,image/webp"
				class="sr-only"
				onchange={handlePrimarySelect}
			/>
		</div>

		<div class="flex flex-wrap gap-3">
			{#each additionalPreviews as preview, i (preview.url)}
				<div
					class="group relative h-36 w-36 overflow-hidden rounded-xl border border-artisan-border"
				>
					<img
						src={getImageUrl(preview.url)}
						alt="Additional product image {i + 1}"
						class="h-full w-full object-cover"
					/>
					<button
						type="button"
						onclick={() => removeFile(previews.indexOf(preview))}
						class="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
						aria-label="Remove image"
					>
						<X size={12} />
					</button>
				</div>
			{/each}

			<button
				type="button"
				onclick={() => additionalInputEl?.click()}
				class="group flex h-36 w-36 flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-artisan-border bg-artisan-bg text-artisan-dark transition-all duration-200 hover:border-artisan-primary hover:text-artisan-primary"
			>
				<Plus size={20} />
				<span class="text-[11px] font-medium tracking-wide uppercase">Add More</span>
			</button>

			<input
				bind:this={additionalInputEl}
				type="file"
				accept="image/jpeg,image/png,image/webp"
				multiple
				class="sr-only"
				onchange={handleAdditionalSelect}
			/>
		</div>
	</div>
</div>
