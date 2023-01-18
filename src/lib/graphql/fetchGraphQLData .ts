import { jwtToken } from '$lib/store/store';

const myHeaders = new Headers();
let jwt: string;
jwtToken.subscribe((value) => {
	jwt = value;
});

const fetchGraphQLData = async (query: string, variables: object = {}) => {
	try {
		myHeaders.append('Authorization', `${jwt}`);
		myHeaders.append('Content-Type', 'application/json');

		const res = await fetch('https://query.graph.lazarus.network/subgraphs/name/NetSepio', {
			method: 'POST',
			headers: myHeaders,
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
