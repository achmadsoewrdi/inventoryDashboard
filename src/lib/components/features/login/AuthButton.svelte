<script lang="ts">
	type Props = {
		onclick: () => void;
		loading: boolean;
		label: string;
		loadingLabel?: string;
		variant: 'primary' | 'outline';
	};

	let { onclick, loading, label, loadingLabel = 'Memuat...', variant }: Props = $props();
</script>

<button
	{onclick}
	disabled={loading}
	class={[
		'w-full rounded-xl py-3.5 font-medium transition disabled:opacity-60',
		variant === 'primary'
			? 'bg-artisan-primary text-white hover:bg-artisan-active'
			: 'border border-artisan-border text-artisan-dark hover:bg-artisan-sidebar'
	].join(' ')}
>
	{loading ? loadingLabel : label}
</button>
