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

async function preLoadingCheck() {
  var language = await getLanguageSelected();
  var wallet = await getWalletAddress();

  if(undefined === language){
    window.location.href = '/html/language.html';
  }

  else if(undefined === wallet){
    window.location.href = '/html/wallet.html';
  }

  else {
    window.location.href = '/html/main.html';
  }
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