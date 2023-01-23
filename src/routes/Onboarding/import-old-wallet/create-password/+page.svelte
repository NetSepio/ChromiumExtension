<script>
	import { askFlowId, sendSignature, signWithPrivateKey } from '$lib/modules/functionsForLoging';
	import { encryptAndStorePassword } from '$lib/modules/secondAuth';
	import { jwtToken } from '$lib/store/store';

	let newPassword = '';
	let confirmPassword = '';
	let error = '';
	let loginResponse;
	let showModal = false;
	let termsAndConditions = true;
	let data;
	let signature;

	async function fetchData() {
		try {
			data = await askFlowId();
			signature = await signWithPrivateKey(data.payload);
			loginResponse = await sendSignature(data.payload.flowId, `${signature}`);
			encryptAndStorePassword(newPassword);
			jwtToken.set(loginResponse.payload.token);
			showModal = true;
		} catch (err) {
			error = `${err}`;
			throw err;
		}
	}

	const handleSubmit = () => {
		if (
			newPassword === confirmPassword &&
			newPassword !== '' &&
			newPassword.length >= 6 &&
			termsAndConditions
		) {
			error = '';
			showModal = true;
		} else if (newPassword.length < 6) {
			error = 'Password has to be at least 6 characters long';
		} else if (!termsAndConditions) {
			error = 'You need to accept the terms and conditions';
		} else {
			error = 'Passwords are not matching';
		}
	};

	const handleSave = () => {
		fetchData();
	};
</script>

<div class="artboard phone-1">
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

	<div class="modal" class:modal-open={showModal}>
		<div class="modal-box">
			<h1 class="text-5xl text-left mb-2">You are signing!</h1>
			<br />
			<h2 class="text-xl text-left">Message</h2>
			<br />
			<p class="text-lg text-left">
				ZenMate Free VPN is the best free VPN Chrome extension to hide your IP, Fast & Anonymous
				VPN. Free Download with 80+ VPN locations. 12343:324352
			</p>
			<br />
			<div class="flex w-full mt-2">
				<div class="grid flex-grow">
					<button class="btn mt-5" on:click={() => (showModal = false)}>CANCEL</button>
				</div>

				<div class="divider divider-horizontal" />

				<div class="grid flex-grow">
					<a href="/dashboard" class="btn mt-5 p-0">
						<button on:click={handleSave} class="btn w-full h-full"> Save </button>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
