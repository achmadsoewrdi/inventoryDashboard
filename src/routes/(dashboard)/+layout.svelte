<script lang="ts">
    import { onMount } from 'svelte'; // 1. Import onMount
    import { loadAuthFromStorage } from '$lib/stores/auth'; // 2. Import fungsi auth kamu

    import Sidebar from '$lib/components/layout/Sidebar.svelte';
    import Header from '$lib/components/layout/Header.svelte';
    import { showHeader } from '$lib/stores/layout';

    let { children } = $props();

    // 3. Panggil saat layout pertama kali dimuat di browser
    onMount(() => {
        loadAuthFromStorage();
    });
</script>

<div class="flex h-screen w-full overflow-hidden">
    <Sidebar />

    <div class="flex flex-1 flex-col overflow-hidden">
        {#if $showHeader}
            <Header />
        {/if}

        <main class="flex-1 overflow-y-auto p-6">
            {@render children()}
        </main>
    </div>
</div>