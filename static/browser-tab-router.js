// Browser tab router - handles navigation to appropriate static HTML pages
class BrowserTabRouter {
	constructor() {
		this.init();
	}

	init() {
		// Get the hash from URL
		const hash = window.location.hash.substring(1); // Remove the #

		if (!hash) {
			this.showError('No navigation target specified');
			return;
		}

		this.routeToPage(hash);
	}

	routeToPage(path) {
		try {
			let targetUrl = '';

			if (path.includes('/nft-detail') || path.includes('nft-detail')) {
				// Extract mint parameter
				const url = new URL(path, 'chrome-extension://dummy');
				const mint = url.searchParams.get('mint');
				if (mint) {
					targetUrl = `nft-detail.html?mint=${encodeURIComponent(mint)}`;
				} else {
					this.showError('Missing mint parameter for NFT detail page');
					return;
				}
			} else if (path.includes('/collection-detail') || path.includes('collection-detail')) {
				// Extract collection parameter
				const url = new URL(path, 'chrome-extension://dummy');
				const collection = url.searchParams.get('collection') || url.searchParams.get('symbol');
				if (collection) {
					targetUrl = `collection-detail.html?collection=${encodeURIComponent(collection)}`;
				} else {
					this.showError('Missing collection parameter for collection detail page');
					return;
				}
			} else if (path.includes('/explore-nfts') || path.includes('explore-nfts')) {
				targetUrl = 'explore-nfts.html';
			} else {
				this.showError(`Unknown route: ${path}`);
				return;
			}

			// Redirect to the target page
			window.location.href = targetUrl;
		} catch (error) {
			console.error('Routing error:', error);
			this.showError('Failed to navigate to the requested page');
		}
	}

	showError(message) {
		const loadingElement = document.querySelector('.loading');
		const spinnerElement = document.querySelector('.spinner');
		const errorElement = document.getElementById('error');

		if (loadingElement) loadingElement.style.display = 'none';
		if (spinnerElement) spinnerElement.style.display = 'none';
		if (errorElement) {
			errorElement.textContent = message;
			errorElement.style.display = 'block';
		}
	}
}

// Initialize the router when the page loads
document.addEventListener('DOMContentLoaded', () => {
	new BrowserTabRouter();
});
