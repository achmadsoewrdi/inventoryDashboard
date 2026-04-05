<script lang="ts">
	import { cn } from '$lib/utils/cn';

	type Option = { label: string; value: string };

	interface Props {
		options: Option[];
		value?: string | null;
		placeholder?: string;
		searchable?: boolean;
		disabled?: boolean;
		id?: string;
		class?: string;
		onChange?: (value: string | null) => void;
	}

	let {
		options,
		value = $bindable(null),
		placeholder = 'Pilih...',
		searchable = false,
		disabled = false,
		id = crypto.randomUUID(),
		class: className = '',
		onChange
	}: Props = $props();

	let open = $state(false);
	let searchQuery = $state('');
	let triggerEl = $state<HTMLDivElement | null>(null);

	const filtered = $derived(
		searchQuery
			? options.filter((o) => o.label.toLowerCase().includes(searchQuery.toLowerCase()))
			: options
	);

	const selectedLabel = $derived(options.find((o) => o.value === value)?.label ?? null);

	function select(option: Option) {
		value = option.value;
		open = false;
		searchQuery = '';
		onChange?.(option.value);
	}

	function toggle() {
		if (disabled) return;
		open = !open;
		if (!open) searchQuery = '';
	}
</script>

<svelte:window
	on:click={(e) => {
		if (triggerEl && !triggerEl.contains(e.target as Node)) {
			open = false;
			searchQuery = '';
		}
	}}
/>

<div bind:this={triggerEl} class={cn('relative w-full', className)}>
	<button
		type="button"
		{id}
		{disabled}
		onclick={toggle}
		class={cn(
			'flex h-9 w-full items-center justify-between rounded-md border px-3 text-sm transition-colors',
			'border-stone-200 bg-white hover:border-stone-400',
			open && 'border-stone-400',
			disabled && 'cursor-not-allowed opacity-50'
		)}
	>
		<span class={cn('truncate', selectedLabel ? 'text-stone-800' : 'text-stone-400')}>
			{selectedLabel ?? placeholder}
		</span>
		<svg
			class={cn('ml-2 size-4 shrink-0 text-stone-400 transition-transform', open && 'rotate-180')}
			viewBox="0 0 16 16"
			fill="none"
		>
			<path
				d="M4 6l4 4 4-4"
				stroke="currentColor"
				stroke-width="1.4"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</button>

	{#if open}
		<div class="absolute z-50 mt-1 w-full rounded-md border border-stone-200 bg-white shadow-sm">
			{#if searchable}
				<div class="border-b border-stone-100 p-2">
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Cari..."
						onclick={(e) => e.stopPropagation()}
						class="w-full rounded border border-stone-200 bg-stone-50 px-2 py-1.5 text-sm outline-none focus:border-stone-400"
					/>
				</div>
			{/if}
			<div class="max-h-48 overflow-y-auto">
				{#if filtered.length === 0}
					<p class="px-3 py-2 text-sm text-stone-400">Tidak ditemukan</p>
				{:else}
					{#each filtered as option (option.value)}
						<button
							type="button"
							onclick={() => select(option)}
							class={cn(
								'flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-stone-700 transition-colors hover:bg-stone-50',
								value === option.value && 'bg-stone-50 font-medium'
							)}
						>
							<svg
								class={cn('size-3.5 shrink-0 text-stone-800', value !== option.value && 'invisible')}
								viewBox="0 0 14 14"
								fill="none"
							>
								<path
									d="M2 7l3.5 3.5L12 3"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							{option.label}
						</button>
					{/each}
				{/if}
			</div>
		</div>
	{/if}
</div>