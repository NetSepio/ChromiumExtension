<script lang="ts">
	import { askFlowId, sendSignature, signWithKey } from '$lib/modules/functionsForLogin';
	import Header from '$lib/components/Header.svelte';
	import { encryptAndStorePassword } from '$lib/modules/secondAuth';
	import { jwtToken, onboardingStepsLeft } from '$lib/store/store';

	interface payloadType {
		eula: string;
		flowId: string;
	}

	interface flowIdResponseType {
		status: number;
		message: string;
		payload: payloadType;
	}

	let newPassword = '';
	let confirmPassword = '';
	let error = '';
	let loginResponse;
	let showModal = false;
	let termsAndConditions = true;
	let data: flowIdResponseType;
	// let signature;
	let showSecondModal = false;

	async function fetchData() {
		try {
			const [signature, publicKey] = await signWithKey(data.payload);
			console.log(signature, publicKey)
			loginResponse = await sendSignature(data.payload.flowId, signature, publicKey);
			await encryptAndStorePassword(newPassword);
			jwtToken.set(loginResponse.payload.token);
			showModal = true;
		} catch (err) {
			error = `Something went wrong`;
			console.error(error);
		}
	}

	const handleSubmit = async () => {
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
		data = await askFlowId();
	};

	const handleSave = async () => {
		await fetchData();
		if (error.length < 1) {
			onboardingStepsLeft.set(0);
		}
		showSecondModal = true;
	};
</script>

<div>
	<Header />
	<div class="mt-6 w-4/5 mx-auto">
		<h1 class="text-3xl text-center my-3">Create Your Password</h1>
		<h1 class={`text-lg text-center mb-3 ${error !== '' ? 'text-red-500' : ''}`}>
			{error !== '' ? error : 'You will use this to unlock your wallet'}
		</h1>
		<div>
			<h2 class="text-xl text-left mt-3 mb-1">New Password</h2>
			<input
				type="password"
				class="input input-bordered w-full dark:bg-gray-800 dark:text-white"
				placeholder="New Password"
				bind:value={newPassword}
			/>
		</div>
		<br />
		<div>
			<h2 class="text-xl text-left mt-3 mb-1">Confirm Password</h2>
			<input
				type="password"
				class="input input-bordered w-full dark:bg-gray-800 dark:text-white"
				placeholder="Confirm Password"
				bind:value={confirmPassword}
			/>
		</div>

		<div class="divider" />

		<div class="form-control">
			<label class="label cursor-pointer">
				<span class="label-text dark:text-white">
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
			<button on:click={handleSubmit} class="btn btn-wide block mx-auto">Confirm</button>
		{:else}
			<button disabled class="btn btn-wide block mx-auto">Confirm</button>
		{/if}

		<!-- =================First modal============== -->
		<div class="modal" class:modal-open={showModal}>
			<div class="modal-box dark:bg-gray-800 dark:text-white">
				<h1 class="text-3xl text-center font-bold mb-2">You are signing!</h1>
				<br />
				<h2 class="text-xl text-left">Message</h2>
				<br />
				<p class="text-lg text-left dark:text-green-100">
					{`${data?.payload?.eula} ${data?.payload?.flowId} ` ?? '...'}
				</p>
				<br />
				<div class="flex w-full mt-2">
					<div class="grid flex-grow">
						<button class="btn mt-5" on:click={() => (showModal = false)}>CANCEL</button>
					</div>

					<div class="divider divider-horizontal" />

					<div class="grid flex-grow">
						<button class="btn w-full mt-5" on:click={handleSave}> Sign </button>
					</div>
				</div>
			</div>
		</div>

		<!-- ================Second Modal================ -->
		<div class="modal" class:modal-open={showSecondModal}>
			<div class="modal-box dark:bg-gray-800 dark:text-white">
				{#if error.length > 0}
					<h1 class="text-5xl text-left mb-2">Unable to sign-in ☹️!</h1>
					<br />
					<p class="text-lg text-left text-red-500">
						{error}
					</p>
					<br />
					<div class="flex w-full mt-2">
						<div class="grid flex-grow">
							<a href="/" class="btn w-full h-full"> Try later </a>
						</div>
						<div class="divider divider-horizontal" />
						<div class="grid flex-grow">
							<button
								class="btn w-full h-full"
								on:click={() => {
									showModal = false;
									showSecondModal = false;
								}}
							>
								Retry
							</button>
						</div>
					</div>
				{:else}
					<h1 class="text-5xl text-left mb-2">Lets go 🚀!</h1>
					<br />
					<p class="text-lg text-left text-green-500">You are all set ✅</p>
					<br />
					<div class="flex w-full mt-2">
						<div class="grid flex-grow">
							<a href="/" class="btn mt-5 p-0">
								<button class="btn w-full h-full"> Dashboard </button>
							</a>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
