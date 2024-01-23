<!-- Signin Page -->
<script>
	// Importing necessary functions and components
	import { onMount } from 'svelte';
	import { authenticateUser } from '$lib/modules/secondAuth';
	import Header from '$lib/components/Header.svelte';

	// Initializing variables
	let password = '';
	let errorMessage = '';
	let modal = false;

	// Function to authenticate user
	function Authenticator() {
		const authentication = authenticateUser(password);
		return authentication;
	}

	// Handling form submission
	const handleSubmit = () => {
		if (password.length >= 6) {
			const authentication = Authenticator();
			if (authentication) {
				errorMessage = '';
				modal = true;
			}
		} else {
			errorMessage = 'Enter a valid password';
		}
	};

	// Cleanup on component mount
	onMount(() => {
		localStorage.removeItem('jwtToken');
	});
</script>

<!-- Main Signin Page Content -->
<div class=" h-[600px]">
	<Header />
	<!-- Including the Header component -->
	<br />

	<!-- SVG Icons -->
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
	<svg
		width="84"
		height="91"
		viewBox="0 0 84 91"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		class="block mx-auto my-4 stroke-[#263238] dark:stroke-[#11D9C5] drop-shadow-md dark:drop-shadow-none"
	>
		<g filter="url(#filter0_d_6910_1689)">
			<path
				d="M53.6719 17.6333C51.8652 14.1467 48.3519 11 42.0052 11C31.3385 11 28.6719 19.89 28.6719 24.3333V34.3333"
				stroke-width="5"
				stroke-linecap="round"
				stroke-linejoin="round"
				shape-rendering="crispEdges"
			/>
		</g>
		<g filter="url(#filter1_d_6910_1689)" class="fill-[#263238] dark:fill-[#11D9C5]">
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M12 41C12 38.3478 13.0536 35.8043 14.9289 33.9289C16.8043 32.0536 19.3478 31 22 31H62C64.6522 31 67.1957 32.0536 69.0711 33.9289C70.9464 35.8043 72 38.3478 72 41V64.3333C72 66.9855 70.9464 69.529 69.0711 71.4044C67.1957 73.2798 64.6522 74.3333 62 74.3333H22C19.3478 74.3333 16.8043 73.2798 14.9289 71.4044C13.0536 69.529 12 66.9855 12 64.3333V41ZM45.3333 47.6667C45.3333 46.7826 44.9821 45.9348 44.357 45.3096C43.7319 44.6845 42.8841 44.3333 42 44.3333C41.1159 44.3333 40.2681 44.6845 39.643 45.3096C39.0179 45.9348 38.6667 46.7826 38.6667 47.6667V57.6667C38.6667 58.5507 39.0179 59.3986 39.643 60.0237C40.2681 60.6488 41.1159 61 42 61C42.8841 61 43.7319 60.6488 44.357 60.0237C44.9821 59.3986 45.3333 58.5507 45.3333 57.6667V47.6667Z"
			/>
		</g>
		<defs>
			<filter
				id="filter0_d_6910_1689"
				x="14.1719"
				y="0.5"
				width="54"
				height="52.334"
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
					values="0 0 0 0 0.14902 0 0 0 0 0.196078 0 0 0 0 0.219608 0 0 0 0.4 0"
				/>
				<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6910_1689" />
				<feBlend
					mode="normal"
					in="SourceGraphic"
					in2="effect1_dropShadow_6910_1689"
					result="shape"
				/>
			</filter>
			<filter
				id="filter1_d_6910_1689"
				x="0"
				y="23"
				width="84"
				height="67.334"
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
					values="0 0 0 0 0.14902 0 0 0 0 0.196078 0 0 0 0 0.219608 0 0 0 0.4 0"
				/>
				<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6910_1689" />
				<feBlend
					mode="normal"
					in="SourceGraphic"
					in2="effect1_dropShadow_6910_1689"
					result="shape"
				/>
			</filter>
		</defs>
	</svg>

	<!-- Main Content -->
	<div>
		<!-- Conditional rendering based on modal state -->
		{#if modal == false}
			<!-- Signin Form -->
			<h1 class="text-2xl text-center font-bold text-black dark:text-white">Set unlock password</h1>

			<!-- Additional information -->
			<p class="text-xs mt-2 mb-3 dark:text-white">
				This password will be used to unlock your wallet
			</p>

			<!-- Password input -->
			<div class="my-8">
				<label for="password">Password</label>
				<input
					name="password"
					type="password"
					class="bg-transparent border-b border-b-black dark:border-b-[#11D9C5] outline-none rounded-none w-full text-black dark:text-white"
					bind:value={password}
				/>
			</div>

			<!-- Submit button -->
			<button class="btn primary-button" on:click={handleSubmit}> Unlock </button>

			<!-- Forgot password link -->
			<span class="text-xs text-[#263238] dark:text-[#11D9C5] block text-center my-2"
				>Forgot password?</span
			>
		{:else}
			<!-- Modal displayed on successful authentication -->
			<div class="modal-box dark:text-white bg-white dark:bg-[#222944] shadow-md dark:shadow-none">
				<div class="flex gap-4 justify-center items-center">
					<!-- Success message and icon -->
					<h3 class="font-bold text-lg">Congratulations!</h3>
					<svg
						width="68"
						height="66"
						viewBox="0 0 68 66"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						class="fill-[#263238] dark:fill-[#11D9C5]"
					>
						<!-- SVG path for a success icon -->
					</svg>
				</div>

				<!-- Success message -->
				<p class="py-4">Click below to go to the home page</p>

				<!-- Action button to go to the homepage -->
				<div class="modal-action">
					<a href="/" class="w-full"><button class="btn primary-button">Go to homepage</button></a>
				</div>
			</div>
		{/if}
	</div>

	<!-- Additional support information -->
	<span class="text-xs block text-center mt-32">
		Need help?
		<small class="text-xs text-[#263238] dark:text-[#11D9C5] align-bottom"
			>Contact netsepio support</small
		>
	</span>
</div>
