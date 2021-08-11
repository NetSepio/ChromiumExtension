// Add event listeners once the DOM has fully loaded by listening for the
// `DOMContentLoaded` event on the document, and adding your listeners to
// specific elements when it triggers.  style="min-width: 320px; min-height: 600px;"
document.addEventListener('DOMContentLoaded', function() {
    // document.getElementById('welcomePage').addEventListener('click',
    //     function() {
    //         window.location.href = "welcome.html";
    //     }, false);
    setTimeout(() => {
        preLoadingCheck();
    }, 1000);
});

function getDomainName(tabURL) {
    var tabURL = new URL(tabURL);
    console.table(tabURL);
    return tabURL.hostname;
}

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
  
  function getUserRole() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['enrolmentStatus'], (result) => {
            resolve(result.enrolmentStatus);
        });
    });
  }
  
  async function preLoadingCheck() {
    var languageSelected = await getLanguageSelected();
    var walletAddress = await getWalletAddress();
    var userRole = await getUserRole();
  
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

// App Start
chrome.tabs.query({
    currentWindow: true,
    active: true
}, function(tabs) {
    // Get Domain
    let currentDomain = getDomainName(tabs[0].url);
    console.table(currentDomain);

    // Preview Current Domain
    if ('newtab' == currentDomain) {
        console.table('Open Website First');
    }
});