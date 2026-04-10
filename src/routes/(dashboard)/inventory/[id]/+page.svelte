<script lang="ts">
	import { showHeader } from '$lib/stores/layout';
	import { goto } from '$app/navigation';
	import { env } from '$env/dynamic/public';
	import { SvelteURLSearchParams } from 'svelte/reactivity';

	// Import Components
	import DetailHeader from '$lib/components/features/detailProduct/DetailHeader.svelte';
	import ProductGallery from '$lib/components/features/detailProduct/ProductGallery.svelte';
	import StockMonitor from '$lib/components/features/detailProduct/StockMonitor.svelte';
	import BasicInfoCard from '$lib/components/features/detailProduct/BasicInfoCard.svelte';
	import LogisticsCard from '$lib/components/features/detailProduct/LogisticsCard.svelte';
	import AlertOverlay from '$lib/components/global/AlertOverlay.svelte';
	import RestockOverlay from '$lib/components/global/RestockOverlay.svelte';

	// 1. Data Initialization
	let { data } = $props();
	let product = $derived(data.product);

	// 2. State untuk Overlay
	let isDeleteModalOpen = $state(false);
	let isDeleting = $state(false);
	let isRestockModalOpen = $state(false);
	let isRestocking = $state(false);

	$effect(() => {
		showHeader.set(false);
		return () => showHeader.set(true);
	});

	// 3. Action Functions

	const openRestockModal = () => {
		isRestockModalOpen = true;
	};

	const executeRestock = async (amount: number) => {
		isRestocking = true;
		const newStockTotal = product.currentStock + amount;

		try {
			const token = localStorage.getItem('token');
			const res = await fetch(`${env.PUBLIC_API_URL}/products/${product.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					...(token ? { Authorization: `Bearer ${token}` } : {})
				},
				body: JSON.stringify({ currentStock: newStockTotal })
			});

			if (!res.ok) throw new Error('Gagal update stok ke server');

			// Update UI Svelte secara reaktif
			product.currentStock = newStockTotal;
			isRestockModalOpen = false; // Tutup modal
		} catch (error) {
			console.error('Error saat restock:', error);
			alert('Terjadi kesalahan saat mengupdate stok ke database.');
		} finally {
			isRestocking = false;
		}
	};

	const handleExport = async () => {
		try {
			const params = new SvelteURLSearchParams();
			params.append('ids', String(product.id));
			const token = localStorage.getItem('token');

			const res = await fetch(`${env.PUBLIC_API_URL}/products/export?${params.toString()}`, {
				method: 'GET',
				headers: token ? { Authorization: `Bearer ${token}` } : {}
			});

			if (!res.ok) throw new Error('Gagal mengekspor data dari server');

			const blob = await res.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;

			a.download = `Product_${product.sku}_${new Date().getTime()}.xlsx`;
			document.body.appendChild(a);
			a.click();

			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		} catch (error) {
			console.error('Error saat export:', error);
			alert('Gagal mendownload file export. Silakan coba lagi.');
		}
	};

	const handleDelete = async () => {
		isDeleting = true;
		try {
			const token = localStorage.getItem('token');
			const res = await fetch(`${env.PUBLIC_API_URL}/products/${product.id}`, {
				method: 'DELETE',
				headers: token ? { Authorization: `Bearer ${token}` } : {}
			});

			if (!res.ok) throw new Error('Gagal menghapus produk');

			isDeleteModalOpen = false;
			goto('/inventory');
		} catch (error) {
			console.error('Error saat menghapus produk:', error);
			alert('Terjadi kesalahan saat menghapus produk.');
		} finally {
			isDeleting = false;
		}
	};
</script>

<div class="flex flex-col gap-6 pb-12">
	<DetailHeader productId={product.id} onExport={handleExport} />

	<div class="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_1fr]">
		<div class="flex flex-col gap-6">
			<ProductGallery {product} />

			<StockMonitor
				currentStock={product.currentStock}
				stockThreshold={product.stockThreshold}
				onRestock={openRestockModal}
			/>
		</div>

		<div class="flex flex-col gap-6">
			<BasicInfoCard {product} />
			<LogisticsCard {product} />

			<div class="rounded-xl border border-red-100 bg-red-50/30 p-5">
				<h3 class="mb-3 text-sm font-bold tracking-wider text-red-600 uppercase">Danger Zone</h3>
				<p class="mb-4 text-xs text-red-500/80">
					Menghapus produk ini akan menghilangkan seluruh data stok dan log aktivitas selamanya.
				</p>
				<button
					onclick={() => (isDeleteModalOpen = true)}
					class="text-sm font-semibold text-red-600 underline underline-offset-4 hover:text-red-700"
				>
					Hapus Produk Secara Permanen
				</button>
			</div>
		</div>
	</div>

	<AlertOverlay
		isOpen={isDeleteModalOpen}
		title="Hapus Produk?"
		message={`Apakah Anda yakin ingin menghapus "${product.name}" secara permanen? Data yang dihapus tidak dapat dikembalikan.`}
		type="danger"
		confirmText="Ya, Hapus"
		cancelText="Batal"
		isLoading={isDeleting}
		onConfirm={handleDelete}
		onCancel={() => (isDeleteModalOpen = false)}
	/>

	<RestockOverlay
		isOpen={isRestockModalOpen}
		productName={product.name}
		currentStock={product.currentStock}
		isLoading={isRestocking}
		onConfirm={executeRestock}
		onCancel={() => (isRestockModalOpen = false)}
	/>
</div>
