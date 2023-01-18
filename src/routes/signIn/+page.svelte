<script>
	import { authenticateUser } from '$lib/modules/secondAuth'

	let password = '';

    function Authenticator() {
        const auu = authenticateUser(password)
        console.log(auu)
    }

	const handleSubmit = () => {
		if (password.length >= 6) {
			Authenticator();
			return "success"
		} else {
			let error = 'Enter a valid password';
			return error
		}
	};
	
</script>

<div class="artboard phone-3 p-5">
	<h1 class="text-5xl text-left">Wallet is locked!</h1>
	<p class="text-md mt-5 mb-3">Enter Password</p>
	<input
		type="password"
		placeholder="Enter Password"
		class="input input-bordered input-md w-full max-w-xs"
		bind:value={password}
	/>
	<button class="btn mt-5" on:click={handleSubmit}> Unlock </button>
</div>
