<script lang="ts">
	import {
		LayoutDashboard,
		Package,
		Map,
		FileBarChart2,
		User,
		LogOut,
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
	let currentPath = $derived(page.url.pathname);

	const navItems: NavItem[] = [
		{ label: 'Admin Home', href: '/', icon: LayoutDashboard },
		{ label: 'Inventory Management', href: '/inventory', icon: Package },
		{ label: 'Warehouse Map', href: '/warehouse', icon: Map },
		{ label: 'Supply Reports', href: '/reports', icon: FileBarChart2 }
	];

	const isActive = (href: string) => currentPath === href;
</script>

<aside class={cn('flex h-screen w-64 flex-col bg-artisan-sidebar font-manrope', className)}>
	<!-- Logo -->
	<div class="px-6 py-6">
		<p class="text-base font-bold tracking-wide text-artisan-dark">ARTISAN OPS</p>
		<p class="text-xs font-medium tracking-widest text-artisan-muted">ADMIN DASHBOARD</p>
	</div>

	<div class="mx-4 border-t border-artisan-border"></div>

	<!-- Nav Items -->
	<nav class="flex flex-col gap-1 px-3 py-4">
		{#each navItems as item (item.href)}
			{@const active = isActive(item.href)}
			<a
				href={item.href}
				aria-label={item.label}
				aria-current={active ? 'page' : undefined}
				class={cn(
					'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
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
				{item.label}
			</a>
		{/each}
	</nav>

	<div class="flex-1"></div>

	<div class="mx-4 border-t border-artisan-border"></div>

	<!-- Bottom Menu -->
	<div class="flex flex-col gap-1 px-3 py-4">
		<a
			href="/account"
			aria-label="My Account"
			class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-artisan-muted transition-colors hover:bg-artisan-active/10 hover:text-artisan-dark"
		>
			<User class="h-4 w-4 shrink-0 text-artisan-muted" />
			My Account
		</a>

		<button
			type="button"
			class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-artisan-muted transition-colors hover:bg-artisan-active/10 hover:text-artisan-dark"
		>
			<LogOut class="h-4 w-4 shrink-0 text-artisan-muted" />
			Sign Out
		</button>
	</div>
</aside>
