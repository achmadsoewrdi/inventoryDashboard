<script lang="ts">
	type Props = {
		mode: 'login' | 'signup';
		onSwitchMode: () => void;
	};

	let { mode, onSwitchMode }: Props = $props();
</script>

<div class="flex h-full min-h-full flex-col justify-between bg-artisan-primary p-8">
	<!-- Brand -->
	<div class="text-xs font-bold tracking-[0.15em] uppercase text-white">Artisan Ops</div>

	<!-- Center text -->
	<div class="flex flex-col gap-4">
		{#if mode === 'login'}
			<h1 class="m-0 font-serif text-[2rem] leading-tight text-white italic">
				Kelola Bisnis<br />Kerajinan Anda<br />Dengan <span class="text-[#c8a96e]"
					>Lebih Cerdas</span
				>
			</h1>
			<p class="m-0 text-sm leading-relaxed text-white/80">
				Dashboard Manajemen Untuk<br />Pengrajin & Usaha Kreatif Indonesia
			</p>
		{:else}
			<h1 class="m-0 font-serif text-[2rem] leading-tight text-white italic">
				Mulai Perjalanan<br />Bisnis Anda<br />Bersama <span class="text-[#c8a96e]">Kami</span>
			</h1>
			<p class="m-0 text-sm leading-relaxed text-white/80">
				Bergabung dengan ribuan pengrajin<br />yang sudah mengelola bisnis mereka
			</p>
		{/if}
	</div>

	<!-- Switch mode CTA -->
	<div class="flex flex-col gap-2">
		{#if mode === 'login'}
			<p class="m-0 text-xs text-white/65">Belum punya akun?</p>
			<button
				class="w-fit cursor-pointer rounded-xl border border-white/35 bg-white/15 px-5 py-2.5 text-left text-sm font-medium text-white transition-all duration-200 hover:translate-x-0.5 hover:border-white/60 hover:bg-white/25"
				onclick={onSwitchMode}
			>
				Daftar Sekarang →
			</button>
		{:else}
			<p class="m-0 text-xs text-white/65">Sudah punya akun?</p>
			<button
				class="w-fit cursor-pointer rounded-xl border border-white/35 bg-white/15 px-5 py-2.5 text-left text-sm font-medium text-white transition-all duration-200 hover:translate-x-0.5 hover:border-white/60 hover:bg-white/25"
				onclick={onSwitchMode}
			>
				Masuk Sekarang →
			</button>
		{/if}
	</div>
</div>
