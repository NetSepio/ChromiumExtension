<script>
	import Header from '$lib/components/Header.svelte';
	import { walletAddress } from '../../store/store';
	// import AiFillCopy from 'svelte-icons-pack/ai/AiFillCopy'; ======= need to work on the icon

	const truncatedAddress = `${$walletAddress.substring(0, 5)}...${$walletAddress.substring(
		$walletAddress.length - 4
	)}`;

	const handleCopyClick = () => {
		navigator.clipboard.writeText($walletAddress);
	};
</script>

<div class="artboard phone-3 p-5 mb-5 pb-5">
	<Header />
	<br />
	<div class="w-auto bg-base-100 rounded-lg shadow-xl p-5">
		<div class="flex flex-col mb-4">
			<img
				src="./matic-token.png"
				alt="MATIC token"
				class="h-16 w-16 flex items-center mx-32	 mb-4"
			/>
			<div class="flex justify-center">
				<span class="text-4xl text-center">User Name</span>
			</div>
		</div>

		<div class="flex flex-col items-center">
			<div class="flex items-center mb-4">
				<h1 class="font-bold text-black text-lg">{truncatedAddress}</h1>
				<button
					class="ml-1 px-4 py-2 rounded-lg bg-zinc-700 text-white w-auto h-auto content-around"
					on:click={handleCopyClick}
				>
					<!-- <AiFillCopy /> -->
				</button>
			</div>
		</div>

		<!-- Something -->
		<p class="text-md mt-3 mb-3">Something</p>
		<p class="input input-bordered input-md w-full max-w-xs text-left justify-center">Something</p>
		<!-- Karma Points -->
		<p class="text-md mt-3 mb-3">Karma Points</p>
		<p class="input input-bordered input-md w-full max-w-xs text-left justify-center">
			Karma Points
		</p>
		<!-- Status -->
		<p class="text-md mt-3 mb-3">Status</p>
		<p class="input input-bordered input-md w-full max-w-xs text-left justify-center">Safe</p>
	</div>
</div>
