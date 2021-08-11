// Add event listeners once the DOM has fully loaded by listening for the
// `DOMContentLoaded` event on the document, and adding your listeners to
// specific elements when it triggers.
document.addEventListener('DOMContentLoaded', function() {
    toggleTabs();
    document.getElementById('tab1').addEventListener('click', toggleTabs, false);
    document.getElementById('tab2').addEventListener('click', toggleTabs, false);
    document.getElementById('createWallet').addEventListener('click', createWallet, false);
    document.getElementById('continueWalletCreation').addEventListener('click', saveWallet, false);
    document.getElementById('importWallet').addEventListener('click', importWallet, false);
    document.getElementById('continueWalletImport').addEventListener('click', saveWallet, false);
});

function toggleTabs() {
    if($('#tab1').is(':checked')) {
        $("#tabcontent1").show();
        $("#tabcontent2").hide();
    }
    else if($('#tab2').is(':checked')) {
        $("#tabcontent1").hide();
        $("#tabcontent2").show();
    }
}

function refreshWallet() {
    chrome.storage.local.get(['mnemonic'], function(result) {
        if (undefined !== result) {
            console.log('Mnemonic currently is: ' + result.mnemonic);
            $("#importedMnemonic").val(result.mnemonic);
        }
    });
    chrome.storage.local.get(['walletAddress'], function(result) {
        if (undefined !== result) {
            console.log('Wallet Address currently is: ' + result.walletAddress);
            $("#importedWalletAddress").text(result.walletAddress);
        }
    });
}

async function createWallet() {
    // let mnemonic = ethers.HDNode.entropyToMnemonic(ethers.utils.randomBytes(24));
    try {
        let mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
        console.table(mnemonic);
        let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
        let walletAddress = await mnemonicWallet.getAddress();
        console.log(walletAddress + " " + mnemonicWallet.privateKey);
        $("#createdMnemonic").text(mnemonic);
        $("#createdWalletAddress").text(walletAddress);

        $("#mnemonicGenerated").show();
        $("#walletAddressGenerated").show();
        $("#continueWalletCreation").show();

        // Save Wallet Details
        chrome.storage.local.set({ walletAddress: walletAddress }, function() {
            console.log('WalletAddress is set to: ' + walletAddress);
        });
    
        chrome.storage.local.set({ mnemonic: mnemonic }, function() {
            console.log('Mnemonic is set to: ' + mnemonic);
        });
    } catch (error) {
        $("#createdMnemonic").text("An Error has occured while generating Mnemonic. Try Import Wallet Instead!");
    }
}

async function importWallet() {
    //let mnemonic = "ring behave casino cloth paper wrist century prize goose convince comfort noble file apart deny census brass bird universe combine dizzy nephew dose stage";
    try {
        let mnemonic = $("#importedMnemonic").val();
        let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
        let walletAddress = await mnemonicWallet.getAddress();
        console.log(walletAddress + " " + mnemonicWallet.privateKey);
        $("#importedWalletAddress").text(walletAddress);

        $("#walletAddressDerived").show();
        $("#continueWalletImport").show();

        // Save Wallet Details
        chrome.storage.local.set({ walletAddress: walletAddress }, function() {
            console.log('WalletAddress is set to: ' + walletAddress);
        });
    
        chrome.storage.local.set({ mnemonic: mnemonic }, function() {
            console.log('Mnemonic is set to: ' + mnemonic);
        });
    } catch {
        $("#importedWalletAddress").text("Invalid Mnemonic. Check for Additional Space!");
    }
}

async function saveWallet() {
    chrome.storage.local.get(['walletAddress'], function(result) {
        console.log('Wallet Address currently is: ' + result.walletAddress);
    });

    chrome.storage.local.get(['mnemonic'], function(result) {
        console.log('Mnemonic currently is: ' + result.mnemonic);
    });

    // window.location.href = "dashboard.html";function() {window.location.href = "dashboard.html";}
}