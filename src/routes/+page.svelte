<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';
	import VpnHeader from '$lib/components/ui/vpn-header.svelte';
	import CurrentLocation from '$lib/components/ui/current-location.svelte';
	import SelectLocation from '$lib/components/ui/select-location.svelte';
	import VpnButton from '$lib/components/ui/vpn-button.svelte';
	import { node, cachedLocations } from '../store/store';
	import StatusIndicator from '$lib/components/ui/status-indicator.svelte';
	import { fetchNodes } from '$lib/api';
	import Dialog from '$lib/components/ui/dialog.svelte';
	import type { LocationNodeInfo } from '../types/types';
	import Toast from '$lib/components/ui/toast.svelte';
	import { handleHomepageAuth } from '$lib/helpers/authGuard';
	import { onMount } from 'svelte';
	import { debugWalletStorage } from '$lib/helpers/debugWallet';
	import { AuthGuard } from '$lib/helpers/authGuard';

	// add a check to verify if the locations are working before conencting
	let seconds = $state(0);
	let timer = $state('00:00:00');
	let showDialog = $state(false);
	let isConnected = $state(false);
	let status = $state('Connect');
	let locationNodes: LocationNodeInfo[] = $state([]);
	let toast = $state(false);
	let toastStatus = $state('');
	let toastSuccess = $state(false);
	let toastError = $state(false);
	let isCheckingAuth = $state(true);
	let connectionStatusMsg = $state('');
	let connectionStatusType = $state(''); 
	let disableConnect = $state(false);
	let nodeReady = $state(false);

	$effect(() => {
		// Wait for node to be restored from storage
		nodeReady = !!$node && !!$node.id;
	});

	$effect(() => {
		disableConnect = !nodeReady || !$node || !$node.id || ($node.status ? $node.status.toLowerCase() !== 'active' : false);
	});



	// Authentication check on mount
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

	let toastTimeout: ReturnType<typeof setTimeout> | null = null;

	function showToastWithTimeout(statusMsg: string, isSuccess: boolean, isError: boolean) {
		toastStatus = statusMsg;
		toastSuccess = isSuccess;
		toastError = isError;
		toast = true;
		if (toastTimeout) clearTimeout(toastTimeout);
		toastTimeout = setTimeout(() => { toast = false; }, 3000);
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

	async function checkPortStatus(ip: string) {
		try {
			const response = await fetch('https://portchecker.io/api/query', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ host: ip, ports: [8088] })
			});
			if (!response.ok) throw new Error('Portchecker API error');
			const data = await response.json();
			if (data.error || !data.check || !Array.isArray(data.check)) {
				showToastWithTimeout('Could not check connection (API error)', false, true);
				return;
			}
			const status = data.check[0]?.status;
			if (status === true) {
				showToastWithTimeout('Connection active', true, false);
			} else {
				showToastWithTimeout('Selected node is not available at the moment.', false, true);
			}
		} catch (e) {
			showToastWithTimeout('Could not check connection (network error)', false, true);
		}
	}

	const selectLocation = async (selectedLocation: LocationNodeInfo) => {
		node.set(selectedLocation);
		await chrome.storage.local.set({ selectedNode: selectedLocation });
		if (selectedLocation.ipinfoip) {
			await checkPortStatus(selectedLocation.ipinfoip);
		} else {
			toastStatus = 'No IP address found for this location.';
			toastError = true;
			toastSuccess = false;
			toast = true;
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
			const result = await chrome.storage.local.get(['vpnConnected', 'selectedNode', 'timerSeconds']);
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
		// 1. Check if a node is selected and has an IP
		if (!$node || !$node.id || !$node.domain || !$node.ipinfoip) {
			showToastWithTimeout('Please select a node/location before connecting.', false, true);
			return;
		}

		// 2. Check if the node is marked as active
		if (!$node.status || $node.status.toLowerCase() !== 'active') {
			showToastWithTimeout('Selected node is not available at the moment. Try a different region', false, true);
			return;
		}

		// 3. Check if the node IP is actually active (port check)
		let portStatus = false;
		try {
			const response = await fetch('https://portchecker.io/api/query', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ host: $node.ipinfoip, ports: [8088] })
			});
			if (response.ok) {
				const data = await response.json();
				portStatus = data.check && Array.isArray(data.check) && data.check[0]?.status === true;
			}
		} catch (e) {
			portStatus = false;
		}
		if (!portStatus) {
			showToastWithTimeout('Selected node is not available at the moment. Try a different region', false, true);
			return;
		}

		// 4. Proceed to connect or disconnect
		if (isConnected) {
			// Disconnect
			status = 'Disconnecting...';
			try {
				await chrome.runtime.sendMessage({
					action: 'toggleVPN',
					isConnected: false,
					host: $node.ipinfoip,
				});
				isConnected = false;
				status = 'Connect';
				await chrome.storage.local.set({ vpnConnected: false });
			} catch (error) {
				status = 'Error';
				isConnected = false;
				console.error('vpn failed', error);
			}
		} else {
			// Connect
			isConnected = true;
			status = 'Connecting...';
			try {
				await chrome.runtime.sendMessage({
					action: 'toggleVPN',
					isConnected: true,
					host: $node.ipinfoip,
				});
				status = 'Disconnect';
				await chrome.storage.local.set({ vpnConnected: true });
				if (connectionStatusType === 'active') {
					connectionStatusMsg = '';
					connectionStatusType = '';
				}
			} catch (error) {
				status = 'Error';
				isConnected = false;
				console.error('vpn failed', error);
			}
		}
	}

	function formatTime(secs: any) {
		const h = String(Math.floor(secs / 3600)).padStart(2, '0');
		const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
		const s = String(secs % 60).padStart(2, '0');
		return `${h}:${m}:${s}`;
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
				<label for="location" class="font-bold">Select Location</label>
				<div class="max-h-[500px] overflow-y-scroll scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-gray-500 scrollbar-track-transparent">
					{#each locationNodes as location, index}
						<div class="grid space-y-2">
							<SelectLocation {location} onclick={() => selectLocation(location)} />
						</div>
					{/each}
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
				<div class="text-sm font-semibold {connectionStatusType === 'inactive' ? 'text-red-400' : 'text-green-400'}">
					{connectionStatusMsg}
				</div>
			{/if}
		</div>
	
		<div class="top-[55%] absolute left-1/2 -translate-x-1/2 z-30">
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