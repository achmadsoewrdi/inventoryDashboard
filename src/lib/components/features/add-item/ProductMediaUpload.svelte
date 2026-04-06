<script lang="ts">
	import type { CreateProductForm } from '$lib/types/types';
	import { cn } from '$lib/utils/cn';
	import { X, Plus } from 'lucide-svelte';

	interface Props {
		images: CreateProductForm['images'];
		class?: string;
	}

	let { images = $bindable([]), class: className = '' }: Props = $props();

	// Preview URL untuk ditampilkan di UI
	let previews = $state<{ file: File; url: string; isPrimary: boolean }[]>([]);

	// Input el untuk trigger file picker
	let primaryInputEl = $state<HTMLInputElement | null>(null);
	let additionalInputEl = $state<HTMLInputElement | null>(null);

	// Drag state untuk primary dropzone
	let isDragging = $state(false);

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
			const existing = previews.findIndex((p) => p.isPrimary);
			if (existing !== -1) {
				URL.revokeObjectURL(previews[existing].url);
				previews.splice(existing, 1);
				images.splice(existing, 1);
			}
			previews = [{ file, url, isPrimary: true }, ...previews.filter((p) => !p.isPrimary)];
		} else {
			previews = [...previews, { file, url, isPrimary: false }];
		}

		images = previews.map((p) => p.file);
	}

	function removeFile(index: number) {
		URL.revokeObjectURL(previews[index].url);
		previews = previews.filter((_, i) => i !== index);
		images = previews.map((p) => p.file);
	}

	// Drag & drop handlers
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

	const primaryPreview = $derived(previews.find((p) => p.isPrimary));
	const additionalPreviews = $derived(previews.filter((p) => !p.isPrimary));
</script>

<div class={cn('rounded-xl border border-slate-200 bg-white p-6', className)}>
	<!-- Section Title -->
	<div class="mb-6 flex items-center gap-2">
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="text-slate-400">
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
		<h2 class="text-sm font-semibold text-slate-700">Product Media</h2>
	</div>

	<div class="flex gap-3">
		<!-- Primary Image Dropzone -->
		<div class="relative">
			{#if primaryPreview}
				<!-- Preview primary image -->
				<div class="group relative h-36 w-48 overflow-hidden rounded-xl border border-slate-200">
					<img src={primaryPreview.url} alt="Primary product" class="h-full w-full object-cover" />
					<!-- Remove button -->
					<button
						type="button"
						onclick={() => removeFile(previews.indexOf(primaryPreview))}
						class="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
						aria-label="Remove primary image"
					>
						<X size={12} />
					</button>
					<!-- Primary badge -->
					<span
						class="absolute bottom-2 left-2 rounded-md bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white"
					>
						Primary
					</span>
				</div>
			{:else}
				<!-- Empty dropzone -->
				<button
					type="button"
					onclick={() => primaryInputEl?.click()}
					ondragover={handleDragOver}
					ondragleave={handleDragLeave}
					ondrop={handleDrop}
					class={cn(
						'flex h-36 w-48 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors',
						isDragging
							? 'border-slate-400 bg-slate-50'
							: 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
					)}
				>
					<svg width="28" height="28" viewBox="0 0 24 24" fill="none" class="text-slate-300">
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
						<p class="text-xs font-medium text-slate-500">Primary Product Image</p>
						<p class="text-[11px] text-slate-400">Drag and drop or click to browse</p>
					</div>
				</button>
			{/if}

			<!-- Hidden input primary -->
			<input
				bind:this={primaryInputEl}
				type="file"
				accept="image/jpeg,image/png,image/webp"
				class="sr-only"
				onchange={handlePrimarySelect}
			/>
		</div>

		<!-- Additional Images -->
		<div class="flex flex-wrap gap-3">
			{#each additionalPreviews as preview, i (preview.url)}
				<div class="group relative h-36 w-36 overflow-hidden rounded-xl border border-slate-200">
					<img
						src={preview.url}
						alt="Additional product image {i + 1}"
						class="h-full w-full object-cover"
					/>
					<!-- Remove button -->
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

			<!-- Add More button -->
			<button
				type="button"
				onclick={() => additionalInputEl?.click()}
				class="flex h-36 w-36 flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 text-slate-400 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-500"
			>
				<Plus size={20} />
				<span class="text-[11px] font-medium tracking-wide uppercase">Add More</span>
			</button>

			<!-- Hidden input additional -->
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
