<script lang="ts">
	import VpnHeader from '$lib/components/ui/vpn-header.svelte';
	import { goto } from '$app/navigation';
	import { Eye, EyeOff, Key, RefreshCw, ArrowLeft, Plus, Star } from '@lucide/svelte';
	import { PasswordManagerService } from '$lib/services/password-manager-service';
	import { passwordUtils } from '$lib/helpers/securePasswordManager';
	import { PasswordManagerCrypto } from '$lib/modules/passwordManagerCrypto';
	import { AuthGuard } from '$lib/helpers/authGuard';
	import { onMount } from 'svelte';
	
	// Form state
	let formData = $state({
		title: '',
		url: '',
		username: '',
		password: '',
		isFavorite: false
	});
	
	let showPassword = $state(false);
	let passwordStrength = $state({ score: 0, label: 'Weak' });
	let isGenerating = $state(false);
	let isSaving = $state(false);
	let saveSuccess = $state(false);
	let error = $state('');
	let showGenerator = $state(false);
	
	// Compact password generation settings
	let genLength = $state(16);
	let genOptions = $state({
		upper: true,
		lower: true,
		numbers: true,
		symbols: false
	});

	// Password manager service instance
	let passwordManager: PasswordManagerService | null = null;

	onMount(async () => {
		// Check wallet authentication first
		const authState = await AuthGuard.checkAuthState();
		if (!authState.isAuthenticated) {
			await goto('/sign-in');
			return;
		}
		
		try {
			passwordManager = PasswordManagerService.getInstance();
			const initResult = await passwordManager.initialize();
			
			if (!initResult.success) {
				console.error('Failed to initialize password manager:', initResult.error);
				error = 'Failed to initialize secure password storage: ' + (initResult.error || 'Unknown error');
				return;
			}
		} catch (err) {
			console.error('Password manager initialization error:', err);
			error = 'Password manager initialization failed: ' + (err instanceof Error ? err.message : 'Unknown error');
			return;
		}
		
		autofillFromCurrentTab();
	});
	
	// Calculate password strength
	$effect(() => {
		updatePasswordStrength(formData.password);
	});

	async function updatePasswordStrength(password: string) {
		if (!password) {
			passwordStrength = { score: 0, label: 'Weak' };
			return;
		}
		
		try {
			// Use passwordUtils directly for strength calculation
			const { score } = passwordUtils.getStrength(password);
			const { label } = passwordUtils.getStrengthLabel(score);
			passwordStrength = { 
				score, 
				label 
			};
		} catch (err) {
			console.error('Password strength calculation error:', err);
		}
	}

	async function generatePassword() {
		if (isGenerating) return;
		
		isGenerating = true;
		try {
			// Simple password generation
			const chars = {
				upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
				lower: 'abcdefghijklmnopqrstuvwxyz', 
				numbers: '0123456789',
				symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
			};
			
			let charset = '';
			if (genOptions.upper) charset += chars.upper;
			if (genOptions.lower) charset += chars.lower;
			if (genOptions.numbers) charset += chars.numbers;
			if (genOptions.symbols) charset += chars.symbols;
			
			if (charset.length === 0) {
				genOptions.lower = true;
				charset = chars.lower;
			}
			
			let password = '';
			for (let i = 0; i < genLength; i++) {
				const randomIndex = Math.floor(Math.random() * charset.length);
				password += charset[randomIndex];
			}
			
			formData.password = password;
			showPassword = true;
		} catch (err) {
			console.error('Password generation error:', err);
		} finally {
			isGenerating = false;
		}
	}

	async function savePassword() {
		if (isSaving || !formData.title.trim() || !formData.username.trim() || !formData.password.trim()) {
			return;
		}
		
		isSaving = true;
		error = '';
		
		try {
			if (!passwordManager) {
				throw new Error('Password manager not initialized');
			}
			
			// Encrypt the password
			const encryptionResult = await PasswordManagerCrypto.encryptData(formData.password);
			if (!encryptionResult.success) {
				throw new Error('Failed to encrypt password: ' + encryptionResult.error);
			}
			
			// Calculate password strength
			const { score: strengthScore } = passwordUtils.getStrength(formData.password);
			const { label: strengthLabel } = passwordUtils.getStrengthLabel(strengthScore);
			const strengthData = { score: strengthScore, label: strengthLabel };
			
			// Create password entry
			const passwordEntry = {
				title: formData.title.trim(),
				url: formData.url.trim(),
				username: formData.username.trim(),
				encryptedPassword: encryptionResult.data || '',
				notes: '',
				isFavorite: formData.isFavorite,
				tags: [],
				passwordHistory: [],
				customFields: [],
				strength: {
					score: strengthData?.score || 0,
					label: strengthData?.label as 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong' || 'Weak',
					feedback: [],
					crackTime: 'Unknown'
				}
			};
			
			// Save the password entry
			const saveResult = await passwordManager.addEntry(passwordEntry);
			if (!saveResult.success) {
				throw new Error(saveResult.error || 'Failed to save password');
			}
			
			// Show success state briefly
			saveSuccess = true;
			
			// Refresh password stats on main page
			if (typeof window !== 'undefined' && (window as any).refreshPasswordStats) {
				await (window as any).refreshPasswordStats();
			}
			
			// Wait a moment to show success, then redirect
			setTimeout(() => {
				goto('/password-manager');
			}, 1500);
		} catch (err) {
			console.error('Error saving password:', err);
			error = err instanceof Error ? err.message : 'Unknown error occurred';
			isSaving = false;
			saveSuccess = false;
		}
		// Note: Don't reset isSaving here to keep overlay during success state
	}

	async function autofillFromCurrentTab() {
		try {
			const tabs = await chrome?.tabs?.query({ active: true, currentWindow: true });
			if (tabs && tabs[0]) {
				const tab = tabs[0];
				if (tab.url && tab.title) {
					const url = new URL(tab.url);
					formData.url = url.hostname;
					if (!formData.title) {
						formData.title = url.hostname;
					}
				}
			}
		} catch (err) {
			console.log('Could not autofill from current tab:', err);
		}
	}

	function getStrengthColor(score: number) {
		if (score >= 80) return 'text-green-400';
		if (score >= 60) return 'text-yellow-400';
		if (score >= 40) return 'text-orange-400';
		return 'text-red-400';
	}

	function getStrengthBgColor(score: number) {
		if (score >= 80) return 'bg-green-500';
		if (score >= 60) return 'bg-yellow-500';
		if (score >= 40) return 'bg-orange-500';
		return 'bg-red-500';
	}
</script>

<section class="h-[600px] bg-[#0a0a0a] text-white flex flex-col">
	<!-- Header -->
	<div class="flex-shrink-0">
		<VpnHeader />
	</div>

	<!-- Content -->
	<div class="flex-1 flex flex-col px-4 py-3 overflow-hidden relative">
		<!-- Loading Overlay -->
		{#if isSaving}
			<div class="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
				<div class="bg-[#1a1a1a] border border-[#333333] rounded-lg p-6 flex flex-col items-center gap-4 max-w-xs mx-4">
					{#if saveSuccess}
						<div class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
							<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
							</svg>
						</div>
						<div class="text-center">
							<div class="text-white font-medium mb-1">Password Saved!</div>
							<div class="text-sm text-gray-400">Redirecting to vault...</div>
						</div>
					{:else}
						<RefreshCw size={32} class="animate-spin text-[#00ccba]" />
						<div class="text-center">
							<div class="text-white font-medium mb-1">Saving Password</div>
							<div class="text-sm text-gray-400">Encrypting and storing securely...</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Title Bar -->
		<div class="flex items-center gap-3 mb-4">
			<button
				onclick={() => goto('/password-manager')}
				class="p-2 rounded-lg bg-[#1a1a1a] border border-[#333333] hover:bg-[#2a2a2a] transition-colors"
			>
				<ArrowLeft size={16} />
			</button>
			<h1 class="text-lg font-semibold flex items-center gap-2">
				<Plus size={20} class="text-[#00ccba]" />
				Add New Password
			</h1>
		</div>

		{#if error}
			<div class="bg-red-900/20 border border-red-500/30 text-red-400 px-3 py-2 rounded-lg mb-4 text-sm">
				{error}
			</div>
		{/if}

		<!-- Main Form - Scrollable -->
		<div class="flex-1 overflow-y-auto custom-scroll space-y-4 pr-1">
			<!-- Basic Info -->
			<div class="space-y-3">
				<div class="grid grid-cols-2 gap-3">
					<div>
						<label for="site-name" class="block text-xs text-gray-400 mb-1">Site/App Name *</label>
						<input
							id="site-name"
							type="text"
							bind:value={formData.title}
							placeholder="Facebook, Gmail, etc."
							class="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg text-white placeholder-gray-500 focus:ring-1 focus:ring-[#00ccba] focus:border-transparent text-sm"
						/>
					</div>
					<div>
						<label for="website-url" class="block text-xs text-gray-400 mb-1">Website/URL</label>
						<input
							id="website-url"
							type="text"
							bind:value={formData.url}
							placeholder="facebook.com"
							class="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg text-white placeholder-gray-500 focus:ring-1 focus:ring-[#00ccba] focus:border-transparent text-sm"
						/>
					</div>
				</div>
				
				<div>
					<label for="username-email" class="block text-xs text-gray-400 mb-1">Username/Email *</label>
					<input
						id="username-email"
						type="text"
						bind:value={formData.username}
						placeholder="your@email.com"
						class="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg text-white placeholder-gray-500 focus:ring-1 focus:ring-[#00ccba] focus:border-transparent text-sm"
					/>
				</div>
			</div>

			<!-- Password Section -->
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<label for="password-input" class="block text-xs text-gray-400">Password *</label>
					<button
						type="button"
						onclick={() => showGenerator = !showGenerator}
						class="text-xs text-[#00ccba] hover:text-[#00eeda] transition-colors flex items-center gap-1"
					>
						<RefreshCw size={12} />
						Generate
					</button>
				</div>
				
				<div class="relative">
					<input
						id="password-input"
						type={showPassword ? 'text' : 'password'}
						bind:value={formData.password}
						placeholder="Enter or generate password"
						class="w-full px-3 py-2 pr-12 bg-[#1a1a1a] border border-[#333333] rounded-lg text-white placeholder-gray-500 focus:ring-1 focus:ring-[#00ccba] focus:border-transparent text-sm"
					/>
					<button
						type="button"
						onclick={() => showPassword = !showPassword}
						class="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
					>
						{#if showPassword}
							<EyeOff size={14} />
						{:else}
							<Eye size={14} />
						{/if}
					</button>
				</div>
				
				<!-- Password Strength -->
				{#if formData.password}
					<div class="flex items-center gap-2">
						<div class="flex-1 bg-[#1a1a1a] rounded-full h-1.5">
							<div
								class="h-full rounded-full transition-all duration-300 {getStrengthBgColor(passwordStrength.score)}"
								style="width: {passwordStrength.score}%"
							></div>
						</div>
						<span class="text-xs {getStrengthColor(passwordStrength.score)} font-medium whitespace-nowrap">
							{passwordStrength.label} ({passwordStrength.score}%)
						</span>
					</div>
				{/if}
			</div>

			<!-- Password Generator (Collapsible) -->
			{#if showGenerator}
				<div class="bg-[#1a1a1a] border border-[#333333] rounded-lg p-4 space-y-3">
					<div class="flex items-center justify-between">
						<span class="text-sm text-gray-300">Length: {genLength}</span>
						<button
							type="button"
							onclick={generatePassword}
							disabled={isGenerating}
							class="px-3 py-1.5 bg-[#00ccba] hover:bg-[#00b5a5] disabled:opacity-50 text-black text-xs font-medium rounded-3xl transition-colors flex items-center gap-1"
						>
							{#if isGenerating}
								<RefreshCw size={12} class="animate-spin" />
							{:else}
								<RefreshCw size={12} />
							{/if}
							Generate
						</button>
					</div>
					
					<input
						type="range"
						min="8"
						max="32"
						bind:value={genLength}
						class="w-full h-1 bg-[#333333] rounded-lg appearance-none cursor-pointer"
					/>
					
					<div class="grid grid-cols-2 gap-2 text-xs">
						<label class="flex items-center gap-1.5 text-gray-300">
							<input type="checkbox" bind:checked={genOptions.upper} class="rounded bg-[#0a0a0a] border-[#333333] text-[#00ccba] focus:ring-[#00ccba] w-3 h-3" />
							A-Z
						</label>
						<label class="flex items-center gap-1.5 text-gray-300">
							<input type="checkbox" bind:checked={genOptions.lower} class="rounded bg-[#0a0a0a] border-[#333333] text-[#00ccba] focus:ring-[#00ccba] w-3 h-3" />
							a-z
						</label>
						<label class="flex items-center gap-1.5 text-gray-300">
							<input type="checkbox" bind:checked={genOptions.numbers} class="rounded bg-[#0a0a0a] border-[#333333] text-[#00ccba] focus:ring-[#00ccba] w-3 h-3" />
							0-9
						</label>
						<label class="flex items-center gap-1.5 text-gray-300">
							<input type="checkbox" bind:checked={genOptions.symbols} class="rounded bg-[#0a0a0a] border-[#333333] text-[#00ccba] focus:ring-[#00ccba] w-3 h-3" />
							!@#$
						</label>
					</div>
				</div>
			{/if}

			<!-- Favorite Option -->
			<div>
				<label class="flex items-center gap-2 text-sm text-gray-300">
					<input type="checkbox" bind:checked={formData.isFavorite} class="rounded bg-[#0a0a0a] border-[#333333] text-[#00ccba] focus:ring-[#00ccba]" />
					<Star size={16} class={formData.isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'} />
					Mark as favorite
				</label>
			</div>
		</div>

		<!-- Action Buttons -->
		<div class="flex-shrink-0 flex gap-3 pt-4 border-t border-[#333333]">
			<button
				type="button"
				onclick={() => goto('/password-manager')}
				class="flex-1 px-4 py-2 bg-[#1a1a1a] border border-[#333333] text-white rounded-3xl hover:bg-[#2a2a2a] transition-colors text-sm font-medium"
			>
				Cancel
			</button>
			<button
				type="button"
				onclick={savePassword}
				disabled={isSaving || !formData.title.trim() || !formData.username.trim() || !formData.password.trim()}
				class="flex-1 px-4 py-2 bg-[#00ccba] hover:bg-[#00b5a5] disabled:opacity-50 disabled:cursor-not-allowed text-black font-medium rounded-3xl transition-colors flex items-center justify-center gap-2 text-sm"
			>
				{#if saveSuccess}
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
					</svg>
					Saved!
				{:else if isSaving}
					<RefreshCw size={14} class="animate-spin" />
					Saving...
				{:else}
					<Key size={14} />
					Save Password
				{/if}
			</button>
		</div>
	</div>
</section>

<style>
	.custom-scroll::-webkit-scrollbar {
		width: 4px;
	}

	.custom-scroll::-webkit-scrollbar-track {
		background: transparent;
	}

	.custom-scroll::-webkit-scrollbar-thumb {
		background: linear-gradient(180deg, #00ccba 0%, #00eeda 100%);
		border-radius: 4px;
		opacity: 0.6;
	}

	.custom-scroll::-webkit-scrollbar-thumb:hover {
		opacity: 1;
	}
</style>
