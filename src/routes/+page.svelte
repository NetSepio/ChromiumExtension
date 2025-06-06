<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';
	import VpnHeader from '$lib/components/ui/vpn-header.svelte';
	import CurrentLocation from '$lib/components/ui/current-location.svelte';
	import SelectLocation from '$lib/components/ui/select-location.svelte';
	import VpnButton from '$lib/components/ui/vpn-button.svelte';
	import { node, jwtToken, cachedLocations } from '../store/store';
	import StatusIndicator from '$lib/components/ui/status-indicator.svelte';
	import { fetchNodes } from '$lib/api';
	import Dialog from '$lib/components/ui/dialog.svelte';
	import { goto } from '$app/navigation';
	import type { LocationNodeInfo } from '../types/types';
	import { onDestroy } from 'svelte';
	import { checkAuth } from '$lib/modules/storePassword';
	import Toast from '$lib/components/ui/toast.svelte';


	// add a check to verify if the locations are working before conencting


	let seconds = $state(0);
	let timer = $state('00:00:00');
	let showDialog = $state(false);
	let isConnected = $state(false);
	let status = $state('Disconnected');
	let token = $state($jwtToken); // Initialize token with the current value of jwtToken
	let locationNodes: LocationNodeInfo[] = $state([]);
	let isUserAuthenticated = $state(false);
	let toast = $state(false);

	const selectLocation = async (selectedLocation: LocationNodeInfo) => {
		node.set(selectedLocation);
		await chrome.storage.local.set({ selectedNode: selectedLocation });
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
			status = isConnected ? "Connected" : "Disconnected";
			seconds = result.timerSeconds || 0;
			timer = formatTime(seconds);

			if (result.selectedNode) {
				node.set(result.selectedNode);
			}
		})();
	});

	// Add message listener for timer updates
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

	// Subscribe to jwtToken store outside of the effect
	jwtToken.subscribe((value) => {
		token = value;
	});

	$effect(() => {
		(async () => {
			const authResult = await checkAuth();
			isUserAuthenticated = Array.isArray(authResult) ? authResult[0] : authResult;

			console.log(isUserAuthenticated);
			if (isUserAuthenticated === false) {
				goto('/welcome');
			}
		})();
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
		if (!$node || !$node.domain || !$node.ipinfoip) {
			toast = true;
			
			return;
		}

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
				status = 'Disconnected';
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
				status = 'Connected';
				await chrome.storage.local.set({ vpnConnected: true });
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

	onDestroy(() => {
		// Clear interval when component is destroyed
	});
</script>


<section
	class="relative h-full p-6 bg-contain bg-top bg-no-repeat bg-[#111111] overflow-hidden w-full"
	style="background-image: url({'/assets/world-map.png'});"
>
	<VpnHeader wallet={false} />
		<CurrentLocation />
		<div class="my-4 flex items-center justify-center">
			<button
				class="rounded-full text-base cursor-pointer border border-[#0eafa2] bg-[#f3f3f38f] flex items-center gap-4 justify-center px-4 py-2"
				aria-label="change location"
				onclick={() => showDialog = true}
			>
				<span>Change Location</span>
				<ChevronDown />
			</button>
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
			<h1 class='text-3xl'>{formatTime(seconds) || timer}</h1>
			{#if $node.id}
				<p>Your current IP: <span class="font-normal">{$node.ipinfoip}</span></p>
			{/if}
		</div>
		<div class="top-[55%] absolute left-1/2 -translate-x-1/2 z-30">
			<VpnButton enabled={isConnected} toggleConnection={toggleVPN} />
		</div>
		<div class="absolute top-[75%] -left-[5%] size-[400px] rounded-full pt-24 p-12">
			<StatusIndicator {status} />
		</div>
</section>

<Toast 
	status='Please select a location first.'
	success={false}
	error={true}
	open={toast}
/>