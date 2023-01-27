<script>
	let showModal = false;
</script>

<div>
	<button class="text-xl text-center" on:click={() => (showModal = true)}>
		Change Password
	</button>
	<div class="modal modal-bottom sm:modal-middle" class:modal-open={showModal}>
		<div class="modal-box dark:bg-gray-900 dark:text-white">
			<button
				class="btn btn-sm btn-circle absolute right-2 top-2 cursor-pointer"
				on:click={() => (showModal = false)}
			>
				✕
			</button>

			<!-- Old Password -->
			<p class="text-md mt-5 mb-3">Old Password</p>
			<input
				type="text"
				placeholder="Old Password"
				class="input input-bordered dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs"
			/>
			<!-- New Password -->
			<p class="text-md mt-3 mb-3">New Password</p>
			<input
				type="text"
				placeholder="New Password"
				class="input input-bordered dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs"
			/>
			<!-- Confirm New Password -->
			<p class="text-md mt-3 mb-3">Confirm New Password</p>
			<input
				type="text"
				placeholder="Confirm New Password"
				class="input input-bordered dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs"
			/>

			<div class="modal-action">
				<button class="btn" on:click={() => (showModal = false)}> Change & Save </button>
			</div>
		</div>
	</div>
</div>
