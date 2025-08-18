<script lang="ts">
	import { fade } from 'svelte/transition';
	import { X, User, LogOut, Settings } from '@lucide/svelte';
	import { links, getLinkIcon } from '$lib/helpers/getLinkIcon';
	import { getWalletAddress, clearJWTToken, privateKey, publicKey, mnemonicPhrase } from '../../../store/store';
	import { clearMasterKeySession } from '../../helpers/masterKeyManager';
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
			clearJWTToken();
		
			// Clear password manager session and derived keys
			clearMasterKeySession();

			// Clear sensitive data from memory stores only
			privateKey.set('');
			publicKey.set('');
			await mnemonicPhrase.remove();
			address = '';
			goto('/sign-in');
		} catch (error) {
			console.error('VPN Header: Logout error:', error);
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
			class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-[#1a1a1a] border border-[#333333] transition-all hover:bg-[#2a2a2a] hover:border-[#00ccba]/50"
		>
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				class="text-[#00ccba]"
			>
				<path
					d="M3 12H21M3 6H21M3 18H21"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
		<img src="/assets/logo.png" alt="Logo" class="logo" />
		<div class="relative">
			<button
				onclick={(e) => {
					e.stopPropagation();
					userDropdown = !userDropdown;
				}}
				class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-[#1a1a1a] border border-[#333333] transition-all hover:bg-[#2a2a2a] hover:border-[#00ccba]/50"
				disabled={isLoggingOut}
			>
				<User color="#00ccba" size="16" />
			</button>
			{#if userDropdown}
				<div
					class="absolute top-10 right-0 z-20 w-52 rounded-xl border border-[#333333] bg-[#1a1a1a] shadow-2xl backdrop-blur-sm"
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
					<!-- Header -->
					<div class="border-b border-[#333333] p-4">
						<div class="flex items-center gap-3">
							<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00ccba]/10">
								<User color="#00ccba" size="20" />
							</div>
							<div class="flex-1">
								{#if address}
									<h3 class="text-sm font-medium text-white">User Account</h3>
									<p class="font-mono text-xs text-[#00ccba]">{formatWalletAddress(address)}</p>
								{:else}
									<h3 class="text-sm font-medium text-white">User Account</h3>
									<p class="text-xs text-gray-400">No wallet connected</p>
								{/if}
							</div>
						</div>
					</div>

					<!-- Actions -->
					<div class="border-t border-[#333333] p-2">
						<!-- Settings Link -->
						<button
							onclick={async () => {
								userDropdown = false;
								await goto('/setting');
							}}
							class="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-[#00ccba]/10"
						>
							<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#202222]">
								<Settings size="16" color="#00ccba" />
							</div>
							<div class="flex-1">
								<span class="text-sm font-medium text-white">Settings</span>
								<p class="text-xs text-gray-400">Preferences & config</p>
							</div>
						</button>

						<!-- Logout Button -->
						<button
							class="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
							onclick={logout}
							disabled={isLoggingOut}
						>
							<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#202222]">
								{#if isLoggingOut}
									<div
										class="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent"
									></div>
								{:else}
									<LogOut size="16" color="#ef4444" />
								{/if}
							</div>
							<div class="flex-1">
								<span class="text-sm font-medium text-white">
									{isLoggingOut ? 'Signing out...' : 'Sign Out'}
								</span>
								<p class="text-xs text-gray-400">
									{isLoggingOut ? 'Please wait...' : 'Wallet stays safe'}
								</p>
							</div>
						</button>
					</div>

					<!-- Security Note -->
					<div class="border-t border-[#333333] p-3">
						<div class="flex items-center gap-2 text-xs text-gray-500">
							<div class="h-1.5 w-1.5 rounded-full bg-green-400"></div>
							<span>Your wallet data remains secure</span>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</nav>
	{#if toggle}
		<!-- Invisible overlay for click outside -->
		<div 
			class="fixed inset-0 z-40" 
			onclick={() => (toggle = false)}
			onkeydown={(e) => {
				if (e.key === 'Escape') {
					toggle = false;
				}
			}}
			role="button"
			tabindex="-1"
			aria-label="Close menu overlay"
		></div>
		
		<!-- Navigation menu -->
		<div
			class="mobile-nav absolute top-16 left-4 z-50 w-80 rounded-xl border border-[#333333] bg-[#1a1a1a] shadow-2xl flex flex-col"
			in:fade={{ duration: 200 }}
			out:fade={{ duration: 150 }}
			role="navigation"
			aria-label="Main navigation"
		>
			<!-- Header with only close button -->
			<div class="flex items-center justify-end border-b border-[#333333] p-3">
				<button
					class="flex h-8 w-8 items-center justify-center rounded-full bg-[#202222] transition-colors hover:bg-[#2a2a2a]"
					aria-label="Close navigation menu"
					onclick={() => (toggle = false)}
				>
					<X color="#00ccba" size="16" />
				</button>
			</div>

			<!-- Navigation Links -->
			<div class="p-2 space-y-1">
				{#each links as link (link.link)}
					<button
						onclick={async () => {
							toggle = false;
							await goto(link.link);
						}}
						class="group flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition-all duration-200 hover:bg-[#00ccba]/10"
					>
						<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#202222] transition-colors group-hover:bg-[#00ccba]/20">
							<span class="text-base">{getLinkIcon(link.title)}</span>
						</div>
						<div class="flex-1">
							<h3 class="text-sm font-medium text-white capitalize transition-colors group-hover:text-[#00ccba]">
								{link.title}
							</h3>
						</div>
						<div class="opacity-0 transition-opacity group-hover:opacity-100">
							<svg class="h-4 w-4 text-[#00ccba]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
							</svg>
						</div>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</header>

<style>
	.logo {
		height: 32px;
		width: auto;
	}
</style>
