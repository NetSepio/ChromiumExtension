import { PUBLIC_SUBGRAPH_URL,PUBLIC_SUBGRAPH_MAINNET_URL,PUBLIC_SUBGRAPH_TESTNET_URL } from '$env/static/public';

const fetchGraphQLData = async (query: string, variables: object = {},network:string) => {
	try {
		const res = await fetch(network, {
			method: 'POST',
			redirect: 'follow',

			body: JSON.stringify({ query, variables })
		});
		const json = await res.json();
		if (json.errors) {
			throw new Error(json.errors[0].message);
		}
		return json.data;
	} catch (err) {
		throw err;
	}
};

export default fetchGraphQLData;
