<script>
	import { authenticateUser } from '$lib/modules/secondAuth';
	import Wallet from '$lib/components/Wallet.svelte';

	let password = '';
	let errorMessage = '';
	let modal = false;
	function Authenticator() {
		const authentication = authenticateUser(password);
		return authentication;
	}

	const handleSubmit = () => {
		if (password.length >= 6) {
			const authentication = Authenticator();
			if (authentication) {
				errorMessage = '';
				modal = true;
			}
		} else {
			errorMessage = 'Enter a valid password';
		}
	};
</script>

<div>
	{#if modal == false}
		<br/>
		<h1 class="text-5xl text-left text-black dark:text-white">Wallet is locked!</h1>
		<p class="text-md mt-5 mb-3 dark:text-white dark:bg-gray-900">Enter Password</p>
		<input
			type="password"
			placeholder="Enter Password"
			class="input input-bordered input-md w-full max-w-xs dark:bg-gray-700 dark:text-white"
			bind:value={password}
		/>
		<button class="btn mt-5" on:click={handleSubmit}> Unlock </button>
	{:else}
		<Wallet />
	{/if}
</div>
