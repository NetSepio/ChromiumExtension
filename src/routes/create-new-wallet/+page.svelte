<script lang='ts'>
  import { Copy, RefreshCw } from "@lucide/svelte";
  import { onboardingStepsLeft, mnemonicPhrase, privateKey, publicKey, walletAddress } from '../../store/store'
  import { ethers } from "ethers";
  import { onMount } from 'svelte';

  let mnemonic = $state('')
  let seedPhrase = $derived(mnemonic.split(' ')) 

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
    alert('Copied to clipboard')
  })
  .catch((error) => {
      alert('Failed to copy words');
      console.error('Failed to copy words: ', error);
    });
  }

  $effect.pre(() => {
    if(mnemonic === ''){
      getPhrases()
    }
  })

  // onMount(() => {
  // getPhrases()
  // });
</script>

<section class="h-full p-8 bg-[#101212] text-white text-center capitalize relative">
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
      <button class="bg-[#00eeda] size-8 rounded-full cursor-pointer relative group" onclick={getPhrases}>
        <RefreshCw class='m-auto' color='#000' size='18' />
        <div class="bg-[#313131bb] p-1 text-sm absolute -top-10 -right-12 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Regenerate
        </div>
      </button>
    </div>
    <a class="w-full rounded-3xl py-2 text-black cursor-pointer bg-gradient-to-b from-[#0b8f84] to-[#00ccba]" href='/create-password' onclick={() => onboardingStepsLeft.set(1)}>Continue</a>
  </div>
</section>