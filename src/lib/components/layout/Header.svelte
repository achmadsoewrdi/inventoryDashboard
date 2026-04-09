<script lang="ts">
	import { page } from '$app/state';

	const routeTittle: Record<string, string> = {
		'/': 'Admin Home',
		'/inventory': 'Inventory Management'
	};

	let currentPath = $derived(page.url.pathname);
	let pageTittle = $derived(routeTittle[currentPath] || 'Dashboard');
</script>

<header class="flex items-center justify-between border-b border-artisan-border bg-white px-8 py-5">
	<h1 class="font-manrope text-xl font-bold text-artisan-dark">
		{pageTittle}
	</h1>
</header>
