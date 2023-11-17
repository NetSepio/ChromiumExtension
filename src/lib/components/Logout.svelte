<script lang="ts">
	import {
		mnemonicPhrase,
		setJwtToken,
		walletAddress,
		onboardingStepsLeft,
		avatar
	} from '$lib/store/store';

	let showModal = false;
	let captcha = false;
	let value = '';

	const handleLogout = async () => {
		await mnemonicPhrase.remove();
		setJwtToken('');
		walletAddress.set('');
		onboardingStepsLeft.set(3);
		localStorage.removeItem('encryptedMnemonic');
		localStorage.removeItem('iv');
		localStorage.removeItem('mnemonicHash');
		avatar.set('');
		showModal = false;
	};
</script>

<div>
	<button
		on:click={() => (showModal = true)}
		class="block rounded-lg shadow-lg bg-red-500 dark:bg-red-500 text-white p-5 w-full h-auto hover:bg-slate-600 active:bg-slate-500 text-xl text-center"
	>
		Reset Wallet
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
			<p class="text-md mt-5 mb-3 text-center">Enter 'reset'</p>
			<input
				type="text"
				placeholder="reset"
				class="input input-bordered dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs"
				bind:value
				on:change={() => {
					if (value == 'reset') {
						captcha = true;
					}
				}}
			/>
			{#if captcha}
				<div class="modal-action">
					<a href="/">
						<button class="btn" on:click={handleLogout}> Reset </button>
					</a>
				</div>
			{:else}
				<div class="modal-action">
					<button class="btn" disabled> Reset </button>
				</div>
			{/if}
		</div>
	</div>
</div>
