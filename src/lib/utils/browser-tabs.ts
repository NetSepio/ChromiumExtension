/**
 * Browser utilities for Chrome extension
 * Handles opening pages as browser tabs instead of within the popup
 */

/**
 * Opens a page in a new browser tab using CSP-compliant static HTML files
 * @param path - The relative path to open (e.g., '/nft-detail?mint=...')
 */
export async function openInBrowserTab(path: string): Promise<void> {
	try {
		// Use our custom CSP-compliant browser tab router
		const routerUrl = chrome.runtime.getURL('browser-tab-router.html');
		const targetUrl = `${routerUrl}#${path}`;

		// Create new tab
		await chrome.tabs.create({
			url: targetUrl,
			active: true
		});

		// Close the popup (optional - mimics wallet extension behavior)
		window.close();
	} catch (error) {
		console.error('Failed to open browser tab:', error);
		// Fallback - try opening static HTML directly
		try {
			let directUrl = '';

			if (path.includes('/nft-detail') || path.includes('nft-detail')) {
				// Extract mint parameter
				const url = new URL(path, 'chrome-extension://dummy');
				const mint = url.searchParams.get('mint');
				directUrl = chrome.runtime.getURL(`nft-detail.html?mint=${encodeURIComponent(mint || '')}`);
			} else if (path.includes('/collection-detail') || path.includes('collection-detail')) {
				// Extract collection parameter
				const url = new URL(path, 'chrome-extension://dummy');
				const collection = url.searchParams.get('collection') || url.searchParams.get('symbol');
				directUrl = chrome.runtime.getURL(
					`collection-detail.html?collection=${encodeURIComponent(collection || '')}`
				);
			} else if (path.includes('/explore-nfts') || path.includes('explore-nfts')) {
				directUrl = chrome.runtime.getURL('explore-nfts.html');
			}

			if (directUrl) {
				await chrome.tabs.create({
					url: directUrl,
					active: true
				});
				window.close();
			} else {
				window.location.href = path;
			}
		} catch (fallbackError) {
			console.error('Fallback navigation failed:', fallbackError);
		}
	}
}

/**
 * Opens NFT details in a browser tab
 * @param mint - The NFT mint address
 */
export function openNFTDetails(mint: string): Promise<void> {
	return openInBrowserTab(`/nft-detail?mint=${mint}`);
}

/**
 * Opens collection details in a browser tab
 * @param symbol - The collection symbol
 */
export function openCollectionDetails(symbol: string): Promise<void> {
	return openInBrowserTab(`/collection-detail?symbol=${symbol}`);
}

/**
 * Opens the NFT explore page in a browser tab
 */
export function openNFTExplore(): Promise<void> {
	return openInBrowserTab('/explore-nfts');
}
