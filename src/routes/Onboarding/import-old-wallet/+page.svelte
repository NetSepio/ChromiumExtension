<script>
	import { mnemonicPhase, privateKey, walletAddress } from '$lib/store/store';
	import Header from '$lib/components/Header.svelte';
	import { ethers } from 'ethers';
	let showModal = false;
	let error = '';
	let seedPhase = '';
	let userWalletAddress = '';
	let userPrivateKey = '';

	const handleSubmit = async () => {
		if (seedPhase !== '') {
			error = '';
			try {
				let foundWallet = ethers.Wallet.fromMnemonic(seedPhase);
				if (foundWallet !== null) {
					let foundAddress = await foundWallet.getAddress();
					userPrivateKey = foundWallet.privateKey;
					userWalletAddress = foundAddress;
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

	const handleContinue = async () => {
		privateKey.set(userPrivateKey);
		walletAddress.set(userWalletAddress);
		mnemonicPhase.set(seedPhase);
	};
</script>

<div class="artboard phone-1">
	<Header />
	<div class="mt-6">
		<h1 class="text-5xl text-left mb-60">Enter your secret key here</h1>

		<button class="btn btn-wide modal-button" on:click={() => (showModal = true)}>
			Secret Key
		</button>

		<input type="checkbox" id="my-modal" class="modal-toggle" />
		<div class="modal" class:modal-open={showModal}>
			<div class="modal-box dark:bg-gray-800 dark:text-white">
				<h3 class="font-bold text-lg">Secret Recovery Password</h3>
				<br />
				{#if userWalletAddress !== ''}
					<h2 class="text-sm text-green-300">Found this Wallet</h2>
					<span
						>{`${userWalletAddress.substring(0, 8)}...${userWalletAddress.substring(
							userWalletAddress.length - 8
						)}`}</span
					>
				{:else}
					<h3 class={`text-sm ${error !== '' ? 'text-red-500' : ''}`}>
						{error.length > 0
							? `${error}`
							: `This is the only way you will be able to recover your account.
					Please store it somewhere safe!`}
					</h3>
				{/if}

				<input
					type="text"
					placeholder="Type here"
					class="py-4 my-4 input input-bordered input-lg w-full max-w-xs dark:bg-gray-800 dark:text-white"
					bind:value={seedPhase}
				/>

				{#if userWalletAddress !== ''}
					<div class="modal-action ml-px">
						<a href="import-old-wallet/create-password">
							<button class="btn" on:click={handleContinue}>Continue</button>
						</a>
					</div>
				{:else}
					<div class="modal-action ml-px">
						<button class="btn" on:click={handleSubmit}>Submit</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
