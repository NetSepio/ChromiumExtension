/**
 * Multi-Chain Address Utilities
 *
 * This module provides utilities for handling addresses across different blockchain networks:
 * - Solana
 * - EVM chains (Peaq, Rise, Ethereum)
 */

import { ethers } from 'ethers';
import { PublicKey } from '@solana/web3.js';

/**
 * Chain types supported by the wallet
 */
export type ChainType = 'solana' | 'evm';

/**
 * Network identifiers
 */
export type NetworkType = 'solana' | 'peaq' | 'rise' | 'ethereum';

/**
 * Address validation result
 */
export interface AddressValidation {
	isValid: boolean;
	chainType?: ChainType;
	networkType?: NetworkType;
	error?: string;
}

/**
 * Derive EVM address from private key
 * @param privateKeyHex - Private key in hex format (without 0x prefix)
 * @returns EVM address
 */
export function deriveEvmAddress(privateKeyHex: string): string {
	try {
		// Ensure privateKey has 0x prefix
		const privateKey = privateKeyHex.startsWith('0x') ? privateKeyHex : `0x${privateKeyHex}`;
		const wallet = new ethers.Wallet(privateKey);
		return wallet.address;
	} catch (error) {
		throw new Error(`Failed to derive EVM address: ${error}`);
	}
}

/**
 * Validate Solana address format
 * @param address - Address to validate
 * @returns Validation result
 */
export function validateSolanaAddress(address: string): AddressValidation {
	try {
		new PublicKey(address);
		return {
			isValid: true,
			chainType: 'solana',
			networkType: 'solana'
		};
	} catch {
		return {
			isValid: false,
			error: 'Invalid Solana address format'
		};
	}
}

/**
 * Validate EVM address format
 * @param address - Address to validate
 * @returns Validation result
 */
export function validateEvmAddress(address: string): AddressValidation {
	try {
		if (!ethers.isAddress(address)) {
			return {
				isValid: false,
				error: 'Invalid EVM address format'
			};
		}

		return {
			isValid: true,
			chainType: 'evm'
			// Note: EVM address format doesn't indicate specific network
			// Network is determined by RPC endpoint used
		};
	} catch {
		return {
			isValid: false,
			error: 'Invalid EVM address format'
		};
	}
}

/**
 * Validate any supported address format
 * @param address - Address to validate
 * @returns Validation result with detected chain type
 */
export function validateAddress(address: string): AddressValidation {
	// Try Solana first (more specific validation)
	const solanaResult = validateSolanaAddress(address);
	if (solanaResult.isValid) {
		return solanaResult;
	}

	// Try EVM format
	const evmResult = validateEvmAddress(address);
	if (evmResult.isValid) {
		return evmResult;
	}

	return {
		isValid: false,
		error: 'Address format not recognized for any supported chain'
	};
}

/**
 * Auto-detect chain type from address format
 * @param address - Address to analyze
 * @returns Detected chain type or null if unknown
 */
export function detectChainType(address: string): ChainType | null {
	const validation = validateAddress(address);
	return validation.isValid ? validation.chainType || null : null;
}

/**
 * Check if address is a Solana address
 * @param address - Address to check
 * @returns True if valid Solana address
 */
export function isSolanaAddress(address: string): boolean {
	return validateSolanaAddress(address).isValid;
}

/**
 * Check if address is an EVM address
 * @param address - Address to check
 * @returns True if valid EVM address
 */
export function isEvmAddress(address: string): boolean {
	return validateEvmAddress(address).isValid;
}

/**
 * Format address for display (truncate middle)
 * @param address - Full address
 * @param prefixLength - Characters to show at start (default: 6)
 * @param suffixLength - Characters to show at end (default: 4)
 * @returns Formatted address like "0x1234...abcd"
 */
export function formatAddressForDisplay(
	address: string,
	prefixLength: number = 6,
	suffixLength: number = 4
): string {
	if (address.length <= prefixLength + suffixLength) {
		return address;
	}

	return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}

/**
 * Get chain-specific address formatting
 * @param address - Address to format
 * @param chainType - Chain type for specific formatting rules
 * @returns Formatted address
 */
export function formatChainAddress(address: string, chainType: ChainType): string {
	switch (chainType) {
		case 'solana':
			// Solana addresses are base58, show more characters
			return formatAddressForDisplay(address, 8, 6);
		case 'evm':
			// EVM addresses are hex, standard format
			return formatAddressForDisplay(address, 6, 4);
		default:
			return formatAddressForDisplay(address);
	}
}

/**
 * Get display name for chain type
 * @param chainType - Chain type
 * @returns Human-readable chain name
 */
export function getChainDisplayName(chainType: ChainType): string {
	switch (chainType) {
		case 'solana':
			return 'Solana';
		case 'evm':
			return 'EVM';
		default:
			return 'Unknown';
	}
}

/**
 * Get display name for network type
 * @param networkType - Network type
 * @returns Human-readable network name
 */
export function getNetworkDisplayName(networkType: NetworkType): string {
	switch (networkType) {
		case 'solana':
			return 'Solana';
		case 'peaq':
			return 'Peaq';
		case 'rise':
			return 'Rise';
		case 'ethereum':
			return 'Ethereum';
		default:
			return 'Unknown';
	}
}

/**
 * Get all supported networks for a chain type
 * @param chainType - Chain type
 * @returns Array of supported networks
 */
export function getSupportedNetworks(chainType: ChainType): NetworkType[] {
	switch (chainType) {
		case 'solana':
			return ['solana'];
		case 'evm':
			return ['peaq', 'rise', 'ethereum'];
		default:
			return [];
	}
}
