// Real collection detail functionality for collection-detail.html
let nftService;
let currentCollection = null;
let collectionSymbol = null;
let collectionNFTs = [];
let currentPage = 0;
let isLoading = false;
let hasMoreData = true;

const ITEMS_PER_PAGE = 20;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async function () {
	nftService = new StaticNFTService();

	// Initialize API key from storage if available
	await nftService.initializeApiKey();

	await initializePage();
});

async function initializePage() {
	try {
		// Get collection symbol from URL parameters
		const urlParams = new URLSearchParams(window.location.search);
		collectionSymbol = urlParams.get('symbol');

		if (!collectionSymbol) {
			showError('No collection symbol provided');
			return;
		}

		// Load collection details
		await loadCollectionInfo();

		// Load first page of NFTs
		await loadCollectionNFTs();

		// Initialize event listeners
		initializeEventListeners();
	} catch (error) {
		console.error('Error initializing page:', error);
		showError('Failed to initialize collection details page');
	}
}

function initializeEventListeners() {
	// Load more button
	const loadMoreBtn = document.getElementById('load-more-btn');
	if (loadMoreBtn) {
		loadMoreBtn.addEventListener('click', loadMoreNFTs);
	}

	// Refresh button
	const refreshBtn = document.getElementById('refresh-btn');
	if (refreshBtn) {
		refreshBtn.addEventListener('click', refreshCollection);
	}

	// Handle all data-action elements
	document.addEventListener('click', (e) => {
		const target = e.target.closest('[data-action]');
		if (!target) return;

		const action = target.dataset.action;
		const mint = target.dataset.mint;

		switch (action) {
			case 'goBack':
				goBack();
				break;
			case 'loadCollectionDetails':
				loadCollectionInfo();
				break;
			case 'loadMoreNFTs':
				loadMoreNFTs();
				break;
			case 'openNFT':
				if (mint) {
					console.log('Opening NFT details for:', mint);
					openNFTDetails(mint);
				}
				break;
		}
	});

	// Infinite scroll
	window.addEventListener('scroll', () => {
		if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
			if (!isLoading && hasMoreData) {
				loadMoreNFTs();
			}
		}
	});
}

async function loadCollectionInfo() {
	try {
		showCollectionLoading();

		currentCollection = await nftService.getCollectionInfo(collectionSymbol);

		if (!currentCollection) {
			// Create fallback collection data only if API fails
			currentCollection = {
				symbol: collectionSymbol,
				name: collectionSymbol.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
				description: 'Collection information not available',
				image: '',
				floorPrice: undefined,
				listedCount: 0,
				volume24h: undefined,
				owners: 0,
				supply: 0,
				verified: false,
				isCyai: collectionSymbol.toLowerCase().includes('cyai'),
				source: 'fallback'
			};
		}

		console.log('Loaded collection info:', currentCollection);
		displayCollectionInfo();
	} catch (error) {
		console.error('Error loading collection info:', error);
		showError('Failed to load collection information');
	}
}

function displayCollectionInfo() {
	if (!currentCollection) return;

	// Update page title
	document.title = `${currentCollection.name} - Netsepio Wallet`;

	// Collection Image
	const collectionImage = document.getElementById('collection-image');
	if (collectionImage) {
		collectionImage.src =
			currentCollection.image ||
			'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjNGY0ZjUzIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNjY2MiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+';
		collectionImage.alt = currentCollection.name;
	}

	// Collection Name
	const collectionName = document.getElementById('collection-name');
	if (collectionName) {
		collectionName.textContent = currentCollection.name;

		// Add verified badge if applicable
		if (currentCollection.verified) {
			collectionName.innerHTML += ' <span class="verified-badge">✓</span>';
		}

		// Add CYAI badge if applicable
		if (currentCollection.isCyai) {
			collectionName.innerHTML += ' <span class="cyai-badge">CYAI</span>';
		}
	}

	// Collection Description
	const description = document.getElementById('collection-description');
	if (description) {
		description.textContent = currentCollection.description || 'No description available';
	}

	// Collection Stats
	updateCollectionStats();

	hideCollectionLoading();
}

function updateCollectionStats() {
	// Floor Price
	const floorPriceEl = document.getElementById('floor-price');
	if (floorPriceEl) {
		floorPriceEl.textContent =
			currentCollection.floorPrice !== undefined
				? nftService.formatPrice(currentCollection.floorPrice)
				: 'N/A';
	}

	// Volume
	const volumeEl = document.getElementById('volume-24h');
	if (volumeEl) {
		volumeEl.textContent =
			currentCollection.volume24h !== undefined
				? nftService.formatPrice(currentCollection.volume24h)
				: 'N/A';
	}

	// Listed Count
	const listedEl = document.getElementById('listed-count');
	if (listedEl) {
		listedEl.textContent = currentCollection.listedCount?.toLocaleString() || '0';
	}

	// Total Supply
	const supplyEl = document.getElementById('total-supply');
	if (supplyEl) {
		supplyEl.textContent = currentCollection.supply?.toLocaleString() || '0';
	}

	// Owners
	const ownersEl = document.getElementById('owners-count');
	if (ownersEl) {
		ownersEl.textContent = currentCollection.owners?.toLocaleString() || '0';
	}
}

async function loadCollectionNFTs() {
	try {
		showNFTsLoading();

		const newNFTs = await nftService.getCollectionNFTs(
			collectionSymbol,
			ITEMS_PER_PAGE,
			currentPage * ITEMS_PER_PAGE
		);

		if (newNFTs.length === 0 && currentPage === 0) {
			showNoNFTs();
			return;
		}

		if (newNFTs.length < ITEMS_PER_PAGE) {
			hasMoreData = false;
		}

		if (currentPage === 0) {
			collectionNFTs = newNFTs;
		} else {
			collectionNFTs = [...collectionNFTs, ...newNFTs];
		}

		console.log(`Loaded ${newNFTs.length} NFTs for page ${currentPage}:`, newNFTs);

		displayCollectionNFTs();
	} catch (error) {
		console.error('Error loading collection NFTs:', error);
		if (currentPage === 0) {
			showNFTsError();
		}
	}
}

function displayCollectionNFTs() {
	const grid = document.getElementById('nfts-grid');
	if (!grid) return;

	if (collectionNFTs.length === 0) {
		showNoNFTs();
		return;
	}

	grid.innerHTML = collectionNFTs
		.map(
			(nft) => `
        <div class="nft-card" data-action="openNFT" data-mint="${nft.mint}">
            <div class="nft-image-container">
                <img src="${nft.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjNGY0ZjUzIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNjY2MiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'}" alt="${nft.name}" loading="lazy">
                ${nftService.isCyaiNFT(nft) ? '<div class="cyai-badge">CYAI</div>' : ''}
                ${nft.floorPrice ? `<div class="price-badge">${nftService.formatPrice(nft.floorPrice)}</div>` : ''}
            </div>
            <div class="nft-info">
                <h3 class="nft-title">${nft.name}</h3>
                ${nft.description ? `<p class="nft-description">${nft.description.substring(0, 60)}${nft.description.length > 60 ? '...' : ''}</p>` : ''}
            </div>
        </div>
    `
		)
		.join('');

	hideNFTsLoading();
	updateLoadMoreButton();
}

async function loadMoreNFTs() {
	if (isLoading || !hasMoreData) return;

	isLoading = true;
	currentPage++;

	const loadMoreBtn = document.getElementById('load-more-btn');
	if (loadMoreBtn) {
		loadMoreBtn.disabled = true;
		loadMoreBtn.textContent = 'Loading...';
	}

	try {
		await loadCollectionNFTs();
	} finally {
		isLoading = false;
		updateLoadMoreButton();
	}
}

function updateLoadMoreButton() {
	const loadMoreBtn = document.getElementById('load-more-btn');
	if (!loadMoreBtn) return;

	if (hasMoreData && !isLoading) {
		loadMoreBtn.disabled = false;
		loadMoreBtn.textContent = 'Load More NFTs';
		loadMoreBtn.style.display = 'block';
	} else if (isLoading) {
		loadMoreBtn.disabled = true;
		loadMoreBtn.textContent = 'Loading...';
		loadMoreBtn.style.display = 'block';
	} else {
		loadMoreBtn.style.display = 'none';
	}
}

function openNFTDetails(mint) {
	if (typeof chrome !== 'undefined' && chrome.tabs) {
		chrome.tabs.create({
			url: chrome.runtime.getURL(`nft-detail.html?mint=${mint}`)
		});
	} else {
		// Fallback for development
		window.open(`nft-detail.html?mint=${mint}`, '_blank');
	}
}

async function refreshCollection() {
	currentPage = 0;
	collectionNFTs = [];
	hasMoreData = true;
	isLoading = false;

	await loadCollectionInfo();
	await loadCollectionNFTs();
}

// Loading and error states
function showCollectionLoading() {
	const collectionHeader = document.getElementById('collection-header');
	if (collectionHeader) {
		collectionHeader.style.opacity = '0.5';
	}
}

function hideCollectionLoading() {
	const collectionHeader = document.getElementById('collection-header');
	if (collectionHeader) {
		collectionHeader.style.opacity = '1';
	}
}

function showNFTsLoading() {
	if (currentPage === 0) {
		const grid = document.getElementById('nfts-grid');
		if (grid) {
			grid.innerHTML = '<div class="loading">Loading NFTs...</div>';
		}
	}
}

function hideNFTsLoading() {
	// Loading is hidden when grid is populated
}

function showNoNFTs() {
	const grid = document.getElementById('nfts-grid');
	if (grid) {
		grid.innerHTML = '<div class="no-data">No NFTs found in this collection</div>';
	}
	updateLoadMoreButton();
}

function showNFTsError() {
	const grid = document.getElementById('nfts-grid');
	if (grid) {
		grid.innerHTML = '<div class="error">Failed to load NFTs</div>';
	}
	updateLoadMoreButton();
}

function showError(message) {
	console.error(message);

	const errorEl = document.getElementById('error');
	const errorMessage = document.getElementById('error-message');
	const contentEl = document.getElementById('content');

	if (errorMessage) errorMessage.textContent = message;
	if (errorEl) errorEl.style.display = 'flex';
	if (contentEl) contentEl.style.display = 'none';
}

// Go back to previous page
function goBack() {
	if (typeof chrome !== 'undefined' && chrome.tabs) {
		chrome.tabs.getCurrent((tab) => {
			chrome.tabs.remove(tab.id);
		});
	} else {
		window.close();
	}
}

// Make functions globally accessible for HTML onclick handlers
window.openNFTDetails = openNFTDetails;
window.goBack = goBack;
