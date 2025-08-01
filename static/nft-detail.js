// Real NFT detail functionality for nft-detail.html
let nftService;
let currentNFT = null;
let mintAddress = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    nftService = new StaticNFTService();
    await initializePage();
});

async function initializePage() {
    try {
        // Get mint address from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        mintAddress = urlParams.get('mint');
        
        if (!mintAddress) {
            showError('No NFT mint address provided');
            return;
        }
        
        // Load NFT details
        await loadNFTDetails();
        
        // Initialize event listeners
        initializeEventListeners();
        
    } catch (error) {
        console.error('Error initializing page:', error);
        showError('Failed to initialize NFT details page');
    }
}

function initializeEventListeners() {
    // Copy mint address button
    const copyBtn = document.getElementById('copy-mint-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyMintAddress);
    }
    
    // Marketplace buttons
    const magicEdenBtn = document.getElementById('magic-eden-btn');
    if (magicEdenBtn) {
        magicEdenBtn.addEventListener('click', () => openMagicEden(mintAddress));
    }
    
    const tensorBtn = document.getElementById('tensor-btn');
    if (tensorBtn) {
        tensorBtn.addEventListener('click', () => openTensor(mintAddress));
    }
    
    const hyperspaceBtn = document.getElementById('hyperspace-btn');
    if (hyperspaceBtn) {
        hyperspaceBtn.addEventListener('click', () => openHyperspace(mintAddress));
    }
    
    // Back button
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (typeof chrome !== 'undefined' && chrome.tabs) {
                chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                    chrome.tabs.remove(tabs[0].id);
                });
            } else {
                window.close();
            }
        });
    }
}

async function loadNFTDetails() {
    try {
        showLoading();
        
        // Load NFT metadata
        currentNFT = await nftService.getNFTMetadata(mintAddress);
        
        if (!currentNFT) {
            showError('NFT not found or failed to load metadata');
            return;
        }
        
        console.log('Loaded NFT details:', currentNFT);
        displayNFTDetails();
        
    } catch (error) {
        console.error('Error loading NFT details:', error);
        showError('Failed to load NFT details');
    }
}

function displayNFTDetails() {
    if (!currentNFT) return;
    
    // Update page title
    document.title = `${currentNFT.name || 'NFT Details'} - Netsepio Wallet`;
    
    // NFT Image
    const nftImage = document.getElementById('nft-image');
    if (nftImage) {
        nftImage.src = currentNFT.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjNGY0ZjUzIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNjY2MiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+';
        nftImage.alt = currentNFT.name || 'NFT Image';
    }
    
    // NFT Name
    const nftName = document.getElementById('nft-name');
    if (nftName) {
        nftName.textContent = currentNFT.name || 'Unnamed NFT';
    }
    
    // Collection Name
    const collectionName = document.getElementById('collection-name');
    if (collectionName) {
        collectionName.textContent = currentNFT.collection?.name || 'Unknown Collection';
        
        // Add verified badge if applicable
        if (currentNFT.collection?.verified) {
            collectionName.innerHTML += ' <span class="verified-badge">✓</span>';
        }
        
        // Add CYAI badge if applicable
        if (nftService.isCyaiNFT(currentNFT)) {
            collectionName.innerHTML += ' <span class="cyai-badge">CYAI</span>';
        }
    }
    
    // Description
    const description = document.getElementById('nft-description');
    if (description) {
        description.textContent = currentNFT.description || 'No description available';
    }
    
    // Mint Address
    const mintAddressEl = document.getElementById('mint-address');
    if (mintAddressEl) {
        mintAddressEl.textContent = formatMintAddress(mintAddress);
    }
    
    // Symbol
    const symbol = document.getElementById('nft-symbol');
    if (symbol) {
        symbol.textContent = currentNFT.symbol || 'N/A';
    }
    
    // External URL
    const externalUrl = document.getElementById('external-url');
    if (externalUrl && currentNFT.external_url) {
        externalUrl.href = currentNFT.external_url;
        externalUrl.style.display = 'inline-block';
        externalUrl.textContent = 'View External Link';
    } else if (externalUrl) {
        externalUrl.style.display = 'none';
    }
    
    // Attributes
    displayAttributes();
    
    // Properties/Creators
    displayProperties();
    
    // Hide loading and show content
    hideLoading();
}

function displayAttributes() {
    const attributesGrid = document.getElementById('attributes-grid');
    if (!attributesGrid) return;
    
    if (!currentNFT.attributes || currentNFT.attributes.length === 0) {
        attributesGrid.innerHTML = '<div class="no-attributes">No attributes available</div>';
        return;
    }
    
    attributesGrid.innerHTML = currentNFT.attributes.map(attr => `
        <div class="attribute-card">
            <div class="attribute-trait">${attr.trait_type || attr.key || 'Trait'}</div>
            <div class="attribute-value">${attr.value || 'N/A'}</div>
        </div>
    `).join('');
}

function displayProperties() {
    const propertiesSection = document.getElementById('properties-section');
    if (!propertiesSection) return;
    
    const properties = currentNFT.properties;
    if (!properties) {
        propertiesSection.style.display = 'none';
        return;
    }
    
    let propertiesHTML = '';
    
    // Creators
    if (properties.creators && properties.creators.length > 0) {
        propertiesHTML += `
            <div class="property-group">
                <h4>Creators</h4>
                <div class="creators-list">
                    ${properties.creators.map(creator => `
                        <div class="creator-item">
                            <span class="creator-address">${formatAddress(creator.address)}</span>
                            <span class="creator-share">${creator.share || 0}%</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Category
    if (properties.category) {
        propertiesHTML += `
            <div class="property-group">
                <h4>Category</h4>
                <div class="property-value">${properties.category}</div>
            </div>
        `;
    }
    
    if (propertiesHTML) {
        const propertiesContent = propertiesSection.querySelector('.properties-content');
        if (propertiesContent) {
            propertiesContent.innerHTML = propertiesHTML;
        }
        propertiesSection.style.display = 'block';
    } else {
        propertiesSection.style.display = 'none';
    }
}

function copyMintAddress() {
    if (!mintAddress) return;
    
    navigator.clipboard.writeText(mintAddress).then(() => {
        // Show temporary feedback
        const copyBtn = document.getElementById('copy-mint-btn');
        if (copyBtn) {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.classList.add('copied');
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.classList.remove('copied');
            }, 2000);
        }
    }).catch(err => {
        console.error('Failed to copy mint address:', err);
    });
}

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
function showLoading() {
    const loadingEl = document.getElementById('loading');
    const contentEl = document.getElementById('content');
    
    if (loadingEl) loadingEl.style.display = 'flex';
    if (contentEl) contentEl.style.display = 'none';
}

function hideLoading() {
    const loadingEl = document.getElementById('loading');
    const contentEl = document.getElementById('content');
    
    if (loadingEl) loadingEl.style.display = 'none';
    if (contentEl) contentEl.style.display = 'block';
}

function showError(message) {
    console.error(message);
    
    const errorEl = document.getElementById('error');
    const errorMessage = document.getElementById('error-message');
    const contentEl = document.getElementById('content');
    const loadingEl = document.getElementById('loading');
    
    if (errorMessage) errorMessage.textContent = message;
    if (errorEl) errorEl.style.display = 'flex';
    if (contentEl) contentEl.style.display = 'none';
    if (loadingEl) loadingEl.style.display = 'none';
}

function formatMintAddress(address) {
    if (!address) return 'N/A';
    if (address.length <= 16) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
}

function formatAddress(address) {
    if (!address) return 'N/A';
    if (address.length <= 16) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Refresh functionality
async function refreshNFTDetails() {
    if (mintAddress) {
        await loadNFTDetails();
    }
}
