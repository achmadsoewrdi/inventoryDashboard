<script lang="ts">
    import Chekbox from '$lib/components/global/Chekbox.svelte';
    // Asumsi path komponen Button kamu ada di sini, sesuaikan jika berbeda
    import Button from '$lib/components/global/Button.svelte'; 
    import type { InventoryItem } from '$lib/types/types';
    import InventoryTableRow from './InventoryTableRow.svelte';
    import { goto } from '$app/navigation'; // Import fungsi navigasi SvelteKit

    interface Props {
        items: InventoryItem[];
        selectedIds: Set<number>;
        isAdmin: boolean; // [Gunakan ini sebagai gatekeeper]
        onSelectAll: (checked: boolean) => void;
        onToggleSelection: (id: number) => void;
        onView?: (item: InventoryItem) => void;
        onEdit?: (item: InventoryItem) => void;
        onDelete?: (item: InventoryItem) => void;
    }

    let {
        items = [],
        selectedIds,
        isAdmin = false,
        onSelectAll,
        onToggleSelection,
        onView,
        onEdit,
        onDelete
    }: Props = $props();

    let allSelected = $derived(items.length > 0 && selectedIds.size === items.length);
    let someSelected = $derived(selectedIds.size > 0 && selectedIds.size < items.length);

    // Fungsi untuk menangani klik tombol tambah
    const handleAddItem = () => {
        goto('/inventory/add-item');
    };
</script>

<div class="space-y-4">
    
    <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-artisan-dark">Inventory List</h2>
        
        {#if isAdmin}
            <Button variant="primary" size="md" onClick={handleAddItem}>
                + Add Item
            </Button>
        {/if}
    </div>

    <div class="overflow-hidden rounded-xl border border-artisan-border bg-white shadow-sm">
        <div class="overflow-x-auto">
            <table class="w-full min-w-[800px] text-left text-sm">
                <thead class="border-b border-artisan-border/60 bg-artisan-sidebar text-artisan-muted">
                    <tr>
                        <th class="w-12 p-4 text-center font-medium">
                            <Chekbox
                                checked={allSelected}
                                indeterminate={someSelected}
                                onChange={(e) => onSelectAll((e.target as HTMLInputElement).checked)}
                            />
                        </th>
                        <th class="p-4 text-[10px] font-medium tracking-wider uppercase">Product Info</th>
                        <th class="p-4 text-[10px] font-medium tracking-wider uppercase">SKU</th>
                        <th class="p-4 text-[10px] font-medium tracking-wider uppercase">Category</th>
                        <th class="p-4 text-[10px] font-medium tracking-wider uppercase">Stock</th>
                        <th class="p-4 text-[10px] font-medium tracking-wider uppercase">Status</th>
                        <th class="p-4 text-center text-[10px] font-medium tracking-wider uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#if items.length === 0}
                        <tr>
                            <td colspan="7" class="p-8 text-center text-artisan-muted">
                                Tidak ada data produk ditemukan.
                            </td>
                        </tr>
                    {:else}
                        {#each items as item (item.id)}
                            <InventoryTableRow
                                {item}
                                {isAdmin}
                                selected={selectedIds.has(item.id)}
                                {onToggleSelection}
                                {onView}
                                {onEdit}
                                {onDelete}
                            />
                        {/each}
                    {/if}
                </tbody>
            </table>
        </div>
    </div>
</div>