<script>
	import Header from '$lib/components/Header.svelte';
	import ChangePassword from '$lib/components/ChangePassword.svelte';
	import Logout from '$lib/components/Logout.svelte';
	import { onMount } from 'svelte';
	import { checkAuth } from '$lib/modules/secondAuth';

	let isWalletUnlocked = false;

	onMount(async () => {
		[, isWalletUnlocked] = await checkAuth();
	});
</script>

<div class="artboard phone-3 p-5 mb-5 pb-5">
	<Header />

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
	<!-- Show Secret Key -->
	<br />
	<div class="justify-center">
		<a href="/settings/show-secret-key" class="text-xl text-center">
			<div
				class="block rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:text-white p-5 h-auto hover:bg-slate-200 active:bg-slate-500"
			>
				Show Secret Key
			</div>
		</a>
	</div>
	<br />
	<!-- Log out -->
	<br />
	{#if isWalletUnlocked}
		<div class="justify-center">
			<Logout />
		</div>
		<br />
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
