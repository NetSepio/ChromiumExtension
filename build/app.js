
				{
					__sveltekit_rm12xh = {
						base: new URL(".", location).pathname.slice(0, -1),
						env: {"PUBLIC_GATEWAY_URL":"https://gateway.netsepio.com/api/v1.0","PUBLIC_SUBGRAPH_URL":"https://api.thegraph.com/subgraphs/name/netsepio/netsepio-mumbai","PUBLIC_SUBGRAPH_TESTNET_URL":"https://api.testnet.aptoslabs.com/v1/graphql","PUBLIC_SUBGRAPH_MAINNET_URL":"https://api.mainnet.aptoslabs.com/v1/graphql","PUBLIC_NFT_STORAGE_API_KEY":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEQ2Q2ZBMGM1MjNEYTI1MmE0MjAzMDhmNjE0M2JiNzI4RDk3MkI2NDkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcwOTEyMjE2NzYxMSwibmFtZSI6InNlcGlvIn0.Iao_BsNOkE1IBEkRXdapKH5l8HeQ8XnDb79s4buW38U","PUBLIC_NODE_URL":"https://fullnode.testnet.aptoslabs.com/v1","PUBLIC_PINATA_JWT":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxYWE4YmIyOS0wZTdhLTQxNjYtYTg1Yi1lZDE5ZTM5ZDQxNTIiLCJlbWFpbCI6InNodWJoYW0ucHJhamFwYXRpQG5ldHNlcGlvLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI1OTY2ZDY5YjUyNjU3OWJhNTBjZiIsInNjb3BlZEtleVNlY3JldCI6IjNjMDVmMDFkNTE3YTM4ZjgzYjlkMTA1ZDkxNjY2NzE2Y2Q1MDdiNzNhN2U4NmEwM2FkODcyMmM0OTFmNWI2YWMiLCJleHAiOjE3NTQxOTUyNTl9.ozQq5v9w0yNJoGKhdcZcG-PTLUMQxUjRrynZBXp_TYM","PUBLIC_GATEWAY_URL_PINATA":"https://apricot-quiet-ptarmigan-35.mypinata.cloud"}
					};

					const element = document.currentScript.parentElement;

					const data = [null,null];

					Promise.all([
						import("./app/immutable/entry/start.cde48627.js"),
						import("./app/immutable/entry/app.9b993686.js")
					]).then(([kit, app]) => {
						kit.start(app, element, {
							node_ids: [0, 2],
							data,
							form: null,
							error: null
						});
					});
				}
			