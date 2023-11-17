<script lang="ts">
	import DarkMode from '$lib/components/DarkMode.svelte';
	import { checkAuth } from '$lib/modules/secondAuth';
	import { onMount } from 'svelte';
	let isUserAuthenticated: boolean;

	let src = '/logo-3.png';

	onMount(async () => {
		[isUserAuthenticated] = await checkAuth();
	});
</script>

<div>
	<div
		class="navbar rounded-lg shadow-lg shadow-gray-500/50 px-2 py-4 dark:shadow-green-300/80 gap-12"
	>
		<div class="flex-1">
			<img {src} alt="logo" class="w-1/5" />
			<a class="normal-case text-xl" href="/">Netsepio </a>
		</div>
		<div class="flex-none">
			<ul class="menu menu-horizontal px-1 z-10">
				<li class=" hover:bg-gray-600 active:bg-gray-700 hover:text-gray-200 rounded-lg">
					{#if isUserAuthenticated}
						<a class="text-sm" href="/wallet">Wallet</a>
					{:else}
						<a class="text-sm" href="/Onboarding">Wallet</a>
					{/if}
				</li>
				<li tabIndex={0}>
					<button class="text-sm hover:bg-gray-600 active:bg-gray-700 hover:text-gray-200">
						Menu
					</button>
					<ul class="p-2 bg-white dark:bg-gray-900">
						<li>
							<DarkMode />
						</li>
						{#if isUserAuthenticated == false}
							<li>
								<a
									href="/Onboarding"
									class="hover:bg-gray-600 hover:text-gray-200 active:bg-gray-700">Setup Wallet</a
								>
							</li>
						{:else}
							<li>
								<a href="/profile" class="hover:bg-gray-600 hover:text-gray-200 active:bg-gray-700">
									Profile
								</a>
							</li>
							<li>
								<a
									href="/settings"
									class="hover:bg-gray-600 hover:text-gray-200 active:bg-gray-700"
								>
									Settings
								</a>
							</li>
							<li>
								<a
									href="/feedback"
									class="hover:bg-gray-600 hover:text-gray-200 active:bg-gray-700"
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
