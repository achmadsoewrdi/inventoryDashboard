<script lang="ts">
	import { ArrowLeft, Download } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/global/Button.svelte';

	interface Props {
		productId: number | string;
		onExport?: () => void;
	}

	let { productId, onExport }: Props = $props();

	// fungsi navigasi
	const goBack = () => {
		goto('/inventory');
	};
	const goEdit = () => {
		goto(`/inventory/edit/${productId}`);
	};
</script>

<div class="mb-2 flex items-center justify-between">
	<div class="flex items-center gap-4">
		<Button
			variant="outline"
			class="h-12 w-12 bg-white px-0!"
			Icon={ArrowLeft}
			onClick={goBack}
			type="button"
		/>
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-artisan-dark">Detail Product</h1>
			<p class="text-sm text-artisan-muted">Informasi lengkap dan manajeman stok</p>
		</div>
	</div>

	<div class="flex items-center gap-3">
		<Button variant="outline" Icon={Download} class="bg-white" onClick={onExport} />
		<Button variant="primary" onClick={goEdit}>Edit Product</Button>
	</div>
</div>
