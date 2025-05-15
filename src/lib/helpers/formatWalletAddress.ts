export function formatWalletAddress(address: string) {
	const walletAddress = `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;

	return walletAddress;
}
