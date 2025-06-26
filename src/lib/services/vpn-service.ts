/**
 * VPN service for managing VPN connections and validations
 */

import type { LocationNodeInfo } from '../../types/types';
import { checkPortStatus } from './port-checker-service';
import { checkUserSubscription, redirectToSubscriptionDashboard } from './subscription-service';
import { getJWTToken } from '../../store/store';

export interface VpnValidationResult {
	isValid: boolean;
	errorMessage?: string;
	errorType?: 'node_selection' | 'node_inactive' | 'port_closed' | 'no_subscription';
}

export interface VpnConnectionResult {
	success: boolean;
	errorMessage?: string;
}

/**
 * Validate if VPN connection is possible
 * @param node - The selected node to validate
 * @returns Promise resolving to validation result
 */
export async function validateVpnConnection(
	node: LocationNodeInfo | null
): Promise<VpnValidationResult> {
	// 1. Check if a node is selected and has required properties
	if (!node || !node.id || !node.domain || !node.ipinfoip) {
		return {
			isValid: false,
			errorMessage: 'Please select a node/location before connecting.',
			errorType: 'node_selection'
		};
	}

	// 2. Check if the node is marked as active
	if (!node.status || node.status.toLowerCase() !== 'active') {
		return {
			isValid: false,
			errorMessage:
				'Selected node is not available at the moment. Please try different node or region',
			errorType: 'node_inactive'
		};
	}

	// 3. Check if the node IP is actually active (port check)
	const portResult = await checkPortStatus(node.ipinfoip);
	if (!portResult.isOpen) {
		return {
			isValid: false,
			errorMessage:
				'Selected node is not available at the moment. Please try different node or region',
			errorType: 'port_closed'
		};
	}

	// 4. Check user subscription
	const jwt = await getJWTToken();
	const subscriptionResult = await checkUserSubscription(jwt);
	if (!subscriptionResult.isActive) {
		// Trigger redirect to dashboard
		redirectToSubscriptionDashboard();
		return {
			isValid: false,
			errorMessage: 'You need an active subscription to use this service',
			errorType: 'no_subscription'
		};
	}

	return { isValid: true };
}

/**
 * Connect to VPN
 * @param node - The node to connect to
 * @returns Promise resolving to connection result
 */
export async function connectToVpn(node: LocationNodeInfo): Promise<VpnConnectionResult> {
	try {
		await chrome.runtime.sendMessage({
			action: 'toggleVPN',
			isConnected: true,
			host: node.ipinfoip
		});
		return { success: true };
	} catch (error) {
		console.error('VPN connection failed:', error);
		return {
			success: false,
			errorMessage: 'Failed to connect to VPN'
		};
	}
}

/**
 * Disconnect from VPN
 * @param node - The node to disconnect from
 * @returns Promise resolving to disconnection result
 */
export async function disconnectFromVpn(node: LocationNodeInfo): Promise<VpnConnectionResult> {
	try {
		await chrome.runtime.sendMessage({
			action: 'toggleVPN',
			isConnected: false,
			host: node.ipinfoip
		});
		return { success: true };
	} catch (error) {
		console.error('VPN disconnection failed:', error);
		return {
			success: false,
			errorMessage: 'Failed to disconnect from VPN'
		};
	}
}
