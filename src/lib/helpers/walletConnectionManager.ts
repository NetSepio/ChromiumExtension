/**
 * Wallet Connection Manager
 * Handles dApp connections and wallet provider interactions
 */

import { walletAddress, privateKey } from '../../store/store';
import { SecurePasswordManager } from './securePasswordManager';
import { get } from 'svelte/store';

export interface DAppConnection {
	origin: string;
	permissions: string[];
	connectedAt: number;
	lastUsed: number;
}

export interface WalletConnectionStatus {
	isConnected: boolean;
	address?: string;
	connections: DAppConnection[];
}

export class WalletConnectionManager {
	private static readonly STORAGE_KEY = 'dapp_connections';

	/**
	 * Check if wallet is available and ready for connections
	 */
	static async isWalletReady(): Promise<boolean> {
		try {
			const authStatus = await SecurePasswordManager.getAuthStatus();
			return authStatus.hasWallet && authStatus.isUnlocked;
		} catch (error) {
			console.error('Error checking wallet readiness:', error);
			return false;
		}
	}

	/**
	 * Get current wallet address
	 */
	static async getCurrentAddress(): Promise<string | null> {
		try {
			const address = get(walletAddress);
			if (address) return address;

			// If no address in store, try to derive from private key
			const storedPrivateKey = get(privateKey);
			if (storedPrivateKey) {
				// Import Solana web3.js dynamically to avoid build issues
				const { Keypair } = await import('@solana/web3.js');
				const privateKeyBytes = Uint8Array.from(Buffer.from(storedPrivateKey, 'hex'));
				const keypair = Keypair.fromSeed(privateKeyBytes);
				const derivedAddress = keypair.publicKey.toBase58();
				walletAddress.set(derivedAddress);
				return derivedAddress;
			}

			return null;
		} catch (error) {
			console.error('Error getting current address:', error);
			return null;
		}
	}

	/**
	 * Connect to a dApp
	 */
	static async connectToDApp(
		origin: string,
		permissions: string[] = ['connect']
	): Promise<{
		success: boolean;
		address?: string;
		error?: string;
	}> {
		try {
			// Check if wallet is ready
			const isReady = await this.isWalletReady();
			if (!isReady) {
				return {
					success: false,
					error: 'Wallet is not available or locked'
				};
			}

			// Get current address
			const address = await this.getCurrentAddress();
			if (!address) {
				return {
					success: false,
					error: 'Unable to get wallet address'
				};
			}

			// Store connection
			await this.storeConnection(origin, permissions);

			return {
				success: true,
				address
			};
		} catch (error) {
			console.error('Error connecting to dApp:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	/**
	 * Disconnect from a dApp
	 */
	static async disconnectFromDApp(origin: string): Promise<boolean> {
		try {
			const connections = await this.getConnections();
			const updatedConnections = connections.filter((conn) => conn.origin !== origin);

			await browser.storage.local.set({
				[this.STORAGE_KEY]: updatedConnections
			});

			return true;
		} catch (error) {
			console.error('Error disconnecting from dApp:', error);
			return false;
		}
	}

	/**
	 * Check if dApp is connected
	 */
	static async isDAppConnected(origin: string): Promise<boolean> {
		try {
			const connections = await this.getConnections();
			return connections.some((conn) => conn.origin === origin);
		} catch (error) {
			console.error('Error checking dApp connection:', error);
			return false;
		}
	}

	/**
	 * Get all connected dApps
	 */
	static async getConnections(): Promise<DAppConnection[]> {
		try {
			const result = await browser.storage.local.get([this.STORAGE_KEY]);
			return result[this.STORAGE_KEY] || [];
		} catch (error) {
			console.error('Error getting connections:', error);
			return [];
		}
	}

	/**
	 * Get connection status
	 */
	static async getConnectionStatus(): Promise<WalletConnectionStatus> {
		try {
			const isReady = await this.isWalletReady();
			const address = await this.getCurrentAddress();
			const connections = await this.getConnections();

			return {
				isConnected: isReady && !!address,
				address: address || undefined,
				connections
			};
		} catch (error) {
			console.error('Error getting connection status:', error);
			return {
				isConnected: false,
				connections: []
			};
		}
	}

	/**
	 * Clear all connections
	 */
	static async clearAllConnections(): Promise<boolean> {
		try {
			await browser.storage.local.remove([this.STORAGE_KEY]);
			return true;
		} catch (error) {
			console.error('Error clearing connections:', error);
			return false;
		}
	}

	/**
	 * Update connection last used timestamp
	 */
	static async updateConnectionUsage(origin: string): Promise<void> {
		try {
			const connections = await this.getConnections();
			const connectionIndex = connections.findIndex((conn) => conn.origin === origin);

			if (connectionIndex >= 0) {
				connections[connectionIndex].lastUsed = Date.now();
				await browser.storage.local.set({
					[this.STORAGE_KEY]: connections
				});
			}
		} catch (error) {
			console.error('Error updating connection usage:', error);
		}
	}

	/**
	 * Store a new connection
	 */
	private static async storeConnection(origin: string, permissions: string[]): Promise<void> {
		const connections = await this.getConnections();
		const existingIndex = connections.findIndex((conn) => conn.origin === origin);

		const connection: DAppConnection = {
			origin,
			permissions,
			connectedAt: Date.now(),
			lastUsed: Date.now()
		};

		if (existingIndex >= 0) {
			// Update existing connection
			connections[existingIndex] = connection;
		} else {
			// Add new connection
			connections.push(connection);
		}

		await browser.storage.local.set({
			[this.STORAGE_KEY]: connections
		});
	}

	/**
	 * Request user permission for dApp connection
	 */
	static async requestConnectionPermission(
		origin: string,
		permissions: string[]
	): Promise<boolean> {
		try {
			// This would open a popup for user to approve/reject
			// For now, return true (auto-approve)
			// In production, you'd want to show a proper permission dialog

			console.log(`Connection request from ${origin} with permissions:`, permissions);
			return true;
		} catch (error) {
			console.error('Error requesting connection permission:', error);
			return false;
		}
	}
}

// Global browser compatibility
declare global {
	const browser: any;
}

// Ensure browser API is available
if (typeof browser === 'undefined' && typeof chrome !== 'undefined') {
	(window as any).browser = chrome;
}
