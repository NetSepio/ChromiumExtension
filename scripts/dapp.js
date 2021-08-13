// Add event listeners once the DOM has fully loaded by listening for the
// `DOMContentLoaded` event on the document, and adding your listeners to
// specific elements when it triggers.
document.addEventListener('DOMContentLoaded', function() {
    initDApp();
});

let maticRPCURL;
let mnemonicWallet;
let polygonTestnetProvider;
let netSepioWallet;

async function initDApp() {
    maticRPCURL = 'https://polygon-mumbai.g.alchemy.com/v2/BhfDGgKfFJch5QtGJ8L9HVfuFmv3LjsG';
    let mnemonic = await getWalletMnemonic();
    mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
    
    polygonTestnetProvider = new ethers.providers.JsonRpcProvider(maticRPCURL);
    netSepioWallet = mnemonicWallet.connect(polygonTestnetProvider);
    console.log("Total Transactions: " + await netSepioWallet.getTransactionCount());
    
    netSepioContract = new ethers.Contract(NetSepioContractAddress, NetSepioContractABI, netSepioWallet);
    // console.log(await getContractName(netSepioContract));
}

function getWalletMnemonic() {
    return new Promise(resolve => {
        chrome.storage.local.get(['mnemonic'], function(result) {
            // console.log('Mnemonic currently is: ' + result.mnemonic);
            resolve(result.mnemonic);
        });
    });
}

function getWalletAddress() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['walletAddress'], (result) => {
            console.log(result.walletAddress);
            resolve(result.walletAddress);
        });
    });
}

function getContractName() {
    return new Promise((resolve, reject) => {
        netSepioContract.name().then((result) => {
            resolve(result);
        });
    });
}

function getTotalReviews(walletAddress) {
    return new Promise((resolve, reject) => {
        netSepioContract.balanceOf(walletAddress).then((result) => {
            resolve(result);
        });
    });
}

function createReviewOnBlockchain(domainName, websiteURL, websiteType, websiteTag, websiteSafety, metadataHash) {
    return new Promise((resolve, reject) => {
        netSepioContract.createReview(domainName, websiteURL, websiteType, websiteTag, websiteSafety, metadataHash).then((result) => {
            resolve(result.hash);
        });
    });
}

// https://polygon-mumbai.g.alchemy.com/v2/BhfDGgKfFJch5QtGJ8L9HVfuFmv3LjsG