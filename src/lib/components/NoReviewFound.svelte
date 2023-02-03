<script lang="ts">
	import SubmitReview from './SubmitReview.svelte';

	export let error = '';
</script>

<div class="artboard phone-1 p-10">
	<h1 class="text-center text-4xl text-bold dark:text-white pb-10">
		{error}
	</h1>
	<SubmitReview />
</div>
