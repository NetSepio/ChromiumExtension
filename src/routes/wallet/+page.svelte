<script lang='ts'>


import Dialog from "$lib/components/ui/dialog.svelte";
import { BadgeDollarSign,  Copy,  Download,  Replace, Upload } from "@lucide/svelte";
  import { walletAddress} from '../../store/store'
  import { formatWalletAddress } from "$lib/helpers/formatWalletAddress";
  import { generateQRCode } from "$lib/helpers/generateQRCode";
  import VpnHeader from "$lib/components/ui/vpn-header.svelte";
  import Toast from "$lib/components/ui/toast.svelte";
  import { createSolanaRpc, type Address} from "@solana/kit";
  import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { publicKey } from "@metaplex-foundation/umi";
import { fetchAllDigitalAssetWithTokenByOwner } from "@metaplex-foundation/mpl-token-metadata";
// import { clusterApiUrl } from "@solana/web3.js";

// Extend BigInt type to include toJSON for TypeScript


  type ChainOption = 'mainnet' | 'testnet';


  const SOLANA_RPC = 'https://api.testnet.solana.com'
  const MAINNET_SOLANA_RPC = 'https://api.mainnet-beta.solana.com'
  
  // Alternative mainnet RPCs to handle rate limiting
  const MAINNET_RPC_ALTERNATIVES = [
    'https://api.mainnet-beta.solana.com',
    'https://solana-api.projectserum.com',
    'https://rpc.ankr.com/solana'
  ];

  let currentRpcIndex = 0;
  
  // Function to get current RPC URL
  function getCurrentRpc() {
    return chainOption === 'mainnet' ? MAINNET_RPC_ALTERNATIVES[currentRpcIndex] : SOLANA_RPC;
  }
  
  // Function to get UMI endpoint
  function getUmiEndpoint() {
    return chainOption === 'mainnet' ? MAINNET_RPC_ALTERNATIVES[currentRpcIndex] : "https://api.devnet.solana.com";
  }

  let address = $state('')
  let currentTab = $state('nfts')
  let userBalance = $state('')
  let openQRCode = $state(false)
  let qrCodeUrl = $state('')
  let showChainOptions = $state(false)
  let toast = $state(false)
  let chainOption = $state<ChainOption>('mainnet')
  let nfts = $state<any[]>([])
  let isLoadingNFTs = $state(false)
  let isLoadingBalance = $state(false)
  let balanceError = $state('')

  // Reactive RPC instance
  $effect(() => {
    // Reset data when switching chains
    nfts = [];
    userBalance = '';
    balanceError = '';
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
  

  // Function to fetch balance with retry logic
  async function fetchBalance(address: string, retryCount = 0): Promise<string> {
    const maxRetries = MAINNET_RPC_ALTERNATIVES.length;
    
    try {
      const rpc = createSolanaRpc(getCurrentRpc());
      const {value} = await rpc.getBalance(address as Address).send();
      return (Number(value) / 1_000_000_000).toString();
    } catch (error: any) {
      console.error(`Balance fetch error (attempt ${retryCount + 1}):`, error);
      
      // Handle rate limiting
      if (error.message?.includes('429') || error.status === 429) {
        if (retryCount < maxRetries - 1 && chainOption === 'mainnet') {
          currentRpcIndex = (currentRpcIndex + 1) % MAINNET_RPC_ALTERNATIVES.length;
          console.log(`Switching to RPC ${currentRpcIndex}: ${getCurrentRpc()}`);
          return await fetchBalance(address, retryCount + 1);
        }
      }
      
      throw error;
    }
  }

  // Function to fetch NFTs with retry logic
  async function fetchNFTs(address: string, retryCount = 0): Promise<any[]> {
    const maxRetries = MAINNET_RPC_ALTERNATIVES.length;
    
    try {
      const umi = createUmi(getUmiEndpoint());
      const ownerPublicKey = publicKey(address);
      const allNFTs = await fetchAllDigitalAssetWithTokenByOwner(umi, ownerPublicKey);
      return allNFTs;
    } catch (error: any) {
      console.error(`NFT fetch error (attempt ${retryCount + 1}):`, error);
      
      // Handle rate limiting
      if (error.message?.includes('429') || error.status === 429) {
        if (retryCount < maxRetries - 1 && chainOption === 'mainnet') {
          currentRpcIndex = (currentRpcIndex + 1) % MAINNET_RPC_ALTERNATIVES.length;
          console.log(`Switching to RPC ${currentRpcIndex} for NFTs: ${getUmiEndpoint()}`);
          return await fetchNFTs(address, retryCount + 1);
        }
      }
      
      throw error;
    }
  }
  // Main effect to fetch data when address or chain changes
  $effect.pre(() => {
    if (address) {
      (async () => {
        // Reset state
        balanceError = '';
        currentRpcIndex = 0; // Reset RPC index when switching
        
        // Fetch balance
        try {
          isLoadingBalance = true;
          userBalance = await fetchBalance(address);
          console.log(`${chainOption} Balance:`, userBalance);
        } catch (error: any) {
          console.error("Failed to fetch balance:", error);
          balanceError = error.message?.includes('429') 
            ? 'Rate limited. Please try again later.' 
            : 'Failed to load balance';
          userBalance = '0';
        } finally {
          isLoadingBalance = false;
        }

        // Fetch NFTs
        try {
          isLoadingNFTs = true;
          const allNFTs = await fetchNFTs(address);
          nfts = allNFTs;
          console.log(`Found ${allNFTs.length} NFTs on ${chainOption}`);
        } catch (error: any) {
          console.error("Error fetching NFTs:", error);
          nfts = [];
        } finally {
          isLoadingNFTs = false;
        }
      })();
    }
  })

  // Update chain switching to trigger data refresh
  function switchChain(newChain: ChainOption) {
    chainOption = newChain;
    showChainOptions = false;
    // The $effect.pre will automatically trigger data refresh
  }

  $effect(() => {
    if (toast === true) {
      setTimeout(() => {
        toast = false;
      }, 3000);
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


  
<section class="h-full pt-4 pb-8 px-8 bg-[#101212] text-white text-center capitalize relative grid text-sm">
  <VpnHeader  />
    <div class="flex items-center justify-between">
      <div class="flex gap-2 items-center justify-center">
        <span class="size-2 rounded-full bg-green-500"></span>
        <p>Wallet: {formatWalletAddress(address)}</p>
      </div>
      <div class='relative'>
        <button class="flex gap-2 items-center cursor-pointer" onclick={() => showChainOptions = true}><span>{chainOption}</span> <span class="size-2 bg-teal-500 rounded-full"></span></button>
        {#if showChainOptions}
          <ul class="absolute top-6 left-0 rounded-lg bg-[#202222] shadow-lg shadow-[#070404] p-2">
            <li>
              <button class=" text-white p-1" onclick={() => switchChain('mainnet')}>Mainnet</button>
            </li>
            <li>
              <button class=" text-white p-1" onclick={() => switchChain('testnet')}>Testnet</button>
            </li>
          </ul>
        {/if}
      </div>
    </div>    
  <div class='mx-auto p-2 bg-[#00ccba]/20 size-12 rounded-full flex items-center justify-center'>
    <BadgeDollarSign color='#00ccba' size='50'  />
  </div>
  <div class="text-center">
    {#if isLoadingBalance}
      <div class="flex items-center justify-center gap-2">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-[#00ccba]"></div>
        <span class="text-sm">Loading balance...</span>
      </div>
    {:else if balanceError}
      <div class="text-red-400 text-sm">{balanceError}</div>
      <button class="text-xs text-[#00ccba] underline mt-1" onclick={() => window.location.reload()}>Retry</button>
    {:else}
      <h1 class="font-bold text-2xl">{userBalance} <span class="text-sm uppercase">sol</span></h1>
    {/if}
  </div>
  <div class="flex gap-8 items-center justify-center">
    <button class="space-y-1 cursor-pointer" onclick={() => toast = true}>
      <div class="size-10 p-2 rounded-full bg-[#202222] shadow shadow-[#ffffff4f] flex items-center justify-center">
        <Upload color='#00ccba' size='20' />
      </div>
      <p>Send</p>
    </button>
    <button class="space-y-1 cursor-pointer" onclick={() => getQRCodeUrl(address)}>
      <div class="size-10 p-2 rounded-full bg-[#202222] shadow shadow-[#ffffff4f] flex items-center justify-center">
        <Download color='#00ccba' size='20' />
      </div>
      <p>Receive</p>
    </button>
    <a class="space-y-1 cursor-pointer" href="/swap-coin" >
      <div class="size-10 p-2 rounded-full bg-[#202222] shadow shadow-[#ffffff4f] flex items-center justify-center">
        <Replace color='#00ccba' size='20' />
      </div>
      <p>Swap</p>
    </a>
  </div>
  <div>
    <div class="flex items-center justify-between">
      <!-- <button class={`bg-transparent border-b ${currentTab === 'tokens' ? 'border-[#00ccba]' : 'border-transparent'} py-2 px-4`} aria-label="tokens" onclick={() => currentTab = 'tokens'}>Tokens</button> -->
      <button class={`bg-transparent border-b ${currentTab === 'nfts' ? 'border-[#00ccba]' : 'border-transparent'} py-2 px-4`} aria-label="nfts" onclick={() => currentTab = 'nfts'}>NFTs</button>
      <button class={`bg-transparent border-b ${currentTab === 'activities' ? 'border-[#00ccba]' : 'border-transparent'} py-2 px-4`} aria-label="activities" onclick={() => currentTab = 'activities'}>Activities</button>
    </div>
    {#if currentTab === 'tokens'}
      <div class="py-4 grid space-y-2">
        <h3>no token in your wallet yet</h3>
        <button class="rounded-xl py-2 px-8 bg-[#00ccba] cursor-pointer" onclick={() => toast = true}>Import Now</button>
      </div>
    {:else if currentTab === 'nfts'}
      <div class="py-4 grid space-y-2">
        {#if isLoadingNFTs}
          <div class="text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ccba] mx-auto"></div>
            <p class="mt-2">Loading NFTs...</p>
          </div>
        {:else if nfts.length > 0}
          <div class="max-h-[200px] overflow-y-auto scrollbar-none" style="scrollbar-width: none; -ms-overflow-style: none;">
            <div class="grid grid-cols-2 gap-3">
              {#each nfts as nft, index}
                <div class="bg-[#202222] rounded-lg p-2 text-left min-h-[90px]">
                  <div class="aspect-square bg-[#101212] rounded-lg mb-2 flex items-center justify-center overflow-hidden max-h-[60px]">
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
                      <div class="text-[#00ccba] text-xl hidden">🖼️</div>
                    {:else}
                      <div class="text-[#00ccba] text-xl">🖼️</div>
                    {/if}
                  </div>
                  <h4 class="font-semibold text-xs truncate leading-tight">{nft.metadata.name || 'Unnamed NFT'}</h4>
                  {#if nft.metadata.symbol}
                    <p class="text-[10px] text-gray-400 truncate">{nft.metadata.symbol}</p>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        {:else}
          <h3>no NFT in your wallet yet</h3>
          <button class="rounded-xl py-2 px-8 bg-[#00ccba] cursor-pointer" onclick={() => toast = true}>Buy Now</button>
        {/if}
      </div>

    {:else if currentTab === 'activities'}
    <div class="py-4 grid space-y-2">
      <h3>no activities in your wallet yet</h3>
      <button class="rounded-xl py-2 px-8 bg-[#00ccba] cursor-pointer">Make a transaction</button>
      <!-- <div class="grid space-y-2">
        <h3 class="text-left font-bold">May 7, 2025</h3>
        <div class="flex justify-between items-center">
          <div class="flex gap-2 items-center">
            <div class='mx-auto p-2 bg-[#00ccba]/10 size-8 rounded-full flex items-center justify-center'>
              <Upload color='#00ccba' size='18' />
            </div>
            <div>
              <h3>Reg owner</h3>
              <p class="text-green-500">Confirmed</p>
            </div>
          </div>
          <div class='text-right'>
            <h4 class="text-xl font-bold">+ 500 Eth</h4>
            <p>~$400</p>
          </div>
        </div>
      </div>
      <div class="grid space-y-2">
        <h3 class="text-left font-bold">May 7, 2025</h3>
        <div class="flex justify-between items-center">
          <div class="flex gap-2 items-center">
            <div class='mx-auto p-2 bg-[#00ccba]/10 size-8 rounded-full flex items-center justify-center'>
              <Upload color='#00ccba' size='18' />
            </div>
            <div>
              <h3>Reg owner</h3>
              <p class="text-red-500">Rejected</p>
            </div>
          </div>
          <div class='text-right'>
            <h4 class="text-xl font-bold">+ 500 Eth</h4>
            <p>~$400</p>
          </div>
        </div>
      </div> -->
    </div>
    {/if}
  </div>
</section>

<Toast
  status={'Coming soon...'}
  success={false}
  error={false}
  open={toast}
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
 