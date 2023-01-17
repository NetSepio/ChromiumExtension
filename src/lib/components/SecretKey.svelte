<script>
	let showModal = false;
</script>

<div>
	<button class="btn" on:click={() => (showModal = true)}> Submit </button>
	<div class="modal" class:modal-open={showModal}>
		<div class="modal-box">
			<h3 class="font-bold text-lg">Secret Recovery Password</h3>
			<br />
			<h3 class="text-sm">
				This is the only way you will be able to recover your account. Please store it somewhere
				safe!
			</h3>
			<p class="py-4 font-bold text-xl">
				afford mansion car rival service elder inflict loop prosper nothing luxury gossip
			</p>
			<div class="modal-action">
				<button class="btn" on:click={() => (showModal = false)}>
					<a href="#/SettingsHome">Close</a>
				</button>
			</div>
		</div>
	</div>
</div>
