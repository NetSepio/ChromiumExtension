<!-- Generate wallet page -->

<script lang="ts">
	// Importing necessary modules and components
	import {
		mnemonicPhrase,
		onboardingStepsLeft,
		privateKey,
		publicKey,
		walletAddress
	} from '$lib/store/store';
	import Header from '$lib/components/Header.svelte';
	import * as bip39 from '@scure/bip39';
	import { wordlist } from '@scure/bip39/wordlists/english';
	import { Account, SigningSchemeInput } from '@aptos-labs/ts-sdk';

	// Defining the BIP-32 derivation path
	const path = `m/44'/637'/0'/0'/0'`;

	// Component's variables
	let showModal = false;
	let mnemonic = '';
	let address = '';

	// Reactive statement to split mnemonic into an array
	$: mnemonicPhrases = mnemonic.split(' ');

	// Function to generate a new wallet
	const generateWallet = async () => {
		// Generating a new mnemonic phrase
		mnemonic = bip39.generateMnemonic(wordlist, 128);

		// Deriving keypair and account details
		// let keypair = .fromDerivePath(path, mnemonic);
		const account = Account.fromDerivationPath({
			path,
			mnemonic,
			scheme: SigningSchemeInput.Ed25519
		});
		// let account = keypair.toPrivateKeyObject();
		address = account.accountAddress.toString();
		let privKey = account.privateKey.toString();
		let pubKey = account.publicKey.toString();
		// Setting store values
		privateKey.set(privKey);
		publicKey.set(pubKey);
		walletAddress.set(address);
		mnemonicPhrase.set(mnemonic);
	};

	// Function to copy mnemonic to clipboard
	function copyToClipboard() {
		navigator.clipboard
			.writeText(mnemonic)
			.then(() => {
				alert('Copied to clipboard!');
			})
			.catch((error) => {
				console.error('Failed to copy words: ', error);
			});
	}
</script>

<!-- Component HTML structure -->
<div>
	<!-- Including the Header component -->
	<Header />
	{#if !showModal}
		<div class="h-[500px] flex flex-col justify-center items-center">
			<!-- Heading -->
			<h1 class="text-2xl w-[90%] mb-[48px] mx-auto text-center semiBold">
				Generate Your Secure Seed Phrase
			</h1>

			<!-- Button to generate seed phrase -->
			<button
				class=" w-[80%] mb-[24px] primary-button"
				on:click={() => {
					showModal = true;
					generateWallet();
				}}
			>
				Generate Seed phrase
			</button>
			<!-- Button to Cancel -->
			<button
				class=" w-[80%] bg-transparent text-secondary dark:text-white dark:border-action border-secondary border primary-button"
			>
				<a href="/Onboarding/"> Cancel </a>
			</button>
		</div>
	{:else}
		<!-- Modal to display the seed phrase -->
		<div class="w-[85%] mx-auto pt-[12%]">
			<!-- Back button -->
			<button on:click={() => (showModal = false)}>
				<!-- SVG icon for the back button -->
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
			</button>
			<!-- Information about the importance of the seed phrase -->
			<!-- <h3 class="text-xs text-red-500 dark:text-red-300 text-center">
				This is the only way you will be able to recover your account. Please store it somewhere
				safe!
			</h3> -->

			<!-- Displaying the generated mnemonic phrases -->
			<div class="grid grid-cols-[1fr,1fr] w-full p-2 gap-4 mx-auto mt-5">
				{#each mnemonicPhrases as mnemonicWord, index}
					<div
						class="flex items-center justify-end w-max relative gap-[0px] text-black dark:text-white"
					>
						<span class="absolute top-1 left-0 text-[10px]">{index + 1}.</span>
						<div
							class="border ml-4 border-[#263238] dark:border-[#11D9C5] p-2 rounded w-[109px] h-[33px]"
						>
							<p class="font-medium text-xs">{mnemonicWord}</p>
						</div>
					</div>
				{/each}
			</div>

			<!-- Actions within the modal -->
			<div class="modal-action justify-center items-center flex flex-col gap-4">
				<!-- Button to copy mnemonic to clipboard -->
				<button on:click={copyToClipboard} class="w-[80%] mx-auto secondary-button"
					>Copy mnemonics</button
				>

				<!-- Link to navigate to create a password -->
				<a
					class="w-full flex flex-col"
					href="get-secret-key/create-password"
					on:click={() => onboardingStepsLeft.set(1)}
				>
					<button class="w-[80%] self-center primary-button">Create Password</button>
				</a>
			</div>
		</div>
	{/if}
</div>
