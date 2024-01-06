<script lang="ts">
	import Dashboard from '$lib/components/Dashboard.svelte';

	import { onboardingStepsLeft } from '$lib/store/store';
	import { onMount } from 'svelte';

	let src = '/vector-logo.png';

	let firstTimeVistor = 0;
	let userStatus: number;

	function saveUser() {
		if (typeof localStorage !== 'undefined') {
			// Use localStorage here
			localStorage.setItem('newUser', String(firstTimeVistor + 1));
		} else {
			console.warn('localStorage is not available in this environment.');
		}
	}

	onMount(() => {
		userStatus = Number(localStorage.getItem('newUser'));
	});
</script>

{#if userStatus <= 0}
	<div>
		<div class="homepage">
			<div class="mt-40 mb-8">
				<img {src} alt="NetSepio logo" class="w-3/4 mx-auto block" />
				<h1 class="text-3xl font-bold text-center">Netsepio</h1>
			</div>
			<p class="text-sm text-center">
				AI Crypto Security, Advanced Tech Shields Against Crypto Scams and Rug Pulls
			</p>

			<a href="/" class="block mt-40">
				<button
					class="bg-[#11D9C5] btn btn-wide text-black hover:text-white hover:bg-[#11d9c5]/50"
					on:click={() => {
						onboardingStepsLeft.set(3);
						saveUser();
					}}
				>
					Get Started
				</button>
			</a>
		</div>
	</div>
{:else}
	<Dashboard />
{/if}
