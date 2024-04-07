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
				localStorage.setItem('unlocked', 'true');
			} else {
				errorMessage = 'Wrong Password';
			}
		} else {
			errorMessage = 'Password is too short';
		}
	};

	// Cleanup on component mount
	// onMount(() => {
	// });
</script>

<!-- Main Signin Page Content -->
<div class="flex flex-col h-full">
	<!-- <Header /> -->
	<!-- Including the Header component -->
	<br />
	<div class="w-[80%] flex-grow mx-auto">
		<!-- Main Content -->
		<div class=" mt-[12%] flex flex-col justify-center flex-grow">
			<!-- Conditional rendering based on modal state -->
			{#if modal == false}
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
							<feBlend
								mode="normal"
								in2="BackgroundImageFix"
								result="effect1_dropShadow_6910_1689"
							/>
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
							<feBlend
								mode="normal"
								in2="BackgroundImageFix"
								result="effect1_dropShadow_6910_1689"
							/>
							<feBlend
								mode="normal"
								in="SourceGraphic"
								in2="effect1_dropShadow_6910_1689"
								result="shape"
							/>
						</filter>
					</defs>
				</svg>
				<!-- Signin Form -->
				<h1 class="text-2xl capitalize semiBold text-center text-[26px] text-black dark:text-white">
					Set unlock password
				</h1>

				<!-- Additional information -->
				<p class="text-[10px] opacity-80 text-center my-[5%] dark:text-white">
					This password will be used to unlock your wallet
				</p>
				{#if errorMessage}
					<p class="text-xs text-red-600">{errorMessage}</p>
				{/if}
				<!-- Password input -->
				<div class="mt-[15%]">
					<label for="password" class="text-xs">Password</label>
					<input
						name="password"
						type="password"
						on:input={() => (errorMessage = '')}
						class="bg-transparent border-b border-opacity-50 dark:border-opacity-50 border-b-black dark:border-b-[#11D9C5] outline-none rounded-none w-full text-black dark:text-white"
						bind:value={password}
					/>
				</div>

				<!-- Submit button -->
				<button class=" mt-[20%] primary-button" on:click={handleSubmit}> Unlock </button>

				<!-- Forgot password link -->
				<span class="text-xs text-[#263238] dark:text-[#11D9C5] block text-center my-2"
					>Forgot password?</span
				>
			{:else}
				<!-- Display success message and button to go to homepage -->
				<div
					class="  mt-[40%] py-[10%] headerShadow dark:bg-[#222944] rounded-md flex flex-col items-center my-auto"
				>
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
					<p class="text-xs w-[70%] mx-auto text-center text-black dark:text-white">
						Click below to go to the home page
					</p>
					<br />

					<!-- Button to go to homepage -->
					<div class="flex w-full mt-2">
						<button class="w-[80%] primary-button mx-auto capitalize">
							<a href="/"> go to homepage </a>
						</button>
					</div>
				</div>
			{/if}
		</div>

		<!-- Additional support information -->
		<!-- <span class="text-xs block text-center mt-32">
			Need help?
			<small class="text-xs text-[#263238] dark:text-[#11D9C5] align-bottom"
				>Contact netsepio support</small
			>
		</span> -->
	</div>
</div>
