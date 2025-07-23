/**
 * Chrome storage utility functions for managing extension data
 */

import type { LocationNodeInfo } from '../../types/types';

export interface StorageData {
	vpnConnected?: boolean;
	selectedNode?: LocationNodeInfo;
	timerSeconds?: number;
}

export interface TokenInfo {
	mint: string;
	symbol: string;
	name: string;
	decimals: number;
	type?: 'token' | 'nft_collection';
	collectionSymbol?: string;
}

/**
 * Get VPN-related data from Chrome storage
 * @returns Promise resolving to storage data
 */
export async function getVpnStorageData(): Promise<StorageData> {
	return await chrome.storage.local.get(['vpnConnected', 'selectedNode', 'timerSeconds']);
}

/**
 * Set VPN connection status in Chrome storage
 * @param connected - Whether VPN is connected
 */
export async function setVpnConnectionStatus(connected: boolean): Promise<void> {
	await chrome.storage.local.set({ vpnConnected: connected });
}

/**
 * Set selected node in Chrome storage
 * @param node - The selected node to store
 */
export async function setSelectedNode(node: LocationNodeInfo): Promise<void> {
	await chrome.storage.local.set({ selectedNode: node });
}

/**
 * Get imported tokens for a specific wallet from Chrome storage
 * @param walletAddress - The wallet address to get tokens for
 * @returns Promise resolving to array of imported tokens
 */
export async function getImportedTokens(walletAddress: string): Promise<TokenInfo[]> {
	try {
		if (!walletAddress) {
			console.warn('No wallet address provided for getImportedTokens');
			return [];
		}

		const walletKey = `imported-tokens-${walletAddress}`;
		const result = await chrome.storage.local.get([walletKey]);

		// Also check for legacy localStorage data and migrate if needed
		await migrateLegacyTokenStorage(walletAddress);

		return result[walletKey] || [];
	} catch (error) {
		console.error('Error reading imported tokens from extension storage:', error);
		return [];
	}
}

/**
 * Add a token to the imported tokens list for a specific wallet
 * @param token - The token to add
 * @param walletAddress - The wallet address to add the token to
 */
export async function addImportedToken(token: TokenInfo, walletAddress: string): Promise<void> {
	try {
		if (!walletAddress) {
			console.error('Cannot add token: No wallet address provided');
			return;
		}

		const current = await getImportedTokens(walletAddress);
		const exists = current.find((t) => t.mint === token.mint);

		if (!exists) {
			current.push(token);
			const walletKey = `imported-tokens-${walletAddress}`;
			await chrome.storage.local.set({ [walletKey]: current });
			console.log(`Token added to wallet ${walletAddress}:`, token.symbol);
		}
	} catch (error) {
		console.error('Error adding imported token to extension storage:', error);
	}
}

/**
 * Remove a token from the imported tokens list for a specific wallet
 * @param mint - The mint address of the token to remove
 * @param walletAddress - The wallet address to remove the token from
 */
export async function removeImportedToken(mint: string, walletAddress: string): Promise<void> {
	try {
		if (!walletAddress) {
			console.error('Cannot remove token: No wallet address provided');
			return;
		}

		const current = await getImportedTokens(walletAddress);
		const filtered = current.filter((t) => t.mint !== mint);
		const walletKey = `imported-tokens-${walletAddress}`;
		await chrome.storage.local.set({ [walletKey]: filtered });
		console.log(`Token removed from wallet ${walletAddress}:`, mint);
	} catch (error) {
		console.error('Error removing imported token from extension storage:', error);
	}
}

/**
 * Migrate legacy localStorage token data to extension storage
 * @param walletAddress - The wallet address to migrate tokens for
 */
async function migrateLegacyTokenStorage(walletAddress: string): Promise<void> {
	try {
		// Check if we're in a browser environment with localStorage
		if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
			return;
		}

		const walletKey = `imported-tokens-${walletAddress}`;

		// Check if we already have extension storage data
		const extensionResult = await chrome.storage.local.get([walletKey]);
		if (extensionResult[walletKey] && extensionResult[walletKey].length > 0) {
			return; // Already migrated
		}

		// Check for wallet-specific localStorage data
		const localStorageData = localStorage.getItem(walletKey);
		if (localStorageData) {
			const tokens = JSON.parse(localStorageData);
			await chrome.storage.local.set({ [walletKey]: tokens });
			localStorage.removeItem(walletKey);
			console.log(
				`Migrated tokens from localStorage to extension storage for wallet ${walletAddress}`
			);
		}

		// Check for legacy global localStorage data
		const legacyData = localStorage.getItem('imported-tokens');
		if (legacyData && !extensionResult[walletKey]) {
			const tokens = JSON.parse(legacyData);
			await chrome.storage.local.set({ [walletKey]: tokens });
			console.log(
				`Migrated legacy global tokens to wallet-specific extension storage for ${walletAddress}`
			);
		}
	} catch (error) {
		console.error('Error migrating legacy token storage:', error);
	}
}

/**
 * Clean up legacy token storage from localStorage
 */
export async function cleanupLegacyTokenStorage(): Promise<void> {
	try {
		if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
			// Remove global legacy storage
			const legacyTokens = localStorage.getItem('imported-tokens');
			if (legacyTokens) {
				localStorage.removeItem('imported-tokens');
				console.log('Removed legacy global token storage from localStorage');
			}

			// Remove wallet-specific localStorage keys
			const keysToRemove = [];
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key && key.startsWith('imported-tokens-')) {
					keysToRemove.push(key);
				}
			}

			keysToRemove.forEach((key) => {
				localStorage.removeItem(key);
				console.log(`Removed legacy token storage key: ${key}`);
			});
		}
	} catch (error) {
		console.error('Error cleaning up legacy token storage:', error);
	}
}
