/**
 * Password Manager Type Definitions
 * Comprehensive types for the password management system
 */

// Core password entry interface
export interface PasswordEntry {
	id: string;
	title: string;
	url: string;
	username: string;
	encryptedPassword: string;
	notes?: string;
	tags: string[];
	folderId?: string;
	isFavorite: boolean;
	createdAt: number;
	lastModified: number;
	lastUsed?: number;
	passwordHistory: PasswordHistoryEntry[];
	customFields: CustomField[];
	strength: PasswordStrength;
}

// Password strength assessment
export interface PasswordStrength {
	score: number; // 0-100
	label: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong';
	feedback: string[];
	crackTime: string;
}

// Password history tracking
export interface PasswordHistoryEntry {
	encryptedPassword: string;
	changedAt: number;
	strength: PasswordStrength;
}

// Folder organization
export interface PasswordFolder {
	id: string;
	name: string;
	parentId?: string;
	color?: string;
	icon?: string;
	description?: string;
	createdAt: number;
	lastModified: number;
	entryCount: number;
	isDefault?: boolean;
}

// Custom fields for additional data
export interface CustomField {
	id: string;
	name: string;
	encryptedValue: string;
	type: 'text' | 'password' | 'email' | 'url' | 'number' | 'date' | 'multiline';
	isSecret: boolean;
	isRequired: boolean;
	order: number;
}

// Auto-fill related types
export interface AutoFillCandidate {
	entry: PasswordEntry;
	confidence: number;
	matchType: 'exact' | 'subdomain' | 'similar' | 'manual';
	matchedUrl: string;
}

export interface FormDetectionResult {
	forms: HTMLFormElement[];
	loginFields: LoginFieldDetection[];
	hasPasswordFields: boolean;
	confidence: number;
}

export interface LoginFieldDetection {
	usernameField?: HTMLInputElement;
	passwordField?: HTMLInputElement;
	form: HTMLFormElement;
	confidence: number;
	fieldTypes: {
		username: 'email' | 'username' | 'phone' | 'unknown';
		password: 'password' | 'current-password' | 'new-password';
	};
}

// Security audit types
export interface SecurityAuditReport {
	overallScore: number;
	totalPasswords: number;
	lastAuditDate: number;
	issues: SecurityIssue[];
	recommendations: SecurityRecommendation[];
	trends: SecurityTrend[];
}

export interface SecurityIssue {
	type: 'weak' | 'reused' | 'old' | 'compromised' | 'duplicate';
	severity: 'low' | 'medium' | 'high' | 'critical';
	title: string;
	description: string;
	affectedEntries: string[]; // Entry IDs
	recommendation: string;
	estimatedRisk: number; // 0-100
}

export interface SecurityRecommendation {
	type: 'password_update' | 'enable_2fa' | 'security_review' | 'backup_reminder';
	priority: 'low' | 'medium' | 'high';
	title: string;
	description: string;
	actionUrl?: string;
	entryIds?: string[];
}

export interface SecurityTrend {
	metric: 'average_strength' | 'password_age' | 'reuse_count' | 'audit_frequency';
	value: number;
	previousValue?: number;
	trend: 'improving' | 'stable' | 'declining';
	period: string;
}

// Password generator types
export interface PasswordGeneratorSettings {
	length: number;
	includeUppercase: boolean;
	includeLowercase: boolean;
	includeNumbers: boolean;
	includeSymbols: boolean;
	excludeSimilar: boolean;
	excludeAmbiguous: boolean;
	customCharacters?: string;
	excludeCharacters?: string;
	requireFromEachSet: boolean;
	minUppercase?: number;
	minLowercase?: number;
	minNumbers?: number;
	minSymbols?: number;
	pronounceable: boolean;
}

export interface GeneratedPassword {
	password: string;
	strength: PasswordStrength;
	entropy: number;
	generatedAt: number;
	settings: PasswordGeneratorSettings;
}

// Import/Export types
export interface ImportResult {
	success: boolean;
	imported: number;
	skipped: number;
	errors: ImportError[];
	warnings: string[];
}

export interface ImportError {
	line?: number;
	entry?: Partial<PasswordEntry>;
	message: string;
	type: 'validation' | 'encryption' | 'duplicate' | 'format';
}

export interface ExportOptions {
	format: 'json' | 'csv' | '1password' | 'lastpass' | 'bitwarden' | 'dashlane';
	includeHistory: boolean;
	includeNotes: boolean;
	includeCustomFields: boolean;
	encryption: 'none' | 'aes' | 'gpg';
	password?: string;
}

export interface ExportResult {
	success: boolean;
	format: string;
	entryCount: number;
	fileSize: number;
	checksum?: string;
	exportedAt: number;
}

// Storage and encryption types
export interface EncryptedVault {
	version: string;
	encryptedData: string;
	iv: string;
	salt: string;
	iterations: number;
	algorithm: string;
	checksum: string;
	createdAt: number;
	lastModified: number;
}

export interface MasterKeyDerivation {
	salt: Uint8Array;
	iterations: number;
	algorithm: 'PBKDF2' | 'Argon2' | 'scrypt';
	keyLength: number;
	hashFunction: 'SHA-256' | 'SHA-512';
}

export interface EncryptionMetadata {
	algorithm: string;
	keyLength: number;
	iv: string;
	authTag?: string;
	version: string;
}

// Search and filtering types
export interface SearchOptions {
	query: string;
	fields: ('title' | 'username' | 'url' | 'notes' | 'tags')[];
	caseSensitive: boolean;
	exactMatch: boolean;
	includeCustomFields: boolean;
}

export interface FilterOptions {
	folders: string[];
	tags: string[];
	strength: ('weak' | 'fair' | 'good' | 'strong')[];
	favorites: boolean;
	recentlyUsed: number; // days
	lastModified: number; // days
	hasNotes: boolean;
	hasCustomFields: boolean;
}

export interface SortOptions {
	field: 'title' | 'username' | 'lastUsed' | 'lastModified' | 'strength' | 'createdAt';
	direction: 'asc' | 'desc';
	secondarySort?: {
		field: 'title' | 'username' | 'lastUsed' | 'lastModified';
		direction: 'asc' | 'desc';
	};
}

// Settings and preferences
export interface PasswordManagerSettings {
	general: {
		autoLockTimeout: number; // minutes
		autoSave: boolean;
		showPasswordStrength: boolean;
		defaultPasswordLength: number;
		enableClipboardTimeout: number; // seconds
		showNotifications: boolean;
	};
	security: {
		requireMasterPassword: boolean;
		enableBiometric: boolean;
		sessionTimeout: number; // minutes
		maxLoginAttempts: number;
		enableBreachMonitoring: boolean;
		autoLogoutOnSuspend: boolean;
	};
	autofill: {
		enabled: boolean;
		showAutofillIcon: boolean;
		autoSubmit: boolean;
		onlyHTTPS: boolean;
		matchingStrategy: 'exact' | 'subdomain' | 'domain' | 'relaxed';
		confirmBeforeAutofill: boolean;
	};
	backup: {
		enabled: boolean;
		frequency: 'daily' | 'weekly' | 'monthly';
		location: 'local' | 'cloud';
		keepBackups: number;
		encryptBackups: boolean;
	};
	ui: {
		theme: 'system' | 'light' | 'dark';
		compactView: boolean;
		showFavicons: boolean;
		defaultView: 'grid' | 'list';
		itemsPerPage: number;
	};
}

// Event types for inter-component communication
export interface PasswordManagerEvent {
	type:
		| 'entry_added'
		| 'entry_updated'
		| 'entry_deleted'
		| 'vault_unlocked'
		| 'vault_locked'
		| 'settings_changed';
	data: any;
	timestamp: number;
}

// API response types
export interface ServiceResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	code?: string;
	timestamp: number;
}

export interface ValidationError {
	field: string;
	message: string;
	code: string;
}

export interface ValidationResult {
	isValid: boolean;
	errors: ValidationError[];
	warnings: string[];
}

// Browser integration types
export interface TabInfo {
	id: number;
	url: string;
	title: string;
	favIconUrl?: string;
	isHTTPS: boolean;
}

export interface ContextMenuAction {
	type: 'autofill' | 'generate' | 'save';
	entryId?: string;
	fieldType?: 'username' | 'password';
}

// Statistics and analytics
export interface UsageStatistics {
	totalEntries: number;
	totalFolders: number;
	averagePasswordStrength: number;
	mostUsedEntries: Array<{ entryId: string; usageCount: number }>;
	passwordAgeDistribution: Record<string, number>;
	securityScore: number;
	lastActivity: number;
}

export interface PasswordManagerState {
	isInitialized: boolean;
	isLocked: boolean;
	isLoading: boolean;
	currentUser?: string;
	masterKeyAvailable: boolean;
	lastActivity: number;
	settings: PasswordManagerSettings;
}
