import { Network, Alchemy } from 'alchemy-sdk';
import { PUBLIC_ALCHEMY_SDK_API } from '$env/static/public';

const settings = {
	apiKey: PUBLIC_ALCHEMY_SDK_API,
	network: Network.MATIC_MUMBAI
};

export const alchemy = new Alchemy(settings);
