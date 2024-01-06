<script lang="ts">
	import { browser } from '$app/environment';
	import DarkMode from '$lib/components/DarkMode.svelte';
	import { checkAuth } from '$lib/modules/secondAuth';
	import { onMount } from 'svelte';
	let src = '/netsepio-logo.png';
	let lightLogo = '/logo-3.png';

	let isUserAuthenticated: boolean;

	let theme = 'dark';

	if (typeof window !== 'undefined' || browser) {
		theme = localStorage.getItem('theme') || 'dark';
	}

	onMount(async () => {
		[isUserAuthenticated] = await checkAuth();
	});
</script>

<div>
	<div
		class="navbar bg-white dark:bg-[#222944] rounded-lg shadow-md px-2 py-4 dark:shadow-white/5 gap-12"
	>
		<div class="flex-1">
			<a href="/">
				{#if theme === 'dark'}
					<img {src} alt="logo" class="w-4/5" />
				{:else}
					<img src={lightLogo} alt="logo" class="w-2/5" />
				{/if}
			</a>
		</div>
		<div class="flex-none">
			<ul class="menu menu-horizontal px-1 z-10">
				<li tabIndex={0}>
					<button class="text-sm hover:bg-gray-600 active:bg-gray-700 hover:text-gray-200">
						<svg
							width="15"
							height="15"
							viewBox="0 0 15 15"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							class=" stroke-black dark:stroke-white"
						>
							<path
								d="M7.5 10.625H11.875M3.125 7.5H11.875M3.125 4.375H11.875"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>

					<ul class="py-2 bg-white dark:bg-[#222944] -left-10">
						{#if isUserAuthenticated == false}
							<li>
								<a href="/Onboarding/import-old-wallet" class="nav-link">Setup Wallet</a>
							</li>
							<li>
								<a href="/profile" class="nav-link"> Profile </a>
							</li>
							<li>
								<a href="/settings" class="nav-link"> Settings </a>
							</li>
							<li>
								<a href="/feedback" class="nav-link"> Help & Feedback </a>
							</li>
						{:else}
							<li>
								<a href="/wallet" class="nav-link">My Wallet</a>
							</li>
							<li>
								<a href="/profile" class="nav-link"> Profile </a>
							</li>
							<li>
								<a href="/settings" class="nav-link"> Settings </a>
							</li>
							<li>
								<a href="/feedback" class="nav-link"> Help & Feedback </a>
							</li>
						{/if}
					</ul>
				</li>
				<li>
					<DarkMode />
				</li>
			</ul>
		</div>
	</div>
</div>
