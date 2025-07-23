declare global {
	interface BigInt {
		toJSON(): string;
	}
}

// Solana wallet and network types
export type NetworkType = 'mainnet' | 'testnet' | 'devnet';
export type ChainOption = 'mainnet' | 'testnet';

export interface NetworkConfig {
	name: string;
	rpcUrls: string[];
	explorerUrl: string;
}

export interface TransactionResult {
	success: boolean;
	signature?: string;
	error?: string;
}

export interface TokenInfo {
	mint: string;
	amount: number;
	decimals: number;
	symbol?: string;
	name?: string;
	logoUri?: string;
	isDefault?: boolean;
}

export interface TransactionHistory {
	signature: string;
	timestamp: number;
	type: 'send' | 'receive' | 'swap' | 'other';
	amount: number;
	token: string;
	status: 'confirmed' | 'pending' | 'failed';
	from?: string;
	to?: string;
	fee?: number;
	explorerUrl?: string;
}

export interface LocationNodeInfo {
	id: string;
	name: string;
	httpPort: string;
	domain: string;
	nodename: string;
	chainName: string;
	address: string;
	region: string;
	status: string;
	downloadSpeed: number;
	uploadSpeed: number;
	startTimeStamp: number;
	lastPingedTimeStamp: number;
	walletAddress: string;
	walletAddressSol: string;
	ipinfoip: string;
	ipinfocity: string;
	ipinfocountry: string;
	ipinfolocation: string;
	ipinfoorg: string;
	ipinfopostal: string;
	ipinfotimezone: string;
	totalUptime: number;
	upTimeUnit: string;
}

export interface ReviewType {
	rating: number;
	review: string;
	reviewerAddress: string;
	timestamp: number;
}

// Define metadata structure
export interface MetaDataType {
	name: string;
	description: string;
	category: string;
	image: string;
	domainAddress: string;
	siteUrl: string | undefined;
	siteType: string;
	siteTag: string;
	siteSafety: string;
	siteRating: number;
}

// Define review structure
export interface ReviewSubmitType {
	category: string;
	domainAddress: string;
	siteUrl: string | undefined;
	siteType: string;
	siteTag: string;
	siteSafety: string;
	metaDataUri: string;
}

export interface payloadType {
	eula: string;
	flowId: string;
}

export interface flowIdResponseType {
	status: number;
	message: string;
	payload: payloadType;
}
