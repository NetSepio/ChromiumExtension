<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import ChangePassword from '$lib/components/ChangePassword.svelte';
	import Logout from '$lib/components/Logout.svelte';
	import { onMount } from 'svelte';
	import { checkAuth } from '$lib/modules/secondAuth';
	import { mnemonicPhase } from '$lib/store/store';
	import LockWallet from '$lib/components/LockWallet.svelte';

	let isWalletUnlocked = false;

	const changeIsWalletUnlocked = (newValue: boolean) => {
		isWalletUnlocked = newValue;
	};

	onMount(async () => {
		[, isWalletUnlocked] = await checkAuth();
	});
</script>

<div>
	<Header />

	{#if isWalletUnlocked}
		<br />
		<h1 class="text-5xl mt-5 mb-2 text-left">Settings</h1>

		<!-- <br />
	<div class="justify-center">
		<ChangePassword />
	</div>
	<br /> -->

		<!-- <br />
	<div class="justify-center">
		<div
			class="block rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:text-white p-5 w-auto h-auto hover:bg-slate-200 active:bg-slate-500"
		>
			<a href="/settings" class="text-xl text-center"> Change Network </a>
		</div>
	</div>
	<br /> -->

		<!-- <br />
	<div class="justify-center">
		<div
			class="block rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:text-white p-5 w-auto h-auto hover:bg-slate-200 active:bg-slate-500"
		>
			<a href="/settings" class="text-xl text-center"> Auto Lock </a>
		</div>
	</div> 
	<br /> -->
		<!-- Show Seed Phase -->
		<br />
		<div class="justify-center">
			<a href="/settings/show-secret-key" class="text-xl text-center">
				<div
					class="block rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:text-white p-5 h-auto hover:bg-slate-200 active:bg-slate-500"
				>
					Show Seed Phase
				</div>
			</a>
		</div>
		<br />
		<!-- Lock wallet -->
		<div class="justify-center">
			<LockWallet bind:isWalletUnlocked />
		</div>
		<br />
		<!-- Log out -->
		<div class="justify-center">
			<Logout />
		</div>
		<br />
	{:else}
		<div class=" h-[40vh] w-full p-5 flex flex-col items-center justify-evenly">
			<h1 class="text-3xl dark:text-yellow-200">Unlock the wallet</h1>
			<a href="/wallet" class="btn">Unlock</a>
		</div>
	{/if}
	<!-- Reset Secret Key -->
	<!-- <br />
	<div class="justify-center mb-10">
		<div
			class="block rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:text-white p-5 w-auto h-auto hover:bg-slate-200 active:bg-slate-500"
		>
			<a href="/settings" class="text-xl text-center"> Reset Secret Key </a>
		</div>
	</div>
	<br /> -->
</div>
