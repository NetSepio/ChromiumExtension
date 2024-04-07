<!-- Profile Page -->

<script lang="ts">
	// Importing necessary modules and components
	import Header from '$lib/components/Header.svelte';
	import { jwtToken, walletAddress, avatar, darktheme } from '$lib/store/store';
	// import Icon from 'svelte-icons-pack/Icon.svelte';
	// import IoCopy from 'svelte-icons-pack/io/IoCopy';
	import { checkAuth } from '$lib/modules/secondAuth';
	import { fetchUserProfileData } from '$lib/restApi/fetchFromRESTApi';
	import { onMount } from 'svelte';
	import AskToLogin from '$lib/components/AskToLogin.svelte';
	import { PUBLIC_GATEWAY_URL } from '$env/static/public';
	import { generateQRCode } from '$lib/modules/qrCode';
	import { AvatarGenerator } from 'random-avatar-generator';
	import { removePrefix } from '$lib/utils';
	import { slide } from 'svelte/transition';

	// Interfaces for response data
	interface PayloadType {
		roles: any;
		walletAddress: string;
		name: string;
		country: string;
		profilePictureUrl: string;
	}

	interface ResponseType {
		status: number;
		message: string;
		payload: PayloadType;
	}

	// Component's variables
	let showModal = false;
	let userName = '';
	let userImage = '';
	let name = '';
	let image = '';
	let copied = false;
	let response: ResponseType;
	let error;
	let truncatedAddress = '...';
	let roles = {};
	let isAuthenticated: boolean = false;
	let userWalletAddress = '';
	let qrCodeDataUrl: string = '';
	let avatarHolder = '/avatar.png';

	let darkMode: boolean | undefined = undefined; // Initial dark mode state
	darktheme.subscribe((data) => (darkMode = data));

	$: src = darkMode ? '/dark_copy.svg' : 'light_copy.svg';

	// Function to handle avatar
	const handleAvatar = () => {
		if ($avatar !== '') {
			return;
		}
		const generator = new AvatarGenerator();
		avatar.set(generator.generateRandomAvatar($walletAddress));
	};

	// Function to handle copy click
	const handleCopyClick = () => {
		navigator.clipboard.writeText($walletAddress);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	};

	// Function to generate QR code data URL
	async function generateQRCodeDataUrl() {
		qrCodeDataUrl = await generateQRCode($walletAddress);
	}

	// Function to get user profile data
	const getUserProfile = async () => {
		const [response, error] = await fetchUserProfileData();

		name = response?.payload?.name;
		image = response?.payload?.profilePictureUrl;
		console.log(response, error);

		if (!error) {
			userWalletAddress = response?.payload?.walletAddress;
		} else {
			userWalletAddress = $walletAddress;
		}
		truncatedAddress = `${userWalletAddress?.substring(0, 3)}...${userWalletAddress?.substring(
			userWalletAddress?.length - 3
		)}`;
	};

	// Function to handle profile update
	const handleUpdateProfile = async () => {
		try {
			let trimmedUserName = userName.trim();
			let trimmedUserImage = userImage.trim();

			let myHeaders = new Headers();
			myHeaders.append('Authorization', `Bearer ${$jwtToken}`);
			myHeaders.append('Content-Type', 'application/json');

			let body = JSON.stringify({
				name: trimmedUserName,
				profilePictureUrl: trimmedUserImage
			});

			const response = await fetch(`${PUBLIC_GATEWAY_URL}/profile`, {
				method: 'PATCH',
				headers: myHeaders,
				body
			});

			if (response.status !== 200) {
				error = 'Failed to update the profile';
			}
		} catch (error) {
			console.error(error);
		} finally {
			await getUserProfile();
			showModal = false;
		}
	};

	// Lifecycle hook - onMount
	onMount(async () => {
		await getUserProfile();

		handleAvatar();
		generateQRCodeDataUrl();
		console.log(response);

		// roles = response.payload.roles;
		[isAuthenticated] = await checkAuth();
	});
</script>

<!-- Component HTML structure -->
<div class="bg-white text-black relative dark:bg-[#171C2F] dark:text-white">
	<!-- Including the Header component -->
	<Header />
	<br />
	{#if isAuthenticated}
		<div class="w-[80%] mx-auto flex flex-col items-center rounded-lg py-12">
			{#if copied}
				<p in:slide={{ duration: 200 }} class="text-[10px] absolute top-[100px] font-medium">
					Copied!!
				</p>
			{/if}
			{#if !showModal}
				<!-- User profile section -->
				<div class="flex flex-col justify-evenly items-center mb-[15%] dark:text-white">
					<!-- Displaying user image/avatar -->
					{#if !image && $avatar}
						<img src={$avatar} alt="aptos token" class="w-28 flex items-center mx-2 mb-4" />
					{:else if image}
						<img
							src={`${'https://nftstorage.link/ipfs'}/${removePrefix(image)}`}
							alt="aptos token"
							class="w-32 h-32 rounded-full object-center flex items-center mx-2 mb-4"
						/>
					{:else}
						<img
							src={avatarHolder}
							alt="aptos token"
							class="w-32 h-32 rounded-full object-center flex items-center mx-2 mb-4"
						/>
					{/if}
					<!-- Displaying user profile information -->
					<div class="flex justify-center">
						<span class="text-2xl font-semibold text-center">{name ?? 'Your Profile'}</span>
					</div>
				</div>

				<!-- User wallet address section -->
				<div class="flex w-full flex-col items-center">
					<!-- Displaying wallet address -->
					<div
						class="flex items-center justify-center space-x-5 mb-4 w-[55%] h-[36px] rounded-full border border-[#263238] dark:border-[#11D9C5] overflow-hidden"
					>
						<h3 class="font-semibold text-center text-sm text-black dark:text-white">
							{truncatedAddress}
						</h3>
						<!-- Button to copy wallet address to clipboard -->
						<button class="" on:click={handleCopyClick}>
							<img {src} width={16} height={16} alt="copy" />
						</button>
					</div>

					<!-- HTML modal code for displaying QR code -->
					<input type="checkbox" id="my-modal-3" class="modal-toggle" />
					<div class="modal">
						<div class="modal-box relative dark:bg-gray-800 dark:text-gray-100">
							<label for="my-modal-3" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
							<h3 class="text-lg font-bold">Your wallet Address QR Code!</h3>
							<div class="py-4 ml-24">
								{#if qrCodeDataUrl}
									<img src={qrCodeDataUrl} alt="QR Code" />
								{:else}
									<p>Generating QR code...</p>
								{/if}
							</div>
						</div>
					</div>

					<!-- Button to edit profile -->
					<button
						class="mx-auto w-[55%] h-[36px] primary-button"
						on:click={() => (showModal = true)}>Edit</button
					>
				</div>
			{:else}
				<!-- HTML modal code for profile editing -->
				<div
					class="dark:bg-[#222944] w-[100%] py-[32px] px-[26px] h-[308px] rounded-[10px] mx-auto shadow-sm shadow-appAsh dark:shadow-appGray dark:text-white"
				>
					<h1 class="text-2xl semiBold">Edit you profile</h1>
					<br />

					<!-- Input for user name -->
					<div class="mb-[8%]">
						<label for="userName" class="text-xs opacity-70 text-left">Enter name</label>
						<input
							name="userName"
							type="text"
							class="secondary-input border-opacity-40 w-full"
							bind:value={userName}
						/>
					</div>

					<!-- Input for user image URL -->
					<div class="">
						<label for="userImage" class="text-xs opacity-70 text-left">Enter profile URL</label>
						<input
							name="userImage"
							type="url"
							class="secondary-input border-opacity-40 w-full"
							bind:value={userImage}
						/>
					</div>

					<br />
					<!-- Buttons to cancel and save changes -->
					<div class="flex w-full justify-between mt-[5%]">
						<button
							class="secondary-button h-[36px] w-[100px]"
							on:click={() => (showModal = false)}
						>
							Cancel
						</button>

						<button class="primary-button h-[36px] w-[100px]" on:click={handleUpdateProfile}>
							Save
						</button>
					</div>
				</div>
			{/if}
		</div>
	{:else}
		<!-- Display a message for users who need to create a wallet to access the page -->
		<div class="h-[450px] flex flex-col justify-center">
			<a
				class="mt-12 text-center text-2xl font-bold text-[#263238] dark:text-white"
				href="/onboarding">Create a wallet to access this page🙂</a
			>
		</div>
	{/if}
</div>
