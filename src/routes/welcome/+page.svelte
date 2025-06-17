<script>
	import { goto } from '$app/navigation';
  import { onboardingStepsLeft, chainName } from '../../store/store';
  import { handleAuthPageAccess } from '$lib/helpers/authGuard';
  import { onMount } from 'svelte';
  import { page } from '$app/state';

  let isCheckingAuth = $state(true);

  // Check if user should be redirected away from this auth page
  onMount(async () => {
    try {
      console.log('Welcome page: Checking auth redirect...');
      await handleAuthPageAccess(page.url.pathname);
      console.log('Welcome page: Auth check completed');
    } catch (error) {
      console.error('Welcome page: Auth check failed:', error);
    } finally {
      isCheckingAuth = false;
    }
  });

  function goToImport(){
    onboardingStepsLeft.set(2)
    goto("/import-wallet")
  }

  function goToCreate(){
    onboardingStepsLeft.set(2)
    goto("/create-new-wallet")
  }

</script>

{#if isCheckingAuth}
<section class="h-full flex items-center justify-center bg-[#101212]">
  <div class="text-center space-y-4">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ccba] mx-auto"></div>
    <p class="text-white/70 text-sm">Checking authentication...</p>
  </div>
</section>
{:else}
<section class="bg-[#101212] h-full px-8 pt-10 pb-8 flex flex-col justify-between items-center">
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
{/if}