<!-- Submit Review component -->

<script lang="ts">
	// Input property to receive the button without the protocol
	export let urlWithoutProtocol: any;

	// Function to open a new page for submitting reviews
	function openNewPage() {
		window.open(
			`https://app.netsepio.com/dashboard?siteUrl=https://${urlWithoutProtocol}`,
			'_blank'
		);
	}
</script>

<!-- HTML structure for the component -->
<div class="grid flex-grow">
	<!-- Button to submit a review -->
	<button class="btn primary-button" on:click={openNewPage}> Submit Review </button>
</div>
