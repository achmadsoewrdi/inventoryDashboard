import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = () => {
	if (browser) {
		const token = localStorage.getItem('token');
		if (!token) {
			throw redirect(307, '/auth');
		}
	}

	return {};
};
