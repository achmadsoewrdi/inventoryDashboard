<script lang="ts">
	import AuthPanel from '$lib/components/features/login/AuthPanel.svelte';
	import LoginForm from '$lib/components/features/login/LoginForm.svelte';
	import SignupForm from '$lib/components/features/login/SignupForm.svelte';

	let mode = $state<'login' | 'signup'>('login');

	const isSignup = $derived(mode === 'signup');

	function switchToSignup() {
		mode = 'signup';
	}
	function switchToLogin() {
		mode = 'login';
	}
</script>

<svelte:head>
	<title>{isSignup ? 'Daftar' : 'Masuk'} — Artisan Ops</title>
</svelte:head>

<!-- Full-screen centered page -->
<div class="flex h-screen items-center justify-center bg-artisan-bg p-4">
	<!-- Card -->
	<div
		class="relative w-full max-w-[860px] overflow-hidden rounded-2xl border border-[#e0d9ce] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
		style="height: clamp(480px, calc(100vh - 2rem), 560px);"
	>
		<!-- Login form: positioned on the RIGHT side (58% width, offset 42% from left) -->
		<div
			class="absolute top-0 left-[42%] z-0 flex h-full w-[58%] items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
			style="opacity: {isSignup ? '0' : '1'}; pointer-events: {isSignup ? 'none' : 'auto'};"
		>
			<div class="w-full max-w-[20rem] px-8">
				<LoginForm onSwitchMode={switchToSignup} />
			</div>
		</div>

		<!-- Signup form: positioned on the LEFT side (58% width, from left edge) -->
		<div
			class="absolute top-0 left-0 z-0 flex h-full w-[58%] items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
			style="opacity: {isSignup ? '1' : '0'}; pointer-events: {isSignup ? 'auto' : 'none'};"
		>
			<div class="w-full max-w-[20rem] px-8">
				<SignupForm onSwitchMode={switchToLogin} />
			</div>
		</div>

		<!-- Panel overlay: 42% wide, slides between left (login) and right (signup) -->
		<div
			class="absolute top-0 left-0 z-10 h-full w-[42%] transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] will-change-transform"
			style="transform: translateX({isSignup ? 'calc(100% / 42 * 58)' : '0%'});"
		>
			<AuthPanel {mode} onSwitchMode={isSignup ? switchToLogin : switchToSignup} />
		</div>
	</div>
</div>
