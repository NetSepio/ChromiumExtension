<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import VpnHeader from '$lib/components/ui/vpn-header.svelte';
	import AvatarGenerator from '$lib/components/ui/avatar-generator.svelte';
	import AddressCopy from '$lib/components/ui/address-copy.svelte';
	import Toast from '$lib/components/ui/toast.svelte';
	import { handleAuthPageAccess } from '$lib/helpers/authGuard';
	import { getWalletAddress, getJWTToken } from '../../store/store';
	import { checkUserSubscription, requestTrial } from '$lib/services/subscription-service';
	import type { SubscriptionStatus } from '$lib/services/subscription-service';
	
	// State management
	let isCheckingAuth = $state(true);
	let walletAddress = $state('');
	let subscriptionStatus = $state<SubscriptionStatus | null>(null);
	let isLoadingSubscription = $state(false);
	let isRequestingTrial = $state(false);
	let avatarStyle = $state('gradient');
	
	// Toast state
	let toast = $state(false);
	let toastStatus = $state('');
	let toastSuccess = $state(false);
	let toastError = $state(false);
	
	// URL params to check if user came for trial
	let fromTrialRedirect = $state(false);
	
	// Toast function
	function showToast(statusMsg: string, isSuccess: boolean, isError: boolean) {
		toastStatus = statusMsg;
		toastSuccess = isSuccess;
		toastError = isError;
		toast = true;
		
		setTimeout(() => { toast = false; }, 3000);
	}
	
	// Load user data
	async function loadUserData() {
		try {
			// Get wallet address
			const address = await getWalletAddress();
			if (address && address !== 'none') {
				walletAddress = address;
			}
			
			// Load subscription status
			await loadSubscriptionStatus();
		} catch (error) {
			console.error('Error loading user data:', error);
			showToast('Failed to load user data', false, true);
		}
	}
	
	// Load subscription status
	async function loadSubscriptionStatus() {
		try {
			isLoadingSubscription = true;
			const jwt = await getJWTToken();
			const result = await checkUserSubscription(jwt);
			subscriptionStatus = result;
		} catch (error) {
			console.error('Error loading subscription:', error);
			showToast('Failed to load subscription status', false, true);
		} finally {
			isLoadingSubscription = false;
		}
	}
	
	// Handle trial request
	async function handleTrialRequest() {
		isRequestingTrial = true;
		try {
			const jwt = await getJWTToken();
			const result = await requestTrial(jwt);
			
			if (result.success) {
				showToast('🎉 Trial activated successfully!', true, false);
				
				// Reload subscription status
				await loadSubscriptionStatus();
				
				// Redirect back to home after success
				setTimeout(async () => {
					await goto('/', { replaceState: true });
				}, 2000);
			} else {
				showToast(result.error || 'Failed to activate trial', false, true);
			}
		} catch (error) {
			console.error('Trial request error:', error);
			showToast('Network error while requesting trial', false, true);
		} finally {
			isRequestingTrial = false;
		}
	}
	
	// Handle avatar style change
	function handleAvatarChange(newStyle: string) {
		avatarStyle = newStyle;
		// Could save to localStorage or user preferences here
		localStorage.setItem('avatarStyle', newStyle);
	}
	
	// Format subscription type for display
	function formatSubscriptionType(type?: string): string {
		if (!type || type === 'unknown') return 'Unknown';
		
		// Handle specific subscription types
		switch (type.toLowerCase()) {
			case 'trialsubscription':
				return 'Free Trial';
			case 'basicsubscription':
				return 'Basic Plan';
			case 'premiumsubscription':
				return 'Premium Plan';
			case 'prosubscription':
				return 'Pro Plan';
			default:
				// Convert camelCase/PascalCase to readable format
				return type
					.replace(/([A-Z])/g, ' $1') // Add space before capitals
					.replace(/^./, str => str.toUpperCase()) // Capitalize first letter
					.replace(/subscription/i, 'Plan') // Replace "subscription" with "Plan"
					.trim();
		}
	}
	
	// Get status color
	function getStatusColor(status?: string): string {
		switch (status?.toLowerCase()) {
			case 'active':
				return 'text-green-400';
			case 'expired':
			case 'cancelled':
				return 'text-red-400';
			case 'trial':
				return 'text-blue-400';
			case 'notfound':
				return 'text-yellow-400';
			default:
				return 'text-gray-400';
		}
	}
	
	// Format expiry date
	function formatExpiryDate(dateString?: string): string {
		if (!dateString) return 'No expiry date';
		
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		} catch {
			return 'Invalid date';
		}
	}
	
	// Check if user came from trial redirect
	onMount(async () => {
		try {
			// Check URL params
			const urlParams = new URLSearchParams(window.location.search);
			fromTrialRedirect = urlParams.has('trial') || urlParams.get('from') === 'home';
			
			// Handle auth check
			await handleAuthPageAccess(page.url.pathname);
			
			// Load saved avatar style
			const savedStyle = localStorage.getItem('avatarStyle');
			if (savedStyle) {
				avatarStyle = savedStyle;
			}
			
			// Load user data
			await loadUserData();
		} catch (error) {
			console.error('Profile page: Auth check failed:', error);
			await goto('/welcome', { replaceState: true });
		} finally {
			isCheckingAuth = false;
		}
	});
</script>

<!-- Loading state -->
{#if isCheckingAuth}
<section class="h-full flex items-center justify-center bg-[#111111]">
	<div class="text-center space-y-4">
		<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ccba] mx-auto"></div>
		<p class="text-white/70 text-sm">Loading profile...</p>
	</div>
</section>
{:else}
<!-- Profile content -->
<section class="h-full overflow-y-auto bg-[#111111] text-white">
	<VpnHeader />
	
	<div class="p-6 space-y-6">
		<!-- Profile Header -->
		<div class="text-center space-y-4">
			<h1 class="text-2xl font-bold text-[#00ccba]">My Profile</h1>
			
			<!-- Avatar Section -->
			<div class="flex flex-col items-center space-y-3">
				{#if walletAddress}
					<AvatarGenerator 
						address={walletAddress} 
						size={100} 
						editable={true} 
						onAvatarChange={handleAvatarChange}
					/>
					<p class="text-sm text-white/60">Click avatar to customize</p>
				{:else}
					<div class="w-[100px] h-[100px] rounded-full bg-gray-600 flex items-center justify-center">
						<span class="text-gray-400">No Avatar</span>
					</div>
				{/if}
			</div>
		</div>
		
		<!-- Wallet Address Section -->
		{#if walletAddress}
			<div class="space-y-3">
				<h2 class="text-lg font-semibold text-white">Wallet Information</h2>
				<AddressCopy address={walletAddress} copyable={true} />
			</div>
		{:else}
			<div class="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
				<p class="text-red-400 text-sm">⚠️ No wallet address found</p>
			</div>
		{/if}
		
		<!-- Subscription Status Section -->
		<div class="space-y-4">
			<h2 class="text-lg font-semibold text-white">Subscription Status</h2>
			
			{#if isLoadingSubscription}
				<div class="bg-[#1a1a1a] rounded-lg p-4 border border-[#00ccba]/20">
					<div class="flex items-center gap-3">
						<div class="animate-spin rounded-full h-5 w-5 border-2 border-[#00ccba] border-t-transparent"></div>
						<span class="text-white/70">Loading subscription status...</span>
					</div>
				</div>
			{:else if subscriptionStatus}
				<div class="bg-[#1a1a1a] rounded-lg p-4 border border-[#00ccba]/20 space-y-3">
					<!-- Status -->
					<div class="flex justify-between items-center">
						<span class="text-white/70">Status:</span>
						<span class="font-semibold {getStatusColor(subscriptionStatus.status)}">
							{subscriptionStatus.status?.toUpperCase() || 'UNKNOWN'}
						</span>
					</div>
					
					<!-- Type -->
					{#if subscriptionStatus.subscriptionType}
						<div class="flex justify-between items-center">
							<span class="text-white/70">Type:</span>
							<span class="text-white">{formatSubscriptionType(subscriptionStatus.subscriptionType)}</span>
						</div>
					{/if}
					
					<!-- Expiry Date -->
					{#if subscriptionStatus.expiryDate}
						<div class="flex justify-between items-center">
							<span class="text-white/70">Expires:</span>
							<span class="text-white">{formatExpiryDate(subscriptionStatus.expiryDate)}</span>
						</div>
					{/if}
					
					<!-- Days Remaining -->
					{#if subscriptionStatus.daysRemaining !== undefined}
						<div class="flex justify-between items-center">
							<span class="text-white/70">Days Remaining:</span>
							<span class="text-white font-semibold">
								{subscriptionStatus.daysRemaining > 0 ? subscriptionStatus.daysRemaining : 'Expired'}
							</span>
						</div>
					{/if}
					
					<!-- Active Status Banner -->
					{#if subscriptionStatus.isActive}
						<div class="bg-green-500/20 border border-green-500/50 rounded-lg p-3 mt-3">
							<p class="text-green-400 text-sm text-center">✓ Your subscription is active and ready to use!</p>
						</div>
					{/if}
				</div>
			{:else}
				<div class="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
					<p class="text-yellow-400 text-sm">⚠️ Unable to load subscription status</p>
				</div>
			{/if}
		</div>
		
		<!-- Trial Section -->
		{#if subscriptionStatus?.hasNoSubscription || subscriptionStatus?.status === 'notFound'}
			<div class="space-y-4">
				<h2 class="text-lg font-semibold text-white">Get Started</h2>
				
				<div class="bg-gradient-to-r from-[#00ccba]/20 to-[#00eeda]/20 rounded-lg p-6 border border-[#00ccba]/30">
					<div class="text-center space-y-4">
						<div class="text-4xl mb-2">🚀</div>
						<h3 class="text-xl font-bold text-white">Start Your Free Trial</h3>
						<p class="text-white/80 text-sm">
							Get instant access to our VPN service with a free trial. No credit card required!
						</p>
						
						<button
							class="w-full bg-gradient-to-r from-[#00ccba] to-[#00eeda] hover:from-[#00b5a5] hover:to-[#00ccba] text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
							onclick={handleTrialRequest}
							disabled={isRequestingTrial}
						>
							{#if isRequestingTrial}
								<div class="flex items-center justify-center gap-2">
									<div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
									<span>Activating Trial...</span>
								</div>
							{:else}
								🎯 Activate Free Trial
							{/if}
						</button>
						
						{#if fromTrialRedirect}
							<p class="text-xs text-white/60">
								You were redirected here to claim your trial before using the VPN.
							</p>
						{/if}
					</div>
				</div>
			</div>
		{/if}
		
		<!-- Subscription Management -->
		{#if subscriptionStatus?.isActive}
			<div class="space-y-4">
				<h2 class="text-lg font-semibold text-white">Manage Subscription</h2>
				
				<div class="space-y-3">
					<button
						class="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#00ccba]/30 text-white py-3 px-4 rounded-lg transition-colors"
						onclick={() => window.open('https://erebrus.io/dashboard', '_blank')}
					>
						🔗 Open Subscription Dashboard
					</button>
					
					<button
						class="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#00ccba]/30 text-white py-3 px-4 rounded-lg transition-colors"
						onclick={loadSubscriptionStatus}
						disabled={isLoadingSubscription}
					>
						{#if isLoadingSubscription}
							<div class="flex items-center justify-center gap-2">
								<div class="animate-spin rounded-full h-4 w-4 border-2 border-[#00ccba] border-t-transparent"></div>
								<span>Refreshing...</span>
							</div>
						{:else}
							🔄 Refresh Status
						{/if}
					</button>
				</div>
			</div>
		{/if}
		
		<!-- Back to Home -->
		<div class="pt-4 border-t border-white/10">
			<button
				class="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white py-3 px-4 rounded-lg transition-colors"
				onclick={() => goto('/')}
			>
				← Back to VPN
			</button>
		</div>
	</div>
</section>
{/if}

<Toast 
	status={toastStatus}
	success={toastSuccess}
	error={toastError}
	open={toast}
/>