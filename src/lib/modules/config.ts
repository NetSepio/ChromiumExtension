import { http, createConfig } from '@wagmi/core';
import { mainnet, sepolia, manta } from '@wagmi/core/chains';

export const config = createConfig({
	chains: [mainnet, sepolia, manta],
	transports: {
		[mainnet.id]: http(),
		[sepolia.id]: http(),
		[manta.id]: http()
	}
});
