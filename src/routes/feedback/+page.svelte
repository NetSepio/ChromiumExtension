<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import { PUBLIC_GATEWAY_URL } from '$env/static/public';
	import { jwtToken } from '$lib/store/store';
	import { onMount } from 'svelte';
	import { checkAuth } from '$lib/modules/secondAuth';
	import AskToLogin from '$lib/components/AskToLogin.svelte';
	let rating: number;
	let feedbackText: string;
	let error: string;
	let successful: boolean;
	let isAuthenticated: boolean = false;
	const selectRatingHandler = (e: any) => {
		rating = e.target.value;
	};
	const submitReviewHandler = async () => {
		try {
			const response = await fetch(`${PUBLIC_GATEWAY_URL}/feedback`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: $jwtToken
				},
				body: JSON.stringify({
					feedback: feedbackText,
					rating: Number(rating)
				})
			});
			if (response.status === 401) {
				error = 'Setup wallet and sing up first';
			}
			if (response.status === 200) {
				successful = true;
			}
		} catch (err) {
			error = err.message;
		}
	};

	onMount(async() => {
		[isAuthenticated] = await checkAuth();
	});
</script>

<div class="artboard phone-2 p-5">
	<Header />
	<br />
	{#if successful}
		<div class="text-3xl text-center">Your feedback means a lot to us, so thank you :)</div>
	{:else if isAuthenticated}
		<div>
			<h1 class="text-3xl text-left mt-5 mb-5">Rate Us</h1>
			<div class="rating">
				<input
					type="radio"
					name="rating-2"
					class="mask mask-star-2 bg-orange-400"
					on:click={(e) => {
						selectRatingHandler(e);
					}}
					checked
					value="1"
				/>
				<input
					type="radio"
					name="rating-2"
					class="mask mask-star-2 bg-orange-400"
					on:click={(e) => {
						selectRatingHandler(e);
					}}
					value="2"
				/>
				<input
					type="radio"
					name="rating-2"
					class="mask mask-star-2 bg-orange-400"
					on:click={(e) => {
						selectRatingHandler(e);
					}}
					value="3"
				/>
				<input
					type="radio"
					name="rating-2"
					class="mask mask-star-2 bg-orange-400"
					on:click={(e) => {
						selectRatingHandler(e);
					}}
					value="4"
				/>
				<input
					type="radio"
					name="rating-2"
					class="mask mask-star-2 bg-orange-400"
					on:click={(e) => {
						selectRatingHandler(e);
					}}
					value="5"
				/>
			</div>
		</div>

		<div>
			<h1 class="text-5xl text-left mt-10 mb-5" class:text-red-500={error}>
				{error ?? 'Write to Us!'}
			</h1>
		</div>

		<textarea
			class="textarea textarea-success w-full h-44 bg-slate-100 dark:text-white dark:bg-gray-900 border border-zinc-600"
			placeholder="Write Here"
			bind:value={feedbackText}
		/>
		<button class="btn mt-2 mb-2" on:click={submitReviewHandler}>Submit</button>
	{:else}
		<AskToLogin />
	{/if}
</div>
