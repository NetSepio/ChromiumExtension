<script lang="ts">
	import { formatWalletAddress } from '$lib/helpers/formatWalletAddress';
  import { mnemonicPhrase, onboardingStepsLeft, privateKey, publicKey, walletAddress} from '../../store/store'
  import { ethers } from 'ethers';

  let error = $state('')
  let seedPhrase = $state('')
  let userAddress = $state('')
  let pubKey = $state('')
  let privKey = $state('')

// Function to handle the form submission
  const handleSubmit = async () => {
    if (seedPhrase !== '') {
      error = '';
      seedPhrase = seedPhrase.trim();
      try {
       
        const account = ethers.Wallet.fromPhrase(seedPhrase)
        if (account !== null) {
          // Extract account details from the found wallet
          userAddress = account.address;
          pubKey = account.publicKey
          privKey = account.privateKey;
        } else {
          error = 'No wallet found';
        }
      } catch (err) {
        error = 'Something wrong!';
      }
    } else {
      error = 'Enter a valid key';
    }
  };

 
  function handleContinue() {
    publicKey.set(pubKey);
		privateKey.set(privKey);
		walletAddress.set(userAddress);
		mnemonicPhrase.set(seedPhrase);
    onboardingStepsLeft.set(1)
  }

</script>

<section class="h-full p-8 bg-[#101212] text-white text-center capitalize relative grid">
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