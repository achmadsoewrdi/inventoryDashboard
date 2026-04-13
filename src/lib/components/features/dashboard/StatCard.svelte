<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	interface Props {
		title: string;
		value: string | number;
		trend?: { value: number; isUp: boolean };
		Icon?: typeof SvelteComponent<{ class?: string }>;
	}

	let { title, value, trend, Icon: Icon }: Props = $props();
</script>

<div class="rounded-xl border border-artisan-border bg-white p-5 shadow-sm">
	<div class="flex items-start justify-between">
		<div>
			<p class="text-xs font-medium tracking-wider text-artisan-muted uppercase">
				{title}
			</p>
			<h3 class="mt-2 text-2xl font-bold text-artisan-dark">
				{value}
			</h3>
			{#if trend}
				<p class="mt-2 flex items-center text-xs {trend.isUp ? 'text-green-600' : 'text-red-600'}">
					<span>{trend.isUp ? '↑' : '↓'} {trend.value}%</span>
					<span class="ml-1 text-[10px] text-artisan-muted italic">vs last month</span>
				</p>
			{/if}
		</div>

		{#if Icon}
			<div class="rounded-lg bg-artisan-sidebar p-2 text-artisan-primary">
				<Icon class="h-5 w-5" />
			</div>
		{/if}
	</div>
</div>
