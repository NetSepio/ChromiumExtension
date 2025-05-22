<script>
	import { Check, Info, X } from "@lucide/svelte";
	import { fade } from "svelte/transition";

  let { status, success, error, open} = $props();

  $inspect(open)

</script>

{#if open}
<div class="fixed top-10 left-10 flex gap-4 py-3 px-4 text-white bg-[#111111] rounded-lg shadow-lg" transition:fade>
    {#if success}
      <Check color="#24ff3d" />
    {:else if error}
      <X color="#ff3a24" />
    {:else}
      <Info color="#ffaf24" />
    {/if}
  {status}
</div>
{/if}