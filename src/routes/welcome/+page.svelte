<script>
	import { goto } from '$app/navigation';
	import { onboardingStepsLeft } from '../../store/store';
	import { handleAuthPageAccess } from '$lib/helpers/authGuard';
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	let isCheckingAuth = $state(true);

	// Check if user should be redirected away from this auth page
	onMount(async () => {
		try {
			console.log('Welcome page: Checking auth redirect...');
			await handleAuthPageAccess(page.url.pathname);
			console.log('Welcome page: Auth check completed');
		} catch (error) {
			console.error('Welcome page: Auth check failed:', error);
		} finally {
			isCheckingAuth = false;
		}
	});

	function goToImport() {
		onboardingStepsLeft.set(2);
		goto('/import-wallet');
	}

	function goToCreate() {
		onboardingStepsLeft.set(2);
		goto('/create-new-wallet');
	}
</script>

{#if isCheckingAuth}
	<section class="flex h-full items-center justify-center bg-[#101212]">
		<div class="space-y-4 text-center">
			<div class="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-[#00ccba]"></div>
			<p class="text-sm text-white/70">Checking authentication...</p>
		</div>
	</section>
{:else}
	<section class="flex h-full flex-col items-center justify-between bg-[#101212] px-8 pt-10 pb-8">
		<div class="grid space-y-6 text-center">
			<img src="/assets/intro.png" alt="wallet intro" class="size-72" />
			<div>
				<h1 class="text-xl font-bold text-white">All-in-One Web3 Protection</h1>
				<h2 class="text-sm text-white/75">
					
User-friendly, non-custodial, blockchain-agnostic security extension
				</h2>
			</div>
		</div>
		<div class="grid w-full space-y-3 text-center">
			<button class="cursor-pointer text-[#00eeda] hover:underline" onclick={goToImport}
				>I already have a wallet</button
			>
			<button
				class="w-full cursor-pointer rounded-3xl bg-gradient-to-b from-[#0b8f84] to-[#00ccba] py-2 text-black"
				onclick={goToCreate}>Create new wallet</button
			>
		</div>
	</section>
{/if}
