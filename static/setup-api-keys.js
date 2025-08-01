// Setup script to initialize API keys in Chrome storage from environment
// This should be run once to setup the extension for development

async function setupApiKeys() {
	if (typeof chrome !== 'undefined' && chrome.storage) {
		try {
			// Only setup if we have access to environment variables
			// In a Chrome extension, this would typically be injected during build
			const apiKey = getApiKeyFromEnvironment();

			if (apiKey) {
				await chrome.storage.local.set({
					heliusApiKey: apiKey
				});
				console.log('API keys setup completed from environment');
			} else {
				console.log('No API key found in environment, extension will use fallback data');
			}
		} catch (error) {
			console.error('Error setting up API keys:', error);
		}
	}
}

function getApiKeyFromEnvironment() {
	// Try to get from injected environment variables
	if (typeof window !== 'undefined' && window.ENV && window.ENV.HELIUS_API_KEY) {
		return window.ENV.HELIUS_API_KEY;
	}

	// Try to get from process.env (if available in build context)
	if (typeof process !== 'undefined' && process.env && process.env.HELIUS_API_KEY) {
		return process.env.HELIUS_API_KEY;
	}

	return null;
}

// Run setup when script is loaded
setupApiKeys();
