/**
 * Debug helper for wallet storage investigation
 */

export function debugWalletStorage(): void {
	console.log('=== WALLET STORAGE DEBUG ===');

	// Test Chrome storage availability
	if (typeof chrome !== 'undefined' && chrome.storage) {
		console.log('Chrome storage API available');

		// Test write/read functionality
		chrome.storage.local
			.set({ testKey: 'testValue' })
			.then(() => {
				console.log('Test write to Chrome storage successful');
				return chrome.storage.local.get(['testKey']);
			})
			.then((result) => {
				console.log('Test read from Chrome storage:', result);
				return chrome.storage.local.remove(['testKey']);
			})
			.then(() => {
				console.log('Test cleanup completed');
			})
			.catch((error) => {
				console.error('Chrome storage test failed:', error);
			});

		// Check actual wallet data
		chrome.storage.local
			.get(['walletAddress', 'jwtToken'])
			.then((result) => {
				console.log('Chrome storage contents:');
				console.log(`  walletAddress: ${result.walletAddress ? 'EXISTS' : 'NOT FOUND'}`);
				if (result.walletAddress) {
					console.log(`    Value: ${result.walletAddress}`);
				}
				console.log(`  jwtToken: ${result.jwtToken ? 'EXISTS' : 'NOT FOUND'}`);
			})
			.catch((error) => {
				console.error('Chrome storage check failed:', error);
			});
	} else {
		console.log('Chrome storage NOT available');
		console.log(
			'window.chrome:',
			typeof window !== 'undefined' ? typeof window.chrome : 'window not available'
		);
		console.log('chrome:', typeof chrome);
	}

	// Check all localStorage keys
	console.log('\nAll localStorage keys:');
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key) {
			const value = localStorage.getItem(key);
			console.log(
				`  ${key}: ${value?.substring(0, 100)}${value && value.length > 100 ? '...' : ''}`
			);
		}
	}

	// Check specific wallet-related keys
	console.log('\nWallet-specific keys:');
	const walletKeys = [
		'walletAddress',
		'walletAddress_backup',
		'privateKey',
		'publicKey',
		'encryptedMnemonic',
		'passwordHash',
		'mnemonicHash',
		'jwtToken'
	];

	walletKeys.forEach((key) => {
		const value = localStorage.getItem(key);
		console.log(`  ${key}: ${value ? 'EXISTS' : 'NOT FOUND'}`);
		if (value && key.includes('Address')) {
			console.log(`    Value: ${value}`);
		}
	});

	// Check timestamped storage
	console.log('\nTimestamped storage check:');
	try {
		const { getData } = require('./timeStamp');
		const timestampedAddress = getData('walletAddress');
		console.log(`  Timestamped walletAddress: ${timestampedAddress || 'NOT FOUND/EXPIRED'}`);
	} catch (error) {
		console.log(`  Timestamped storage check failed: ${error}`);
	}

	console.log('=== END DEBUG ===');
}

export function clearAllWalletStorage(): void {
	console.log('Clearing all wallet storage...');

	// Clear Chrome storage
	if (typeof chrome !== 'undefined' && chrome.storage) {
		chrome.storage.local
			.remove(['walletAddress', 'jwtToken'])
			.then(() => {
				console.log('Chrome storage cleared');
			})
			.catch((error) => {
				console.error('Failed to clear Chrome storage:', error);
			});
	}

	const keysToRemove = [
		'walletAddress',
		'walletAddress_backup',
		'privateKey',
		'publicKey',
		'encryptedMnemonic',
		'passwordHash',
		'mnemonicHash',
		'iv',
		'jwtToken'
	];

	keysToRemove.forEach((key) => {
		localStorage.removeItem(key);
		console.log(`Removed: ${key}`);
	});

	console.log('Wallet storage cleared');
}

// fence disease option goat dinosaur lawn remain sponsor naive rocket two toss
