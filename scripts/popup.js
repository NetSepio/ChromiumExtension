function getLanguageSelected() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['languageSelected'], (result) => {
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

function preLoadingCheck() {
  // Get language selected
  getLanguageSelected().then(language => {
    if(undefined === language){
      // Redirect to language html page
      window.location.href = '/html/language.html';
    } else {
      // Get wallet address
      getWalletAddress().then(wallet => {
        if (undefined === wallet){
          // Redirect to wallet html page
          window.location.href = '/html/wallet.html';
        } else {
          // Load app
          window.location.href = '/html/main.html';
        }
      });
    }
  });
}

// App Start
chrome.tabs.query({
  currentWindow: true,
  active: true
}, function (tabs) {
  setTimeout(() => {
    preLoadingCheck();
  }, 2000);
});