<script lang="ts">
	import { fade, slide } from "svelte/transition";
	import { X, User, LogOut } from "@lucide/svelte";
	import { getLinkIcon, links } from "$lib/helpers/getLinkIcon";
	import { getWalletAddress, clearJWTToken } from "../../../store/store";
	import { goto } from '$app/navigation';
	import { formatWalletAddress } from "$lib/helpers/formatWalletAddress";
	
  let toggle = $state(false)
	let userDropdown = $state(false)
  let address = $state('')
	let isLoggingOut = $state(false)

	// Get wallet address securely
	$effect(() => {
		getWalletAddress().then(addr => {
			if (addr) {
				address = addr;
			}
		});
	});

	/**
	 * Secure logout function - clears JWT token but preserves wallet address
	 */
	async function logout() {
		try {
			isLoggingOut = true;
			userDropdown = false; // Close dropdown
			
			console.log('VPN Header: Starting logout process...');
			
			// Clear JWT token from Chrome storage
			clearJWTToken();
			console.log('VPN Header: JWT token cleared');
			
			// DO NOT clear wallet address - it should persist for re-signin
			// clearWalletAddress(); // REMOVED - wallet should stay
			console.log('VPN Header: Wallet address preserved for re-signin');
			
			// Clear sensitive data from memory stores only
			const { privateKey, publicKey, mnemonicPhrase } = await import('../../../store/store');
			privateKey.set('');
			publicKey.set('');
			await mnemonicPhrase.remove(); // Clear temporary mnemonic from memory
			console.log('VPN Header: Sensitive store data cleared from memory');
			
			// Clear address display (but wallet address stays in storage)
			address = '';
			
			console.log('VPN Header: Logout completed successfully - wallet preserved');
			
			// Redirect to sign-in page
			goto('/sign-in');
		} catch (error) {
			console.error('VPN Header: Logout error:', error);
			// Fallback: Still redirect to sign-in
			goto('/sign-in');
		} finally {
			isLoggingOut = false;
		}
	}

	/**
	 * Handle click outside dropdown to close it
	 */
	function handleClickOutside() {
		if (userDropdown) {
			userDropdown = false;
		}
	}
</script>

<!-- Click outside handler -->
<svelte:window onclick={handleClickOutside} />

<header>
	<nav class={'flex items-center justify-between py-4 px-4 bg-[#101212] shadow'}>
		<button
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
		</button>
		<img src='/assets/logo.png' alt="Logo" class="logo" />
		<div class="relative">
			<button 
				onclick={(e) => {
					e.stopPropagation();
					userDropdown = !userDropdown;
				}} 
				class="size-8 cursor-pointer rounded-full p-1 flex justify-center items-center bg-[#000e0c] hover:bg-[#0eafa2]/20 transition-colors"
				disabled={isLoggingOut}
			>
				<User color='#0eafa2' size='18' />
			</button>
			{#if userDropdown}
				<div class="bg-[#101212]/95 backdrop-blur-sm rounded-lg shadow-lg border border-[#0eafa2]/20 p-3 capitalize absolute top-10 z-20 w-44 text-white space-y-3 right-0" 
					 role="dialog"
					 aria-label="User menu"
					 onclick={(e) => e.stopPropagation()}
					 onkeydown={(e) => {
						 if (e.key === 'Escape') {
							 userDropdown = false;
						 }
					 }}>
					
					<!-- Wallet Address Display -->
					{#if address}
						<div class="space-y-1">
							<p class="text-xs text-white/60 normal-case">Wallet Address:</p>
							<p class="text-sm font-mono bg-[#000e0c] px-2 py-1 rounded text-[#0eafa2]">
								{formatWalletAddress(address)}
							</p>
						</div>
					{:else}
						<div class="text-xs text-white/60 normal-case">
							No wallet connected
						</div>
					{/if}
					
					<hr class="border-white/20" />
					
					<!-- Logout Button -->
					<button 
						class='w-full flex items-center gap-2 cursor-pointer capitalize hover:bg-[#0eafa2]/10 p-2 rounded transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed' 
						onclick={logout}
						disabled={isLoggingOut}
					>
						{#if isLoggingOut}
							<div class="animate-spin rounded-full h-4 w-4 border-2 border-[#0eafa2] border-t-transparent"></div>
							<span class="text-sm">Signing out...</span>
						{:else}
							<LogOut size='16' color='#ef4444' />
							<span class="text-sm">Log out</span>
						{/if}
					</button>
					
					<!-- Security Note -->
					<div class="text-xs text-white/50 normal-case border-t border-white/10 pt-2">
						<p>💡 Your wallet stays safe for quick re-signin</p>
					</div>
				</div>
			{/if}
		</div>
	</nav>
	{#if toggle}
		<nav class="mobile-nav absolute w-5/6 left-6 top-6 rounded-lg bg-linear-to-b from-[#095e57] to-[hsl(175,97%,37%)] z-80 pt-4 px-4" in:fade={{ duration: 200}} out:slide={{ duration: 100, axis: 'x'}}>
			<button 
				class="cursor-pointer"
				aria-label="Close navigation menu"
				onclick={() => toggle = false}
			>
				<X color='white' />
			</button>
			<ul class="text-white text-base font-bold mt-3">
				{#each links as link}
					<li class="grid space-y-4 border-b border-[#ffffff63] last:border-0 py-2 mt-4">
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
