<script lang="ts">
	import Button from '$lib/components/global/Button.svelte';
	import Input from '$lib/components/global/Input.svelte';
	import Badge from '$lib/components/global/Badge.svelte';
	import Checkbox from '$lib/components/global/Chekbox.svelte';
	import Dropdown from '$lib/components/global/Dropdown.svelte'; // ← fix import
	import DropdownMulti from '$lib/components/global/DropdownMulti.svelte';
	import { ArrowBigDown, Search } from 'lucide-svelte';
	import type { StockStatus } from '$lib/types/types';
	import Pagination from '$lib/components/global/Pagination.svelte';

	let page = $state(1);

	let val = $state('');
	const statuses: StockStatus[] = ['IN STOCK', 'LOW STOCK', 'OUT OF STOCK'];

	let item1Checked = $state(true);
	let item2Checked = $state(false);

	// Dropdown state — dipisah sesuai tipe
	let status = $state<string | null>(null);
	let kategori = $state<string | null>(null); // ← tambahkan ini
	let gudang = $state<string[]>([]);

	const stockOptions = [
		{ label: 'IN STOCK', value: 'IN_STOCK' },
		{ label: 'LOW STOCK', value: 'LOW_STOCK' },
		{ label: 'OUT OF STOCK', value: 'OUT_OF_STOCK' }
	];

	const kategoriOptions = [
		// ← tambahkan ini
		{ label: 'Elektronik', value: 'elektronik' },
		{ label: 'Pakaian', value: 'pakaian' },
		{ label: 'Makanan & Minuman', value: 'makanan' }
	];

	const gudangOptions = [
		{ label: 'Gudang Jakarta', value: 'jkt' },
		{ label: 'Gudang Bandung', value: 'bdg' },
		{ label: 'Gudang Surabaya', value: 'sby' }
	];
</script>

<div class=" flex flex-col gap-8">
	<!-- Buttons -->
	<section class="flex flex-wrap gap-3">
		<Button Icon={ArrowBigDown} iconPosition="right">Click Me</Button>
		<Button variant="outline">Click Me</Button>
		<Button variant="ghost">Click Me</Button>
	</section>

	<!-- Inputs -->
	<section class="flex w-96 flex-col gap-4">
		<Input type="password" placeholder="Email anda" />
		<Input bind:value={val} placeholder="Updated Range...">
			{#snippet rightIcon()}
				<Search size={15} />
			{/snippet}
		</Input>
	</section>

	<!-- Badges -->
	<section class="flex flex-wrap gap-3">
		{#each statuses as s (s)}
			<Badge status={s} />
		{/each}
	</section>

	<!-- Checkboxes -->
	<section class="flex max-w-sm flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6">
		<h2 class="text-sm font-semibold text-gray-700">Testing Checkbox Component</h2>
		<div class="flex flex-col gap-3">
			<Checkbox label="Pilih Barang 1" bind:checked={item1Checked} />
			<p class="text-xs text-gray-500">Status: {item1Checked}</p>

			<Checkbox label="Pilih Barang 2" bind:checked={item2Checked} />
			<p class="text-xs text-gray-500">Status: {item2Checked}</p>

			<Checkbox label="Indeterminate (Pilih Sebagian)" indeterminate={true} />
			<Checkbox label="Barang Habis (Disabled)" disabled={true} />
		</div>
	</section>

	<!-- Dropdowns -->
	<section class="flex max-w-sm flex-col gap-3">
		<Dropdown options={stockOptions} bind:value={status} placeholder="Pilih status..." />
		<p class="text-xs text-gray-500">Status: {status}</p>

		<Dropdown
			options={kategoriOptions}
			bind:value={kategori}
			placeholder="Pilih kategori..."
			searchable={true}
		/>
		<p class="text-xs text-gray-500">Kategori: {kategori}</p>

		<DropdownMulti options={gudangOptions} bind:value={gudang} placeholder="Pilih gudang..." />
		<p class="text-xs text-gray-500">Gudang: {gudang.join(', ')}</p>
	</section>

	<!-- Pagination -->
	<section class="flex flex-col gap-3">
		<h2 class="text-sm font-semibold text-gray-700">Testing Pagination</h2>

		<Pagination
			bind:currentPage={page}
			totalPages={6}
			totalItems={128}
			perPage={25}
			class="px-4 py-3"
		/>
	</section>
</div>
