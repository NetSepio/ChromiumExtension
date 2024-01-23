<!-- No review found component -->
<script lang="ts">
	// Importing the SubmitReview component
	import SubmitReview from './SubmitReviewForm.svelte';

	// Exported variables
	export let error = '';
	export let currentUrl = '';
</script>

<div class="flex flex-col justify-between align-center">
	<div class="p-10 pt-5">
		<!-- Displaying an error message if present -->
		<h3 class="text-center text-3xl font-bold dark:text-white pb-10">
			{error}
		</h3>

		<!-- Including the SubmitReview component -->
		<SubmitReview />
	</div>
</div>
