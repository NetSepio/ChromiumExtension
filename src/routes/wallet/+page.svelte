<script lang='ts'>
	import Dialog from "$lib/components/ui/dialog.svelte";
  import { BadgeDollarSign,  Copy,  Download,  Replace, Upload } from "@lucide/svelte";
  import { walletAddress} from '../../store/store'
	import { formatWalletAddress } from "$lib/helpers/formatWalletAddress";
	import { generateQRCode } from "$lib/helpers/generateQRCode";
	import VpnHeader from "$lib/components/ui/vpn-header.svelte";
	import Toast from "$lib/components/ui/toast.svelte";
  import { createSolanaRpc, type Address} from "@solana/kit";

  type ChainOption = 'mainnet' | 'testnet';


  const SOLANA_RPC = 'https://api.testnet.solana.com'
  // const SOLANA_RPC = 'https://api.mainnet-beta.solana.com'

  const rpc = createSolanaRpc(SOLANA_RPC)

  let address = $state('')
  let currentTab = $state('tokens')
  let userBalance = $state('')
  let openQRCode = $state(false)
  let qrCodeUrl = $state('')
  let showChainOptions = $state(false)
  let toast = $state(false)
  let chainOption = $state<ChainOption>('mainnet')

  walletAddress.subscribe((value) => address = value)

  async function getQRCodeUrl(address: string) {
    const qrCode = await generateQRCode(address);
    qrCodeUrl = qrCode ?? '';
    openQRCode = true
  }


  

  $effect.pre(() => {
   if (address) {
     (async () => {
      
      const {value} = await rpc.getBalance(address as Address).send()
      userBalance = (Number(value) / 1_000_000_000).toString()
      console.log('User Balance', userBalance)
      // userBalance = await getBalance(address, chainOption);
     })();
    }
  })
 
  $effect(() => {
    if (toast === true) {
      setTimeout(() => {
        toast = false;
      }, 3000);
    }
  })  
</script>


  
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
              <button class=" text-white p-1" onclick={() => {
                chainOption = 'mainnet'
                showChainOptions = false
              }}>Mainnet</button>
            </li>
            <li>
              <button class=" text-white p-1" onclick={() => {
                chainOption = 'testnet'
                showChainOptions = false
              }}>Testnet</button>
            </li>
          </ul>
        {/if}
      </div>
    </div>    
  <div class='mx-auto p-2 bg-[#00ccba]/20 size-12 rounded-full flex items-center justify-center'>
    <BadgeDollarSign color='#00ccba' size='50'  />
  </div>
  <h1 class="font-bold text-2xl">{userBalance} <span class="text-sm uppercase">sol</span></h1>
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
      <button class={`bg-transparent border-b ${currentTab === 'tokens' ? 'border-[#00ccba]' : 'border-transparent'} py-2 px-4`} aria-label="tokens" onclick={() => currentTab = 'tokens'}>Tokens</button>
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
        <h3>no NFT in your wallet yet</h3>
        <button class="rounded-xl py-2 px-8 bg-[#00ccba] cursor-pointer" onclick={() => toast = true}>Buy Now</button>
      </div>

    {:else if currentTab === 'activities'}
    <div class="py-4 grid space-y-4">
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
 