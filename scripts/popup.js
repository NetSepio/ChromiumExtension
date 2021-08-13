// Add event listeners once the DOM has fully loaded by listening for the
// `DOMContentLoaded` event on the document, and adding your listeners to
// specific elements when it triggers.  style="min-width: 320px; min-height: 600px;"
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        preLoadingCheck();
    }, 1000);
});

function getLanguageSelected() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['languageSelected'], (result) => {
            console.log(result.languageSelected);
            resolve(result.languageSelected);
        });
    });
}
  
function getWalletAddress() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['walletAddress'], (result) => {
            resolve(result.walletAddress);
        });
    });
}
  
async function preLoadingCheck() {
    var languageSelected = await getLanguageSelected();
    var walletAddress = await getWalletAddress();
  
    if(undefined === languageSelected){
        window.location.href = 'language.html';
    }
  
    else if(undefined === walletAddress){
        window.location.href = 'wallet.html';
    }

    else {
        window.location.href = 'dashboard.html';
    }
}