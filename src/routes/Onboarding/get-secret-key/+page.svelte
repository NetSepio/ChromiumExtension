<script>
	import { mnemonicPhase, onboardingStepsLeft, privateKey, publicKey, walletAddress } from '$lib/store/store';
	import Header from '$lib/components/Header.svelte';
	import * as bip39 from '@scure/bip39';
	import { wordlist } from '@scure/bip39/wordlists/english';
	import { AptosAccount } from 'aptos'

	const path = `m/44'/637'/0'/0'/0'`;

	let showModal = false;
	let mnemonic = '';
	let address = '';

	$: mnemonicPhrase = mnemonic.split(' ')

	const generateWallet = async () => {
		mnemonic = bip39.generateMnemonic(wordlist, 128)
		let keypair = AptosAccount.fromDerivePath(path, mnemonic) 

		address = keypair.address().hex()
		let privKey = keypair.authKey().hex()
		let pubKey = keypair.pubKey().hex()

		console.log('Private Key: '+ privKey)
		console.log('Public Key: '+ pubKey)
		console.log(address)
		
		privateKey.set(privKey)
		publicKey.set(pubKey)
	
		walletAddress.set(address);
		mnemonicPhase.set(mnemonic);
	};

	 function copyToClipboard() {
    navigator.clipboard.writeText(mnemonic).then(() => {
      alert("Copied to clipboard!");
    }).catch(error => {
      console.error("Failed to copy words: ", error);
    });
  }

</script>

<div>
	<Header />
	<div class="mt-8">
		<h1 class="text-5xl text-center font-bold mb-48">Get your seed phrase here</h1>
		<button
			class="btn btn-wide block mx-auto"
			on:click={() => {
				showModal = true;
				generateWallet();
			}}
		>
			Generate Seed phrase</button
		>
		<div class="modal" class:modal-open={showModal}>
			<div class="modal-box dark:bg-gray-800 dark:text-white">
				<h3 class="font-bold text-2xl text-center">Secret Recovery Phrase</h3>
				<br />
				<h3 class="text-sm text-red-500 dark:text-red-300 text-center">
					This is the only way you will be able to recover your account. Please store it somewhere
					safe!
				</h3>
				<div class="flex justify-center flex-wrap w-full p-3 gap-4 mx-auto mt-5">
					{#each mnemonicPhrase as mnemonicWord, index }
						<div class="font-bold text-base border bg-white p-2 rounded w-28 flex gap-1">
							<span class="text-gray-700">{index + 1}:</span>	<p class="text-black">{mnemonicWord}</p>
						</div>
					{/each}
				</div>
				
				<div class="modal-action justify-center items-center flex flex-col gap-4">
					<button on:click={copyToClipboard} class="btn btn-wide cursor-pointer">Copy mnemonics</button>
					<a
						href="get-secret-key/create-password"
						on:click={() => onboardingStepsLeft.set(1)}
						
					>
						<button class="btn btn-wide cursor-pointer">Create Password</button>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
