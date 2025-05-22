let VPN_HOST = '5.161.255.113';
let VPN_PORT = 1080;

function setProxyConfig(isConnected: any, host: string) {
	const config = isConnected
		? {
				mode: 'fixed_servers',
				rules: {
					singleProxy: {
						scheme: 'socks5',
						host: host || VPN_HOST,
						port: VPN_PORT
					}
				}
			}
		: { mode: 'direct' };

	chrome.proxy.settings.set({ value: config, scope: 'regular' }, () => {
		console.log(isConnected ? `VPN connected to ${host}` : 'VPN disconnected');
	});
}

// Listen for message from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'toggleVPN') {
		VPN_HOST = request.host || VPN_HOST;

		console.log(`VPN Host: ${VPN_HOST}, VPN Port: ${VPN_PORT}`);
		setProxyConfig(request.isConnected, VPN_HOST);
		sendResponse({ status: 'success' });
	}
});

// export function setProxySettings(enabled: boolean) {
// 	if (enabled) {
// 		console.log('Setting Proxy...');
// 		chrome.proxy.settings.set(
// 			{
// 				value: {
// 					mode: 'fixed_servers',
// 					rules: {
// 						singleProxy: {
// 							scheme: 'socks5',
// 							host: PROXY_HOST,
// 							port: PROXY_PORT
// 						}
// 					}
// 				},
// 				scope: 'regular'
// 			},
// 			() => {
// 				if (chrome.runtime.lastError) {
// 					console.error('Error setting proxy:', chrome.runtime.lastError.message);
// 				} else {
// 					console.log('Proxy settings applied successfully.');
// 				}
// 			}
// 		);
// 	} else {
// 		console.log('Disabling Proxy...');
// 		chrome.proxy.settings.clear({ scope: 'regular' }, () => {
// 			if (chrome.runtime.lastError) {
// 				console.error('Error clearing proxy:', chrome.runtime.lastError.message);
// 			} else {
// 				console.log('Proxy settings cleared successfully.');
// 			}
// 		});
// 	}

// 	// 🔥 Save to storage
// 	chrome.storage.local.set({ proxyEnabled: enabled });
// }

// 🔥 helper to get the saved state
// export async function getProxyState(): Promise<boolean> {
// 	return new Promise((resolve) => {
// 		chrome.storage.local.get(['proxyEnabled'], (result) => {
// 			resolve(result.proxyEnabled ?? false);
// 		});
// 	});
// }
