<script lang="ts">
  import type { Snippet } from 'svelte';

  type InputType = 'text' | 'search' | 'email' | 'number' | 'password';
  type InputSize = 'sm' | 'md' | 'lg';

  interface Props {
    type?: InputType;
    value?: string;
    placeholder?: string;
    name?: string;
    id?: string;
    size?: InputSize;
    label?: string;
    class?: string;
    disabled?: boolean;
    error?: boolean;
    errorMsg?: string;
    // Snippet props — nama berbeda dari import 'Snippet'
    leftIcon?: Snippet;
    rightIcon?: Snippet;
    oninput?: (e: Event & { currentTarget: HTMLInputElement }) => void;
    onchange?: (e: Event & { currentTarget: HTMLInputElement }) => void;
    onfocus?: (e: FocusEvent & { currentTarget: HTMLInputElement }) => void;
    onblur?: (e: FocusEvent & { currentTarget: HTMLInputElement }) => void;
    onkeydown?: (e: KeyboardEvent & { currentTarget: HTMLInputElement }) => void;
  }

  let {
    type = 'text',
    value = $bindable(''),
    placeholder = '',
    name = '',
    id = '',
    size = 'md',
    label = '',
    class: className = '',
    disabled = false,
    error = false,
    errorMsg = '',
    leftIcon,
    rightIcon,
    oninput,
    onchange,
    onfocus,
    onblur,
    onkeydown,
  }: Props = $props();

  const hasLeftIcon = $derived(type === 'search' || !!leftIcon);
  const showClearBtn = $derived(type === 'search' && value.length > 0);
  const hasRightIcon = $derived(!!rightIcon && !showClearBtn);

  function handleClear() {
    value = '';
  }

  const wrapperSize: Record<InputSize, string> = {
    sm: 'h-8 rounded-md',
    md: 'h-10 rounded-lg',
    lg: 'h-12 rounded-xl',
  };

  const inputTextSize: Record<InputSize, string> = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const borderClass = $derived(
    error
      ? 'border-red-300 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100'
      : 'border-stone-200 focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-100'
  );
</script>

<div class="flex w-full flex-col gap-1.5 {className}">

  {#if label}
    <label for={id} class="text-xs font-medium tracking-wide text-stone-500">
      {label}
    </label>
  {/if}

  <div
    class="
      relative flex w-full items-center border bg-white transition-all
      {wrapperSize[size]}
      {borderClass}
      {disabled ? 'cursor-not-allowed bg-stone-50 opacity-60' : ''}
    "
  >

    {#if type === 'search'}
      <span class="flex shrink-0 items-center pl-3 pr-2 text-stone-400" aria-hidden="true">
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5" />
          <path d="M11 11L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </span>
    {:else if leftIcon}
      <span class="flex shrink-0 items-center pl-3 pr-2 text-stone-400" aria-hidden="true">
        {@render leftIcon()}
      </span>
    {/if}

    <input
      {type}
      {id}
      {name}
      {disabled}
      {placeholder}
      bind:value
      {oninput}
      {onchange}
      {onfocus}
      {onblur}
      {onkeydown}
      autocomplete={type === 'search' ? 'off' : undefined}
      aria-invalid={error || undefined}
      aria-describedby={error && errorMsg ? `${id}-error` : undefined}
      class="
        h-full min-w-0 flex-1 bg-transparent outline-none
        placeholder:font-normal placeholder:text-stone-400
        disabled:cursor-not-allowed 
        {inputTextSize[size]}
        {hasLeftIcon ? 'pl-0' : 'pl-3'}
        {showClearBtn || hasRightIcon ? 'pr-0' : 'pr-3'}
      " 
    
    />

    {#if showClearBtn}
      <button
        type="button"
        onclick={handleClear}
        aria-label="Hapus pencarian"
        tabindex="-1"
        class="mr-2 flex size-6 shrink-0 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
      >
        <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
          <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </button>
    {:else if rightIcon}
      <span class="flex shrink-0 items-center pl-2 pr-3 text-stone-400" aria-hidden="true">
        {@render rightIcon()}
      </span>
    {/if}

  </div>

  {#if error && errorMsg}
    <p id="{id}-error" role="alert" class="flex items-center gap-1 text-xs text-red-500">
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" />
        <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
      {errorMsg}
    </p>
  {/if}


</div>


<style>
  /* Sembunyikan tombol "x" bawaan browser (Chrome, Edge, Safari) */
  input[type="search"]::-webkit-search-cancel-button {
    -webkit-appearance: none;
    appearance: none;
  }
</style>