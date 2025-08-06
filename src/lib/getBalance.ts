import { ethers } from 'ethers';
import {
	PUBLIC_PEAQ_MAINNET_RPC_URL,
	PUBLIC_PEAQ_TESTNET_RPC_URL,
	PUBLIC_RISE_TESTNET_RPC_URL
} from '$env/static/public';

export type NetworkConfig = {
	name: string;
	rpcUrl: string;
	symbol: string;
	chainId: number;
	isTestnet: boolean;
};

export const NETWORK_CONFIGS: Record<string, NetworkConfig> = {
	'peaq-mainnet': {
		name: 'Peaq Network',
		rpcUrl: PUBLIC_PEAQ_MAINNET_RPC_URL,
		symbol: 'PEAQ',
		chainId: 3338,
		isTestnet: false
	},
	'peaq-testnet': {
		name: 'Peaq Testnet',
		rpcUrl: PUBLIC_PEAQ_TESTNET_RPC_URL,
		symbol: 'PEAQ',
		chainId: 9990,
		isTestnet: true
	},
	'rise-testnet': {
		name: 'Rise Testnet',
		rpcUrl: PUBLIC_RISE_TESTNET_RPC_URL,
		symbol: 'RISE',
		chainId: 1137,
		isTestnet: true
	}
};

export async function getBalance(
	address: string,
	network: keyof typeof NETWORK_CONFIGS
): Promise<{
	balance: string;
	symbol: string;
	networkName: string;
}> {
	const config = NETWORK_CONFIGS[network];
	if (!config) {
		throw new Error(`Unsupported network: ${network}`);
	}

	try {
		const provider = new ethers.JsonRpcProvider(config.rpcUrl);
		const balance = await provider.getBalance(address);
		const formattedBalance = ethers.formatEther(balance);

		return {
			balance: formattedBalance,
			symbol: config.symbol,
			networkName: config.name
		};
	} catch (error) {
		console.error(`Failed to fetch balance for ${network}:`, error);
		return {
			balance: '0.0',
			symbol: config.symbol,
			networkName: config.name
		};
	}
}

// Legacy function for backward compatibility
export async function getBalanceLegacy(address: string, network: 'mainnet' | 'testnet') {
	const networkKey = network === 'mainnet' ? 'peaq-mainnet' : 'peaq-testnet';
	const result = await getBalance(address, networkKey);
	return result.balance;
}

// Get available networks for EVM
export function getAvailableNetworks(): NetworkConfig[] {
	return Object.values(NETWORK_CONFIGS);
}

// Get testnet-only networks
export function getTestnetNetworks(): NetworkConfig[] {
	return Object.values(NETWORK_CONFIGS).filter((config) => config.isTestnet);
}

// Get mainnet networks
export function getMainnetNetworks(): NetworkConfig[] {
	return Object.values(NETWORK_CONFIGS).filter((config) => !config.isTestnet);
}
