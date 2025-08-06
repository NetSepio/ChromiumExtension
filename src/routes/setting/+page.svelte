<script lang="ts">
	import Dialog from '$lib/components/ui/dialog.svelte';
	import VpnHeader from '$lib/components/ui/vpn-header.svelte';
	import { Bitcoin, Wallet, Network, ChevronRight } from '@lucide/svelte';
	import { 
		mnemonicPhrase, 
		walletAddress, 
		onboardingStepsLeft,
		// Multi-chain imports
		getChainAddress,
		setChainAddress,
		privateKeySolana,
		privateKeyEVM
	} from '../../store/store';
	import { goto } from '$app/navigation';
	import { 
		formatChainAddress
	} from '$lib/utils/address-utils';
	import { NETWORK_CONFIGS } from '$lib/getBalance';
	import type { ChainType } from '$lib/utils/address-utils';

	let lockWalletModal = $state(false);
	let showResetModal = $state(false);
	let showChainModal = $state(false);
	let showSeedModal = $state(false);
	let captcha = $state(false);
	let value = $state('');
	let seedPhrase = $state('');
	
	// Chain management
	let activeChain = $state('solana' as ChainType);
	let selectedEvmNetwork = $state('peaq-mainnet'); // Default EVM network
	let solanaAddress = $state('');
	let evmAddress = $state('');
	let isGeneratingEvm = $state(false);

	// Load current chain preference and addresses on mount
	$effect(() => {
		async function loadChainData() {
			// Load active chain from localStorage
			const savedChain = localStorage.getItem('active-chain');
			if (savedChain === 'solana' || savedChain === 'evm') {
				activeChain = savedChain;
			}
			
			// Load selected EVM network
			const savedEvmNetwork = localStorage.getItem('selected-evm-network');
			if (savedEvmNetwork) {
				selectedEvmNetwork = savedEvmNetwork;
			}
			
			// Load addresses
			try {
				const solAddress = await getChainAddress('solana');
				const evmAddr = await getChainAddress('evm');
				
				solanaAddress = solAddress || '';
				evmAddress = evmAddr || '';
				
				// If no EVM address but we have Solana, generate EVM
				if (!evmAddr && solAddress) {
					await generateEvmForExistingWallet();
				}
			} catch (error) {
				console.error('Error loading chain addresses:', error);
			}
		}
		
		loadChainData();
	});

	// Function to generate EVM address for existing Solana wallets
	async function generateEvmForExistingWallet() {
		if (isGeneratingEvm) return;
		
		try {
			isGeneratingEvm = true;
			console.log('Generating EVM address for existing wallet...');
			
			// Get mnemonic from Chrome storage
			const result = await chrome.storage.local.get(['mnemonic']);
			if (!result.mnemonic) {
				console.error('No mnemonic found for EVM generation');
				return;
			}
			
			// Generate EVM wallet from mnemonic
			const { HDNodeWallet } = await import('ethers');
			const { mnemonicToSeed } = await import('bip39');
			
			const seed = await mnemonicToSeed(result.mnemonic);
			const evmWallet = HDNodeWallet.fromSeed(seed).derivePath("m/44'/60'/0'/0/0");
			
			// Store the generated EVM address and private key
			await setChainAddress('evm', evmWallet.address);
			privateKeyEVM.set(evmWallet.privateKey);
			
			evmAddress = evmWallet.address;
			console.log('Successfully generated EVM address:', evmWallet.address);
			
		} catch (error) {
			console.error('Failed to generate EVM address:', error);
			// Optionally show user-friendly error message
		} finally {
			isGeneratingEvm = false;
		}
	}

	// Function to manually generate EVM address (for button click)
	async function generateEvmAddress() {
		if (!evmAddress && !isGeneratingEvm) {
			await generateEvmForExistingWallet();
		}
	}

	// Function to show seed phrase
	async function showSeedPhrase() {
		try {
			const result = await chrome.storage.local.get(['mnemonic']);
			if (result.mnemonic) {
				seedPhrase = result.mnemonic;
				showSeedModal = true;
			} else {
				console.error('No mnemonic found');
			}
		} catch (error) {
			console.error('Error retrieving seed phrase:', error);
		}
	}

	// Function to switch active chain
	async function switchActiveChain(newChain: ChainType) {
		activeChain = newChain;
		localStorage.setItem('active-chain', newChain);
		
		// Save selected EVM network
		localStorage.setItem('selected-evm-network', selectedEvmNetwork);
		
		showChainModal = false;
		
		// Dispatch event to notify other parts of the app
		window.dispatchEvent(new CustomEvent('chainChanged', { 
			detail: { 
				chain: newChain, 
				evmNetwork: selectedEvmNetwork 
			} 
		}));
	}

	// Function to handle locking the wallet
	const handleLockWallet = async () => {
		// Remove the mnemonic phrase from the store
		await mnemonicPhrase.remove();
		// Update the wallet unlock status and hide the modal
		lockWalletModal = false;
		goto('/sign-in');
	};

	// Function to handle the logout/reset action
	const handleLogout = async () => {
		// Clearing sensitive data and resetting states
		await mnemonicPhrase.remove();

		walletAddress.set('');
		onboardingStepsLeft.set(3);
		localStorage.removeItem('encryptedMnemonic');
		localStorage.removeItem('iv');
		localStorage.removeItem('mnemonicHash');
		localStorage.removeItem('active-chain');
		
		// Clear multi-chain data
		await chrome.storage.local.remove(['solanaAddress', 'evmAddress', 'mnemonic']);
		
		showResetModal = false;
		goto('/welcome');
	};
</script>

<section
	class="relative h-full bg-[#101212] px-4 pt-2 pb-4 text-sm text-white overflow-hidden flex flex-col"
>
	<VpnHeader />
	
	<!-- Header -->
	<div class="mb-4 text-center flex-shrink-0">
		<h1 class="text-lg font-bold text-white">Settings</h1>
		<p class="text-gray-400 text-xs mt-1">Manage your wallet and preferences</p>
	</div>

	<!-- Scrollable Content -->
	<div class="flex-1 overflow-y-auto">
		<div class="max-w-xs mx-auto space-y-3">
			<!-- Active Network Card -->
			<div class="bg-[#1a1a1a] rounded-lg border border-[#333] p-3">
				<div class="flex items-center justify-between mb-2">
					<div class="flex items-center gap-2">
						<Network size="16" color="#0eafa2" />
						<span class="font-medium text-sm">Active Network</span>
					</div>
					<div class="flex items-center gap-1 text-xs px-2 py-1 bg-[#333] rounded-full">
						<div class="w-2 h-2 rounded-full {activeChain === 'solana' ? 'bg-[#9945ff]' : 'bg-[#627eea]'}"></div>
						<span class="capitalize">{activeChain === 'solana' ? 'Solana' : 'EVM'}</span>
					</div>
				</div>
				<button
					onclick={() => (showChainModal = true)}
					class="w-full flex items-center justify-between p-2 rounded-lg bg-[#2a2a2a] hover:bg-[#333] transition-colors text-left"
				>
					<div class="flex items-center gap-2">
						<div class="w-6 h-6 rounded-full {activeChain === 'solana' ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-[#627eea]'} flex items-center justify-center">
							<span class="text-white font-bold text-xs">{activeChain === 'solana' ? '◎' : 'Ξ'}</span>
						</div>
						<div>
							<div class="font-medium text-sm">{activeChain === 'solana' ? 'Solana' : 'EVM Networks'}</div>
							<div class="text-xs text-gray-400">
								{activeChain === 'solana' 
									? (solanaAddress ? formatChainAddress(solanaAddress, 'solana') : 'No address')
									: (evmAddress ? formatChainAddress(evmAddress, 'evm') : 'Generate EVM address')
								}
							</div>
						</div>
					</div>
					<ChevronRight size="14" color="#666" />
				</button>
			</div>

			<!-- Security Section -->
			<div class="bg-[#1a1a1a] rounded-lg border border-[#333] p-3">
				<h3 class="font-medium mb-2 flex items-center gap-2 text-sm">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0eafa2" stroke-width="2">
						<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
						<circle cx="12" cy="16" r="1"/>
						<path d="M7 11V7a5 5 0 0 1 10 0v4"/>
					</svg>
					Security
				</h3>
				<div class="space-y-2">
					<button
						onclick={() => showSeedPhrase()}
						class="w-full flex items-center justify-between p-2 rounded-lg bg-[#2a2a2a] hover:bg-[#333] transition-colors text-left"
					>
						<div class="flex items-center gap-2">
							<Bitcoin size="14" color="#0eafa2" />
							<span class="text-sm">Show Seed Phrase</span>
						</div>
						<ChevronRight size="14" color="#666" />
					</button>
					
					<button
						onclick={() => (lockWalletModal = true)}
						class="w-full flex items-center justify-between p-2 rounded-lg bg-[#2a2a2a] hover:bg-[#333] transition-colors text-left"
					>
						<div class="flex items-center gap-2">
							<Wallet size="14" color="#0eafa2" />
							<span class="text-sm">Lock Wallet</span>
						</div>
						<ChevronRight size="14" color="#666" />
					</button>
				</div>
			</div>

			<!-- Danger Zone -->
			<div class="bg-[#1a1a1a] rounded-lg border border-red-900/30 p-3">
				<h3 class="font-medium mb-2 flex items-center gap-2 text-sm text-red-400">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
						<line x1="12" y1="9" x2="12" y2="13"/>
						<line x1="12" y1="17" x2="12.01" y2="17"/>
					</svg>
					Danger Zone
				</h3>
				<button
					onclick={() => (showResetModal = true)}
					class="w-full flex items-center justify-between p-2 rounded-lg bg-red-900/20 hover:bg-red-900/30 transition-colors text-left border border-red-900/50"
				>
					<div class="flex items-center gap-2">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
						</svg>
						<div>
							<div class="text-red-400 font-medium text-sm">Reset Wallet</div>
							<div class="text-xs text-gray-500">Delete all wallet data</div>
						</div>
					</div>
					<ChevronRight size="14" color="#dc2626" />
				</button>
			</div>
		</div>
	</div>
</section>

<Dialog open={lockWalletModal} onClose={() => (lockWalletModal = false)}>
	<div class="rounded-lg bg-[#1a1a1a] border border-[#333] p-4 max-w-xs mx-auto">
		<div class="text-center mb-4">
			<div class="w-10 h-10 mx-auto mb-3 rounded-full bg-orange-500/20 flex items-center justify-center">
				<Wallet size="20" color="#f59e0b" />
			</div>
			<h2 class="text-base font-bold mb-2">Lock Wallet</h2>
			<p class="text-xs text-gray-400">You'll need to sign in again.</p>
		</div>
		<div class="flex gap-2">
			<button
				class="flex-1 py-2 px-3 rounded-lg border border-[#333] text-gray-400 hover:text-white hover:border-[#555] transition-colors text-sm"
				onclick={() => (lockWalletModal = false)}
			>
				Cancel
			</button>
			<button
				class="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-[#0b8f84] to-[#00ccba] text-black font-medium hover:from-[#0a7b70] hover:to-[#00b3a6] transition-colors text-sm"
				onclick={handleLockWallet}
			>
				Lock
			</button>
		</div>
	</div>
</Dialog>

<Dialog open={showResetModal} onClose={() => (showResetModal = false)}>
	<div class="rounded-lg bg-[#1a1a1a] border border-red-900/50 p-4 max-w-xs mx-auto">
		<div class="text-center mb-4">
			<div class="w-10 h-10 mx-auto mb-3 rounded-full bg-red-500/20 flex items-center justify-center">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
					<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
					<line x1="12" y1="9" x2="12" y2="13"/>
					<line x1="12" y1="17" x2="12.01" y2="17"/>
				</svg>
			</div>
			<h2 class="text-base font-bold mb-2 text-red-400">Reset Wallet</h2>
			<p class="text-xs text-gray-400 mb-3">This will permanently delete all wallet data.</p>
		</div>
		
		<div class="mb-4">
			<label for="reset" class="block text-xs font-medium text-gray-300 mb-1">
				Type "reset" to confirm
			</label>
			<input
				type="text"
				placeholder="reset"
				class="w-full px-3 py-2 rounded-lg bg-[#2a2a2a] border border-[#444] text-white placeholder:text-gray-500 focus:border-red-500 focus:outline-none transition-colors text-sm"
				bind:value
				onchange={() => {
					if (value === 'reset') {
						captcha = true;
					}
				}}
			/>
		</div>
		
		<button
			class="w-full py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
			disabled={!captcha}
			onclick={handleLogout}
		>
			Reset Wallet
		</button>
	</div>
</Dialog>

<!-- Seed Phrase Modal -->
<Dialog open={showSeedModal} onClose={() => (showSeedModal = false)}>
	<div class="rounded-lg bg-[#1a1a1a] border border-[#333] p-4 max-w-sm mx-auto max-h-[80vh] overflow-y-auto">
		<div class="text-center mb-4">
			<div class="w-10 h-10 mx-auto mb-3 rounded-full bg-yellow-500/20 flex items-center justify-center">
				<Bitcoin size="20" color="#eab308" />
			</div>
			<h2 class="text-base font-bold mb-2">Your Seed Phrase</h2>
			<p class="text-xs text-gray-400">Keep this safe and never share it with anyone.</p>
		</div>
		
		{#if seedPhrase}
			<div class="mb-4 p-3 rounded-lg bg-[#0a0a0a] border border-[#333]">
				<div class="grid grid-cols-3 gap-1 text-xs">
					{#each seedPhrase.split(' ') as word, index}
						<div class="flex items-center gap-1 p-1.5 rounded bg-[#202222] border border-[#333]">
							<span class="text-xs text-gray-500 w-3 font-mono">{index + 1}</span>
							<span class="font-mono text-white text-xs">{word}</span>
						</div>
					{/each}
				</div>
			</div>
			
			<button
				onclick={() => navigator.clipboard.writeText(seedPhrase)}
				class="w-full mb-3 py-2 px-3 rounded-lg bg-[#00ccba] hover:bg-[#00eeda] text-black font-medium transition-colors flex items-center justify-center gap-2 text-sm"
			>
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
					<path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
				</svg>
				Copy to Clipboard
			</button>
		{/if}
		
		<button
			onclick={() => {showSeedModal = false; seedPhrase = '';}}
			class="w-full py-2 px-3 rounded-lg border border-[#333] text-gray-400 hover:text-white hover:border-[#555] transition-colors text-sm"
		>
			Close
		</button>
	</div>
</Dialog>

<!-- Chain Selection Modal -->
<Dialog open={showChainModal} onClose={() => (showChainModal = false)}>
	<div class="network-selection-dialog rounded-lg bg-[#1a1a1a] border border-[#333] p-4 max-w-xs mx-auto max-h-[80vh] overflow-y-auto">
		<div class="text-center mb-4">
			<div class="w-10 h-10 mx-auto mb-3 rounded-full bg-blue-500/20 flex items-center justify-center">
				<Network size="20" color="#3b82f6" />
			</div>
			<h2 class="text-base font-bold mb-2">Select Network</h2>
			<p class="text-xs text-gray-400">Choose which blockchain network to use</p>
		</div>
		
		<div class="space-y-2 mb-4">
			<!-- Solana Option -->
			<button
				onclick={() => switchActiveChain('solana')}
				class="w-full flex items-center justify-between p-3 rounded-lg border border-[#333] bg-[#202222] hover:bg-[#2a2a2a] transition-colors {activeChain === 'solana' ? 'border-[#00ccba] bg-[#00ccba]/10' : ''}"
			>
				<div class="flex items-center gap-2">
					<div class="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
						<span class="text-white font-bold text-sm">◎</span>
					</div>
					<div class="text-left">
						<div class="font-medium text-sm">Solana</div>
						<div class="text-xs text-gray-400">
							{solanaAddress ? formatChainAddress(solanaAddress, 'solana') : 'No address'}
						</div>
					</div>
				</div>
				{#if activeChain === 'solana'}
					<div class="w-4 h-4 rounded-full bg-[#00ccba] flex items-center justify-center">
						<div class="w-1.5 h-1.5 rounded-full bg-black"></div>
					</div>
				{/if}
			</button>

			<!-- EVM Networks Section -->
			<div class="border border-[#333] rounded-lg bg-[#202222] p-3">
				<div class="flex items-center justify-between mb-3">
					<div class="flex items-center gap-2">
						<div class="w-8 h-8 rounded-full bg-[#627eea] flex items-center justify-center">
							<span class="text-white font-bold text-sm">Ξ</span>
						</div>
						<div class="text-left">
							<div class="font-medium text-sm">EVM Networks</div>
							<div class="text-xs text-gray-400">
								{#if isGeneratingEvm}
									Generating...
								{:else if evmAddress}
									{formatChainAddress(evmAddress, 'evm')}
								{:else}
									Click to generate
								{/if}
							</div>
						</div>
					</div>
					{#if activeChain === 'evm'}
						<div class="w-4 h-4 rounded-full bg-[#00ccba] flex items-center justify-center">
							<div class="w-1.5 h-1.5 rounded-full bg-black"></div>
						</div>
					{/if}
				</div>
				
				<!-- EVM Network Selection -->
				{#if evmAddress}
					<div class="space-y-1">
						<label class="text-xs text-gray-400 font-medium">Select Network:</label>
						<select 
							bind:value={selectedEvmNetwork}
							class="w-full px-2 py-1 rounded bg-[#0a0a0a] border border-[#333] text-white text-xs focus:border-[#00ccba] focus:outline-none"
						>
							<option value="peaq-mainnet">Peaq Mainnet</option>
							<option value="peaq-testnet">Peaq Testnet</option>
							<option value="rise-testnet">Rise Testnet</option>
						</select>
					</div>
					
					<button
						onclick={() => switchActiveChain('evm')}
						class="w-full mt-2 py-2 px-3 rounded-lg bg-[#00ccba] hover:bg-[#00eeda] text-black font-medium transition-colors text-sm"
					>
						Use {NETWORK_CONFIGS[selectedEvmNetwork]?.name || 'EVM Network'}
					</button>
				{:else}
					<button
						onclick={generateEvmAddress}
						disabled={isGeneratingEvm}
						class="w-full py-2 px-3 rounded-lg bg-[#333] hover:bg-[#444] disabled:bg-[#222] disabled:cursor-not-allowed text-white font-medium transition-colors text-sm"
					>
						{isGeneratingEvm ? 'Generating...' : 'Generate EVM Address'}
					</button>
				{/if}
			</div>
		</div>

		<!-- EVM Networks Info -->
		{#if evmAddress}
			<div class="mb-4 p-3 rounded-lg bg-[#0a0a0a] border border-[#333]">
				<div class="text-xs text-gray-400 mb-2 font-medium">Supported Networks:</div>
				<div class="space-y-1 text-xs">
					<div class="flex items-center gap-2">
						<div class="w-1.5 h-1.5 rounded-full bg-[#00ccba]"></div>
						<span>Peaq Network (Mainnet & Testnet)</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-1.5 h-1.5 rounded-full bg-[#ff6b35]"></div>
						<span>Rise Network (Testnet Only)</span>
					</div>
					<div class="text-xs text-gray-500 mt-1 italic">
						* Rise mainnet support coming soon
					</div>
				</div>
			</div>
		{/if}

		<button
			onclick={() => (showChainModal = false)}
			class="w-full py-2 px-3 rounded-lg border border-[#333] text-gray-400 hover:text-white hover:border-[#555] transition-colors text-sm"
		>
			Cancel
		</button>
	</div>
</Dialog>

<!-- either apart client strike asthma liberty coil six demise rice squeeze memory -->

<!-- lovely -->

<style>
	/* Modern scrollbar styling for network selection dialog */
	.network-selection-dialog {
		scrollbar-width: thin;
		scrollbar-color: #00ccba20 transparent;
	}

	.network-selection-dialog::-webkit-scrollbar {
		width: 6px;
	}

	.network-selection-dialog::-webkit-scrollbar-track {
		background: transparent;
		border-radius: 10px;
	}

	.network-selection-dialog::-webkit-scrollbar-thumb {
		background: linear-gradient(180deg, #00ccba 0%, #00eeda 100%);
		border-radius: 10px;
		border: 1px solid #00ccba30;
	}

	.network-selection-dialog::-webkit-scrollbar-thumb:hover {
		background: linear-gradient(180deg, #00eeda 0%, #00ccba 100%);
		box-shadow: 0 0 10px #00ccba40;
	}

	.network-selection-dialog::-webkit-scrollbar-corner {
		background: transparent;
	}
</style>
