<script lang="ts">
	export let url: string | undefined;

	function openNewPage() {
		window.open(`https://app.netsepio.com/#/reviews/${url}`, '_blank');
	}
</script>

<div class="grid flex-grow">
	<button class="btn secondary-button" on:click={openNewPage}> read reviews </button>
</div>
