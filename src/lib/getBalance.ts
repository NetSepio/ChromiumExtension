import { ethers } from 'ethers';
import { PUBLIC_MAINNET_INFURA_KEY, PUBLIC_TESTNET_INFURA_KEY } from '$env/static/public';

export async function getBalance(address: string, network: 'mainnet' | 'testnet') {
	const provider = new ethers.JsonRpcProvider(
		network === 'mainnet' ? PUBLIC_MAINNET_INFURA_KEY : PUBLIC_TESTNET_INFURA_KEY
	);
	const balance = await provider.getBalance(address);
	return ethers.formatEther(balance);
}
