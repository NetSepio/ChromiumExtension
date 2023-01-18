<script>
	import { askFlowId, sendSignature, signWithPrivateKey } from '$lib/modules/functionsForLoging';

	let newPassword = '';
	let confirmPassword = '';
	let error = '';
	let isAuthenticated = false;

	let termsAndConditions = true;

	const handleSubmit = () => {
		if (
			newPassword === confirmPassword &&
			newPassword !== '' &&
			newPassword.length >= 6 &&
			termsAndConditions
		) {
			error = '';
			let data;
			let signature;
			async function fetchData() {
				try {
					data = await askFlowId();
					signature = await signWithPrivateKey(data.payload);
					console.log(data);
					console.log(signature);
					isAuthenticated = await sendSignature(data.payload.flowId, `${signature}`); // FOR NOW THIS END POINT IS BLOCKED FROM CROSS-ORIGIN-REQUEST ====
					console.log(isAuthenticated);
				} catch (err) {
					error = `${err}`;
					throw err;
				}
			}
			fetchData();
			// window.location.href = '/dashboard';
		} else if (newPassword.length < 6) {
			error = 'Password has to be at least 6 characters long';
		} else if (!termsAndConditions) {
			error = 'You need to accept the terms and conditions';
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
