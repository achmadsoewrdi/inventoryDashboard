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

	let email = $state('');
	let password = $state('');
	let rememberMe = $state(false);
	let errorMsg = $state('');
	let loading = $state(false);

	async function handleLogin() {
		loading = true;
		errorMsg = '';

		const res = await fetch(`${env.PUBLIC_API_URL}/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		const data = await res.json();

		if (res.ok) {
			setAuth(data.token, data.user);
			goto('/');
		} else {
			errorMsg = data.message ?? 'Email atau password salah';
		}

		loading = false;
	}
</script>

<div class="mb-5">
	<h2 class="mb-1 text-2xl font-semibold text-artisan-dark">Masuk Ke Akun Anda</h2>
	<p class="text-sm text-artisan-muted">selamat datang kembali silahkan masukan detail akun anda</p>
</div>

{#if errorMsg}
	<div class="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
		{errorMsg}
	</div>
{/if}

<div class="flex flex-col gap-3.5">
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

	<!-- Remember me & Lupa password -->
	<div class="flex items-center justify-between">
		<label class="flex cursor-pointer items-center gap-2">
			<input type="checkbox" bind:checked={rememberMe} class="h-4 w-4 rounded accent-[#047857]" />
			<span class="text-sm text-artisan-muted">Ingat Saya</span>
		</label>
		<a
			href="/forgot-password"
			class="text-sm text-artisan-muted transition hover:text-artisan-primary"
		>
			Lupa Password?
		</a>
	</div>

	<AuthButton
		onclick={handleLogin}
		{loading}
		label="Masuk"
		loadingLabel="Memuat..."
		variant="primary"
	/>

	<!-- Mobile-only switch link -->
	{#if onSwitchMode}
		<p class="m-0 text-center text-[0.8125rem] text-artisan-muted">
			Belum punya akun?
			<button
				class="cursor-pointer border-none bg-transparent p-0 font-semibold text-artisan-primary underline transition-opacity duration-200 hover:opacity-75"
				onclick={onSwitchMode}>Daftar sekarang</button
			>
		</p>
	{/if}
</div>
