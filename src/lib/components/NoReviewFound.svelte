<script lang="ts">
	import SubmitReview from './SubmitReview.svelte';

	export let error = '';
	export let currentUrl = '';
</script>

<h1 class="text-center text-xl text-bold dark:text-white pb-10">{currentUrl}</h1>
<div class="p-10 pt-5">
	<h1 class="text-center text-4xl text-bold dark:text-white pb-10">
		{error}
	</h1>
	<SubmitReview />
</div>
