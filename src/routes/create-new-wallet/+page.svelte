<script lang="ts">
	import { browser } from '$app/environment';
	import { Copy, ArrowLeft } from '@lucide/svelte';
	import {
		onboardingStepsLeft,
		mnemonicPhrase,
		privateKey,
		publicKey,
		setWalletAddress,
		// Multi-chain imports
		privateKeySolana,
		privateKeyEVM,
		setChainAddress
	} from '../../store/store';
	import * as bip39 from 'bip39';
	import { createKeyPairSignerFromPrivateKeyBytes } from '@solana/kit';
	import { Buffer } from 'buffer';
	import { derivePath } from 'ed25519-hd-key';
	import { ethers } from 'ethers';
	import { handleAuthPageAccess } from '$lib/helpers/authGuard';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Toast from '$lib/components/ui/toast.svelte';

	let toast = $state(false);
	let mnemonic = $state('');
	let seedPhrase = $derived(mnemonic.split(' '));
	let isCheckingAuth = $state(true);

	// Check if user should be redirected away from this auth page
	onMount(async () => {
		try {
			console.log('Create wallet page: Checking auth redirect...');
			await handleAuthPageAccess(page.url.pathname);
			console.log('Create wallet page: Auth check completed');
		} catch (error) {
			console.error('Create wallet page: Auth check failed:', error);
		} finally {
			isCheckingAuth = false;
		}
	});

	async function getSolPhrases() {
		try {
			console.log('Starting multi-chain wallet generation...');

			mnemonic = bip39.generateMnemonic();
			console.log('Mnemonic generated successfully');

			const seed = bip39.mnemonicToSeedSync(mnemonic, '');
			
			// SOLANA KEY GENERATION - Use proper derivation path (Solflare/Phantom standard)
			const solanaDerivationPath = "m/44'/501'/0'/0'";
			const solanaDerivedSeed = derivePath(solanaDerivationPath, seed.toString('hex')).key;
			const solanaSigner = await createKeyPairSignerFromPrivateKeyBytes(solanaDerivedSeed);
			const solanaAddress = solanaSigner.address.toString();
			
			console.log('Solana wallet created, address:', solanaAddress);

			// EVM KEY GENERATION - Use standard MetaMask derivation path  
			const evmDerivationPath = "m/44'/60'/0'/0/0";
			const evmWallet = ethers.HDNodeWallet.fromMnemonic(ethers.Mnemonic.fromPhrase(mnemonic), evmDerivationPath);
			const evmAddress = evmWallet.address;
			
			console.log('EVM wallet created, address:', evmAddress);

			// STORE KEYS - Both legacy (for compatibility) and new multi-chain stores
			const solanaPrivKeyHex = Buffer.from(solanaDerivedSeed).toString('hex');
			const evmPrivKeyHex = evmWallet.privateKey.slice(2); // Remove 0x prefix
			
			// Legacy stores (keep for backward compatibility)
			privateKey.set(solanaPrivKeyHex);
			publicKey.set(solanaAddress);
			
			// New multi-chain stores
			privateKeySolana.set(solanaPrivKeyHex);
			privateKeyEVM.set(evmPrivKeyHex);

			console.log('Keys stored in both legacy and multi-chain stores');

			// STORE ADDRESSES
			await setWalletAddress(solanaAddress); // Legacy function
			await setChainAddress('solana', solanaAddress);
			await setChainAddress('evm', evmAddress);

			console.log('Addresses stored successfully');

			// Store mnemonic temporarily in memory only
			await mnemonicPhrase.set(mnemonic);

			console.log('Multi-chain wallet generation completed successfully');
			console.log('Solana address:', solanaAddress);
			console.log('EVM address (Peaq/Rise):', evmAddress);
		} catch (error) {
			console.error('Error generating multi-chain wallet:', error);
			if (error instanceof Error) {
				console.error('Error stack:', error.stack);
			}
		}
	}

	function copyToClipboard() {
		navigator.clipboard
			.writeText(mnemonic)
			.then(() => {
				toast = true;
			})
			.catch((error) => {
				alert('Failed to copy words');
				console.error('Failed to copy words: ', error);
			});
	}

	$effect.pre(() => {
		if (mnemonic === '') {
			getSolPhrases();
		}
	});

	$effect(() => {
		if (toast) {
			setTimeout(() => {
				toast = false;
			}, 3000);
		}
	});
</script>

{#if isCheckingAuth}
	<section class="flex h-full items-center justify-center bg-[#101212]">
		<div class="space-y-4 text-center">
			<div class="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-[#00ccba]"></div>
			<p class="text-sm text-white/70">Checking authentication...</p>
		</div>
	</section>
{:else}
	<section class="relative h-full bg-[#101212] p-8 text-center text-white capitalize">
		<button
			class="absolute top-8 left-8 cursor-pointer"
			onclick={() => {
				onboardingStepsLeft.set(0);
				if (browser) {
					// Navigate to welcome page instead of using history.back()
					goto('/welcome', { replaceState: true });
				}
			}}
		>
			<ArrowLeft color="#00ccba" />
		</button>
		<h1 class="font-bold">create wallet</h1>
		<div class="my-6 grid space-y-2">
			<h2 class="text-2xl font-bold">Secret Recovery Phrase</h2>
			<h3 class="text-sm text-white/70">
				Secure your identity and get started with your new wallet.
			</h3>
		</div>
		<div class="grid grid-cols-2 gap-4">
			{#each seedPhrase as seed, index (seed)}
				<div
					class="flex items-center gap-1 rounded-4xl border border-[#4e4e4e46] bg-[#1C1D21] px-3 py-1 text-sm"
				>
					<span class="basis-[5%] text-white/50">{index + 1}.</span>
					<span class="h-[90%] w-[1px] rounded-4xl bg-[#9e9e9e50]"></span>
					<span>{seed}</span>
				</div>
			{/each}
		</div>

		<div class="mt-12 grid space-y-2">
			<div class="flex items-center justify-center gap-2">
				<button
					onclick={copyToClipboard}
					class="my-2 flex cursor-pointer justify-center gap-2 text-sm text-[#00eeda] capitalize"
				>
					<p>copy to clipboard</p>
					<Copy color="#00eeda" size="20" />
				</button>
			</div>
			<a
				class="w-full cursor-pointer rounded-3xl bg-gradient-to-b from-[#0b8f84] to-[#00ccba] py-2 text-black"
				href="/create-password"
				onclick={() => onboardingStepsLeft.set(1)}>Continue</a
			>
		</div>
	</section>
{/if}

<Toast open={toast} success={false} error={false} status="Copied to clipboard" />
