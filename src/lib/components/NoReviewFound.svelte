<script lang="ts">
	import SubmitReview from './SubmitReview.svelte';

	export let error = '';
	export let currentUrl = '';
</script>

<h1
	class="text-center text-xl text-bold dark:text-white p-2 m-5 border border-zinc-600 dark:border-green-400 rounded-full flex justify-center items-center"
>
	{currentUrl}
</h1>
<div class="p-10 pt-5">
	<h1 class="text-center text-4xl text-bold dark:text-white pb-10">
		{error}
	</h1>
	<SubmitReview />
</div>
