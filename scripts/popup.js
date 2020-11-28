function getLanguageSelected() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['languageSelected'], (result) => {
      resolve(result.languageSelected);
    });
  });
}

function getWalletAddress() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['walletAddress'], (result) => {
      resolve(result.walletAddress);
    });
  });
}

function getEnrolmentStatus() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['enrolmentStatus'], (result) => {
      resolve(result.enrolmentStatus);
    });
  });
}

async function preLoadingCheck() {
  var language = await getLanguageSelected();
  var wallet = await getWalletAddress();
  var enrollment = await getEnrolmentStatus();

  if(undefined === language){
    window.location.href = '/html/language.html';
  }

  else if(undefined === wallet){
    window.location.href = '/html/wallet.html';
  }

  else if('active' != enrollment){
    window.location.href = '/html/enrollment.html';
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