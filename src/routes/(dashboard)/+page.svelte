<script lang="ts">
	import StatCard from '$lib/components/features/dashboard/StatCard.svelte';
	import { Package, AlertTriangle, Users } from 'lucide-svelte';

	// Contoh data mock (nantinya ini diambil dari data.stats)
	const stats = [
		{
			title: 'Total Products',
			value: '1,240',
			icon: Package,
			trend: { value: 12, isUp: true }
		},
		{
			title: 'Low Stock Items',
			value: '8',
			icon: AlertTriangle,
			trend: { value: 2, isUp: false } // Nilai turun/buruk
		},
		{
			title: 'Total Suppliers',
			value: '24',
			icon: Users
		}
	];
</script>

<div class="-p-6">
	<h1 class="mb-6 text-2xl font-bold text-artisan-dark">Inventory Overview</h1>
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each stats as stat (stat.title)}
			<StatCard title={stat.title} value={stat.value} Icon={stat.icon} trend={stat.trend} />
		{/each}
	</div>
</div>
