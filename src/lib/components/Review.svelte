<script lang="ts">
	export let url: string | undefined;

	function openNewPage() {
		window.open(`https://app.netsepio.com/#/reviews/${url}`, '_blank');
	}
</script>

<div class="grid flex-grow">
	<button class="btn px-4 py-2 rounded-md" on:click={openNewPage}> Reviews </button>
</div>
