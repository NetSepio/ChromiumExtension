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
		} catch (err: any) {
			error = err.message;
		}
	};

	onMount(async () => {
		[isAuthenticated] = await checkAuth();
	});
</script>

<div>
	<Header />

	<div class="mt-8 flex gap-8 items-center">
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M16.6185 2.99028C16.5024 2.87387 16.3645 2.78152 16.2126 2.7185C16.0608 2.65548 15.898 2.62305 15.7335 2.62305C15.5691 2.62305 15.4063 2.65548 15.2545 2.7185C15.1026 2.78152 14.9647 2.87387 14.8485 2.99028L6.53854 11.3003C6.44583 11.3928 6.37229 11.5027 6.32211 11.6237C6.27192 11.7446 6.24609 11.8743 6.24609 12.0053C6.24609 12.1362 6.27192 12.2659 6.32211 12.3869C6.37229 12.5079 6.44583 12.6178 6.53854 12.7103L14.8485 21.0203C15.3385 21.5103 16.1285 21.5103 16.6185 21.0203C17.1085 20.5303 17.1085 19.7403 16.6185 19.2503L9.37854 12.0003L16.6285 4.75028C17.1085 4.27028 17.1085 3.47028 16.6185 2.99028Z"
				fill="#11D9C5"
			/>
		</svg>

		<h1 class="text-2xl">Do u like netsepio?</h1>
	</div>

	<div>
		<p class="text-xs mt-5 mb-5">Rate Us</p>
		<div class="rating">
			<input
				type="radio"
				name="rating-2"
				class="mask mask-star-2 bg-[#11D9C5]"
				on:click={(e) => {
					selectRatingHandler(e);
				}}
				checked
				value="1"
			/>
			<input
				type="radio"
				name="rating-2"
				class="mask mask-star-2 bg-[#11D9C5]"
				on:click={(e) => {
					selectRatingHandler(e);
				}}
				value="2"
			/>
			<input
				type="radio"
				name="rating-2"
				class="mask mask-star-2 bg-[#788AA366]"
				on:click={(e) => {
					selectRatingHandler(e);
				}}
				value="3"
			/>
			<input
				type="radio"
				name="rating-2"
				class="mask mask-star-2 bg-[#788AA366]"
				on:click={(e) => {
					selectRatingHandler(e);
				}}
				value="4"
			/>
			<input
				type="radio"
				name="rating-2"
				class="mask mask-star-2 bg-[#788AA366]"
				on:click={(e) => {
					selectRatingHandler(e);
				}}
				value="5"
			/>
		</div>
	</div>

	<div>
		<h1 class="text-2xl text-left mt-10 mb-5" class:text-red-500={error}>
			{error ?? 'Additional feedback'}
		</h1>
	</div>

	<textarea
		class="textarea textarea-success w-full bg-transparent h-44 dark:text-white border dark:border-[#11D9C5]"
		placeholder="Write Here"
		bind:value={feedbackText}
	/>
	<button class="btn primary-button mt-2 mb-2" on:click={submitReviewHandler}>Submit</button>
</div>
