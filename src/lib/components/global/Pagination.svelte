<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		currentPage?: number;
		totalPages?: number;
		totalItems?: number;
		perPage?: number;
		class?: string;
		onPageChange?: (page: number) => void;
	}

	let {
		currentPage = $bindable(1),
		totalPages = 1,
		totalItems = 0,
		perPage = 10,
		class: className = '',
		onPageChange
	}: Props = $props();

	function prev() {
		if (currentPage <= 1) return;
		currentPage--;
		onPageChange?.(currentPage);
	}

	function next() {
		if (currentPage >= totalPages) return;
		currentPage++;
		onPageChange?.(currentPage);
	}
</script>

<div class={cn('flex items-center justify-between', className)}>
	<!-- Kiri: info halaman -->
	<span class="text-sm text-artisan-muted">
		PAGE {currentPage} OF {totalPages}
		{#if totalItems > 0}
			<span class="ml-2 text-artisan-muted/60">({perPage} per page)</span>
		{/if}
	</span>

	<!-- Kanan: tombol navigasi -->
	<div class="flex items-center gap-2">
		<button
			type="button"
			onclick={prev}
			disabled={currentPage <= 1}
			class={cn(
				'h-9 rounded-md border border-artisan-border px-4 text-sm text-artisan-dark transition-colors',
				'hover:bg-artisan-sidebar hover:border-artisan-muted',
				'disabled:cursor-not-allowed disabled:opacity-40'
			)}
		>
			Previous
		</button>

		<button
			type="button"
			onclick={next}
			disabled={currentPage >= totalPages}
			class={cn(
				'h-9 rounded-md border border-artisan-primary bg-artisan-primary px-4 text-sm text-artisan-white transition-colors',
				'hover:bg-artisan-dark hover:border-artisan-dark',
				'disabled:cursor-not-allowed disabled:opacity-40'
			)}
		>
			Next
		</button>
	</div>
</div>