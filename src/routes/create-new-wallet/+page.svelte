<script lang='ts'>
  import {browser} from '$app/environment';
  import { Copy, ArrowLeft } from "@lucide/svelte";
  import { onboardingStepsLeft, mnemonicPhrase, privateKey, publicKey, setWalletAddress } from '../../store/store'
  import * as bip39 from 'bip39';
  import { createKeyPairSignerFromPrivateKeyBytes } from "@solana/kit";
  import { Buffer } from '$lib/utils/buffer';
  import { handleAuthPageAccess } from '$lib/helpers/authGuard';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';

	import Toast from '$lib/components/ui/toast.svelte';
  
  let toast = $state(false)
  let mnemonic = $state('')
  let seedPhrase = $derived(mnemonic.split(' '))
  let isCheckingAuth = $state(true)

  // Check if user should be redirected away from this auth page
  onMount(async () => {
    try {
      console.log('Create wallet page: Checking auth redirect...');
      await handleAuthPageAccess(page.url.pathname);
      console.log('Create wallet page: Auth check completed');
    } catch (error) {
      console.error('Create wallet page: Auth check failed:', error);
    } finally {
      isCheckingAuth = false;
    }
  });


  async function getSolPhrases() {
    try {
      console.log('Starting wallet generation...');
      
      mnemonic = bip39.generateMnemonic()
      console.log('Mnemonic generated successfully');
      
      const seed = bip39.mnemonicToSeedSync(mnemonic, "");
      const privateKeyBytes = seed.subarray(0, 32);
      const signer = await createKeyPairSignerFromPrivateKeyBytes(new Uint8Array(privateKeyBytes));
      
      console.log('Wallet signer created, address:', signer.address.toString());
      
      // Store wallet details securely
      privateKey.set(Buffer.from(privateKeyBytes).toString('hex'));
      publicKey.set(signer.address.toString());
      
      console.log('Private and public keys set in stores');
      console.log('About to call setWalletAddress with:', signer.address.toString());
      
      // Store wallet address using the secure function
      await setWalletAddress(signer.address.toString());
      
      console.log('setWalletAddress completed');
      
      // Verify the storage worked
      const retrievedAddress = await import('../../store/store').then(m => m.getWalletAddress());
      console.log('Verification - retrieved address:', retrievedAddress);
      
      // Store mnemonic temporarily in memory only
      await mnemonicPhrase.set(mnemonic);
      
      console.log('Wallet generation completed successfully');
      console.log('All wallet details stored securely');
    } catch (error) {
      console.error('Error generating wallet:', error);
      if (error instanceof Error) {
        console.error('Error stack:', error.stack);
      }
    }
  }


  function copyToClipboard() {
  navigator.clipboard.writeText(mnemonic)
  .then(() => {
    toast = true;
  })
  .catch((error) => {
      alert('Failed to copy words');
      console.error('Failed to copy words: ', error);
    });
  }

  $effect.pre(() => {
    if(mnemonic === ''){
    getSolPhrases()
    }
  })

  $effect(() => {
    if(toast){
      setTimeout(() => {
        toast = false
      }, 3000);
    }
  })
</script>

{#if isCheckingAuth}
<section class="h-full flex items-center justify-center bg-[#101212]">
  <div class="text-center space-y-4">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ccba] mx-auto"></div>
    <p class="text-white/70 text-sm">Checking authentication...</p>
  </div>
</section>
{:else}
<section class="h-full p-8 bg-[#101212] text-white text-center capitalize relative">
  <button class='absolute top-8 left-8 cursor-pointer' onclick={() => {
      onboardingStepsLeft.set(0)
      if (browser) {
        // Navigate to welcome page instead of using history.back()
        goto('/welcome', { replaceState: true });
      }
    }}>
    <ArrowLeft color='#00ccba' />
  </button>
  <h1 class="font-bold">create wallet</h1>
  <div class="grid space-y-2 my-6">
    <h2 class="text-2xl font-bold">Secret Recovery Phrase</h2>
    <h3 class="text-white/70 text-sm">Secure your identity and get started with your new wallet.</h3>
  </div>
  <div class="grid grid-cols-2 gap-4">
    {#each seedPhrase as seed, index}
      <div class="text-sm bg-[#1C1D21] rounded-4xl border border-[#4e4e4e46] py-1 px-3 flex items-center gap-1">
        <span class="text-white/50 basis-[5%]">{index + 1}.</span>
        <span class="bg-[#9e9e9e50] h-[90%] w-[1px] rounded-4xl"></span>
        <span>{seed}</span>
      </div>
    {/each}
  </div>
  
  <div class="grid space-y-2 mt-12">
    <div class="flex gap-2 items-center justify-center">
      <button onclick={copyToClipboard} class="capitalize text-sm text-[#00eeda] flex gap-2 my-2 justify-center cursor-pointer">
        <p>
          copy to clipboard
        </p>
        <Copy color='#00eeda' size='20' />
      </button>
      
    </div>
    <a class="w-full rounded-3xl py-2 text-black cursor-pointer bg-gradient-to-b from-[#0b8f84] to-[#00ccba]" href='/create-password' onclick={() => onboardingStepsLeft.set(1)}>Continue</a>
  </div>
</section>
{/if}


<Toast open={toast} success={false} error={false} status={'Copied to clipboard'} />
