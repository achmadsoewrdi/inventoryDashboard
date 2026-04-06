import { writable } from 'svelte/store';

// Control apakah Header layout ditampilkan atau tidak.
// Default: true (tampil). Set ke false dari halaman tertentu untuk menyembunyikan.
export const showHeader = writable(true);
