<script lang="ts">
	import { fade, slide } from "svelte/transition";
	import { X, Zap } from "@lucide/svelte";
	import { getLinkIcon, links } from "$lib/helpers/getLinkIcon";

	let toggle = $state(false)
</script>



<header>
	<nav class="flex items-center justify-between">
		<!-- <button
			aria-label="toggle button"
			onclick={() => toggle = true}
			class="size-8 cursor-pointer rounded-full p-1 flex justify-center items-center bg-[#000e0c]"
		>
		<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect x="2" y="19.1111" width="15.8889" height="2.44444" rx="1.22222" fill="url(#paint0_linear_2094_15035)"/>
			<rect x="2" y="11.7778" width="22" height="2.44444" rx="1.22222" fill="url(#paint1_linear_2094_15035)"/>
			<rect x="2" y="4.44458" width="15.8889" height="2.44444" rx="1.22222" fill="url(#paint2_linear_2094_15035)"/>
			<defs>
			<linearGradient id="paint0_linear_2094_15035" x1="9.94444" y1="19.1111" x2="9.94444" y2="21.5555" gradientUnits="userSpaceOnUse">
			<stop stop-color="#0EAFA2"/>
			<stop offset="1" stop-color="#00FFEA"/>
			</linearGradient>
			<linearGradient id="paint1_linear_2094_15035" x1="13" y1="11.7778" x2="13" y2="14.2223" gradientUnits="userSpaceOnUse">
			<stop stop-color="#0EAFA2"/>
			<stop offset="1" stop-color="#00FFEA"/>
			</linearGradient>
			<linearGradient id="paint2_linear_2094_15035" x1="9.94444" y1="4.44458" x2="9.94444" y2="6.88902" gradientUnits="userSpaceOnUse">
			<stop stop-color="#0EAFA2"/>
			<stop offset="1" stop-color="#00FFEA"/>
			</linearGradient>
			</defs>
			</svg>
		</button> -->
		<a href="/" class="size-8 cursor-pointer rounded-full p-1 flex justify-center items-center bg-[#000e0c]">
			<Zap color='#0eafa2' />
		</a>
		<img src='/assets/logo.png' alt="Logo" class="logo" />
		<button
			class="size-8 cursor-pointer rounded-full p-1 flex justify-center items-center bg-[#0eafa2]"
			onclick={() => alert('Wallet will be available soon')}
			aria-label='wallet'
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-wallet-cards-icon lucide-wallet-cards"
				><rect width="18" height="18" x="3" y="3" rx="2" /><path
					d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2"
				/><path
					d="M3 11h3c.8 0 1.6.3 2.1.9l1.1.9c1.6 1.6 4.1 1.6 5.7 0l1.1-.9c.5-.5 1.3-.9 2.1-.9H21"
				/></svg
			>
		</button>
	</nav>
	{#if toggle}
		<nav class="mobile-nav absolute w-5/6 h-screen left-0 top-0 bg-linear-to-b from-[#0b8f84] to-[#00ccba] z-80 py-4" in:fade={{ duration: 200}} out:slide={{ duration: 300, axis: 'x'}}>
			<div class="px-4 cursor-pointer">
				<X onclick={() => toggle = false} color='white' />
			</div>
			<ul class="text-white text-base font-bold mt-4">
				{#each links as link}
					<li class="grid space-y-4 border-b border-white py-2 mt-4">
						<a href={`${link.link}`} class="flex gap-4 items-center capitalize px-6 cursor cursor-pointer">
							{link.title}
							{getLinkIcon(link.title)} 
						</a>
					</li>		
				{/each }
			</ul>
		</nav>
	{/if}
</header>

<style>
@keyframes slide-in{
	from {
		transform: translateX(-100px);
	}
	to{
		transform: translateX(0);
	}
}

.mobile-nav{
	animation: slide-in 300ms ease-out;
}
</style>