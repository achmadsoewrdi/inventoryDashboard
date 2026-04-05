<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import Header from '$lib/components/layout/Header.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex h-screen w-full overflow-hidden">
	<Sidebar />

	<div class="flex flex-1 flex-col overflow-hidden">
		<Header />

		<main class="flex-1 overflow-y-auto p-8">
			{@render children()}
		</main>
	</div>
</div>
