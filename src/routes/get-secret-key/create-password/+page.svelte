<script>
	import { redirect } from '@sveltejs/kit';

	let newPassword = '';
	let confirmPassword = '';
	let error = '';
	let termsAndConditions = true;

	const handleSubmit = () => {
		if (newPassword === confirmPassword && newPassword !== '' && newPassword.length >= 6) {
			error = '';
			throw redirect(307, '/login'); // ==== redirection not working
			// window.location.href = '/';
		} else if (newPassword.length < 6) {
			error = 'Password has to be at least 6 characters long';
		} else {
			error = 'Passwords are not matching';
		}
	};
</script>

<h1 class="text-5xl text-left mb-2">CREATE YOUR PASSWORD</h1>
<h1 class={`text-lg text-left mb-3.5 ${error !== '' ? 'text-red-500' : ''}`}>
	{error !== '' ? error : 'You will use this to unlock your wallet'}
</h1>
<div>
	<h2 class="text-xl text-left mt-3 mb-1">New Password</h2>
	<input
		type="password"
		class="input input-bordered w-full"
		placeholder="New Password"
		bind:value={newPassword}
	/>
</div>
<br />
<div>
	<h2 class="text-xl text-left mt-3 mb-1">Confirm Password</h2>
	<input
		type="password"
		class="input input-bordered w-full"
		placeholder="Confirm Password"
		bind:value={confirmPassword}
	/>
</div>

<div class="divider" />

<div class="form-control">
	<label class="label cursor-pointer">
		<span class="label-text">
			I agree to the{' '}
			<span class="text-lime-700">Terms of Service</span>
		</span>
		<input
			type="checkbox"
			class="checkbox"
			checked={termsAndConditions}
			on:change={() => (termsAndConditions = !termsAndConditions)}
		/>
	</label>
</div>

{#if termsAndConditions}
	<button on:click={handleSubmit} class="btn btn-wide">Confirm</button>
{:else}
	<button disabled class="btn btn-wide">Confirm</button>
{/if}
