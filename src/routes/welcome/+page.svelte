<script>
	import { goto } from '$app/navigation';
	import Toast from '$lib/components/ui/toast.svelte';
  import { onboardingStepsLeft, chainName } from '../../store/store'
 
  let chain = $state('')
  let dropdown = $state(false)
  let error = $state(false)
  let toast = $state(false)


  function goToImport(){
    if (chain === '') {
      error = true
      toast = true
      return
    }
    
    onboardingStepsLeft.set(2)
    goto("/import-wallet")
  }

  function goToCreate(){
    if (chain === '') {
      error = true
      toast = true
      return
    }
    
    onboardingStepsLeft.set(2)
    goto("/create-new-wallet")
  }
  
  $effect(() => {
    if (toast){
      setTimeout(() => {
        toast = false
        error = false
      }, 3000);
    }
  })

</script>

<section class="bg-[#101212] h-full px-8 pt-10 pb-8 flex flex-col justify-between items-center">
  <div class="flex items-center justify-center relative cursor-pointer">
    <button class="bg-[#00ccba] py-2 px-6 rounded-3xl capitalize" onclick={() => dropdown = true}>
      {#if chain === ''}
        Select Chain
      {:else}
        {chain}
      {/if}
    </button>
    {#if dropdown}
    <div class="rounded-lg bg-[#121212]/80 px-2 text-white/80 space-y-2 absolute top-10 cursor-pointer w-full">
      <button onclick={() => {
        chain = 'solana'
        chainName.set('sol')
        dropdown = false
        }}>
        Solana
      </button>
      <hr class="bg-white/50" />
      <button onclick={() => {
        chain = 'peaq'
        chainName.set('peaq')
        dropdown = false
        }}>
        Peaq
      </button>
    </div>
    {/if}
  </div>
  <div class="grid space-y-6 text-center">
    <img src="/assets/intro.png" alt="wallet intro" class="size-72" />
    <div>
      <h1 class="text-xl text-white font-bold">Only Wallet You Need</h1>
      <h2 class='text-white/75 text-sm'>
        The user friendly, non custodial blockchain agnostic wallet
      </h2>
    </div>
  </div>
  <div class="grid space-y-3 w-full text-center">
    <button class='cursor-pointer text-[#00eeda] hover:underline' onclick={goToImport}>I already have a wallet</button>
    <button class="w-full rounded-3xl py-2 text-black cursor-pointer bg-gradient-to-b from-[#0b8f84] to-[#00ccba]" onclick={goToCreate}>Create new wallet</button>
  </div>
</section>


<Toast open={toast} success={false} error={error} status={'Select a chain'} /> 