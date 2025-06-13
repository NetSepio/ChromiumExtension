export function formatWalletAddress(address: string) {
	const walletAddress = `${address.substring(0, 5)}...${address.substring(address.length - 5)}`;

	return walletAddress;
}
