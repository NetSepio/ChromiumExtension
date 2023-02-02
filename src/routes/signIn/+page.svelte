<script>
	import { onMount } from 'svelte';
	import { authenticateUser } from '$lib/modules/secondAuth';

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

	onMount(() => {
		localStorage.removeItem('jwtToken');
	});
</script>

<div class="artboard phone-1 p-5 bg-white dark:text-white dark:bg-gray-900">
	{#if modal == false}
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
		<div class="modal-box dark:text-white dark:bg-gray-800">
			<h3 class="font-bold text-lg">Congratulations!</h3>
			<p class="py-4">Click below to go to home page</p>
			<div class="modal-action">
				<label for="my-modal" class="btn"><a href="/">Home</a></label>
			</div>
		</div>
	{/if}
</div>
