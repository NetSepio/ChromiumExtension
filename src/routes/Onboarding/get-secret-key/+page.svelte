<script>
	import { mnemonicPhase, privateKey, walletAddress } from '$lib/store/store';
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
		mnemonicPhase.set('mnemonic');
	};
</script>

<div class="artboard phone-1">
	<Header />
	<div class="mt-6">
		<h1 class="text-5xl text-left mb-40">Get your secret key here</h1>
		<button
			class="btn btn-wide"
			on:click={() => {
				showModal = true;
				generateWallet();
			}}>Secret Key</button
		>
		<div class="divider mr-5" />
		<a href="/import-old-wallet">
			<button class="btn btn-wide float-left">Import Wallet Instead</button>
		</a>
		<div class="modal" class:modal-open={showModal}>
			<div class="modal-box dark:bg-gray-800 dark:text-white">
				<h3 class="font-bold text-lg">Secret Recovery Password</h3>
				<br />
				<h3 class="text-sm">
					This is the only way you will be able to recover your account. Please store it somewhere
					safe!
				</h3>
				<p class="py-4 font-bold text-xl">{mnemonic}</p>
				<div class="modal-action">
					<a href="get-secret-key/create-password" class="btn btn-wide">
						<label for="my-modal">Create Password</label>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
