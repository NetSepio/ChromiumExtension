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
	import { AptosAccount } from 'aptos';

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
		let keypair = AptosAccount.fromDerivePath(path, mnemonic);
		let account = keypair.toPrivateKeyObject();
		address = account.address;
		let privKey = account.privateKeyHex.slice(2);
		let pubKey = account.publicKeyHex;

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

	<div class="h-[500px] flex flex-col justify-center items-center gap-12">
		<!-- Heading -->
		<h1 class="text-2xl text-center font-bold">Generate Your Secure Seed Phrase</h1>

		<!-- Button to generate seed phrase -->
		<button
			class="btn primary-button"
			on:click={() => {
				showModal = true;
				generateWallet();
			}}
		>
			Generate Seed phrase
		</button>

		<!-- Modal to display the seed phrase -->
		<div class="modal" class:modal-open={showModal}>
			<div class="modal-box dark:bg-[#222944] dark:text-white">
				<!-- Information about the importance of the seed phrase -->
				<h3 class="text-xs text-red-500 dark:text-red-300 text-center">
					This is the only way you will be able to recover your account. Please store it somewhere
					safe!
				</h3>

				<!-- Displaying the generated mnemonic phrases -->
				<div class="flex justify-center flex-wrap w-full p-2 gap-6 mx-auto mt-5">
					{#each mnemonicPhrases as mnemonicWord, index}
						<div class="flex items-center gap-1 text-black dark:text-white">
							<span>{index + 1}:</span>
							<div class="border border-[#263238] dark:border-[#11D9C5] p-2 rounded w-[5.5rem]">
								<p class="font-bold text-sm">{mnemonicWord}</p>
							</div>
						</div>
					{/each}
				</div>

				<!-- Actions within the modal -->
				<div class="modal-action justify-center items-center flex flex-col gap-4">
					<!-- Button to copy mnemonic to clipboard -->
					<button on:click={copyToClipboard} class="btn secondary-button">Copy mnemonics</button>

					<!-- Link to navigate to create a password -->
					<a
						class="w-full"
						href="get-secret-key/create-password"
						on:click={() => onboardingStepsLeft.set(1)}
					>
						<button class="btn primary-button">Create Password</button>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
