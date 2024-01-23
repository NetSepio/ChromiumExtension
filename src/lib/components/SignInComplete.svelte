<!-- Sign in complete component -->
<script>
	// Variable to control the visibility of the modal
	let showModal = false;
</script>

<div class="grid flex-grow">
	<!-- Button to trigger the modal -->
	<button
		class="btn px-4 py-2 rounded-md"
		on:click={() => {
			showModal = true;
		}}
	>
		Submit
	</button>

	<!-- Modal container -->
	<div class="modal modal-bottom sm:modal-middle" class:modal-open={showModal}>
		<div class="modal-box bg-white text-black dark:bg-gray-900 dark:text-white">
			<!-- Close button for the modal -->
			<button
				class="btn btn-sm btn-circle absolute right-2 top-2"
				on:click={() => {
					showModal = false;
				}}
			>
				✕
			</button>
			<h3 class="font-bold text-3xl mt-5">Reviews</h3>
		</div>
	</div>
</div>
