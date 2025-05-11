<script>
  import { onboardingStepsLeft } from '../../store/store'
 
</script>

<section class="bg-[#101212] h-full px-8 pt-10 pb-8 flex flex-col justify-between items-center">
  <div class="grid space-y-6 text-center">
    <img src="/assets/intro.png" alt="wallet intro" class="size-80" />
    <div>
      <h1 class="text-xl text-white font-bold">Only Wallet You Need</h1>
      <h2 class='text-white/75 text-sm'>
        The user friendly, non custodial blockchain agnostic wallet
      </h2>
    </div>
  </div>
  <div class="grid space-y-3 w-full text-center">
    <a class='cursor-pointer text-[#00eeda] hover:underline' href="/import-wallet" onclick={() => onboardingStepsLeft.set(2)}>I already have a wallet</a>
    <a class="w-full rounded-3xl py-2 text-black cursor-pointer bg-gradient-to-b from-[#0b8f84] to-[#00ccba]" href='/create-new-wallet' onclick={() => onboardingStepsLeft.set(2)}>Create new wallet</a>
  </div>
</section>