<script lang='ts'>
  import { PUBLIC_GATEWAY_URL } from '$env/static/public';
	import VpnHeader from '$lib/components/ui/vpn-header.svelte';
	import { checkAuth } from '$lib/modules/storePassword';
  import { jwtToken } from '../../store/store';

  let isAuthenticated = $state(false)
  let error = $state('')
  let rating = $state(0)
  let feedbackText = $state('')
  let successful = $state(false)

  // Function to handle the submission of the feedback or help
	const submitFeedback = async () => {
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
				window.location.href = '/';
			}
		} catch (err: any) {
			error = err.message;
		}
	};

  const selectRatingHandler = (e: any) => {
		rating = e.target.value;
	};

  $effect(() => {
    (async () => {
      [isAuthenticated] = await checkAuth()
    })();
  })
</script>

<section class="h-full pt-4 pb-8 px-8 bg-[#101212] text-white text-center capitalize relative text-sm">
  <VpnHeader wallet={false} />
  	{#if isAuthenticated}
		<div class="mt-8 ">

			<!-- Heading for the review section -->
			<h1 class="text-xl font-bold">Do you like netsepio?</h1>
		</div>

		<div>
			<!-- Rating input section -->
			<p class="text-xs mt-5 mb-5">Rate Us</p>
			<div class="rating">
        <input
          type="radio"
          name="rating-2"
          class="star"
          class:selected={rating === 1}
          onclick={(e) => {
            selectRatingHandler(e);
          }}
          value="1"
        />

				<input
					type="radio"
					
					class="star"
					class:bg-[#11D9C5]={rating !== 2}
					onclick={(e) => {
						selectRatingHandler(e);
					}}
					value="2"
				/>
				<input
					type="radio"
					name="rating-2"
					class:bg-[#11D9C5]={rating !== 3}
					onclick={(e) => {
						selectRatingHandler(e);
					}}
					value="3"
				/>
				<input
					type="radio"
					name="rating-2"
					
					class:bg-[#11D9C5]={rating !== 4}
					onclick={(e) => {
						selectRatingHandler(e);
					}}
					value="4"
				/>
				<input
					type="radio"
					name="rating-2"
				
					class:bg-[#11D9C5]={rating !== 5}
					onclick={(e) => {
						selectRatingHandler(e);
					}}
					value="5"
				/>
			</div>
		</div>

		<div>
			<!-- Displaying error or feedback section -->
			<h1 class="text-2xl text-left mt-10 mb-5" class:text-red-500={error}>
				{error ?? 'Additional feedback'}
			</h1>
		</div>

		<div class="grid space-y-2">
      <!-- Textarea for additional feedback -->
       <label for="">Let us know if you have any feedback or questions?</label>
      <textarea
        class="bg-[#3b3b3bbd] border-none outline-[#00887d] rounded-lg py-2 px-4 placeholder:text-white/80"			placeholder="Write Here"
        bind:value={feedbackText}
      ></textarea>
      <!-- Button to submit the review -->
      <button class="w-full rounded-3xl py-2 text-black cursor-pointer bg-gradient-to-b from-[#0b8f84] to-[#00ccba]" onclick={submitFeedback}>Submit</button>
    </div>
	{:else}
		<!-- Display a message for users who need to create a wallet to access the page -->
		<div class="flex flex-col justify-center">
			<a
				class="mt-12 text-center text-2xl font-bold text-[#263238] dark:text-white"
				href="/welcome">Create a wallet to access this page🙂</a
			>
		</div>
	{/if}
</section>


<style>
  .star {
    appearance: none;
    background-color: transparent;
    border: none;
    cursor: pointer;
    width: 25px;
    height: 25px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z' fill='currentColor'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
  }

  .star.selected {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z' fill='%2311D9C5'/%3E%3C/svg%3E");
  }
</style>