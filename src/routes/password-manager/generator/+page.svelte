<script lang="ts">
	import VpnHeader from '$lib/components/ui/vpn-header.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Copy, RefreshCw, ArrowLeft, CheckCircle2, Settings, Eye, EyeOff } from '@lucide/svelte';

	// Password generation settings
	let passwordSettings = $state({
		length: 16,
		includeUppercase: true,
		includeLowercase: true,
		includeNumbers: true,
		includeSymbols: true,
		excludeSimilar: false,
		excludeAmbiguous: false
	});

	// Generated password state
	let generatedPassword = $state('');
	let isVisible = $state(false);
	let isCopied = $state(false);
	let isGenerating = $state(false);

	// Password strength
	let passwordStrength = $state({ score: 0, label: 'Weak', color: '#dc2626' });

	// Character sets
	const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
	const NUMBERS = '0123456789';
	const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
	const SIMILAR_CHARS = 'il1Lo0O';
	const AMBIGUOUS_CHARS = '{}[]()/\\\'"`~,;.<>';

	// Generate password function
	function generatePassword() {
		isGenerating = true;
		
		// Small delay for UI feedback
		setTimeout(() => {
			let charset = '';
			
			if (passwordSettings.includeUppercase) charset += UPPERCASE;
			if (passwordSettings.includeLowercase) charset += LOWERCASE;
			if (passwordSettings.includeNumbers) charset += NUMBERS;
			if (passwordSettings.includeSymbols) charset += SYMBOLS;
			
			if (passwordSettings.excludeSimilar) {
				charset = charset.split('').filter(char => !SIMILAR_CHARS.includes(char)).join('');
			}
			
			if (passwordSettings.excludeAmbiguous) {
				charset = charset.split('').filter(char => !AMBIGUOUS_CHARS.includes(char)).join('');
			}
			
			if (charset.length === 0) {
				generatedPassword = '';
				passwordStrength = { score: 0, label: 'Invalid', color: '#dc2626' };
				isGenerating = false;
				return;
			}
			
			let password = '';
			const array = new Uint32Array(passwordSettings.length);
			crypto.getRandomValues(array);
			
			for (let i = 0; i < passwordSettings.length; i++) {
				password += charset[array[i] % charset.length];
			}
			
			generatedPassword = password;
			calculateStrength(password);
			isGenerating = false;
		}, 200);
	}

	// Calculate password strength
	function calculateStrength(password: string) {
		let score = 0;
		
		// Length bonus
		if (password.length >= 8) score += 20;
		if (password.length >= 12) score += 15;
		if (password.length >= 16) score += 10;
		
		// Character variety
		if (/[a-z]/.test(password)) score += 15;
		if (/[A-Z]/.test(password)) score += 15;
		if (/[0-9]/.test(password)) score += 15;
		if (/[^a-zA-Z0-9]/.test(password)) score += 20;
		
		// Bonus for mixed character types
		const types = [
			/[a-z]/.test(password),
			/[A-Z]/.test(password),
			/[0-9]/.test(password),
			/[^a-zA-Z0-9]/.test(password)
		].filter(Boolean).length;
		
		if (types >= 3) score += 5;
		if (types === 4) score += 5;
		
		score = Math.min(100, Math.max(0, score));
		
		let label, color;
		if (score >= 80) {
			label = 'Very Strong';
			color = '#16a34a';
		} else if (score >= 60) {
			label = 'Strong';
			color = '#65a30d';
		} else if (score >= 40) {
			label = 'Moderate';
			color = '#ca8a04';
		} else if (score >= 20) {
			label = 'Weak';
			color = '#dc2626';
		} else {
			label = 'Very Weak';
			color = '#991b1b';
		}
		
		passwordStrength = { score, label, color };
	}

	// Copy to clipboard
	async function copyPassword() {
		if (!generatedPassword) return;
		
		try {
			await navigator.clipboard.writeText(generatedPassword);
			isCopied = true;
			setTimeout(() => isCopied = false, 2000);
		} catch (err) {
			console.error('Failed to copy password:', err);
		}
	}

	// Auto-generate password on mount only
	onMount(() => {
		generatePassword();
	});
</script>

<!-- Fixed height container matching extension popup exactly -->
<div class="h-[600px] w-full bg-[#111111] text-white flex flex-col overflow-hidden">
	<!-- VpnHeader (~50px) -->
	<VpnHeader />
	
	<!-- Page header (~60px) -->
	<div class="px-4 py-3 border-b border-[#333333] bg-[#111111] shrink-0">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-lg font-semibold text-[#00ccba]">Password Generator</h1>
				<p class="text-xs text-gray-400">Create secure passwords instantly</p>
			</div>
			<button
				onclick={generatePassword}
				disabled={isGenerating}
				class="flex items-center gap-2 px-3 py-1.5 bg-[#00ccba] hover:bg-[#00b5a5] disabled:opacity-50 text-black font-medium rounded-lg text-sm transition-colors"
			>
				<RefreshCw class="w-3.5 h-3.5 {isGenerating ? 'animate-spin' : ''}" />
				{isGenerating ? 'Generating...' : 'Generate'}
			</button>
		</div>
	</div>

	<!-- Scrollable content area (flex-1 takes remaining space) -->
	<div class="flex-1 overflow-y-auto scrollbar-styled">
		<div class="p-4 space-y-4">
			<!-- Generated Password Display -->
			<div class="bg-[#1a1a1a] border border-[#333333] rounded-lg p-4">
				<div class="flex items-center justify-between mb-3">
					<h2 class="text-sm font-medium text-white">Generated Password</h2>
					<div class="flex items-center gap-2">
						<button
							onclick={() => isVisible = !isVisible}
							class="p-1.5 hover:bg-[#2a2a2a] rounded transition-colors"
							title={isVisible ? 'Hide password' : 'Show password'}
						>
							{#if isVisible}
								<EyeOff class="w-4 h-4 text-gray-400" />
							{:else}
								<Eye class="w-4 h-4 text-gray-400" />
							{/if}
						</button>
						{#if generatedPassword}
							<button
								onclick={copyPassword}
								class="p-1.5 hover:bg-[#2a2a2a] rounded transition-colors"
								title="Copy password"
							>
								{#if isCopied}
									<CheckCircle2 class="w-4 h-4 text-green-500" />
								{:else}
									<Copy class="w-4 h-4 text-gray-400" />
								{/if}
							</button>
						{/if}
					</div>
				</div>
				
				<div class="bg-[#0a0a0a] border border-[#333333] rounded-lg p-3 relative">
					<div class="font-mono text-sm text-white break-all min-h-[1.5rem] flex items-center">
						{#if generatedPassword}
							{isVisible ? generatedPassword : '•'.repeat(generatedPassword.length)}
						{:else}
							<span class="text-gray-500 italic">Click Generate to create a password</span>
						{/if}
					</div>
				</div>

				<!-- Password Strength -->
				{#if generatedPassword}
					<div class="mt-3 flex items-center gap-3">
						<div class="flex-1 h-1.5 bg-[#333333] rounded-full overflow-hidden">
							<div 
								class="h-full transition-all duration-300 rounded-full"
								style="width: {Math.max(5, passwordStrength.score)}%; background-color: {passwordStrength.color};"
							></div>
						</div>
						<span class="text-xs font-medium" style="color: {passwordStrength.color};">{passwordStrength.label}</span>
					</div>
				{/if}
			</div>

			<!-- Settings -->
			<div class="bg-[#1a1a1a] border border-[#333333] rounded-lg p-4">
				<div class="flex items-center gap-2 mb-4">
					<Settings class="w-4 h-4 text-[#00ccba]" />
					<h3 class="text-sm font-medium text-white">Generation Options</h3>
				</div>
				
				<div class="space-y-4">
					<!-- Length Slider -->
					<div>
						<div class="flex items-center justify-between mb-2">
							<span class="text-xs text-gray-300">Password Length</span>
							<span class="text-xs font-mono text-[#00ccba] bg-[#0a0a0a] px-2 py-0.5 rounded">{passwordSettings.length}</span>
						</div>
						<input
							type="range"
							min="4"
							max="50"
							bind:value={passwordSettings.length}
							class="w-full h-1.5 bg-[#333333] rounded-lg appearance-none cursor-pointer slider"
						/>
					</div>

					<!-- Character Type Options -->
					<div class="space-y-3">
						<div class="text-xs text-gray-400 font-medium">Include Characters:</div>
						<div class="grid grid-cols-2 gap-3">
							<label class="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									bind:checked={passwordSettings.includeUppercase}
									class="w-3.5 h-3.5 text-[#00ccba] bg-[#0a0a0a] border-[#333333] rounded focus:ring-[#00ccba] focus:ring-1"
								/>
								<span class="text-xs text-gray-300">Uppercase (A-Z)</span>
							</label>
							
							<label class="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									bind:checked={passwordSettings.includeLowercase}
									class="w-3.5 h-3.5 text-[#00ccba] bg-[#0a0a0a] border-[#333333] rounded focus:ring-[#00ccba] focus:ring-1"
								/>
								<span class="text-xs text-gray-300">Lowercase (a-z)</span>
							</label>
							
							<label class="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									bind:checked={passwordSettings.includeNumbers}
									class="w-3.5 h-3.5 text-[#00ccba] bg-[#0a0a0a] border-[#333333] rounded focus:ring-[#00ccba] focus:ring-1"
								/>
								<span class="text-xs text-gray-300">Numbers (0-9)</span>
							</label>
							
							<label class="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									bind:checked={passwordSettings.includeSymbols}
									class="w-3.5 h-3.5 text-[#00ccba] bg-[#0a0a0a] border-[#333333] rounded focus:ring-[#00ccba] focus:ring-1"
								/>
								<span class="text-xs text-gray-300">Symbols (!@#$)</span>
							</label>
						</div>
					</div>

					<!-- Advanced Options -->
					<div class="space-y-2">
						<div class="text-xs text-gray-400 font-medium">Advanced Options:</div>
						<div class="space-y-2">
							<label class="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									bind:checked={passwordSettings.excludeSimilar}
									class="w-3.5 h-3.5 text-[#00ccba] bg-[#0a0a0a] border-[#333333] rounded focus:ring-[#00ccba] focus:ring-1"
								/>
								<span class="text-xs text-gray-300">Exclude similar characters (il1Lo0O)</span>
							</label>
							
							<label class="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									bind:checked={passwordSettings.excludeAmbiguous}
									class="w-3.5 h-3.5 text-[#00ccba] bg-[#0a0a0a] border-[#333333] rounded focus:ring-[#00ccba] focus:ring-1"
								/>
								<span class="text-xs text-gray-300">Exclude ambiguous characters</span>
							</label>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Fixed bottom navigation (~60px) -->
	<div class="p-4 border-t border-[#333333] bg-[#111111] shrink-0">
		<button
			class="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#2a2a2a] to-[#1a1a1a] border border-[#333333] px-4 py-2.5 text-white font-medium transition-all duration-200 hover:from-[#3a3a3a] hover:to-[#2a2a2a] group"
			onclick={() => goto('/password-manager')}
		>
			<ArrowLeft class="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
			Back to Password Manager
		</button>
	</div>
</div>

<style>
	/* Custom slider styling */
	.slider::-webkit-slider-thumb {
		appearance: none;
		height: 14px;
		width: 14px;
		border-radius: 50%;
		background: #00ccba;
		cursor: pointer;
		border: 2px solid #111111;
		box-shadow: 0 0 0 1px #333333;
	}

	.slider::-moz-range-thumb {
		height: 14px;
		width: 14px;
		border-radius: 50%;
		background: #00ccba;
		cursor: pointer;
		border: 2px solid #111111;
		box-sizing: border-box;
	}

	.slider::-webkit-slider-track {
		background: #333333;
		border-radius: 4px;
	}

	.slider::-moz-range-track {
		background: #333333;
		border-radius: 4px;
	}

	/* Custom scrollbar styling */
	.scrollbar-styled::-webkit-scrollbar {
		width: 6px;
	}

	.scrollbar-styled::-webkit-scrollbar-track {
		background: rgba(51, 51, 51, 0.4);
		border-radius: 3px;
		margin: 0 8px;
	}

	.scrollbar-styled::-webkit-scrollbar-thumb {
		background: linear-gradient(180deg, #00ccba 0%, #00b5a5 100%);
		border-radius: 3px;
		transition: all 0.3s ease;
		border: 1px solid rgba(0, 0, 0, 0.1);
	}

	.scrollbar-styled::-webkit-scrollbar-thumb:hover {
		background: linear-gradient(180deg, #00eeda 0%, #00ccba 100%);
		transform: scaleX(1.2);
		box-shadow: 0 2px 4px rgba(0, 204, 186, 0.3);
	}

	.scrollbar-styled::-webkit-scrollbar-corner {
		background: transparent;
	}
</style>