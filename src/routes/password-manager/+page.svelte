<script lang="ts">
	import VpnHeader from '$lib/components/ui/vpn-header.svelte';
	import Dialog from '$lib/components/ui/dialog.svelte';
	import { goto } from '$app/navigation';
	import { Plus, Search, Shield, Key, Settings, Download, Upload, X, Eye, Copy } from '@lucide/svelte';
	import { PasswordManagerService } from '$lib/services/password-manager-service';
	import { PasswordManagerCrypto } from '$lib/modules/passwordManagerCrypto';
	import { AuthGuard } from '$lib/helpers/authGuard';
	import { onMount } from 'svelte';
	
	// Mock data for now - will be replaced with actual service calls
	let searchQuery = $state('');
	let passwordCount = $state(0);
	let weakPasswordCount = $state(0);
	let duplicatePasswordCount = $state(0);
	let lastAuditDate = $state(new Date().toLocaleDateString());
	
	// Authentication state
	let isUserAuthenticated = $state(false);
	let isLoading = $state(true);
	let passwordManager: PasswordManagerService | null = null;
	
	// Initialize and check authentication
	onMount(async () => {
		try {
			const authState = await AuthGuard.checkAuthState();
			isUserAuthenticated = authState.isAuthenticated;
			
			if (!isUserAuthenticated) {
				// Redirect to sign-in if not authenticated
				await goto('/sign-in');
				return;
			}
			
			// Initialize password manager with independent encryption
			try {
				passwordManager = PasswordManagerService.getInstance();
				
				console.log('Attempting to initialize password manager...');
				const initResult = await passwordManager.initialize();
				console.log('Password manager initialization result:', initResult);
				
				if (!initResult.success) {
					console.error('Password manager initialization failed:', initResult.error);
					// This could happen if there's a storage issue, but not related to wallet authentication
				} else {
					console.log('Password manager initialized with independent encryption');
				}
			} catch (err) {
				console.error('Password manager setup error:', err);
			}
			
			console.log('User authenticated, password manager accessible');
			
			// Load password statistics
			await loadPasswordStats();
		} catch (error) {
			console.error('Authentication check failed:', error);
			await goto('/sign-in');
		} finally {
			isLoading = false;
		}
	});
	
	// Load password statistics from the service
	async function loadPasswordStats() {
		if (!passwordManager || !passwordManager.isServiceInitialized()) {
			console.log('Password manager not initialized, keeping default stats');
			return;
		}
		
		try {
			const result = await passwordManager.getAllEntries();
			if (result.success && result.data) {
				passwordCount = result.data.length;
				weakPasswordCount = result.data.filter(entry => 
					entry.strength.label.toLowerCase().includes('weak') || 
					entry.strength.label.toLowerCase().includes('very weak')
				).length;
				// For now, set duplicates to 0 until we implement duplicate detection
				duplicatePasswordCount = 0;
				console.log(`Loaded ${passwordCount} passwords, ${weakPasswordCount} weak`);
			}
		} catch (error) {
			console.error('Failed to load password statistics:', error);
		}
	}
	
	// Refresh stats (can be called from other components)
	async function refreshStats() {
		await loadPasswordStats();
	}
	
	// Make refresh function available globally for other components
	if (typeof window !== 'undefined') {
		(window as any).refreshPasswordStats = refreshStats;
	}
	
	// Recently used passwords - real data structure (empty until connected to data source)
	let recentlyUsed = $state<{
		id: string;
		name: string;
		username: string;
		url: string;
		lastUsed: string;
		favicon: string;
	}[]>([]);
	
	// Dialog state
	let showPasswordDialog = $state(false);
	let selectedEntry = $state<{
		id: string;
		name: string;
		username: string;
		url: string;
		lastUsed: string;
		favicon: string;
		password?: string;
	} | null>(null);
	let dialogTimeout = $state<NodeJS.Timeout | null>(null);
	
	// Quick stats for dashboard
	let stats = $derived({
		total: passwordCount,
		weak: weakPasswordCount,
		duplicates: duplicatePasswordCount,
		score: passwordCount === 0 ? 0 : Math.max(0, 100 - (weakPasswordCount * 10) - (duplicatePasswordCount * 15))
	});
	
	async function handleSearch() {
		if (searchQuery.trim()) {
			// Navigate to vault with search query
			await goto(`/password-manager/vault?search=${encodeURIComponent(searchQuery.trim())}`);
		} else {
			// Navigate to vault without search
			await goto('/password-manager/vault');
		}
	}
	
	async function showEntryDetails(entry: {
		id: string;
		name: string;
		username: string;
		url: string;
		lastUsed: string;
		favicon: string;
	}) {
		try {
			let decryptedPassword = 'Loading...';
			
			// Use secure password manager service to retrieve encrypted password
			if (passwordManager) {
				const entryResult = await passwordManager.getEntry(entry.id);
				if (entryResult.success && entryResult.data?.encryptedPassword) {
					// Decrypt the password using the crypto module
					const decryptResult = await PasswordManagerCrypto.decryptData<string>(
						entryResult.data.encryptedPassword
					);
					if (decryptResult.success) {
						decryptedPassword = decryptResult.data || 'Unable to decrypt';
					} else {
						decryptedPassword = 'Decryption failed';
						console.error('Password decryption failed:', decryptResult.error);
					}
				} else {
					decryptedPassword = 'Password not found';
					console.error('Failed to retrieve password:', entryResult.error);
				}
			} else {
				decryptedPassword = 'Service not initialized';
				console.error('Password manager service not available');
			}
			
			selectedEntry = {
				...entry,
				password: decryptedPassword
			};
		} catch (error) {
			console.error('Error retrieving password:', error);
			selectedEntry = {
				...entry,
				password: 'Error: Unable to decrypt password'
			};
		}
		
		showPasswordDialog = true;
		
		// Set 10-second security timeout
		if (dialogTimeout) {
			clearTimeout(dialogTimeout);
		}
		dialogTimeout = setTimeout(() => {
			closeDialog();
		}, 10000);
	}
	
	function closeDialog() {
		showPasswordDialog = false;
		selectedEntry = null;
		if (dialogTimeout) {
			clearTimeout(dialogTimeout);
			dialogTimeout = null;
		}
	}
	
	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text).then(() => {
			// Could add a toast notification here
			console.log('Copied to clipboard');
		});
	}
</script>

<section class="h-full overflow-y-auto bg-[#111111] text-white password-manager-scroll">
	<VpnHeader />
	
	<div class="space-y-6 p-6">
		<!-- Header -->
		<div class="text-center space-y-2">
			<div class="flex items-center justify-center gap-2 mb-4">
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#00ccba]/20">
					<Shield color="#00ccba" size="24" />
				</div>
			</div>
			<h1 class="text-xl font-bold text-[#00ccba]">Password Manager</h1>
			<p class="text-sm text-white/70">Secure password vault and generator</p>
		</div>

		<!-- Security Dashboard -->
		<div class="rounded-xl border border-[#333333] bg-[#1a1a1a] p-4 space-y-4">
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-semibold text-white">Security Overview</h2>
				<!-- <button
					onclick={() => goto('/password-manager/security-audit')}
					class="text-xs text-[#00ccba] hover:text-[#00eeda] transition-colors"
				>
					View Details →
				</button> -->
			</div>
			
			<!-- Security Score -->
			<div class="grid grid-cols-2 gap-4">
				<div class="text-center p-3 rounded-lg bg-[#0a0a0a] border border-[#333333]">
					<div class="text-sm font-medium text-gray-400">Coming Soon</div>
					<div class="text-xs text-gray-400">Security Score</div>
				</div>
				<div class="text-center p-3 rounded-lg bg-[#0a0a0a] border border-[#333333]">
					<div class="text-2xl font-bold text-white">{stats.total}</div>
					<div class="text-xs text-gray-400">Total Passwords</div>
				</div>
			</div>
			
			<!-- Issues Summary -->
			<div class="grid grid-cols-2 gap-2">
				<div class="flex items-center gap-2 p-2 rounded bg-red-500/10 border border-red-500/20">
					<div class="w-2 h-2 rounded-full bg-red-400"></div>
					<span class="text-xs text-red-400">{stats.weak} Weak</span>
				</div>
				<div class="flex items-center gap-2 p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
					<div class="w-2 h-2 rounded-full bg-yellow-400"></div>
					<span class="text-xs text-yellow-400">{stats.duplicates} Duplicates</span>
				</div>
			</div>
			
			<div class="text-xs text-gray-500 text-center">
				Last audit: {lastAuditDate}
			</div>
		</div>

		<!-- Search Bar -->
		<div class="relative">
			<div class="absolute inset-y-0 left-0 flex items-center pl-3">
				<Search color="#666666" size="16" />
			</div>
			<input
				bind:value={searchQuery}
				placeholder="Search passwords..."
				class="w-full bg-[#1a1a1a] border border-[#333333] rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:border-[#00ccba] focus:outline-none focus:ring-1 focus:ring-[#00ccba]"
				oninput={handleSearch}
			/>
		</div>

		<!-- Quick Actions -->
		<div class="grid grid-cols-2 gap-2">
			<button
				onclick={() => goto('/password-manager/vault')}
				class="group p-4 rounded-xl border border-[#333333] bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-all duration-200"
			>
				<div class="flex items-center justify-between mb-2">
					<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00ccba]/20 group-hover:bg-[#00ccba]/30 transition-colors">
						<Key color="#00ccba" size="18" />
					</div>
					<div class="text-right">
						<div class="text-lg font-bold text-white">{passwordCount}</div>
						<div class="text-xs text-gray-400">Entries</div>
					</div>
				</div>
				<h3 class="text-sm font-semibold text-white">View Vault</h3>
				<p class="text-xs text-gray-400 ">Access all passwords</p>
			</button>

			<button
				onclick={() => goto('/password-manager/add-password')}
				class="group p-4 rounded-xl border border-[#333333] bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-all duration-200"
			>
				<div class="flex items-center justify-between mb-2">
					<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
						<Plus color="#10b981" size="18" />
					</div>
					<div class="text-right">
						<div class="text-lg font-bold text-green-400">New</div>
					</div>
				</div>
				<h3 class="text-sm font-semibold text-white">Add Password</h3>
				<p class="text-xs text-gray-400">Create new entry</p>
			</button>
		</div>

		<!-- Tools & Settings -->
		<div class="space-y-3">
			<h3 class="text-sm font-semibold text-white">Tools & Settings</h3>
			<div class="space-y-2">
				<button
					onclick={() => goto('/password-manager/generator')}
					class="flex w-full items-center gap-3 rounded-lg p-3 bg-[#1a1a1a] border border-[#333333] hover:bg-[#2a2a2a] transition-colors"
				>
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
						<Key color="#3b82f6" size="16" />
					</div>
					<div class="flex-1 text-left">
						<div class="text-sm font-medium text-white">Password Generator</div>
						<div class="text-xs text-gray-400">Create strong passwords</div>
					</div>
				</button>

				<button
					disabled
					class="flex w-full items-center gap-3 rounded-lg p-3 bg-[#1a1a1a] border border-[#333333] opacity-50 cursor-not-allowed transition-colors"
				>
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20">
						<Shield color="#ef4444" size="16" />
					</div>
					<div class="flex-1 text-left">
						<div class="text-sm font-medium text-white">Security Audit</div>
						<div class="text-xs text-gray-400">Coming Soon</div>
					</div>
				</button>

				<button
					onclick={() => goto('/password-manager/import-export')}
					class="flex w-full items-center gap-3 rounded-lg p-3 bg-[#1a1a1a] border border-[#333333] hover:bg-[#2a2a2a] transition-colors"
				>
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20">
						<Download color="#8b5cf6" size="16" />
					</div>
					<div class="flex-1 text-left">
						<div class="text-sm font-medium text-white">Import & Export</div>
						<div class="text-xs text-gray-400">Manage your data</div>
					</div>
				</button>

				<button
					onclick={() => goto('/password-manager/settings')}
					class="flex w-full items-center gap-3 rounded-lg p-3 bg-[#1a1a1a] border border-[#333333] hover:bg-[#2a2a2a] transition-colors"
				>
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-500/20">
						<Settings color="#6b7280" size="16" />
					</div>
					<div class="flex-1 text-left">
						<div class="text-sm font-medium text-white">Settings</div>
						<div class="text-xs text-gray-400">Configure preferences</div>
					</div>
				</button>
			</div>
		</div>

		<!-- Quick Access to Recent -->
		<div class="space-y-3">
			<div class="flex items-center justify-between">
				<h3 class="text-sm font-semibold text-white">Recently Used</h3>
				<button
					onclick={() => goto('/password-manager/vault')}
					class="text-xs text-[#00ccba] hover:text-[#00eeda] transition-colors"
				>
					View All →
				</button>
			</div>
			
			{#if recentlyUsed.length === 0}
				<div class="text-center py-8 px-4 rounded-lg bg-[#1a1a1a] border border-[#333333]">
					<Key color="#666666" size="32" class="mx-auto mb-2 opacity-50" />
					<p class="text-sm text-gray-400 mb-2">No passwords saved yet</p>
					<p class="text-xs text-gray-500">Start by adding your first password entry</p>
					<div class="mt-3 text-xs text-yellow-400 bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
						⚠️ This dashboard shows real data from your password vault
					</div>
				</div>
			{:else}
				<!-- Recently used entries -->
				<div class="space-y-2">
					{#each recentlyUsed as entry}
						<button
							onclick={() => showEntryDetails(entry)}
							class="flex w-full items-center gap-3 rounded-lg p-3 bg-[#1a1a1a] border border-[#333333] hover:bg-[#2a2a2a] transition-colors"
						>
							<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00ccba]/10 text-sm">
								{entry.favicon}
							</div>
							<div class="flex-1 text-left">
								<div class="text-sm font-medium text-white">{entry.name}</div>
								<div class="text-xs text-gray-400">{entry.username}</div>
							</div>
							<div class="text-xs text-gray-500">{entry.lastUsed}</div>
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Back Navigation -->
		<div class="border-t border-white/10 pt-4">
			<button
				class="w-full rounded-lg bg-[#2a2a2a] px-4 py-2 text-white transition-colors hover:bg-[#3a3a3a]"
				onclick={() => goto('/')}
			>
				← Back to Home
			</button>
		</div>
	</div>
</section>

<!-- Password Details Dialog -->
<Dialog open={showPasswordDialog} onClose={closeDialog}>
	{#if selectedEntry}
		<div class="bg-[#1a1a1a] border border-[#333333] rounded-2xl p-6 w-full max-w-md space-y-4">
			<!-- Header -->
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00ccba]/10 text-lg">
						{selectedEntry.favicon}
					</div>
					<div>
						<h3 class="text-lg font-semibold text-white">{selectedEntry.name}</h3>
						<p class="text-sm text-gray-400">{selectedEntry.url}</p>
					</div>
				</div>
				<button
					onclick={closeDialog}
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
				>
					<X color="#ef4444" size="16" />
				</button>
			</div>
			
			<!-- Password Details -->
			<div class="space-y-3">
				<div>
					<div class="flex items-center gap-2 p-3 rounded-lg bg-[#0a0a0a] border border-[#333333]">
						<span class="text-xs font-medium text-gray-400 mr-2">Username:</span>
						<span class="flex-1 text-sm text-white font-mono">{selectedEntry.username}</span>
						<button
							onclick={() => copyToClipboard(selectedEntry?.username || '')}
							class="flex h-6 w-6 items-center justify-center rounded hover:bg-[#333333] transition-colors"
						>
							<Copy size="12" color="#666666" />
						</button>
					</div>
				</div>
				
				<div>
					<div class="flex items-center gap-2 p-3 rounded-lg bg-[#0a0a0a] border border-[#333333]">
						<span class="text-xs font-medium text-gray-400 mr-2">Password:</span>
						<span class="flex-1 text-sm text-white font-mono">••••••••••••</span>
						<button
							onclick={() => copyToClipboard(selectedEntry?.password || 'demo-password-123')}
							class="flex h-6 w-6 items-center justify-center rounded hover:bg-[#333333] transition-colors"
						>
							<Copy size="12" color="#666666" />
						</button>
						<button 
							class="flex h-6 w-6 items-center justify-center rounded hover:bg-[#333333] transition-colors"
						>
							<Eye size="12" color="#666666" />
						</button>
					</div>
				</div>
			</div>
			
			<!-- Security Notice -->
			<div class="text-xs text-yellow-400 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20 text-center">
				This dialog will automatically close in 10 seconds for security
			</div>
			
			<!-- Actions -->
			<div class="flex gap-3">
				<button
					onclick={() => goto('/password-manager/vault')}
					class="flex-1 px-4 py-2 rounded-lg bg-[#00ccba] text-black font-medium hover:bg-[#00eeda] transition-colors"
				>
					View
				</button>
				<button
					onclick={closeDialog}
					class="px-4 py-2 rounded-lg border border-[#333333] bg-[#2a2a2a] text-white hover:bg-[#3a3a3a] transition-colors"
				>
					Close
				</button>
			</div>
		</div>
	{/if}
</Dialog>

<style>
	.password-manager-scroll::-webkit-scrollbar {
		width: 6px;
	}

	.password-manager-scroll::-webkit-scrollbar-track {
		background: transparent;
		border-radius: 10px;
	}

	.password-manager-scroll::-webkit-scrollbar-thumb {
		background: linear-gradient(180deg, #00ccba 0%, #00eeda 100%);
		border-radius: 10px;
		opacity: 0.7;
		transition: all 0.3s ease;
	}

	.password-manager-scroll::-webkit-scrollbar-thumb:hover {
		opacity: 1;
		box-shadow: 0 0 10px rgba(0, 204, 186, 0.5);
	}

	.password-manager-scroll::-webkit-scrollbar-corner {
		background: transparent;
	}
</style>
