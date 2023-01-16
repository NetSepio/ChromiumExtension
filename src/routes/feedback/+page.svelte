<script>
	import Header from '$lib/components/Header.svelte';
</script>

<div class="artboard phone-3 p-5">
	<Header />
	<br />
	<div>
		<h1 class="text-3xl text-left mt-5 mb-5">Rate Us</h1>
		<div class="rating">
			<input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" />
			<input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" checked />
			<input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" />
			<input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" />
			<input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" />
		</div>
	</div>

	<div>
		<h1 class="text-5xl text-left mt-10 mb-5">Write to Us!</h1>
	</div>

	<textarea class="textarea textarea-bordered w-full h-44" placeholder="Write Here" />

	<button class="btn mt-5">Submit</button>
</div>
