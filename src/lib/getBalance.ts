import { ethers } from 'ethers';
import { PUBLIC_PEAQ_MAINNET_RPC_URL, PUBLIC_PEAQ_TESTNET_RPC_URL } from '$env/static/public';

export async function getBalance(address: string, network: 'mainnet' | 'testnet') {
	const provider = new ethers.JsonRpcProvider(
		network === 'mainnet' ? PUBLIC_PEAQ_MAINNET_RPC_URL : PUBLIC_PEAQ_TESTNET_RPC_URL
	);
	const balance = await provider.getBalance(address);
	return ethers.formatEther(balance);
}
