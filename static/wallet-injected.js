/**
 * Netsepio Wallet Injected Provider
 * Implements Solana Wallet Adapter Standard and Ethereum Provider API
 * This script runs in the page context to make the wallet detectable by dApps
 */

(function () {
	'use strict';

	// Prevent multiple injections
	if (window.netsepio) {
		return;
	}

	// Request ID counter
	let requestId = 0;

	// Pending requests
	const pendingRequests = new Map();

	// Event emitter for wallet events
	class EventEmitter {
		constructor() {
			this.events = {};
		}

		on(event, callback) {
			if (!this.events[event]) {
				this.events[event] = [];
			}
			this.events[event].push(callback);
		}

		off(event, callback) {
			if (!this.events[event]) return;
			this.events[event] = this.events[event].filter((cb) => cb !== callback);
		}

		emit(event, data) {
			if (!this.events[event]) return;
			this.events[event].forEach((callback) => callback(data));
		}
	}

	// Solana Wallet Adapter Implementation
	class NetsepioSolanaWallet extends EventEmitter {
		constructor() {
			super();
			this.name = 'Netsepio';
			this.url = 'https://netsepio.com';
			this.icon =
				'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iOCIgZmlsbD0iIzAwQ0NCQSIvPgo8cGF0aCBkPSJNOCAxNkMxMiAxMiAxNiAxMiAyMCAxNkMyMCAyMCAxNiAyMCAxMiAyMEg4VjE2WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+';
			this.readyState = 'NotDetected';
			this.publicKey = null;
			this.connected = false;
		}

		async connect() {
			return this.sendRequest('connect');
		}

		async disconnect() {
			this.connected = false;
			this.publicKey = null;
			this.emit('disconnect');
			return this.sendRequest('disconnect');
		}

		async signTransaction(transaction) {
			return this.sendRequest('signTransaction', { transaction });
		}

		async signAllTransactions(transactions) {
			return this.sendRequest('signAllTransactions', { transactions });
		}

		async signMessage(message) {
			return this.sendRequest('signMessage', { message });
		}

		async sendRequest(method, params = {}) {
			return new Promise((resolve, reject) => {
				const id = ++requestId;

				pendingRequests.set(id, { resolve, reject });

				window.postMessage(
					{
						type: 'NETSEPIO_WALLET_REQUEST',
						method: method,
						params: params,
						id: id
					},
					'*'
				);

				// Timeout after 30 seconds
				setTimeout(() => {
					if (pendingRequests.has(id)) {
						pendingRequests.delete(id);
						reject(new Error('Request timeout'));
					}
				}, 30000);
			});
		}
	}

	// Ethereum Provider Implementation
	class NetsepioEthereumProvider extends EventEmitter {
		constructor() {
			super();
			this.isNetsepio = true;
			this.isMetaMask = false; // Set to false to avoid conflicts
			this.chainId = null;
			this.selectedAddress = null;
			this.networkVersion = null;
		}

		async request({ method, params = [] }) {
			return this.sendRequest(method, params);
		}

		async enable() {
			return this.request({ method: 'eth_requestAccounts' });
		}

		async send(methodOrPayload, callbackOrParams) {
			if (typeof methodOrPayload === 'string') {
				// Legacy send(method, params)
				return this.request({
					method: methodOrPayload,
					params: callbackOrParams || []
				});
			} else {
				// Legacy send(payload, callback)
				try {
					const result = await this.request(methodOrPayload);
					if (callbackOrParams) {
						callbackOrParams(null, { result });
					}
					return { result };
				} catch (error) {
					if (callbackOrParams) {
						callbackOrParams(error);
					}
					throw error;
				}
			}
		}

		async sendRequest(method, params) {
			return new Promise((resolve, reject) => {
				const id = ++requestId;

				pendingRequests.set(id, { resolve, reject });

				window.postMessage(
					{
						type: 'NETSEPIO_WALLET_REQUEST',
						method: method,
						params: params,
						id: id
					},
					'*'
				);

				// Timeout after 30 seconds
				setTimeout(() => {
					if (pendingRequests.has(id)) {
						pendingRequests.delete(id);
						reject(new Error('Request timeout'));
					}
				}, 30000);
			});
		}
	}

	// Listen for responses from content script
	window.addEventListener('message', function (event) {
		if (event.source !== window) return;

		if (event.data.type === 'NETSEPIO_WALLET_RESPONSE') {
			const { id, result, error } = event.data;

			if (pendingRequests.has(id)) {
				const { resolve, reject } = pendingRequests.get(id);
				pendingRequests.delete(id);

				if (error) {
					reject(new Error(error));
				} else {
					resolve(result);
				}
			}
		}
	});

	// Create wallet instances
	const solanaWallet = new NetsepioSolanaWallet();
	const ethereumProvider = new NetsepioEthereumProvider();

	// Expose Netsepio wallet object
	window.netsepio = {
		solana: solanaWallet,
		ethereum: ethereumProvider,
		isNetsepio: true
	};

	// Register with Solana wallet standard
	if (window.solana) {
		// If another wallet is already registered, create an array
		if (!Array.isArray(window.solana)) {
			window.solana = [window.solana];
		}
		window.solana.push(solanaWallet);
	} else {
		window.solana = solanaWallet;
	}

	// Register with Ethereum provider standard
	if (!window.ethereum) {
		window.ethereum = ethereumProvider;
	} else {
		// If another provider exists, we can coexist
		window.ethereum.providers = window.ethereum.providers || [];
		window.ethereum.providers.push(ethereumProvider);
	}

	// Announce wallet to dApps
	const announceEvent = new CustomEvent('ethereum#initialized', {
		detail: ethereumProvider
	});
	window.dispatchEvent(announceEvent);

	// Solana wallet standard announcement
	const solanaAnnounceEvent = new CustomEvent('wallet-standard:app-ready', {
		detail: { solana: solanaWallet }
	});
	window.dispatchEvent(solanaAnnounceEvent);

	console.log('Netsepio Wallet Provider initialized');
	console.log('Solana wallet available at: window.solana or window.netsepio.solana');
	console.log('Ethereum provider available at: window.ethereum or window.netsepio.ethereum');
})();
