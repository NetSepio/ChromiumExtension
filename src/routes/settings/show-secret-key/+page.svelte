<!-- Show secret key page -->

<script>
	// Importing necessary modules and components
	import Header from '$lib/components/Header.svelte';
	import { authenticateUser } from '$lib/modules/secondAuth';
	import { mnemonicPhrase } from '$lib/store/store';
	import { downloadMnemonic } from '$lib/modules/exportMenmonic';

	// Component's variables
	let password = '';
	let errorMessage = '';
	let secretKey = '';
	let isCorrectPassword = false;

	// Function to handle download of mnemonic phrase
	const handleDownload = () => {
		downloadMnemonic(secretKey);
	};

	// Function to handle form submission
	const handleSubmit = async () => {
		if (password.length >= 6) {
			isCorrectPassword = authenticateUser(password);
			if (isCorrectPassword) {
				secretKey = await mnemonicPhrase.get();
			} else {
				errorMessage = 'Invalid password';
			}
		} else {
			errorMessage = 'Invalid password';
		}
	};
</script>

<!-- Component HTML structure -->
<div>
	<!-- Including the Header component -->
	<Header />
	<br />
	<div class="w-[80%] mx-auto">
		<!-- Link to navigate back to settings -->
		<a href="/settings">
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
		<!-- Conditional rendering based on correct password input -->
		{#if !isCorrectPassword}
			<!-- Error message and password input -->
			<div>
				<!-- Illustration for incorrect password -->
				<svg
					width="90"
					height="91"
					viewBox="0 0 90 91"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="block mx-auto my-8 fill-[#263238] dark:fill-[#11D9C5] drop-shadow-lg dark:drop-shadow-none"
				>
					<path
						d="M44.8252 29.875L42.91 37.5427C45.0773 38.0819 51.7647 40.2877 52.8466 35.9462C53.974 31.4261 46.989 30.4177 44.8252 29.875ZM41.9472 41.4151L39.8359 49.8706C42.4374 50.5183 50.4692 53.0952 51.6561 48.3266C52.8991 43.3478 44.5521 42.0628 41.9472 41.4151Z"
					/>
					<g filter="url(#filter0_d_6870_4111)">
						<path
							d="M53.466 7.04704C34.7099 2.37287 15.7226 13.7869 11.0484 32.5431C6.37079 51.2923 17.7848 70.2865 36.527 74.9642C55.2832 79.6383 74.2809 68.2278 78.9516 49.4716C83.6292 30.719 72.2152 11.7247 53.466 7.04704ZM60.437 36.0198C59.9293 39.43 58.0351 41.0791 55.5283 41.6603C58.977 43.453 60.7276 46.205 59.061 50.9771C56.9883 56.8978 52.0655 57.3984 45.5112 56.159L43.9216 62.5313L40.0843 61.5754L41.6493 55.2942C40.6255 55.0384 39.6042 54.7723 38.5857 54.4959L37.0137 60.8121L33.1798 59.8493L34.7694 53.4665C33.8696 53.2355 32.9592 52.9904 32.0314 52.7593L27.0281 51.5163L28.9398 47.1188C28.9398 47.1188 31.7688 47.8715 31.7303 47.8155C32.8192 48.0851 33.2989 47.3779 33.4879 46.9017L36.0053 36.8356L36.408 36.9372C36.2781 36.8848 36.1447 36.8415 36.0088 36.8076L37.8015 29.6196C37.847 28.8003 37.5704 27.7709 36.0123 27.3823C36.0753 27.3438 33.2218 26.689 33.2218 26.689L34.2407 22.5856L39.5416 23.909L39.5381 23.9265C40.3329 24.1261 41.1521 24.3152 41.9889 24.5042L43.561 18.195L47.4019 19.1508L45.8613 25.334C46.8907 25.5686 47.9306 25.8067 48.9389 26.0588L50.4725 19.9141L54.3133 20.8699L52.7413 27.1792C57.587 28.8563 61.1302 31.3632 60.437 36.0198Z"
						/>
					</g>
					<defs>
						<filter
							id="filter0_d_6870_4111"
							x="0"
							y="0"
							width="90"
							height="90.0117"
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
								result="effect1_dropShadow_6870_4111"
							/>
							<feBlend
								mode="normal"
								in="SourceGraphic"
								in2="effect1_dropShadow_6870_4111"
								result="shape"
							/>
						</filter>
					</defs>
				</svg>

				<!-- Heading for seed phrase input -->
				<h1 class="text-2xl text-center font-bold text-black dark:text-white">Seed Phrase</h1>
				<!-- Error message or password input -->
				<label
					for="password"
					class="text-md my-6 block dark:text-white"
					class:text-red-500={errorMessage.length > 1}
				>
					{errorMessage.length > 1 ? errorMessage : `Enter Password`}
				</label>
				<!-- Password input field -->
				<input
					name="password"
					type="password"
					class="bg-transparent border-b border-b-black dark:border-b-[#11D9C5] outline-none rounded-none w-full text-black dark:text-white"
					bind:value={password}
				/>
				<!-- Button to submit password -->
				<button class="primary-button mt-[15%]" on:click={handleSubmit}> Unlock </button>
			</div>
		{:else}
			<!-- Section to display the seed phrase if password is correct -->
			<div class="mt-28">
				<!-- Heading for seed phrase display -->
				<h1 class="text-2xl text-center semiBold text-black dark:text-white">Show Seed Phrase</h1>
				<!-- Display of the seed phrase -->
				<div
					class="p-2 overflow-hidden text-xs text-center w-full mx-auto border border-[#11D9C5] rounded-full my-5"
				>
					{secretKey.slice(0, 30).concat('..')}
				</div>
				<!-- Button to download the seed phrase -->
				<button on:click={handleDownload} class="primary-button">Export mnemonic</button>
			</div>
		{/if}
	</div>
</div>
