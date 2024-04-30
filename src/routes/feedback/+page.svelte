<!-- Feedback page -->

<script lang="ts">
	// Importing necessary modules and components
	import Header from '$lib/components/Header.svelte';
	import { PUBLIC_GATEWAY_URL } from '$env/static/public';
	import { onMount } from 'svelte';
	import { checkAuth } from '$lib/modules/secondAuth';
	import { jwtToken } from '$lib/store/store';
	import { goto } from '$app/navigation';

	// Component's variables
	let rating: number;
	let feedbackText: string;
	let error: string;
	let successful: boolean = !true;
	let isAuthenticated: boolean = false;

	// Function to handle the selection of rating
	const selectRatingHandler = (e: any) => {
		rating = e.target.value;
	};

	// Function to handle the submission of the review
	const submitReviewHandler = async () => {
		console.log(`Bearer ${$jwtToken}`);

		try {
			const response = await fetch(`${PUBLIC_GATEWAY_URL}/feedback`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${$jwtToken}`
				},
				body: JSON.stringify({
					feedback: feedbackText,
					rating: Number(rating)
				})
			});

			// Handling different response statuses
			if (response.status === 401) {
				error = 'Setup wallet and sign up first';
			}
			if (response.status === 200) {
				successful = true;
				// goto('/');
			}
		} catch (err: any) {
			error = err.message;
			console.log(err);
		}
	};

	// Checking authentication status on component mount
	onMount(async () => {
		[isAuthenticated] = await checkAuth();
	});
</script>

<!-- Component HTML structure -->
<div>
	<!-- Including the Header component -->
	<Header />
	{#if successful}
		<div class="h-[460px] text-center flex flex-col items-center justify-center gap-4">
			<!-- Success illustration with a circle and path -->
			<img src="/good.svg" alt="good" />

			<!-- Success message -->
			<h1 class="text-black dark:text-white text-xl text-center font-bold">
				Successfully submitted!
			</h1>

			<!-- Button to navigate to the homepage -->
			<a href="/" class="w-full">
				<button class="w-[200px] primary-button">Home</button>
			</a>
		</div>
	{:else}
		<div class="w-[80%] pt-[7%] flex flex-col mx-auto">
			{#if isAuthenticated}
				<a href="/">
					<!-- SVG icon for navigating back -->
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						class="fill-[#263238] dark:fill-[#11D9C5]"
					>
						<path
							d="M16.6185 2.99028C16.5024 2.87387 16.3645 2.78152 16.2126 2.7185C16.0608 2.65548 15.898 2.62305 15.7335 2.62305C15.5691 2.62305 15.4063 2.65548 15.2545 2.7185C15.1026 2.78152 14.9647 2.87387 14.8485 2.99028L6.53854 11.3003C6.44583 11.3928 6.37229 11.5027 6.32211 11.6237C6.27192 11.7446 6.24609 11.8743 6.24609 12.0053C6.24609 12.1362 6.27192 12.2659 6.32211 12.3869C6.37229 12.5079 6.44583 12.6178 6.53854 12.7103L14.8485 21.0203C15.3385 21.5103 16.1285 21.5103 16.6185 21.0203C17.1085 20.5303 17.1085 19.7403 16.6185 19.2503L9.37854 12.0003L16.6285 4.75028C17.1085 4.27028 17.1085 3.47028 16.6185 2.99028Z"
						/>
					</svg>
				</a>

				<!-- Heading for the review section -->
				<h1 class="text-2xl mt-[10%] mb-[5%] self-center semiBold">Do you like Netsepio?</h1>

				<div>
					<!-- Rating input section -->
					<p class="text-xs mt-5 mb-[2%]">Rate Us</p>
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
							class="mask mask-star-2"
							class:bg-[#11D9C5]={rating !== 2}
							on:click={(e) => {
								selectRatingHandler(e);
							}}
							value="2"
						/>
						<input
							type="radio"
							name="rating-2"
							class="mask mask-star-2"
							class:bg-[#11D9C5]={rating !== 3}
							on:click={(e) => {
								selectRatingHandler(e);
							}}
							value="3"
						/>
						<input
							type="radio"
							name="rating-2"
							class="mask mask-star-2"
							class:bg-[#11D9C5]={rating !== 4}
							on:click={(e) => {
								selectRatingHandler(e);
							}}
							value="4"
						/>
						<input
							type="radio"
							name="rating-2"
							class="mask mask-star-2"
							class:bg-[#11D9C5]={rating !== 5}
							on:click={(e) => {
								selectRatingHandler(e);
							}}
							value="5"
						/>
					</div>
				</div>

				<div>
					<!-- Displaying error or feedback section -->
					<h1 class="text-sm text-left mt-10 mb-5" class:text-red-500={error}>
						{error ?? 'Additional feedback'}
					</h1>
				</div>

				<!-- Textarea for additional feedback -->
				<textarea
					class="textarea textarea-success w-full bg-transparent h-[128px] resize-none mb-[23px] dark:text-white border dark:border-[#11D9C5]"
					placeholder="Write Here"
					bind:value={feedbackText}
				/>

				<!-- Button to submit the review -->
				<button class="primary-button mt-2 mb-2" on:click={submitReviewHandler}>Submit</button>
			{:else}
				<!-- Display a message for users who need to create a wallet to access the page -->
				<div class="h-[450px] flex flex-col justify-center">
					<a
						class="mt-12 text-center text-2xl font-bold text-[#263238] dark:text-white"
						href="/onboarding">Create a wallet to access this page🙂</a
					>
				</div>
			{/if}
		</div>
	{/if}
</div>
