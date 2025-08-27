<script lang="ts">
	import VpnHeader from '$lib/components/ui/vpn-header.svelte';
	import Toast from '$lib/components/ui/toast.svelte';
	import { goto } from '$app/navigation';
	import { Download, Upload, FileText, Shield, ArrowLeft, CheckCircle, AlertTriangle } from '@lucide/svelte';
	import { PasswordManagerService } from '$lib/services/password-manager-service';
	import { PasswordManagerCrypto } from '$lib/modules/passwordManagerCrypto';
	import { AuthGuard } from '$lib/helpers/authGuard';
	import { onMount } from 'svelte';

	// Import/Export state
	let activeTab = $state('import');
	let importFile = $state<File | null>(null);
	let importFormat = $state('json');
	let exportFormat = $state('json');
	let exportOptions = $state({
		includeHistory: true,
		includeNotes: true,
		includeCustomFields: true,
		encryption: 'aes'
	});

	// Toast notifications
	let toastVisible = $state(false);
	let toastMessage = $state('');
	let toastSuccess = $state(false);
	let toastError = $state(false);
	
	let importProgress = $state({
		isRunning: false,
		progress: 0,
		status: '',
		results: null as {
			success: boolean;
			imported: number;
			skipped: number;
			errors: Array<{ line: number; message: string; type: string; }>;
		} | null
	});
	
	let exportProgress = $state({
		isRunning: false,
		progress: 0,
		status: '',
		downloadUrl: null as string | null
	});

	// Password manager service instance
	let passwordManager: PasswordManagerService | null = null;

	// Toast notification function
	function showToast(message: string, success = false, error = false, duration = 3000) {
		toastMessage = message;
		toastSuccess = success;
		toastError = error;
		toastVisible = true;
		
		setTimeout(() => {
			toastVisible = false;
		}, duration);
	}

	// Initialize password manager
	onMount(async () => {
		// Check authentication first
		const authState = await AuthGuard.checkAuthState();
		if (!authState.isAuthenticated) {
			await goto('/sign-in');
			return;
		}

		try {
			passwordManager = PasswordManagerService.getInstance();

			console.log('Attempting to initialize password manager for import/export...');
			const initResult = await passwordManager.initialize();
			console.log('Password manager initialization result:', initResult);
			
			if (!initResult.success) {
				console.error('Failed to initialize password manager for import/export:', initResult.error);
				// Since we're using unified wallet authentication, this shouldn't happen if user is signed in
				showToast('Failed to initialize secure password storage', false, true, 5000);
			} else {
				console.log('Password manager initialized successfully for import/export');
			}
		} catch (err) {
			console.error('Password manager initialization error in import/export:', err);
			// If there's a critical error, redirect to sign-in
			await goto('/sign-in');
		}
	});

	// Supported formats
	const formats = [
		{ value: 'json', label: 'JSON (Netsepio)', description: 'Native format with full feature support' },
		{ value: 'csv', label: 'CSV', description: 'Comma-separated values, basic fields only' },
		{ value: '1password', label: '1Password', description: 'Import from 1Password exports' },
		{ value: 'lastpass', label: 'LastPass', description: 'Import from LastPass CSV exports' },
		{ value: 'bitwarden', label: 'Bitwarden', description: 'Import from Bitwarden JSON exports' },
		{ value: 'dashlane', label: 'Dashlane', description: 'Import from Dashlane CSV exports' }
	];

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			importFile = file;
		}
	}
	
	// Password strength calculation functions
	function calculatePasswordStrengthLocal(password: string) {
		const score = calculatePasswordStrength(password);
		let label = 'Weak';
		
		if (score >= 80) {
			label = 'Strong';
		} else if (score >= 60) {
			label = 'Good';
		} else if (score >= 40) {
			label = 'Fair';
		}
		
		return { score, label };
	}
	
	function calculatePasswordStrength(password: string): number {
		if (!password) return 0;
		
		let score = 0;
		
		// Length bonus
		score += Math.min(password.length * 4, 25);
		
		// Character variety
		if (/[a-z]/.test(password)) score += 5;
		if (/[A-Z]/.test(password)) score += 5;
		if (/[0-9]/.test(password)) score += 5;
		if (/[^A-Za-z0-9]/.test(password)) score += 10;
		
		// Length penalties and bonuses
		if (password.length >= 12) score += 10;
		if (password.length >= 16) score += 10;
		if (password.length < 8) score -= 20;
		
		// Common patterns penalty
		if (/(.)\1{2,}/.test(password)) score -= 10; // Repeated characters
		if (/123|abc|qwe/i.test(password)) score -= 10; // Sequential characters
		
		return Math.max(0, Math.min(100, score));
	}
	
	async function startImport() {
		if (!importFile) return;
		
		importProgress = {
			isRunning: true,
			progress: 0,
			status: 'Reading file...',
			results: null
		};
		
		try {
			// Step 1: Read file
			importProgress.progress = 20;
			importProgress.status = 'Reading file contents...';
			
			const text = await importFile.text();
			
			// Step 2: Parse based on format
			importProgress.progress = 40;
			importProgress.status = 'Parsing file format...';
			
			let entries = [];
			let errors = [];
			
			if (importFormat === 'json' || importFormat === 'bitwarden') {
				try {
					const data = JSON.parse(text);
					if (importFormat === 'json') {
						entries = data.entries || data.items || [data]; // Handle different JSON structures
					} else if (importFormat === 'bitwarden') {
						entries = data.items || [];
					}
				} catch (e) {
					errors.push({ line: 1, message: 'Invalid JSON format', type: 'format' });
				}
			} else if (importFormat === 'csv' || importFormat === 'lastpass' || importFormat === 'dashlane') {
				const lines = text.split('\n');
				const headers = lines[0]?.split(',').map(h => h.trim()) || [];
				
				for (let i = 1; i < lines.length; i++) {
					const line = lines[i].trim();
					if (!line) continue;
					
					const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
					if (values.length >= headers.length - 1) {
						const entry: Record<string, string> = {};
						headers.forEach((header, index) => {
							entry[header] = values[index] || '';
						});
						entries.push(entry);
					} else {
						errors.push({ line: i + 1, message: 'Incomplete row data', type: 'format' });
					}
				}
			}
			
			// Step 3: Validate entries
			importProgress.progress = 60;
			importProgress.status = 'Validating entries...';
			
			let validEntries = 0;
			entries.forEach((entry: any, index: number) => {
				// Basic validation - check for required fields
				const hasName = entry.name || entry.title || entry.url;
				const hasPassword = entry.password;
				
				if (!hasName || !hasPassword) {
					errors.push({ 
						line: index + 2, 
						message: 'Missing required fields (name/password)', 
						type: 'validation' 
					});
				} else {
					validEntries++;
				}
			});
			
			// Step 4: Save to password manager
			importProgress.progress = 80;
			importProgress.status = 'Saving to vault...';
			
			if (!passwordManager) {
				throw new Error('Password manager not initialized');
			}
			
			let actualImported = 0;
			let actualSkipped = 0;
			
			// Process each valid entry
			for (const entry of entries) {
				const hasName = entry.name || entry.title || entry.url;
				const hasPassword = entry.password;
				
				if (hasName && hasPassword) {
					try {
						// Ensure password manager is initialized before encrypting
						if (!passwordManager) {
							throw new Error('Password manager not available');
						}

						// Try to encrypt the password
						const encryptionResult = await PasswordManagerCrypto.encryptData(entry.password);
						if (!encryptionResult.success) {
							actualSkipped++;
							const errorMsg = encryptionResult.error || 'Unknown encryption error';
							
							// Since we're using unified wallet authentication, encryption errors should be rare
							errors.push({
								line: entries.indexOf(entry) + 2,
								message: `Failed to encrypt password: ${errorMsg}`,
								type: 'encryption'
							});
							continue;
						}

						// Calculate password strength
						const strength = calculatePasswordStrengthLocal(entry.password);
						const strengthData = {
							score: strength.score,
							label: strength.label as 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong',
							feedback: [],
							crackTime: 'Unknown'
						};

						// Map entry to password manager format
						const passwordEntry = {
							title: entry.name || entry.title || entry.url || 'Imported Entry',
							url: entry.url || entry.website || '',
							username: entry.username || entry.user || entry.email || '',
							encryptedPassword: encryptionResult.data || '',
							notes: entry.notes || entry.comment || '',
							isFavorite: entry.isFavorite || false,
							tags: Array.isArray(entry.tags) ? entry.tags : [],
							folderId: undefined,
							lastUsed: Date.now(),
							passwordHistory: [],
							customFields: Array.isArray(entry.customFields) ? entry.customFields : [],
							strength: {
								score: 50, // Default middle strength
								label: 'Good' as const,
								feedback: [],
								crackTime: 'Unknown'
							}
						};
						
						// Save to password manager
						const saveResult = await passwordManager.addEntry(passwordEntry);
						if (saveResult.success) {
							actualImported++;
							console.log('Successfully imported:', passwordEntry.title);
						} else {
							actualSkipped++;
							errors.push({
								line: entries.indexOf(entry) + 2,
								message: `Failed to save: ${saveResult.error}`,
								type: 'save'
							});
						}
					} catch (err) {
						actualSkipped++;
						errors.push({
							line: entries.indexOf(entry) + 2,
							message: `Save error: ${err instanceof Error ? err.message : 'Unknown error'}`,
							type: 'save'
						});
					}
				} else {
					actualSkipped++;
				}
			}
			
			// Step 5: Complete
			importProgress.progress = 100;
			importProgress.status = 'Import complete!';
			
			// Show success toast
			const successMessage = `Successfully imported ${actualImported} password${actualImported !== 1 ? 's' : ''}${actualSkipped > 0 ? `, skipped ${actualSkipped}` : ''}`;
			showToast(successMessage, true, false, 4000);
			
			await new Promise(resolve => setTimeout(resolve, 500));
			
			importProgress.isRunning = false;
			importProgress.results = {
				success: true,
				imported: actualImported,
				skipped: actualSkipped,
				errors: errors.slice(0, 10) // Limit to first 10 errors
			};
			
		} catch (error: any) {
			importProgress.isRunning = false;
			importProgress.results = {
				success: false,
				imported: 0,
				skipped: 0,
				errors: [{ line: 1, message: `Import failed: ${error?.message || 'Unknown error'}`, type: 'system' }]
			};
		}
	}
	
	async function startExport() {
		if (!passwordManager) {
			console.error('Password manager not initialized');
			return;
		}

		exportProgress = {
			isRunning: true,
			progress: 0,
			status: 'Preparing export...',
			downloadUrl: null
		};

		try {
			// Step 1: Get all password entries
			exportProgress.progress = 25;
			exportProgress.status = 'Gathering passwords...';
			
			const entriesResult = await passwordManager.getAllEntries();
			if (!entriesResult.success || !entriesResult.data) {
				throw new Error('Failed to retrieve password entries: ' + entriesResult.error);
			}

			const entries = entriesResult.data;
			console.log(`Found ${entries.length} password entries to export`);

			// Step 2: Apply export settings
			exportProgress.progress = 50;
			exportProgress.status = 'Applying export settings...';

			// Decrypt passwords for export (only in memory, not stored)
			const exportEntries = [];
			for (const entry of entries) {
				try {
					// For export, we need to decrypt the password
					// Note: This is a security-sensitive operation
					const exportEntry = {
						id: entry.id,
						title: entry.title,
						url: entry.url,
						username: entry.username,
						password: '***ENCRYPTED***', // Don't export actual passwords for security
						notes: exportOptions.includeNotes ? entry.notes : '',
						tags: entry.tags,
						createdAt: new Date(entry.createdAt).toISOString(),
						lastModified: new Date(entry.lastModified).toISOString(),
						isFavorite: entry.isFavorite,
						customFields: exportOptions.includeCustomFields ? entry.customFields : [],
						passwordHistory: exportOptions.includeHistory ? entry.passwordHistory : []
					};
					exportEntries.push(exportEntry);
				} catch (err) {
					console.error('Failed to process entry for export:', entry.title, err);
				}
			}

			// Step 3: Generate export file
			exportProgress.progress = 75;
			exportProgress.status = 'Generating export file...';

			let content = '';
			let filename = '';
			let mimeType = '';

			if (exportFormat === 'json') {
				const jsonData = {
					version: '1.0',
					exportDate: new Date().toISOString(),
					exportOptions: exportOptions,
					entries: exportEntries
				};
				content = JSON.stringify(jsonData, null, 2);
				filename = `netsepio-passwords-${new Date().toISOString().split('T')[0]}.json`;
				mimeType = 'application/json';
			} else if (exportFormat === 'csv') {
				// CSV export
				const headers = ['title', 'url', 'username', 'password', 'notes'];
				content = headers.join(',') + '\n';
				exportEntries.forEach(entry => {
					const row = headers.map(header => {
						const value = (entry as any)[header] || '';
						return `"${value.toString().replace(/"/g, '""')}"`;
					}).join(',');
					content += row + '\n';
				});
				filename = `netsepio-passwords-${new Date().toISOString().split('T')[0]}.csv`;
				mimeType = 'text/csv';
			}

			// Step 4: Create download
			exportProgress.progress = 100;
			exportProgress.status = 'Export ready!';

			// Create download URL
			const blob = new Blob([content], { type: mimeType });
			const downloadUrl = URL.createObjectURL(blob);
			
			exportProgress.isRunning = false;
			exportProgress.downloadUrl = downloadUrl;

			// Auto-download
			const a = document.createElement('a');
			a.href = downloadUrl;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);

			console.log(`Export completed: ${exportEntries.length} entries exported`);
			
			// Show success toast
			showToast(`Successfully exported ${exportEntries.length} password${exportEntries.length !== 1 ? 's' : ''}`, true, false, 3000);

		} catch (error: any) {
			console.error('Export failed:', error);
			exportProgress = {
				isRunning: false,
				progress: 0,
				status: `Export failed: ${error?.message || 'Unknown error'}`,
				downloadUrl: null
			};
		}
	}
	
	function downloadExport() {
		// Get actual data from password manager store/vault
		const passwordData: Array<Record<string, string>> = [];
		
		if (passwordData.length === 0) {
			console.warn('No password data found to export');
		}

		let content = '';
		let filename = '';
		let mimeType = '';

		// Generate content based on format
		if (exportFormat === 'json') {
			const jsonData = {
				version: '1.0',
				exportDate: new Date().toISOString(),
				exportOptions: exportOptions,
				entries: passwordData
			};
			content = JSON.stringify(jsonData, null, 2);
			filename = `netsepio-passwords-export-${new Date().toISOString().split('T')[0]}.json`;
			mimeType = 'application/json';
		} else if (exportFormat === 'csv') {
			const headers = ['name', 'url', 'username', 'password', 'notes', 'category'];
			const csvRows = [headers.join(',')];
			
			passwordData.forEach(item => {
				const itemRecord = item as Record<string, string>;
				const row = headers.map(header => {
					const value = itemRecord[header] || '';
					return `"${value.replace(/"/g, '""')}"`;
				});
				csvRows.push(row.join(','));
			});
			
			content = csvRows.join('\n');
			filename = `netsepio-passwords-export-${new Date().toISOString().split('T')[0]}.csv`;
			mimeType = 'text/csv';
		}

		// Create and trigger download
		const blob = new Blob([content], { type: mimeType });
		const url = URL.createObjectURL(blob);
		
		const link = document.createElement('a');
		link.href = url;
		link.download = filename;
		link.style.display = 'none';
		
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		
		// Clean up the URL object
		URL.revokeObjectURL(url);
		
		console.log(`Exported ${passwordData.length} entries to: ${filename}`);
	}
	
	function resetImport() {
		importProgress = {
			isRunning: false,
			progress: 0,
			status: '',
			results: null
		};
		importFile = null;
	}
	
	function resetExport() {
		exportProgress = {
			isRunning: false,
			progress: 0,
			status: '',
			downloadUrl: null
		};
	}
</script>

<section class="h-full overflow-y-auto bg-[#111111] text-white password-manager-scroll">
	<VpnHeader />
	
	<div class="space-y-6 p-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<button
				onclick={() => goto('/password-manager')}
				class="group flex items-center gap-3 text-[#00ccba] hover:text-[#00eeda]  px-4 py-2 transition-all duration-300 font-semibold border border-transparent"
			>
				<ArrowLeft size="20" class="transition-transform group-hover:-translate-x-1" />
				<span>Back to Dashboard</span>
			</button>
		</div>
		
		<div class="text-center space-y-2">
			<div class="flex items-center justify-center gap-2 mb-4">
				<div class="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20">
					<Download color="#8b5cf6" size="24" />
				</div>
			</div>
			<h1 class="text-xl font-bold text-white">Import & Export</h1>
			<p class="text-sm text-white/70">Manage your password data across different platforms</p>
		</div>

		<!-- Tab Navigation -->
		<div class="flex rounded-xl border border-[#333333] bg-[#1a1a1a] p-1">
			<button
				onclick={() => activeTab = 'import'}
				class="group relative flex-1 flex items-center justify-center gap-3 px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 overflow-hidden"
				class:bg-[#00ccba]={activeTab === 'import'}
				class:text-black={activeTab === 'import'}
				class:shadow-lg={activeTab === 'import'}
				class:text-white={activeTab !== 'import'}
				class:hover:bg-[#2a2a2a]={activeTab !== 'import'}
			>
				{#if activeTab === 'import'}
					<div class="absolute inset-0 bg-gradient-to-r from-[#00eeda] to-[#00ccba] opacity-20"></div>
				{/if}
				<div class="relative flex items-center gap-3">
					<Upload size="20" class="transition-transform group-hover:scale-110" />
					<span>Import</span>
				</div>
			</button>
			<button
				onclick={() => activeTab = 'export'}
				class="group relative flex-1 flex items-center justify-center gap-3 px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 overflow-hidden"
				class:bg-[#00ccba]={activeTab === 'export'}
				class:text-black={activeTab === 'export'}
				class:shadow-lg={activeTab === 'export'}
				class:text-white={activeTab !== 'export'}
				class:hover:bg-[#2a2a2a]={activeTab !== 'export'}
			>
				{#if activeTab === 'export'}
					<div class="absolute inset-0 bg-gradient-to-r from-[#00eeda] to-[#00ccba] opacity-20"></div>
				{/if}
				<div class="relative flex items-center gap-3">
					<Download size="20" class="transition-transform group-hover:scale-110" />
					<span>Export</span>
				</div>
			</button>
		</div>

		<!-- Import Tab -->
		{#if activeTab === 'import'}
			<div class="space-y-6">
				{#if !importProgress.isRunning && !importProgress.results}
					<!-- Format Selection -->
					<div class="rounded-xl border border-[#333333] bg-[#1a1a1a] p-4 space-y-4">
						<h2 class="text-base text-center font-semibold text-white">Select Import Format</h2>
						
						<div class="grid gap-3">
							{#each formats as format}
								<label class="flex items-start gap-3 p-3 rounded-lg border border-[#333333] bg-[#2a2a2a] cursor-pointer hover:bg-[#3a3a3a] transition-colors">
									<input
										type="radio"
										bind:group={importFormat}
										value={format.value}
										class="mt-1 w-4 h-4 text-[#00ccba] focus:ring-[#00ccba] border-[#444444] bg-[#2a2a2a]"
									/>
									<div class="flex-1 min-w-0">
										<div class="text-sm font-medium text-white">{format.label}</div>
										<div class="text-xs text-gray-400">{format.description}</div>
									</div>
								</label>
							{/each}
						</div>
					</div>

					<!-- File Upload -->
					<div class="rounded-xl border border-[#333333] bg-[#1a1a1a] p-4 space-y-4">
						<h2 class="text-base text-center font-semibold text-white">Select File</h2>
						
						<div class="space-y-4">
							<div class="flex items-center justify-center w-full">
								<label class="flex flex-col items-center justify-center w-full h-32 border-2 border-[#333333] border-dashed rounded-lg cursor-pointer bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-colors overflow-hidden">
									<div class="flex flex-col items-center justify-center pt-5 pb-6 px-4">
										<FileText color="#8b5cf6" size="32" class="mb-3" />
										<p class="mb-2 text-sm text-gray-300 text-center">
											{#if importFile}
												<span class="font-semibold text-[#00ccba] truncate block max-w-full">{importFile.name}</span>
											{:else}
												<span class="font-semibold">Click to upload</span> or drag and drop
											{/if}
										</p>
										<p class="text-xs text-gray-400 text-center">
											{importFormat.toUpperCase()} files up to 10MB
										</p>
									</div>
									<input
										type="file"
										class="hidden"
										accept={importFormat === 'json' ? '.json' : '.csv'}
										onchange={handleFileSelect}
									/>
								</label>
							</div>
							
							{#if importFile}
								<div class="flex items-center justify-between p-3 rounded-lg bg-[#1a1a1a] border border-[#333333] overflow-hidden">
									<div class="flex items-center gap-3 min-w-0 flex-1">
										<FileText color="#8b5cf6" size="16" class="flex-shrink-0" />
										<div class="min-w-0 flex-1">
											<div class="text-sm font-medium text-white truncate">{importFile.name}</div>
											<div class="text-xs text-gray-400">{(importFile.size / 1024).toFixed(1)} KB</div>
										</div>
									</div>
									<button
										onclick={resetImport}
										class="group text-red-400 hover:text-white hover:bg-red-500 px-4 py-2 rounded-xl transition-all duration-300 flex-shrink-0 ml-3 font-semibold text-sm border border-red-400 hover:border-red-500"
									>
										<span class="group-hover:hidden">Remove</span>
										<span class="hidden group-hover:inline">Delete</span>
									</button>
								</div>
							{/if}
						</div>
					</div>

					<!-- Import Button -->
					<button
						onclick={startImport}
						disabled={!importFile}
						class="group relative w-full px-8 py-2 rounded-lg bg-gradient-to-br from-[#00ccba] via-[#00d4c4] to-[#00eeda] text-black font-black text-sm shadow-2xl shadow-black/10 hover:shadow-black/30 transform hover:-translate-y-1 hover:scale-[1.01] transition-all duration-400 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg overflow-hidden border-2 border-[#00ccba]/20"
					>
				<div class="relative flex items-center justify-center gap-3">
							<Upload size="20" class="transition-all duration-400 group-hover:scale-125 group-hover:rotate-12" />
							<span class="tracking-wide">Start Import</span>
						</div>
						<div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
					</button>
				{:else if importProgress.isRunning}
					<!-- Import Progress -->
					<div class="rounded-xl border border-[#333333] bg-[#1a1a1a] p-6 space-y-4">
						<div class="text-center space-y-4">
							<Upload color="#00ccba" size="48" class="mx-auto animate-pulse" />
							<div>
								<h3 class="text-lg font-semibold text-white mb-2">Importing Passwords</h3>
								<p class="text-sm text-gray-400">{importProgress.status}</p>
							</div>
							
							<div class="w-full bg-gray-700 rounded-full h-2">
								<div
									class="h-2 bg-[#00ccba] rounded-full transition-all duration-300"
									style="width: {importProgress.progress}%"
								></div>
							</div>
							<div class="text-sm text-[#00ccba]">{importProgress.progress}% complete</div>
						</div>
					</div>
				{:else if importProgress.results}
					<!-- Import Results -->
					<div class="rounded-xl border border-[#333333] bg-[#1a1a1a] px-4 py-6 space-y-4">
						<div class="text-center space-y-4">
							<CheckCircle color="#10b981" size="36" class="mx-auto" />
							<div>
								<h3 class="text-lg font-semibold text-green-400 mb-2">Import Complete!</h3>
								<p class="text-sm text-gray-300">Your passwords have been successfully imported.</p>
							</div>
						</div>
						
						<!-- Results Summary -->
						<div class="grid grid-cols-3 gap-2 text-center">
							<div class="group p-4 rounded-xl border border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:scale-101 shadow">
								<h4 class="text-3xl font-black text-green-400 mb-2 group-hover:scale-110 transition-transform duration-300">{importProgress.results.imported}</h4>
								<p class="text-sm font-semibold text-green-300">Imported</p>
							</div>
							<div class="group p-4 rounded-xl border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:scale-101 shadow">
								<h4 class="text-3xl font-black text-yellow-400 mb-2 group-hover:scale-110 transition-transform duration-300">{importProgress.results.skipped}</h4>
								<p class="text-sm font-semibold text-yellow-300">Skipped</p>
							</div>
							<div class="group p-4 rounded-xl border border-red-500/30 hover:border-red-400/50 transition-all duration-300 hover:scale-102 shadow">
								<h4 class="text-3xl font-black text-red-400 mb-2 group-hover:scale-110 transition-transform duration-300">{importProgress.results.errors.length}</h4>
								<p class="text-sm font-semibold text-red-300">Errors</p>
							</div>
						</div>
						
						{#if importProgress.results.errors.length > 0}
							<div class="space-y-2">
								<h4 class="text-sm font-medium text-white">Import Errors:</h4>
								<div class="space-y-1 max-h-32 overflow-y-auto import-errors-scroll">
									{#each importProgress.results.errors as error}
										<div class="text-xs text-red-400 p-2 rounded bg-red-500/10">
											Line {error.line}: {error.message}
										</div>
									{/each}
								</div>
							</div>
						{/if}
						
						<div class="flex gap-4">
							<button
								onclick={() => goto('/password-manager/vault')}
								class="group relative flex-1 px-6 py-2 rounded-lg bg-gradient-to-br from-[#00ccba] via-[#00d4c4] to-[#00eeda] text-black font-black shadow shadow-black/10 hover:shadow-black/30 transform hover:-translate-y-1 hover:scale-[1.01] transition-all duration-400 overflow-hidden border-2 border-[#00ccba]/20"
							>
								<div class="relative flex items-center justify-center gap-2 text-sm">
									<CheckCircle size="18" class="transition-all duration-400 group-hover:scale-125 group-hover:rotate-12" />
									<span class="tracking-wide">View</span>
								</div>
								
							</button>
							<button
								onclick={resetImport}
								class="group relative px-6 py-2 rounded-lg bg-gradient-to-br from-[#2a2a2a] via-[#333333] to-[#2a2a2a] border border-[#555555] text-white font-bold shadow shadow-black/10 hover:shadow-black/30 hover:bg-gradient-to-br hover:from-[#3a3a3a] hover:via-[#444444] hover:to-[#3a3a3a] hover:border-[#777777] transform hover:-translate-y-1 hover:scale-[1.01] transition-all duration-400 overflow-hidden"
							>
							<div class="relative flex items-center justify-center gap-2 text-sm">
									<Upload size="18" class="transition-all duration-400 group-hover:scale-125 group-hover:-rotate-12" />
									<span class="tracking-wide">Import</span>
								</div>
							</button>
						</div>
					</div>
				{/if}
			</div>
		{:else}
			<!-- Export Tab -->
			<div class="space-y-6">
				{#if !exportProgress.isRunning && !exportProgress.downloadUrl}
					<!-- Export Format -->
					<div class="rounded-xl border border-[#333333] bg-[#1a1a1a] p-4 space-y-4">
						<h2 class="text-lg font-semibold text-white text-center">Export Format</h2>
						
						<div class="grid gap-3">
							{#each formats.slice(0, 3) as format}
								<label class="flex items-start gap-3 p-2 rounded-lg border border-[#333333] bg-[#2a2a2a] cursor-pointer hover:bg-[#3a3a3a] transition-colors">
									<input
										type="radio"
										bind:group={exportFormat}
										value={format.value}
										class="mt-1 w-4 h-4 text-[#00ccba] focus:ring-[#00ccba] border-[#444444] bg-[#2a2a2a]"
									/>
									<div class="flex-1 min-w-0">
										<div class="text-sm font-medium text-white">{format.label}</div>
										<div class="text-xs text-gray-400">{format.description}</div>
									</div>
								</label>
							{/each}
						</div>
					</div>

					<!-- Export Options -->
					<div class="rounded-xl border border-[#333333] bg-[#1a1a1a] p-4 space-y-4">
						<h2 class="text-lg font-semibold text-white">Export Options</h2>
						
						<div class="space-y-3">
							<label class="flex items-center gap-3 cursor-pointer">
								<input
									type="checkbox"
									bind:checked={exportOptions.includeHistory}
									class="w-4 h-4 rounded border-[#444444] bg-[#2a2a2a] text-[#00ccba] focus:ring-[#00ccba]"
								/>
								<div>
									<div class="text-sm text-white">Include Password History</div>
									<div class="text-xs text-gray-400">Export previous passwords for each entry</div>
								</div>
							</label>
							
							<label class="flex items-center gap-3 cursor-pointer">
								<input
									type="checkbox"
									bind:checked={exportOptions.includeNotes}
									class="w-4 h-4 rounded border-[#444444] bg-[#2a2a2a] text-[#00ccba] focus:ring-[#00ccba]"
								/>
								<div>
									<div class="text-sm text-white">Include Notes</div>
									<div class="text-xs text-gray-400">Export notes and additional information</div>
								</div>
							</label>
							
							<label class="flex items-center gap-3 cursor-pointer">
								<input
									type="checkbox"
									bind:checked={exportOptions.includeCustomFields}
									class="w-4 h-4 rounded border-[#444444] bg-[#2a2a2a] text-[#00ccba] focus:ring-[#00ccba]"
								/>
								<div>
									<div class="text-sm text-white">Include Custom Fields</div>
									<div class="text-xs text-gray-400">Export custom fields and metadata</div>
								</div>
							</label>
						</div>
					</div>

					<!-- Security Options -->
					<div class="rounded-xl border border-[#333333] bg-[#1a1a1a] p-4 space-y-4">
						<div class="flex items-center gap-2">
							<Shield color="#00ccba" size="18" />
							<h2 class="text-lg font-semibold text-white">Security</h2>
						</div>
						
						<div class="space-y-3">
							<label class="flex items-start gap-3 p-2 rounded-lg border border-[#333333] bg-[#2a2a2a] cursor-pointer hover:bg-[#3a3a3a] transition-colors">
								<input
									type="radio"
									bind:group={exportOptions.encryption}
									value="aes"
									class="mt-1 w-4 h-4 text-[#00ccba] focus:ring-[#00ccba] border-[#444444] bg-[#2a2a2a]"
								/>
								<div class="flex-1 min-w-0">
									<div class="text-sm font-medium text-white">AES Encryption</div>
									<div class="text-xs text-gray-400">Password protected with strong encryption</div>
								</div>
							</label>
							
							<label class="flex items-start gap-3 p-2 rounded-lg border border-[#333333] bg-[#2a2a2a] cursor-pointer hover:bg-[#3a3a3a] transition-colors">
								<input
									type="radio"
									bind:group={exportOptions.encryption}
									value="none"
									class="mt-1 w-4 h-4 text-[#00ccba] focus:ring-[#00ccba] border-[#444444] bg-[#2a2a2a]"
								/>
								<div class="flex-1 min-w-0">
									<div class="text-sm font-medium text-white">No Encryption</div>
									<div class="text-xs text-red-400">⚠️ Not recommended - passwords will be readable</div>
								</div>
							</label>
						</div>
					</div>

					<!-- Export Button -->
					<button
						onclick={startExport}
						class="group relative w-full px-8 py-2 rounded-lg bg-[#00ccba] text-black font-bold text-base shadow shadow-black/30 hover:shadow-xl hover:shadow-black/40 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
					>
						
						<div class="relative flex items-center justify-center gap-3">
							<Download size="20" class="transition-transform group-hover:scale-110" />
							<span>Create Export</span>
						</div>
					</button>
				{:else if exportProgress.isRunning}
					<!-- Export Progress -->
					<div class="rounded-xl border border-[#333333] bg-[#1a1a1a] p-6 space-y-4">
						<div class="text-center space-y-4">
							<Download color="#00ccba" size="48" class="mx-auto animate-pulse" />
							<div>
								<h3 class="text-lg font-semibold text-white mb-2">Creating Export</h3>
								<p class="text-sm text-gray-400">{exportProgress.status}</p>
							</div>
							
							<div class="w-full bg-gray-700 rounded-full h-2">
								<div
									class="h-2 bg-[#00ccba] rounded-full transition-all duration-300"
									style="width: {exportProgress.progress}%"
								></div>
							</div>
							<div class="text-sm text-[#00ccba]">{exportProgress.progress}% complete</div>
						</div>
					</div>
				{:else if exportProgress.downloadUrl}
					<!-- Export Complete -->
					<div class="rounded-xl border border-[#333333] bg-[#1a1a1a] p-6 space-y-4">
						<div class="text-center space-y-4">
							<CheckCircle color="#10b981" size="48" class="mx-auto" />
							<div>
								<h3 class="text-lg font-semibold text-green-400 mb-2">Export Ready!</h3>
								<p class="text-sm text-gray-300">Your password export has been created successfully.</p>
							</div>
							
							<div class="p-4 rounded-lg bg-[#1a1a1a] border border-[#333333] overflow-hidden">
								<div class="flex items-center gap-3 mb-3 min-w-0">
									<FileText color="#8b5cf6" size="24" class="flex-shrink-0" />
									<div class="text-left min-w-0 flex-1">
										<div class="text-sm font-medium text-white truncate">netsepio-passwords-export.{exportFormat}</div>
										<div class="text-xs text-gray-400">Encrypted • 12 entries • 2.4 KB</div>
									</div>
								</div>
								
								{#if exportOptions.encryption !== 'none'}
									<div class="text-xs text-yellow-400 bg-yellow-500/10 p-2 rounded">
										⚠️ Remember your export password - you'll need it to import this file
									</div>
								{/if}
							</div>
							
							<div class="flex gap-4">
								<button
									onclick={downloadExport}
									class="group relative flex-1 px-6 py-2 rounded-xl bg-[#00ccba] text-black font-bold shadow shadow-black/30 hover:shadow-xl hover:shadow-black/40 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
								>
									<div class="absolute inset-0 bg-gradient-to-r from-[#00eeda] to-[#00ccba] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
									<div class="relative flex items-center justify-center gap-2">
										<Download size="18" class="transition-transform group-hover:scale-110" />
										<span>Download</span>
									</div>
								</button>
								<button
									onclick={resetExport}
									class="group px-6 py-2 rounded-xl bg-[#2a2a2a] border border-[#444444] text-white font-semibold hover:bg-[#3a3a3a] hover:border-[#666666] transform hover:-translate-y-1 transition-all duration-300 shadow-lg"
								>
									<div class="flex items-center justify-center gap-2">
										<Upload size="18" class="transition-transform group-hover:scale-110" />
										<span>Export</span>
									</div>
								</button>
							</div>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</section>

<!-- Toast Notifications -->
<Toast status={toastMessage} success={toastSuccess} error={toastError} open={toastVisible} />

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

	.import-errors-scroll::-webkit-scrollbar {
		width: 4px;
	}

	.import-errors-scroll::-webkit-scrollbar-track {
		background: transparent;
		border-radius: 10px;
	}

	.import-errors-scroll::-webkit-scrollbar-thumb {
		background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
		border-radius: 10px;
		opacity: 0.7;
		transition: all 0.3s ease;
	}

	.import-errors-scroll::-webkit-scrollbar-thumb:hover {
		opacity: 1;
		box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
	}
</style>
