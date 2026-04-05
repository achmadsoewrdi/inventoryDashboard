<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		checked?: boolean;
		indeterminate?: boolean;
		disabled?: boolean;
		label?: string;
		id?: string;
		name?: string;
		class?: string;
		onChange?: (event: Event & { currentTarget: HTMLInputElement }) => void;
	}

	let {
		checked = $bindable(false),
		indeterminate = false,
		disabled = false,
		label = '',
		id = crypto.randomUUID(), // ← auto-generate id unik
		name = '',
		class: className = '',
		onChange
	}: Props = $props();

	let inputEl = $state<HTMLInputElement | null>(null);

	$effect(() => {
		if (inputEl) inputEl.indeterminate = indeterminate;
	});

	const isActive = $derived(checked || indeterminate);
</script>

<label
	for={id}
	class={cn(
		'group inline-flex items-center gap-2',
		disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
		className
	)}
>
	<input
		bind:this={inputEl}
		type="checkbox"
		{id}
		{name}
		{disabled}
		bind:checked
		onchange={onChange}
		class="sr-only"
	/>

	<div
		class={cn(
			'flex size-4 shrink-0 items-center justify-center rounded border transition-all',
			isActive ? 'border-stone-800 bg-stone-800' : 'border-stone-300 bg-white',
			!disabled && !isActive && 'group-hover:border-stone-500'
		)}
	>
		{#if indeterminate}
			<svg width="8" height="2" viewBox="0 0 8 2" fill="none">
				<path d="M1 1H7" stroke="white" stroke-width="1.8" stroke-linecap="round" />
			</svg>
		{:else if checked}
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

	{#if label}
		<span class="text-sm text-stone-700">{label}</span>
	{/if}
</label>
