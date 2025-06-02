<script lang='ts'>
  import {browser} from '$app/environment';
  import { Copy, RefreshCw, ArrowLeft } from "@lucide/svelte";
  import { onboardingStepsLeft, mnemonicPhrase, privateKey, publicKey, walletAddress, chainName } from '../../store/store'
  import { ethers } from "ethers";
  import * as bip39 from 'bip39';
  import { createKeyPairSignerFromPrivateKeyBytes } from "@solana/kit";
  import { Buffer } from 'buffer';
	import { goto } from '$app/navigation';
	import Toast from '$lib/components/ui/toast.svelte';
  
  let toast = $state(false)
  let chain = $state('')
  let mnemonic = $state('')
  let seedPhrase = $derived(mnemonic.split(' ')) 

  chainName.subscribe(value => chain = value)

  // console.log(chain)

  async function getSolPhrases() {
    if (typeof window !== 'undefined') {
        window.Buffer = Buffer;
    }

    mnemonic = bip39.generateMnemonic()
    
    const seed = bip39.mnemonicToSeedSync(mnemonic, "");
    const privateKeyBytes = seed.subarray(0, 32);
    const signer = await createKeyPairSignerFromPrivateKeyBytes(new Uint8Array(privateKeyBytes));

    console.log(signer.address.toString())
    


    // Store wallet details
    privateKey.set(Buffer.from(privateKeyBytes).toString('hex'));
    publicKey.set(signer.address.toString());
    walletAddress.set(signer.address.toString());
    mnemonicPhrase.set(mnemonic);
  }


  async function getPhrases() {
  const phrases = ethers.Wallet.createRandom()
  mnemonic = phrases.mnemonic ? phrases.mnemonic.phrase : ''

  // Setting store values
  privateKey.set(phrases.privateKey)
  publicKey.set(phrases.publicKey)
  walletAddress.set(phrases.address)
  mnemonicPhrase.set(mnemonic);
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
    if(chain === '' || chain === null) {
      goto('/welcome')
    }else if (mnemonic === '' && chain === 'sol') {
      getSolPhrases()
    } else if(mnemonic === '' && chain=='peaq') {
      getPhrases()
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

<section class="h-full p-8 bg-[#101212] text-white text-center capitalize relative">
  <button class='absolute top-8 left-8 cursor-pointer' onclick={() => {
      onboardingStepsLeft.set(0)
      if (browser) {
        history.back();
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


<Toast open={toast} success={false} error={false} status={'Copied to clipboard'} />
<!-- busy sort soup envelope puzzle mountain desk sketch divert sail odor disagree -->