<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { X, User, LogOut, Settings } from '@lucide/svelte';
	import { getLinkIcon, links } from '$lib/helpers/getLinkIcon';
	import { getWalletAddress, clearJWTToken } from '../../../store/store';
	import { goto } from '$app/navigation';
	import { formatWalletAddress } from '$lib/helpers/formatWalletAddress';

	let toggle = $state(false);
	let userDropdown = $state(false);
	let address = $state('');
	let isLoggingOut = $state(false);

	// Get wallet address securely
	$effect(() => {
		getWalletAddress().then((addr) => {
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
			userDropdown = false;

			try {
				await chrome.runtime.sendMessage({ action: 'logoutAndDisconnectVPN' });
			} catch (e) {
				console.error('Error disconnecting VPN during logout:', e);
			}

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
	<nav class="flex items-center justify-between bg-[#101212] px-4 py-4 shadow">
		<button
			aria-label="toggle button"
			onclick={() => (toggle = true)}
			class="flex size-8 cursor-pointer items-center justify-center rounded-full bg-[#000e0c] p-1"
		>
			<svg
				width="26"
				height="26"
				viewBox="0 0 26 26"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<rect
					x="2"
					y="19.1111"
					width="15.8889"
					height="2.44444"
					rx="1.22222"
					fill="url(#paint0_linear_2094_15035)"
				/>
				<rect
					x="2"
					y="11.7778"
					width="22"
					height="2.44444"
					rx="1.22222"
					fill="url(#paint1_linear_2094_15035)"
				/>
				<rect
					x="2"
					y="4.44458"
					width="15.8889"
					height="2.44444"
					rx="1.22222"
					fill="url(#paint2_linear_2094_15035)"
				/>
				<defs>
					<linearGradient
						id="paint0_linear_2094_15035"
						x1="9.94444"
						y1="19.1111"
						x2="9.94444"
						y2="21.5555"
						gradientUnits="userSpaceOnUse"
					>
						<stop stop-color="#0EAFA2" />
						<stop offset="1" stop-color="#00FFEA" />
					</linearGradient>
					<linearGradient
						id="paint1_linear_2094_15035"
						x1="13"
						y1="11.7778"
						x2="13"
						y2="14.2223"
						gradientUnits="userSpaceOnUse"
					>
						<stop stop-color="#0EAFA2" />
						<stop offset="1" stop-color="#00FFEA" />
					</linearGradient>
					<linearGradient
						id="paint2_linear_2094_15035"
						x1="9.94444"
						y1="4.44458"
						x2="9.94444"
						y2="6.88902"
						gradientUnits="userSpaceOnUse"
					>
						<stop stop-color="#0EAFA2" />
						<stop offset="1" stop-color="#00FFEA" />
					</linearGradient>
				</defs>
			</svg>
		</button>
		<img src="/assets/logo.png" alt="Logo" class="logo" />
		<div class="relative">
			<button
				onclick={(e) => {
					e.stopPropagation();
					userDropdown = !userDropdown;
				}}
				class="flex size-8 cursor-pointer items-center justify-center rounded-full bg-[#000e0c] p-1 transition-colors hover:bg-[#0eafa2]/20"
				disabled={isLoggingOut}
			>
				<User color="#0eafa2" size="18" />
			</button>
			{#if userDropdown}
				<div
					class="absolute top-10 right-0 z-20 w-44 space-y-3 rounded-lg border border-[#0eafa2]/20 bg-[#101212]/95 p-3 text-white capitalize shadow-lg backdrop-blur-sm"
					role="menu"
					tabindex="-1"
					aria-label="User menu"
					onclick={(e) => e.stopPropagation()}
					onkeydown={(e) => {
						if (e.key === 'Escape') {
							userDropdown = false;
						}
					}}
				>
					<!-- Wallet Address Display -->
					{#if address}
						<div class="space-y-1">
							<p class="text-xs text-white/60 normal-case">Wallet Address:</p>
							<p class="rounded bg-[#000e0c] px-2 py-1 font-mono text-sm text-[#0eafa2]">
								{formatWalletAddress(address)}
							</p>
						</div>
					{:else}
						<div class="text-xs text-white/60 normal-case">No wallet connected</div>
					{/if}

					<hr class="border-white/20" />

					<!-- Profile Link -->
					<button
						onclick={async () => {
							userDropdown = false;
							await goto('/my-account');
						}}
						class="flex w-full cursor-pointer items-center gap-2 rounded p-2 text-left capitalize transition-colors hover:bg-[#0eafa2]/10"
					>
						<Settings size="16" color="#0eafa2" />
						<span class="text-sm">My Profile</span>
					</button>

					<!-- Logout Button -->
					<button
						class="flex w-full cursor-pointer items-center gap-2 rounded p-2 text-left capitalize transition-colors hover:bg-[#0eafa2]/10 disabled:cursor-not-allowed disabled:opacity-50"
						onclick={logout}
						disabled={isLoggingOut}
					>
						{#if isLoggingOut}
							<div
								class="h-4 w-4 animate-spin rounded-full border-2 border-[#0eafa2] border-t-transparent"
							></div>
							<span class="text-sm">Signing out...</span>
						{:else}
							<LogOut size="16" color="#ef4444" />
							<span class="text-sm">Log out</span>
						{/if}
					</button>

					<!-- Security Note -->
					<div class="border-t border-white/10 pt-2 text-xs text-white/50 normal-case">
						<p>💡 Your wallet stays safe for quick re-signin</p>
					</div>
				</div>
			{/if}
		</div>
	</nav>
	{#if toggle}
		<nav
			class="mobile-nav absolute top-6 left-6 z-80 w-5/6 rounded-lg border border-[#00ccba]/30 bg-[#111111] px-4 pt-4 shadow-xl"
			in:fade={{ duration: 200 }}
			out:slide={{ duration: 50, axis: 'x' }}
		>
			<div class="mb-2 flex justify-end">
				<button
					class="cursor-pointer"
					aria-label="Close navigation menu"
					onclick={() => (toggle = false)}
				>
					<X color="#00ccba" />
				</button>
			</div>
			<ul class="mt-3 text-base font-bold text-white">
				{#each links as link (link.link)}
					<li class="border-b border-[#00ccba]/20 py-3 last:border-0">
						<button
							onclick={async () => {
								toggle = false;
								await goto(link.link);
							}}
							class="flex w-full cursor-pointer items-center gap-4 rounded-lg px-4 py-2 text-left capitalize transition-colors duration-200 hover:bg-[#00ccba]/10"
						>
							<span class="text-[#00ccba]">{getLinkIcon(link.title)}</span>
							<span class="text-white transition-colors hover:text-[#00ccba]">{link.title}</span>
						</button>
					</li>
				{/each}
			</ul>
		</nav>
	{/if}
</header>

<style>
	@keyframes slide-in {
		from {
			transform: translateX(-100px);
		}
		to {
			transform: translateX(0);
		}
	}

	.mobile-nav {
		animation: slide-in 300ms ease-out;
	}
</style>
