let VPN_HOST = '5.161.255.113';
let VPN_PORT = 1080;

function setProxyConfig(isConnected, host) {
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
