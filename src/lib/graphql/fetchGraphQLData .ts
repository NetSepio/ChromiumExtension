import { PUBLIC_SUBGRAPH_URL } from '$env/static/public';

const fetchGraphQLData = async (query: string, variables: object = {}) => {
	try {
		const res = await fetch(PUBLIC_SUBGRAPH_URL, {
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
