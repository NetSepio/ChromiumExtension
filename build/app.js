{
	__sveltekit_ejtn0a = {
		base: new URL('.', location).pathname.slice(0, -1),
		env: {
			PUBLIC_GATEWAY_URL: 'https://testnet.gateway.netsepio.com/api/v1.0',
			PUBLIC_SUBGRAPH_URL: 'https://api.thegraph.com/subgraphs/name/netsepio/netsepio-mumbai',
			PUBLIC_NFT_STORAGE_API_KEY:
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDBDRTZkN0U2NDllZTcyOTRiNTdhNTU0ODI5M2Y3MjJmNEYwMjYwYTkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY5NzU2NDQ0NTUwMywibmFtZSI6Im5ldHNwaW8ifQ.UsIhXHD1-FqliafFjqKyYrxFIVdHRgjkXlPRw_zX4yM',
			PUBLIC_NODE_URL: 'https://fullnode.testnet.aptoslabs.com/v1'
		}
	};

	const element = document.currentScript.parentElement;

	const data = [null, null];

	Promise.all([
		import('./app/immutable/entry/start.d7967a04.js'),
		import('./app/immutable/entry/app.d5fb45c5.js')
	]).then(([kit, app]) => {
		kit.start(app, element, {
			node_ids: [0, 2],
			data,
			form: null,
			error: null
		});
	});
}
