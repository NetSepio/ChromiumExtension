<script lang="ts">
	import Review from '$lib/components/Review.svelte';
	import SubmitReview from '$lib/components/SubmitReview.svelte';

	export let url: string | undefined;
	export let reviews: any = [];

	console.log(reviews);
</script>

<div>
	<div>
		<div class="flex justify-between items-center mt-2">
			<h3 class="text-xl font-bold">Ratings</h3>
			<span class="text-xs">99% safe</span>
		</div>
		<div
			class="mt-4 h-2 w-full overflow-hidden rounded-lg bg-[#FFFFFF0D] dark:bg-#2F3A65 shadow-light"
		>
			<span class="h-8 block my-auto w-2/5 bg-#263238 dark:bg-[#11D9C5]" />
		</div>
	</div>
	{reviews?.rating}

	<div class="my-8">
		<h3 class="text-xl font-bold">Reviews</h3>
		<div class="flex flex-col gap-4">
			<div class="reviews">
				<p>
					“Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in arcu eu nulla lacinia
					vehicula”
				</p>
			</div>
			<div class="reviews">
				<p>
					“Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in arcu eu nulla lacinia
					vehicula”
				</p>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-x-2">
		<Review {url} />
		<SubmitReview {url} />
	</div>
</div>
