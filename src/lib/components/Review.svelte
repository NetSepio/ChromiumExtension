<!-- Review component -->
<script lang="ts">
	// Exporting a variable
	interface Props {
		urlWithoutProtocol: any;
	}

	let { urlWithoutProtocol }: Props = $props();

	// Function to open a new page
	function openNewPage() {
		window.open(`https://app.netsepio.com/reviews/${urlWithoutProtocol}`, '_blank');
	}
</script>

<div class="grid flex-grow">
	<!-- Button triggering the openNewPage function when clicked -->
	<button class="secondary-button" onclick={openNewPage}> read reviews </button>
</div>
