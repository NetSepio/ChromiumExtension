<script>
	import {
		jwtToken,
		mnemonicPhase,
		setJwtToken,
		walletAddress,
		onboardingStepsLeft
	} from '$lib/store/store';

	let showModal = false;
	let captcha = false;
	let value = '';

	const handleLogout = async () => {
		await mnemonicPhase.remove();
		setJwtToken('');
		walletAddress.set('');
		onboardingStepsLeft.set(3);
		localStorage.removeItem('encryptedMnemonic');
		localStorage.removeItem('iv');
		localStorage.removeItem('mnemonicHash');
		showModal = false;
	};
</script>

<div>
	<button
		on:click={() => (showModal = true)}
		class="block rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:text-white p-5 w-full h-auto hover:bg-slate-200 active:bg-slate-500 text-xl text-center"
	>
		Logout
	</button>
	<div class="modal modal-bottom sm:modal-middle" class:modal-open={showModal}>
		<div class="modal-box dark:bg-gray-900 dark:text-white">
			<button
				class="btn btn-sm btn-circle absolute right-2 top-2"
				on:click={() => {
					showModal = false;
				}}
			>
				✕
			</button>
			<!-- Old Password -->
			<p class="text-md mt-5 mb-3">Enter 'logout'</p>
			<input
				type="text"
				placeholder="Old Password"
				class="input input-bordered dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs"
				bind:value
				on:change={() => {
					if (value == 'logout') {
						captcha = true;
					}
				}}
			/>
			{#if captcha}
				<div class="modal-action">
					<button class="btn" on:click={handleLogout}> Logout </button>
				</div>
			{:else}
				<div class="modal-action">
					<button class="btn" disabled> Logout </button>
				</div>
			{/if}
		</div>
	</div>
</div>
