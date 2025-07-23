<script lang="ts">
// Replace with your actual Helius API key
const HELIUS_API_KEY = '9abe26a0-b90a-4a6b-adfc-65d3b9d7d941';
const HELIUS_MAINNET = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

let address = $state('');
let solBalance = $state('');
let heliusError = $state('');
let isLoadingHelius = $state(false);


let tokenList: any[] = $state([]);
let tokenSearch = $state('');
let filteredTokens = $derived(() =>
  tokenList.filter(t =>
    t.symbol?.toLowerCase().includes(tokenSearch.toLowerCase()) ||
    t.name?.toLowerCase().includes(tokenSearch.toLowerCase()) ||
    t.address?.toLowerCase().includes(tokenSearch.toLowerCase())
  )
);
let isLoadingTokens = $state(false);
let tokenError = $state('');

// Featured CYAI token info
let cyaiMint: string | null = null;
let cyaiToken: any = null;
let isLoadingCyaiHelius = $state(false);
let cyaiHeliusError = $state('');

function updateCyaiTokenInfo() {
  cyaiToken = tokenList.find(
    t => t.symbol?.toLowerCase() === 'cyai' || t.name?.toLowerCase().includes('cyreneai')
  );
  cyaiMint = cyaiToken ? cyaiToken.address : null;
}

async function fetchCyaiMintFromHelius() {
  isLoadingCyaiHelius = true;
  cyaiHeliusError = '';
  cyaiMint = null;
  try {
    const res = await fetch(HELIUS_MAINNET, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'searchAssets',
        params: {
          ownerAddress: null,
          creatorAddress: null,
          name: 'CyreneAI Cosmic Journey',
          symbol: 'CYAI',
          tokenType: 'fungible',
          page: 1,
          limit: 1
        }
      })
    });
    const data = await res.json();
    if (data.result && data.result.items && data.result.items.length > 0) {
      cyaiMint = data.result.items[0].id;
    } else {
      cyaiHeliusError = 'CYAI token not found via Helius.';
    }
  } catch (e: any) {
    cyaiHeliusError = e.message || 'Helius DAS request failed.';
  } finally {
    isLoadingCyaiHelius = false;
  }
}

async function fetchHeliusBalance() {
  if (!address) return;
  isLoadingHelius = true;
  heliusError = '';
  solBalance = '';
  try {
    const res = await fetch(HELIUS_MAINNET, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [address]
      })
    });
    const data = await res.json();
    if (data.result?.value !== undefined) {
      solBalance = (data.result.value / 1e9).toString();
    } else {
      heliusError = data.error?.message || 'Unknown error';
    }
  } catch (e: any) {
    heliusError = e.message || 'Request failed';
  } finally {
    isLoadingHelius = false;
  }
}

async function fetchMagicEdenTokenList() {
  isLoadingTokens = true;
  tokenError = '';
  try {
    // Jupiter SPL token list endpoint (curated, user-friendly)
    const res = await fetch('https://cache.jup.ag/tokens');
    const data = await res.json();
    tokenList = data || [];
    updateCyaiTokenInfo();
  } catch (e: any) {
    tokenError = e.message || 'Failed to fetch token list';
  } finally {
    isLoadingTokens = false;
  }
}

</script>


<section class="p-6 max-w-xl mx-auto text-white bg-blue-950">
  <h1 class="text-2xl font-bold mb-4">API Test: Helius & Magic Eden</h1>

  <div class="mb-6">
    <h2 class="font-semibold mb-2">Helius SOL Balance</h2>
    <input class="p-2 rounded bg-[#222] w-full mb-2" placeholder="Enter Solana address" bind:value={address} />
    <button class="bg-[#00ccba] px-4 py-2 rounded text-black font-bold" onclick={fetchHeliusBalance} disabled={isLoadingHelius || !address}>
      {isLoadingHelius ? 'Loading...' : 'Fetch Balance'}
    </button>
    {#if solBalance}
      <div class="mt-2">Balance: <span class="font-mono">{solBalance} SOL</span></div>
    {/if}
    {#if heliusError}
      <div class="text-red-400 mt-2">{heliusError}</div>
    {/if}
  </div>

  <!-- Featured tokens section -->
  <div class="mb-6">
    <h2 class="font-semibold mb-2">Featured Tokens</h2>
    <ul class="space-y-4">
      <!-- CyreneAI Cosmic Journey (CYAI) as a coin token, dynamic mint -->
      <li class="bg-[#202222] rounded-lg p-4 flex flex-col gap-2 border-2 border-[#00ccba]">
        <div class="flex items-center gap-2">
          <span class="text-base">🪐</span>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="font-semibold">CyreneAI Cosmic Journey (CYAI)</h4>
              <span class="text-[#00ccba] text-xs">Featured</span>
            </div>
            <p class="text-sm text-gray-400">Solana SPL Token</p>
            {#if cyaiMint}
              <p class="text-xs text-gray-500 truncate max-w-[220px]">Mint: <span class="font-mono">{cyaiMint}</span></p>
              <a href={`https://magiceden.io/item-details/${cyaiMint}`} target="_blank" class="text-xs text-[#00ccba] underline">View on Magic Eden</a>
            {:else}
              <p class="text-xs text-gray-400">Mint address not found. Try fetching from Magic Eden or Helius below.</p>
            {/if}
            {#if cyaiHeliusError}
              <div class="text-xs text-red-400 mt-1">{cyaiHeliusError}</div>
            {/if}
          </div>
        </div>
        <button
          onclick={() => cyaiMint ? alert(`Imported: CyreneAI Cosmic Journey (CYAI)\nMint: ${cyaiMint}`) : alert('CYAI mint address not found.')}
          class="bg-[#00ccba] hover:bg-[#00eeda] text-black font-medium py-2 px-4 rounded-lg transition-colors text-sm mt-2"
          disabled={!cyaiMint}
        >
          Import
        </button>
        <div class="flex gap-2 mt-2">
          <button class="bg-[#00ccba] px-3 py-1 rounded text-black text-xs font-bold" onclick={fetchMagicEdenTokenList} disabled={isLoadingTokens}>
            {isLoadingTokens ? 'Loading...' : 'Fetch from Magic Eden'}
          </button>
          <button class="bg-[#00ccba] px-3 py-1 rounded text-black text-xs font-bold" onclick={fetchCyaiMintFromHelius} disabled={isLoadingCyaiHelius}>
            {isLoadingCyaiHelius ? 'Loading...' : 'Fetch from Helius'}
          </button>
        </div>
      </li>
      <!-- Add more featured tokens here if needed -->
    </ul>
  </div>

  <div class="mb-6">
    <h2 class="font-semibold mb-2">Magic Eden Token List</h2>
    <button class="bg-[#00ccba] px-4 py-2 rounded text-black font-bold mb-2" onclick={fetchMagicEdenTokenList} disabled={isLoadingTokens}>
      {isLoadingTokens ? 'Loading...' : 'Fetch Token List'}
    </button>
    {#if tokenList.length > 0}
      <input class="p-2 rounded bg-[#222] w-full mb-2" placeholder="Search token by name, symbol, or address" bind:value={tokenSearch} />
      <div class="max-h-64 overflow-y-auto border border-[#333] rounded p-2 bg-[#181818]">
        {#each filteredTokens().slice(0, 20) as token}
          <div class="flex items-center gap-2 py-1 border-b border-[#222] last:border-b-0">
            {#if token.logoURI}
              <img src={token.logoURI} alt={token.symbol} class="w-6 h-6 rounded-full" />
            {/if}
            <div>
              <div class="font-bold">{token.symbol}</div>
              <div class="text-xs text-gray-400">{token.name}</div>
              <div class="text-xs text-gray-500">{token.address}</div>
            </div>
            <button
              class="ml-auto bg-[#00ccba] hover:bg-[#00eeda] text-black font-medium py-1 px-3 rounded-lg text-xs"
              onclick={() => alert(`Imported: ${token.symbol || token.address}`)}
            >
              Import
            </button>
          </div>
        {/each}
        {#if filteredTokens().length === 0}
          <div class="text-gray-400">No tokens found.</div>
        {/if}
      </div>
    {/if}
    {#if tokenError}
      <div class="text-red-400 mt-2">{tokenError}</div>
    {/if}
  </div>
</section>

<style>
input:disabled {
  opacity: 0.5;
}
</style>
