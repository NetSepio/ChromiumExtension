<script>
	import Speedometer from "$lib/components/ui/speedometer.svelte";
	import VpnHeader from "$lib/components/ui/vpn-header.svelte";
	import { Download, Upload } from "@lucide/svelte";

  const fileSizeInBytes = 5 * 1024 * 1024;
  const start = performance.now();

  $effect(() => {
    const data = fetch("https://nbg1-speed.hetzner.com") // Public test file
		.then(res => res.blob())
		.then(() => {
			const end = performance.now();
			const durationInSeconds = (end - start) / 1000;
			const bitsLoaded = fileSizeInBytes * 8;
			const speedMbps = (bitsLoaded / durationInSeconds / 1024 / 1024).toFixed(2);
			return Number(speedMbps);
		});
    console.log(data)
  })

  
</script>

<section
	class="relative text-white h-full p-6 bg-[#111111] overflow-hidden w-full"
>
  <VpnHeader wallet={false}/>
  <h1 class="text-2xl font-bold text-center">Speed Test</h1>
  <div class="grid space-y-2 mt-4 ">
    <div class="flex gap-6 justify-center">
      <div class="p-2 grid space-y-4 rounded-lg bg-[#3e3e3e]">
        <div class="flex gap-2">
          <Download color="red" />
          <h2>Download</h2>
        </div>
        <h3 class="text-center">62.5 MB/s</h3>
      </div>
      <div class="p-2 grid space-y-4 rounded-lg bg-[#3e3e3e]">
        <div class="flex gap-2">
          <Upload color='green' />
          <h2>Upload</h2>
        </div>
        <h3 class="text-center">62.5 MB/s</h3>
      </div>
    </div>
    <div class="bg-[#3e3e3e] px-4 py-2 flex items-center justify-between rounded-lg text-white/60">
      <div class="grid space-y-2">
        <p>Ping</p>
        <p class="font-bold">10.00<span class="font-normal">ms</span></p>
      </div>
      <div class="grid space-y-2">
        <p>Jitter</p>
        <p class="font-bold">1.50<span class="font-normal">ms</span></p>
      </div>
      <div class="grid space-y-2">
        <p>Ping</p>
        <p class="font-bold">0<span class="font-normal">%</span></p>
      </div>
    </div>
  </div>
  <div class="my-6">
    <Speedometer />
  </div>
  <button class="rounded-full py-2 w-full bg-linear-to-b from-[#0b8f84] to-[#00ccba] text-white">Run Speed Test</button>
</section>