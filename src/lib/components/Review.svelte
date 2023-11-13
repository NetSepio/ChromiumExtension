<script lang="ts">
	let showModal = false;
	export let stats;

	console.log(stats.map(stat => stat.siteSafety))
</script>

<div class="grid flex-grow">
	<button
		class="btn px-4 py-2 rounded-md"
		on:click={() => {
			showModal = true;
		}}
	>
		Reviews
	</button>
	<div class="modal modal-bottom sm:modal-middle" class:modal-open={showModal}>
		<div class="modal-box bg-white text-black dark:bg-gray-900 dark:text-white">
			<button
				class="btn btn-sm btn-circle absolute right-2 top-2"
				on:click={() => {
					showModal = false;
				}}
			>
				✕
			</button>
			<h3 class="font-bold text-3xl mt-5">Reviews</h3>
			<div>
				{#each stats as stat}
						{stat.siteSafety}
						{stat.count}
				{/each}
			</div>
		</div>
	</div>
</div>
