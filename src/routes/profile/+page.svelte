<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import { jwtToken, walletAddress } from '$lib/store/store';
	import Icon from 'svelte-icons-pack/Icon.svelte';
	import AiFillCopy from 'svelte-icons-pack/ai/AiFillCopy';
	import MaticIcon from '$lib/images/matic-token.png';
	import { checkAuth } from '$lib/modules/secondAuth';
	import { fetchUserProfileData } from '$lib/restApi/fetchFromRESTApi';
	import { onMount } from 'svelte';
	import AskToLogin from '$lib/components/AskToLogin.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import { PUBLIC_GATEWAY_URL } from '$env/static/public';

	interface PayloadType {
		roles: any;
		walletAddress: string;
	}

	interface ResponseType {
		status: number;
		message: string;
		payload: PayloadType;
	}

	let loader = false;

	let showModal = false;
	let userName = '';
	let userCountry = '';
	let userImage = '';
	let copied = false;
	let response: ResponseType;
	let error;
	let truncatedAddress = '';
	let roles = {};
	let isAuthenticated: boolean = true;

	const handleCopyClick = () => {
		navigator.clipboard.writeText($walletAddress);
		copied = true;
	};

	const handleUpdateProfile = async () => {
		try {
			let trimmedUserName = userName.trim();
			let trimmedUserCountry = userCountry.trim();
			let trimmedUserImage = userImage.trim();

			let myHeaders = new Headers();
			myHeaders.append('Authorization', $jwtToken);
			myHeaders.append('Content-Type', 'application/json');

			let body = JSON.stringify({
				name: trimmedUserName,
				country: trimmedUserCountry,
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
		}
	};

	onMount(async () => {
		[response, error] = await fetchUserProfileData();
		truncatedAddress = `${response.payload.walletAddress.substring(
			0,
			5
		)}...${response.payload.walletAddress.substring(response.payload.walletAddress.length - 4)}`;
		roles = response.payload.roles;
		[isAuthenticated] = await checkAuth();
	});
</script>

<div class="artboard phone-2 p-5 mb-5 pb-5 bg-white text-black dark:bg-gray-900 dark:text-white">
	<Header />
	<br />
	<div class="w-auto rounded-lg shadow-xl p-5">
		{#if isAuthenticated}
			<div class="flex flex-col mb-4 dark:bg-gray-900 dark:text-white">
				<img src={MaticIcon} alt="MATIC token" class="h-16 w-16 flex items-center mx-32	 mb-4" />
				<div class="flex justify-center">
					<span class="text-4xl text-center">Your ID</span>
				</div>
			</div>

			<div class="flex flex-col items-center bg-white dark:bg-gray-900">
				<div class="flex items-center mb-4">
					<h1 class="font-bold  text-md text-black dark:text-white">{truncatedAddress}</h1>
					<button
						class="ml-1 px-4 py-2 rounded-lg w-auto h-auto content-around dark:bg-white"
						on:click={handleCopyClick}
						class:bg-zinc-600={copied}
					>
						{#if copied}
							done
						{:else}
							<Icon src={AiFillCopy} />
						{/if}
					</button>
				</div>
			</div>
			<!-- <p class="text-md mt-3 mb-3">Roles</p>
			<p
				class="p-4 rounded-md shadow-lg dark:shadow-green-300/30 w-full max-w-xs text-left justify-center items-center align-middle overflow-hidden"
			>
				{roles}
			</p> -->
			<p class="text-md mt-3 mb-3">Karma Points</p>
			<p
				class="p-4 rounded-md shadow-lg dark:shadow-green-300/30 w-full max-w-xs text-left justify-center items-center align-middle"
			>
				Coming Soon...
			</p>
			<!-- Status -->
			<p class="text-md mt-3 mb-3">Status</p>
			<p
				class="p-4 rounded-md shadow-lg dark:shadow-green-300/30 w-full max-w-xs text-left justify-center items-center align-middle"
			>
				Coming Soon...
			</p>
			<button class="btn w-full h-full mt-5" on:click={() => (showModal = true)}>Edit</button>

			<div class="modal" class:modal-open={showModal}>
				<div class="modal-box dark:bg-gray-800 dark:text-white">
					<h1 class="text-xl text-left mb-2">Edit you profile</h1>
					<br />

					<input
						type="text"
						class="input input-bordered input-success dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs my-2"
						placeholder="Enter your name"
						bind:value={userName}
					/>
					<input
						type="text"
						class="input input-bordered input-success dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs my-2"
						placeholder="What's your country?"
						bind:value={userCountry}
					/>
					<input
						type="url"
						class="input input-bordered input-success dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs my-2"
						placeholder="Enter your profile pic url"
						bind:value={userImage}
					/>

					<br />
					<div class="flex w-full mt-2">
						<div class="grid flex-grow">
							<button class="btn mt-10" on:click={() => (showModal = false)}>CANCEL</button>
						</div>

						<div class="divider divider-horizontal" />

						<div class="grid flex-grow">
							<button class="btn w-full h-full" on:click={handleUpdateProfile}> Save </button>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<AskToLogin />
		{/if}
	</div>
</div>
