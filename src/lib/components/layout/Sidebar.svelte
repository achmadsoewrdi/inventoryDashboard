<script lang="ts">
	import {
		LayoutDashboard,
		Package,
		Map,
		FileBarChart2,
		User,
		LogOut,
		ChevronLeft,
		type Icon
	} from 'lucide-svelte';
	import { cn } from '$lib/utils/cn';
	import { page } from '$app/state';

	interface NavItem {
		label: string;
		href: string;
		icon: typeof Icon;
	}

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
	let currentPath = $derived(page.url?.pathname ?? '');

	// state collapse sidebar
	let collapsed = $state(false);

	const navItems: NavItem[] = [
		{ label: 'Admin Home', href: '/', icon: LayoutDashboard },
		{ label: 'Inventory Management', href: '/inventory', icon: Package },
		{ label: 'Warehouse Map', href: '/warehouse', icon: Map },
		{ label: 'Supply Reports', href: '/reports', icon: FileBarChart2 }
	];

	const isActive = (href: string) => currentPath === href;
</script>

<aside
	class={cn(
		'relative flex h-screen flex-col bg-artisan-sidebar font-manrope transition-all duration-300 ease-in-out',
		collapsed ? 'w-16' : 'w-64',
		className
	)}
>
	<!-- Tombol toggle collapse -->
	<button
		type="button"
		onclick={() => (collapsed = !collapsed)}
		class="absolute top-6 -right-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-artisan-border bg-white shadow-sm transition-colors hover:bg-slate-50"
		aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
	>
		<ChevronLeft
			class={cn(
				'h-3.5 w-3.5 text-artisan-muted transition-transform duration-300',
				collapsed ? 'rotate-180' : 'rotate-0'
			)}
		/>
	</button>

	<!-- Logo -->
	<div class="overflow-hidden px-4 py-6">
		{#if !collapsed}
			<p class="text-base font-bold tracking-wide text-artisan-dark">ARTISAN OPS</p>
			<p class="text-xs font-medium tracking-widest text-artisan-muted">ADMIN DASHBOARD</p>
		{:else}
			<!-- waktu collapsed, tampilin inisial aja biar gak kosong -->
			<p class="text-center text-base font-bold text-artisan-dark">AO</p>
		{/if}
	</div>

	<div class="mx-4 border-t border-artisan-border"></div>

	<!-- Nav Items -->
	<nav class="flex flex-col gap-1 px-2 py-4">
		{#each navItems as item (item.href)}
			{@const active = isActive(item.href)}
			<a
				href={item.href}
				aria-label={item.label}
				aria-current={active ? 'page' : undefined}
				title={collapsed ? item.label : undefined}
				class={cn(
					'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
					collapsed ? 'justify-center' : '',
					active
						? 'bg-artisan-active/15 text-artisan-dark'
						: 'text-artisan-muted hover:bg-artisan-active/10 hover:text-artisan-dark'
				)}
			>
				<item.icon
					class={cn(
						'h-4 w-4 shrink-0 transition-all duration-200',
						active ? 'fill-current text-artisan-dark' : 'fill-none text-artisan-muted'
					)}
				/>
				{#if !collapsed}
					<span class="truncate">{item.label}</span>
				{/if}
			</a>
		{/each}
	</nav>

	<div class="flex-1"></div>

	<div class="mx-4 border-t border-artisan-border"></div>

	<!-- Bottom Menu -->
	<div class="flex flex-col gap-1 px-2 py-4">
		<a
			href="/account"
			aria-label="My Account"
			title={collapsed ? 'My Account' : undefined}
			class={cn(
				'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-artisan-muted transition-colors hover:bg-artisan-active/10 hover:text-artisan-dark',
				collapsed ? 'justify-center' : ''
			)}
		>
			<User class="h-4 w-4 shrink-0 text-artisan-muted" />
			{#if !collapsed}
				<span>My Account</span>
			{/if}
		</a>

		<button
			type="button"
			title={collapsed ? 'Sign Out' : undefined}
			class={cn(
				'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-artisan-muted transition-colors hover:bg-artisan-active/10 hover:text-artisan-dark',
				collapsed ? 'justify-center' : ''
			)}
		>
			<LogOut class="h-4 w-4 shrink-0 text-artisan-muted" />
			{#if !collapsed}
				<span>Sign Out</span>
			{/if}
		</button>
	</div>
</aside>
