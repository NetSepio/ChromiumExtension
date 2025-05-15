<script>
	import { Eye, EyeClosed, Disc3 } from "@lucide/svelte";
  import { askFlowId } from "$lib/modules/loginFunction"
  import { walletAddress } from "../../store/store";

  let password = $state('')

  let showPassword = $state(false)
  let error = $state('')
  let address = $state('')

  walletAddress.subscribe(value => address = value)

  async function handleSubmit(){
   
  }


</script>

<section class="h-full p-8 bg-[#101212] text-white text-center capitalize relative grid">
  <h1 class="font-bold h-fit">Password</h1>
  <div class="grid space-y-2 my-6">
    <h2 class="text-2xl font-bold">Set up your Password</h2>
  </div>
  <div class="grid space-y-4">
    <form class="relative grid space-y-2 text-sm">
      <labeL class='text-left font-bold'>password</labeL>
      <input type={showPassword ? "text" : "password"} class="bg-[#3b3b3bbd] border-none outline-[#00887d] rounded-lg py-2 px-4 placeholder:text-white/80" placeholder="Enter your password" bind:value={password} />
      {#if showPassword}
        <button onclick={() => showPassword = false}>
          <Eye class="absolute top-1/2 right-2 cursor-pointer"  size='20' color='#ffffff8f' />
        </button>
      {:else}
        <button onclick={() => showPassword = true}>
          <EyeClosed class="absolute top-1/2 right-2 cursor-pointer" onclick={() => showPassword = false} size='20' color='#ffffff8f' />
        </button>
      {/if}
    </form>
  </div>
  <button class="self-end w-full rounded-3xl py-2 text-black cursor-pointer bg-gradient-to-b from-[#0b8f84] to-[#00ccba]" onclick={handleSubmit}>Continue</button>
</section>

