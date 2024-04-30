<script lang="ts">
	import { goto } from '$app/navigation';
	import Dashboard from '$lib/components/Dashboard.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import { jwtToken } from '$lib/store/store';
	import { getData } from '$lib/utils';
	import { onMount } from 'svelte';
	let token: string = 'none';
	let unlocked: boolean = false;
	let isloading = true;

	onMount(async () => {
		jwtToken.subscribe((data) => (token = data));
		unlocked = getData('unlocked');
		if (!unlocked && token !== 'none' && token !== null && token !== '') {
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
