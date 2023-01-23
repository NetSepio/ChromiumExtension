const fetchGraphQLData = async (query: string, variables: object = {}) => {
	try {
		const res = await fetch('https://api.thegraph.com/subgraphs/name/netsepio/netsepio-mumbai', {
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
