<script lang="ts">
	import { page } from '$app/state';
	import { Bell } from 'lucide-svelte';

	const routeTittle: Record<string, string> = {
		'/': 'Admin Home',
		'/inventory': 'Inventory Management'
	};

	let currentPath = $derived(page.url.pathname);
	let pageTittle = $derived(routeTittle[currentPath] || 'Dashboard');
</script>

<header
	class="flex items-center justify-between border-b border-gray-200 bg-[#AFB3A9]/10 px-8 py-3"
>
	<h1 class="font-manrope text-xl font-bold text-artisan-dark">
		{pageTittle}
	</h1>
	<button
		class="rounded-full p-2 text-gray-500 transition-colors hover:bg-artisan-active/10 hover:text-artisan-dark focus:bg-artisan-active/10 focus:text-artisan-dark"
	>
		<Bell />
	</button>
</header>
