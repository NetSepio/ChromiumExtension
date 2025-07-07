<script lang='ts'>


import Dialog from "$lib/components/ui/dialog.svelte";
import { BadgeDollarSign,  Copy,  Download,  Replace, Upload } from "@lucide/svelte";
  import { walletAddress} from '../../store/store'
  import { formatWalletAddress } from "$lib/helpers/formatWalletAddress";
  import { generateQRCode } from "$lib/helpers/generateQRCode";
  import VpnHeader from "$lib/components/ui/vpn-header.svelte";
  import Toast from "$lib/components/ui/toast.svelte";
  import NetworkStatus from "$lib/components/ui/network-status.svelte";
  import { SolanaWalletService, type TokenInfo, type TransactionHistory } from '$lib/helpers/solanaTransactions';
  import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { publicKey } from "@metaplex-foundation/umi";
import { fetchAllDigitalAssetWithTokenByOwner } from "@metaplex-foundation/mpl-token-metadata";
// import { clusterApiUrl } from "@solana/web3.js";

// Extend BigInt type to include toJSON for TypeScript


  type ChainOption = 'mainnet' | 'testnet';

  let address = $state('')
  let currentTab = $state('tokens')
  let userBalance = $state('')
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

  // Function to fetch NFTs
  async function fetchNFTs(address: string): Promise<any[]> {
    try {
      // Use appropriate endpoint for chain
      const endpoint = chainOption === 'mainnet' 
        ? 'https://api.mainnet-beta.solana.com'
        : 'https://api.devnet.solana.com';
      
      const umi = createUmi(endpoint);
      const ownerPublicKey = publicKey(address);
      const allNFTs = await fetchAllDigitalAssetWithTokenByOwner(umi, ownerPublicKey);
      return allNFTs;
    } catch (error: unknown) {
      console.error('NFT fetch error:', error);
      throw error;
    }
  }
  // Main effect to fetch data when address or chain changes
  $effect.pre(() => {
    if (address) {
      (async () => {
        // Reset state
        balanceError = '';
        
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
          const tokenAccounts = await walletService.getTokenAccounts(address);
          tokens = tokenAccounts;
          console.log(`Found ${tokenAccounts.length} tokens on ${chainOption}`);
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
            class="text-[#00ccba] hover:text-[#00eeda] p-0.5 rounded transition-colors"
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
      <h1 class="font-bold text-lg">{userBalance} <span class="text-xs uppercase">sol</span></h1>
    {/if}
  </div>
  
  <!-- Action Buttons -->
  <div class="flex gap-4 items-center justify-center mb-2 flex-shrink-0">
    <button class="space-y-1 cursor-pointer group" onclick={() => window.location.href = '/send-coin'}>
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
                  <p class="font-semibold text-sm">{parseFloat(userBalance).toFixed(6)}</p>
                  <p class="text-xs text-gray-400">SOL</p>
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
                      <p class="text-xs text-gray-400">{token.symbol || 'TOKEN'}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold text-sm">{token.amount.toFixed(token.decimals || 6)}</p>
                    <p class="text-xs text-gray-400">{token.symbol}</p>
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <div class="text-center py-5">
              <h3 class="mb-2.5 text-sm">No tokens in your wallet yet</h3>
              <button 
                class="rounded-xl py-1.5 px-3 bg-[#00ccba] cursor-pointer mx-auto block w-4/5 max-w-[170px] text-xs" 
                onclick={() => window.location.href = '/import-tokens'}
              >
                Import Tokens
              </button>
            </div>
          {/if}
        </div>
      {:else if currentTab === 'nfts'}
        <div class="h-full overflow-y-auto p-2 space-y-1.5 scrollbar-none">
          {#if isLoadingNFTs}
            <div class="text-center py-5">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00ccba] mx-auto"></div>
              <p class="mt-2 text-xs">Loading NFTs...</p>
            </div>
          {:else if nfts.length > 0}
            <div class="grid grid-cols-2 gap-1.5">
              {#each nfts as nft, index}
                <div class="bg-[#202222] rounded-lg p-1.5 text-left min-h-[80px]">
                  <div class="aspect-square bg-[#101212] rounded-lg mb-1.5 flex items-center justify-center overflow-hidden max-h-[55px]">
                    {#if nft.metadata.uri}
                      <img 
                        src={nft.metadata.uri} 
                        alt={nft.metadata.name || 'NFT'} 
                        class="w-full h-full object-cover rounded-lg"
                        loading={index < 4 ? "eager" : "lazy"}
                        onerror={(e) => {
                          if (e.target) {
                            (e.target as HTMLElement).style.display = 'none';
                            const fallback = (e.target as HTMLElement).nextElementSibling;
                            if (fallback) (fallback as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                      <div class="text-[#00ccba] text-lg hidden">🖼️</div>
                    {:else}
                      <div class="text-[#00ccba] text-lg">🖼️</div>
                    {/if}
                  </div>
                  <h4 class="font-semibold text-xs truncate leading-tight">{nft.metadata.name || 'Unnamed NFT'}</h4>
                  {#if nft.metadata.symbol}
                    <p class="text-[10px] text-gray-400 truncate">{nft.metadata.symbol}</p>
                  {/if}
                </div>
              {/each}
            </div>
          {:else}
            <div class="text-center py-5">
              <h3 class="mb-2.5 text-sm">No NFTs in your wallet yet</h3>
              <button 
                class="rounded-xl py-1.5 px-3 bg-[#00ccba] cursor-pointer mx-auto block w-4/5 max-w-[170px] text-xs" 
                onclick={() => toast = true}
              >
                Buy Now
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
              <h3 class="mb-3 text-sm">No transactions found</h3>
              <button 
                class="rounded-xl py-2 px-4 bg-[#00ccba] cursor-pointer mx-auto block w-4/5 max-w-[180px] text-xs" 
                onclick={() => window.location.href = '/send-coin'}
              >
                Make a transaction
              </button>
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
