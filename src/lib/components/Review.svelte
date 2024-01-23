<!-- Review component -->
<script lang="ts">
	// Exporting a variable
	export let urlWithoutProtocol: any;

	// Function to open a new page
	function openNewPage() {
		window.open(`https://app.netsepio.com/reviews/${urlWithoutProtocol}`, '_blank');
	}
</script>

<div class="grid flex-grow">
	<!-- Button triggering the openNewPage function when clicked -->
	<button class="btn secondary-button" on:click={openNewPage}> read reviews </button>
</div>
