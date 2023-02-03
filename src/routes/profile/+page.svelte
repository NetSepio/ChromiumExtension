<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import { walletAddress } from '$lib/store/store';
	import Icon from 'svelte-icons-pack/Icon.svelte';
	import AiFillCopy from 'svelte-icons-pack/ai/AiFillCopy';
	import MaticIcon from '$lib/images/matic-token.png';
	import { checkAuth } from '$lib/modules/secondAuth';
	import { fetchUserProfileData } from '$lib/restApi/fetchFromRESTApi';
	import { onMount } from 'svelte';
	import AskToLogin from '$lib/components/AskToLogin.svelte';
	import Loader from '$lib/components/Loader.svelte';

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

	onMount(async () => {
		[response, error] = await fetchUserProfileData();
		truncatedAddress = `${response.payload.walletAddress.substring(
			0,
			5
		)}...${response.payload.walletAddress.substring(response.payload.walletAddress.length - 4)}`;
		roles = response.payload.roles;
		isAuthenticated = checkAuth();
	});
</script>

<div class="artboard phone-3 p-5 mb-5 pb-5">
	<Header />
	<br />
	<div
		class="w-auto bg-base-100 text-black dark:bg-gray-900 dark:text-white rounded-lg shadow-xl p-5"
	>
		{#if isAuthenticated}
			<div class="flex flex-col mb-4 dark:bg-gray-900 dark:text-white">
				<img src={MaticIcon} alt="MATIC token" class="h-16 w-16 flex items-center mx-32	 mb-4" />
				<div class="flex justify-center">
					<span class="text-4xl text-center">Your ID</span>
				</div>
			</div>

			<div class="flex flex-col items-center bg-white text-black dark:bg-gray-900 dark:text-white">
				<div class="flex items-center mb-4">
					<h1 class="font-bold  text-lg">{truncatedAddress}</h1>
					<button
						class="ml-1 px-4 py-2 rounded-lg w-auto h-auto content-around bg-gray-200 dark:bg-white "
						on:click={handleCopyClick}
						class:bg-zinc-900={copied}
					>
						{#if copied}
							done
						{:else}
							<Icon src={AiFillCopy} />
						{/if}
					</button>
				</div>
			</div>
			<p class="text-md mt-3 mb-3">Roles</p>
			<p
				class="p-4 border border-zinc-600 rounded-md w-full max-w-xs text-left justify-center items-center align-middle overflow-hidden"
			>
				{roles}
			</p>
			<p class="text-md mt-3 mb-3">Karma Points</p>
			<p
				class="p-4 border border-zinc-600 rounded-md w-full max-w-xs text-left justify-center items-center align-middle"
			>
				Coming Soon...
			</p>
			<!-- Status -->
			<p class="text-md mt-3 mb-3">Status</p>
			<p
				class="p-4 border border-zinc-600 rounded-md w-full max-w-xs text-left justify-center items-center align-middle"
			>
				Coming Soon...
			</p>
		{:else}
			<AskToLogin />
		{/if}
	</div>
</div>
