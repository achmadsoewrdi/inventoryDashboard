<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { loadAuthFromStorage } from '$lib/stores/auth'; // 1. Import fungsi ini

	let { children } = $props();

	// 2. Jalankan saat aplikasi pertama kali dimuat di browser
	$effect(() => {
		loadAuthFromStorage();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
