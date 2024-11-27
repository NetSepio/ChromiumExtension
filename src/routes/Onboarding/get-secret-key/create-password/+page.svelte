<!-- Create Password Page -->

<script lang="ts">
	// Importing necessary modules and components
	import { askFlowId, sendSignature, signWithKey } from '$lib/modules/functionsForLogin';
	import Header from '$lib/components/Header.svelte';
	import { encryptAndStorePassword } from '$lib/modules/secondAuth';
	import { darktheme, jwtToken, onboardingStepsLeft, walletAddress } from '$lib/store/store';
	import { checkChainType, setData } from '$lib/utils';
	import { onMount } from 'svelte';

	// Type definitions for payload and flowId response
	interface payloadType {
		eula: string;
		flowId: string;
	}

	interface flowIdResponseType {
		status: number;
		message: string;
		payload: payloadType;
	}

	// State variables
	let newPassword = '';
	let confirmPassword = '';
	let error = '';
	let loginResponse;
	let showModal = false;
	let termsAndConditions = true;
	let data: flowIdResponseType;
	let showPass = false;
	let showPass2 = false;
	let chainName: string;
	let chainType: string | undefined;

	let address = '';
	walletAddress.subscribe((val: string) => (address = val));

	let showSecondModal = false;
	let darkMode = false; // Initial dark mode state

	// Load selected provider from localStorage (if any)
	function loadProviderFromLocalStorage() {
		const storedProvider = localStorage.getItem('selectedProvider');
		if (storedProvider) {
			chainName = storedProvider;
			chainType = checkChainType(storedProvider);
		}
	}

	darktheme.subscribe((data) => (darkMode = data));
	// Function to fetch data, sign with key, and handle login
	async function fetchData() {
		try {
			await signWithKey(data.payload);
			loginResponse = await sendSignature(data.payload.flowId, address);

			await encryptAndStorePassword(newPassword);
			jwtToken.set(loginResponse.payload.token);
			localStorage.setItem('jwtToken', loginResponse.payload.token);
			setData('unlocked', 'true', 60);

			if (loginResponse.status === 200) {
				showModal = true;
			}
		} catch (err) {
			error = `Something went wrong`;
			console.error(error);
		}
	}

	// Handle form submission
	const handleSubmit = async () => {
		if (
			newPassword === confirmPassword &&
			newPassword !== '' &&
			newPassword.length >= 6 &&
			termsAndConditions
		) {
			error = '';
			showModal = true;
		} else if (newPassword.length < 6) {
			error = 'Password has to be at least 6 characters long';
		} else if (!termsAndConditions) {
			error = 'You need to accept the terms and conditions';
		} else {
			error = 'Passwords are not matching';
		}
		data = await askFlowId();
	};

	// Handle save after signing
	const handleSave = async () => {
		await fetchData();
		if (error.length < 1) {
			onboardingStepsLeft.set(0);
		}
		showSecondModal = true;
	};

	// Load stored provider when component mounts
	onMount(() => {
		loadProviderFromLocalStorage();
	});
</script>

<div class="flex h-full flex-col">
	<!-- Header component -->
	<Header />
	{#if !showModal && !showSecondModal}
		<div class="mt-8 w-[85%] flex flex-col mx-auto">
			<!-- Back button -->
			<a href="/Onboarding/get-secret-key">
				<!-- SVG icon for the back button -->
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="fill-[#263238] dark:fill-[#11D9C5]"
				>
					<path
						d="M16.6185 2.99028C16.5024 2.87387 16.3645 2.78152 16.2126 2.7185C16.0608 2.65548 15.898 2.62305 15.7335 2.62305C15.5691 2.62305 15.4063 2.65548 15.2545 2.7185C15.1026 2.78152 14.9647 2.87387 14.8485 2.99028L6.53854 11.3003C6.44583 11.3928 6.37229 11.5027 6.32211 11.6237C6.27192 11.7446 6.24609 11.8743 6.24609 12.0053C6.24609 12.1362 6.27192 12.2659 6.32211 12.3869C6.37229 12.5079 6.44583 12.6178 6.53854 12.7103L14.8485 21.0203C15.3385 21.5103 16.1285 21.5103 16.6185 21.0203C17.1085 20.5303 17.1085 19.7403 16.6185 19.2503L9.37854 12.0003L16.6285 4.75028C17.1085 4.27028 17.1085 3.47028 16.6185 2.99028Z"
					/>
				</svg>
			</a>

			<!-- Title and error message -->
			<h1 class="text-[25px] font-bold text-center mt-6 mb-2">Create Your Password</h1>
			<p class={`text-xs text-center mb-14 ${error !== '' ? 'text-red-500' : ''}`}>
				{error !== '' ? error : 'You will use this to unlock your wallet'}
			</p>

			<!-- New Password input -->
			<div class="w-[90%] self-end">
				<label for="password" class="text-sm text-left font-medium mt-3 mb-1">New Password</label>
				<div class="relative mt-2 flex items-center">
					{#if showPass}
						<input
							name="confirmPassword"
							type="text"
							class="border-opacity-30 bg-none secondary-input w-full"
							bind:value={newPassword}
						/>
					{:else}
						<input
							name="confirmPassword"
							type="password"
							class="border-opacity-30 bg-none secondary-input w-full"
							bind:value={newPassword}
						/>
					{/if}
					<button on:click={() => (showPass = !showPass)} class="absolute mb-1 right-2">
						<img
							class="w-[16px] h-[16px]"
							src="/eye_{showPass ? 'open' : 'close'}_{darkMode ? 'dark' : 'light'}.png"
							alt=""
						/>
					</button>
				</div>
			</div>
			<br />

			<!-- Confirm Password input -->
			<div class="w-[90%] self-end">
				<label for="confirmPassword" class="text-sm text-left font-medium mt-3 mb-1"
					>Confirm Password</label
				>
				<div class="relative mt-2 flex items-center">
					{#if showPass2}
						<input
							name="confirmPassword"
							type="text"
							class="border-opacity-30 bg-none secondary-input w-full"
							bind:value={confirmPassword}
						/>
					{:else}
						<input
							name="confirmPassword"
							type="password"
							class="border-opacity-30 bg-none secondary-input w-full"
							bind:value={confirmPassword}
						/>
					{/if}
					<button on:click={() => (showPass2 = !showPass2)} class="absolute mb-1 right-2">
						<img
							class="w-[16px] h-[16px]"
							src="/eye_{showPass2 ? 'open' : 'close'}_{darkMode ? 'dark' : 'light'}.png"
							alt=""
						/>
					</button>
				</div>
			</div>

			<!-- Terms and Conditions checkbox -->
			<div class="form-control mt-16 mb-8">
				<label class="label justify-start space-x-4 self-center cursor-pointer">
					<input
						type="checkbox"
						class="checkbox w-4 h-4 bg-none
						 rounded checkbox-accent"
						checked={termsAndConditions}
						on:change={() => (termsAndConditions = !termsAndConditions)}
					/>
					<span class="text-xs dark:text-white">
						I agree to the
						<span class="text-secondary text-xs dark:text-[#11D9C5]">Terms of Service</span>
					</span>
				</label>
			</div>

			<!-- Create Password button with conditional disabled state -->
			{#if termsAndConditions}
				<button on:click={handleSubmit} class="primary-button">create password</button>
			{:else}
				<button disabled class="disabled:opacity-30 primary-button">create password</button>
			{/if}
		</div>
	{/if}
	{#if !showSecondModal && showModal}
		<!-- First Modal for signing -->
		<div
			class=" rounded-[10px] shadow-sm shadow-secondary dark:shadow-none flex flex-col justify-center space-y-5 self-center my-auto dark:bg-[#222944] w-[285px] h-[291px] dark:text-white"
		>
			<h1 class="text-2xl font-semibold text-center capitalize mb-2">You are signing!</h1>
			<br />

			<!-- Display EULA message -->
			{#if data?.payload?.eula}
				<p class="text-xs text-center w-[80%] mx-auto dark:text-green-100">
					`${data?.payload?.eula}`
				</p>
			{:else}
				<p class="text-xs text-center w-[80%] mx-auto capitalize dark:text-green-100">
					waiting for message
				</p>
			{/if}

			<br />

			<!-- Buttons for cancelling or signing -->
			<div class="flex w-full justify-center items-center gap-2 mt-8">
				<button class=" w-[120px] secondary-button" on:click={() => (showModal = false)}>
					Cancel
				</button>
				<button
					disabled={!data?.payload?.eula}
					class=" w-[120px] primary-button"
					on:click={handleSave}
				>
					Sign
				</button>
			</div>
		</div>
	{/if}
	{#if showSecondModal}
		<!-- Second Modal for success or error message -->
		<div
			class=" rounded-[10px] flex flex-col shadow-sm shadow-secondary dark:shadow-none justify-center self-center my-auto dark:bg-[#222944] w-[285px] h-[291px] dark:text-white"
		>
			<!-- Display error message if present -->
			{#if error.length < 0}
				<h1 class="text-xl semiBold text-center mb-2">Unable to sign-in ☹️!</h1>
				<br />
				<p class="text-sm text-center text-red-500">
					{error}
				</p>
				<br />

				<!-- Buttons for trying later or retrying -->
				<div class="flex mx-auto w-max gap-3 mt-2">
					<a href="/" class=" w-[120px] flex justify-center items-center secondary-button">
						Try later
					</a>
					<button
						class=" w-[120px] primary-button"
						on:click={() => {
							showModal = false;
							showSecondModal = false;
						}}
					>
						Retry
					</button>
				</div>
			{:else}
				<!-- Display success message and button to go to homepage -->
				<div class="flex justify-center items-center">
					<h1 class="text-2xl semiBold text-center">Congrats</h1>
					<svg
						width="68"
						height="66"
						viewBox="0 0 68 66"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						class="fill-[#263238] dark:fill-[#11D9C5]"
					>
						<!-- SVG path for checkmark -->
						<g filter="url(#filter0_d_6892_6947)">
							<path
								d="M12.6233 46.6667L20.4879 24.7917C20.6615 24.3403 20.9309 23.9931 21.2962 23.75C21.6615 23.5069 22.0518 23.3854 22.4671 23.3854C22.7448 23.3854 23.0053 23.4375 23.2483 23.5417C23.4914 23.6458 23.7171 23.8021 23.9254 24.0104L37.9879 38.0729C38.1962 38.2812 38.3525 38.5069 38.4566 38.75C38.5608 38.9931 38.6129 39.2535 38.6129 39.5312C38.6129 39.9479 38.4914 40.3389 38.2483 40.7042C38.0052 41.0694 37.658 41.3382 37.2066 41.5104L15.3316 49.375C14.915 49.5486 14.5157 49.575 14.1337 49.4542C13.7518 49.3333 13.4219 49.1333 13.1441 48.8542C12.8664 48.5764 12.6664 48.2465 12.5441 47.8646C12.4219 47.4826 12.4483 47.0833 12.6233 46.6667ZM54.9671 19.6354C54.6546 19.9479 54.29 20.1042 53.8733 20.1042C53.4566 20.1042 53.0921 19.9479 52.7796 19.6354L52.6233 19.4792C52.1372 18.9931 51.5296 18.75 50.8004 18.75C50.0712 18.75 49.4636 18.9931 48.9775 19.4792L38.4046 30.0521C38.0921 30.3646 37.7275 30.5208 37.3108 30.5208C36.8941 30.5208 36.5296 30.3646 36.2171 30.0521C35.9046 29.7396 35.7483 29.375 35.7483 28.9583C35.7483 28.5417 35.9046 28.1771 36.2171 27.8646L46.79 17.2917C47.9011 16.1806 49.2379 15.625 50.8004 15.625C52.3629 15.625 53.6997 16.1806 54.8108 17.2917L54.9671 17.4479C55.2796 17.7604 55.4358 18.125 55.4358 18.5417C55.4358 18.9583 55.2796 19.3229 54.9671 19.6354ZM27.7796 13.3854C28.0921 13.0729 28.4566 12.9167 28.8733 12.9167C29.29 12.9167 29.6546 13.0729 29.9671 13.3854L30.2275 13.6458C31.3386 14.7569 31.8941 16.0764 31.8941 17.6042C31.8941 19.1319 31.3386 20.4514 30.2275 21.5625L30.0712 21.7187C29.7587 22.0312 29.3941 22.1875 28.9775 22.1875C28.5608 22.1875 28.1962 22.0312 27.8837 21.7187C27.5712 21.4062 27.415 21.0417 27.415 20.625C27.415 20.2083 27.5712 19.8438 27.8837 19.5312L28.04 19.375C28.5261 18.8889 28.7691 18.2986 28.7691 17.6042C28.7691 16.9097 28.5261 16.3194 28.04 15.8333L27.7796 15.5729C27.4671 15.2604 27.3108 14.8958 27.3108 14.4792C27.3108 14.0625 27.4671 13.6979 27.7796 13.3854ZM36.2171 9.21875C36.5296 8.90625 36.8941 8.75 37.3108 8.75C37.7275 8.75 38.0921 8.90625 38.4046 9.21875L40.6441 11.4583C41.7552 12.5694 42.3108 13.9062 42.3108 15.4688C42.3108 17.0312 41.7552 18.3681 40.6441 19.4792L34.2379 25.8854C33.9254 26.1979 33.5608 26.3542 33.1441 26.3542C32.7275 26.3542 32.3629 26.1979 32.0504 25.8854C31.7379 25.5729 31.5816 25.2083 31.5816 24.7917C31.5816 24.375 31.7379 24.0104 32.0504 23.6979L38.4566 17.2917C38.9427 16.8056 39.1858 16.1979 39.1858 15.4688C39.1858 14.7396 38.9427 14.1319 38.4566 13.6458L36.2171 11.4062C35.9046 11.0938 35.7483 10.7292 35.7483 10.3125C35.7483 9.89583 35.9046 9.53125 36.2171 9.21875ZM52.8837 34.2187C52.5712 34.5312 52.2066 34.6875 51.79 34.6875C51.3733 34.6875 51.0087 34.5312 50.6962 34.2187L48.4566 31.9792C47.9705 31.4931 47.3629 31.25 46.6337 31.25C45.9046 31.25 45.2969 31.4931 44.8108 31.9792L42.5712 34.2187C42.2587 34.5312 41.8941 34.6875 41.4775 34.6875C41.0608 34.6875 40.6962 34.5312 40.3837 34.2187C40.0712 33.9062 39.915 33.5417 39.915 33.125C39.915 32.7083 40.0712 32.3438 40.3837 32.0312L42.6233 29.7917C43.7344 28.6806 45.0712 28.125 46.6337 28.125C48.1962 28.125 49.533 28.6806 50.6441 29.7917L52.8837 32.0312C53.1962 32.3438 53.3525 32.7083 53.3525 33.125C53.3525 33.5417 53.1962 33.9062 52.8837 34.2187Z"
							/>
						</g>
						<defs>
							<filter
								id="filter0_d_6892_6947"
								x="0.46875"
								y="0.75"
								width="66.9688"
								height="64.7793"
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
								<feGaussianBlur stdDeviation="6" />
								<feComposite in2="hardAlpha" operator="out" />
								<feColorMatrix
									type="matrix"
									values="0 0 0 0 0.0666667 0 0 0 0 0.85098 0 0 0 0 0.772549 0 0 0 0.2 0"
								/>
								<feBlend
									mode="normal"
									in2="BackgroundImageFix"
									result="effect1_dropShadow_6892_6947"
								/>
								<feBlend
									mode="normal"
									in="SourceGraphic"
									in2="effect1_dropShadow_6892_6947"
									result="shape"
								/>
							</filter>
						</defs>
					</svg>
				</div>
				<br />
				<p class="text-xs w-[60%] mx-auto text-center text-black dark:text-white">
					You are all set! explore your dashboard for more info
				</p>
				<br />

				<!-- Button to go to homepage -->
				<div class="flex w-full mt-2">
					<button class="w-[80%] primary-button mx-auto capitalize">
						<a href="/"> go to Dashboard </a>
					</button>
				</div>
			{/if}
		</div>
	{/if}
</div>
