let VPN_HOST = '5.161.255.113';
let VPN_PORT = 1080;
let timerInterval = null;
let seconds = 0;

// Initialize timer state when extension loads
chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.local.get(['vpnConnected', 'timerSeconds'], (result) => {
		if (result.vpnConnected) {
			seconds = result.timerSeconds || 0;
			startTimer();
		}
	});
});

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

// Handle VPN toggle messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'toggleVPN') {
		VPN_HOST = request.host || VPN_HOST;

		console.log(`VPN Host: ${VPN_HOST}, VPN Port: ${VPN_PORT}`);
		setProxyConfig(request.isConnected, VPN_HOST);
		sendResponse({ status: 'success' });

		if (request.isConnected) {
			startTimer();
		} else {
			stopTimer();
		}
	}
	return true;
});

function startTimer() {
	if (timerInterval) return;

	timerInterval = setInterval(() => {
		seconds++;
		chrome.storage.local.set({ timerSeconds: seconds });
		// Broadcast timer update
		chrome.runtime
			.sendMessage({
				action: 'timerUpdate',
				seconds: seconds
			})
			.catch(() => {}); // Ignore errors when popup is closed
	}, 1000);
}

function stopTimer() {
	if (timerInterval) {
		clearInterval(timerInterval);
		timerInterval = null;
	}
}

// Restore timer state on service worker startup
chrome.storage.local.get(['vpnConnected'], (result) => {
	if (result.vpnConnected) {
		startTimer();
	}
});
