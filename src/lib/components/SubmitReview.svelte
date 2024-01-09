<script lang="ts">
	export let urlWithoutProtocol: any;

	function openNewPage() {
		window.open(
			`https://app.netsepio.com/#/my-reviews?siteUrl=https://${urlWithoutProtocol}`,
			'_blank'
		);
	}
</script>

<div class="grid flex-grow">
	<button class="btn primary-button" on:click={openNewPage}> Submit Review </button>
</div>
