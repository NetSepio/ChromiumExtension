<script lang="ts">
	export let urlWithoutProtocol: any;

	function openNewPage() {
		window.open(`https://app.netsepio.com/#/reviews/${urlWithoutProtocol}`, '_blank');
	}
</script>

<div class="grid flex-grow">
	<button class="btn secondary-button" on:click={openNewPage}> read reviews </button>
</div>
