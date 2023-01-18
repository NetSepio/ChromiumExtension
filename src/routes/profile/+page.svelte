<script>
	import Header from '$lib/components/Header.svelte';
	import { walletAddress } from '$lib/store/store';
	import Icon from 'svelte-icons-pack/Icon.svelte';
	import AiFillCopy from 'svelte-icons-pack/ai/AiFillCopy';
	import MaticIcon from '$lib/images/matic-token.png';
	import { GET_THIS_USER_DATA } from '$lib/graphql/queries';
	import fetchGraphQLData from '$lib/graphql/fetchGraphQLData ';
	import { thisUserData } from '$lib/modules/dummyResponseData';
	import { each } from 'svelte/internal';

	let copied = false;
	const handleCopyClick = () => {
		navigator.clipboard.writeText($walletAddress);
		copied = true;
	};

	let error;
	// let response = fetchGraphQLData(GET_THIS_USER_DATA, { id: '0x04c6ed8571151368e93477548d024bd08633f93b' });

	let response = thisUserData.data.user;
	const truncatedAddress = `${response.id.substring(0, 5)}...${response.id.substring(
		response.id.length - 4
	)}`;
</script>

<div class="artboard phone-3 p-5 mb-5 pb-5">
	<Header />
	<br />
	<div class="w-auto bg-base-100 rounded-lg shadow-xl p-5">
		<div class="flex flex-col mb-4">
			<img src={MaticIcon} alt="MATIC token" class="h-16 w-16 flex items-center mx-32	 mb-4" />
			<div class="flex justify-center">
				<span class="text-4xl text-center">Your ID</span>
			</div>
		</div>

		<div class="flex flex-col items-center">
			<div class="flex items-center mb-4">
				<h1 class="font-bold text-black dark:text-stone-300 text-lg">{truncatedAddress}</h1>
				<button
					class="ml-1 px-4 py-2 rounded-lg bg-zinc-200 text-white w-auto h-auto content-around"
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

		<!-- Something -->
		<p class="text-md mt-3 mb-3">Roles</p>
		{#each response.roles as role}
			<p
				class="p-4 border border-zinc-600 rounded-md w-full max-w-xs text-left justify-center items-center align-middle overflow-hidden"
			>
				{role}
			</p>
		{/each}
		<!-- Karma Points -->
		<p class="text-md mt-3 mb-3">Karma Points</p>
		<p
			class="p-4 border border-zinc-600 rounded-md w-full max-w-xs text-left justify-center items-center align-middle"
		>
			Karma Points
		</p>
		<!-- Status -->
		<p class="text-md mt-3 mb-3">Status</p>
		<p
			class="p-4 border border-zinc-600 rounded-md w-full max-w-xs text-left justify-center items-center align-middle"
		>
			Safe
		</p>
	</div>
</div>
