<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { SvelteComponent } from 'svelte';

	// props
	interface props {
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
			'bg-stone-800 text-artisan-white hover:bg-stone-700 focus:bg-stone-700 focus:ring-2 focus:ring-offset-2 focus:ring-stone-800',

		secondary:
			'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-300',

		outline:
			'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:bg-gray-50 focus:ring-gray-300',

		ghost:
			'bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:ring-gray-300'
	};

	const sizeClasses = {
		sm: 'h-8 px-3 text-xs',
		md: 'h-10 px-4 text-sm',
		lg: 'h-12 px-6 text-base'
	};
</script>

<button
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
