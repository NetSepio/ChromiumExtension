<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import { jwtToken, walletAddress, avatar } from '$lib/store/store';
	import Icon from 'svelte-icons-pack/Icon.svelte';
	import IoCopy from 'svelte-icons-pack/io/IoCopy';
	import { checkAuth } from '$lib/modules/secondAuth';
	import { fetchUserProfileData } from '$lib/restApi/fetchFromRESTApi';
	import { onMount } from 'svelte';
	import AskToLogin from '$lib/components/AskToLogin.svelte';
	import { PUBLIC_GATEWAY_URL } from '$env/static/public';
	import { generateQRCode } from '$lib/modules/qrCode';
	import { AvatarGenerator } from 'random-avatar-generator';

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

	let showModal = false;
	let userName = '';
	// let userCountry = '';
	let userImage = '';
	let name = '';
	// let country = '';
	let image = '';
	let copied = false;
	let clicked = false;
	let response: ResponseType;
	let error;
	let truncatedAddress = '...';
	let roles = {};
	let isAuthenticated: boolean = true;
	let userWalletAddress = '';
	let qrCodeDataUrl: string = '';
	let avatarHolder = '/avatar.png';

	const handleAvatar = () => {
		if ($avatar !== '') {
			return;
		}
		const generator = new AvatarGenerator();
		avatar.set(generator.generateRandomAvatar($walletAddress));
	};
	const handleCopyClick = () => {
		navigator.clipboard.writeText($walletAddress);
		copied = true;
	};

	async function generateQRCodeDataUrl() {
		qrCodeDataUrl = await generateQRCode($walletAddress);
	}

	const getUserProfile = async () => {
		const [response, error] = await fetchUserProfileData();

		name = response.payload.name;
		// country = response.payload.country;
		image = response.payload.profilePictureUrl;

		if (!error) {
			userWalletAddress = response.payload.walletAddress;
		} else {
			userWalletAddress = $walletAddress;
		}
		truncatedAddress = `${userWalletAddress.substring(0, 5)}...${userWalletAddress.substring(
			userWalletAddress.length - 4
		)}`;
	};

	const handleUpdateProfile = async () => {
		try {
			let trimmedUserName = userName.trim();
			// let trimmedUserCountry = userCountry.trim();
			let trimmedUserImage = userImage.trim();

			let myHeaders = new Headers();
			myHeaders.append('Authorization', `Bearer ${$jwtToken}`);
			myHeaders.append('Content-Type', 'application/json');

			let body = JSON.stringify({
				name: trimmedUserName,
				// country: trimmedUserCountry,
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

	// function handleButtonClick() {
	// 	const modalCheckbox = document.getElementById('my-modal-3') as HTMLInputElement;
	// 	modalCheckbox.checked = true;
	// 	clicked = true;
	// }

	onMount(async () => {
		await getUserProfile();

		handleAvatar();
		generateQRCodeDataUrl();
		roles = response.payload.roles;
		[isAuthenticated] = await checkAuth();
	});
</script>

<div class="bg-white text-black dark:bg-[#171C2F] dark:text-white">
	<Header />
	<br />
	<div class="w-auto rounded-lg py-12">
		{#if isAuthenticated}
			<div class="flex flex-col justify-evenly items-center mb-4 dark:text-white">
				{#if !image && $avatar}
					<img src={$avatar} alt="aptos token" class="w-28 flex items-center mx-2 mb-4" />
				{:else if image}
					<img
						src={image}
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
				<div class="flex justify-center">
					<span class="text-2xl text-center">Your Profile</span>
				</div>
				<!-- <div class="flex gap-4">
					<h4>Username:</h4>
					<p class="mb-2">{name || 'Create your username'}</p>
				</div> -->
			</div>

			<div class="flex flex-col items-center">
				<div class="flex items-center justify-end gap-6 mb-4 rounded-full border border-[#11D9C5]">
					<h3 class="font-bold text-sm text-black dark:text-white">{truncatedAddress}</h3>
					<button
						class="px-8 py-2 rounded-lg w-auto h-auto text-white text-center content-around"
						on:click={handleCopyClick}
						class:bg-gray-900={copied}
					>
						{#if copied}
							COPIED
						{:else}
							<Icon src={IoCopy} color="#11D9C5" />
						{/if}
					</button>
				</div>
				<!-- QR CODE -->
				<!-- <button
					class="ml-1 px-4 py-2 rounded-lg w-auto h-auto content-around dark:bg-gray-300 dark:text-black"
					on:click={handleButtonClick}
				>
					QR CODE
				</button> -->
				<!-- HTML modal code -->
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
			</div>

			<button class="btn block mx-auto w-2/5 primary-button" on:click={() => (showModal = true)}
				>Edit</button
			>

			<div class="modal" class:modal-open={showModal}>
				<div class="modal-box w-4/5 dark:bg-[#222944] dark:text-white">
					<h1 class="text-xl text-left mb-2">Edit you profile</h1>
					<br />

					<div>
						<label for="userName" class="text-sm text-left mt-4 mb-4">Enter name</label>
						<input name="userName" type="text" class="secondary-input" bind:value={userName} />
					</div>

					<div class="mt-12">
						<label for="userImage" class="text-sm text-left mt-4 mb-4">Enter profile URL</label>
						<input name="userImage" type="url" class="secondary-input" bind:value={userImage} />
					</div>

					<br />
					<div class="flex gap-4 w-full mt-5">
						<div class="grid flex-grow">
							<button class="btn secondary-button" on:click={() => (showModal = false)}
								>CANCEL</button
							>
						</div>

						<div class="grid flex-grow">
							<button class="btn primary-button" on:click={handleUpdateProfile}> Save </button>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<AskToLogin />
		{/if}
	</div>
</div>
