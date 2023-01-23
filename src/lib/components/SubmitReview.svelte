<script lang="ts">
	let showModal = false;
	let title: string;
	let description: string;
	let websiteUrl: string;
	let category: string;
	let siteTag: string;
	let siteSafety: string;
	let siteType: string;

	const handleSubmit = () => {
		console.log('Review submitted');
	};
</script>

<div class="grid flex-grow">
	<button
		class="ml-2 btn"
		on:click={() => {
			showModal = true;
		}}
	>
		Submit Review
	</button>
	<div class="modal" class:modal-open={showModal}>
		<div class="modal-box relative bg-white text-black dark:bg-gray-900 dark:text-white">
			<button
				class="btn btn-sm btn-circle absolute right-2 top-2"
				on:click={() => {
					showModal = false;
				}}
			>
				✕
			</button>
			<h3 class="font-bold text-3xl mt-5">Write your Reviews Here</h3>

			<!-- TITLE -->
			<p class="text-md mt-5 mb-3">TITLE</p>
			<input
				type="text"
				placeholder="TITLE"
				class="input input-bordered dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs"
				bind:value={title}
			/>
			<!-- DESCRIPTION -->
			<p class="text-md mt-3 mb-3">DESCRIPTION</p>
			<input
				type="text"
				placeholder="DESCRIPTION"
				class="input input-bordered dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs"
				bind:value={description}
			/>
			<!-- WEBSITE URL -->
			<p class="text-md mt-3 mb-3">WEBSITE URL</p>
			<input
				type="text"
				placeholder="WEBSITE URL"
				class="input input-bordered dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs"
				bind:value={websiteUrl}
			/>
			<!-- CATEGORY -->
			<p class="text-md mt-3 mb-3">CATEGORY</p>
			<input
				type="text"
				placeholder="CATEGORY"
				class="input input-bordered dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs"
				bind:value={category}
			/>
			<!-- SITE TYPE -->
			<p class="text-md mt-3 mb-3">SITE TYPE</p>
			<input
				type="text"
				placeholder="SITE TYPE"
				class="input input-bordered dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs"
				bind:value={siteType}
			/>
			<!-- SITE TAG -->
			<p class="text-md mt-3 mb-3">SITE TAG</p>
			<input
				type="text"
				placeholder="SITE TAG"
				class="input input-bordered dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs"
				bind:value={siteTag}
			/>
			<!-- SITE SAFETY -->
			<p class="text-md mt-3 mb-3">SITE SAFETY</p>
			<input
				type="text"
				placeholder="SITE SAFETY"
				class="input input-bordered dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs"
				bind:value={siteSafety}
			/>
			<div class="modal-action">
				<button class="btn" on:click={handleSubmit}> Submit </button>
			</div>
		</div>
	</div>
</div>
