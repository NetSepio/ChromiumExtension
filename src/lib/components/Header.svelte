<script lang="ts">
	import DarkMode from '$lib/components/DarkMode.svelte';
	import { checkAuth } from '$lib/modules/secondAuth';
	import { onMount } from 'svelte';
	let isUserAuthenticated: boolean;
	import { mnemonicPhase } from '$lib/store/store';

	async function handleRemoveMnemonic() {
		const result = await mnemonicPhase.remove();
		if (result == true) {
			console.log('Mnemonic phase removed successfully');
		} else {
			console.error('Error removing mnemonic phase');
		}
	}

	onMount(async () => {
		isUserAuthenticated = await checkAuth();
		console.log(`user authenticated in the header is ${isUserAuthenticated}`);
	});
</script>

<div>
	<div class="navbar rounded-lg shadow-lg shadow-gray-500/50 p-5 dark:shadow-green-300/50">
		<div class="flex-1">
			<a class="normal-case text-xl" href="/"> Netsepio </a>
		</div>
		<div class="flex-none">
			<ul class="menu menu-horizontal px-1 z-10">
				<li class="hover:bg-gray-600 active:bg-gray-700 hover:text-gray-200 rounded-lg">
					{#if isUserAuthenticated}
						<a href="/wallet" on:click={handleRemoveMnemonic}>Wallet</a>
					{:else}
						<a href="/Onboarding" on:click={handleRemoveMnemonic}>Wallet</a>
					{/if}
				</li>
				<li tabIndex={0}>
					<button class="ml-1 hover:bg-gray-600 active:bg-gray-700 hover:text-gray-200">
						More
						<svg
							class="fill-current"
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
						>
							<path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
						</svg>
					</button>
					<ul class="p-2 bg-white dark:bg-gray-900">
						<li>
							<DarkMode />
						</li>
						{#if isUserAuthenticated == false}
							<li>
								<a
									href="/Onboarding"
									class="hover:bg-gray-600 hover:text-gray-200 active:bg-gray-200">Setup Wallet</a
								>
							</li>
						{:else}
							<li>
								<a href="/profile" class="hover:bg-gray-600 hover:text-gray-200 active:bg-gray-200">
									Profile
								</a>
							</li>
							<li>
								<a
									href="/feedback"
									class="hover:bg-gray-600 hover:text-gray-200 active:bg-gray-200"
								>
									Help & Feedback
								</a>
							</li>
						{/if}
					</ul>
				</li>
			</ul>
		</div>
	</div>
</div>
