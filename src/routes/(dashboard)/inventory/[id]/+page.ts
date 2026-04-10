import { env } from '$env/dynamic/public';
import { browser } from '$app/environment';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const ssr = false;

export const load: PageLoad = async ({ fetch, params }) => {
	try {
		let token = null;
		if (browser) token = localStorage.getItem('token');

		const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
		const productId = params.id;

		// enpoint Get
		const res = await fetch(`${env.PUBLIC_API_URL}/products/${productId}`, { headers });
		if (!res.ok) {
			if (res.status === 404) throw error(404, 'Produk Tidak ditemukan');
			throw error(res.status, 'Gagal Memuat detail Produk');
		}

		const product = await res.json();

		return {
			product
		};
	} catch (e) {
		console.error('Terjadi kesalahan Jaringan', e);
		throw e;
	}
};
