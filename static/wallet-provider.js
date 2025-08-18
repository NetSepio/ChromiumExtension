/**
 * Netsepio Wallet Provider Content Script
 * Injects wallet providers into web pages to make the extension detectable by dApps
 */

// Only inject if we're in the main frame and not already injected
if (window.top === window && !window.netsepioWalletInjected) {
	window.netsepioWalletInjected = true;

	// Create and inject the wallet provider script
	const script = document.createElement('script');
	script.src = chrome.runtime.getURL('wallet-injected.js');
	script.onload = function () {
		this.remove();
	};

	// Inject before any other scripts
	(document.head || document.documentElement).appendChild(script);

	// Listen for messages from the injected script
	window.addEventListener('message', function (event) {
		// Only accept messages from same origin
		if (event.source !== window) return;

		if (event.data.type && event.data.type.startsWith('NETSEPIO_WALLET_')) {
			// Forward wallet requests to background script
			chrome.runtime
				.sendMessage({
					type: 'WALLET_REQUEST',
					method: event.data.method,
					params: event.data.params,
					id: event.data.id
				})
				.then((response) => {
					// Send response back to injected script
					window.postMessage(
						{
							type: 'NETSEPIO_WALLET_RESPONSE',
							id: event.data.id,
							result: response.result,
							error: response.error
						},
						'*'
					);
				})
				.catch((error) => {
					// Send error back to injected script
					window.postMessage(
						{
							type: 'NETSEPIO_WALLET_RESPONSE',
							id: event.data.id,
							error: error.message || 'Unknown error'
						},
						'*'
					);
				});
		}
	});

	console.log('Netsepio Wallet Provider injected');
}
