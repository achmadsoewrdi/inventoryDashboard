<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { PackagePlus } from 'lucide-svelte';
	import Button from '$lib/components/global/Button.svelte';

	interface Props {
		isOpen: boolean;
		productName: string;
		currentStock: number;
		isLoading?: boolean;
		onConfirm: (amount: number) => void;
		onCancel: () => void;
	}

	let {
		isOpen = false,
		productName,
		currentStock,
		isLoading = false,
		onConfirm,
		onCancel
	}: Props = $props();

	// State untuk input
	let inputAmount = $state<number | ''>('');
	let errorMessage = $state('');

	// Reset form setiap kali modal dibuka
	$effect(() => {
		if (isOpen) {
			inputAmount = '';
			errorMessage = '';
		}
	});

	function handleClose() {
		if (!isLoading) onCancel();
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) handleClose();
	}

	function submit() {
		const amount = Number(inputAmount);
		// Validasi
		if (!inputAmount || isNaN(amount) || amount <= 0) {
			errorMessage = 'Masukkan angka yang valid (minimal 1).';
			return;
		}
		errorMessage = '';
		onConfirm(amount); // Kirim angka ke parent
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') handleClose();
		if (e.key === 'Enter') submit();
	}
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
		transition:fade={{ duration: 200 }}
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
		role="presentation"
	>
		<div
			class="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
			transition:scale={{ duration: 200, start: 0.95 }}
		>
			<div class="flex flex-col">
				<div class="mb-4 flex items-center gap-3">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-full bg-artisan-primary/10 text-artisan-primary"
					>
						<PackagePlus class="h-5 w-5" />
					</div>
					<div>
						<h3 class="text-lg font-bold text-artisan-dark">Restock Produk</h3>
						<p class="text-xs text-artisan-muted">{productName}</p>
					</div>
				</div>

				<div class="mb-4 flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
					<span class="text-sm font-medium text-artisan-muted">Stok Saat Ini:</span>
					<span class="text-lg font-bold text-artisan-dark">{currentStock}</span>
				</div>

				<div class="mb-6 flex flex-col gap-1.5">
					<label for="restockAmount" class="text-sm font-medium text-artisan-dark">
						Jumlah Tambahan <span class="text-red-500">*</span>
					</label>
					<input
						id="restockAmount"
						type="number"
						min="1"
						bind:value={inputAmount}
						placeholder="Contoh: 50"
						disabled={isLoading}
						class="w-full rounded-lg border border-artisan-border bg-white px-4 py-2.5 text-sm text-artisan-dark transition-all outline-none placeholder:text-gray-400 focus:border-artisan-primary focus:ring-1 focus:ring-artisan-primary disabled:bg-gray-50"
					/>
					{#if errorMessage}
						<p class="text-xs font-medium text-red-500">{errorMessage}</p>
					{/if}
				</div>

				<div class="flex w-full gap-3">
					<Button
						variant="secondary"
						class="w-full bg-gray-100"
						onClick={handleClose}
						disable={isLoading}
					>
						Batal
					</Button>
					<Button variant="primary" class="w-full" onClick={submit} disable={isLoading}>
						{isLoading ? 'Menyimpan...' : 'Simpan Stok'}
					</Button>
				</div>
			</div>
		</div>
	</div>
{/if}
