import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const authStore = writable<{
	token: string | null;
	user: { id: number; name: string; role: string } | null;
}>({
	token: null,
	user: null
});

export function setAuth(token: string, user: { id: number; name: string; role: string }) {
	authStore.set({ token, user });
	if (browser) {
		localStorage.setItem('token', token);
		localStorage.setItem('user', JSON.stringify(user));
	}
}

export function clearAuth() {
	authStore.set({ token: null, user: null });
	if (browser) {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
	}
}

export function loadAuthFromStorage() {
	if (browser) {
		const token = localStorage.getItem('token');
		const user = localStorage.getItem('user');
		if (token && user) {
			authStore.set({ token, user: JSON.parse(user) });
		}
	}
}
