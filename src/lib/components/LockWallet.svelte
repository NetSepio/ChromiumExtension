<script lang="ts">
	import { mnemonicPhrase } from '$lib/store/store';

	let showModal = false;
	export let isWalletUnlocked: boolean;

	const handleLockWallet = async () => {
		await mnemonicPhrase.remove();
		isWalletUnlocked = false;
		showModal = false;
	};
</script>

<div>
	<button
		on:click={() => (showModal = true)}
		class="block rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:text-white p-5 w-full h-auto hover:bg-slate-200 active:bg-slate-500 text-xl text-center"
	>
		Lock Wallet
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
			<p class="text-xl mt-5 mb-3">Sure want to lock the wallet?</p>
			<div class="modal-action">
				<button
					class="btn"
					on:click={() => {
						showModal = false;
					}}
				>
					Cancel
				</button>
				<button class="btn" on:click={handleLockWallet}> Lock </button>
			</div>
		</div>
	</div>
</div>
