<!-- Create profile page -->

<script>
	// Importing the Header component, jwtToken, and PUBLIC_GATEWAY_URL
	import Header from '$lib/components/Header.svelte';
	import { jwtToken } from '$lib/store/store';
	import { PUBLIC_GATEWAY_URL } from '$env/static/public';

	// Variables to store user input and handle errors
	let userName = $state('');
	let userImage = $state('');
	let error;

	// Function to handle creating/updating the user profile
	const handleCreateProfile = async () => {
		try {
			// Trimmed user input
			let trimmedUserName = userName.trim();
			let trimmedUserImage = userImage.trim();

			// Setting up headers for the API request
			let myHeaders = new Headers();
			myHeaders.append('Authorization', `Bearer ${$jwtToken}`);
			myHeaders.append('Content-Type', 'application/json');

			// Creating the request body
			let body = JSON.stringify({
				name: trimmedUserName,
				profilePictureUrl: trimmedUserImage
			});

			// Making a PATCH request to update the user profile
			const response = await fetch(`${PUBLIC_GATEWAY_URL}/profile`, {
				method: 'PATCH',
				headers: myHeaders,
				body
			});

			// Handling errors if the response status is not 200
			if (response.status !== 200) {
				error = 'Failed to update the profile';
			}
		} catch (error) {
			console.error(error);
		} finally {
			// Redirecting to the home page regardless of success/failure
			window.location.href = '/';
		}
	};
</script>

<!-- Component HTML structure -->
<div>
	<!-- Including the Header component -->
	<Header />
	<!-- Heading for the profile setting section -->
	<h1 class="text-xl font-bold text-center mt-4">Set your profile</h1>
	<br />

	<div>
		<!-- Input field for entering user name -->
		<label for="userName" class="text-sm text-left mt-4 mb-4">Enter name</label>
		<input name="userName" type="text" class="secondary-input" bind:value={userName} />
	</div>

	<div class="mt-12">
		<!-- Input field for entering profile URL -->
		<label for="userImage" class="text-sm text-left mt-4 mb-4">Enter profile URL</label>
		<input name="userImage" type="url" class="secondary-input" bind:value={userImage} />
	</div>

	<br />
	<div class="flex gap-4 w-full mt-5">
		<div class="grid flex-grow">
			<!-- Button to trigger the profile update -->
			<button class="btn primary-button" onclick={handleCreateProfile}> Save </button>
		</div>
	</div>
</div>
