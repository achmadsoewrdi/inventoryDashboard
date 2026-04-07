<script lang="ts">
	import { cn } from '$lib/utils/cn';

	type Option = { label: string; value: string };

	interface Props {
		options: Option[];
		value?: string[];
		placeholder?: string;
		disabled?: boolean;
		class?: string;
		onChange?: (values: string[]) => void;
	}

	let {
		options,
		value = $bindable<string[]>([]),
		placeholder = 'Pilih...',
		disabled = false,
		class: className = '',
		onChange
	}: Props = $props();

	let open = $state(false);
	let triggerEl = $state<HTMLDivElement | null>(null);

	const selectedOptions = $derived(options.filter((o) => value.includes(o.value)));

	function toggle(option: Option) {
		const exists = value.includes(option.value);
		value = exists ? value.filter((v) => v !== option.value) : [...value, option.value];
		onChange?.(value);
	}

	function remove(val: string, e: MouseEvent) {
		e.stopPropagation();
		value = value.filter((v) => v !== val);
		onChange?.(value);
	}
</script>

<svelte:window
	on:click={(e) => {
		if (triggerEl && !triggerEl.contains(e.target as Node)) open = false;
	}}
/>

<div bind:this={triggerEl} class={cn('relative w-full', className)}>
	<button
		type="button"
		{disabled}
		onclick={() => { if (!disabled) open = !open; }}
		class={cn(
			'flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border px-2 py-1.5 text-sm transition-colors',
			'border-artisan-border bg-white hover:border-artisan-muted',
			open && 'border-artisan-muted',
			disabled && 'cursor-not-allowed opacity-50'
		)}
	>
		{#if selectedOptions.length === 0}
			<span class="px-1 text-artisan-muted">{placeholder}</span>
		{:else}
			{#each selectedOptions as opt (opt.value)}
				<span class="inline-flex items-center gap-1 rounded-full border border-artisan-border bg-artisan-sidebar px-2 py-0.5 text-xs text-artisan-dark">
					{opt.label}
					<span
						role="button"
						tabindex="0"
						onclick={(e) => remove(opt.value, e)}
						onkeydown={(e) => e.key === 'Enter' && remove(opt.value, e as unknown as MouseEvent)}
						class="cursor-pointer text-artisan-muted hover:text-artisan-dark"
					>✕</span>
				</span>
			{/each}
		{/if}
		<svg
			class={cn('ml-auto size-4 shrink-0 text-artisan-muted transition-transform', open && 'rotate-180')}
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
		<div class="absolute z-50 mt-1 w-full rounded-md border border-artisan-border bg-white shadow-sm">
			<div class="max-h-48 overflow-y-auto">
				{#each options as option (option.value)}
					<button
						type="button"
						onclick={() => toggle(option)}
						class={cn(
							'flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-artisan-dark hover:bg-artisan-sidebar',
							value.includes(option.value) && 'bg-artisan-sidebar font-medium'
						)}
					>
						<div
							class={cn(
								'flex size-4 shrink-0 items-center justify-center rounded border transition-all',
								value.includes(option.value)
									? 'border-artisan-primary bg-artisan-primary'
									: 'border-artisan-border bg-white'
							)}
						>
							{#if value.includes(option.value)}
								<svg width="9" height="7" viewBox="0 0 9 7" fill="none">
									<path
										d="M1 3.5L3.5 6L8 1"
										stroke="white"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							{/if}
						</div>
						{option.label}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>