<script>
	import Header from '$lib/components/Header.svelte';
	import WalletProfile from '$lib/components/WalletProfile.svelte';
	import WalletActivity from '$lib/components/WalletActivity.svelte';
	import WalletAssets from '$lib/components/WalletAssets.svelte';
	import { checkAuth } from "$lib/modules/secondAuth";
	let showAssets = false;
	let hashedMemonic = checkAuth();
</script>

<div class="artboard phone-3 p-5 mb-5 pb-5">
	<Header />
	<br />
	<div class="flex flex-col w-full h-auto p-4 bg-white rounded-lg shadow-lg">
		{#if hashedMemonic==false}
			<button class="btn btn-wide ml-10"><a href="/Onboarding">Sign Up First</a></button>
		{:else}
			<WalletProfile />
			<br />
			<div class="flex justify-between mb-4">
				<button
					class={`px-4 py-2 rounded-md ${
						showAssets ? 'shadow-lg bg-zinc-700 text-white' : 'bg-gray-200 text-gray-700 shadow-lg'
					}`}
					on:click={() => (showAssets = true)}
				>
					Assets
				</button>
				<button
					class={`px-4 py-2 rounded-md ${
						!showAssets ? 'shadow-lg bg-zinc-700 text-white' : 'bg-gray-200 text-gray-700 shadow-lg'
					}`}
					on:click={() => (showAssets = false)}
				>
					Activity
				</button>
			</div>
			{#if showAssets}
				<WalletAssets />
			{:else}
				<WalletActivity />
			{/if}
		{/if}
	</div>
</div>