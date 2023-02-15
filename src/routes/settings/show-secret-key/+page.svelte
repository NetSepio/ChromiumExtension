<script>
	import Header from '$lib/components/Header.svelte';
	import SecretKey from '$lib/components/SecretKey.svelte';
</script>

<div class="artboard phone-3 p-5 mb-5 pb-5">
	<Header />
	<br />
	<h1 class="text-5xl mt-5 mb-10 text-left">Secret Key</h1>
	<p class="text-md mt-5 mb-3">Enter Password</p>
	<input
		type="text"
		placeholder="Old Password"
		class="input input-bordered input-md w-full max-w-xs mb-5"
	/>
	<SecretKey />
</div>
