<script>
	import { Check, Info, X } from "@lucide/svelte";
	import { fade } from "svelte/transition";

  let { status, success, error, open} = $props();

  // Auto-hide toast after 3 seconds
  $effect(() => {
    if (open) {
      const timer = setTimeout(() => {
        open = false;
      }, 3000);
      return () => clearTimeout(timer);
    }
  });

</script>

{#if open}
<div class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 py-2 px-3 text-white bg-[#111111] rounded-lg shadow-lg border border-[#333] max-w-[300px]" transition:fade>
    {#if success}
      <Check color="#24ff3d" size="16" />
    {:else if error}
      <X color="#ff3a24" size="16" />
    {:else}
      <Info color="#ffaf24" size="16" />
    {/if}
  <span class="text-sm truncate">{status}</span>
</div>
{/if}