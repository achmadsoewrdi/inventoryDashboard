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
		'relative flex h-screen flex-col font-manrope transition-all duration-300 ease-in-out',
		'border-r border-artisan-border/60 bg-white',
		collapsed ? 'w-16' : 'w-64',
		className
	)}
>
	<!-- Tombol toggle collapse -->
	<button
		type="button"
		onclick={() => (collapsed = !collapsed)}
		class="absolute top-[26px] -right-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-artisan-border bg-white shadow-sm transition-all hover:border-artisan-muted hover:bg-artisan-sidebar"
		aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
	>
		<ChevronLeft
			class={cn(
				'h-3 w-3 text-artisan-muted transition-transform duration-300',
				collapsed ? 'rotate-180' : 'rotate-0'
			)}
		/>
	</button>

	<!-- Branding -->
	<div class={cn('px-4 py-5', collapsed ? 'flex justify-center' : '')}>
		{#if !collapsed}
			<div class="flex flex-col gap-0.5">
				<p class="text-[15px] font-extrabold tracking-[0.12em] text-artisan-dark uppercase">
					Artisan Ops
				</p>
				<p class="text-[10px] font-semibold tracking-[0.2em] text-artisan-muted uppercase">
					Admin Dashboard
				</p>
			</div>
		{:else}
			<div
				class="flex h-8 w-8 items-center justify-center rounded-lg bg-artisan-primary/10 text-artisan-primary"
			>
				<span class="text-xs font-black tracking-tight">AO</span>
			</div>
		{/if}
	</div>

	<!-- Divider -->
	<div class="mx-3 mb-2 border-t border-artisan-border/60"></div>

	<!-- Nav Section Label -->
	{#if !collapsed}
		<p class="px-4 pb-1 text-[10px] font-bold tracking-[0.18em] text-artisan-muted/70 uppercase">
			Menu
		</p>
	{/if}

	<!-- Nav Items -->
	<nav class="flex flex-col gap-0.5 px-2 py-1">
		{#each navItems as item (item.href)}
			{@const active = isActive(item.href)}
			<a
				href={item.href}
				aria-label={item.label}
				aria-current={active ? 'page' : undefined}
				title={collapsed ? item.label : undefined}
				class={cn(
					'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150',
					collapsed ? 'justify-center' : '',
					active
						? 'bg-artisan-primary font-semibold text-white shadow-sm'
						: 'font-medium text-artisan-muted hover:bg-white/60 hover:text-artisan-dark'
				)}
			>
				<!-- Active indicator strip -->
				{#if active}
					<span class="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-white"
					></span>
				{/if}

				<!-- Icon -->
				<span
					class={cn(
						'flex shrink-0 items-center justify-center transition-colors duration-150',
						active ? 'text-white' : 'text-artisan-muted group-hover:text-artisan-dark'
					)}
				>
					<item.icon class="h-4 w-4" />
				</span>

				{#if !collapsed}
					<span class="truncate">{item.label}</span>
				{/if}
			</a>
		{/each}
	</nav>

	<div class="flex-1"></div>

	<!-- Divider -->
	<div class="mx-3 border-t border-artisan-border/60"></div>

	<!-- Account Section Label -->
	{#if !collapsed}
		<p
			class="px-4 pt-3 pb-1 text-[10px] font-bold tracking-[0.18em] text-artisan-muted/70 uppercase"
		>
			Account
		</p>
	{:else}
		<div class="pt-2"></div>
	{/if}

	<!-- Bottom Menu -->
	<div class="flex flex-col gap-0.5 px-2 pb-4">
		<a
			href="/account"
			aria-label="My Account"
			title={collapsed ? 'My Account' : undefined}
			class={cn(
				'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-artisan-muted transition-all duration-150 hover:bg-white/60 hover:text-artisan-dark',
				collapsed ? 'justify-center' : ''
			)}
		>
			<User
				class="h-4 w-4 shrink-0 text-artisan-muted transition-colors group-hover:text-artisan-dark"
			/>
			{#if !collapsed}
				<span>My Account</span>
			{/if}
		</a>

		<button
			type="button"
			title={collapsed ? 'Sign Out' : undefined}
			class={cn(
				'group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-artisan-muted transition-all duration-150 hover:bg-red-50/80 hover:text-red-500',
				collapsed ? 'justify-center' : ''
			)}
		>
			<LogOut
				class="h-4 w-4 shrink-0 text-artisan-muted transition-colors group-hover:text-red-500"
			/>
			{#if !collapsed}
				<span>Sign Out</span>
			{/if}
		</button>
	</div>
</aside>
