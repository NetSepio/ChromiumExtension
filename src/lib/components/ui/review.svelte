<script>
	import Toast from '$lib/components/ui/toast.svelte';
	let { reviews, averageRating, urlWithoutProtocol } = $props();
	let toast = $state(false);

	function openReviewPage() {
		window.open(`https://app.netsepio.com/reviews/${urlWithoutProtocol}`, '_blank');
	}

	$effect(() => {
		setTimeout(() => {
			toast = true;
		}, 3000);
	});
</script>

<div>
	<!-- Ratings section -->
	<div>
		<div class="mt-2 flex items-center justify-between">
			<h3 class="text-xl font-bold">Ratings</h3>
			<span class="text-xs">{Math.round(averageRating * 10)}% safe</span>
		</div>
		<div
			class="dark:bg-#2F3A65 shadow-light mt-4 h-2 w-full overflow-hidden rounded-lg bg-[#FFFFFF0D]"
		>
			<span
				style={`width: ${Math.round(averageRating * 10)}%`}
				class="my-auto block h-8 bg-[#11D9C5]"
			></span>
		</div>
	</div>

	<!-- Reviews section -->
	<div class="my-4">
		<h3 class="text-xl font-bold">Reviews</h3>
		{#if !reviews || reviews.length === 0}
			<div class="py-8 text-gray-400">No reviews found for this site.</div>
		{:else}
			<div class="flex flex-col gap-4">
				{#each reviews.slice(0, 2) as review, index (review.id ?? index)}
					<div class="reviews">
						<p>
							{review.description}
						</p>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Grid layout for displaying Review and SubmitReview components -->
	<div class="grid grid-cols-2 gap-x-2">
		<button
			onclick={openReviewPage}
			class="cursor-pointer rounded-3xl bg-gradient-to-b from-[#0b8f84] to-[#00ccba] py-2 text-white"
			>Read Reviews</button
		>
		<a
			href="/submit-review"
			class="cursor-pointer rounded-3xl bg-gradient-to-b from-[#0b8f84] to-[#00ccba] py-2 text-white"
		>
			Submit Review
		</a>
	</div>
</div>

<Toast status="Coming back soon" success={false} error={false} open={toast} />
