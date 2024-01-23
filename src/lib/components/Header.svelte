<!-- Header component -->

<script lang="ts">
	// Importing Svelte components and functions
	import DarkMode from '$lib/components/DarkMode.svelte';
	import { checkAuth } from '$lib/modules/secondAuth';
	import { onMount } from 'svelte';
	import Logo from './Logo.svelte';

	// Variable to store user authentication status
	let isUserAuthenticated: boolean;

	// OnMount lifecycle hook to check user authentication status
	onMount(async () => {
		[isUserAuthenticated] = await checkAuth();
	});
</script>

<div>
	<!-- Navigation bar -->
	<div
		class="navbar bg-white dark:bg-[#222944] rounded-lg shadow-md px-2 py-4 dark:shadow-white/5 gap-12"
	>
		<!-- Logo section -->
		<div class="flex-1">
			<Logo />
		</div>

		<!-- Navigation links and DarkMode component section -->
		<div class="flex-none">
			<ul class="menu menu-horizontal px-1 z-10">
				<!-- Button with dropdown menu -->
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

					<!-- Dropdown menu -->
					<ul class="py-2 bg-white dark:bg-[#222944] -left-10">
						{#if isUserAuthenticated == false}
							<!-- Navigation links for unauthenticated users -->
							<li>
								<a href="/Onboarding" class="nav-link">Setup Wallet</a>
							</li>
							<li>
								<a href="/profile" class="nav-link"> Profile </a>
							</li>
							<li>
								<a href="/feedback" class="nav-link"> Help & Feedback </a>
							</li>
						{:else}
							<!-- Navigation links for authenticated users -->
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
				<!-- DarkMode component -->
				<li>
					<DarkMode />
				</li>
			</ul>
		</div>
	</div>
</div>
