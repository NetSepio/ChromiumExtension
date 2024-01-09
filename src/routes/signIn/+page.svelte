<script>
	import { onMount } from 'svelte';
	import { authenticateUser } from '$lib/modules/secondAuth';
	import Header from '$lib/components/Header.svelte';

	let password = '';
	let errorMessage = '';
	let modal = false;

	function Authenticator() {
		const authentication = authenticateUser(password);
		return authentication;
	}

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

	onMount(() => {
		localStorage.removeItem('jwtToken');
	});
</script>

<div class=" h-[600px]">
	<Header />
	<br />
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

	<div>
		{#if modal == false}
			<h1 class="text-2xl text-center font-bold text-black dark:text-white">Set unlock password</h1>
			<p class="text-xs mt-2 mb-3 dark:text-white">
				This password will be used to unlock your wallet
			</p>
			<div class="my-8">
				<label for="password">Password</label>
				<input
					name="password"
					type="password"
					class="bg-transparent border-b border-b-black dark:border-b-[#11D9C5] outline-none rounded-none w-full text-black dark:text-white"
					bind:value={password}
				/>
			</div>
			<button class="btn primary-button" on:click={handleSubmit}> Unlock </button>
			<span class="text-xs text-[#263238] dark:text-[#11D9C5] block text-center my-2"
				>Forgot password?</span
			>
		{:else}
			<div class="modal-box dark:text-white bg-white dark:bg-[#222944] shadow-md dark:shadow-none">
				<div class="flex gap-4 justify-center items-center">
					<h3 class="font-bold text-lg">Congratulations!</h3>
					<svg
						width="68"
						height="66"
						viewBox="0 0 68 66"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						class="fill-[#263238] dark:fill-[#11D9C5]"
					>
						<g filter="url(#filter0_d_6892_6947)">
							<path
								d="M12.6253 46.6667L20.4898 24.7917C20.6635 24.3403 20.9329 23.9931 21.2982 23.75C21.6635 23.5069 22.0537 23.3854 22.469 23.3854C22.7468 23.3854 23.0072 23.4375 23.2503 23.5417C23.4933 23.6458 23.719 23.8021 23.9273 24.0104L37.9898 38.0729C38.1982 38.2812 38.3544 38.5069 38.4586 38.75C38.5628 38.9931 38.6148 39.2535 38.6148 39.5312C38.6148 39.9479 38.4933 40.3389 38.2503 40.7042C38.0072 41.0694 37.66 41.3382 37.2086 41.5104L15.3336 49.375C14.9169 49.5486 14.5176 49.575 14.1357 49.4542C13.7537 49.3333 13.4239 49.1333 13.1461 48.8542C12.8683 48.5764 12.6683 48.2465 12.5461 47.8646C12.4239 47.4826 12.4503 47.0833 12.6253 46.6667ZM54.969 19.6354C54.6565 19.9479 54.2919 20.1042 53.8753 20.1042C53.4586 20.1042 53.094 19.9479 52.7815 19.6354L52.6253 19.4792C52.1391 18.9931 51.5315 18.75 50.8023 18.75C50.0732 18.75 49.4655 18.9931 48.9794 19.4792L38.4065 30.0521C38.094 30.3646 37.7294 30.5208 37.3128 30.5208C36.8961 30.5208 36.5315 30.3646 36.219 30.0521C35.9065 29.7396 35.7503 29.375 35.7503 28.9583C35.7503 28.5417 35.9065 28.1771 36.219 27.8646L46.7919 17.2917C47.903 16.1806 49.2398 15.625 50.8023 15.625C52.3648 15.625 53.7016 16.1806 54.8128 17.2917L54.969 17.4479C55.2815 17.7604 55.4378 18.125 55.4378 18.5417C55.4378 18.9583 55.2815 19.3229 54.969 19.6354ZM27.7815 13.3854C28.094 13.0729 28.4586 12.9167 28.8753 12.9167C29.2919 12.9167 29.6565 13.0729 29.969 13.3854L30.2294 13.6458C31.3405 14.7569 31.8961 16.0764 31.8961 17.6042C31.8961 19.1319 31.3405 20.4514 30.2294 21.5625L30.0732 21.7187C29.7607 22.0312 29.3961 22.1875 28.9794 22.1875C28.5628 22.1875 28.1982 22.0312 27.8857 21.7187C27.5732 21.4062 27.4169 21.0417 27.4169 20.625C27.4169 20.2083 27.5732 19.8438 27.8857 19.5312L28.0419 19.375C28.528 18.8889 28.7711 18.2986 28.7711 17.6042C28.7711 16.9097 28.528 16.3194 28.0419 15.8333L27.7815 15.5729C27.469 15.2604 27.3128 14.8958 27.3128 14.4792C27.3128 14.0625 27.469 13.6979 27.7815 13.3854ZM36.219 9.21875C36.5315 8.90625 36.8961 8.75 37.3128 8.75C37.7294 8.75 38.094 8.90625 38.4065 9.21875L40.6461 11.4583C41.7572 12.5694 42.3128 13.9062 42.3128 15.4688C42.3128 17.0312 41.7572 18.3681 40.6461 19.4792L34.2398 25.8854C33.9273 26.1979 33.5628 26.3542 33.1461 26.3542C32.7294 26.3542 32.3648 26.1979 32.0523 25.8854C31.7398 25.5729 31.5836 25.2083 31.5836 24.7917C31.5836 24.375 31.7398 24.0104 32.0523 23.6979L38.4586 17.2917C38.9447 16.8056 39.1878 16.1979 39.1878 15.4688C39.1878 14.7396 38.9447 14.1319 38.4586 13.6458L36.219 11.4062C35.9065 11.0938 35.7503 10.7292 35.7503 10.3125C35.7503 9.89583 35.9065 9.53125 36.219 9.21875ZM52.8857 34.2187C52.5732 34.5312 52.2086 34.6875 51.7919 34.6875C51.3753 34.6875 51.0107 34.5312 50.6982 34.2187L48.4586 31.9792C47.9725 31.4931 47.3648 31.25 46.6357 31.25C45.9065 31.25 45.2989 31.4931 44.8128 31.9792L42.5732 34.2187C42.2607 34.5312 41.8961 34.6875 41.4794 34.6875C41.0628 34.6875 40.6982 34.5312 40.3857 34.2187C40.0732 33.9062 39.9169 33.5417 39.9169 33.125C39.9169 32.7083 40.0732 32.3438 40.3857 32.0312L42.6253 29.7917C43.7364 28.6806 45.0732 28.125 46.6357 28.125C48.1982 28.125 49.535 28.6806 50.6461 29.7917L52.8857 32.0312C53.1982 32.3438 53.3544 32.7083 53.3544 33.125C53.3544 33.5417 53.1982 33.9062 52.8857 34.2187Z"
							/>
						</g>
						<defs>
							<filter
								id="filter0_d_6892_6947"
								x="0.470703"
								y="0.75"
								width="66.9668"
								height="64.7773"
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
				<p class="py-4">Click below to go to home page</p>
				<div class="modal-action">
					<a href="/" class="w-full"><button class="btn primary-button">Go to homepage</button></a>
				</div>
			</div>
		{/if}
	</div>
	<span class="text-xs block text-center mt-32">
		Need help?
		<small class="text-xs text-[#263238] dark:text-[#11D9C5] align-bottom"
			>Contact netsepio support</small
		>
	</span>
</div>
