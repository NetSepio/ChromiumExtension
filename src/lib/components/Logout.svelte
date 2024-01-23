<!-- Logout component -->
<script lang="ts">
	// Importing necessary store variables
	import {
		mnemonicPhrase,
		setJwtToken,
		walletAddress,
		onboardingStepsLeft,
		avatar
	} from '$lib/store/store';

	// Component state variables
	let showModal = false;
	let captcha = false;
	let value = '';

	// Function to handle the logout/reset action
	const handleLogout = async () => {
		// Clearing sensitive data and resetting states
		await mnemonicPhrase.remove();
		setJwtToken('');
		walletAddress.set('');
		onboardingStepsLeft.set(3);
		localStorage.removeItem('encryptedMnemonic');
		localStorage.removeItem('iv');
		localStorage.removeItem('mnemonicHash');
		avatar.set('');
		showModal = false;
	};
</script>

<div>
	<!-- Button to trigger the password reset confirmation -->
	<button on:click={() => (showModal = true)} class="primary-button"> Reset password </button>

	<!-- Modal for password reset confirmation -->
	<div class="modal modal-bottom sm:modal-middle" class:modal-open={showModal}>
		<div class="modal-box dark:bg-[#171C2F] dark:text-white">
			<!-- Close button for the modal -->
			<button
				class="btn btn-sm btn-circle absolute right-2 top-2"
				on:click={() => {
					showModal = false;
				}}
			>
				✕
			</button>

			<!-- Text prompting the user to enter 'reset' -->
			<p class="text-md mt-5 mb-3 text-center">Enter 'reset'</p>

			<!-- Input field for the user to enter 'reset' -->
			<input
				type="text"
				placeholder="reset"
				class="secondary-input"
				bind:value
				on:change={() => {
					if (value == 'reset') {
						captcha = true;
					}
				}}
			/>

			<!-- Conditional rendering based on the captcha state -->
			{#if captcha}
				<!-- Modal action buttons when captcha is true -->
				<div class="modal-action">
					<a href="/">
						<button class="btn w-full primary-button" on:click={handleLogout}> Reset </button>
					</a>
				</div>
			{:else}
				<!-- Modal action button when captcha is false -->
				<div class="modal-action">
					<button class="btn w-full primary-button" disabled> Reset </button>
				</div>
			{/if}
		</div>
	</div>
</div>
