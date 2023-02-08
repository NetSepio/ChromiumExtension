<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import WalletProfile from '$lib/components/WalletProfile.svelte';
	import WalletActivity from '$lib/components/WalletActivity.svelte';
	import WalletAssets from '$lib/components/WalletAssets.svelte';
	let showAssets = false;
</script>

<div class="flex flex-col w-full h-auto p-4 rounded-lg shadow-lg">
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
</div>
