<script>
	import Icon from 'svelte-icons-pack/Icon.svelte';
	import AiFillCopy from 'svelte-icons-pack/ai/AiFillCopy';
	import RiFinanceCoinsFill from 'svelte-icons-pack/ri/RiFinanceCoinsFill';
	import AiOutlineSend from 'svelte-icons-pack/ai/AiOutlineSend';
	import RiFinanceExchangeFill from 'svelte-icons-pack/ri/RiFinanceExchangeFill';
	import { checkAuth } from "$lib/modules/secondAuth";

	import MaticImg from '$lib/images/matic-token.png';

	let truncatedAddress = '';
	let walletBalance = 0;
	let walletAddress = '';
	const handleCopyClick = () => {
		navigator.clipboard.writeText(walletAddress);
	};
	let hashedMemonic = checkAuth();
</script>

<div class="flex flex-col items-center">
	<div class="flex items-center mb-4">
		<h1 class="font-bold text-black text-lg">{truncatedAddress}</h1>
		<button
			class="ml-1 px-4 py-2 rounded-lg bg-zinc-200 text-white w-auto h-auto content-around"
			on:click={handleCopyClick}
		>
			<Icon src={AiFillCopy} />
		</button>
	</div>

	<div class="flex flex-col mb-4">
		<img src={MaticImg} alt="MATIC token" class="h-16 w-16 flex items-center mx-28 mb-4" />
		<div class="flex justify-center">
			<span class="text-4xl text-center">{walletBalance} MATIC</span>
		</div>
	</div>

	<div class="flex justify-between mb-4">
		<button
			class="px-4 py-2 rounded-full shadow-lg bg-zinc-700 text-white w-auto h-auto mx-0.5 flex items-center"
		>
			<Icon src={RiFinanceCoinsFill} color="white" size="35" />
			Buy Token
		</button>
		<button
			class="px-4 py-2 rounded-full shadow-lg bg-zinc-700 text-white mr-0.5 w-auto h-auto mx-0.5 flex items-center"
		>
			<Icon src={AiOutlineSend} color="white" size="35" />
			Send Token
		</button>
		<button
			class="px-4 py-2 rounded-full shadow-lg bg-zinc-700 text-white w-auto h-auto mx-0.5 flex items-center"
		>
			<Icon src={RiFinanceExchangeFill} color="white" size="35" />
			Swap Token
		</button>
	</div>
</div>
