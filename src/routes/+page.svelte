<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';
	import VpnHeader from '$lib/components/ui/vpn-header.svelte';
	import CurrentLocation from '$lib/components/ui/current-location.svelte';
	import SelectLocation from '$lib/components/ui/select-location.svelte';
	import VpnButton from '$lib/components/ui/vpn-button.svelte';
	import { node, cachedLocations, getJWTToken } from '../store/store';
	import StatusIndicator from '$lib/components/ui/status-indicator.svelte';
	import { fetchNodes } from '$lib/api';
	import Dialog from '$lib/components/ui/dialog.svelte';
	import type { LocationNodeInfo } from '../types/types';
	import Toast from '$lib/components/ui/toast.svelte';
	import { handleHomepageAuth } from '$lib/helpers/authGuard';
	import { onMount } from 'svelte';
	import { formatTime } from '$lib/utils/timer-utils';
	import { getVpnStorageData, setVpnConnectionStatus, setSelectedNode } from '$lib/utils/storage-utils';
	import { checkPortStatus } from '$lib/services/port-checker-service';
	import { validateVpnConnection, connectToVpn, disconnectFromVpn } from '$lib/services/vpn-service';
	import { checkUserSubscription } from '$lib/services/subscription-service';
	import { goto } from '$app/navigation';
	
	// add a check to verify if the locations are working before conencting
	let seconds = $state(0);
	let timer = $state('00:00:00');
	let showDialog = $state(false);
	let isConnected = $state(false);
	let status = $state('Connect');
	let locationNodes: LocationNodeInfo[] = $state([]);
	// Toast state
	let toast = $state(false);
	let toastStatus = $state('');
	let toastSuccess = $state(false);
	let toastError = $state(false);
	let connectionStatusMsg = $state('');
	let connectionStatusType = $state(''); 
	let disableConnect = $state(false);
	let showTrialLink = $state(false);

	// Simple toast function
	function showToast(statusMsg: string, isSuccess: boolean, isError: boolean) {
		toastStatus = statusMsg;
		toastSuccess = isSuccess;
		toastError = isError;
		toast = true;
		
		// Auto-hide toast after 3 seconds
		setTimeout(() => { toast = false; }, 3000);
		
		// Also show persistent message below IP
		connectionStatusMsg = statusMsg;
		if (isSuccess) {
			connectionStatusType = 'active';
			disableConnect = false;
		} else if (isError) {
			connectionStatusType = 'inactive';
			disableConnect = true;
		} else {
			connectionStatusType = '';
			disableConnect = false;
		}
	}
	let isCheckingAuth = $state(true);

	let nodeReady = $state(false);

	$effect(() => {
		// Wait for node to be restored from storage
		nodeReady = !!$node && !!$node.id;
	});

	$effect(() => {
		disableConnect = !nodeReady || !$node || !$node.id || ($node.status ? $node.status.toLowerCase() !== 'active' : false);
	});

	// Authentication check on mount (removed subscription check)
	onMount(async () => {
		try {
			await new Promise(resolve => setTimeout(resolve, 100));
			await handleHomepageAuth();
		} catch (error: unknown) {
			console.error('Homepage: Authentication check failed:', error);
			const errorStack = error instanceof Error ? error.stack : 'No stack trace';
			console.error('Homepage: Error stack:', errorStack);
			try {
				const { goto } = await import('$app/navigation');
				await goto('/welcome', { replaceState: true });
			} catch (navError: unknown) {
				const navErrorMessage = navError instanceof Error ? navError.message : String(navError);
				console.error('Homepage: Navigation to welcome failed:', navErrorMessage);
			}
		}
		finally {
			isCheckingAuth = false;
		}
	});

	const selectLocation = async (selectedLocation: LocationNodeInfo) => {
		node.set(selectedLocation);
		await setSelectedNode(selectedLocation);
		if (selectedLocation.ipinfoip) {
			const result = await checkPortStatus(selectedLocation.ipinfoip);
			if (result.isOpen) {
				showToast('Connection active', true, false);
			} else {
				showToast(result.error || 'Selected node is not available at the moment.', false, true);
			}
		} else {
			showToast('No IP address found for this location.', false, true);
		}
	};


	$effect(() => {
		async function nodeLocations() {
			locationNodes = await fetchNodes();
		}
		nodeLocations();
	});

	$effect(() => {
		(async () => {
			const result = await getVpnStorageData();
			isConnected = result.vpnConnected || false;
			status = isConnected ? "Disconnect" : "Connect";
			seconds = result.timerSeconds || 0;
			timer = formatTime(seconds);

			if (result.selectedNode) {
				node.set(result.selectedNode);
			}
		})();
	});

	
	// Add message listener for timer updates and connection failures
		$effect(() => {
		function messageListener(request: any) {
			if (request.action === 'timerUpdate') {
				seconds = request.seconds;
				timer = formatTime(seconds);
			}
		}
		chrome.runtime.onMessage.addListener(messageListener);

		return () => chrome.runtime.onMessage.removeListener(messageListener);
	});

	
	// Subscribe to cached locations
	$effect(() => {
		async function loadLocations() {
			locationNodes = await fetchNodes();
		}
		loadLocations();

		// Subscribe to changes in cached locations
		const unsubscribe = cachedLocations.subscribe((locations) => {
			if (locations.length > 0) {
				locationNodes = locations;
			}
		});

		return () => unsubscribe();
	});

	async function toggleVPN() {
		if (isConnected) {
			// Disconnect
			status = 'Disconnecting...';
			const result = await disconnectFromVpn($node!);
			if (result.success) {
				isConnected = false;
				status = 'Connect';
				await setVpnConnectionStatus(false);
			} else {
				status = 'Error';
				isConnected = false;
				console.error('VPN disconnection failed:', result.errorMessage);
			}
		} else {
			// Check subscription status before validating connection
			try {
				const jwt = await getJWTToken();
				const subscriptionResult = await checkUserSubscription(jwt);
				
				if (!subscriptionResult.isActive && subscriptionResult.hasNoSubscription) {
					// Show trial link instead of connecting
					showTrialLink = true;
					showToast('Please activate your trial to use the VPN service', false, false);
					return;
				}
			} catch (error) {
				console.error('Error checking subscription:', error);
				showToast('Failed to check subscription status', false, true);
				return;
			}

			// Validate before connecting
			const validation = await validateVpnConnection($node);
			if (!validation.isValid) {
				// Handle trial option - route to profile instead of showing trial button
				if (validation.showTrialOption) {
					showTrialLink = true;
					showToast('Please activate your trial to use the VPN service', false, false);
				} else {
					showToast(validation.errorMessage!, false, true);
				}
				return;
			}

			// Connect
			isConnected = true;
			status = 'Connecting...';
			const result = await connectToVpn($node!);
			if (result.success) {
				status = 'Disconnect';
				await setVpnConnectionStatus(true);
				if (connectionStatusType === 'active') {
					connectionStatusMsg = '';
					connectionStatusType = '';
				}
			} else {
				status = 'Error';
				isConnected = false;
				console.error('VPN connection failed:', result.errorMessage);
			}
		}
	}

</script>

<!-- Loading state while checking authentication -->
{#if isCheckingAuth}
<section class="h-full flex items-center justify-center bg-[#111111]">
	<div class="text-center space-y-4">
		<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ccba] mx-auto"></div>
		<p class="text-white/70 text-sm">Checking authentication...</p>
	</div>
</section>
{:else}
<!-- Main homepage content -->
<section
	class="relative h-full p-6 bg-contain bg-top bg-no-repeat bg-[#111111] overflow-hidden w-full"
	style="background-image: url({'/assets/world-map.png'});"
>
	<VpnHeader />
		<CurrentLocation />
		<div class="my-4 flex items-center justify-center">
			{#if !isConnected}
			<button
				class="rounded-full text-sm cursor-pointer border border-[#0eafa2] bg-[#f3f3f38f] flex items-center gap-4 justify-center px-4 py-2"
				aria-label="select location"
				onclick={() => showDialog = true}
			>
				<span>Select Location</span>
				<ChevronDown />
			</button>
			{/if}
			<Dialog open={showDialog} onClose={() => showDialog = false}>
				<label for="location" class="font-bold text-white mb-4 block">Select Location</label>
				<div class="location-list max-h-[450px] overflow-y-auto pr-2">
					<div class="space-y-1">
						{#each locationNodes as location, index}
							<SelectLocation {location} onclick={() => selectLocation(location)} />
						{/each}
					</div>
				</div>
			</Dialog>
		</div>
		<div class="grid space-y-2 text-center font-bold text-[#f4fffe]">
		{#if isConnected}
			<h1 class='text-3xl'>{formatTime(seconds) || timer}</h1>
		{/if}
			{#if $node.id}
				<p>Your current IP: <span class="font-normal">{$node.ipinfoip}</span></p>
				{#if !isConnected}
					{#if $node.status && $node.status.toLowerCase() !== 'active'}
						<p class="text-red-400 text-sm font-semibold">Selected node is not available at the moment.</p>
					{/if}
				{/if}
			{:else}
				{#if !isConnected}
					<p class="text-yellow-400 text-sm font-semibold">No node selected</p>
				{/if}
			{/if}
			{#if connectionStatusMsg}
				<div class="text-sm font-semibold {connectionStatusType === 'inactive' ? 'text-red-400' : 'text-transparent'}">
					{connectionStatusMsg}
				</div>
			{/if}
		</div>
	
		<div class="top-[55%] absolute left-1/2 -translate-x-1/2 z-30">
			{#if showTrialLink && !isConnected}
				<div class="absolute -top-8 text-center">
					<a 
						href="/my-account?trial=true&from=home"
						class="inline-block text-[#00ccba] hover:text-[#00eeda] font-semibold underline underline-offset-4 decoration-2 transition-colors duration-200"
					>
						🚀 Activate Free Trial to Use VPN
					</a>
				</div>
			{/if}
			<VpnButton enabled={isConnected} toggleConnection={toggleVPN} disabled={disableConnect} />
		</div>
		<div class="absolute top-[75%] -left-[5%] size-[400px] rounded-full pt-24 p-12">
			<StatusIndicator {status} />
		</div>
</section>
{/if}


<Toast 
	status={toastStatus}
	success={toastSuccess}
	error={toastError}
	open={toast}
/>

<style>
	/* Modern scrollbar styling for location list */
	.location-list {
		scrollbar-width: thin;
		scrollbar-color: #00ccba20 transparent;
	}

	.location-list::-webkit-scrollbar {
		width: 6px;
	}

	.location-list::-webkit-scrollbar-track {
		background: transparent;
		border-radius: 10px;
	}

	.location-list::-webkit-scrollbar-thumb {
		background: linear-gradient(180deg, #00ccba 0%, #00eeda 100%);
		border-radius: 10px;
		border: 1px solid #00ccba30;
	}

	.location-list::-webkit-scrollbar-thumb:hover {
		background: linear-gradient(180deg, #00eeda 0%, #00ccba 100%);
		box-shadow: 0 0 10px #00ccba40;
	}

	.location-list::-webkit-scrollbar-corner {
		background: transparent;
	}
</style>