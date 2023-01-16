export const queryBuilder = async (query: string) => {
	const res = await fetch('https://query.graph.lazarus.network/subgraphs/name/NetSepio', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query
		})
	});

	return res;
};
