<script lang="ts">
	export let urlWithoutProtocol: string | undefined;

	function openNewPage() {
		window.open(`https://testnet.netsepio.com/#/reviews/${urlWithoutProtocol}`, '_blank');
	}
</script>

<div class="grid flex-grow">
	<button class="btn px-4 py-2 rounded-md" on:click={openNewPage}> Reviews </button>
</div>
