<script>
	import { setMnemonicPhase, setPrivateKey, setWalletAddress } from '$lib/store/store';
	import { ethers } from 'ethers';
	let showModal = false;
	let error = '';
	let seedPhase = '';
	let walletAddress = '';
	let userPrivateKey = '';

	const handleSubmit = async () => {
		if (seedPhase !== '') {
			error = '';
			try {
				let foundWallet = ethers.Wallet.fromMnemonic(seedPhase);
				if (foundWallet !== null) {
					let foundAddress = await foundWallet.getAddress();
					userPrivateKey = foundWallet.privateKey;
					walletAddress = foundAddress;
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
		setPrivateKey(userPrivateKey);
		setWalletAddress(walletAddress);
		setMnemonicPhase(seedPhase);
		window.location.assign(window.location.toString() + '/create-password');
	};
</script>

<div class="artboard phone-1">
	<h1 class="text-5xl text-left mb-60">Enter your secret key here</h1>

	<button class="btn btn-wide modal-button" on:click={() => (showModal = true)}> Secret Key </button>
	<div class="divider mr-5" />
	<a href="/get-secret-key">
		<button class="btn btn-wide float-left"> Create Wallet Instead </button>
	</a>

	<input type="checkbox" id="my-modal" class="modal-toggle" />
	<div class="modal" class:modal-open={showModal}>
		<div class="modal-box">
			<h3 class="font-bold text-lg">Secret Recovery Password</h3>
			<br />
			{#if walletAddress !== ''}
				<h2 class="text-sm text-green-300">Found this Wallet</h2>
				<span
					>{`${walletAddress.substring(0, 8)}...${walletAddress.substring(
						walletAddress.length - 8
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
				class="py-4 my-4 input input-bordered input-lg w-full max-w-xs"
				bind:value={seedPhase}
			/>

			{#if walletAddress !== ''}
				<div class="modal-action ml-px">
					<button class="btn" on:click={handleContinue}>Continue</button>
				</div>
			{:else}
				<div class="modal-action ml-px">
					<button class="btn" on:click={handleSubmit}>Submit</button>
				</div>
			{/if}
		</div>
	</div>
</div>