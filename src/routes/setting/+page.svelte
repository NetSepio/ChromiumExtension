<script>
	import Dialog from "$lib/components/ui/dialog.svelte";
	import VpnHeader from "$lib/components/ui/vpn-header.svelte";
	import { Bitcoin, Wallet } from "@lucide/svelte";
  import { mnemonicPhrase, setJwtToken, walletAddress, onboardingStepsLeft, } from "../../store/store";
	import { goto } from "$app/navigation";

  let lockWalletModal = $state(false)
  let showResetModal = $state(false)
  let captcha = $state(false)
  let value = $state('')

  
	// Function to handle locking the wallet
	const handleLockWallet = async () => {
		// Remove the mnemonic phrase from the store
		await mnemonicPhrase.remove();
		// Update the wallet unlock status and hide the modal
	  lockWalletModal = false;
    goto('/sign-in')
	};

  	// Function to handle the logout/reset action
	const handleLogout = async () => {
		// Clearing sensitive data and resetting states
		await mnemonicPhrase.remove();
		setJwtToken('');
		walletAddress.set('');
		onboardingStepsLeft.set(3);
		localStorage.removeItem('encryptedMnemonic');
		localStorage.removeItem('iv');
		localStorage.removeItem('mnemonicHash');
		showResetModal = false;
	};

</script>

<section class="h-full pt-4 pb-8 px-8 bg-[#101212] text-white text-center capitalize relative text-sm">
  <VpnHeader wallet={false} />
  <div class="flex flex-col gap-8 items-center justify-center h-full">
    <button class="rounded-3xl py-2 px-8 bg-[#3f3f3fe5] text-[#0eafa2] flex items-center justify-center w-56 gap-2">
      <Bitcoin />
      <span>Show Seed Phrase</span>
    </button>
    <button aria-label="lock wallet" class="rounded-3xl py-2 px-8 bg-[#3f3f3fe5] text-[#0eafa2] flex items-center justify-center w-56 gap-2">
      <Wallet />
      <span>Lock your wallet</span>
    </button>
    <button aria-label="lock wallet" class="rounded-3xl py-2 px-8 text-black bg-[#0eafa2] flex items-center justify-center w-56 gap-2">
      <Wallet />
      <span>Lock your wallet</span>
    </button>
  </div>
</section>

<Dialog open={lockWalletModal} onClose={() => lockWalletModal = false}>
  <div class='bg-[#1012125e] rounded-lg p-4'>
    <h2 class='text-base font-bold'>Are you sure you want to lock your wallet</h2>
    <div class="flex w-full justify-center items-center gap-4 mt-8 text-sm">
      <button class="w-full rounded-3xl py-2 cursor-pointer border border-[#0b8f84] text-[#00ccba]" onclick={() => lockWalletModal = false}>Cancel</button>
      <button class="w-full rounded-3xl py-2 text-black cursor-pointer bg-gradient-to-b from-[#0b8f84] to-[#00ccba]" onclick={handleLockWallet}>Yes</button>
    </div>
  </div>
</Dialog>


<Dialog open={showResetModal} onClose={() => showResetModal = false}>
  <div class='bg-[#1012128f] rounded-lg p-4 grid space-y-4'>
    <h2 class='text-base font-bold'>Are you sure you want to reset</h2>
    <div>
      <label for="reset" >Enter 'reset'</label>
      <input
				type="text"
				placeholder="reset"
				class="bg-[#3b3b3bbd] w-full border-none outline-[#00887d] rounded-lg py-2 px-4 placeholder:text-white/80"
				bind:value
        onchange={() => {
          if(value === 'reset'){
            captcha = true
          }
        }}
			/>
    </div>
     <button class="w-full rounded-3xl py-2 text-black cursor-pointer bg-gradient-to-b from-[#0b8f84] to-[#00ccba]" disabled={captcha === false ? true : false} onclick={handleLogout}>Reset</button>
  </div>
</Dialog>

<!-- either apart client strike asthma liberty coil six demise rice squeeze memory -->

<!-- lovely -->