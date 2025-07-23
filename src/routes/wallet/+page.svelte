<script lang='ts'>


import Dialog from "$lib/components/ui/dialog.svelte";
import { BadgeDollarSign,  Copy,  Download,  Replace, Upload } from "@lucide/svelte";
  import { walletAddress} from '../../store/store'
  import { formatWalletAddress } from "$lib/helpers/formatWalletAddress";
  import { generateQRCode } from "$lib/helpers/qrCode";
  import VpnHeader from "$lib/components/ui/vpn-header.svelte";
  import Toast from "$lib/components/ui/toast.svelte";
  import NetworkStatus from "$lib/components/ui/network-status.svelte";
  import { SolanaWalletService } from '$lib/helpers/solanaTransactions';
  import type { TokenInfo, TransactionHistory } from '../../types/types';
  import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { publicKey } from "@metaplex-foundation/umi";
import { fetchAllDigitalAssetWithTokenByOwner } from "@metaplex-foundation/mpl-token-metadata";
	import { goto } from "$app/navigation";
// import { clusterApiUrl } from "@solana/web3.js";

// Extend BigInt type to include toJSON for TypeScript


  type ChainOption = 'mainnet' | 'testnet';

  let address = $state('')
  let currentTab = $state('tokens')
  let userBalance = $state('')
  let solPrice = $state(0) // SOL price in USD
  let openQRCode = $state(false)
  let qrCodeUrl = $state('')
  let showChainOptions = $state(false)
  let toast = $state(false)
  let chainOption = $state<ChainOption>('mainnet')

  // Load saved network preference on component mount
  $effect(() => {
    const savedNetwork = localStorage.getItem('selected-network') as ChainOption;
    if (savedNetwork && (savedNetwork === 'mainnet' || savedNetwork === 'testnet')) {
      chainOption = savedNetwork;
    }
  })
  let nfts = $state<any[]>([])
  let tokens = $state<TokenInfo[]>([])
  let transactions = $state<TransactionHistory[]>([])
  let isLoadingNFTs = $state(false)
  let isLoadingTokens = $state(false)
  let isLoadingTransactions = $state(false)
  let isLoadingBalance = $state(false)
  let balanceError = $state('')
  let tokenError = $state('')
  let transactionError = $state('')
  let nftError = $state('')
  let showErrorToast = $state(false)
  let errorMessage = $state('')
  let refreshTokens = $state(false) // Trigger for refreshing tokens

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
  let walletService = $derived(new SolanaWalletService(chainOption === 'mainnet' ? 'mainnet' : 'testnet'))

  // Reactive RPC instance
  $effect(() => {
    // Reset data when switching chains
    nfts = [];
    tokens = [];
    transactions = [];
    userBalance = '';
    balanceError = '';
    tokenError = '';
    transactionError = '';
    nftError = '';
    showErrorToast = false;
  })

  walletAddress.subscribe((value) => address = value)

  async function getQRCodeUrl(address: string) {
    const qrCode = await generateQRCode(address);
    qrCodeUrl = qrCode ?? '';
    openQRCode = true
  }

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
  

  // Function to fetch balance 
  async function fetchBalance(address: string): Promise<string> {
    try {
      const balance = await walletService.getBalance(address);
      return balance.toString();
    } catch (error: unknown) {
      console.error('Balance fetch error:', error);
      throw error;
    }
  }

  // Function to fetch SOL price
  async function fetchSOLPrice(): Promise<number> {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      const data = await response.json();
      return data.solana.usd;
    } catch (error) {
      console.error('Price fetch error:', error);
      return 0;
    }
  }

  // Function to fetch NFTs with proper metadata
  async function fetchNFTs(address: string): Promise<any[]> {
    try {
      // Use Helius endpoint from walletService for consistency
      const endpoint = walletService.getConnection().rpcEndpoint;
      
      const umi = createUmi(endpoint);
      const ownerPublicKey = publicKey(address);
      const allNFTs = await fetchAllDigitalAssetWithTokenByOwner(umi, ownerPublicKey);
      
      // Filter and format NFTs properly
      const formattedNFTs = [];
      
      for (const nft of allNFTs) {
        try {
          // Only include actual NFTs (non-fungible tokens)
          if (nft.mint.supply === 1n && nft.mint.decimals === 0) {
            let metadata = {
              name: nft.metadata.name || 'Unnamed NFT',
              symbol: nft.metadata.symbol || '',
              description: '',
              image: '',
              attributes: [],
              collection: null
            };

            // Try to fetch off-chain metadata if URI exists
            if (nft.metadata.uri && nft.metadata.uri !== '') {
              try {
                const response = await fetch(nft.metadata.uri);
                if (response.ok) {
                  const offChainMetadata = await response.json();
                  metadata = {
                    name: offChainMetadata.name || metadata.name,
                    symbol: offChainMetadata.symbol || metadata.symbol,
                    description: offChainMetadata.description || '',
                    image: offChainMetadata.image || offChainMetadata.image_url || '',
                    attributes: offChainMetadata.attributes || [],
                    collection: offChainMetadata.collection || null
                  };
                }
              } catch (metadataError) {
                console.warn('Failed to fetch NFT metadata:', metadataError);
              }
            }

            formattedNFTs.push({
              mint: nft.publicKey.toString(),
              metadata,
              originalNft: nft
            });
          }
        } catch (nftError) {
          console.warn('Error processing NFT:', nftError);
        }
      }
      
      return formattedNFTs;
    } catch (error: unknown) {
      console.error('NFT fetch error:', error);
      throw error;
    }
  }
  // Main effect to fetch data when address, chain, or tokens change
  $effect.pre(() => {
    if (address) {
      // The refreshTokens variable will trigger this effect when tokens are updated
      refreshTokens; // This line ensures the effect runs when refreshTokens changes
      
      (async () => {
        // Reset state
        balanceError = '';
        
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
          userBalance = await fetchBalance(address);
          console.log(`${chainOption} Balance:`, userBalance);
        } catch (error: unknown) {
          console.error("Failed to fetch balance:", error);
          balanceError = SolanaWalletService.getUserFriendlyErrorMessage(error);
          userBalance = '0';
        } finally {
          isLoadingBalance = false;
        }

        // Fetch NFTs
        try {
          isLoadingNFTs = true;
          nftError = '';
          const allNFTs = await fetchNFTs(address);
          nfts = allNFTs;
          console.log(`Found ${allNFTs.length} NFTs on ${chainOption}`);
        } catch (error: any) {
          console.error("Error fetching NFTs:", error);
          nfts = [];
          nftError = SolanaWalletService.getUserFriendlyErrorMessage(error);
          // Don't show toast for expected errors - they're displayed inline
        } finally {
          isLoadingNFTs = false;
        }

        // Fetch tokens
        try {
          isLoadingTokens = true;
          tokenError = '';
          console.log(`Fetching tokens for wallet: ${address} on ${chainOption}`);
          const tokenAccounts = await walletService.getTokenAccounts(address);
          tokens = tokenAccounts;
          console.log(`Found ${tokenAccounts.length} tokens on ${chainOption} for wallet ${address}`);
          
          // Debug: Log imported tokens for this wallet
          const importedTokens = await walletService.getImportedTokensForWallet(address);
          console.log(`Imported tokens for wallet ${address}:`, importedTokens);
        } catch (error: any) {
          console.error("Error fetching tokens:", error);
          tokens = [];
          tokenError = SolanaWalletService.getUserFriendlyErrorMessage(error);
          // Don't show toast for expected errors - they're displayed inline
        } finally {
          isLoadingTokens = false;
        }

        // Fetch transaction history
        try {
          isLoadingTransactions = true;
          transactionError = '';
          const history = await walletService.getTransactionHistory(address, 10);
          transactions = history;
          console.log(`Found ${history.length} transactions on ${chainOption}`);
        } catch (error: any) {
          console.error("Error fetching transactions:", error);
          transactions = [];
          transactionError = SolanaWalletService.getUserFriendlyErrorMessage(error);
          // Don't show toast for expected errors - they're displayed inline
        } finally {
          isLoadingTransactions = false;
        }
      })();
    }
  })

  // Function to show error toast
  function showError(message: string) {
    errorMessage = message;
    showErrorToast = true;
    setTimeout(() => {
      showErrorToast = false;
    }, 4000);
  }
  function switchChain(newChain: ChainOption) {
    chainOption = newChain;
    showChainOptions = false;
    // Save network preference to localStorage
    localStorage.setItem('selected-network', newChain);
    // The walletService will be recreated automatically due to $derived
    // The $effect.pre will automatically trigger data refresh
  }

  // Debug function to clean up token storage issues
  async function debugTokenStorage() {
    console.log('=== Debug Token Storage ===');
    console.log('Current wallet address:', address);
    
    // Check all localStorage keys related to tokens
    const allKeys = Object.keys(localStorage).filter(key => key.includes('token'));
    console.log('All token-related keys in localStorage:', allKeys);
    
    // Check wallet-specific tokens
    const walletSpecificKey = `imported-tokens-${address}`;
    const walletTokens = localStorage.getItem(walletSpecificKey);
    console.log(`Tokens for current wallet (${walletSpecificKey}):`, walletTokens);
    
    // Check extension storage tokens
    const extensionTokens = await walletService.getImportedTokensForWallet(address);
    console.log(`Extension storage tokens for wallet ${address}:`, extensionTokens);
    
    // Check legacy global tokens
    const globalTokens = localStorage.getItem('imported-tokens');
    console.log('Legacy global tokens:', globalTokens);
    
    // Clean up legacy tokens
    await SolanaWalletService.cleanupLegacyTokenStorageData();
    
    // Refresh tokens
    refreshTokens = !refreshTokens;
    console.log('Token storage debug complete, refreshing tokens...');
  }

  $effect(() => {
    if (toast === true) {
      setTimeout(() => {
        toast = false;
      }, 3000);
    }
  })

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
  })  
</script>

<style>
  .scrollbar-none::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-none {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>


  
<section class="h-[600px] max-h-[600px] overflow-hidden pt-1 pb-1 px-4 bg-[#101212] text-white text-center capitalize relative flex flex-col text-sm">
  <VpnHeader  />
  
  <!-- Redesigned Network and Wallet Info Header -->
  <div class="bg-[#1a1a1a] rounded-xl p-2 mb-2 border border-[#333333] flex-shrink-0">
    <div class="flex items-center justify-between mb-1.5">
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-2 bg-[#2a2a2a] rounded-lg px-2 py-1">
          <NetworkStatus networkType={chainOption === 'mainnet' ? 'mainnet' : 'testnet'} />
        </div>
      </div>
      
      <div class='relative network-selector'>
        <button 
          class="flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#333333] rounded-lg px-2 py-1 transition-colors cursor-pointer border border-[#404040]" 
          onclick={() => showChainOptions = true}
        >
          <span class="text-xs font-medium">{chainOption}</span> 
          <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        {#if showChainOptions}
          <ul class="absolute top-8 right-0 min-w-[100px] rounded-lg bg-[#202222] border border-[#404040] shadow-lg shadow-[#070404] p-1 z-20">
            <li>
              <button 
                class="w-full text-left text-white p-1.5 rounded-md hover:bg-[#333333] transition-colors text-xs" 
                onclick={() => switchChain('mainnet')}
              >
                Mainnet
              </button>
            </li>
            <li>
              <button 
                class="w-full text-left text-white p-1.5 rounded-md hover:bg-[#333333] transition-colors text-xs" 
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
    <div class="bg-[#0a0a0a] rounded-lg p-2 border border-[#333333]">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <div class="size-4 bg-[#00ccba] rounded-full flex items-center justify-center">
            <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm8 0a2 2 0 114 0 2 2 0 01-4 0z"/>
            </svg>
          </div>
          <span class="text-gray-300 text-xs">Wallet</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-white font-mono text-xs">{formatWalletAddress(address)}</span>
          <button 
            onclick={() => navigator.clipboard.writeText(address)}
            class="text-[#00ccba] hover:text-[#00eeda] p-0.5 rounded transition-colors cursor-pointer"
            title="Copy address"
          >
            <Copy size='10' />
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Balance Section -->  
  <div class='mx-auto p-1.5 bg-[#00ccba]/20 size-10 rounded-full flex items-center justify-center mb-1.5 flex-shrink-0'>
    <BadgeDollarSign color='#00ccba' size='20'  />
  </div>
  <div class="text-center mb-2 flex-shrink-0">
    {#if isLoadingBalance}
      <div class="flex items-center justify-center gap-2">
        <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-[#00ccba]"></div>
        <span class="text-xs">Loading balance...</span>
      </div>
    {:else if balanceError}
      <div class="text-red-400 text-xs">{balanceError}</div>
      <button class="text-xs text-[#00ccba] underline mt-0.5" onclick={() => window.location.reload()}>Retry</button>
    {:else}
      <h1 class="font-bold text-lg">${(parseFloat(userBalance || '0') * solPrice).toFixed(2)}</h1>
      <p class="text-xs text-gray-400">{parseFloat(userBalance || '0').toFixed(4)} SOL</p>
    {/if}
  </div>
  
  <!-- Action Buttons -->
  <div class="flex gap-4 items-center justify-center mb-2 flex-shrink-0">
    <button class="space-y-1 cursor-pointer group" onclick={() => goto('/send-coin')}>
      <div class="size-8 p-1.5 rounded-full bg-[#202222] hover:bg-[#2a2a2a] border border-[#404040] transition-all group-hover:scale-105 flex items-center justify-center">
        <Upload color='#00ccba' size='16' />
      </div>
      <p class="text-xs">Send</p>
    </button>
    <button class="space-y-1 cursor-pointer group" onclick={() => getQRCodeUrl(address)}>
      <div class="size-8 p-1.5 rounded-full bg-[#202222] hover:bg-[#2a2a2a] border border-[#404040] transition-all group-hover:scale-105 flex items-center justify-center">
        <Download color='#00ccba' size='16' />
      </div>
      <p class="text-xs">Receive</p>
    </button>
    <a class="space-y-1 cursor-pointer group" href="/swap-coin" >
      <div class="size-8 p-1.5 rounded-full bg-[#202222] hover:bg-[#2a2a2a] border border-[#404040] transition-all group-hover:scale-105 flex items-center justify-center">
        <Replace color='#00ccba' size='16' />
      </div>
      <p class="text-xs">Swap</p>
    </a>
  </div>
  
  <!-- Content Tabs - Flexible to fill remaining space -->
  <div class="bg-[#1a1a1a] rounded-xl border border-[#333333] overflow-hidden flex flex-col flex-1 min-h-0">
    <div class="flex items-center justify-between bg-[#070707] border-b border-[#333333] flex-shrink-0">
      <button class={`flex-1 py-1.5 px-2 text-xs font-medium transition-colors ${currentTab === 'tokens' ? 'text-[#00ccba] bg-[#00ccba]/10 border-b-2 border-[#00ccba]' : 'text-gray-400 hover:text-white'}`} aria-label="tokens" onclick={() => currentTab = 'tokens'}>Tokens</button>
      <button class={`flex-1 py-1.5 px-2 text-xs font-medium transition-colors ${currentTab === 'nfts' ? 'text-[#00ccba] bg-[#00ccba]/10 border-b-2 border-[#00ccba]' : 'text-gray-400 hover:text-white'}`} aria-label="nfts" onclick={() => currentTab = 'nfts'}>NFTs</button>
      <button class={`flex-1 py-1.5 px-2 text-xs font-medium transition-colors ${currentTab === 'activities' ? 'text-[#00ccba] bg-[#00ccba]/10 border-b-2 border-[#00ccba]' : 'text-gray-400 hover:text-white'}`} aria-label="activities" onclick={() => currentTab = 'activities'}>Activities</button>
    </div>
    
    <!-- Scrollable content area that fills remaining space -->
    <div class="flex-1 overflow-hidden">
      {#if currentTab === 'tokens'}
        <div class="h-full overflow-y-auto p-2 space-y-1.5 scrollbar-none">
          {#if isLoadingTokens}
            <div class="text-center py-6">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00ccba] mx-auto"></div>
              <p class="mt-2 text-xs">Loading tokens...</p>
            </div>
          {:else if tokens.length > 0}
            <div class="space-y-1.5">
              <!-- SOL Balance always shown first -->
              <div class="bg-[#202222] rounded-lg p-2.5 flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <div class="size-7 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-xs font-bold">◎</span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-sm">Solana</h4>
                    <p class="text-xs text-gray-400">SOL</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-sm">${(parseFloat(userBalance || '0') * solPrice).toFixed(2)}</p>
                  <p class="text-xs text-gray-400">{parseFloat(userBalance || '0').toFixed(4)} SOL</p>
                </div>
              </div>
              
              <!-- Other tokens -->
              {#each tokens as token}
                <div class="bg-[#202222] rounded-lg p-2.5 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <div class="size-7 bg-[#404040] rounded-full flex items-center justify-center">
                      <span class="text-[#00ccba] text-xs">🪙</span>
                    </div>
                    <div>
                      <h4 class="font-semibold text-sm">{token.name || 'Unknown Token'}</h4>
                      <p class="text-xs text-gray-400 text-left">{token.symbol || 'TOKEN'}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold text-sm">{token.amount.toFixed(token.decimals || 5)}</p>
                    <p class="text-xs text-gray-400">{token.symbol}</p>
                  </div>
                </div>
              {/each}
              
              <!-- Import Tokens Button -->
              <div class="pt-2 text-center">
                <button 
                  class="rounded-xl py-1.5 px-3 bg-[#00ccba] cursor-pointer mx-auto block w-4/5 max-w-[170px] text-xs" 
                  onclick={() => goto('/import-tokens')}
                >
                  Import Tokens
                </button>
              </div>
            </div>
          {:else}
            <div class="text-center py-5">
              <h3 class="mb-2.5 text-sm">No tokens in your wallet yet</h3>
              <button 
                class="rounded-xl py-1.5 px-3 bg-[#00ccba] cursor-pointer mx-auto block w-4/5 max-w-[170px] text-xs" 
                onclick={() => goto('/import-tokens')}
              >
                Import Tokens
              </button>
            </div>
          {/if}
        </div>
      {:else if currentTab === 'nfts'}
        <div class="h-full overflow-y-auto p-1.5 scrollbar-none">
          {#if isLoadingNFTs}
            <div class="text-center py-4">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-[#00ccba] mx-auto"></div>
              <p class="mt-1.5 text-xs">Loading NFTs...</p>
            </div>
          {:else if nftError}
            <div class="text-center py-4">
              <div class="text-red-400 text-xs mb-1.5">{nftError}</div>
              <button class="text-xs text-[#00ccba] underline" onclick={() => window.location.reload()}>Retry</button>
            </div>
          {:else if nfts.length > 0}
            <!-- Compact NFT Grid -->
            <div class="grid grid-cols-3 gap-1.5 mb-2">
              {#each nfts as nft, index}
                <div class="bg-[#202222] rounded-md overflow-hidden border border-[#333333] hover:border-[#00ccba]/50 transition-colors cursor-pointer group">
                  <!-- Compact NFT Image -->
                  <div class="aspect-square bg-gradient-to-br from-[#101212] to-[#1a1a1a] relative overflow-hidden">
                    {#if nft.metadata.image}
                      <img 
                        src={nft.metadata.image} 
                        alt={nft.metadata.name || 'NFT'} 
                        class="w-full h-full object-cover"
                        loading={index < 9 ? "eager" : "lazy"}
                        onerror={(e) => {
                          if (e.target) {
                            (e.target as HTMLElement).style.display = 'none';
                            const fallback = (e.target as HTMLElement).nextElementSibling;
                            if (fallback) (fallback as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                      <!-- Fallback -->
                      <div class="absolute inset-0 bg-gradient-to-br from-[#00ccba]/20 to-[#404040]/20 items-center justify-center text-lg hidden">
                        🎨
                      </div>
                    {:else}
                      <div class="w-full h-full bg-gradient-to-br from-[#00ccba]/20 to-[#404040]/20 flex items-center justify-center">
                        <div class="text-lg">🎨</div>
                      </div>
                    {/if}
                    
                    <!-- Collection badge -->
                    {#if nft.metadata.collection}
                      <div class="absolute top-0.5 right-0.5 bg-[#00ccba] text-black text-[8px] px-1 py-0.5 rounded-full font-bold">
                        ✓
                      </div>
                    {/if}
                  </div>
                  
                  <!-- Minimal NFT Info -->
                  <div class="p-1.5">
                    <h4 class="font-medium text-[10px] truncate text-white leading-tight">
                      {nft.metadata.name || 'Unnamed NFT'}
                    </h4>
                    {#if nft.metadata.collection?.name || nft.metadata.symbol}
                      <p class="text-[9px] text-[#00ccba] truncate mt-0.5">
                        {nft.metadata.collection?.name || nft.metadata.symbol}
                      </p>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
            
            <!-- Compact Summary -->
            <div class="bg-[#1a1a1a] rounded-md p-1.5 border border-[#333333]">
              <div class="flex items-center justify-between text-[10px]">
                <span class="text-gray-400">{nfts.length} NFTs</span>
                {#if nfts.some(nft => nft.metadata.collection)}
                  <span class="text-[#00ccba]">
                    {new Set(nfts.filter(nft => nft.metadata.collection?.name).map(nft => nft.metadata.collection.name)).size} Collections
                  </span>
                {/if}
              </div>
            </div>
          {:else}
            <div class="text-center py-5">
              <div class="text-2xl mb-2">🎨</div>
              <h3 class="mb-1.5 text-xs font-semibold">No NFTs yet</h3>
              <p class="text-[10px] text-gray-400 mb-3">
                Collect digital assets on Solana
              </p>
              <button 
                class="rounded-lg py-1.5 px-3 bg-[#00ccba] hover:bg-[#00a896] cursor-pointer mx-auto block text-[10px] font-medium transition-colors" 
                onclick={() => toast = true}
              >
                Explore NFTs
              </button>
            </div>
          {/if}
        </div>
      {:else if currentTab === 'activities'}
        <div class="h-full overflow-y-auto p-2 space-y-1.5 scrollbar-none">
          {#if isLoadingTransactions}
            <div class="text-center py-5">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00ccba] mx-auto"></div>
              <p class="mt-2 text-xs">Loading transactions...</p>
            </div>
          {:else if transactionError}
            <div class="text-center py-5">
              <div class="text-red-400 text-xs mb-2">{transactionError}</div>
              <button class="text-xs text-[#00ccba] underline" onclick={() => window.location.reload()}>Retry</button>
            </div>
          {:else if transactions.length > 0}
            <div class="space-y-1.5">
              {#each transactions as tx}
                <div class="bg-[#202222] rounded-lg p-2.5">
                  <div class="flex justify-between items-center">
                    <div class="flex gap-2.5 items-center">
                      <div class="size-7 p-1.5 bg-[#00ccba]/10 rounded-full flex items-center justify-center">
                        {#if tx.type === 'send'}
                          <Upload color='#00ccba' size='14' />
                        {:else if tx.type === 'receive'}
                          <Download color='#00ccba' size='14' />
                        {:else}
                          <Replace color='#00ccba' size='14' />
                        {/if}
                      </div>
                      <div>
                        <h4 class="font-semibold text-sm capitalize">{tx.type}</h4>
                        <p class="text-xs text-gray-400">
                          {#if tx.type === 'send' && tx.to}
                            To: {formatWalletAddress(tx.to)}
                          {:else if tx.type === 'receive' && tx.from}
                            From: {formatWalletAddress(tx.from)}
                          {:else}
                            {new Date(tx.timestamp).toLocaleDateString()}
                          {/if}
                        </p>
                        <p class="text-xs {tx.status === 'confirmed' ? 'text-green-400' : tx.status === 'pending' ? 'text-yellow-400' : 'text-red-400'}">
                          {tx.status}
                        </p>
                      </div>
                    </div>
                    <div class="text-right">
                      <h4 class="text-sm font-bold {tx.type === 'receive' ? 'text-green-400' : 'text-white'}">
                        {tx.type === 'receive' ? '+' : '-'}{tx.amount.toFixed(6)} {tx.token}
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
                    <div class="mt-1.5 pt-1.5 border-t border-gray-600">
                      <button 
                        onclick={() => window.open(tx.explorerUrl, '_blank')}
                        class="text-xs text-[#00ccba] hover:text-[#00eeda] flex items-center gap-1"
                      >
                        View on Explorer
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                      </button>
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          {:else}
            <div class="text-center py-6">
              <h3 class="text-sm">No transactions yet</h3>
              <p class="text-xs text-gray-400 mt-1">Transactions will appear here after you send or receive SOL</p>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div> <!-- Close content tabs container -->
</section>

<Toast
  status={'Coming soon...'}
  success={false}
  error={false}
  open={toast}
/>

<Toast
  status={errorMessage}
  success={false}
  error={true}
  open={showErrorToast}
/>

<Dialog open={openQRCode} onClose={() => openQRCode = false}>
  <div class="p-8 rounded-lg bg-[#1212128f] max-w-11/12 mx-auto">
    {#if qrCodeUrl !== ''}
      <div class="grid space-y-4">
        <img src={qrCodeUrl} alt="qrcode"  />
        <p class="font-bold text-center">{formatWalletAddress(address)}</p>
        <button onclick={() => navigator.clipboard.writeText(address)} class="capitalize text-sm text-[#00eeda] flex gap-2 my-2 justify-center cursor-pointer">
          <p>
            copy to clipboard
          </p>
          <Copy color='#00eeda' size='20' />
        </button>
      </div>
    {:else}
      <p>Loading</p>
    {/if}
  </div>
</Dialog>
