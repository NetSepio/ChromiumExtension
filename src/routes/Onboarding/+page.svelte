<!-- Onboarding page *** -->
<script lang="ts">
	// Importing necessary modules and components
	import Header from '$lib/components/Header.svelte';
	import { onboardingStepsLeft } from '$lib/store/store';
	import { onMount } from 'svelte';

	// Component's variables
	let selectedLanguage = '';
	let dropdownOpen = false;
	let stepsLeft: number;

	// Function to toggle the dropdown
	function toggleDropdown() {
		dropdownOpen = !dropdownOpen;
	}

	// On component mount, subscribe to onboardingStepsLeft store
	onMount(() => {
		onboardingStepsLeft.subscribe((u: number) => (stepsLeft = u));
	});
</script>

<!-- Component HTML structure -->
<div>
	<!-- Including the Header component -->
	<Header />

	<!-- Displaying onboarding options when steps are not completed -->
	<div class="mt-28">
		<div class="mx-auto">
			<h1 class="text-2xl semiBold text-center">Welcome to Netsepio</h1>
		</div>
		<div class="mt-[20%] w-[80%] mx-auto flex flex-col justify-center space-y-5 items-center">
			<!-- Link to create a new wallet -->
			<a
				href="/Onboarding/get-secret-key"
				onclick={() => onboardingStepsLeft.set(2)}
				class="w-full"
			>
				<button class="primary-button">New Wallet</button>
			</a>
			<div class="divider w-[80%] mx-auto divider-white"></div>
			<!-- Link to import an existing wallet -->
			<a
				href="/Onboarding/import-old-wallet"
				onclick={() => onboardingStepsLeft.set(2)}
				class="w-full"
			>
				<button class="primary-button">Import Wallet</button>
			</a>
		</div>
	</div>
</div>
