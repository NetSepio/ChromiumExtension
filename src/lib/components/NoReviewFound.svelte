<script lang="ts">
	import SubmitReview from './SubmitReviewForm.svelte';

	export let error = '';
	export let currentUrl = '';
</script>

<div class="flex flex-col justify-between align-center">
	<!-- <h3 class="text-center text-3xl">Submi</h3> -->
	<div class="p-10 pt-5">
		<h3 class="text-center text-3xl font-bold dark:text-white pb-10">
			{error}
		</h3>
		<SubmitReview />
	</div>
</div>
