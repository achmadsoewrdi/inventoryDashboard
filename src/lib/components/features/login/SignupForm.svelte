<script lang="ts">
	import { goto } from '$app/navigation';
	import { env } from '$env/dynamic/public';
	import { setAuth } from '$lib/stores/auth';
	import InputField from './InputField.svelte';
	import AuthButton from './AuthButton.svelte';

	type Props = {
		onSwitchMode?: () => void;
	};

	let { onSwitchMode }: Props = $props();

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let errorMsg = $state('');
	let loading = $state(false);

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	async function handleSignup() {
		// Validasi frontend sebelum kirim ke API
		if (!name.trim()) {
			errorMsg = 'Nama lengkap wajib diisi';
			return;
		}
		if (!emailRegex.test(email)) {
			errorMsg = 'Format email tidak valid (contoh: user@example.com)';
			return;
		}
		if (password.length < 6) {
			errorMsg = 'Password minimal 6 karakter';
			return;
		}
		if (password !== confirmPassword) {
			errorMsg = 'Password tidak cocok';
			return;
		}

		loading = true;
		errorMsg = '';

		const res = await fetch(`${env.PUBLIC_API_URL}/auth/signup`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, email, password })
		});

		const data = await res.json();

		if (res.ok) {
			setAuth(data.token, data.user);
			goto('/');
		} else {
			errorMsg = data.message ?? 'Pendaftaran gagal';
		}

		loading = false;
	}
</script>

<div class="mb-4">
	<h2 class="mb-1 text-2xl font-semibold text-artisan-dark">Buat Akun Baru</h2>
	<p class="text-sm text-artisan-muted">
		daftarkan diri anda untuk mulai mengelola bisnis kerajinan anda
	</p>
</div>

{#if errorMsg}
	<div class="mb-3 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
		{errorMsg}
	</div>
{/if}

<div class="flex flex-col gap-3">
	<InputField
		type="text"
		label="Nama Lengkap"
		bind:value={name}
		placeholder="John Doe"
		icon="user"
	/>

	<InputField
		type="email"
		label="Email"
		bind:value={email}
		placeholder="admin@artisanops.com"
		icon="email"
	/>

	<InputField
		type="password"
		label="Password"
		bind:value={password}
		placeholder="••••••••••"
		icon="lock"
		showToggle={true}
	/>

	<InputField
		type="password"
		label="Konfirmasi Password"
		bind:value={confirmPassword}
		placeholder="••••••••••"
		icon="lock"
		showToggle={true}
	/>

	<AuthButton
		onclick={handleSignup}
		{loading}
		label="Daftar"
		loadingLabel="Memuat..."
		variant="primary"
	/>

	<!-- Mobile-only switch link -->
	{#if onSwitchMode}
		<p class="m-0 text-center text-[0.8125rem] text-artisan-muted">
			Sudah punya akun?
			<button
				class="cursor-pointer border-none bg-transparent p-0 font-semibold text-artisan-primary underline transition-opacity duration-200 hover:opacity-75"
				onclick={onSwitchMode}>Masuk sekarang</button
			>
		</p>
	{/if}
</div>
