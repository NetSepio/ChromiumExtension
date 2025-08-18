<script lang="ts">
	import Dialog from '$lib/components/ui/dialog.svelte';
	import { BadgeDollarSign, Copy, Download, Replace, Upload } from '@lucide/svelte';
	import { HDNodeWallet } from 'ethers';
	import { mnemonicToSeed } from 'bip39';
	import { 
		walletAddress,
		// Multi-chain imports
		getChainAddress,
		setChainAddress,
		privateKeySolana,
		privateKeyEVM
	} from '../../store/store';
	import { formatWalletAddress } from '$lib/helpers/formatWalletAddress';
	import { 
		formatChainAddress, 
		detectChainType, 
		getChainDisplayName,
		type ChainType 
	} from '$lib/utils/address-utils';
	import { generateQRCode } from '$lib/helpers/qrCode';
	import VpnHeader from '$lib/components/ui/vpn-header.svelte';
	import Toast from '$lib/components/ui/toast.svelte';
	import NetworkStatus from '$lib/components/ui/network-status.svelte';
	import EvmNetworkSelector from '$lib/components/ui/evm-network-selector.svelte';
	import { SolanaWalletService } from '$lib/helpers/solanaTransactions';
	import { EVMWalletService } from '$lib/helpers/evmTransactions';
	import type { EVMTokenInfo, EVMTransactionHistory } from '$lib/helpers/evmTransactions';
	import { getBalance, NETWORK_CONFIGS } from '$lib/getBalance';
	import type { TokenInfo, TransactionHistory } from '../../types/types';
	import { goto } from '$app/navigation';
	import { openNFTDetails } from '$lib/utils/browser-tabs';
	import { NFTService } from '$lib/services/nft-service';
	// import { clusterApiUrl } from "@solana/web3.js";

	// Extend BigInt type to include toJSON for TypeScript

	type ChainOption = 'mainnet' | 'testnet';

	let address = $state('');
	let solanaAddress = $state('');
	let evmAddress = $state('');
	let activeChain = $state<ChainType>('solana'); // Active chain from settings
	let selectedEvmNetwork = $state('peaq-mainnet'); // Selected EVM network
	let currentTab = $state('tokens');
	let userBalance = $state('');
	let evmBalance = $state('');
	let evmSymbol = $state('');
	let solPrice = $state(0);
	let openQRCode = $state(false);
	let qrCodeUrl = $state('');
	let showChainOptions = $state(false);
	let toast = $state(false);
	let chainOption = $state<ChainOption>('mainnet');

	// Load saved network preference and active chain on component mount
	$effect(() => {
		const savedNetwork = localStorage.getItem('selected-network') as ChainOption;
		if (savedNetwork && (savedNetwork === 'mainnet' || savedNetwork === 'testnet')) {
			chainOption = savedNetwork;
		}
		
		// Load active chain from settings
		const savedActiveChain = localStorage.getItem('active-chain');
		if (savedActiveChain === 'solana' || savedActiveChain === 'evm') {
			activeChain = savedActiveChain;
		}
		
		// Load selected EVM network
		const savedEvmNetwork = localStorage.getItem('selected-evm-network');
		if (savedEvmNetwork) {
			selectedEvmNetwork = savedEvmNetwork;
		}
	});

	// Listen for chain changes from settings
	$effect(() => {
		function handleChainChanged(event: CustomEvent) {
			console.log('Chain changed from settings:', event.detail);
			// Handle new event format
			if (event.detail && typeof event.detail === 'object') {
				activeChain = event.detail.chain;
				if (event.detail.evmNetwork) {
					selectedEvmNetwork = event.detail.evmNetwork;
				}
			} else {
				// Backward compatibility
				activeChain = event.detail;
			}
		}

		window.addEventListener('chainChanged', handleChainChanged as EventListener);

		return () => {
			window.removeEventListener('chainChanged', handleChainChanged as EventListener);
		};
	});
	let tokens = $state<TokenInfo[]>([]);
	let evmTokens = $state<EVMTokenInfo[]>([]);
	let transactions = $state<TransactionHistory[]>([]);
	let evmTransactions = $state<EVMTransactionHistory[]>([]);
	let nfts = $state<any[]>([]);
	let isLoadingTokens = $state(false);
	let isLoadingTransactions = $state(false);
	let isLoadingNFTs = $state(false);
	let isLoadingBalance = $state(false);
	let balanceError = $state('');
	let transactionError = $state('');
	let nftError = $state('');
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let tokenError = $state('');
	let showErrorToast = $state(false);
	let errorMessage = $state('');
	let refreshTokens = $state(false); // Trigger for refreshing tokens

	// Listen for token updates from import-tokens page
	$effect(() => {
		function handleTokensUpdated(event: CustomEvent) {
			console.log('Tokens updated event received:', event.detail);
			// Trigger token refresh
			refreshTokens = !refreshTokens;
			console.log('Refreshing tokens, refreshTokens value:', refreshTokens);
		}

		// Add event listener
		window.addEventListener('tokensUpdated', handleTokensUpdated as EventListener);

		// Cleanup
		return () => {
			window.removeEventListener('tokensUpdated', handleTokensUpdated as EventListener);
		};
	});

	// Wallet service instance
	let walletService = $derived(
		new SolanaWalletService(chainOption === 'mainnet' ? 'mainnet' : 'testnet')
	);
	
	// EVM wallet service instance
	let evmWalletService = $derived(
		new EVMWalletService(selectedEvmNetwork as keyof typeof NETWORK_CONFIGS)
	);

	// NFT service instance
	let nftService = $derived(
		new NFTService(chainOption === 'mainnet' ? 'mainnet' : 'testnet')
	);

	// Enhanced NFT fetching function with comprehensive API coverage
	async function fetchNFTs(address: string): Promise<any[]> {
		try {
			console.log(`Fetching NFTs for address: ${address}`);
			
			// Use the comprehensive NFT service that combines Helius + Magic Eden
			const allNFTs = await nftService.getUserNFTs(address);
			
			if (allNFTs.length > 0) {
				console.log(`Found ${allNFTs.length} total NFTs from all sources`);
				return allNFTs.map(nft => ({
					mintAddress: nft.mint,
					name: nft.name,
					symbol: nft.symbol,
					image: nft.image,
					description: nft.description,
					collectionName: nft.collection?.name,
					attributes: nft.attributes
				}));
			}
			
			console.log('No NFTs found from any source');
			return [];
			
		} catch (error) {
			console.error('Error fetching NFTs:', error);
			
			// Try fallback to CYAI on Magic Eden error
			try {
				console.log('Magic Eden failed, falling back to CYAI NFTs...');
				const cyaiNFTs = await walletService.getCyreneAINFTs(address);
				return cyaiNFTs || [];
			} catch (fallbackError) {
				console.error('Both Magic Eden and CYAI failed:', fallbackError);
				return [];
			}
		}
	}

	walletAddress.subscribe((value) => (address = value));

	// Load multi-chain addresses
	$effect(() => {
		async function loadAddresses() {
			try {
				const solAddress = await getChainAddress('solana');
				let evmAddr = await getChainAddress('evm');
				
				solanaAddress = solAddress || address; // Fallback to legacy address
				
				// If EVM address is missing, generate it from existing Solana private key
				if (!evmAddr && address) {
					console.log('EVM address missing, generating from existing wallet...');
					try {
						// Get the Solana private key from storage
						const solanaPrivateKey = await new Promise<string>((resolve, reject) => {
							privateKeySolana.subscribe((value) => {
								if (value) {
									resolve(value);
								} else {
									reject(new Error('No Solana private key found'));
								}
							})();
						});

						if (solanaPrivateKey) {
							// Generate EVM wallet from same seed
							// Get mnemonic from Chrome storage
							const result = await chrome.storage.local.get(['mnemonic']);
							if (result.mnemonic) {
								const seed = await mnemonicToSeed(result.mnemonic);
								const evmWallet = HDNodeWallet.fromSeed(seed).derivePath("m/44'/60'/0'/0/0");
								evmAddr = evmWallet.address;
								
								// Store the generated EVM address and private key
								await setChainAddress('evm', evmAddr);
								privateKeyEVM.set(evmWallet.privateKey);
								
								console.log('Generated EVM address for existing wallet:', evmAddr);
							}
						}
					} catch (error) {
						console.error('Failed to generate EVM address for existing wallet:', error);
					}
				}
				
				evmAddress = evmAddr || '';
				
				console.log('Multi-chain addresses loaded:');
				console.log('Solana:', solanaAddress);
				console.log('EVM:', evmAddress);
			} catch (error) {
				console.error('Error loading multi-chain addresses:', error);
				// Fallback to legacy address for Solana
				solanaAddress = address;
			}
		}
		
		if (address) {
			loadAddresses();
		}
	});

	async function getQRCodeUrl(address: string) {
		const qrCode = await generateQRCode(address);
		qrCodeUrl = qrCode ?? '';
		openQRCode = true;
	}

	(BigInt.prototype as any).toJSON = function () {
		return this.toString();
	};

	// Function to fetch Solana balance
	async function fetchSolanaBalance(address: string): Promise<string> {
		try {
			const balance = await walletService.getBalance(address);
			return balance.toString();
		} catch (error: unknown) {
			console.error('Solana balance fetch error:', error);
			throw error;
		}
	}

	// Function to fetch EVM balance
	async function fetchEvmBalance(address: string, network: string): Promise<{ balance: string; symbol: string }> {
		try {
			const result = await getBalance(address, network);
			return {
				balance: result.balance,
				symbol: result.symbol
			};
		} catch (error) {
			console.error('EVM balance fetch error:', error);
			const config = NETWORK_CONFIGS[network];
			return {
				balance: '0.0',
				symbol: config?.symbol || 'ETH'
			};
		}
	}

	// Function to fetch SOL price
	async function fetchSOLPrice(): Promise<number> {
		try {
			const response = await fetch(
				'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
			);
			const data = await response.json();
			return data.solana.usd;
		} catch (error) {
			console.error('Price fetch error:', error);
			return 0;
		}
	}

	// Main effect to fetch data when address, chain, or tokens change
	$effect.pre(() => {
		const currentAddress = activeChain === 'solana' ? (solanaAddress || address) : evmAddress;
		
		if (currentAddress) {
			// The refreshTokens variable will trigger this effect when tokens are updated
			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			refreshTokens; // This line ensures the effect runs when refreshTokens changes

			console.log(`Fetching data for ${activeChain} chain, address: ${currentAddress}`);

			(async () => {
				// Reset state
				balanceError = '';

				// Only run Solana-specific operations for Solana chain
				if (activeChain === 'solana') {
					// Clean up any legacy global token storage on wallet load
					await SolanaWalletService.cleanupLegacyTokenStorageData();

					// Fetch SOL price (only once per session)
					if (solPrice === 0) {
						try {
							solPrice = await fetchSOLPrice();
							console.log('SOL Price:', solPrice);
						} catch (error) {
							console.error('Failed to fetch SOL price:', error);
						}
					}

					// Fetch balance
					try {
						isLoadingBalance = true;
						userBalance = await fetchSolanaBalance(currentAddress);
						console.log(`${chainOption} Balance:`, userBalance);
					} catch (error: unknown) {
						console.error('Failed to fetch balance:', error);
						balanceError = SolanaWalletService.getUserFriendlyErrorMessage(error);
						userBalance = '0';
					} finally {
						isLoadingBalance = false;
					}

					// Fetch NFTs
					try {
						isLoadingNFTs = true;
						nftError = '';
						
						const allNFTs = await fetchNFTs(currentAddress);
						nfts = allNFTs;
						console.log(`Found ${allNFTs.length} NFTs on ${chainOption} network`);
						
						if (allNFTs.length === 0) {
							nftError = 'No NFTs found in this wallet';
						}
					} catch (error: any) {
						console.error('Error fetching NFTs:', error);
						nfts = [];
						nftError = SolanaWalletService.getUserFriendlyErrorMessage(error);
					} finally {
						isLoadingNFTs = false;
					}

					// Fetch tokens
					try {
						isLoadingTokens = true;
						tokenError = '';
						console.log(`Fetching tokens for wallet: ${currentAddress} on ${chainOption}`);
						const tokenAccounts = await walletService.getTokenAccounts(currentAddress);
						tokens = tokenAccounts;
						console.log(`Found ${tokenAccounts.length} tokens on ${chainOption} for wallet ${currentAddress}`);

						// Debug: Log imported tokens for this wallet
						const importedTokens = await walletService.getImportedTokensForWallet(currentAddress);
						console.log(`Imported tokens for wallet ${currentAddress}:`, importedTokens);
					} catch (error: any) {
						console.error('Error fetching tokens:', error);
						tokens = [];
						tokenError = SolanaWalletService.getUserFriendlyErrorMessage(error);
					} finally {
						isLoadingTokens = false;
					}

					// Fetch transaction history
					try {
						isLoadingTransactions = true;
						transactionError = '';
						const history = await walletService.getTransactionHistory(currentAddress, 10);
						transactions = history;
						console.log(`Found ${history.length} transactions on ${chainOption}`);
					} catch (error: any) {
						console.error('Error fetching transactions:', error);
						transactions = [];
						transactionError = SolanaWalletService.getUserFriendlyErrorMessage(error);
					} finally {
						isLoadingTransactions = false;
					}
				} else if (activeChain === 'evm') {
					// EVM functionality
					console.log('EVM chain selected - fetching balance and data');
					
					// Fetch EVM balance
					try {
						isLoadingBalance = true;
						const evmResult = await fetchEvmBalance(currentAddress, selectedEvmNetwork);
						evmBalance = evmResult.balance;
						evmSymbol = evmResult.symbol;
						console.log(`${selectedEvmNetwork} Balance:`, evmBalance, evmSymbol);
					} catch (error: unknown) {
						console.error('Failed to fetch EVM balance:', error);
						balanceError = `Failed to fetch ${selectedEvmNetwork} balance`;
						evmBalance = '0';
						evmSymbol = NETWORK_CONFIGS[selectedEvmNetwork]?.symbol || 'ETH';
					} finally {
						isLoadingBalance = false;
					}
					
					// Fetch EVM tokens
					try {
						isLoadingTokens = true;
						tokenError = '';
						console.log(`Fetching EVM tokens for wallet: ${currentAddress} on ${selectedEvmNetwork}`);
						const evmTokenAccounts = await evmWalletService.getTokenAccounts(currentAddress);
						evmTokens = evmTokenAccounts;
						console.log(`Found ${evmTokenAccounts.length} EVM tokens on ${selectedEvmNetwork}`);
					} catch (error: any) {
						console.error('Error fetching EVM tokens:', error);
						evmTokens = [];
						tokenError = EVMWalletService.getUserFriendlyErrorMessage(error);
					} finally {
						isLoadingTokens = false;
					}
					
					// Fetch EVM transaction history
					try {
						isLoadingTransactions = true;
						transactionError = '';
						const evmHistory = await evmWalletService.getTransactionHistory(currentAddress, 10);
						evmTransactions = evmHistory;
						console.log(`Found ${evmHistory.length} EVM transactions on ${selectedEvmNetwork}`);
					} catch (error: any) {
						console.error('Error fetching EVM transactions:', error);
						evmTransactions = [];
						transactionError = EVMWalletService.getUserFriendlyErrorMessage(error);
					} finally {
						isLoadingTransactions = false;
					}
					
					// Reset Solana states
					tokens = [];
					transactions = [];
					
					// EVM NFTs coming soon
					isLoadingNFTs = false;
					nfts = [];
					nftError = 'EVM NFTs coming soon';
				}
			})();
		}
	});

	function switchChain(newChain: ChainOption) {
		chainOption = newChain;
		showChainOptions = false;
		// Save network preference to localStorage
		localStorage.setItem('selected-network', newChain);
		// The walletService will be recreated automatically due to $derived
		// The $effect.pre will automatically trigger data refresh
	}

	// Debug function to clean up token storage issues
	// async function debugTokenStorage() {
	// 	console.log('=== Debug Token Storage ===');
	// 	console.log('Current wallet address:', address);

	// 	// Check all localStorage keys related to tokens
	// 	const allKeys = Object.keys(localStorage).filter((key) => key.includes('token'));
	// 	console.log('All token-related keys in localStorage:', allKeys);

	// 	// Check wallet-specific tokens
	// 	const walletSpecificKey = `imported-tokens-${address}`;
	// 	const walletTokens = localStorage.getItem(walletSpecificKey);
	// 	console.log(`Tokens for current wallet (${walletSpecificKey}):`, walletTokens);

	// 	// Check extension storage tokens
	// 	const extensionTokens = await walletService.getImportedTokensForWallet(address);
	// 	console.log(`Extension storage tokens for wallet ${address}:`, extensionTokens);

	// 	// Check legacy global tokens
	// 	const globalTokens = localStorage.getItem('imported-tokens');
	// 	console.log('Legacy global tokens:', globalTokens);

	// 	// Clean up legacy tokens
	// 	await SolanaWalletService.cleanupLegacyTokenStorageData();

	// 	// Refresh tokens
	// 	refreshTokens = !refreshTokens;
	// 	console.log('Token storage debug complete, refreshing tokens...');
	// }

	$effect(() => {
		if (toast === true) {
			setTimeout(() => {
				toast = false;
			}, 3000);
		}
	});

	// Show "Coming Soon" toast for NFT features
	function showComingSoonToast() {
		toast = true;
	}

	// Close network selector when clicking outside
	$effect(() => {
		function handleClickOutside(event: MouseEvent) {
			const target = event.target as HTMLElement;
			if (showChainOptions && !target.closest('.network-selector')) {
				showChainOptions = false;
			}
		}

		if (showChainOptions) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});
</script>

<section
	class="relative flex h-[600px] max-h-[600px] flex-col overflow-hidden bg-[#101212] px-4 pt-1 pb-1 text-center text-sm text-white capitalize"
>
	<VpnHeader />

	<!-- Redesigned Network and Wallet Info Header -->
	<div class="mb-2 flex-shrink-0 rounded-xl border border-[#333333] bg-[#1a1a1a] p-2">
		<div class="mb-1.5 flex items-center justify-between">
			<div class="flex items-center gap-2">
				<div class="flex items-center gap-2 rounded-lg bg-[#2a2a2a] px-2 py-1">
					<NetworkStatus networkType={chainOption === 'mainnet' ? 'mainnet' : 'testnet'} />
				</div>
			</div>

			<div class="network-selector relative">
				<button
					class="flex cursor-pointer items-center gap-2 rounded-lg border border-[#404040] bg-[#2a2a2a] px-2 py-1 transition-colors hover:bg-[#333333]"
					onclick={() => (showChainOptions = true)}
				>
					<span class="text-xs font-medium">{chainOption}</span>
					<svg class="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</button>
				{#if showChainOptions}
					<ul
						class="absolute top-8 right-0 z-20 min-w-[100px] rounded-lg border border-[#404040] bg-[#202222] p-1 shadow-lg shadow-[#070404]"
					>
						<li>
							<button
								class="w-full rounded-md p-1.5 text-left text-xs text-white transition-colors hover:bg-[#333333]"
								onclick={() => switchChain('mainnet')}
							>
								Mainnet
							</button>
						</li>
						<li>
							<button
								class="w-full rounded-md p-1.5 text-left text-xs text-white transition-colors hover:bg-[#333333]"
								onclick={() => switchChain('testnet')}
							>
								Testnet
							</button>
						</li>
					</ul>
				{/if}
			</div>
		</div>

		<!-- Wallet Address -->
		<div class="rounded-lg border border-[#333333] bg-[#0a0a0a] p-2 space-y-2">
			<!-- Chain Selector -->
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-1.5">
					<div class="flex size-4 items-center justify-center rounded-full bg-[#00ccba]">
						<svg class="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm8 0a2 2 0 114 0 2 2 0 01-4 0z"
							/>
						</svg>
					</div>
					<span class="text-xs text-gray-300">Wallet</span>
				</div>
				<!-- Chain indicator and network selector -->
				<div class="flex items-center gap-1.5 px-2 py-1 bg-[#333] rounded">
					<div class="w-2 h-2 rounded-full {activeChain === 'solana' ? 'bg-[#9945ff]' : 'bg-[#627eea]'}"></div>
					<span class="text-xs text-gray-400">
						{activeChain === 'solana' ? 'Solana' : 'EVM'}
					</span>
					{#if activeChain === 'evm'}
						<span class="text-xs text-gray-500">•</span>
						<span class="text-xs text-gray-300">{NETWORK_CONFIGS[selectedEvmNetwork]?.name || 'Unknown'}</span>
					{/if}
				</div>
			</div>
			
			<!-- Selected Address Display -->
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-1.5">
					<span class="text-xs text-gray-400">Address</span>
				</div>
				<div class="flex items-center gap-1.5">
					<span class="font-mono text-xs text-white">
						{activeChain === 'solana' 
							? formatChainAddress(solanaAddress || address, 'solana')
							: formatChainAddress(evmAddress, 'evm')
						}
					</span>
					<button
						onclick={() => navigator.clipboard.writeText(activeChain === 'solana' ? (solanaAddress || address) : evmAddress)}
						class="cursor-pointer rounded p-0.5 text-[#00ccba] transition-colors hover:text-[#00eeda]"
						title="Copy address"
					>
						<Copy size="10" />
					</button>
				</div>
			</div>

			<!-- Multi-Address Overview (collapsed by default) -->
			{#if solanaAddress && evmAddress}
				<details class="text-xs">
					<summary class="cursor-pointer text-gray-400 hover:text-white">View all addresses</summary>
					<div class="mt-2 space-y-1 pl-4 border-l border-[#333]">
						<div class="flex items-center justify-between">
							<span class="text-gray-400">Solana:</span>
							<span class="font-mono text-white">{formatChainAddress(solanaAddress, 'solana')}</span>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-gray-400">EVM:</span>
							<span class="font-mono text-white">{formatChainAddress(evmAddress, 'evm')}</span>
						</div>
					</div>
				</details>
			{/if}

			<!-- EVM Network Selector (only show when EVM is active) -->
			{#if activeChain === 'evm'}
				<div class="mt-2 p-2 rounded-lg border border-[#333333] bg-[#111]">
					<div class="mb-1.5 text-xs text-gray-400">EVM Network</div>
					<EvmNetworkSelector 
						selectedNetwork={selectedEvmNetwork}
						onNetworkChange={(networkId) => {
							selectedEvmNetwork = networkId;
							localStorage.setItem('selected-evm-network', networkId);
							// Trigger refresh of EVM data
							refreshTokens = !refreshTokens;
						}}
					/>
				</div>
			{/if}
		</div>
	</div>

	<!-- Balance Section -->
	<div
		class="mx-auto mb-1.5 flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-[#00ccba]/20 p-1.5"
	>
		<BadgeDollarSign color="#00ccba" size="20" />
	</div>
	<div class="mb-2 flex-shrink-0 text-center">
		{#if isLoadingBalance}
			<div class="flex items-center justify-center gap-2">
				<div class="h-3 w-3 animate-spin rounded-full border-b-2 border-[#00ccba]"></div>
				<span class="text-xs">Loading balance...</span>
			</div>
		{:else if balanceError}
			<div class="text-xs text-red-400">{balanceError}</div>
			{#if activeChain === 'solana'}
				<button
					class="mt-0.5 text-xs text-[#00ccba] underline"
					onclick={() => window.location.reload()}>Retry</button
				>
			{/if}
		{:else if activeChain === 'solana'}
			{#if isLoadingBalance}
				<h2 class="text-xl font-bold text-white">Loading...</h2>
				<p class="text-xs text-gray-400">Fetching balance</p>
			{:else}
				<h2 class="text-xl font-bold text-white">{parseFloat(userBalance || '0').toFixed(4)} SOL</h2>
				<p class="text-xs text-gray-400">${(parseFloat(userBalance || '0') * solPrice).toFixed(2)}</p>
			{/if}
		{:else if activeChain === 'evm'}
			{#if isLoadingBalance}
				<h2 class="text-xl font-bold text-white">Loading...</h2>
				<p class="text-xs text-gray-400">Fetching balance</p>
			{:else}
				<h2 class="text-xl font-bold text-white">{parseFloat(evmBalance || '0').toFixed(4)} {evmSymbol}</h2>
				<p class="text-xs text-gray-400">{NETWORK_CONFIGS[selectedEvmNetwork]?.name || 'EVM Network'}</p>
			{/if}
		{/if}
	</div>

	<!-- Action Buttons -->
	<div class="mb-2 flex flex-shrink-0 items-center justify-center gap-4">
		<button class="group cursor-pointer space-y-1" onclick={() => goto('/send-coin')}>
			<div
				class="flex size-8 items-center justify-center rounded-full border border-[#404040] bg-[#202222] p-1.5 transition-all group-hover:scale-105 hover:bg-[#2a2a2a]"
			>
				<Upload color="#00ccba" size="16" />
			</div>
			<p class="text-xs">Send</p>
		</button>
		<button class="group cursor-pointer space-y-1" onclick={() => getQRCodeUrl(activeChain === 'solana' ? (solanaAddress || address) : evmAddress)}>
			<div
				class="flex size-8 items-center justify-center rounded-full border border-[#404040] bg-[#202222] p-1.5 transition-all group-hover:scale-105 hover:bg-[#2a2a2a]"
			>
				<Download color="#00ccba" size="16" />
			</div>
			<p class="text-xs">Receive</p>
		</button>
		<a class="group cursor-pointer space-y-1" href="/swap-coin">
			<div
				class="flex size-8 items-center justify-center rounded-full border border-[#404040] bg-[#202222] p-1.5 transition-all group-hover:scale-105 hover:bg-[#2a2a2a]"
			>
				<Replace color="#00ccba" size="16" />
			</div>
			<p class="text-xs">Swap</p>
		</a>
	</div>

	<!-- Content Tabs - Flexible to fill remaining space -->
	<div
		class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#333333] bg-[#1a1a1a]"
	>
		<div
			class="flex flex-shrink-0 items-center justify-between border-b border-[#333333] bg-[#070707]"
		>
			<button
				class={`flex-1 px-2 py-1.5 text-xs font-medium transition-colors ${currentTab === 'tokens' ? 'border-b-2 border-[#00ccba] bg-[#00ccba]/10 text-[#00ccba]' : 'text-gray-400 hover:text-white'}`}
				aria-label="tokens"
				onclick={() => (currentTab = 'tokens')}>Tokens</button
			>
			<button
				class={`flex-1 px-2 py-1.5 text-xs font-medium transition-colors ${currentTab === 'nfts' ? 'border-b-2 border-[#00ccba] bg-[#00ccba]/10 text-[#00ccba]' : 'text-gray-400 hover:text-white'}`}
				aria-label="nfts"
				onclick={() => (currentTab = 'nfts')}>NFTs</button
			>
			<button
				class={`flex-1 px-2 py-1.5 text-xs font-medium transition-colors ${currentTab === 'activities' ? 'border-b-2 border-[#00ccba] bg-[#00ccba]/10 text-[#00ccba]' : 'text-gray-400 hover:text-white'}`}
				aria-label="activities"
				onclick={() => (currentTab = 'activities')}>Activities</button
			>
		</div>

		<!-- Scrollable content area that fills remaining space -->
		<div class="flex-1 overflow-hidden">
			{#if currentTab === 'tokens'}
				<div class="scrollbar-none h-full space-y-1.5 overflow-y-auto p-2">
					{#if activeChain === 'evm'}
						<!-- EVM Chain Tokens -->
						{#if isLoadingTokens}
							<div class="py-6 text-center">
								<div
									class="mx-auto h-6 w-6 animate-spin rounded-full border-b-2 border-[#00ccba]"
								></div>
								<p class="mt-2 text-xs">Loading EVM tokens...</p>
							</div>
						{:else if evmTokens.length > 0 || evmBalance !== '0'}
							<div class="space-y-1.5">
								<!-- Native Token Balance (PEAQ/RISE) -->
								<div class="flex items-center justify-between rounded-lg bg-[#202222] p-2.5">
									<div class="flex items-center gap-2.5">
										<div
											class="flex size-7 items-center justify-center rounded-full bg-[#627eea]"
										>
											<span class="text-xs font-bold text-white">Ξ</span>
										</div>
										<div>
											<h4 class="text-sm font-semibold">{NETWORK_CONFIGS[selectedEvmNetwork]?.name || 'EVM'}</h4>
											<p class="text-xs text-gray-400">{evmSymbol}</p>
										</div>
									</div>
									<div class="text-right">
										<p class="text-sm font-semibold">
											{parseFloat(evmBalance).toFixed(4)} {evmSymbol}
										</p>
										<p class="text-xs text-gray-400">Native Token</p>
									</div>
								</div>

								<!-- EVM Tokens -->
								{#each evmTokens as token (token.address)}
									<div class="flex items-center justify-between rounded-lg bg-[#202222] p-2.5">
										<div class="flex items-center gap-2.5">
											<div class="flex size-7 items-center justify-center rounded-full bg-[#404040]">
												<span class="text-xs text-[#00ccba]">🪙</span>
											</div>
											<div>
												<h4 class="text-sm font-semibold">{token.name || 'Unknown Token'}</h4>
												<p class="text-left text-xs text-gray-400">{token.symbol || 'TOKEN'}</p>
											</div>
										</div>
										<div class="text-right">
											<p class="text-sm font-semibold">{token.amount.toFixed(token.decimals > 6 ? 6 : token.decimals)}</p>
											<p class="text-xs text-gray-400">{token.symbol}</p>
										</div>
									</div>
								{/each}

								<!-- Import EVM Tokens Button -->
								<div class="pt-2 text-center">
									<button
										class="mx-auto block w-4/5 max-w-[170px] cursor-pointer rounded-xl bg-[#00ccba] px-3 py-1.5 text-xs"
										onclick={() => goto('/import-evm-tokens')}
									>
										Import EVM Tokens
									</button>
								</div>
							</div>
						{:else}
							<div class="py-5 text-center">
								<div class="mb-2 text-2xl">⚡</div>
								<h3 class="mb-2.5 text-sm">No EVM tokens yet</h3>
								<p class="mb-3 text-xs text-gray-400">Import ERC-20 tokens to get started</p>
								<button
									class="mx-auto block w-4/5 max-w-[170px] cursor-pointer rounded-xl bg-[#00ccba] px-3 py-1.5 text-xs"
									onclick={() => goto('/import-evm-tokens')}
								>
									Import EVM Tokens
								</button>
							</div>
						{/if}
					{:else if isLoadingTokens}
						<div class="py-6 text-center">
							<div
								class="mx-auto h-6 w-6 animate-spin rounded-full border-b-2 border-[#00ccba]"
							></div>
							<p class="mt-2 text-xs">Loading tokens...</p>
						</div>
					{:else if tokens.length > 0}
						<div class="space-y-1.5">
							<!-- SOL Balance always shown first for Solana -->
							<div class="flex items-center justify-between rounded-lg bg-[#202222] p-2.5">
								<div class="flex items-center gap-2.5">
									<div
										class="flex size-7 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
									>
										<span class="text-xs font-bold text-white">◎</span>
									</div>
									<div>
										<h4 class="text-sm font-semibold">Solana</h4>
										<p class="text-xs text-gray-400">SOL</p>
									</div>
								</div>
								<div class="text-right">
									<p class="text-sm font-semibold">
										${(parseFloat(userBalance || '0') * solPrice).toFixed(2)}
									</p>
									<p class="text-xs text-gray-400">
										{parseFloat(userBalance || '0').toFixed(4)} SOL
									</p>
								</div>
							</div>

							<!-- Other tokens -->
							{#each tokens as token (token.name)}
								<div class="flex items-center justify-between rounded-lg bg-[#202222] p-2.5">
									<div class="flex items-center gap-2.5">
										<div class="flex size-7 items-center justify-center rounded-full bg-[#404040]">
											<span class="text-xs text-[#00ccba]">🪙</span>
										</div>
										<div>
											<h4 class="text-sm font-semibold">{token.name || 'Unknown Token'}</h4>
											<p class="text-left text-xs text-gray-400">{token.symbol || 'TOKEN'}</p>
										</div>
									</div>
									<div class="text-right">
										<p class="text-sm font-semibold">{token.amount.toFixed(token.decimals || 5)}</p>
										<p class="text-xs text-gray-400">{token.symbol}</p>
									</div>
								</div>
							{/each}

							<!-- Import Tokens Button -->
							<div class="pt-2 text-center">
								<button
									class="mx-auto block w-4/5 max-w-[170px] cursor-pointer rounded-xl bg-[#00ccba] px-3 py-1.5 text-xs"
									onclick={() => goto('/import-tokens')}
								>
									Import Tokens
								</button>
							</div>
						</div>
					{:else}
						<div class="py-5 text-center">
							<h3 class="mb-2.5 text-sm">No tokens in your wallet yet</h3>
							<button
								class="mx-auto block w-4/5 max-w-[170px] cursor-pointer rounded-xl bg-[#00ccba] px-3 py-1.5 text-xs"
								onclick={() => goto('/import-tokens')}
							>
								Import Tokens
							</button>
						</div>
					{/if}
				</div>
			{:else if currentTab === 'nfts'}
				<div class="scrollbar-none h-full overflow-y-auto p-1.5">
					{#if activeChain === 'evm'}
						<!-- EVM Chain - Coming Soon -->
						<div class="py-5 text-center">
							<div class="mb-2 text-2xl">🎨</div>
							<h3 class="mb-1.5 text-sm font-semibold">EVM NFTs Coming Soon</h3>
							<p class="mb-3 text-xs text-gray-400">Peaq and Rise NFT support is being added</p>
							<div class="rounded-lg border border-[#333333] bg-[#202222] p-3">
								<div class="text-xs text-gray-500">EVM NFT collections will appear here</div>
							</div>
						</div>
					{:else if isLoadingNFTs}
						<div class="py-4 text-center">
							<div
								class="mx-auto h-4 w-4 animate-spin rounded-full border-b-2 border-[#00ccba]"
							></div>
							<p class="mt-1.5 text-xs">Loading NFTs...</p>
						</div>
					{:else if nftError}
						<div class="py-4 text-center">
							<div class="mb-1.5 text-xs text-red-400">{nftError}</div>
							{#if activeChain === 'solana'}
								<button
									class="text-xs text-[#00ccba] underline"
									onclick={() => window.location.reload()}>Retry</button
								>
							{/if}
						</div>
					{:else if nfts.length > 0}
						<!-- Explore NFTs Button - Coming Soon -->
						<div class="mb-3">
							<button
								class="w-full rounded-lg bg-[#333333] hover:bg-[#404040] px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
								onclick={showComingSoonToast}
							>
								🔍 Explore More NFTs (Coming Soon)
							</button>
						</div>

						<!-- My NFTs Header -->
						<div class="mb-2 flex items-center justify-between">
							<h4 class="text-sm font-medium text-white">My NFTs ({nfts.length})</h4>
						</div>
						
						<!-- Compact NFT Grid -->
						<div class="mb-2 grid grid-cols-3 gap-1.5">
							{#each nfts as nft, index (nft.metadata.name)}
								<button
									class="group cursor-pointer overflow-hidden rounded-md border border-[#333333] bg-[#202222] transition-colors hover:border-[#00ccba]/50 w-full text-left p-0"
									onclick={showComingSoonToast}
								>
									<!-- Compact NFT Image -->
									<div
										class="relative aspect-square overflow-hidden bg-gradient-to-br from-[#101212] to-[#1a1a1a]"
									>
										{#if nft.metadata.image}
											<img
												src={nft.metadata.image}
												alt={nft.metadata.name || 'NFT'}
												class="h-full w-full object-cover transition-transform group-hover:scale-105"
												loading={index < 9 ? 'eager' : 'lazy'}
												onerror={(e) => {
													if (e.target) {
														(e.target as HTMLElement).style.display = 'none';
														const fallback = (e.target as HTMLElement).nextElementSibling;
														if (fallback) (fallback as HTMLElement).style.display = 'flex';
													}
												}}
											/>
											<!-- Fallback -->
											<div
												class="absolute inset-0 hidden items-center justify-center bg-gradient-to-br from-[#00ccba]/20 to-[#404040]/20 text-lg"
											>
												🎨
											</div>
										{:else}
											<div
												class="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#00ccba]/20 to-[#404040]/20"
											>
												<div class="text-lg">🎨</div>
											</div>
										{/if}

										<!-- Collection badge -->
										{#if nft.metadata.collection}
											<div
												class="absolute top-0.5 right-0.5 rounded-full bg-[#00ccba] px-1 py-0.5 text-[8px] font-bold text-black"
											>
												✓
											</div>
										{/if}
									</div>

									<!-- Minimal NFT Info -->
									<div class="p-1.5">
										<h4 class="truncate text-[10px] leading-tight font-medium text-white">
											{nft.metadata.name || 'Unnamed NFT'}
										</h4>
										{#if nft.metadata.collection?.name || nft.metadata.symbol}
											<p class="mt-0.5 truncate text-[9px] text-[#00ccba]">
												{nft.metadata.collection?.name || nft.metadata.symbol}
											</p>
										{/if}
									</div>
								</button>
							{/each}
						</div>

						<!-- Compact Summary -->
						<div class="rounded-md border border-[#333333] bg-[#1a1a1a] p-1.5">
							<div class="flex items-center justify-between text-[10px]">
								<span class="text-gray-400">{nfts.length} NFTs</span>
								{#if nfts.some((nft) => nft.metadata.collection)}
									<span class="text-[#00ccba]">
										{new Set(
											nfts
												.filter((nft) => nft.metadata.collection?.name)
												.map((nft) => nft.metadata.collection.name)
										).size} Collections
									</span>
								{/if}
							</div>
						</div>
					{:else}
						<!-- Empty state - Coming Soon for explore -->
						<div class="py-5 text-center">
							<div class="mb-2 text-2xl">🎨</div>
							<h3 class="mb-1.5 text-xs font-semibold">No NFTs yet</h3>
							<p class="mb-3 text-[10px] text-gray-400">Discover and collect digital assets on Solana</p>
							<button
								class="mx-auto block rounded-lg bg-[#333333] hover:bg-[#404040] px-4 py-2 text-[11px] font-medium text-gray-300 hover:text-white transition-colors"
								onclick={showComingSoonToast}
							>
								🔍 Explore NFTs (Coming Soon)
							</button>
						</div>
					{/if}
				</div>
			{:else if currentTab === 'activities'}
				<div class="scrollbar-none h-full space-y-1.5 overflow-y-auto p-2">
					{#if activeChain === 'evm'}
						<!-- EVM Chain Activities -->
						{#if isLoadingTransactions}
							<div class="py-5 text-center">
								<div
									class="mx-auto h-5 w-5 animate-spin rounded-full border-b-2 border-[#00ccba]"
								></div>
								<p class="mt-2 text-xs">Loading EVM transactions...</p>
							</div>
						{:else if transactionError}
							<div class="py-5 text-center">
								<div class="mb-2 text-xs text-red-400">{transactionError}</div>
								<button
									class="text-xs text-[#00ccba] underline"
									onclick={() => window.location.reload()}>Retry</button
								>
							</div>
						{:else if evmTransactions.length > 0}
							<div class="space-y-1.5">
								{#each evmTransactions as tx (tx.hash)}
									<div class="rounded-lg bg-[#202222] p-2.5">
										<div class="flex items-center justify-between">
											<div class="flex items-center gap-2.5">
												<div
													class="flex size-7 items-center justify-center rounded-full bg-[#00ccba]/10 p-1.5"
												>
													{#if tx.type === 'send'}
														<Upload color="#00ccba" size="14" />
													{:else if tx.type === 'receive'}
														<Download color="#00ccba" size="14" />
													{:else}
														<Replace color="#00ccba" size="14" />
													{/if}
												</div>
												<div>
													<h4 class="text-sm font-semibold capitalize">{tx.type}</h4>
													<p class="text-xs text-left text-gray-400">
														{#if tx.type === 'send' && tx.to}
															To: {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
														{:else if tx.type === 'receive' && tx.from}
															From: {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
														{:else}
															{new Date(tx.timestamp).toLocaleDateString()}
														{/if}
													</p>
													<p
														class="text-xs text-left {tx.status === 'confirmed'
															? 'text-green-400'
															: tx.status === 'pending'
																? 'text-yellow-400'
																: 'text-red-400'}"
													>
														{tx.status}
													</p>
												</div>
											</div>
											<div class="text-right">
												<h4
													class="text-sm font-bold {tx.type === 'receive'
														? 'text-green-400'
														: 'text-white'}"
												>
													{tx.type === 'receive' ? '+' : '-'}{tx.amount.toFixed(6)}
													{tx.token}
												</h4>
												<p class="text-xs text-gray-400">
													{new Date(tx.timestamp).toLocaleTimeString()}
												</p>
												{#if tx.fee}
													<p class="text-xs text-gray-500">Fee: {tx.fee.toFixed(6)} {evmSymbol}</p>
												{/if}
												{#if tx.gasUsed && tx.gasPrice}
													<p class="text-xs text-gray-500">Gas: {tx.gasUsed} @ {parseFloat(tx.gasPrice).toFixed(2)} Gwei</p>
												{/if}
											</div>
										</div>
										<!-- Transaction hash (clickable to view on explorer) -->
										{#if tx.explorerUrl}
											<div class="mt-1.5 border-t border-gray-600 pt-1.5">
												<div class="flex items-center justify-between">
													<span class="text-xs text-gray-500 font-mono">{tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}</span>
													<button
														onclick={() => window.open(tx.explorerUrl, '_blank')}
														class="flex items-center gap-1 text-xs text-[#00ccba] hover:text-[#00eeda]"
													>
														View on Explorer
														<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																stroke-width="2"
																d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
															/>
														</svg>
													</button>
												</div>
											</div>
										{/if}
									</div>
								{/each}
							</div>
						{:else}
							<div class="py-6 text-center">
								<div class="mb-2 text-2xl">📈</div>
								<h3 class="text-sm">No EVM transactions yet</h3>
								<p class="mt-1 text-xs text-gray-400">
									Transactions will appear here after you send or receive {evmSymbol}
								</p>
							</div>
						{/if}
					{:else if isLoadingTransactions}
						<div class="py-5 text-center">
							<div
								class="mx-auto h-5 w-5 animate-spin rounded-full border-b-2 border-[#00ccba]"
							></div>
							<p class="mt-2 text-xs">Loading transactions...</p>
						</div>
					{:else if transactionError}
						<div class="py-5 text-center">
							<div class="mb-2 text-xs text-red-400">{transactionError}</div>
							{#if activeChain === 'solana'}
								<button
									class="text-xs text-[#00ccba] underline"
									onclick={() => window.location.reload()}>Retry</button
								>
							{/if}
						</div>
					{:else if transactions.length > 0}
						<div class="space-y-1.5">
							{#each transactions as tx (tx.token)}
								<div class="rounded-lg bg-[#202222] p-2.5">
									<div class="flex items-center justify-between">
										<div class="flex items-center gap-2.5">
											<div
												class="flex size-7 items-center justify-center rounded-full bg-[#00ccba]/10 p-1.5"
											>
												{#if tx.type === 'send'}
													<Upload color="#00ccba" size="14" />
												{:else if tx.type === 'receive'}
													<Download color="#00ccba" size="14" />
												{:else}
													<Replace color="#00ccba" size="14" />
												{/if}
											</div>
											<div >
												<h4 class="text-sm font-semibold capitalize">{tx.type}</h4>
												<p class="text-xs text-left text-gray-400">
													{#if tx.type === 'send' && tx.to}
														To: {formatWalletAddress(tx.to)}
													{:else if tx.type === 'receive' && tx.from}
														From: {formatWalletAddress(tx.from)}
													{:else}
														{new Date(tx.timestamp).toLocaleDateString()}
													{/if}
												</p>
												<p
													class="text-xs text-left {tx.status === 'confirmed'
														? 'text-green-400'
														: tx.status === 'pending'
															? 'text-yellow-400'
															: 'text-red-400'}"
												>
													{tx.status}
												</p>
											</div>
										</div>
										<div class="text-right">
											<h4
												class="text-sm font-bold {tx.type === 'receive'
													? 'text-green-400'
													: 'text-white'}"
											>
												{tx.type === 'receive' ? '+' : '-'}{tx.amount.toFixed(6)}
												{tx.token}
											</h4>
											<p class="text-xs text-gray-400">
												{new Date(tx.timestamp).toLocaleTimeString()}
											</p>
											{#if tx.fee}
												<p class="text-xs text-gray-500">Fee: {tx.fee.toFixed(6)} SOL</p>
											{/if}
										</div>
									</div>
									<!-- Transaction signature (clickable to view on explorer) -->
									{#if tx.explorerUrl}
										<div class="mt-1.5 border-t border-gray-600 pt-1.5">
											<button
												onclick={() => window.open(tx.explorerUrl, '_blank')}
												class="flex items-center gap-1 text-xs text-[#00ccba] hover:text-[#00eeda]"
											>
												View on Explorer
												<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
													/>
												</svg>
											</button>
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{:else}
						<div class="py-6 text-center">
							<h3 class="text-sm">No transactions yet</h3>
							<p class="mt-1 text-xs text-gray-400">
								Transactions will appear here after you send or receive SOL
							</p>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
	<!-- Close content tabs container -->
</section>

<Toast status="Coming soon..." success={false} error={false} open={toast} />

<Toast status={errorMessage} success={false} error={true} open={showErrorToast} />

<Dialog open={openQRCode} onClose={() => (openQRCode = false)}>
	<div class="mx-auto max-w-11/12 rounded-lg bg-[#1212128f] p-8">
		{#if qrCodeUrl.length > 0}
			<div class="grid space-y-4">
				<img src={qrCodeUrl} alt="qrcode" />
				<p class="text-center font-bold">{formatWalletAddress(address)}</p>
				<button
					onclick={() => navigator.clipboard.writeText(address)}
					class="my-2 flex cursor-pointer justify-center gap-2 text-sm text-[#00eeda] capitalize"
				>
					<p>copy to clipboard</p>
					<Copy color="#00eeda" size="20" />
				</button>
			</div>
		{:else}
			<p>Loading</p>
		{/if}
	</div>
</Dialog>

<style>
	.scrollbar-none::-webkit-scrollbar {
		display: none;
	}
	.scrollbar-none {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
