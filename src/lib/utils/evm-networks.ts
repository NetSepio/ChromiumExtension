import { NETWORK_CONFIGS } from '$lib/getBalance';

export interface NetworkOption {
	id: string;
	name: string;
	symbol: string;
	isTestnet: boolean;
	chainId: number;
	rpcUrl: string;
}

/**
 * Get all available EVM networks
 */
export function getAvailableEvmNetworks(): NetworkOption[] {
	return Object.entries(NETWORK_CONFIGS).map(([id, config]) => ({
		id,
		name: config.name,
		symbol: config.symbol,
		isTestnet: config.isTestnet || false,
		chainId: config.chainId,
		rpcUrl: config.rpcUrl
	}));
}

/**
 * Get network configuration by ID
 */
export function getNetworkConfig(networkId: string): NetworkOption | null {
	const config = NETWORK_CONFIGS[networkId];
	if (!config) return null;

	return {
		id: networkId,
		name: config.name,
		symbol: config.symbol,
		isTestnet: config.isTestnet || false,
		chainId: config.chainId,
		rpcUrl: config.rpcUrl
	};
}

/**
 * Check if a network is a testnet
 */
export function isTestnetNetwork(networkId: string): boolean {
	return getNetworkConfig(networkId)?.isTestnet || false;
}

/**
 * Get mainnet networks only
 */
export function getMainnetNetworks(): NetworkOption[] {
	return getAvailableEvmNetworks().filter((network) => !network.isTestnet);
}

/**
 * Get testnet networks only
 */
export function getTestnetNetworks(): NetworkOption[] {
	return getAvailableEvmNetworks().filter((network) => network.isTestnet);
}

/**
 * Format network display name with chain type
 */
export function formatNetworkDisplayName(networkId: string): string {
	const config = getNetworkConfig(networkId);
	if (!config) return 'Unknown Network';

	return `${config.name} ${config.isTestnet ? '(Testnet)' : '(Mainnet)'}`;
}

/**
 * Get the default EVM network (prefer mainnet)
 */
export function getDefaultEvmNetwork(): string {
	const networks = getAvailableEvmNetworks();
	const mainnetNetworks = networks.filter((n) => !n.isTestnet);

	// Return first mainnet network, or first network if no mainnet available
	return mainnetNetworks.length > 0 ? mainnetNetworks[0].id : networks[0]?.id || 'peaq-mainnet';
}

/**
 * Validate if a network ID is supported
 */
export function isValidNetworkId(networkId: string): boolean {
	return networkId in NETWORK_CONFIGS;
}

/**
 * Get explorer URL for a given network and transaction hash
 */
export function getExplorerUrl(networkId: string, txHash: string): string {
	// These would be the actual explorer URLs for each network
	const explorers: Record<string, string> = {
		'peaq-mainnet': 'https://peaq.subscan.io',
		'peaq-testnet': 'https://peaq-testnet.subscan.io',
		'rise-testnet': 'https://testnet.risescan.org'
	};

	const baseUrl = explorers[networkId];
	return baseUrl ? `${baseUrl}/tx/${txHash}` : '';
}

/**
 * Get network color for UI display
 */
export function getNetworkColor(networkId: string): string {
	const colors: Record<string, string> = {
		'peaq-mainnet': '#00ccba',
		'peaq-testnet': '#fbbf24',
		'rise-testnet': '#8b5cf6'
	};

	return colors[networkId] || '#627eea';
}
