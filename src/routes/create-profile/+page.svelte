<script>
	import Header from '$lib/components/Header.svelte';
	import { jwtToken } from '$lib/store/store';
	import { PUBLIC_GATEWAY_URL } from '$env/static/public';

	let userName = '';
	let userImage = '';
	let error;

	const handleCreateProfile = async () => {
		try {
			let trimmedUserName = userName.trim();
			// let trimmedUserCountry = userCountry.trim();
			let trimmedUserImage = userImage.trim();

			let myHeaders = new Headers();
			myHeaders.append('Authorization', `Bearer ${$jwtToken}`);
			myHeaders.append('Content-Type', 'application/json');

			let body = JSON.stringify({
				name: trimmedUserName,

				profilePictureUrl: trimmedUserImage
			});

			const response = await fetch(`${PUBLIC_GATEWAY_URL}/profile`, {
				method: 'PATCH',
				headers: myHeaders,
				body
			});

			if (response.status !== 200) {
				error = 'Failed to update the profile';
			}
		} catch (error) {
			console.error(error);
		} finally {
			window.location.href = '/';
		}
	};
</script>

<div>
	<Header />
	<h1 class="text-xl font-bold text-center mt-4">Set your profile</h1>
	<br />

	<div>
		<label for="userName" class="text-sm text-left mt-4 mb-4">Enter name</label>
		<input name="userName" type="text" class="secondary-input" bind:value={userName} />
	</div>

	<div class="mt-12">
		<label for="userImage" class="text-sm text-left mt-4 mb-4">Enter profile URL</label>
		<input name="userImage" type="url" class="secondary-input" bind:value={userImage} />
	</div>

	<br />
	<div class="flex gap-4 w-full mt-5">
		<div class="grid flex-grow">
			<button class="btn primary-button" on:click={handleCreateProfile}> Save </button>
		</div>
	</div>
</div>
