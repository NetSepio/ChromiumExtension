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
				<li class="hover:bg-gray-600 active:bg-gray-700 hover:text-gray-200 rounded-lg">
					{#if isUserAuthenticated}
						<a href="/wallet">Wallet</a>
					{:else}
						<a href="/Onboarding">Wallet</a>
					{/if}
				</li>
				<li tabIndex={0}>
					<button class="hover:bg-gray-600 active:bg-gray-700 hover:text-gray-200">
						<svg width="15px" height="15px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path
								fill="#000 dark:#fff"
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM7 12C7 11.4477 7.44772 11 8 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H8C7.44772 13 7 12.5523 7 12ZM13 18C13 17.4477 13.4477 17 14 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H14C13.4477 19 13 18.5523 13 18Z"
							/>
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
