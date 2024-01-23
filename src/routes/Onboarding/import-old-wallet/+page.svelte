<!-- Import wallet page -->
<script lang="ts">
	// Import necessary modules and components
	import {
		mnemonicPhrase,
		onboardingStepsLeft,
		privateKey,
		publicKey,
		walletAddress
	} from '$lib/store/store';
	import Header from '$lib/components/Header.svelte';
	import { AptosAccount } from 'aptos';

	// Declare variables and initialize them
	let error = '';
	let seedPhase = '';
	let userWalletAddress = '';
	let pubKey = '';
	let privKey = '';

	// BIP-32 derivation path
	const path = `m/44'/637'/0'/0'/0'`;

	// Function to handle the form submission
	const handleSubmit = async () => {
		if (seedPhase !== '') {
			error = '';
			seedPhase = seedPhase.trim();
			try {
				// Derive wallet from seed phrase using BIP-32 path
				let foundWallet = AptosAccount.fromDerivePath(path, seedPhase);

				if (foundWallet !== null) {
					// Extract account details from the found wallet
					let account = foundWallet.toPrivateKeyObject();
					userWalletAddress = account.address as string;
					pubKey = account.publicKeyHex as string;
					privKey = account.privateKeyHex.slice(2);
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

	// Function to handle the Continue button click
	const handleContinue = async () => {
		// Set values in the store for further use
		publicKey.set(pubKey);
		privateKey.set(privKey);
		walletAddress.set(userWalletAddress);
		mnemonicPhrase.set(seedPhase);
	};
</script>

<!-- Main content for the Import wallet page -->
<div>
	<!-- Header component -->
	<Header />

	<!-- Container for the main content -->
	<div class="mt-12">
		<!-- Link to go back to the home page -->
		<a href="/">
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				class="fill-[#263238] dark:fill-[#11D9C5]"
			>
				<path
					d="M16.6185 2.99028C16.5024 2.87387 16.3645 2.78152 16.2126 2.7185C16.0608 2.65548 15.898 2.62305 15.7335 2.62305C15.5691 2.62305 15.4063 2.65548 15.2545 2.7185C15.1026 2.78152 14.9647 2.87387 14.8485 2.99028L6.53854 11.3003C6.44583 11.3928 6.37229 11.5027 6.32211 11.6237C6.27192 11.7446 6.24609 11.8743 6.24609 12.0053C6.24609 12.1362 6.27192 12.2659 6.32211 12.3869C6.37229 12.5079 6.44583 12.6178 6.53854 12.7103L14.8485 21.0203C15.3385 21.5103 16.1285 21.5103 16.6185 21.0203C17.1085 20.5303 17.1085 19.7403 16.6185 19.2503L9.37854 12.0003L16.6285 4.75028C17.1085 4.27028 17.1085 3.47028 16.6185 2.99028Z"
				/>
			</svg>
		</a>

		<!-- Main content based on whether a wallet has been found or not -->
		<div>
			{#if userWalletAddress !== ''}
				<!-- Display information if a wallet has been found -->
				<h1 class="text-2xl font-bold text-center mt-24 mb-4">Seed phase</h1>
				<h2 class="text-sm text-black dark:text-green-300 text-center">Wallet has been found</h2>
				<span class="text-center block"
					>{`${userWalletAddress.substring(0, 8)}...${userWalletAddress.substring(
						userWalletAddress.length - 8
					)}`}</span
				>
			{:else}
				<!-- Display input field if a wallet has not been found -->
				<h1 class="text-2xl font-bold text-center mt-24 mb-4">Enter your seed phrase</h1>
				<h3 class={`text-sm text-center ${error !== '' ? 'text-red-800 dark:text-red-500' : ''}`}>
					{error.length > 0 ? `${error}` : `Enter the seed phrase with a single blank space.`}
				</h3>
			{/if}

			<!-- Textarea for entering the seed phrase -->
			<textarea
				placeholder="ex: Lorem Ipsum"
				class="my-4 input primary-input h-32 rounded-lg pt-5"
				bind:value={seedPhase}
			/>

			{#if userWalletAddress !== ''}
				<!-- Continue button if a wallet has been found -->
				<div>
					<a
						href="/Onboarding/import-old-wallet/create-password"
						on:click={() => onboardingStepsLeft.set(1)}
					>
						<button class="btn w-full primary-button" on:click={handleContinue}>Continue</button>
					</a>
				</div>
			{:else}
				<!-- Submit button if a wallet has not been found -->
				<div>
					<button class="btn w-full primary-button" on:click={handleSubmit}>Submit</button>
				</div>
			{/if}
		</div>
	</div>
</div>
