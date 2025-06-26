/**
 * Chrome storage utility functions for managing extension data
 */

import type { LocationNodeInfo } from '../../types/types';

export interface StorageData {
	vpnConnected?: boolean;
	selectedNode?: LocationNodeInfo;
	timerSeconds?: number;
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
