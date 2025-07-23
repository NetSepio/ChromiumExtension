<script lang="ts">
	import { browser } from '$app/environment';
	import {
		Eye,
		EyeClosed,
		Disc3,
		ArrowLeft,
		AlertCircle,
		CheckCircle,
		Shield
	} from '@lucide/svelte';
	import { askFlowId, sendSignature, signWithSolKey } from '$lib/modules/loginFunction';
	import {
		walletAddress,
		onboardingStepsLeft,
		jwtToken,
		getWalletAddress,
		setJWTToken
	} from '../../store/store';
	import Dialog from '$lib/components/ui/dialog.svelte';
	import { passwordUtils, SecurePasswordManager } from '$lib/helpers/securePasswordManager';
	import { setData } from '$lib/helpers/timeStamp';
	import { SecureStorage } from '$lib/helpers/secureStorage';
	import type { flowIdResponseType } from '../../types/types';
	import { handleAuthPageAccess } from '$lib/helpers/authGuard';
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	let password = $state('');
	let confirmPassword = $state('');
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let error = $state('');
	let showMessageModal = $state(false);
	let showStatus = $state(false);
	let flowIdResponse = $state<flowIdResponseType | undefined>(undefined);
	let address = $state('');
	let isCreating = $state(false);
	let creationStep = $state('');
	let isCheckingAuth = $state(true);

	// Check if user should be redirected away from this auth page
	onMount(async () => {
		try {
			console.log('Create password page: Checking auth redirect...');
			await handleAuthPageAccess(page.url.pathname);
			console.log('Create password page: Auth check completed');
		} catch (error) {
			console.error('Create password page: Auth check failed:', error);
		} finally {
			isCheckingAuth = false;
		}
	});

	let passwordStrength = $derived(
		password ? SecurePasswordManager.getPasswordStrength(password) : { score: 0, feedback: [] }
	);

	let strengthLabel = $derived(
		SecurePasswordManager.getPasswordStrengthLabel(passwordStrength.score)
	);
	let passwordsMatch = $derived(password && confirmPassword && password === confirmPassword);
	let isValidPassword = $derived(password.length >= 6 && passwordStrength.score >= 40);
	let canProceed = $derived(isValidPassword && passwordsMatch && !isCreating);

	// Get wallet address securely
	$effect(() => {
		getWalletAddress().then((addr) => {
			if (addr) {
				address = addr;
			}
		});
	});

	// Use $derived for computed values to avoid infinite loops

	async function handleSubmit() {
		error = '';

		if (password.length < 6) {
			error = 'Password must be at least 6 characters long';
			return;
		}

		if (passwordStrength.score < 40) {
			error = 'Password is too weak. Please choose a stronger password.';
			return;
		}

		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			return;
		}

		try {
			isCreating = true;
			creationStep = 'Getting authentication challenge...';

			// Get flow ID first
			flowIdResponse = await askFlowId();

			if (flowIdResponse?.payload?.eula) {
				showMessageModal = true;
				creationStep = 'Ready to sign authentication message';
			} else {
				error = 'Failed to get authentication challenge. Please try again.';
				isCreating = false;
				creationStep = '';
			}
		} catch (err) {
			console.error('Error getting flow ID:', err);
			error = 'Failed to initialize authentication. Please try again.';
			isCreating = false;
			creationStep = '';
		}
	}

	async function handleSave() {
		try {
			creationStep = 'Securing wallet with password...';

			// Store password for wallet (mnemonic is already in store from create-new-wallet)
			const walletResult = await passwordUtils.storePassword(password);

			if (!walletResult.success) {
				error = walletResult.error || 'Failed to secure wallet';
				showMessageModal = false;
				isCreating = false;
				creationStep = '';
				return;
			}

			creationStep = 'Signing authentication message...';

			// Check if flowIdResponse exists and has the required data
			if (!flowIdResponse?.payload?.eula) {
				error = 'Authentication data is missing. Please try again.';
				showMessageModal = false;
				isCreating = false;
				creationStep = '';
				return;
			}

			// Sign the authentication message
			const signature = await signWithSolKey(flowIdResponse.payload.eula);

			if (!signature) {
				error = 'Failed to sign authentication message';
				showMessageModal = false;
				isCreating = false;
				creationStep = '';
				return;
			}

			creationStep = 'Completing authentication...';

			// Send signature for authentication
			const loginResponse = await sendSignature(
				flowIdResponse.payload.flowId,
				address,
				signature,
				flowIdResponse.payload.eula
			);

			if (loginResponse.status === 200) {
				// Store JWT token in Chrome storage (persistent until logout)
				await setJWTToken(loginResponse.payload.token);

				// Also store in SecureStorage for backward compatibility
				await SecureStorage.setSessionItem('jwt_token', loginResponse.payload.token);

				setData('unlocked', 'true', 60);

				creationStep = 'Wallet created successfully!';
				showMessageModal = false;
				showStatus = true;
				onboardingStepsLeft.set(0);

				// Clear creation state
				isCreating = false;
				creationStep = '';
			} else {
				error = loginResponse.message || 'Authentication failed after wallet creation';
				showMessageModal = false;
				isCreating = false;
				creationStep = '';
			}
		} catch (err) {
			console.error('Error in handleSave:', err);
			error = 'Failed to create wallet. Please try again.';
			showMessageModal = false;
			isCreating = false;
			creationStep = '';
		}
	}

	// Handle password input changes
	function handlePasswordInput() {
		// Clear error when user starts typing
		if (error && password.length > 0) {
			error = '';
		}
	}

	function handleConfirmPasswordInput() {
		// Clear error when passwords match
		if (error && password === confirmPassword) {
			error = '';
		}
	}

	// Handle Enter key press
	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter' && canProceed) {
			handleSubmit();
		}
	}

	// Get strength color for progress bar
	function getStrengthColor(score: number) {
		if (score >= 80) return '#16a34a';
		if (score >= 60) return '#65a30d';
		if (score >= 40) return '#ca8a04';
		if (score >= 20) return '#dc2626';
		return '#991b1b';
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
	<section
		class="relative flex h-[600px] flex-col overflow-y-auto bg-[#101212] p-8 text-center text-white capitalize"
	>
		<button
			class="absolute top-8 left-8 cursor-pointer rounded p-1 transition-colors hover:bg-white/10"
			onclick={() => {
				onboardingStepsLeft.set(0);
				if (browser) {
					history.back();
				}
			}}
			disabled={isCreating}
		>
			<ArrowLeft color="#00ccba" />
		</button>

		<h1 class="mb-4 h-fit font-bold">Password</h1>

		<div class="mb-6 space-y-2">
			<h2 class="text-2xl font-bold">Set up your Password</h2>
			<p class="text-sm text-white/70 normal-case">
				Create a strong password to secure your wallet
			</p>
		</div>

		<div class="flex flex-1 flex-col space-y-4">
			<!-- Password Input -->
			<form class="relative grid space-y-2 text-sm" onsubmit={handleSubmit}>
				<label class="text-left font-bold" for="password">Password</label>
				<div class="relative">
					<input
						type={showPassword ? 'text' : 'password'}
						class="w-full rounded-lg border-none bg-[#3b3b3bbd] px-4 py-2 pr-12 outline-[#00887d] placeholder:text-white/80"
						placeholder="Enter your password"
						bind:value={password}
						oninput={handlePasswordInput}
						onkeypress={handleKeyPress}
						disabled={isCreating}
					/>
					<button
						type="button"
						class="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded p-1 transition-colors hover:bg-white/10"
						onclick={() => (showPassword = !showPassword)}
						disabled={isCreating}
					>
						{#if showPassword}
							<Eye size="18" color="#ffffff8f" />
						{:else}
							<EyeClosed size="18" color="#ffffff8f" />
						{/if}
					</button>
				</div>

				<!-- Password Strength Indicator -->
				{#if password}
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<span class="text-xs text-white/70">Password Strength:</span>
							<span class="text-xs font-medium" style="color: {strengthLabel.color}">
								{strengthLabel.label} ({passwordStrength.score}/100)
							</span>
						</div>

						<!-- Progress bar -->
						<div class="h-2 w-full rounded-full bg-gray-700">
							<div
								class="h-2 rounded-full transition-all duration-300"
								style="width: {passwordStrength.score}%; background-color: {getStrengthColor(
									passwordStrength.score
								)}"
							></div>
						</div>

						<!-- Feedback -->
						{#if passwordStrength.feedback.length > 0}
							<div class="text-left">
								{#each passwordStrength.feedback.slice(0, 3) as feedback}
									<p class="text-xs text-white/60 normal-case">• {feedback}</p>
								{/each}
							</div>
						{/if}
					</div>
				{/if}
			</form>

			<!-- Confirm Password Input -->
			<form class="relative grid space-y-2 text-sm">
				<label class="text-left font-bold" for="password">Confirm Password</label>
				<div class="relative">
					<input
						type={showConfirmPassword ? 'text' : 'password'}
						class="w-full rounded-lg border-none bg-[#3b3b3bbd] px-4 py-2 pr-12 outline-[#00887d] placeholder:text-white/80"
						placeholder="Confirm your password"
						bind:value={confirmPassword}
						oninput={handleConfirmPasswordInput}
						onkeypress={handleKeyPress}
						disabled={isCreating}
					/>
					<button
						type="button"
						class="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded p-1 transition-colors hover:bg-white/10"
						onclick={() => (showConfirmPassword = !showConfirmPassword)}
						disabled={isCreating}
					>
						{#if showConfirmPassword}
							<Eye size="18" color="#ffffff8f" />
						{:else}
							<EyeClosed size="18" color="#ffffff8f" />
						{/if}
					</button>
				</div>

				<!-- Password match indicator -->
				{#if confirmPassword}
					<div class="flex items-center gap-2 text-left">
						{#if passwordsMatch}
							<CheckCircle size="16" class="text-green-400" />
							<span class="text-xs text-green-400">Passwords match</span>
						{:else}
							<AlertCircle size="16" class="text-red-400" />
							<span class="text-xs text-red-400">Passwords do not match</span>
						{/if}
					</div>
				{/if}
			</form>

			<!-- Error message -->
			{#if error !== ''}
				<div class="flex items-center gap-2 text-left text-red-400">
					<AlertCircle size="16" />
					<p class="text-sm normal-case">{error}</p>
				</div>
			{/if}

			<!-- Creation status -->
			{#if isCreating && creationStep}
				<div class="flex items-center gap-2 text-left text-[#00ccba]">
					<Disc3 class="animate-spin" size="16" />
					<p class="text-sm normal-case">{creationStep}</p>
				</div>
			{/if}

			<!-- Security notice -->
			<div class="space-y-2 rounded-lg bg-[#2a2a2a] p-2">
				<div class="flex items-center gap-2 text-[#00ccba]">
					<Shield size="16" />
					<span class="text-sm font-medium">Security Notice</span>
				</div>
				<p class="text-left text-xs text-white/70 normal-case">
					Your password encrypts your wallet locally. We cannot recover it if lost. Store it safely
					and never share it with anyone.
				</p>
			</div>
		</div>

		<div class="mt-auto">
			<button
				class="w-full cursor-pointer rounded-3xl bg-gradient-to-b from-[#0b8f84] to-[#00ccba] py-2 text-black transition-all duration-200 hover:from-[#0a7d72] hover:to-[#00b3a6] disabled:cursor-not-allowed disabled:opacity-50"
				onclick={handleSubmit}
				disabled={!canProceed}
			>
				{#if isCreating}
					<div class="flex items-center justify-center gap-2">
						<Disc3 class="animate-spin" size="18" />
						Creating Wallet...
					</div>
				{:else}
					Continue
				{/if}
			</button>
		</div>
	</section>
{/if}
<!-- Message Signing Dialog -->
<Dialog open={showMessageModal} onClose={() => (showMessageModal = false)}>
	<div class="mx-auto max-w-md rounded-lg bg-[#101212d7] p-8 text-center">
		<h3 class="mb-4 text-xl font-bold text-white">Sign Authentication Message</h3>

		{#if flowIdResponse}
			<div class="mb-6 rounded-lg bg-[#2a2a2a] p-4">
				<p class="text-sm break-words text-white/90">{flowIdResponse?.payload?.eula}</p>
			</div>

			<p class="mb-6 text-sm text-white/70 normal-case">
				This message proves you own this wallet address to complete the setup process.
			</p>
		{:else}
			<div class="flex items-center justify-center gap-4 py-8">
				<p class="text-white/80">Loading authentication message...</p>
				<Disc3 class="animate-spin text-[#00ccba]" size="20" />
			</div>
		{/if}

		<!-- Creation step indicator -->
		{#if creationStep && showMessageModal}
			<div class="mb-4 flex items-center justify-center gap-2 text-[#00ccba]">
				<Disc3 class="animate-spin" size="16" />
				<span class="text-sm normal-case">{creationStep}</span>
			</div>
		{/if}

		<div class="mt-6 flex w-full items-center justify-center gap-4">
			<button
				class="flex-1 cursor-pointer rounded-3xl border border-[#0b8f84] py-2 text-[#00ccba] transition-colors hover:bg-[#0b8f84]/10"
				onclick={() => {
					showMessageModal = false;
					isCreating = false;
					creationStep = '';
				}}
				disabled={creationStep.includes('Securing') ||
					creationStep.includes('Signing') ||
					creationStep.includes('Completing')}
			>
				Cancel
			</button>
			<button
				class="flex-1 cursor-pointer rounded-3xl bg-gradient-to-b from-[#0b8f84] to-[#00ccba] py-2 text-black transition-all duration-200 hover:from-[#0a7d72] hover:to-[#00b3a6] disabled:opacity-50"
				onclick={handleSave}
				disabled={!flowIdResponse ||
					creationStep.includes('Securing') ||
					creationStep.includes('Signing') ||
					creationStep.includes('Completing')}
			>
				{#if creationStep.includes('Securing') || creationStep.includes('Signing') || creationStep.includes('Completing')}
					<div class="flex items-center justify-center gap-2">
						<Disc3 class="animate-spin" size="16" />
						Processing...
					</div>
				{:else}
					Create Wallet
				{/if}
			</button>
		</div>
	</div>
</Dialog>

<!-- Success Dialog -->
<Dialog open={showStatus} onClose={() => (showStatus = false)}>
	<div class="w-full rounded-lg bg-[#101212d7] p-8 text-center">
		{#if error !== ''}
			<h3 class="text-xl font-bold text-white">Unable to Create Wallet</h3>
			<div class="my-4 flex items-center justify-center gap-2 text-red-400">
				<AlertCircle size="24" />
				<p class="text-sm normal-case">{error}</p>
			</div>
			<div class="mt-8 flex w-full items-center justify-center gap-4">
				<button
					class="w-full cursor-pointer self-end rounded-3xl bg-gradient-to-b from-[#0b8f84] to-[#00ccba] py-2 text-black"
					onclick={() => (showStatus = false)}
				>
					Retry
				</button>
			</div>
		{:else}
			<h3 class="text-xl font-bold text-white">Congratulations!</h3>

			<div class="my-6 flex items-center justify-center">
				<CheckCircle size="48" class="text-[#00ccba]" />
			</div>

			<p class="mb-6 text-white/80 normal-case">
				Your secure wallet has been created successfully!
			</p>

			<div class="mt-8 flex w-full items-center justify-center gap-4 text-sm">
				<a
					class="w-full cursor-pointer self-end rounded-3xl bg-gradient-to-b from-[#0b8f84] to-[#00ccba] py-2 text-black transition-all duration-200 hover:from-[#0a7d72] hover:to-[#00b3a6]"
					href="/"
					onclick={() => (showStatus = false)}
				>
					Start Using Netsepio
				</a>
			</div>
		{/if}
	</div>
</Dialog>
