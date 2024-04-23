<script lang="ts">
	import { goto } from '$app/navigation';
	import Dashboard from '$lib/components/Dashboard.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import { walletAddress } from '$lib/store/store';
	import { onMount } from 'svelte';
	let address: string = 'none';
	let unlocked: boolean = false;
	let isloading = true;

	onMount(async () => {
		walletAddress.subscribe((data) => (address = data));
		unlocked = JSON.parse(sessionStorage.getItem('unlocked') || 'false');
		if (!unlocked && address !== 'none' && address !== null) {
			await goto('/signIn');
		}
		isloading = false;
	});
</script>

{#if isloading}
	<Loader />
{:else}
	<Dashboard />
{/if}
