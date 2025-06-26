declare global {
	interface BigInt {
		toJSON(): string;
	}
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
