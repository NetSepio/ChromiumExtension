<script>
	import { mnemonicPhase, onboardingStepsLeft, privateKey, walletAddress } from '$lib/store/store';
	import Header from '$lib/components/Header.svelte';
	import { ethers } from 'ethers';
	let showModal = false;
	let mnemonic = '';
	let address = '';

	const generateWallet = async () => {
		let wallet = ethers.Wallet.createRandom();
		let secretPhases = wallet.mnemonic.phrase;
		mnemonic = secretPhases;
		address = await wallet.getAddress();
		let key = wallet.privateKey;
		privateKey.set(key);
		walletAddress.set(address);
		mnemonicPhase.set(mnemonic);
	};
</script>

<div>
	<Header />
	<div class="mt-6">
		<h1 class="text-5xl text-left mb-60">Get your seed phrase here</h1>
		<button
			class="btn btn-wide"
			on:click={() => {
				showModal = true;
				generateWallet();
			}}
		>
			Generate Seed phrase</button
		>
		<div class="modal" class:modal-open={showModal}>
			<div class="modal-box dark:bg-gray-800 dark:text-white">
				<h3 class="font-bold text-lg">Secret Recovery Phrase</h3>
				<br />
				<h3 class="text-sm text-red-500 dark:text-red-300">
					This is the only way you will be able to recover your account. Please store it somewhere
					safe!
				</h3>
				<p class="p-4 my-3 font-bold text-xl border-white/50 border rounded-md">{mnemonic}</p>
				<div class="modal-action justify-start">
					<a
						href="get-secret-key/create-password"
						on:click={() => onboardingStepsLeft.set(1)}
						class="btn btn-wide"
					>
						<label for="my-modal">Create Password</label>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
