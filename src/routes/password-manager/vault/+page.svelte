<script lang="ts">
	import VpnHeader from '$lib/components/ui/vpn-header.svelte';
	import Dialog from '$lib/components/ui/dialog.svelte';
	import { goto } from '$app/navigation';
	import { Search, Plus, Star, Globe, Key, Eye, EyeOff, Copy, Edit, Trash2, Shield, Clock, RefreshCw } from '@lucide/svelte';
	import { PasswordManagerService } from '$lib/services/password-manager-service';
	import { PasswordManagerCrypto } from '$lib/modules/passwordManagerCrypto';
	import { passwordUtils } from '$lib/helpers/securePasswordManager';

	
	// Simplified interface for display
	interface PasswordEntry {
		id: string;
		title: string;
		username: string;
		url: string;
		lastUsed?: number;
		isFavorite: boolean;
		strength: 'weak' | 'medium' | 'strong';
	}

	// Filter definition interface
	interface FilterOption {
		id: 'all' | 'favorites' | 'weak' | 'recent';
		label: string;
		icon?: any;
		count?: number;
	}
	
	let searchQuery = $state('');
	let selectedFilter = $state<'all' | 'favorites' | 'weak' | 'recent'>('all');
	let showPasswords = $state<Record<string, boolean>>({});
	let decryptedPasswords = $state<Record<string, string>>({});
	let loading = $state(true);
	
	// Edit modal state
	let showEditModal = $state(false);
	let editingEntry = $state<PasswordEntry | null>(null);
	let editForm = $state({
		title: '',
		url: '',
		username: '',
		password: '',
		isFavorite: false
	});
	let showEditPassword = $state(false);
	let editPasswordStrength = $state({ score: 0, label: 'Weak' });
	let isSaving = $state(false);
	
	// Delete confirmation dialog state
	let showDeleteModal = $state(false);
	let deleteEntryId = $state<string | null>(null);
	let isDeleting = $state(false);
	
	// Password entries loaded from service
	let passwordEntries = $state<PasswordEntry[]>([]);

	// Filter options array
	let filterOptions = $state<FilterOption[]>([
		{ id: 'all', label: 'All', icon: Key, count: 0 },
		{ id: 'favorites', label: 'Favorites', icon: Star, count: 0 },
		{ id: 'weak', label: 'Weak', icon: Shield, count: 0 },
		{ id: 'recent', label: 'Recent', icon: Clock, count: 0 }
	]);

	// Update filter counts
	function updateFilterCounts() {
		filterOptions[0].count = passwordEntries.length; // All
		filterOptions[1].count = passwordEntries.filter(e => e.isFavorite).length; // Favorites
		filterOptions[2].count = passwordEntries.filter(e => e.strength === 'weak').length; // Weak
		filterOptions[3].count = passwordEntries.filter(e => e.lastUsed && (Date.now() - e.lastUsed) < 604800000).length; // Recent
	}
	
	// Load password entries from service
	async function loadPasswordEntries() {
		loading = true;
		passwordEntries = []; // Clear existing entries
		
		try {
			const service = PasswordManagerService.getInstance();
			
			if (!service.isServiceInitialized()) {
				console.log('Initializing password manager service...');
				const initResult = await service.initialize();
				if (!initResult.success) {
					console.error('Failed to initialize password manager service:', initResult.error);
					passwordEntries = [];
					return;
				}
			}
			
			// Debug: Check if vault exists
			console.log('Checking if password vault exists...');
			try {
				const { PasswordVaultStorage } = await import('$lib/modules/passwordVaultStorage');
				const vaultExists = await PasswordVaultStorage.vaultExists();
				console.log('Vault exists:', vaultExists);
				
				if (!vaultExists) {
					console.log('No vault found, will show empty state');
					passwordEntries = [];
					return;
				}
			} catch (debugError) {
				console.error('Debug check failed:', debugError);
			}
			
			const result = await service.getAllEntries();
			if (result.success && result.data) {
				console.log('Successfully loaded entries from service:', result.data.length, 'entries');
				// Convert service entries to display format
				passwordEntries = result.data.map(entry => ({
					id: entry.id,
					title: entry.title,
					username: entry.username,
					url: entry.url,
					lastUsed: entry.lastUsed,
					isFavorite: entry.isFavorite,
					strength: mapStrengthLabel(entry.strength.label)
				}));
				
				if (passwordEntries.length === 0) {
					console.log('Vault is empty - this is normal for a new installation');
				}
			} else {
				console.warn('Failed to load entries from service:', result.error);
				console.log('Service result:', result);
				// Even if there's an error, we'll show empty state rather than fail
				passwordEntries = [];
			}
		} catch (error) {
			console.error('Error loading password entries:', error);
			passwordEntries = [];
		} finally {
			loading = false;
			updateFilterCounts();
			console.log('Final password count:', passwordEntries.length);
		}
	}
	
	// Convert service strength labels to display format
	function mapStrengthLabel(label: string): 'weak' | 'medium' | 'strong' {
		switch (label.toLowerCase()) {
			case 'very weak':
			case 'weak':
				return 'weak';
			case 'fair':
			case 'good':
				return 'medium';
			case 'strong':
			case 'very strong':
				return 'strong';
			default:
				return 'medium';
		}
	}
	
	// Load entries on component mount
	$effect(() => {
		loadPasswordEntries();
	});
	
	// Filter entries based on search and filter
	let filteredEntries = $state<PasswordEntry[]>([]);
	
	// Update filtered entries when search or filter changes
	$effect(() => {
		let entries = passwordEntries;
		
		// Apply search filter
		if (searchQuery.trim()) {
			entries = entries.filter(entry => 
				entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				entry.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
				entry.url.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}
		
		// Apply category filter
		switch (selectedFilter) {
			case 'favorites':
				entries = entries.filter(entry => entry.isFavorite);
				break;
			case 'weak':
				entries = entries.filter(entry => entry.strength === 'weak');
				break;
			case 'recent':
				entries = entries.filter(entry => entry.lastUsed && (Date.now() - entry.lastUsed) < 604800000);
				break;
		}
		
		filteredEntries = entries;
	});
	
	async function togglePasswordVisibility(id: string) {
		if (showPasswords[id]) {
			// Hide password
			showPasswords[id] = false;
			delete decryptedPasswords[id];
		} else {
			// Show password - decrypt it first
			try {
				const service = PasswordManagerService.getInstance();
				
				if (!service.isServiceInitialized()) {
					console.error('Password manager service not initialized');
					return;
				}

				// Get the entry from the service
				const entryResult = await service.getEntry(id);
				if (!entryResult.success || !entryResult.data) {
					console.error('Failed to get password entry:', entryResult.error);
					return;
				}

				// Decrypt the password
				const decryptedPassword = await PasswordManagerCrypto.decryptData(
					entryResult.data.encryptedPassword
				);

				if (!decryptedPassword.success || typeof decryptedPassword.data !== 'string') {
					console.error('Failed to decrypt password:', decryptedPassword.error);
					return;
				}

				// Store decrypted password and show it
				decryptedPasswords[id] = decryptedPassword.data;
				showPasswords[id] = true;
				
				// Auto-hide after 30 seconds for security
				clearDecryptedPassword(id);
			} catch (error) {
				console.error('Error decrypting password:', error);
			}
		}
	}

	// Refresh password entries (can be called after adding/editing)
	async function refreshEntries() {
		await loadPasswordEntries();
		// Clear any decrypted passwords for security
		decryptedPasswords = {};
		showPasswords = {};
	}

	// Clear decrypted passwords after a timeout for security
	function clearDecryptedPassword(id: string) {
		setTimeout(() => {
			if (decryptedPasswords[id]) {
				delete decryptedPasswords[id];
				showPasswords[id] = false;
			}
		}, 30000); // Clear after 30 seconds
	}

	async function toggleFavorite(id: string) {
		const entry = passwordEntries.find(e => e.id === id);
		if (entry) {
			try {
				const service = PasswordManagerService.getInstance();
				
				if (!service.isServiceInitialized()) {
					console.error('Password manager service not initialized');
					return;
				}

				// Update in service first
				const result = await service.updateEntry(id, { isFavorite: !entry.isFavorite });
				if (result.success) {
					// Update local state only if service update succeeds
					entry.isFavorite = !entry.isFavorite;
					updateFilterCounts();
				} else {
					console.error('Failed to update favorite status:', result.error);
				}
			} catch (error) {
				console.error('Error updating favorite status:', error);
			}
		}
	}
	
	async function deleteEntry(id: string) {
		deleteEntryId = id;
		showDeleteModal = true;
	}
	
	async function confirmDelete() {
		if (!deleteEntryId) return;
		
		isDeleting = true;
		try {
			const service = PasswordManagerService.getInstance();
			
			if (!service.isServiceInitialized()) {
				console.error('Password manager service not initialized');
				return;
			}

			// Delete from service first
			const result = await service.deleteEntry(deleteEntryId);
			if (result.success) {
				// Remove from local state only if service delete succeeds
				passwordEntries = passwordEntries.filter(e => e.id !== deleteEntryId);
				updateFilterCounts();
				
				// Refresh password stats on main page
				if (typeof window !== 'undefined' && (window as any).refreshPasswordStats) {
					await (window as any).refreshPasswordStats();
				}
			} else {
				console.error('Failed to delete entry:', result.error);
				alert('Failed to delete password. Please try again.');
			}
		} catch (error) {
			console.error('Error deleting entry:', error);
			alert('An error occurred while deleting the password.');
		} finally {
			isDeleting = false;
			showDeleteModal = false;
			deleteEntryId = null;
		}
	}
	
	function cancelDelete() {
		showDeleteModal = false;
		deleteEntryId = null;
	}
	
	async function copyPassword(id: string) {
		try {
			// Get the password manager service
			const service = PasswordManagerService.getInstance();
			
			if (!service.isServiceInitialized()) {
				console.error('Password manager service not initialized');
				return;
			}
			
			// Get the entry from the service
			const entryResult = await service.getEntry(id);
			if (!entryResult.success || !entryResult.data) {
				console.error('Failed to get password entry:', entryResult.error);
				return;
			}
			
			// Decrypt the password
			const decryptedPassword = await PasswordManagerCrypto.decryptData(
				entryResult.data.encryptedPassword
			);
			
			if (!decryptedPassword.success || typeof decryptedPassword.data !== 'string') {
				console.error('Failed to decrypt password:', decryptedPassword.error);
				return;
			}
			
			// Copy to clipboard
			if (navigator.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(decryptedPassword.data);
				console.log('Password copied to clipboard');
				
				// Update last used timestamp
				await service.updateLastUsed(id);
			} else {
				// Fallback for older browsers
				const textArea = document.createElement('textarea');
				textArea.value = decryptedPassword.data;
				textArea.style.position = 'fixed';
				textArea.style.opacity = '0';
				document.body.appendChild(textArea);
				textArea.select();
				document.execCommand('copy');
				document.body.removeChild(textArea);
				console.log('Password copied to clipboard (fallback)');
				
				// Update last used timestamp
				await service.updateLastUsed(id);
			}
		} catch (error) {
			console.error('Failed to copy password:', error);
		}
	}
	
	function getStrengthColor(strength: string) {
		switch (strength) {
			case 'strong': return 'text-green-400';
			case 'medium': return 'text-yellow-400';
			case 'weak': return 'text-red-400';
			default: return 'text-gray-400';
		}
	}
	
	function getStrengthDot(strength: string) {
		switch (strength) {
			case 'strong': return 'bg-green-400';
			case 'medium': return 'bg-yellow-400';
			case 'weak': return 'bg-red-400';
			default: return 'bg-gray-400';
		}
	}
	
	function formatLastUsed(timestamp?: number) {
		if (!timestamp) return 'Never';
		
		const diff = Date.now() - timestamp;
		const days = Math.floor(diff / 86400000);
		
		if (days === 0) return 'Today';
		if (days === 1) return '1 day ago';
		if (days < 7) return `${days} days ago`;
		if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
		return `${Math.floor(days / 30)} months ago`;
	}

	// Edit modal functions
	async function openEditModal(entryId: string) {
		try {
			const service = PasswordManagerService.getInstance();
			
			if (!service.isServiceInitialized()) {
				console.error('Password manager service not initialized');
				return;
			}

			// Get the full entry from service
			const entryResult = await service.getEntry(entryId);
			if (!entryResult.success || !entryResult.data) {
				console.error('Failed to get password entry:', entryResult.error);
				return;
			}

			const fullEntry = entryResult.data;

			// Decrypt the password
			const decryptedPassword = await PasswordManagerCrypto.decryptData(
				fullEntry.encryptedPassword
			);

			if (!decryptedPassword.success || typeof decryptedPassword.data !== 'string') {
				console.error('Failed to decrypt password:', decryptedPassword.error);
				return;
			}

			// Set up edit form
			editingEntry = passwordEntries.find(e => e.id === entryId) || null;
			editForm = {
				title: fullEntry.title,
				url: fullEntry.url,
				username: fullEntry.username,
				password: decryptedPassword.data,
				isFavorite: fullEntry.isFavorite
			};

			// Calculate password strength
		if (editForm.password) {
			const { score } = passwordUtils.getStrength(editForm.password);
			const { label } = passwordUtils.getStrengthLabel(score);
			editPasswordStrength = { 
				score, 
				label 
			};
		}			showEditModal = true;
		} catch (error) {
			console.error('Error opening edit modal:', error);
		}
	}

	function closeEditModal() {
		showEditModal = false;
		editingEntry = null;
		editForm = {
			title: '',
			url: '',
			username: '',
			password: '',
			isFavorite: false
		};
		showEditPassword = false;
		editPasswordStrength = { score: 0, label: 'Weak' };
		isSaving = false;
	}

	async function saveEdit() {
		if (!editingEntry || !editForm.title.trim() || !editForm.username.trim() || !editForm.password.trim()) {
			return;
		}

		isSaving = true;

		try {
			const service = PasswordManagerService.getInstance();
			
			if (!service.isServiceInitialized()) {
				console.error('Password manager service not initialized');
				return;
			}

			// Prepare update data
			const updateData = {
				title: editForm.title.trim(),
				url: editForm.url.trim(),
				username: editForm.username.trim(),
				password: editForm.password,
				isFavorite: editForm.isFavorite
			};

			// Update the entry
			const result = await service.updateEntry(editingEntry!.id, updateData);
			if (result.success) {
				// Update local state
				const entryIndex = passwordEntries.findIndex(e => e.id === editingEntry!.id);
				if (entryIndex !== -1) {
					passwordEntries[entryIndex] = {
						...passwordEntries[entryIndex],
						title: updateData.title,
						url: updateData.url,
						username: updateData.username,
						isFavorite: updateData.isFavorite,
						strength: mapStrengthLabel(editPasswordStrength.label)
					};
				}
				
				updateFilterCounts();
				
				// Refresh password stats on main page
				if (typeof window !== 'undefined' && (window as any).refreshPasswordStats) {
					await (window as any).refreshPasswordStats();
				}
				
				closeEditModal();
			} else {
				console.error('Failed to update entry:', result.error);
				alert('Failed to update password. Please try again.');
			}
		} catch (error) {
			console.error('Error updating entry:', error);
			alert('An error occurred while updating the password.');
		} finally {
			isSaving = false;
		}
	}

	// Update password strength when password changes
	$effect(() => {
		if (editForm.password) {
			const { score } = passwordUtils.getStrength(editForm.password);
			const { label } = passwordUtils.getStrengthLabel(score);
			editPasswordStrength = { 
				score, 
				label 
			};
		}
	});
</script>

<section class="h-full overflow-y-auto bg-[#111111] text-white vault-scroll">
	<VpnHeader />
	
	<div class="space-y-4 p-4">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-xl font-bold text-[#00ccba]">Password Vault</h1>
				<p class="text-sm text-gray-400">{filteredEntries.length} of {passwordEntries.length} passwords</p>
			</div>
			<button
				onclick={() => goto('/password-manager/add-password')}
				class="flex items-center gap-2 rounded-lg text-sm bg-[#00ccba] px-4 py-2 text-black font-medium hover:bg-[#00eeda] transition-colors whitespace-nowrap"
			>
				<Plus size="16" />
				Add Password
			</button>
		</div>

		<!-- Search and Filters -->
		<div class="space-y-3">
			<!-- Search -->
			<div class="relative">
				<div class="absolute inset-y-0 left-0 flex items-center pl-3">
					<Search color="#666666" size="16" />
				</div>
				<input
					bind:value={searchQuery}
					placeholder="Search passwords..."
					class="w-full bg-[#1a1a1a] border border-[#333333] rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:border-[#00ccba] focus:outline-none focus:ring-1 focus:ring-[#00ccba]"
				/>
			</div>
			
			<!-- Filter Tabs -->
			<div class="filter-tabs-container overflow-x-auto scrollbar-styled">
				<div class="flex gap-2 pb-1" style="min-width: max-content;">
					{#each filterOptions as filter}
						<button
							onclick={() => selectedFilter = filter.id}
							class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 {selectedFilter === filter.id ? 'bg-[#00ccba]/20 text-[#00ccba] border border-[#00ccba]/30 shadow-sm' : 'bg-[#1a1a1a] text-gray-400 border border-[#333333] hover:bg-[#2a2a2a] hover:border-[#444444]'}"
						>
							{#if filter.icon}
								{@const IconComponent = filter.icon}
								<IconComponent size="14" class="shrink-0" />
							{/if}
							<span>{filter.label}</span>
							{#if filter.count !== undefined}
								<span class="text-xs px-1.5 py-0.5 rounded-full bg-gray-700 {selectedFilter === filter.id ? 'bg-[#00ccba]/30 text-[#00ccba]' : 'text-gray-500'}">{filter.count}</span>
							{/if}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Password Entries -->
		<div class="space-y-2">
			{#if loading}
				<div class="flex items-center justify-center py-8">
					<div class="text-center">
						<div class="animate-spin h-6 w-6 border-2 border-[#00ccba] border-t-transparent rounded-full mx-auto mb-2"></div>
						<p class="text-sm text-gray-400">Loading passwords...</p>
					</div>
				</div>
			{:else if filteredEntries.length === 0}
				<div class="text-center py-8">
					<Key color="#666666" size="48" class="mx-auto mb-4" />
					<p class="text-gray-400 mb-2">
						{searchQuery || selectedFilter !== 'all' ? 'No passwords match your criteria' : 'No passwords saved yet'}
					</p>
					<button
						onclick={() => goto('/password-manager/add-password')}
						class="text-[#00ccba] hover:underline"
					>
						Add your first password
					</button>
				</div>
			{:else}
				{#each filteredEntries as entry (entry.id)}
				<div class="rounded-lg border border-[#333333] bg-[#1a1a1a] p-4">
					<!-- Entry Header -->
					<div class="flex items-start justify-between mb-3">
						<div class="flex items-center gap-3">
							<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00ccba]/10">
								<Globe color="#00ccba" size="18" />
							</div>
							<div class="flex-1">
								<div class="flex items-center gap-2">
									<h3 class="font-semibold text-white">{entry.title}</h3>
									{#if entry.isFavorite}
										<Star size="14" color="#fbbf24" fill="#fbbf24" />
									{/if}
								</div>
								<p class="text-sm text-gray-400">{entry.username}</p>
								<p class="text-xs text-gray-500 truncate">{entry.url}</p>
							</div>
						</div>
						
						<!-- Entry Actions -->
						<div class="flex items-center gap-1">
							<button
								onclick={() => toggleFavorite(entry.id)}
								class="p-1.5 rounded hover:bg-[#2a2a2a] transition-colors"
								title={entry.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
							>
								<Star size="14" color={entry.isFavorite ? '#fbbf24' : '#666666'} fill={entry.isFavorite ? '#fbbf24' : 'none'} />
							</button>
							<button
								onclick={() => openEditModal(entry.id)}
								class="p-1.5 rounded hover:bg-[#2a2a2a] transition-colors"
								title="Edit"
							>
								<Edit size="14" color="#666666" />
							</button>
							<button
								onclick={() => deleteEntry(entry.id)}
								class="p-1.5 rounded hover:bg-red-500/20 transition-colors"
								title="Delete"
							>
								<Trash2 size="14" color="#ef4444" />
							</button>
						</div>
					</div>
					
					<!-- Password Field -->
					<div class="flex items-center gap-2 mb-3">
						<div class="flex-1 flex items-center gap-2">
							<Key size="14" color="#666666" />
							<input
								type={showPasswords[entry.id] ? 'text' : 'password'}
								value={showPasswords[entry.id] && decryptedPasswords[entry.id] ? decryptedPasswords[entry.id] : '••••••••••••'}
								readonly
								class="flex-1 bg-[#0a0a0a] border border-[#333333] rounded px-3 py-1.5 text-sm text-white font-mono"
							/>
							<button
								onclick={() => togglePasswordVisibility(entry.id)}
								class="p-1.5 rounded hover:bg-[#2a2a2a] transition-colors"
								title={showPasswords[entry.id] ? 'Hide password' : 'Show password'}
							>
								{#if showPasswords[entry.id]}
									<EyeOff size="14" color="#666666" />
								{:else}
									<Eye size="14" color="#666666" />
								{/if}
							</button>
							<button
								onclick={() => copyPassword(entry.id)}
								class="p-1.5 rounded hover:bg-[#2a2a2a] transition-colors"
								title="Copy password"
							>
								<Copy size="14" color="#00ccba" />
							</button>
						</div>
					</div>
					
					<!-- Entry Footer -->
					<div class="flex items-center justify-between text-xs">
						<div class="flex items-center gap-4">
							<div class="flex items-center gap-1">
								<div class="w-2 h-2 rounded-full {getStrengthDot(entry.strength)}"></div>
								<span class="{getStrengthColor(entry.strength)} capitalize">{entry.strength}</span>
							</div>
							<span class="text-gray-500">Last used: {formatLastUsed(entry.lastUsed)}</span>
						</div>
					</div>
				</div>
			{:else}
				<!-- Empty State -->
				<div class="py-8 text-center">
					<div class="mb-4 text-4xl">🔐</div>
					<h3 class="mb-2 text-lg font-semibold text-white">
						{searchQuery ? 'No matching passwords' : 'No passwords yet'}
					</h3>
					<p class="mb-4 text-sm text-gray-400">
						{searchQuery ? 'Try adjusting your search terms' : 'Add your first password to get started'}
					</p>
					<button
						onclick={() => goto('/password-manager/add-password')}
						class="rounded-lg bg-[#00ccba] px-4 py-2 text-black font-medium hover:bg-[#00eeda] transition-colors"
					>
						Add Password
					</button>
				</div>
			{/each}
			{/if}
		</div>

		<!-- Back Navigation -->
		<div class="border-t border-[#333333] pt-6 mt-6">
			<button
				class="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#2a2a2a] to-[#1a1a1a] border border-[#333333] text-sm py-2 text-white font-medium transition-all duration-200 hover:from-[#3a3a3a] hover:to-[#2a2a2a] hover:border-[#00ccba]/30 hover:shadow-lg group"
				onclick={() => goto('/password-manager')}
			>
				<svg class="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
				</svg>
				<span>Back to Password Manager</span>
			</button>
		</div>
	</div>
</section>

<!-- Edit Password Modal -->
<Dialog open={showEditModal} onClose={closeEditModal}>
	<div 
		class="bg-[#1a1a1a] border border-[#333333] rounded-lg p-6 w-full max-w-md mx-4 space-y-4" 
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => e.stopPropagation()}
		role="dialog"
		aria-modal="true"
		aria-labelledby="edit-modal-title"
		tabindex="-1"
	>
		<h2 id="edit-modal-title" class="text-lg font-semibold text-white flex items-center gap-2">
			<Edit size="20" class="text-[#00ccba]" />
			Edit Password
		</h2>
		
		<div class="space-y-4">
			<!-- Title -->
			<div>
				<label for="edit-title" class="block text-sm font-medium text-gray-300 mb-1">Title</label>
				<input
					id="edit-title"
					bind:value={editForm.title}
					placeholder="e.g., Gmail, Facebook"
					class="w-full bg-[#0a0a0a] border border-[#333333] rounded px-3 py-2 text-white placeholder-gray-400 focus:border-[#00ccba] focus:outline-none"
				/>
			</div>
			
			<!-- URL -->
			<div>
				<label for="edit-url" class="block text-sm font-medium text-gray-300 mb-1">Website URL</label>
				<input
					id="edit-url"
					bind:value={editForm.url}
					placeholder="e.g., gmail.com"
					class="w-full bg-[#0a0a0a] border border-[#333333] rounded px-3 py-2 text-white placeholder-gray-400 focus:border-[#00ccba] focus:outline-none"
				/>
			</div>
			
			<!-- Username -->
			<div>
				<label for="edit-username" class="block text-sm font-medium text-gray-300 mb-1">Username/Email</label>
				<input
					id="edit-username"
					bind:value={editForm.username}
					placeholder="Username or email"
					class="w-full bg-[#0a0a0a] border border-[#333333] rounded px-3 py-2 text-white placeholder-gray-400 focus:border-[#00ccba] focus:outline-none"
				/>
			</div>
			
			<!-- Password -->
			<div>
				<label for="edit-password" class="block text-sm font-medium text-gray-300 mb-1">Password</label>
				<div class="relative">
					<input
						id="edit-password"
						bind:value={editForm.password}
						type={showEditPassword ? 'text' : 'password'}
						placeholder="Password"
						class="w-full bg-[#0a0a0a] border border-[#333333] rounded px-3 py-2 pr-10 text-white placeholder-gray-400 focus:border-[#00ccba] focus:outline-none font-mono"
					/>
					<button
						onclick={() => showEditPassword = !showEditPassword}
						class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
						type="button"
						aria-label={showEditPassword ? 'Hide password' : 'Show password'}
					>
						{#if showEditPassword}
							<EyeOff size="16" />
						{:else}
							<Eye size="16" />
						{/if}
					</button>
				</div>
				
				<!-- Password Strength -->
				{#if editForm.password}
					<div class="mt-2 flex items-center gap-2">
						<div class="flex-1 h-1 bg-[#333333] rounded-full overflow-hidden">
							<div 
								class="h-full transition-all duration-300 {editPasswordStrength.score >= 80 ? 'bg-green-400' : editPasswordStrength.score >= 60 ? 'bg-yellow-400' : editPasswordStrength.score >= 40 ? 'bg-orange-400' : 'bg-red-400'}"
								style="width: {Math.max(10, editPasswordStrength.score)}%"
							></div>
						</div>
						<span class="text-xs {editPasswordStrength.score >= 80 ? 'text-green-400' : editPasswordStrength.score >= 60 ? 'text-yellow-400' : editPasswordStrength.score >= 40 ? 'text-orange-400' : 'text-red-400'}">{editPasswordStrength.label}</span>
					</div>
				{/if}
			</div>
			
			<!-- Favorite -->
			<div class="flex items-center gap-2">
				<input
					bind:checked={editForm.isFavorite}
					type="checkbox"
					id="edit-favorite"
					class="w-4 h-4 text-[#00ccba] bg-[#0a0a0a] border-[#333333] rounded focus:ring-[#00ccba] focus:ring-2"
				/>
				<label for="edit-favorite" class="text-sm text-gray-300 cursor-pointer">Mark as favorite</label>
			</div>
		</div>
		
		<!-- Actions -->
		<div class="flex gap-3 pt-4 border-t border-[#333333]">
			<button
				onclick={closeEditModal}
				class="flex-1 px-4 py-2 bg-[#0a0a0a] border border-[#333333] text-white rounded hover:bg-[#2a2a2a] transition-colors"
				disabled={isSaving}
			>
				Cancel
			</button>
			<button
				onclick={saveEdit}
				disabled={isSaving || !editForm.title.trim() || !editForm.username.trim() || !editForm.password.trim()}
				class="flex-1 px-4 py-2 bg-[#00ccba] hover:bg-[#00b5a5] disabled:opacity-50 disabled:cursor-not-allowed text-black font-medium rounded transition-colors flex items-center justify-center gap-2"
			>
				{#if isSaving}
					<RefreshCw size={14} class="animate-spin" />
					Saving...
				{:else}
					Save Changes
				{/if}
			</button>
		</div>
	</div>
</Dialog>

<!-- Delete Confirmation Modal -->
<Dialog open={showDeleteModal} onClose={cancelDelete}>
	<div 
		class="bg-[#1a1a1a] border border-[#333333] rounded-lg p-6 w-full max-w-sm mx-4 space-y-4" 
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => e.stopPropagation()}
		role="dialog"
		aria-modal="true"
		aria-labelledby="delete-modal-title"
		tabindex="-1"
	>
		<div class="text-center">
			<div class="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
				<Trash2 class="w-6 h-6 text-red-600" />
			</div>
			<h2 id="delete-modal-title" class="text-lg font-semibold text-white mb-2">
				Delete Password
			</h2>
			<p class="text-gray-400 text-sm">
				Are you sure you want to delete this password? This action cannot be undone.
			</p>
		</div>
		
		<!-- Actions -->
		<div class="flex gap-3 pt-4">
			<button
				onclick={cancelDelete}
				class="flex-1 px-4 py-2 bg-[#0a0a0a] border border-[#333333] text-white rounded hover:bg-[#2a2a2a] transition-colors"
				disabled={isDeleting}
			>
				Cancel
			</button>
			<button
				onclick={confirmDelete}
				disabled={isDeleting}
				class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded transition-colors flex items-center justify-center gap-2"
			>
				{#if isDeleting}
					<RefreshCw size={14} class="animate-spin" />
					Deleting...
				{:else}
					Delete
				{/if}
			</button>
		</div>
	</div>
</Dialog>

<style>
	.vault-scroll::-webkit-scrollbar {
		width: 6px;
	}

	.vault-scroll::-webkit-scrollbar-track {
		background: transparent;
		border-radius: 10px;
	}

	.vault-scroll::-webkit-scrollbar-thumb {
		background: linear-gradient(180deg, #00ccba 0%, #00eeda 100%);
		border-radius: 10px;
		opacity: 0.7;
		transition: all 0.3s ease;
	}

	.vault-scroll::-webkit-scrollbar-thumb:hover {
		opacity: 1;
		box-shadow: 0 0 10px rgba(0, 204, 186, 0.5);
	}

	.vault-scroll::-webkit-scrollbar-corner {
		background: transparent;
	}

	/* Filter tabs custom scrollbar */
	.filter-tabs-container {
		scrollbar-width: thin;
		scrollbar-color: rgba(0, 204, 186, 0.6) rgba(51, 51, 51, 0.3);
		padding-bottom: 4px;
		-webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
		scroll-behavior: smooth;
	}

	.scrollbar-styled::-webkit-scrollbar {
		height: 6px;
		width: 6px;
	}

	.scrollbar-styled::-webkit-scrollbar-track {
		background: rgba(51, 51, 51, 0.4);
		border-radius: 3px;
		margin: 0 8px;
	}

	.scrollbar-styled::-webkit-scrollbar-thumb {
		background: linear-gradient(90deg, #00ccba 0%, #00b5a5 100%);
		border-radius: 3px;
		transition: all 0.3s ease;
		border: 1px solid rgba(0, 0, 0, 0.1);
	}

	.scrollbar-styled::-webkit-scrollbar-thumb:hover {
		background: linear-gradient(90deg, #00eeda 0%, #00ccba 100%);
		transform: scaleY(1.2);
		box-shadow: 0 2px 4px rgba(0, 204, 186, 0.3);
	}

	.scrollbar-styled::-webkit-scrollbar-corner {
		background: transparent;
	}

	/* Mobile optimization */
	@media (max-width: 640px) {
		.filter-tabs-container {
			padding-bottom: 8px;
		}
		
		.scrollbar-styled::-webkit-scrollbar {
			height: 8px;
		}
		
		.scrollbar-styled::-webkit-scrollbar-thumb {
			background: #00ccba;
		}
	}
</style>
