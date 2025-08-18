<script lang="ts">
	import VpnHeader from '$lib/components/ui/vpn-header.svelte';
	import { goto } from '$app/navigation';
	import { Settings, Shield, Smartphone, Clock, Download, Monitor, ArrowLeft, Save } from '@lucide/svelte';

	// Settings state - mock data for now
	let settings = $state({
		general: {
			autoLockTimeout: 15,
			autoSave: true,
			showPasswordStrength: true,
			defaultPasswordLength: 16,
			enableClipboardTimeout: 30,
			showNotifications: true
		},
		security: {
			requireMasterPassword: true,
			enableBiometric: false,
			sessionTimeout: 60,
			maxLoginAttempts: 3,
			enableBreachMonitoring: true,
			autoLogoutOnSuspend: true
		},
		autofill: {
			enabled: true,
			showAutofillIcon: true,
			autoSubmit: false,
			onlyHTTPS: true,
			matchingStrategy: 'subdomain',
			confirmBeforeAutofill: true
		},
		backup: {
			enabled: true,
			frequency: 'weekly',
			location: 'local',
			keepBackups: 5,
			encryptBackups: true
		},
		ui: {
			theme: 'system',
			compactView: false,
			showFavicons: true,
			defaultView: 'list',
			itemsPerPage: 25
		}
	});
	
	let activeSection = $state('general');
	let hasChanges = $state(false);
	let saveStatus = $state('');

	function saveSettings() {
		saveStatus = 'saving';
		// Simulate save process
		setTimeout(() => {
			saveStatus = 'saved';
			hasChanges = false;
			setTimeout(() => saveStatus = '', 2000);
		}, 1000);
	}
	
	function resetToDefaults() {
		if (confirm('Reset all settings to default values? This cannot be undone.')) {
			// Reset to defaults
			hasChanges = true;
		}
	}
	
	// Watch for changes
	$effect(() => {
		hasChanges = true;
	});
</script>

<section class="h-full overflow-y-auto bg-[#111111] text-white password-manager-scroll">
	<VpnHeader />
	
	<div class="space-y-6 p-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<button
				onclick={() => goto('/password-manager')}
				class="flex items-center gap-2 text-[#00ccba] hover:text-[#00eeda] transition-colors"
			>
				<ArrowLeft size="16" />
				<span class="text-sm">Back to Dashboard</span>
			</button>
			
			{#if hasChanges}
				<button
					onclick={saveSettings}
					disabled={saveStatus === 'saving'}
					class="flex items-center gap-2 px-3 py-1.5 rounded-3xl bg-[#00ccba] text-black text-sm font-medium hover:bg-[#00eeda] transition-colors disabled:opacity-50"
				>
					<Save size="14" />
					{#if saveStatus === 'saving'}
						Saving...
					{:else if saveStatus === 'saved'}
						Saved!
					{:else}
						Save Changes
					{/if}
				</button>
			{/if}
		</div>
		
		<div class="text-center space-y-2">
			<div class="flex items-center justify-center gap-2 mb-4">
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-500/20">
					<Settings color="#6b7280" size="24" />
				</div>
			</div>
			<h1 class="text-2xl font-bold text-white">Settings</h1>
			<p class="text-sm text-white/70">Configure your password manager preferences</p>
		</div>

		<!-- Settings Navigation -->
		<div class="flex flex-wrap gap-2 p-1 rounded-lg border border-[#333333] bg-[#1a1a1a]">
			<button
				onclick={() => activeSection = 'general'}
				class="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
				class:bg-[#00ccba]={activeSection === 'general'}
				class:text-black={activeSection === 'general'}
				class:text-white={activeSection !== 'general'}
			>
				General
			</button>
			<button
				onclick={() => activeSection = 'security'}
				class="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
				class:bg-[#00ccba]={activeSection === 'security'}
				class:text-black={activeSection === 'security'}
				class:text-white={activeSection !== 'security'}
			>
				Security
			</button>
			<button
				onclick={() => activeSection = 'autofill'}
				class="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
				class:bg-[#00ccba]={activeSection === 'autofill'}
				class:text-black={activeSection === 'autofill'}
				class:text-white={activeSection !== 'autofill'}
			>
				Auto-fill
			</button>
			<button
				onclick={() => activeSection = 'backup'}
				class="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
				class:bg-[#00ccba]={activeSection === 'backup'}
				class:text-black={activeSection === 'backup'}
				class:text-white={activeSection !== 'backup'}
			>
				Backup
			</button>
			<button
				onclick={() => activeSection = 'ui'}
				class="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
				class:bg-[#00ccba]={activeSection === 'ui'}
				class:text-black={activeSection === 'ui'}
				class:text-white={activeSection !== 'ui'}
			>
				Interface
			</button>
		</div>

		<!-- General Settings -->
		{#if activeSection === 'general'}
			<div class="space-y-4">
				<div class="rounded-xl border border-[#333333] bg-[#1a1a1a] p-6 space-y-6">
					<div class="flex items-center gap-2 mb-4">
						<Monitor color="#00ccba" size="20" />
						<h2 class="text-lg font-semibold text-white">General Preferences</h2>
					</div>
					
					<!-- Auto-lock timeout -->
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<div>
								<div class="text-sm font-medium text-white">Auto-lock Timeout</div>
								<div class="text-xs text-gray-400">Lock the password manager after inactivity</div>
							</div>
							<div class="text-sm text-[#00ccba]">{settings.general.autoLockTimeout} min</div>
						</div>
						<select
							bind:value={settings.general.autoLockTimeout}
							class="w-full px-3 py-2 rounded-lg bg-[#2a2a2a] border border-[#333333] text-white text-sm focus:border-[#00ccba] focus:ring-1 focus:ring-[#00ccba]"
						>
							<option value={5}>5 minutes</option>
							<option value={15}>15 minutes</option>
							<option value={30}>30 minutes</option>
							<option value={60}>1 hour</option>
							<option value={120}>2 hours</option>
							<option value={0}>Never</option>
						</select>
					</div>
					
					<!-- Default password length -->
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<div>
								<div class="text-sm font-medium text-white">Default Password Length</div>
								<div class="text-xs text-gray-400">Length for newly generated passwords</div>
							</div>
							<div class="text-sm text-[#00ccba]">{settings.general.defaultPasswordLength}</div>
						</div>
						<input
							type="range"
							min="8"
							max="50"
							bind:value={settings.general.defaultPasswordLength}
							class="w-full"
						/>
						<div class="flex justify-between text-xs text-gray-400">
							<span>8</span>
							<span>50</span>
						</div>
					</div>
					
					<!-- Clipboard timeout -->
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<div>
								<div class="text-sm font-medium text-white">Clipboard Timeout</div>
								<div class="text-xs text-gray-400">Clear clipboard after copying password</div>
							</div>
							<div class="text-sm text-[#00ccba]">{settings.general.enableClipboardTimeout}s</div>
						</div>
						<select
							bind:value={settings.general.enableClipboardTimeout}
							class="w-full px-3 py-2 rounded-lg bg-[#2a2a2a] border border-[#333333] text-white text-sm focus:border-[#00ccba] focus:ring-1 focus:ring-[#00ccba]"
						>
							<option value={0}>Never</option>
							<option value={10}>10 seconds</option>
							<option value={30}>30 seconds</option>
							<option value={60}>1 minute</option>
							<option value={300}>5 minutes</option>
						</select>
					</div>
					
					<!-- Toggle settings -->
					<div class="space-y-4">
						<label class="flex items-center justify-between cursor-pointer">
							<div>
								<div class="text-sm font-medium text-white">Auto-save Changes</div>
								<div class="text-xs text-gray-400">Automatically save password entries</div>
							</div>
							<input
								type="checkbox"
								bind:checked={settings.general.autoSave}
								class="w-4 h-4 rounded border-[#444444] bg-[#2a2a2a] text-[#00ccba] focus:ring-[#00ccba]"
							/>
						</label>
						
						<label class="flex items-center justify-between cursor-pointer">
							<div>
								<div class="text-sm font-medium text-white">Show Password Strength</div>
								<div class="text-xs text-gray-400">Display strength indicators</div>
							</div>
							<input
								type="checkbox"
								bind:checked={settings.general.showPasswordStrength}
								class="w-4 h-4 rounded border-[#444444] bg-[#2a2a2a] text-[#00ccba] focus:ring-[#00ccba]"
							/>
						</label>
						
						<label class="flex items-center justify-between cursor-pointer">
							<div>
								<div class="text-sm font-medium text-white">Show Notifications</div>
								<div class="text-xs text-gray-400">Display system notifications</div>
							</div>
							<input
								type="checkbox"
								bind:checked={settings.general.showNotifications}
								class="w-4 h-4 rounded border-[#444444] bg-[#2a2a2a] text-[#00ccba] focus:ring-[#00ccba]"
							/>
						</label>
					</div>
				</div>
			</div>
		{:else if activeSection === 'security'}
			<div class="space-y-4">
				<div class="rounded-xl border border-[#333333] bg-[#1a1a1a] p-6 space-y-6">
					<div class="flex items-center gap-2 mb-4">
						<Shield color="#00ccba" size="20" />
						<h2 class="text-lg font-semibold text-white">Security Settings</h2>
					</div>
					
					<!-- Session timeout -->
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<div>
								<div class="text-sm font-medium text-white">Session Timeout</div>
								<div class="text-xs text-gray-400">How long to stay logged in</div>
							</div>
							<div class="text-sm text-[#00ccba]">{settings.security.sessionTimeout} min</div>
						</div>
						<select
							bind:value={settings.security.sessionTimeout}
							class="w-full px-3 py-2 rounded-lg bg-[#2a2a2a] border border-[#333333] text-white text-sm focus:border-[#00ccba] focus:ring-1 focus:ring-[#00ccba]"
						>
							<option value={15}>15 minutes</option>
							<option value={30}>30 minutes</option>
							<option value={60}>1 hour</option>
							<option value={240}>4 hours</option>
							<option value={480}>8 hours</option>
						</select>
					</div>
					
					<!-- Max login attempts -->
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<div>
								<div class="text-sm font-medium text-white">Max Login Attempts</div>
								<div class="text-xs text-gray-400">Lock account after failed attempts</div>
							</div>
							<div class="text-sm text-[#00ccba]">{settings.security.maxLoginAttempts}</div>
						</div>
						<select
							bind:value={settings.security.maxLoginAttempts}
							class="w-full px-3 py-2 rounded-lg bg-[#2a2a2a] border border-[#333333] text-white text-sm focus:border-[#00ccba] focus:ring-1 focus:ring-[#00ccba]"
						>
							<option value={3}>3 attempts</option>
							<option value={5}>5 attempts</option>
							<option value={10}>10 attempts</option>
						</select>
					</div>
					
					<!-- Security toggles -->
					<div class="space-y-4">
						<label class="flex items-center justify-between cursor-pointer">
							<div>
								<div class="text-sm font-medium text-white">Require Master Password</div>
								<div class="text-xs text-gray-400">Always require password to unlock</div>
							</div>
							<input
								type="checkbox"
								bind:checked={settings.security.requireMasterPassword}
								class="w-4 h-4 rounded border-[#444444] bg-[#2a2a2a] text-[#00ccba] focus:ring-[#00ccba]"
							/>
						</label>
						
						<label class="flex items-center justify-between cursor-pointer">
							<div>
								<div class="text-sm font-medium text-white">Enable Biometric Authentication</div>
								<div class="text-xs text-gray-400">Use fingerprint or face ID</div>
							</div>
							<input
								type="checkbox"
								bind:checked={settings.security.enableBiometric}
								class="w-4 h-4 rounded border-[#444444] bg-[#2a2a2a] text-[#00ccba] focus:ring-[#00ccba]"
							/>
						</label>
						
						<label class="flex items-center justify-between cursor-pointer">
							<div>
								<div class="text-sm font-medium text-white">Breach Monitoring</div>
								<div class="text-xs text-gray-400">Check passwords against known breaches</div>
							</div>
							<input
								type="checkbox"
								bind:checked={settings.security.enableBreachMonitoring}
								class="w-4 h-4 rounded border-[#444444] bg-[#2a2a2a] text-[#00ccba] focus:ring-[#00ccba]"
							/>
						</label>
						
						<label class="flex items-center justify-between cursor-pointer">
							<div>
								<div class="text-sm font-medium text-white">Auto-logout on Suspend</div>
								<div class="text-xs text-gray-400">Lock when device is suspended</div>
							</div>
							<input
								type="checkbox"
								bind:checked={settings.security.autoLogoutOnSuspend}
								class="w-4 h-4 rounded border-[#444444] bg-[#2a2a2a] text-[#00ccba] focus:ring-[#00ccba]"
							/>
						</label>
					</div>
				</div>
			</div>
		{:else if activeSection === 'autofill'}
			<div class="space-y-4">
				<div class="rounded-xl border border-[#333333] bg-[#1a1a1a] p-6 space-y-6">
					<div class="flex items-center gap-2 mb-4">
						<Smartphone color="#00ccba" size="20" />
						<h2 class="text-lg font-semibold text-white">Auto-fill Settings</h2>
					</div>
					
					<!-- Matching strategy -->
					<div class="space-y-2">
						<div>
							<div class="text-sm font-medium text-white">Matching Strategy</div>
							<div class="text-xs text-gray-400">How to match websites to passwords</div>
						</div>
						<select
							bind:value={settings.autofill.matchingStrategy}
							class="w-full px-3 py-2 rounded-lg bg-[#2a2a2a] border border-[#333333] text-white text-sm focus:border-[#00ccba] focus:ring-1 focus:ring-[#00ccba]"
						>
							<option value="exact">Exact match only</option>
							<option value="subdomain">Include subdomains</option>
							<option value="domain">Entire domain</option>
							<option value="relaxed">Relaxed matching</option>
						</select>
					</div>
					
					<!-- Auto-fill toggles -->
					<div class="space-y-4">
						<label class="flex items-center justify-between cursor-pointer">
							<div>
								<div class="text-sm font-medium text-white">Enable Auto-fill</div>
								<div class="text-xs text-gray-400">Automatically fill login forms</div>
							</div>
							<input
								type="checkbox"
								bind:checked={settings.autofill.enabled}
								class="w-4 h-4 rounded border-[#444444] bg-[#2a2a2a] text-[#00ccba] focus:ring-[#00ccba]"
							/>
						</label>
						
						<label class="flex items-center justify-between cursor-pointer">
							<div>
								<div class="text-sm font-medium text-white">Show Auto-fill Icon</div>
								<div class="text-xs text-gray-400">Display icon in password fields</div>
							</div>
							<input
								type="checkbox"
								bind:checked={settings.autofill.showAutofillIcon}
								class="w-4 h-4 rounded border-[#444444] bg-[#2a2a2a] text-[#00ccba] focus:ring-[#00ccba]"
							/>
						</label>
						
						<label class="flex items-center justify-between cursor-pointer">
							<div>
								<div class="text-sm font-medium text-white">Auto-submit Forms</div>
								<div class="text-xs text-gray-400">Submit forms after auto-fill</div>
							</div>
							<input
								type="checkbox"
								bind:checked={settings.autofill.autoSubmit}
								class="w-4 h-4 rounded border-[#444444] bg-[#2a2a2a] text-[#00ccba] focus:ring-[#00ccba]"
							/>
						</label>
						
						<label class="flex items-center justify-between cursor-pointer">
							<div>
								<div class="text-sm font-medium text-white">HTTPS Only</div>
								<div class="text-xs text-gray-400">Only auto-fill on secure sites</div>
							</div>
							<input
								type="checkbox"
								bind:checked={settings.autofill.onlyHTTPS}
								class="w-4 h-4 rounded border-[#444444] bg-[#2a2a2a] text-[#00ccba] focus:ring-[#00ccba]"
							/>
						</label>
						
						<label class="flex items-center justify-between cursor-pointer">
							<div>
								<div class="text-sm font-medium text-white">Confirm Before Auto-fill</div>
								<div class="text-xs text-gray-400">Ask for confirmation before filling</div>
							</div>
							<input
								type="checkbox"
								bind:checked={settings.autofill.confirmBeforeAutofill}
								class="w-4 h-4 rounded border-[#444444] bg-[#2a2a2a] text-[#00ccba] focus:ring-[#00ccba]"
							/>
						</label>
					</div>
				</div>
			</div>
		{:else if activeSection === 'backup'}
			<div class="space-y-4">
				<div class="rounded-xl border border-[#333333] bg-[#1a1a1a] p-6 space-y-6">
					<div class="flex items-center gap-2 mb-4">
						<Download color="#00ccba" size="20" />
						<h2 class="text-lg font-semibold text-white">Backup Settings</h2>
					</div>
					
					<!-- Backup frequency -->
					<div class="space-y-2">
						<div>
							<div class="text-sm font-medium text-white">Backup Frequency</div>
							<div class="text-xs text-gray-400">How often to create automatic backups</div>
						</div>
						<select
							bind:value={settings.backup.frequency}
							class="w-full px-3 py-2 rounded-lg bg-[#2a2a2a] border border-[#333333] text-white text-sm focus:border-[#00ccba] focus:ring-1 focus:ring-[#00ccba]"
						>
							<option value="daily">Daily</option>
							<option value="weekly">Weekly</option>
							<option value="monthly">Monthly</option>
						</select>
					</div>
					
					<!-- Keep backups -->
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<div>
								<div class="text-sm font-medium text-white">Keep Backups</div>
								<div class="text-xs text-gray-400">Number of backups to retain</div>
							</div>
							<div class="text-sm text-[#00ccba]">{settings.backup.keepBackups}</div>
						</div>
						<select
							bind:value={settings.backup.keepBackups}
							class="w-full px-3 py-2 rounded-lg bg-[#2a2a2a] border border-[#333333] text-white text-sm focus:border-[#00ccba] focus:ring-1 focus:ring-[#00ccba]"
						>
							<option value={3}>3 backups</option>
							<option value={5}>5 backups</option>
							<option value={10}>10 backups</option>
							<option value={20}>20 backups</option>
						</select>
					</div>
					
					<!-- Backup toggles -->
					<div class="space-y-4">
						<label class="flex items-center justify-between cursor-pointer">
							<div>
								<div class="text-sm font-medium text-white">Enable Automatic Backups</div>
								<div class="text-xs text-gray-400">Create backups automatically</div>
							</div>
							<input
								type="checkbox"
								bind:checked={settings.backup.enabled}
								class="w-4 h-4 rounded border-[#444444] bg-[#2a2a2a] text-[#00ccba] focus:ring-[#00ccba]"
							/>
						</label>
						
						<label class="flex items-center justify-between cursor-pointer">
							<div>
								<div class="text-sm font-medium text-white">Encrypt Backups</div>
								<div class="text-xs text-gray-400">Password-protect backup files</div>
							</div>
							<input
								type="checkbox"
								bind:checked={settings.backup.encryptBackups}
								class="w-4 h-4 rounded border-[#444444] bg-[#2a2a2a] text-[#00ccba] focus:ring-[#00ccba]"
							/>
						</label>
					</div>
				</div>
			</div>
		{:else if activeSection === 'ui'}
			<div class="space-y-4">
				<div class="rounded-xl border border-[#333333] bg-[#1a1a1a] p-6 space-y-6">
					<div class="flex items-center gap-2 mb-4">
						<Monitor color="#00ccba" size="20" />
						<h2 class="text-lg font-semibold text-white">Interface Settings</h2>
					</div>
					
					<!-- Theme -->
					<div class="space-y-2">
						<div>
							<div class="text-sm font-medium text-white">Theme</div>
							<div class="text-xs text-gray-400">Visual appearance</div>
						</div>
						<select
							bind:value={settings.ui.theme}
							class="w-full px-3 py-2 rounded-lg bg-[#2a2a2a] border border-[#333333] text-white text-sm focus:border-[#00ccba] focus:ring-1 focus:ring-[#00ccba]"
						>
							<option value="system">System</option>
							<option value="light">Light</option>
							<option value="dark">Dark</option>
						</select>
					</div>
					
					<!-- Default view -->
					<div class="space-y-2">
						<div>
							<div class="text-sm font-medium text-white">Default View</div>
							<div class="text-xs text-gray-400">How to display password list</div>
						</div>
						<select
							bind:value={settings.ui.defaultView}
							class="w-full px-3 py-2 rounded-lg bg-[#2a2a2a] border border-[#333333] text-white text-sm focus:border-[#00ccba] focus:ring-1 focus:ring-[#00ccba]"
						>
							<option value="list">List View</option>
							<option value="grid">Grid View</option>
						</select>
					</div>
					
					<!-- Items per page -->
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<div>
								<div class="text-sm font-medium text-white">Items per Page</div>
								<div class="text-xs text-gray-400">Number of passwords to show</div>
							</div>
							<div class="text-sm text-[#00ccba]">{settings.ui.itemsPerPage}</div>
						</div>
						<select
							bind:value={settings.ui.itemsPerPage}
							class="w-full px-3 py-2 rounded-lg bg-[#2a2a2a] border border-[#333333] text-white text-sm focus:border-[#00ccba] focus:ring-1 focus:ring-[#00ccba]"
						>
							<option value={10}>10 items</option>
							<option value={25}>25 items</option>
							<option value={50}>50 items</option>
							<option value={100}>100 items</option>
						</select>
					</div>
					
					<!-- UI toggles -->
					<div class="space-y-4">
						<label class="flex items-center justify-between cursor-pointer">
							<div>
								<div class="text-sm font-medium text-white">Compact View</div>
								<div class="text-xs text-gray-400">Use smaller interface elements</div>
							</div>
							<input
								type="checkbox"
								bind:checked={settings.ui.compactView}
								class="w-4 h-4 rounded border-[#444444] bg-[#2a2a2a] text-[#00ccba] focus:ring-[#00ccba]"
							/>
						</label>
						
						<label class="flex items-center justify-between cursor-pointer">
							<div>
								<div class="text-sm font-medium text-white">Show Favicons</div>
								<div class="text-xs text-gray-400">Display website icons</div>
							</div>
							<input
								type="checkbox"
								bind:checked={settings.ui.showFavicons}
								class="w-4 h-4 rounded border-[#444444] bg-[#2a2a2a] text-[#00ccba] focus:ring-[#00ccba]"
							/>
						</label>
					</div>
				</div>
			</div>
		{/if}

		<!-- Action buttons -->
		<div class="flex gap-2">
			<button
				onclick={resetToDefaults}
				class="px-4 py-3 w-full  rounded-3xl border border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
			>
				Reset
			</button>
			<button
				onclick={() => goto('/password-manager')}
				class="flex-1 px-4 w-full py-3 rounded-3xl border border-[#333333] bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] transition-colors"
			>
				Cancel
			</button>
		</div>
	</div>
</section>

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
</style>
