<script lang='ts'>
	import Dialog from "$lib/components/ui/dialog.svelte";
  import { BadgeDollarSign, BellRing,  Copy,  Download,  Replace,  ScanQrCode, Upload } from "@lucide/svelte";
  import { ethers } from 'ethers'
  import { walletAddress} from '../../store/store'
	import { formatWalletAddress } from "$lib/helpers/formatWalletAddress";
	import { generateQRCode } from "$lib/helpers/generateQRCode";
	import VpnHeader from "$lib/components/ui/vpn-header.svelte";
  // import { PUBLIC_INFURA_API_KEY } from '$env/static/public';

  let address = $state('')
  let currentTab = $state('tokens')
  let userBalance = $state('')
  let openQRCode = $state(false)
  let qrCodeUrl = $state('')

 

  walletAddress.subscribe((value) => address = value)

  const provider = ethers.getDefaultProvider("homestead");

  async function getQRCodeUrl(address: string) {
    const qrCode = await generateQRCode(address);
    qrCodeUrl = qrCode ?? '';
    openQRCode = true
  }
  async function getBalance(){
    try {
      const balance = await provider.getBalance(address);
      userBalance = ethers.formatEther(balance);
      console.log("Balance:", userBalance);
    } catch (error) {
      console.error("Error fetching balance:", error);
      // Implement retry logic or display an error message to the user
    }
  }

  $effect.pre(() => {
   if (address) {
      getBalance();
    }
  })
 
</script>

<section class='h-full'>
  <VpnHeader wallet={true} />
  <div class="h-full pt-4 pb-8 px-8 bg-[#101212] text-white text-center capitalize relative grid text-sm">
    <div class="flex w-full justify-between items-center">
      <button aria-label="qr code" onclick={() => getQRCodeUrl(address)} class='cursor-pointer'>
        <ScanQrCode color='#00ccba' size='20' />
      </button>
      <div class="flex gap-2 items-center">
        <span class="size-2 rounded-full bg-green-500"></span>
        <p>Wallet: {formatWalletAddress(address)}</p>
      </div>
      <a href="/notifications">
        <BellRing color='#00ccba' size='20'  />
      </a>
    </div>
    <div class='mx-auto p-2 bg-[#00ccba]/20 size-12 rounded-full flex items-center justify-center'>
      <BadgeDollarSign color='#00ccba' size='50'  />
    </div>
    <h1 class="font-bold text-2xl ">$5000.00</h1>
    <div class="flex gap-8 items-center justify-center">
      <a class="space-y-1 cursor-pointer" href='/send-coin'>
        <div class="size-10 p-2 rounded-full bg-[#202222] shadow shadow-[#ffffff4f] flex items-center justify-center">
          <Upload color='#00ccba' size='20' />
        </div>
        <p>Send</p>
      </a>
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
          <a class="rounded-xl py-2 px-8 bg-[#00ccba]" href='/import-tokens'>Import Now</a>
        </div>
      {:else if currentTab === 'nfts'}
        <div class="py-4 grid space-y-2">
          <h3>no NFT in your wallet yet</h3>
          <a class="rounded-xl py-2 px-8 bg-[#00ccba]" href='/buy-nft'>Buy Now</a>
        </div>
  
      {:else if currentTab === 'activities'}
      <div class="py-4 grid space-y-4">
        <h3>no activities in your wallet yet</h3>
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
  </div>
</section>


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
 