// Initialize global variables
let VPN_HOST = '';
let VPN_PORT = 8088;
let timerInterval = null;
let seconds = 0;

// Helper functions for Chrome APIs
function storageGetAsync(keys) {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(keys, (result) => {
			if (chrome.runtime.lastError) {
				return reject(chrome.runtime.lastError);
			}
			resolve(result);
		});
	});
}

function storageSetAsync(items) {
	return new Promise((resolve, reject) => {
		chrome.storage.local.set(items, () => {
			if (chrome.runtime.lastError) {
				return reject(chrome.runtime.lastError);
			}
			resolve();
		});
	});
}

function storageRemoveAsync(keys) {
	return new Promise((resolve, reject) => {
		chrome.storage.local.remove(keys, () => {
			if (chrome.runtime.lastError) {
				return reject(chrome.runtime.lastError);
			}
			resolve();
		});
	});
}

function proxySettingsSetAsync(config) {
	return new Promise((resolve, reject) => {
		if (typeof chrome === 'undefined' || !chrome.proxy || !chrome.proxy.settings) {
			return reject(new Error('Chrome proxy API unavailable (wrong context?)'));
		}

		if (!config || typeof config !== 'object' || !config.value) {
			return reject(new Error('Invalid config: missing "value" property'));
		}

		chrome.proxy.settings.set(config, () => {
			if (chrome.runtime.lastError) {
				console.error('Proxy error:', chrome.runtime.lastError);
				reject(new Error(chrome.runtime.lastError.message));
			} else {
				resolve();
			}
		});
	});
}

// Initialize timer state when extension loads
chrome.runtime.onInstalled.addListener(async () => {
	// console.log('Extension installed/updated, restoring state...');

	try {
		const result = await storageGetAsync([
			'vpnConnected',
			'vpnHost',
			'timerSeconds',
			'walletAddress',
			'jwtToken'
		]);
		console.log('Loaded initial state:', result);

		if (result.vpnHost) {
			VPN_HOST = result.vpnHost;
			console.log(`Initialized with saved host: ${VPN_HOST}`);
		} else {
			console.log('No saved VPN host found during initialization');
		}

		seconds = result.timerSeconds || 0;

		if (result.vpnConnected) {
			if (VPN_HOST) {
				console.log(`Restoring VPN connection to: ${VPN_HOST}`);
				const success = await setProxyConfig(true, VPN_HOST, result.walletAddress, result.jwtToken);

				if (success) {
					startTimer();
					// console.log('VPN connection restored successfully');
				} else {
					console.error('Failed to restore VPN connection');
					await storageSetAsync({ vpnConnected: false });
				}
			} else {
				console.error('Could not restore VPN connection: No saved host');
				await storageSetAsync({ vpnConnected: false });
			}
		}
	} catch (error) {
		console.error('Error during onInstalled:', error);
	}
});

// MODIFIED FUNCTION: Now handles proxy authentication properly
async function setProxyConfig(isConnected, host, username, password) {
	if (isConnected && !host && !VPN_HOST) {
		console.error('Cannot connect VPN: No host specified');
		return false;
	}

	const currentHost = host || VPN_HOST;

	if (isConnected && !currentHost) {
		console.error('Cannot connect VPN: No valid host available');
		return false;
	}
	let configValue;

	if (isConnected) {
		configValue = {
			mode: 'fixed_servers',
			rules: {
				singleProxy: {
					scheme: 'http',
					host: currentHost,
					port: VPN_PORT
				}
			}
		};
	} else {
		configValue = {
			mode: 'direct'
		};
	}

	// Minimal onAuthRequired handler for proxy authentication (Manifest V3 compatible)
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function handleAuth(details) {
		if (isConnected && username && password) {
			return { authCredentials: { username, password } };
		}
	}

	if (isConnected && username && password) {
		try {
			chrome.webRequest.onAuthRequired.removeListener(handleAuth);
		} catch {
			/* empty */
		}
		chrome.webRequest.onAuthRequired.addListener(handleAuth, { urls: ['<all_urls>'] }, [
			'blocking'
		]);
	} else {
		try {
			chrome.webRequest.onAuthRequired.removeListener(handleAuth);
		} catch {
			/* empty */
		}
	}

	try {
		const config = { value: configValue, scope: 'regular' };
		// console.log('Proxy config being set:', JSON.stringify(config, null, 2));

		await proxySettingsSetAsync(config);
		// console.log(isConnected ? `Proxy settings updated for ${currentHost}` : 'Proxy set to direct');
		return true;
	} catch (error) {
		console.error('Error setting proxy:', error);
		return false;
	}
}

// Handle VPN toggle messages
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
	if (request.action === 'toggleVPN') {
		// console.log('Received toggleVPN message:', request);

		try {
			let walletAddress, jwtToken;
			if (request.isConnected) {
				const creds = await storageGetAsync(['walletAddress', 'jwtToken']);
				walletAddress = creds.walletAddress;
				jwtToken = creds.jwtToken;

				if (!walletAddress || !jwtToken) {
					console.error('Cannot connect: Missing walletAddress or jwtToken in storage.');
					sendResponse({ status: 'error', message: 'Authentication credentials not found.' });
					return true;
				}
			}

			if (request.host) {
				VPN_HOST = request.host;
				// console.log(`Setting VPN_HOST to: ${VPN_HOST}`);
				if (request.isConnected) {
					await storageSetAsync({ vpnHost: VPN_HOST });
				}
			} else {
				console.warn('No host provided in toggleVPN message');
				if (request.isConnected && !VPN_HOST) {
					// console.log('Attempting to load saved host from storage');
					const result = await storageGetAsync(['vpnHost']);
					if (result.vpnHost) {
						VPN_HOST = result.vpnHost;
						// console.log(`Loaded saved host: ${VPN_HOST}`);
					}
				}
			}

			console.log(`VPN Host: ${VPN_HOST || 'not set'}, VPN Port: ${VPN_PORT}`);

			if (request.isConnected && !VPN_HOST) {
				const errorMsg = 'Cannot connect VPN: No host specified';
				console.error(errorMsg);
				sendResponse({ status: 'error', message: errorMsg });
				return true;
			}

			const success = await setProxyConfig(request.isConnected, VPN_HOST, walletAddress, jwtToken);

			if (success) {
				sendResponse({ status: 'success' });
				if (request.isConnected) {
					startTimer();
				} else {
					stopTimer();
					await storageRemoveAsync(['vpnHost']);
				}
			} else {
				sendResponse({ status: 'error', message: 'Failed to set proxy configuration' });
			}
		} catch (error) {
			console.error('Error in toggleVPN handler:', error);
			const errorMessage = error && error.message ? error.message : 'Unknown error occurred';
			sendResponse({ status: 'error', message: errorMessage });
		}
	} else if (request.action === 'logoutAndDisconnectVPN') {
		await logoutAndDisconnectVPN();
		sendResponse({ status: 'success' });
		return true;
	}
	return true;
});

// Timer functions
function startTimer() {
	if (timerInterval) return;

	timerInterval = setInterval(() => {
		seconds++;
		chrome.storage.local.set({ timerSeconds: seconds });
		chrome.runtime
			.sendMessage({
				action: 'timerUpdate',
				seconds: seconds
			})
			.catch(() => {});
	}, 1000);
}

function stopTimer() {
	if (timerInterval) {
		clearInterval(timerInterval);
		timerInterval = null;
	}
}

// Service worker startup
(async () => {
	console.log('Service worker starting, restoring state...');
	try {
		const result = await storageGetAsync([
			'vpnConnected',
			'vpnHost',
			'timerSeconds',
			'walletAddress',
			'jwtToken'
		]);
		console.log('Restoring service worker state:', result);

		if (result.vpnHost) {
			VPN_HOST = result.vpnHost;
			// console.log(`Restored saved host: ${VPN_HOST}`);
		}

		seconds = result.timerSeconds || 0;

		if (result.vpnConnected && VPN_HOST) {
			// console.log(`Restoring VPN connection to: ${VPN_HOST}`);
			const success = await setProxyConfig(true, VPN_HOST, result.walletAddress, result.jwtToken);

			if (success) {
				startTimer();
				// console.log('VPN connection restored successfully');
			} else {
				console.error('Failed to restore VPN connection');
				await storageSetAsync({ vpnConnected: false });
			}
		}
	} catch (error) {
		console.error('Error during service worker startup:', error);
	}
})();

async function logoutAndDisconnectVPN() {
	try {
		// Check if VPN is connected
		const { vpnConnected, vpnHost } = await storageGetAsync(['vpnConnected', 'vpnHost']);
		if (vpnConnected) {
			// Disconnect VPN
			await setProxyConfig(false, vpnHost);
			await storageSetAsync({ vpnConnected: false });
			stopTimer();
			await storageRemoveAsync(['vpnHost']);
			// console.log('VPN disconnected before logout.');
		}
	} catch (e) {
		console.error('Error disconnecting VPN during logout:', e);
	}
}
