<script>
	let password = '';
	let error = '';

	const handleSubmit = () => {
		if (password.length >= 6) {
			error = '';
			//   navigate("/DashboardHome"); ==== redirection not working
		} else {
			let error = 'Enter a valid password';
		}
	};
</script>

<div class="artboard phone-3 p-5">
	<h1 class="text-5xl text-left">Wallet is locked!</h1>
	<p class="text-md mt-5 mb-3">Enter Password</p>
	<p class="text-md mt-5 mb-3 text-red-500">{error}</p>
	<input
		type="password"
		placeholder="Enter Password"
		class="input input-bordered input-md w-full max-w-xs"
		bind:value={password}
	/>
	<button class="btn mt-5" on:click={handleSubmit}> Unlock </button>
</div>
