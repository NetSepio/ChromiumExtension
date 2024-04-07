<!-- Wallet Page -->
<script>
	import Wallet from '$lib/components/Wallet.svelte';
	import Header from '$lib/components/Header.svelte';
</script>

<div class="h-full flex flex-col">
	<Header />
	<div class="dark:text-white flex-grow flex flex-col dark:bg-[#171C2F]">
		<!-- <br class="bg-action" /> -->
		<Wallet />
	</div>
</div>
