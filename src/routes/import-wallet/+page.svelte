<script lang="ts">
  import {browser} from '$app/environment';
  import { ArrowLeft } from "@lucide/svelte";
	import { formatWalletAddress } from '$lib/helpers/formatWalletAddress';
  import { mnemonicPhrase, onboardingStepsLeft, privateKey, publicKey, setWalletAddress} from '../../store/store'
  import * as bip39 from 'bip39';
  import { createKeyPairSignerFromPrivateKeyBytes } from "@solana/kit";
 import { Buffer } from 'buffer';
 import { handleAuthPageAccess } from '$lib/helpers/authGuard';
 import { onMount } from 'svelte';
 import { page } from '$app/state';
 
import { derivePath } from 'ed25519-hd-key';


  let error = $state('')
  let seedPhrase = $state('')
  let userAddress = $state('')
  let pubKey = $state('')
  let privKey = $state('')
  let isCheckingAuth = $state(true)

  // Check if user should be redirected away from this auth page
  onMount(async () => {
    try {
      console.log('Import wallet page: Checking auth redirect...');
      await handleAuthPageAccess(page.url.pathname);
      console.log('Import wallet page: Auth check completed');
    } catch (error) {
      console.error('Import wallet page: Auth check failed:', error);
    } finally {
      isCheckingAuth = false;
    }
  });

const checkDerivationPaths = async (seedPhrase: string) => {
  const derivationPaths = [
    "m/44'/501'/0'/0'",
    "m/44'/501'/0'",
    "m/44'/501'/0'/0'/0'",
    "m/44'/501'/1'/0'",
  ];

  const seed = bip39.mnemonicToSeedSync(seedPhrase.trim(), "");
  
  console.log("=== Checking Derivation Paths ===");
  
  // Try derivation paths first
  for (const path of derivationPaths) {
    try {
      const derivedSeed = derivePath(path, seed.toString('hex')).key;
      const signer = await createKeyPairSignerFromPrivateKeyBytes(derivedSeed);
      const address = signer.address.toString();
      
      console.log(`Path: ${path} -> Address: ${address}`);
      
      if (signer) {
        return { 
          signer, 
          address, 
          privateKey: Buffer.from(derivedSeed).toString('hex'),
          method: `derivation path: ${path}`
        };
      }
    } catch (error) {
      console.log(`Path: ${path} - Error: ${error}`);
    }
  }
  
  // Fallback to current method
  try {
    const privateKeyBytes = seed.subarray(0, 32);
    const signer = await createKeyPairSignerFromPrivateKeyBytes(new Uint8Array(privateKeyBytes));
    const address = signer.address.toString();
    
    console.log(`Current Method (first 32 bytes) -> Address: ${address}`);
    
    if (signer) {
      return { 
        signer, 
        address, 
        privateKey: Buffer.from(privateKeyBytes).toString('hex'),
        method: "current method (first 32 bytes)"
      };
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Current method error: ${error.message}`);
    } else {
      console.log(`Current method error:`, error);
    }
  }
  
  return null;
};

// function to handle the submit action
// This function checks the seed phrase and tries to derive the wallet address
const handleSubmit = async () => {
  if (typeof window !== 'undefined') {
    window.Buffer = Buffer;
  }
  
  if (seedPhrase !== '') {
    error = '';
    seedPhrase = seedPhrase.trim();
    
    try {
      const result = await checkDerivationPaths(seedPhrase);
      
      if (result) {
        console.log(`✅ Wallet found using: ${result.method}`);
        userAddress = result.address;
        pubKey = result.address;
        privKey = result.privateKey;
      } else {
        error = 'No wallet found';
      }
    } catch (err) {
      console.error('Error:', err);
      error = 'Something wrong!';
    }
  } else {
    error = 'Enter a valid key';
  }
};

 
  async function handleContinue() {
    try {
      console.log('Starting wallet import process...');
      
      publicKey.set(pubKey);
      privateKey.set(privKey);
      
      console.log('Importing wallet address:', userAddress);
      
      // Store wallet address using the secure function
      await setWalletAddress(userAddress);
      
      // Store mnemonic temporarily in memory only
      await mnemonicPhrase.set(seedPhrase);
      
      onboardingStepsLeft.set(1);
      
      console.log('Wallet import completed successfully');
      console.log('Wallet details stored securely');
    } catch (error) {
      console.error('Error during wallet import:', error);
      error = 'Failed to import wallet. Please try again.';
    }
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
<section class="h-full p-8 bg-[#101212] text-white text-center capitalize relative grid">
  <button class='absolute top-8 left-8 cursor-pointer' onclick={() => {
      onboardingStepsLeft.set(0)
      if (browser) {
        history.back();
      }
    }}>
    <ArrowLeft color='#00ccba' />
  </button>
  <h1 class="font-bold h-fit">Import Wallet</h1>
  <div class="grid space-y-2 my-6">
    <h2 class="text-2xl font-bold">Secret Recovery Phrase</h2>
    <h3 class="text-white/70 text-sm">Paste in your secret recovery phrase.</h3>
  </div>
  {#if userAddress !== ''}
    <div class="text-sm text-center">
      <h3 class="font-bold">Wallet has been found</h3>
      <p class="text-[#0b8f84]"
					>{formatWalletAddress(userAddress)}</p
				>
    </div>
  {:else}
    <div>
      <p class='text-sm text-centertext-red-800'>
        {error.length > 0 ? `${error}` : `Enter the seed phrase with a single blank space.`}
      </p>
    </div>
  {/if}
  <textarea bind:value={seedPhrase} name="recovery phrase" rows="2" cols="30" class="bg-[#3b3b3bbd] border-none outline-[#00887d] rounded-lg py-2 px-4 placeholder:text-white/80" placeholder="Enter your secret phrase here"></textarea>
  {#if userAddress !== ''}
    <a class="self-end w-full rounded-3xl py-2 text-black cursor-pointer bg-gradient-to-b from-[#0b8f84] to-[#00ccba]" href='/create-password' onclick={handleContinue}>Continue</a>
  {:else}
    <button class="self-end w-full rounded-3xl py-2 text-black cursor-pointer bg-gradient-to-b from-[#0b8f84] to-[#00ccba]" onclick={handleSubmit}>Submit</button>
  {/if}
</section>
{/if}
