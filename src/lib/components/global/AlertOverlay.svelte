<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	// INI SUDAH BENAR: Pakai lucide-svelte untuk project Svelte
	import { AlertTriangle, Trash2, Info, CheckCircle } from 'lucide-svelte';
	import Button from '$lib/components/global/Button.svelte';
	import { cn } from '$lib/utils/cn';

	interface Props {
		isOpen: boolean;
		title: string;
		message: string;
		type?: 'warning' | 'danger' | 'info' | 'success';
		confirmText?: string;
		cancelText?: string;
		isLoading?: boolean;
		onConfirm: () => void;
		onCancel: () => void;
	}

	let {
		isOpen = false,
		title,
		message,
		type = 'warning',
		confirmText = 'Konfirmasi',
		cancelText = 'Batal',
		isLoading = false,
		onConfirm,
		onCancel
	}: Props = $props();

	// Konfigurasi dinamis untuk ikon dan warna berdasarkan `type`
	const typeConfig = {
		warning: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100' },
		danger: { icon: Trash2, color: 'text-red-600', bg: 'bg-red-100' },
		info: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-100' },
		success: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' }
	};

	let currentConfig = $derived(typeConfig[type]);

	// Fungsi agar bisa tutup modal kalau klik area luar (backdrop)
	const handleBackdropClick = (e: MouseEvent) => {
		if (e.target === e.currentTarget && !isLoading) {
			onCancel();
		}
	};
</script>

{#if isOpen}
	{@const Icon = currentConfig.icon}

	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
		transition:fade={{ duration: 200 }}
		onclick={handleBackdropClick}
		onkeydown={(e) => {
			if (e.key === 'Escape' && !isLoading) onCancel();
		}}
		role="presentation"
	>
		<div
			class="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
			transition:scale={{ duration: 200, start: 0.95 }}
		>
			<div class="flex flex-col items-center text-center">
				<div
					class={cn(
						'mb-4 flex h-14 w-14 items-center justify-center rounded-full',
						currentConfig.bg
					)}
				>
					<Icon class={cn('h-7 w-7', currentConfig.color)} />
				</div>

				<h3 class="mb-2 text-lg font-bold text-artisan-dark">{title}</h3>
				<p class="mb-6 text-sm leading-relaxed text-artisan-muted">{message}</p>

				<div class="flex w-full gap-3">
					<Button
						variant="secondary"
						class="w-full bg-gray-100"
						onClick={onCancel}
						disable={isLoading}
					>
						{cancelText}
					</Button>

					<Button
						variant="primary"
						class={cn(
							'w-full border-none text-white',
							type === 'danger'
								? 'bg-red-600 hover:bg-red-700'
								: type === 'warning'
									? 'bg-amber-600 hover:bg-amber-700'
									: 'bg-artisan-primary'
						)}
						onClick={onConfirm}
						disable={isLoading}
					>
						{isLoading ? 'Memproses...' : confirmText}
					</Button>
				</div>
			</div>
		</div>
	</div>
{/if}
