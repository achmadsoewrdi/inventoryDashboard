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
	import { goto } from '$app/navigation';
	import { clearAuth } from '$lib/stores/auth';

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

	function handleSignOut() {
		clearAuth();
		goto('/auth');
	}
</script>

<aside
	class={cn(
		'relative z-20 flex h-screen flex-col font-manrope transition-all duration-300 ease-in-out',
		'border-r border-artisan-border/60 bg-white',
		collapsed ? 'w-16' : 'w-64',
		className
	)}
>
	<button
		type="button"
		onclick={() => (collapsed = !collapsed)}
		class="absolute top-[26px] -right-3 z-30 flex h-6 w-6 items-center justify-center rounded-full border border-artisan-border bg-white shadow-sm transition-all hover:border-artisan-muted hover:bg-artisan-sidebar"
		aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
	>
		<ChevronLeft
			class={cn(
				'h-3 w-3 text-artisan-muted transition-transform duration-300',
				collapsed ? 'rotate-180' : 'rotate-0'
			)}
		/>
	</button>

	<div class="relative flex h-[68px] items-center overflow-hidden px-4">
		<div
			class={cn(
				'absolute left-4 flex flex-col gap-0.5 transition-all duration-300',
				collapsed ? 'invisible translate-x-[-10px] opacity-0' : 'visible translate-x-0 opacity-100'
			)}
		>
			<p class="text-[15px] font-extrabold whitespace-nowrap text-artisan-dark uppercase">
				Inventory Dashboard
			</p>
			<p
				class="text-[10px] font-semibold tracking-[0.2em] whitespace-nowrap text-artisan-muted uppercase"
			>
				Admin Dashboard
			</p>
		</div>

		<div
			class={cn(
				'absolute left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-lg bg-artisan-primary/10 text-artisan-primary transition-all duration-300',
				collapsed ? 'visible scale-100 opacity-100' : 'invisible scale-50 opacity-0'
			)}
		>
			<span class="text-xs font-black tracking-tight">AD</span>
		</div>
	</div>

	<div class="mx-3 mb-2 border-t border-artisan-border/60"></div>

	<div
		class={cn(
			'overflow-hidden transition-all duration-300',
			collapsed ? 'h-0 opacity-0' : 'h-5 opacity-100'
		)}
	>
		<p
			class="px-4 pb-1 text-[10px] font-bold tracking-[0.18em] whitespace-nowrap text-artisan-muted/70 uppercase"
		>
			Menu
		</p>
	</div>

	<nav class="flex flex-col gap-0.5 overflow-x-hidden px-2 py-1">
		{#each navItems as item (item.href)}
			{@const active = isActive(item.href)}
			<a
				href={item.href}
				aria-label={item.label}
				aria-current={active ? 'page' : undefined}
				title={collapsed ? item.label : undefined}
				class={cn(
					'group relative flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm transition-all duration-200',
					active
						? 'bg-artisan-primary font-semibold text-white shadow-sm'
						: 'font-medium text-artisan-muted hover:bg-white/60 hover:text-artisan-dark'
				)}
			>
				{#if active}
					<span class="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-white"
					></span>
				{/if}

				<span
					class={cn(
						'flex w-6 shrink-0 items-center justify-center transition-colors duration-150',
						active ? 'text-white' : 'text-artisan-muted group-hover:text-artisan-dark'
					)}
				>
					<item.icon class="h-4 w-4" />
				</span>

				<span
					class={cn(
						'overflow-hidden whitespace-nowrap transition-all duration-300',
						collapsed ? 'w-0 opacity-0' : 'w-[140px] opacity-100'
					)}
				>
					{item.label}
				</span>
			</a>
		{/each}
	</nav>

	<div class="flex-1"></div>

	<div class="mx-3 border-t border-artisan-border/60"></div>

	<div
		class={cn(
			'overflow-hidden transition-all duration-300',
			collapsed ? 'h-2 opacity-0' : 'h-8 pt-3 opacity-100'
		)}
	>
		<p
			class="px-4 pb-1 text-[10px] font-bold tracking-[0.18em] whitespace-nowrap text-artisan-muted/70 uppercase"
		>
			Account
		</p>
	</div>

	<div class="flex flex-col gap-0.5 overflow-x-hidden px-2 pb-4">
		<a
			href="/account"
			aria-label="My Account"
			title={collapsed ? 'My Account' : undefined}
			class={cn(
				'group relative flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium transition-all duration-200',
				'text-artisan-muted hover:bg-white/60 hover:text-artisan-dark'
			)}
		>
			<span class="flex w-6 shrink-0 items-center justify-center">
				<User class="h-4 w-4 text-artisan-muted transition-colors group-hover:text-artisan-dark" />
			</span>
			<span
				class={cn(
					'overflow-hidden whitespace-nowrap transition-all duration-300',
					collapsed ? 'w-0 opacity-0' : 'w-[140px] opacity-100'
				)}
			>
				My Account
			</span>
		</a>

		<button
			type="button"
			onclick={handleSignOut}
			title={collapsed ? 'Sign Out' : undefined}
			class={cn(
				'group relative flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium transition-all duration-200',
				'text-artisan-muted hover:bg-red-50/80 hover:text-red-500'
			)}
		>
			<span class="flex w-6 shrink-0 items-center justify-center">
				<LogOut class="h-4 w-4 text-artisan-muted transition-colors group-hover:text-red-500" />
			</span>
			<span
				class={cn(
					'overflow-hidden text-left whitespace-nowrap transition-all duration-300',
					collapsed ? 'w-0 opacity-0' : 'w-[140px] opacity-100'
				)}
			>
				Sign Out
			</span>
		</button>
	</div>
</aside>
