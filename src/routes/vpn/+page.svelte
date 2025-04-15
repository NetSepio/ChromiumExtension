<script lang="ts">
  import logo from '../../lib/assets/logo.png';
  import backgroundImage from '../../lib/assets/world-map.png';

</script>

<section class="relative h-full p-6 bg-contain bg-top bg-no-repeat bg-blend-multiply bg-[#292929] overflow-hidden" style='background-image: url({backgroundImage});'>
  <header class="flex items-center justify-between">
    <span class="size-8 cursor-pointer rounded-full p-1 flex justify-center items-center bg-[#0eafa2]">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu-icon lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
    </span>
    <img src={logo} alt="Logo" class="logo" />
    <span class="size-8 cursor-pointer rounded-full p-1 flex justify-center items-center bg-[#0eafa2]">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wallet-cards-icon lucide-wallet-cards"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2"/><path d="M3 11h3c.8 0 1.6.3 2.1.9l1.1.9c1.6 1.6 4.1 1.6 5.7 0l1.1-.9c.5-.5 1.3-.9 2.1-.9H21"/></svg>
    </span>
  </header>
  <div class="py-2 px-4 rounded-lg bg-[#f1f1f157] bg-opacity-50 backdrop-blur-sm hover:shadow-md transition-all mt-4 flex items-center justify-between">
    <div class="flex items items-center gap-4">
      <svg width="42" height="30" viewBox="0 0 42 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_2003_8391)">
        <g clip-path="url(#clip1_2003_8391)">
        <rect width="41.25" height="30" rx="3.75" fill="#1A47B8"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.38816 0H0V5L36.838 30L41.25 30V25L4.38816 0Z" fill="white"/>
        <path d="M1.46359 0L41.25 27.0709V30H39.8207L0 2.90112V0H1.46359Z" fill="#F93939"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M37.3214 0H41.25V5C41.25 5 15.7335 21.6561 3.92857 30H0V25L37.3214 0Z" fill="white"/>
        <path d="M41.25 0H39.9177L0 27.0942V30H1.46359L41.25 2.92303V0Z" fill="#F93939"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0014 0H26.2829V9.25363H41.25V20.7403H26.2829V30H15.0014V20.7403H0V9.25363H15.0014V0Z" fill="white"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M17.3684 0H23.8816V11.5385H41.25V18.4615H23.8816V30H17.3684V18.4615H0V11.5385H17.3684V0Z" fill="#F93939"/>
        </g>
        </g>
        <defs>
        <clipPath id="clip0_2003_8391">
        <rect width="41.25" height="30" fill="white"/>
        </clipPath>
        <clipPath id="clip1_2003_8391">
        <rect width="41.25" height="30" rx="3.75" fill="white"/>
        </clipPath>
        </defs>
      </svg>
      <div class="text-sm text-white font-semibold">
        <p>United Kingdom</p>
        <p>London</p>
      </div>
    </div>
    <svg width="21" height="24" viewBox="0 0 21 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.699219" y="12" width="5.16129" height="12" rx="0.688172" fill="#22AD5C"/>
      <rect x="8.26953" y="6" width="5.16129" height="18" rx="0.688172" fill="#22AD5C"/>
      <rect x="15.8389" width="5.16129" height="24" rx="0.688172" fill="#22AD5C"/>
      </svg>
  </div>
  
  <p>VPN page content goes here.</p>
  <p>More information about VPN services and configurations can be added here.</p>
  <p>For more details, visit the official documentation or support page.</p>
  <p>Contact support for any issues rted to VPN connectivity.</p>  
  <div class="absolute -left-[72%] top-[70%] rounded-full size-[850px] bg-[#0eafa2]"></div>
</section>