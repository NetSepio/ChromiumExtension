<script>
	import Header from '$lib/components/Header.svelte';
	import WalletProfile from '$lib/components/WalletProfile.svelte';
	import WalletActivity from '$lib/components/WalletActivity.svelte';
	import WalletAssets from '$lib/components/WalletAssets.svelte';
	import { checkAuth } from '$lib/modules/secondAuth';
	let showAssets = false;
	let hashedMnemonic = checkAuth();
</script>

<div class="artboard phone-3 p-5 mb-5 pb-5">
	<Header />
	<br />
	<div class="flex flex-col w-full h-auto p-4 rounded-lg shadow-lg">
		{#if hashedMnemonic == false}
			<button class="btn"><a href="/Onboarding">Setup Wallet</a></button>
		{:else}
			<WalletProfile />
			<br />
			<div class="flex justify-between mb-4">
				<button
					class={`px-4 py-2 rounded-md ${
						showAssets
							? 'shadow-lg bg-zinc-700 text-white dark:bg-gray-900 dark:text-white'
							: 'bg-gray-200 text-gray-700 dark:bg-gray-900 dark:text-white shadow-lg'
					}`}
					on:click={() => (showAssets = true)}
				>
					Assets
				</button>
				<button
					class={`px-4 py-2 rounded-md dark:bg-gray-900 dark:text-white ${
						!showAssets
							? 'shadow-lg bg-zinc-700 text-white dark:bg-gray-900 dark:text-white'
							: 'bg-gray-200 text-gray-700 dark:bg-gray-900 dark:text-white shadow-lg'
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
