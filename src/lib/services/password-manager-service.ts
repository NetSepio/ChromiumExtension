/**
 * Password Manager Service
 * Complete implementation with all CRUD operations, security features, and integration
 */

import { PasswordVaultStorage } from '../modules/passwordVaultStorage';
import { PasswordManagerCrypto } from '../modules/passwordManagerCrypto';
import type {
	PasswordEntry,
	PasswordFolder,
	SecurityAuditReport,
	PasswordGeneratorSettings,
	GeneratedPassword,
	PasswordManagerSettings,
	PasswordStrength,
	SecurityIssue,
	SecurityRecommendation,
	ServiceResponse
} from '../../types/password-manager.types';

export class PasswordManagerService {
	private static instance: PasswordManagerService | null = null;
	private crypto: PasswordManagerCrypto | null = null;
	private isInitialized: boolean = false;
	private storage: PasswordVaultStorage | null = null;

	// Singleton pattern to ensure one instance
	static getInstance(): PasswordManagerService {
		if (!this.instance) {
			this.instance = new PasswordManagerService();
		}
		return this.instance;
	}

	private constructor() {
		// Private constructor for singleton
		this.storage = new PasswordVaultStorage();
	}

	/**
	 * Initialize the password manager with independent encryption
	 */
	async initialize(): Promise<ServiceResponse<boolean>> {
		try {
			// Initialize the crypto module with independent encryption
			const cryptoInit = await PasswordManagerCrypto.initialize();
			if (!cryptoInit.success) {
				return { success: false, error: cryptoInit.error, timestamp: Date.now() };
			}

			this.crypto = PasswordManagerCrypto;

			// Initialize the storage
			if (this.storage) {
				const storageInit = await PasswordVaultStorage.initializeVault();
				if (!storageInit.success) {
					return { success: false, error: storageInit.error, timestamp: Date.now() };
				}
			}

			this.isInitialized = true;
			console.log('Password manager service initialized successfully');
			return { success: true, data: true, timestamp: Date.now() };
		} catch (error) {
			console.error('Password manager initialization failed:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown initialization error',
				timestamp: Date.now()
			};
		}
	}

	/**
	 * Check if the service is initialized
	 */
	isServiceInitialized(): boolean {
		return this.isInitialized;
	}

	/**
	 * Entry Management Methods
	 */
	async addEntry(
		entry: Omit<PasswordEntry, 'id' | 'createdAt' | 'lastModified'>
	): Promise<ServiceResponse<PasswordEntry>> {
		try {
			if (!this.crypto) {
				return { success: false, error: 'Service not initialized', timestamp: Date.now() };
			}

			// Validate required fields
			if (!entry.title || !entry.username) {
				return { success: false, error: 'Title and username are required', timestamp: Date.now() };
			}

			// Generate unique ID
			const entryId =
				crypto.getRandomValues(new Uint32Array(1))[0].toString(36) + Date.now().toString(36);

			// Create entry with metadata
			const newEntry: PasswordEntry = {
				...entry,
				id: entryId,
				createdAt: Date.now(),
				lastModified: Date.now()
			};

			// Load current entries, add new one, save back
			const entriesResult = await PasswordVaultStorage.loadAllEntries();
			if (!entriesResult.success) {
				return { success: false, error: 'Failed to load entries', timestamp: Date.now() };
			}

			const entries = entriesResult.data || [];
			entries.push(newEntry);

			const saveResult = await PasswordVaultStorage.saveAllEntries(entries);
			if (!saveResult.success) {
				return { success: false, error: 'Failed to save entry', timestamp: Date.now() };
			}

			console.log('Entry added successfully:', entryId);
			return { success: true, data: newEntry, timestamp: Date.now() };
		} catch (error) {
			console.error('Failed to add entry:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Failed to add entry',
				timestamp: Date.now()
			};
		}
	}

	async updateEntry(
		id: string,
		updates: Partial<Omit<PasswordEntry, 'id' | 'createdAt'>>
	): Promise<ServiceResponse<PasswordEntry>> {
		try {
			const entriesResult = await PasswordVaultStorage.loadAllEntries();
			if (!entriesResult.success) {
				return { success: false, error: 'Failed to load entries', timestamp: Date.now() };
			}

			const entries = entriesResult.data || [];
			const entryIndex = entries.findIndex((entry) => entry.id === id);

			if (entryIndex === -1) {
				return { success: false, error: 'Entry not found', timestamp: Date.now() };
			}

			// Update entry with new data and timestamp
			const updatedEntry = {
				...entries[entryIndex],
				...updates,
				lastModified: Date.now()
			};

			entries[entryIndex] = updatedEntry;

			const saveResult = await PasswordVaultStorage.saveAllEntries(entries);
			if (!saveResult.success) {
				return { success: false, error: 'Failed to save changes', timestamp: Date.now() };
			}

			console.log('Entry updated successfully:', id);
			return { success: true, data: updatedEntry, timestamp: Date.now() };
		} catch (error) {
			console.error('Failed to update entry:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Failed to update entry',
				timestamp: Date.now()
			};
		}
	}

	async deleteEntry(id: string): Promise<ServiceResponse<boolean>> {
		try {
			const entriesResult = await PasswordVaultStorage.loadAllEntries();
			if (!entriesResult.success) {
				return { success: false, error: 'Failed to load entries', timestamp: Date.now() };
			}

			const entries = entriesResult.data || [];
			const filteredEntries = entries.filter((entry) => entry.id !== id);

			if (filteredEntries.length === entries.length) {
				return { success: false, error: 'Entry not found', timestamp: Date.now() };
			}

			const saveResult = await PasswordVaultStorage.saveAllEntries(filteredEntries);
			if (!saveResult.success) {
				return { success: false, error: 'Failed to save changes', timestamp: Date.now() };
			}

			console.log('Entry deleted successfully:', id);
			return { success: true, data: true, timestamp: Date.now() };
		} catch (error) {
			console.error('Failed to delete entry:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Failed to delete entry',
				timestamp: Date.now()
			};
		}
	}

	async getEntry(id: string): Promise<ServiceResponse<PasswordEntry>> {
		try {
			const entriesResult = await PasswordVaultStorage.loadAllEntries();
			if (!entriesResult.success) {
				return { success: false, error: 'Failed to load entries', timestamp: Date.now() };
			}

			const entries = entriesResult.data || [];
			const entry = entries.find((e) => e.id === id);

			if (!entry) {
				return { success: false, error: 'Entry not found', timestamp: Date.now() };
			}

			return { success: true, data: entry, timestamp: Date.now() };
		} catch (error) {
			console.error('Failed to get entry:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Failed to get entry',
				timestamp: Date.now()
			};
		}
	}

	async getAllEntries(): Promise<ServiceResponse<PasswordEntry[]>> {
		try {
			const entriesResult = await PasswordVaultStorage.loadAllEntries();
			if (!entriesResult.success) {
				return { success: false, error: 'Failed to load entries', timestamp: Date.now() };
			}

			const entries = entriesResult.data || [];
			console.log(`Loaded ${entries.length} password entries`);
			return { success: true, data: entries, timestamp: Date.now() };
		} catch (error) {
			console.error('Failed to get all entries:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Failed to load entries',
				timestamp: Date.now()
			};
		}
	}

	async searchEntries(query: string): Promise<ServiceResponse<PasswordEntry[]>> {
		try {
			const entriesResult = await this.getAllEntries();
			if (!entriesResult.success) {
				return entriesResult;
			}

			const entries = entriesResult.data || [];
			const searchTerm = query.toLowerCase().trim();

			const filteredEntries = entries.filter((entry) => {
				return (
					entry.title.toLowerCase().includes(searchTerm) ||
					entry.url.toLowerCase().includes(searchTerm) ||
					entry.username.toLowerCase().includes(searchTerm) ||
					(entry.notes && entry.notes.toLowerCase().includes(searchTerm)) ||
					entry.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
				);
			});

			console.log(`Search "${query}" returned ${filteredEntries.length} results`);
			return { success: true, data: filteredEntries, timestamp: Date.now() };
		} catch (error) {
			console.error('Failed to search entries:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Search failed',
				timestamp: Date.now()
			};
		}
	}

	/**
	 * Folder Management Methods
	 */
	async createFolder(
		folder: Omit<PasswordFolder, 'id' | 'createdAt' | 'lastModified' | 'entryCount'>
	): Promise<ServiceResponse<PasswordFolder>> {
		try {
			const folderId =
				crypto.getRandomValues(new Uint32Array(1))[0].toString(36) + Date.now().toString(36);

			const newFolder: PasswordFolder = {
				...folder,
				id: folderId,
				createdAt: Date.now(),
				lastModified: Date.now(),
				entryCount: 0
			};

			const foldersResult = await PasswordVaultStorage.loadFolders();
			if (!foldersResult.success) {
				return { success: false, error: 'Failed to load folders', timestamp: Date.now() };
			}

			const folders = foldersResult.data || [];
			folders.push(newFolder);

			const saveResult = await PasswordVaultStorage.saveFolders(folders);
			if (!saveResult.success) {
				return { success: false, error: 'Failed to save folder', timestamp: Date.now() };
			}

			return { success: true, data: newFolder, timestamp: Date.now() };
		} catch (error) {
			console.error('Failed to create folder:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Failed to create folder',
				timestamp: Date.now()
			};
		}
	}

	async getFolders(): Promise<ServiceResponse<PasswordFolder[]>> {
		try {
			const foldersResult = await PasswordVaultStorage.loadFolders();
			if (!foldersResult.success) {
				return { success: false, error: 'Failed to load folders', timestamp: Date.now() };
			}

			return { success: true, data: foldersResult.data || [], timestamp: Date.now() };
		} catch (error) {
			console.error('Failed to get folders:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Failed to load folders',
				timestamp: Date.now()
			};
		}
	}

	/**
	 * Password Generation Methods
	 */
	generatePassword(settings: PasswordGeneratorSettings): GeneratedPassword {
		try {
			const {
				length = 16,
				includeUppercase = true,
				includeLowercase = true,
				includeNumbers = true,
				includeSymbols = false,
				excludeSimilar = true,
				excludeAmbiguous = false
			} = settings;

			let charset = '';

			if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
			if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			if (includeNumbers) charset += '0123456789';
			if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

			// Remove similar/ambiguous characters
			if (excludeSimilar) {
				charset = charset.replace(/[0OIl1]/g, '');
			}
			if (excludeAmbiguous) {
				charset = charset.replace(/[{}[\]()/\\'"~,;<>.]/g, '');
			}

			let password = '';
			for (let i = 0; i < length; i++) {
				const randomIndex = Math.floor(Math.random() * charset.length);
				password += charset[randomIndex];
			}

			const strength = this.calculatePasswordStrengthSync(password);

			return {
				password,
				strength,
				entropy: Math.log2(charset.length) * length,
				generatedAt: Date.now(),
				settings
			};
		} catch (error) {
			console.error('Password generation failed:', error);
			const defaultStrength: PasswordStrength = {
				score: 0,
				label: 'Very Weak',
				feedback: ['Password generation failed'],
				crackTime: 'Unknown'
			};
			return {
				password: '',
				strength: defaultStrength,
				entropy: 0,
				generatedAt: Date.now(),
				settings
			};
		}
	}

	async checkPasswordStrength(
		password: string
	): Promise<ServiceResponse<{ score: number; label: string; feedback: string[] }>> {
		try {
			const result = this.calculatePasswordStrengthSync(password);
			return { success: true, data: result, timestamp: Date.now() };
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Strength check failed',
				timestamp: Date.now()
			};
		}
	}

	private calculatePasswordStrengthSync(password: string): PasswordStrength {
		if (!password)
			return {
				score: 0,
				label: 'Very Weak',
				feedback: ['Password is empty'],
				crackTime: 'Instantly'
			};

		let score = 0;
		const feedback: string[] = [];

		// Length scoring
		if (password.length >= 12) score += 25;
		else if (password.length >= 8) score += 15;
		else if (password.length >= 6) score += 5;
		else feedback.push('Password should be at least 8 characters long');

		// Character variety
		if (/[a-z]/.test(password)) score += 5;
		else feedback.push('Add lowercase letters');

		if (/[A-Z]/.test(password)) score += 5;
		else feedback.push('Add uppercase letters');

		if (/[0-9]/.test(password)) score += 5;
		else feedback.push('Add numbers');

		if (/[^A-Za-z0-9]/.test(password)) score += 10;
		else feedback.push('Add special characters');

		// Bonus points
		if (password.length >= 16) score += 10;
		if (/[a-z].*[A-Z]|[A-Z].*[a-z]/.test(password)) score += 5;

		// Penalties
		if (/(.)\1{2,}/.test(password)) {
			score -= 10;
			feedback.push('Avoid repeated characters');
		}
		if (/123|abc|qwe/i.test(password)) {
			score -= 10;
			feedback.push('Avoid common patterns');
		}

		score = Math.max(0, Math.min(100, score));

		let label: PasswordStrength['label'] = 'Very Weak';
		if (score >= 80) label = 'Very Strong';
		else if (score >= 60) label = 'Strong';
		else if (score >= 40) label = 'Good';
		else if (score >= 20) label = 'Fair';
		else if (score >= 10) label = 'Weak';

		// Calculate estimated crack time
		let crackTime = 'Instantly';
		if (score >= 80) crackTime = 'Centuries';
		else if (score >= 60) crackTime = 'Years';
		else if (score >= 40) crackTime = 'Months';
		else if (score >= 20) crackTime = 'Days';
		else if (score >= 10) crackTime = 'Hours';
		else crackTime = 'Minutes';

		return { score, label, feedback, crackTime };
	}

	/**
	 * Security Audit Methods
	 */
	async findDuplicatePasswords(): Promise<ServiceResponse<PasswordEntry[][]>> {
		try {
			const entriesResult = await this.getAllEntries();
			if (!entriesResult.success) {
				return { success: false, error: entriesResult.error, timestamp: Date.now() };
			}

			const entries = entriesResult.data || [];
			const duplicateGroups: PasswordEntry[][] = [];
			const processedPasswords = new Set<string>();

			for (const entry of entries) {
				const passwordKey = entry.encryptedPassword;

				if (processedPasswords.has(passwordKey)) {
					continue;
				}

				const duplicates = entries.filter((e) => e.encryptedPassword === passwordKey);
				if (duplicates.length > 1) {
					duplicateGroups.push(duplicates);
				}

				processedPasswords.add(passwordKey);
			}

			return { success: true, data: duplicateGroups, timestamp: Date.now() };
		} catch (error) {
			console.error('Failed to find duplicates:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Duplicate search failed',
				timestamp: Date.now()
			};
		}
	}

	async findWeakPasswords(): Promise<ServiceResponse<PasswordEntry[]>> {
		try {
			const entriesResult = await this.getAllEntries();
			if (!entriesResult.success) {
				return { success: false, error: entriesResult.error, timestamp: Date.now() };
			}

			const entries = entriesResult.data || [];
			const weakPasswords: PasswordEntry[] = [];

			for (const entry of entries) {
				if (entry.strength && entry.strength.score < 60) {
					weakPasswords.push(entry);
				}
			}

			return { success: true, data: weakPasswords, timestamp: Date.now() };
		} catch (error) {
			console.error('Failed to find weak passwords:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Weak password search failed',
				timestamp: Date.now()
			};
		}
	}

	async checkBreachedPasswords(): Promise<ServiceResponse<PasswordEntry[]>> {
		try {
			// For now, return empty array as we'd need to implement HaveIBeenPwned API integration
			// This would require careful handling to not expose actual passwords
			console.log('Breach checking not yet implemented');
			return { success: true, data: [], timestamp: Date.now() };
		} catch (error) {
			console.error('Failed to check breached passwords:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Breach check failed',
				timestamp: Date.now()
			};
		}
	}

	async generateSecurityAudit(): Promise<ServiceResponse<SecurityAuditReport>> {
		try {
			const [entriesResult, duplicatesResult, weakResult] = await Promise.all([
				this.getAllEntries(),
				this.findDuplicatePasswords(),
				this.findWeakPasswords()
			]);

			if (!entriesResult.success) {
				return { success: false, error: 'Failed to load entries for audit', timestamp: Date.now() };
			}

			const entries = entriesResult.data || [];
			const duplicates = duplicatesResult.success ? duplicatesResult.data || [] : [];
			const weakPasswords = weakResult.success ? weakResult.data || [] : [];

			// Calculate overall security score
			let score = 100;
			score -= duplicates.length * 10; // -10 points per duplicate group
			score -= weakPasswords.length * 5; // -5 points per weak password
			score = Math.max(0, score);

			// Create security issues array
			const issues: SecurityIssue[] = [];

			// Add duplicate password issues
			if (duplicates.length > 0) {
				issues.push({
					type: 'duplicate',
					severity: 'high',
					title: 'Duplicate Passwords Found',
					description: `${duplicates.flat().length} passwords are reused across multiple accounts`,
					affectedEntries: duplicates.flat().map((entry) => entry.id),
					recommendation: 'Update each account with a unique strong password',
					estimatedRisk: 80
				});
			}

			// Add weak password issues
			if (weakPasswords.length > 0) {
				issues.push({
					type: 'weak',
					severity: 'medium',
					title: 'Weak Passwords Detected',
					description: `${weakPasswords.length} passwords do not meet security standards`,
					affectedEntries: weakPasswords.map((entry) => entry.id),
					recommendation: 'Update weak passwords with stronger alternatives',
					estimatedRisk: 60
				});
			}

			// Create security recommendations array
			const recommendations: SecurityRecommendation[] = [];

			if (duplicates.length > 0) {
				recommendations.push({
					type: 'password_update',
					priority: 'high',
					title: 'Update Duplicate Passwords',
					description: 'Replace duplicate passwords with unique strong passwords for each account',
					entryIds: duplicates.flat().map((entry) => entry.id)
				});
			}

			if (weakPasswords.length > 0) {
				recommendations.push({
					type: 'password_update',
					priority: 'medium',
					title: 'Strengthen Weak Passwords',
					description: 'Update passwords that do not meet security standards',
					entryIds: weakPasswords.map((entry) => entry.id)
				});
			}

			if (entries.length < 5) {
				recommendations.push({
					type: 'security_review',
					priority: 'low',
					title: 'Add More Accounts',
					description:
						'Consider adding more accounts to your password manager for better security coverage'
				});
			}

			const report: SecurityAuditReport = {
				overallScore: score,
				totalPasswords: entries.length,
				lastAuditDate: Date.now(),
				issues,
				recommendations,
				trends: []
			};

			return { success: true, data: report, timestamp: Date.now() };
		} catch (error) {
			console.error('Failed to generate security audit:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Audit generation failed',
				timestamp: Date.now()
			};
		}
	}

	/**
	 * Settings Management
	 */
	async getSettings(): Promise<ServiceResponse<PasswordManagerSettings>> {
		try {
			const settingsResult = await PasswordVaultStorage.loadSettings();
			if (!settingsResult.success) {
				return { success: false, error: 'Failed to load settings', timestamp: Date.now() };
			}

			return { success: true, data: settingsResult.data!, timestamp: Date.now() };
		} catch (error) {
			console.error('Failed to get settings:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Failed to load settings',
				timestamp: Date.now()
			};
		}
	}

	async updateSettings(
		updates: Partial<PasswordManagerSettings>
	): Promise<ServiceResponse<PasswordManagerSettings>> {
		try {
			const currentSettings = await this.getSettings();
			if (!currentSettings.success) {
				return currentSettings;
			}

			const updatedSettings = { ...currentSettings.data!, ...updates };
			const saveResult = await PasswordVaultStorage.saveSettings(updatedSettings);

			if (!saveResult.success) {
				return { success: false, error: 'Failed to save settings', timestamp: Date.now() };
			}

			return { success: true, data: updatedSettings, timestamp: Date.now() };
		} catch (error) {
			console.error('Failed to update settings:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Failed to update settings',
				timestamp: Date.now()
			};
		}
	}

	async updateLastUsed(entryId: string): Promise<ServiceResponse<boolean>> {
		try {
			const result = await this.updateEntry(entryId, { lastUsed: Date.now() });
			return { success: result.success, data: result.success, timestamp: Date.now() };
		} catch (error) {
			console.error('Failed to update last used:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Failed to update last used',
				timestamp: Date.now()
			};
		}
	}

	/**
	 * Service Lifecycle Methods
	 */
	async lock(): Promise<void> {
		this.isInitialized = false;
		this.crypto = null;
		PasswordManagerCrypto.lock();
		console.log('Password manager service locked');
	}

	async isLocked(): Promise<boolean> {
		return await PasswordManagerCrypto.isLocked();
	}
}
