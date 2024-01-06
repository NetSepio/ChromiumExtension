<script lang="ts">
	export let url: string | undefined;

	function openNewPage() {
		window.open(`https://app.netsepio.com/#/my-reviews?siteUrl=${url}`, '_blank');
	}
</script>

<div class="grid flex-grow">
	<button class="btn primary-button" on:click={openNewPage}> Submit Review </button>
</div>
