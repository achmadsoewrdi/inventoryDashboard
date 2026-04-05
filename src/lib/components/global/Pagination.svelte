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
	<span class="text-sm text-stone-500">
		PAGE {currentPage} OF {totalPages}
		{#if totalItems > 0}
			<span class="ml-2 text-stone-400">({perPage} per page)</span>
		{/if}
	</span>

	<!-- Kanan: tombol navigasi -->
	<div class="flex items-center gap-2">
		<button
			type="button"
			onclick={prev}
			disabled={currentPage <= 1}
			class={cn(
				'h-9 rounded-md border border-stone-300 px-4 text-sm text-stone-600 transition-colors',
				'hover:bg-stone-50 hover:border-stone-400',
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
				'h-9 rounded-md border border-stone-800 bg-stone-800 px-4 text-sm text-white transition-colors',
				'hover:bg-stone-700 hover:border-stone-700',
				'disabled:cursor-not-allowed disabled:opacity-40'
			)}
		>
			Next
		</button>
	</div>
</div>