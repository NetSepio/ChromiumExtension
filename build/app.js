	{
					__sveltekit_63w2ey = {
						base: new URL(".", location).pathname.slice(0, -1),
						env: {"PUBLIC_GATEWAY_URL":"https://gateway.netsepio.com/api/v1.0","PUBLIC_SUBGRAPH_URL":"https://api.thegraph.com/subgraphs/name/netsepio/netsepio-mumbai","PUBLIC_SUBGRAPH_TESTNET_URL":"https://api.testnet.aptoslabs.com/v1/graphql","PUBLIC_SUBGRAPH_MAINNET_URL":"https://api.mainnet.aptoslabs.com/v1/graphql","PUBLIC_NFT_STORAGE_API_KEY":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEQ2Q2ZBMGM1MjNEYTI1MmE0MjAzMDhmNjE0M2JiNzI4RDk3MkI2NDkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcwOTEyMjE2NzYxMSwibmFtZSI6InNlcGlvIn0.Iao_BsNOkE1IBEkRXdapKH5l8HeQ8XnDb79s4buW38U","PUBLIC_NODE_URL":"https://fullnode.testnet.aptoslabs.com/v1"}
					};

					const element = document.currentScript.parentElement;

					const data = [null,null];

					Promise.all([
						import("./app/immutable/entry/start.7dcfda2f.js"),
						import("./app/immutable/entry/app.d0a71d1e.js")
					]).then(([kit, app]) => {
						kit.start(app, element, {
							node_ids: [0, 2],
							data,
							form: null,
							error: null
						});
					});
				}