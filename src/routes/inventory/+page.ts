import { env } from '$env/dynamic/public';
import type { PageLoad } from './$types';
import { toInventoryItem, type InventoryListResponse } from '$lib/types/types';

export const load: PageLoad = async ({ fetch }) => {
    // Memanggil API Fastify di: http://localhost:3000/products
    const response = await fetch(`${env.PUBLIC_API_URL}/products`);
    
    const rawData = (await response.json()) as InventoryListResponse; 
    
    const formattedProducts = rawData.data.map(product => toInventoryItem(product));
    return {
        products: formattedProducts
    };
}
