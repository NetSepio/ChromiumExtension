// Real NFT functionality for explore-nfts.html
let nftService;
let currentTab = 'trending';
let trendingCollections = [];
let userNFTs = [];
let searchResults = [];
let walletAddress = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async function () {
	nftService = new StaticNFTService();

	// Initialize API key from storage if available
	await nftService.initializeApiKey();

	await initializePage();
});

async function initializePage() {
	try {
		// Get current wallet address from Chrome storage
		if (typeof chrome !== 'undefined' && chrome.storage) {
			const result = await chrome.storage.local.get(['walletAddress']);
			walletAddress = result.walletAddress;
			console.log('Wallet address from storage:', walletAddress);
		}

		// Update wallet address display
		updateWalletDisplay();

		// Initialize tabs
		initializeTabs();

		// Initialize action handlers
		initializeActionHandlers();

		// Load initial data
		await loadTrendingCollections();
		showTab('my-nfts');

		// Initialize search
		initializeSearch();
	} catch (error) {
		console.error('Error initializing page:', error);
		showError('Failed to initialize NFT explorer');
	}
}

function initializeTabs() {
	const tabButtons = document.querySelectorAll('.tab-btn');
	tabButtons.forEach((button) => {
		button.addEventListener('click', (e) => {
			const tab = e.target.dataset.tab;
			showTab(tab);
		});
	});
}

function initializeActionHandlers() {
	// Handle all data-action elements
	document.addEventListener('click', (e) => {
		const target = e.target.closest('[data-action]');
		if (!target) return;

		const action = target.dataset.action;
		const symbol = target.dataset.symbol;
		const mint = target.dataset.mint;

		switch (action) {
			case 'goBack':
				goBack();
				break;
			case 'switchTab': {
				const tab = target.dataset.tab;
				if (tab) showTab(tab);
				break;
			}
			case 'openCollection':
				if (symbol) {
					console.log('Opening collection details for:', symbol);
					openCollectionDetails(symbol);
				}
				break;
			case 'openNFT':
				if (mint) {
					console.log('Opening NFT details for:', mint);
					openNFTDetails(mint);
				}
				break;
		}
	});
}

async function showTab(tab) {
	currentTab = tab;

	// Update tab buttons
	document.querySelectorAll('.tab-btn').forEach((btn) => {
		btn.classList.remove('active');
	});
	const activeTabButton = document.querySelector(`[data-tab="${tab}"]`);
	if (activeTabButton) {
		activeTabButton.classList.add('active');
	}

	// Show/hide content
	document.querySelectorAll('.tab-content').forEach((content) => {
		content.classList.remove('active');
	});

	const targetContent = document.getElementById(`${tab}-tab`);
	if (targetContent) {
		targetContent.classList.add('active');
	}

	// Load content based on tab
	switch (tab) {
		case 'discover':
			await displayTrendingCollections();
			break;
		case 'my-nfts':
			await loadAndDisplayUserNFTs();
			break;
	}
}

async function loadTrendingCollections() {
	try {
		trendingCollections = await nftService.getTrendingCollections(20);
		console.log('Loaded trending collections:', trendingCollections);
	} catch (error) {
		console.error('Error loading trending collections:', error);
		showError('Failed to load trending collections');
	}
}

async function displayTrendingCollections() {
	const grid = document.getElementById('collections-grid');
	if (!grid) return;

	// Show the discover content and hide loading
	const loading = document.getElementById('discover-loading');
	const content = document.getElementById('discover-content');
	if (loading) loading.style.display = 'none';
	if (content) content.style.display = 'block';

	if (trendingCollections.length === 0) {
		grid.innerHTML = '<div class="no-data">No trending collections available</div>';
		return;
	}

	grid.innerHTML = trendingCollections
		.map(
			(collection) => `
        <div class="nft-card collection-card" data-action="openCollection" data-symbol="${collection.symbol}">
            <div class="nft-image">
                ${collection.image ? `<img src="${collection.image}" alt="${collection.name}" loading="lazy" onerror="this.style.display='none';">` : ''}
                <div style="position: absolute; top: 8px; right: 8px; z-index: 1;">
                    ${collection.verified ? '<span style="background: rgba(34, 197, 94, 0.9); color: white; padding: 2px 6px; border-radius: 10px; font-size: 10px;">✓</span>' : ''}
                </div>
                ${!collection.image ? '<span style="color: rgba(255,255,255,0.6);">🎨</span>' : ''}
            </div>
            <div class="nft-info">
                <div class="nft-name">${collection.name}</div>
                <div class="nft-collection">Floor: ${nftService.formatPrice(collection.floorPrice)}</div>
                <div class="nft-actions">
                    <button class="view-btn" data-action="openCollection" data-symbol="${collection.symbol}">View</button>
                    <span style="font-size: 12px; color: rgba(255,255,255,0.6);">${collection.supply || 0} items</span>
                </div>
            </div>
        </div>
    `
		)
		.join('');
}

async function loadAndDisplayUserNFTs() {
	const grid = document.getElementById('my-nfts-grid');
	const loading = document.getElementById('my-nfts-loading');
	const content = document.getElementById('my-nfts-content');
	const empty = document.getElementById('my-nfts-empty');

	if (!grid) return;

	// Show loading state
	if (loading) loading.style.display = 'block';
	if (content) content.style.display = 'none';
	if (empty) empty.style.display = 'none';

	try {
		if (!walletAddress) {
			if (loading) loading.style.display = 'none';
			if (empty) empty.style.display = 'block';
			return;
		}

		userNFTs = await nftService.getUserNFTs(walletAddress);
		console.log('Loaded user NFTs:', userNFTs);

		if (userNFTs.length === 0) {
			if (loading) loading.style.display = 'none';
			if (empty) empty.style.display = 'block';
			return;
		}

		grid.innerHTML = userNFTs
			.map(
				(nft) => `
            <div class="nft-card" data-action="openNFT" data-mint="${nft.mint}">
                <div class="nft-image-container">
                    <img src="${nft.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjNGY0ZjUzIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNjY2MiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'}" alt="${nft.name}" loading="lazy">
                    ${nftService.isCyaiNFT(nft) ? '<div class="cyai-badge">CYAI</div>' : ''}
                </div>
                <div class="nft-info">
                    <h3 class="nft-title">${nft.name}</h3>
                    <p class="nft-collection">${nft.collection?.name || 'Unknown Collection'}</p>
                </div>
            </div>
        `
			)
			.join('');

		// Show content
		if (loading) loading.style.display = 'none';
		if (content) content.style.display = 'block';
	} catch (error) {
		console.error('Error loading user NFTs:', error);
		if (loading) loading.style.display = 'none';
		if (empty) empty.style.display = 'block';
	}
}

function initializeSearch() {
	const searchInput = document.getElementById('search-input');

	if (!searchInput) return;

	let searchTimeout;

	searchInput.addEventListener('input', () => {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			const query = searchInput.value.trim();
			if (query.length >= 2) {
				performSearch(query);
			} else {
				// Show trending collections when search is cleared
				displayTrendingCollections();
			}
		}, 500);
	});

	searchInput.addEventListener('keypress', (e) => {
		if (e.key === 'Enter') {
			const query = searchInput.value.trim();
			if (query.length >= 2) {
				performSearch(query);
			}
		}
	});
}

async function performSearch(query) {
	try {
		searchResults = await nftService.searchCollections(query, 15);
		console.log('Search results:', searchResults);
		displaySearchResults();
	} catch (error) {
		console.error('Error performing search:', error);
		searchResults = [];
		displaySearchResults();
	}
}

function displaySearchResults() {
	const resultsContainer = document.getElementById('collections-grid');
	const titleElement = document.getElementById('discover-title');

	if (!resultsContainer) return;

	// Update title based on search
	const query = document.getElementById('search-input')?.value.trim();
	if (titleElement) {
		titleElement.textContent = query ? `Search Results for "${query}"` : 'Trending Collections';
	}

	if (searchResults.length === 0) {
		if (query && query.length >= 2) {
			resultsContainer.innerHTML =
				'<div class="no-data">No collections found for your search</div>';
		} else {
			// Show trending collections if no search
			displayTrendingCollections();
		}
		return;
	}

	resultsContainer.innerHTML = searchResults
		.map(
			(collection) => `
        <div class="nft-card collection-card" data-action="openCollection" data-symbol="${collection.symbol}">
            <div class="nft-image-container">
                <img src="${collection.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjNGY0ZjUzIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNjY2MiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'}" alt="${collection.name}" loading="lazy">
                ${collection.verified ? '<div class="verified-badge">✓</div>' : ''}
                ${collection.isCyai ? '<div class="cyai-badge">CYAI</div>' : ''}
            </div>
            <div class="nft-info">
                <h3 class="nft-title">${collection.name}</h3>
                ${collection.description ? `<p class="nft-description">${collection.description.substring(0, 100)}${collection.description.length > 100 ? '...' : ''}</p>` : ''}
                ${collection.floorPrice !== undefined ? `<div class="stat"><span class="stat-label">Floor:</span> <span class="stat-value">${nftService.formatPrice(collection.floorPrice)}</span></div>` : ''}
            </div>
        </div>
    `
		)
		.join('');
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

function openCollectionDetails(symbol) {
	console.log('Opening collection details for:', symbol);

	if (typeof chrome !== 'undefined' && chrome.tabs) {
		const url = chrome.runtime.getURL(`collection-detail.html?symbol=${symbol}`);
		console.log('Creating tab with URL:', url);

		chrome.tabs.create(
			{
				url: url
			},
			(tab) => {
				if (chrome.runtime.lastError) {
					console.error('Error creating tab:', chrome.runtime.lastError);
				} else {
					console.log('Tab created successfully:', tab);
				}
			}
		);
	} else {
		// Fallback for development
		const url = `collection-detail.html?symbol=${symbol}`;
		console.log('Opening fallback URL:', url);
		window.open(url, '_blank');
	}
}

// Make functions globally accessible for HTML onclick handlers
window.showTab = showTab;
window.openCollectionDetails = openCollectionDetails;
window.openNFTDetails = openNFTDetails;
window.openMagicEden = openMagicEden;
window.openTensor = openTensor;
window.openHyperspace = openHyperspace;
window.refreshTrending = refreshTrending;
window.refreshMyNFTs = refreshMyNFTs;

// Marketplace navigation functions
function openMagicEden(mint) {
	if (typeof chrome !== 'undefined' && chrome.tabs) {
		chrome.tabs.create({
			url: `https://magiceden.io/item-details/${mint}`
		});
	} else {
		window.open(`https://magiceden.io/item-details/${mint}`, '_blank');
	}
}

function openTensor(mint) {
	if (typeof chrome !== 'undefined' && chrome.tabs) {
		chrome.tabs.create({
			url: `https://www.tensor.trade/item/${mint}`
		});
	} else {
		window.open(`https://www.tensor.trade/item/${mint}`, '_blank');
	}
}

function openHyperspace(mint) {
	if (typeof chrome !== 'undefined' && chrome.tabs) {
		chrome.tabs.create({
			url: `https://hyperspace.xyz/token/${mint}`
		});
	} else {
		window.open(`https://hyperspace.xyz/token/${mint}`, '_blank');
	}
}

// Utility functions
function showError(message) {
	console.error(message);
	// Could show a toast notification here
}

// Update wallet address display
function updateWalletDisplay() {
	const walletElement = document.getElementById('wallet-address');
	if (walletElement) {
		if (walletAddress) {
			// Format wallet address (show first 4 and last 4 characters)
			const formatted = `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`;
			walletElement.textContent = formatted;
			walletElement.title = walletAddress; // Show full address on hover
		} else {
			walletElement.textContent = 'Not Connected';
		}
	}
}

// Go back to wallet page
function goBack() {
	if (typeof chrome !== 'undefined' && chrome.tabs) {
		chrome.tabs.getCurrent((tab) => {
			chrome.tabs.remove(tab.id);
		});
	} else {
		window.close();
	}
}

// Refresh data functions
async function refreshTrending() {
	await loadTrendingCollections();
	if (currentTab === 'discover') {
		await displayTrendingCollections();
	}
}

async function refreshMyNFTs() {
	if (currentTab === 'my-nfts') {
		await loadAndDisplayUserNFTs();
	}
}
