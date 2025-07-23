<script>
	import Dialog from '$lib/components/ui/dialog.svelte';
	import VpnHeader from '$lib/components/ui/vpn-header.svelte';
	import { Bitcoin, Wallet } from '@lucide/svelte';
	import { mnemonicPhrase, walletAddress, onboardingStepsLeft } from '../../store/store';
	import { goto } from '$app/navigation';

	let lockWalletModal = $state(false);
	let showResetModal = $state(false);
	let captcha = $state(false);
	let value = $state('');

	// Function to handle locking the wallet
	const handleLockWallet = async () => {
		// Remove the mnemonic phrase from the store
		await mnemonicPhrase.remove();
		// Update the wallet unlock status and hide the modal
		lockWalletModal = false;
		goto('/sign-in');
	};

	// Function to handle the logout/reset action
	const handleLogout = async () => {
		// Clearing sensitive data and resetting states
		await mnemonicPhrase.remove();

		walletAddress.set('');
		onboardingStepsLeft.set(3);
		localStorage.removeItem('encryptedMnemonic');
		localStorage.removeItem('iv');
		localStorage.removeItem('mnemonicHash');
		showResetModal = false;
	};
</script>

<section
	class="relative h-full bg-[#101212] px-8 pt-4 pb-8 text-center text-sm text-white capitalize"
>
	<VpnHeader />
	<div class="flex h-full flex-col items-center justify-center gap-8">
		<button
			class="flex w-56 items-center justify-center gap-2 rounded-3xl bg-[#3f3f3fe5] px-8 py-2 text-[#0eafa2]"
		>
			<Bitcoin />
			<span>Show Seed Phrase</span>
		</button>
		<button
			aria-label="lock wallet"
			onclick={handleLockWallet}
			class="flex w-56 cursor-pointer items-center justify-center gap-2 rounded-3xl bg-[#3f3f3fe5] px-8 py-2 text-[#0eafa2]"
		>
			<Wallet />
			<span>Lock your wallet</span>
		</button>
		<!-- <button aria-label="lock wallet" class="rounded-3xl py-2 px-8 text-black bg-[#0eafa2] flex items-center justify-center w-56 gap-2">
      <Wallet />
      <span>Lock your wallet</span>
    </button> -->
	</div>
</section>

<Dialog open={lockWalletModal} onClose={() => (lockWalletModal = false)}>
	<div class="rounded-lg bg-[#1012125e] p-4">
		<h2 class="text-base font-bold">Are you sure you want to lock your wallet</h2>
		<div class="mt-8 flex w-full items-center justify-center gap-4 text-sm">
			<button
				class="w-full cursor-pointer rounded-3xl border border-[#0b8f84] py-2 text-[#00ccba]"
				onclick={() => (lockWalletModal = false)}>Cancel</button
			>
			<button
				class="w-full cursor-pointer rounded-3xl bg-gradient-to-b from-[#0b8f84] to-[#00ccba] py-2 text-black"
				onclick={handleLockWallet}>Yes</button
			>
		</div>
	</div>
</Dialog>

<Dialog open={showResetModal} onClose={() => (showResetModal = false)}>
	<div class="grid space-y-4 rounded-lg bg-[#1012128f] p-4">
		<h2 class="text-base font-bold">Are you sure you want to reset</h2>
		<div>
			<label for="reset">Enter 'reset'</label>
			<input
				type="text"
				placeholder="reset"
				class="w-full rounded-lg border-none bg-[#3b3b3bbd] px-4 py-2 outline-[#00887d] placeholder:text-white/80"
				bind:value
				onchange={() => {
					if (value === 'reset') {
						captcha = true;
					}
				}}
			/>
		</div>
		<button
			class="w-full cursor-pointer rounded-3xl bg-gradient-to-b from-[#0b8f84] to-[#00ccba] py-2 text-black"
			disabled={captcha === false ? true : false}
			onclick={handleLogout}>Reset</button
		>
	</div>
</Dialog>

<!-- either apart client strike asthma liberty coil six demise rice squeeze memory -->

<!-- lovely -->
