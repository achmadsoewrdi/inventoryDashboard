<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { SvelteComponent } from 'svelte';

	// props
	interface props {
		type?: 'button' | 'submit' | 'reset';
		variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
		size?: 'sm' | 'md' | 'lg';
		disable?: boolean;
		class?: string;
		children?: import('svelte').Snippet; //pengganti slot
		onClick?: (event: MouseEvent) => void; //menangani event click

		Icon?: typeof SvelteComponent<{ class?: string }>;
		iconPosition?: 'left' | 'right';
	}

	let {
		type = 'button',
		variant = 'primary',
		size = 'md',
		disable = false,
		class: className = '',
		children,
		onClick,
		Icon,
		iconPosition = 'left'
	}: props = $props();

	// base class untuk button
	const baseClasses =
		'inline-flex items-center justify-center rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none';

	const variantClasses = {
		primary:
			'bg-artisan-primary text-artisan-white hover:bg-artisan-dark focus:bg-artisan-dark focus:ring-2 focus:ring-offset-2 focus:ring-artisan-primary',

		secondary:
			'bg-artisan-sidebar text-artisan-dark hover:bg-artisan-border focus:bg-artisan-border focus:ring-2 focus:ring-offset-2 focus:ring-artisan-border',

		outline:
			'border border-artisan-border bg-transparent text-artisan-dark hover:bg-artisan-sidebar hover:border-artisan-muted focus:bg-artisan-sidebar focus:ring-artisan-active',

		ghost:
			'bg-transparent text-artisan-muted hover:bg-artisan-sidebar hover:text-artisan-dark focus:bg-artisan-sidebar focus:ring-artisan-active'
	};

	const sizeClasses = {
		sm: 'h-8 px-3 text-xs',
		md: 'h-10 px-4 text-sm',
		lg: 'h-12 px-6 text-base'
	};
</script>

<button
	{type}
	class={cn(baseClasses, sizeClasses[size], variantClasses[variant], className)}
	disabled={disable}
	onclick={onClick}
>
	{#if Icon && iconPosition === 'left'}
		<Icon class={cn('h-4 w-4', children && 'mr-2')} />
	{/if}

	{#if children}
		{@render children()}
	{/if}

	{#if Icon && iconPosition === 'right'}
		<Icon class={cn('h-4 w-4', children && 'ml-2')} />
	{/if}
</button>
