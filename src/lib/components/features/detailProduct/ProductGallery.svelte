<script lang="ts">
	import type { ProductDetail } from '$lib/types/types';
	import { ImageOff } from 'lucide-svelte';
	import { env } from '$env/dynamic/public';
	import { cn } from '$lib/utils/cn';

	interface Props {
		product: ProductDetail;
	}

	interface ProductImage {
		id: number;
		url: string;
		isPrimary: boolean;
	}

	let { product }: Props = $props();

	let images = $derived(product.images || []);

	let activeImage = $state<ProductImage | null>(null);

	$effect(() => {
		if (images.length > 0 && !activeImage) {
			activeImage = images.find((img) => img.isPrimary) || images[0];
		}
	});

	function getImageUrl(url: string) {
		if (!url) return '';
		if (url.startsWith('http') || url.startsWith('blob:')) return url;
		const cleanPath = url.startsWith('/') ? url : `/${url}`;
		return `${env.PUBLIC_API_URL}${cleanPath}`;
	}
</script>

<div class="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm">
	<div
		class="relative flex h-[350px] w-full items-center justify-center overflow-hidden rounded-xl border border-artisan-border bg-gray-50/50 shadow-sm"
	>
		{#if activeImage}
			<img
				src={getImageUrl(activeImage.url)}
				alt={product.name}
				class="h-full w-full object-cover transition-all duration-300"
			/>

			{#if activeImage.isPrimary}
				<span
					class="absolute top-4 right-4 rounded-md bg-white/90 px-2.5 py-1 text-[10px] font-bold tracking-wide text-artisan-dark shadow-sm backdrop-blur-sm"
				>
					PRIMARY
				</span>
			{/if}
		{:else}
			<div class="flex flex-col items-center text-artisan-muted/50">
				<ImageOff class="mb-2 h-10 w-10" />
				<span class="text-sm font-medium">Tidak ada gambar</span>
			</div>
		{/if}
	</div>

	{#if images.length > 1}
		<div class="grid grid-cols-4 gap-2">
			{#each images as img (img.id)}
				<button
					type="button"
					onclick={() => (activeImage = img)}
					class={cn(
						'relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border-2 transition-all duration-200',
						activeImage?.id === img.id
							? 'border-artisan-primary shadow-md'
							: 'border-transparent opacity-70 hover:opacity-100'
					)}
				>
					<img src={getImageUrl(img.url)} alt="Thumbnail" class="h-full w-full object-cover" />
				</button>
			{/each}
		</div>
	{/if}
</div>
