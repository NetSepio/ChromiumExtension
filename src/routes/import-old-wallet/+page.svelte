<script>
	import { ethers } from 'ethers';
	let showModal = false;
	let error = '';
	let secretKey = '';
	let walletAddress = '';
	const handleSubmit = async () => {
		if (secretKey !== '') {
			error = '';
			try {
				let foundWallet = ethers.Wallet.fromMnemonic(secretKey);
				if (foundWallet !== null) {
					let foundAddress = await foundWallet.getAddress();
					walletAddress = foundAddress;
					showModal = false;
					// navigate('/OldUserSignature'); ====== Redirection not working !!!
				} else {
					error = 'No wallet found';
				}
			} catch (err) {
				error = 'Something went wrong!';
			}
		} else {
			error = 'Enter a valid key';
		}
	};
</script>

<div class="artboard phone-1 p-5">
	<h1 class="text-5xl text-left mb-60">Enter your secret key here</h1>

	<button class="btn btn-wide modal-button" on:click={() => (showModal = true)}>
		Secret Key
	</button>
	<div class="divider mr-5" />
	<a href="/get-secret-key">
		<button class="btn btn-wide float-left"> Create Wallet Instead </button>
	</a>

	<input type="checkbox" id="my-modal" class="modal-toggle" />
	<div class="modal" class:modal-open={showModal}>
		<div class="modal-box">
			<h3 class="font-bold text-lg">Secret Recovery Password</h3>
			<br />
			<h3 class={`text-sm ${error !== '' ? 'text-red-500' : ''}`}>
				{error.length > 0
					? `${error}`
					: `This is the only way you will be able to recover your account.
            Please store it somewhere safe!`}
			</h3>

			<input
				type="text"
				placeholder="Type here"
				class="py-4 my-4 input input-bordered input-lg w-full max-w-xs"
				bind:value={secretKey}
			/>

			<div class="modal-action ml-px">
				<button class="btn" on:click={handleSubmit}>Submit</button>
			</div>
		</div>
	</div>
</div>
