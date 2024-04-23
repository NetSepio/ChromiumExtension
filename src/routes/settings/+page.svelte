<!-- Settings page -->

<script lang="ts">
	// Importing necessary modules and components
	import Header from '$lib/components/Header.svelte';
	import Logout from '$lib/components/Logout.svelte';
	import { onMount } from 'svelte';
	import { checkAuth } from '$lib/modules/secondAuth';
	import LockWallet from '$lib/components/LockWallet.svelte';
	// Importing necessary store variables
	import {
		mnemonicPhrase,
		setJwtToken,
		walletAddress,
		onboardingStepsLeft,
		avatar
	} from '$lib/store/store';
	// Component state variables
	let captcha = false;
	let value = '';

	// Variable to track whether the wallet is unlocked
	let isWalletUnlocked = false;
	let showModal = false;

	// Function to navigate to the sign-in page
	const navigateToSignIn = () => {
		if (typeof window !== 'undefined') {
			window.location.href = '/signIn';
		}
	};

	// Function to handle the logout/reset action
	const handleLogout = async () => {
		// Clearing sensitive data and resetting states
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

	// Lifecycle hook - runs after the component is mounted
	onMount(async () => {
		// Checking if the wallet is unlocked
		[isWalletUnlocked] = await checkAuth();

		// If the wallet is not unlocked, navigate to sign-in page
		if (isWalletUnlocked === false) {
			navigateToSignIn();
		}
	});
</script>

<!-- Component HTML structure -->
<div class="h-full flex-col flex w-full">
	<!-- Including the Header component -->
	<Header />

	<!-- Conditional rendering based on whether the wallet is unlocked -->
	<div class="w-[80%] mx-auto items-center flex-grow flex flex-col mt-[10%]">
		{#if isWalletUnlocked}
			<!-- Section for displaying settings -->
			{#if !showModal}
				<a class="self-start" href="/">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						class="fill-[#222944] dark:fill-[#11D9C5]"
					>
						<path
							d="M16.6185 2.99028C16.5024 2.87387 16.3645 2.78152 16.2126 2.7185C16.0608 2.65548 15.898 2.62305 15.7335 2.62305C15.5691 2.62305 15.4063 2.65548 15.2545 2.7185C15.1026 2.78152 14.9647 2.87387 14.8485 2.99028L6.53854 11.3003C6.44583 11.3928 6.37229 11.5027 6.32211 11.6237C6.27192 11.7446 6.24609 11.8743 6.24609 12.0053C6.24609 12.1362 6.27192 12.2659 6.32211 12.3869C6.37229 12.5079 6.44583 12.6178 6.53854 12.7103L14.8485 21.0203C15.3385 21.5103 16.1285 21.5103 16.6185 21.0203C17.1085 20.5303 17.1085 19.7403 16.6185 19.2503L9.37854 12.0003L16.6285 4.75028C17.1085 4.27028 17.1085 3.47028 16.6185 2.99028Z"
						/>
					</svg>
				</a>
			{:else}
				<button on:click={() => (showModal = false)} class="self-start">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						class="fill-[#222944] dark:fill-[#11D9C5]"
					>
						<path
							d="M16.6185 2.99028C16.5024 2.87387 16.3645 2.78152 16.2126 2.7185C16.0608 2.65548 15.898 2.62305 15.7335 2.62305C15.5691 2.62305 15.4063 2.65548 15.2545 2.7185C15.1026 2.78152 14.9647 2.87387 14.8485 2.99028L6.53854 11.3003C6.44583 11.3928 6.37229 11.5027 6.32211 11.6237C6.27192 11.7446 6.24609 11.8743 6.24609 12.0053C6.24609 12.1362 6.27192 12.2659 6.32211 12.3869C6.37229 12.5079 6.44583 12.6178 6.53854 12.7103L14.8485 21.0203C15.3385 21.5103 16.1285 21.5103 16.6185 21.0203C17.1085 20.5303 17.1085 19.7403 16.6185 19.2503L9.37854 12.0003L16.6285 4.75028C17.1085 4.27028 17.1085 3.47028 16.6185 2.99028Z"
						/>
					</svg>
				</button>
			{/if}

			<!-- Heading for settings -->
			{#if !showModal}
				<h1 class="text-3xl w-[80%] mx-auto my-[12%] semiBold">Settings</h1>

				<br />

				<!-- Section for navigation to show secret key page -->
				<div class="w-[90%] mx-auto justify-center">
					<a href="/settings/show-secret-key" class="text-sm capitalize">
						<!-- Button to show seed phrase -->
						<button
							class="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#222944] dark:text-white w-full h-auto hover:bg-slate-200 hover:text-black active:bg-slate-500 shadow-md dark:shadow-none"
						>
							<svg
								width="37"
								height="37"
								viewBox="0 0 37 37"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								class="fill-[#263238] object-cover relative top-[3px] dark:fill-[#11D9C5]"
							>
								<path
									d="M18.2891 11.6836L17.8332 13.5086C18.3491 13.6369 19.9407 14.1619 20.1982 13.1286C20.4666 12.0528 18.8041 11.8128 18.2891 11.6836ZM17.6041 14.4303L17.1016 16.4428C17.7207 16.5969 19.6324 17.2103 19.9149 16.0753C20.2107 14.8903 18.2241 14.5844 17.6041 14.4303Z"
								/>
								<g filter="url(#filter0_d_6771_6544)">
									<path
										d="M20.3454 6.24921C15.8812 5.13671 11.362 7.85337 10.2495 12.3175C9.13621 16.78 11.8529 21.3009 16.3137 22.4142C20.7779 23.5267 25.2995 20.8109 26.4112 16.3467C27.5245 11.8834 24.8079 7.36254 20.3454 6.24921ZM22.0045 13.145C21.8837 13.9567 21.4329 14.3492 20.8362 14.4875C21.657 14.9142 22.0737 15.5692 21.677 16.705C21.1837 18.1142 20.012 18.2334 18.452 17.9384L18.0737 19.455L17.1604 19.2275L17.5329 17.7325C17.2892 17.6717 17.0461 17.6083 16.8037 17.5425L16.4295 19.0459L15.517 18.8167L15.8954 17.2975C15.6812 17.2425 15.4645 17.1842 15.2437 17.1292L14.0529 16.8334L14.5079 15.7867C14.5079 15.7867 15.1812 15.9659 15.172 15.9525C15.4312 16.0167 15.5454 15.8484 15.5904 15.735L16.1895 13.3392L16.2854 13.3634C16.2545 13.3509 16.2227 13.3406 16.1904 13.3325L16.617 11.6217C16.6279 11.4267 16.562 11.1817 16.1912 11.0892C16.2062 11.08 15.527 10.9242 15.527 10.9242L15.7695 9.94754L17.0312 10.2625L17.0304 10.2667C17.2195 10.3142 17.4145 10.3592 17.6137 10.4042L17.9879 8.90254L18.902 9.13004L18.5354 10.6017C18.7804 10.6575 19.0279 10.7142 19.2679 10.7742L19.6329 9.31171L20.547 9.53921L20.1729 11.0409C21.3262 11.44 22.1695 12.0367 22.0045 13.145Z"
									/>
								</g>
								<defs>
									<filter
										id="filter0_d_6771_6544"
										x="0"
										y="0"
										width="36.6602"
										height="36.6641"
										filterUnits="userSpaceOnUse"
										color-interpolation-filters="sRGB"
									>
										<feFlood flood-opacity="0" result="BackgroundImageFix" />
										<feColorMatrix
											in="SourceAlpha"
											type="matrix"
											values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
											result="hardAlpha"
										/>
										<feOffset dy="4" />
										<feGaussianBlur stdDeviation="5" />
										<feComposite in2="hardAlpha" operator="out" />
										<feColorMatrix
											type="matrix"
											values="0 0 0 0 0.0666667 0 0 0 0 0.85098 0 0 0 0 0.772549 0 0 0 0.1 0"
										/>
										<feBlend
											mode="normal"
											in2="BackgroundImageFix"
											result="effect1_dropShadow_6771_6544"
										/>
										<feBlend
											mode="normal"
											in="SourceGraphic"
											in2="effect1_dropShadow_6771_6544"
											result="shape"
										/>
									</filter>
								</defs>
							</svg>

							<span class="font-medium">Show Seed Phrase</span>
						</button>
					</a>
				</div>

				<br />

				<!-- Section to lock the wallet -->
				<div class="w-[90%] mx-auto justify-center">
					<LockWallet />
				</div>
				<!-- Button to trigger the password reset confirmation -->
				<button
					on:click={() => (showModal = true)}
					class={`primary-button w-[90%] mt-[15%] mx-auto`}
				>
					Reset Wallet
				</button>
			{:else}
				<br />
				<!-- Section to log out -->
				<!-- Modal for password reset confirmation -->
				<div class="dark:bg-[#171C2F] w-[100%] flex flex-col mx-auto dark:text-white">
					<!-- Text prompting the user to enter 'reset' -->
					<h1 class="text-3xl mx-auto mt-[25%] mb-[20%] semiBold">Reset Your wallet</h1>

					<p class="text-sm mt-5 mb-[10%] self-start text-center">Enter 'Reset'</p>

					<!-- Input field for the user to enter 'reset' -->
					<input
						type="text"
						placeholder="Reset"
						class="secondary-input mb-[15%] w-full self-start"
						bind:value
						on:input={() => {
							if (value == 'Reset') {
								captcha = true;
							}
						}}
					/>

					<!-- Conditional rendering based on the captcha state -->
					{#if captcha}
						<!-- Modal action buttons when captcha is true -->
						<a href="/">
							<button class="w-full primary-button" on:click={handleLogout}> Reset </button>
						</a>
					{:else}
						<!-- Modal action button when captcha is false -->
						<button class="w-full disabled:opacity-30 primary-button" disabled> Reset </button>
					{/if}
				</div>

				<br />
			{/if}
		{/if}
	</div>
</div>
