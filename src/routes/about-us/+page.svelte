<script lang="ts">
	import VpnHeader from '$lib/components/ui/vpn-header.svelte';
</script>

<svelte:head>
	<title>About Us - Netsepio</title>
</svelte:head>

<section class="h-full bg-[#101212] text-white">
	<VpnHeader />
	
	<div class="px-6 py-6">
		<div class="mx-auto max-w-md text-center space-y-6">
			<!-- Main Title -->
			<div>
				<h1 class="mb-2 text-xl font-bold bg-gradient-to-r from-[#00ccba] to-[#00eeda] bg-clip-text text-transparent">
					About Netsepio
				</h1>
				<h2 class="text-sm font-medium text-white/80">
					DePIN Powered Private, Secure & Agentic Internet
				</h2>
			</div>

			<!-- Mission Statement -->
			<div class="rounded-lg border border-[#333333] bg-[#1a1a1a] p-4">
				<p class="text-sm leading-relaxed text-gray-300">
					NetSepio delivers private, secure, and censorship-free internet with an AI coordination layer
					for secure data and inference, shaping an agentic future.
				</p>
				<div class="my-3 h-px bg-gradient-to-r from-transparent via-[#333333] to-transparent"></div>
				<p class="text-sm leading-relaxed text-gray-300">
					Powered by a DePIN-enabled ÐVPN protocol, we provide a decentralized, resilient network 
					that empowers humanity with unmatched digital freedom.
				</p>
			</div>

			<!-- Links -->
			<div class="space-y-3">
				<a 
					href="https://netsepio.com" 
					target="_blank"
					rel="noopener noreferrer"
					class="block w-full rounded-lg border border-[#333333] bg-[#1a1a1a] p-3 text-center text-sm font-medium text-[#00ccba] transition-colors hover:border-[#00ccba]/50 hover:bg-[#202222]"
				>
					Visit Website
				</a>
				<a 
					href="https://netsepio.com/privacy-policy" 
					target="_blank"
					rel="noopener noreferrer"
					class="block w-full rounded-lg border border-[#333333] bg-[#1a1a1a] p-3 text-center text-sm font-medium text-[#00ccba] transition-colors hover:border-[#00ccba]/50 hover:bg-[#202222]"
				>
					Privacy Policy
				</a>
			</div>
		</div>
	</div>
</section>
