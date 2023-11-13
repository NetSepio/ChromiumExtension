<script lang="ts">
	import {
		mnemonicPhrase,
		onboardingStepsLeft,
		privateKey,
		publicKey,
		walletAddress
	} from '$lib/store/store';
	import Header from '$lib/components/Header.svelte';
	import { AptosAccount } from 'aptos';

	let showModal = false;
	let error = '';
	let seedPhase = '';
	let userWalletAddress = '';
	let pubKey = '';
	let privKey = '';

	const path = `m/44'/637'/0'/0'/0'`;

	const handleSubmit = async () => {
		if (seedPhase !== '') {
			error = '';
			seedPhase = seedPhase.trim();
			try {
				let foundWallet = AptosAccount.fromDerivePath(path, seedPhase);

				if (foundWallet !== null) {
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

	const handleContinue = async () => {
		publicKey.set(pubKey);
		privateKey.set(privKey);
		walletAddress.set(userWalletAddress);
		mnemonicPhrase.set(seedPhase);
	};
</script>

<div>
	<Header />
	<div class="mt-12">
		<h1 class="text-3xl font-bold text-center mb-48">Enter your seed phase</h1>

		<button class="btn btn-wide modal-button mx-auto block" on:click={() => (showModal = true)}>
			Enter Seed Phrase
		</button>

		<input type="checkbox" id="my-modal" class="modal-toggle" />
		<div class="modal" class:modal-open={showModal}>
			<div class="modal-box dark:bg-gray-800 dark:text-white">
				<h3 class="font-bold text-lg">Seed Phrase</h3>
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
							: `Enter your seed phases separated with a single blank space`}
					</h3>
				{/if}

				<input
					type="text"
					placeholder="ex - better phone option poke water glasses mandate spell thought nice history united"
					class="py-4 my-4 input input-bordered input-lg w-full max-w-xs dark:bg-gray-800 dark:text-white border-white/50"
					bind:value={seedPhase}
				/>

				{#if userWalletAddress !== ''}
					<div class="modal-action ml-px">
						<a href="import-old-wallet/create-password" on:click={() => onboardingStepsLeft.set(1)}>
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
