// Add event listeners once the DOM has fully loaded by listening for the
// `DOMContentLoaded` event on the document, and adding your listeners to
// specific elements when it triggers.
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('createWallet').addEventListener('click', createWallet, false);
    document.getElementById('importWallet').addEventListener('click', importWallet, false);
    refreshWallet();
});

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

async function importWallet() {
    //let mnemonic = "ring behave casino cloth paper wrist century prize goose convince comfort noble file apart deny census brass bird universe combine dizzy nephew dose stage";
    try {
        let mnemonic = $("#importedMnemonic").val();
        let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
        let walletAddress = await mnemonicWallet.getAddress();
        console.log(walletAddress + " " + mnemonicWallet.privateKey);
        $("#importedWalletAddress").text(walletAddress);

        chrome.storage.local.set({ walletAddress: walletAddress }, function() {
            console.log('WalletAddress is set to: ' + walletAddress);
        });

        chrome.storage.local.set({ mnemonic: mnemonic }, function() {
            console.log('Mnemonic is set to: ' + mnemonic);
        });

        chrome.storage.local.get(['walletAddress'], function(result) {
            console.log('Wallet Address currently is: ' + result.walletAddress);
        });

        chrome.storage.local.get(['mnemonic'], function(result) {
            console.log('Mnemonic currently is: ' + result.mnemonic);
        });

        refreshWallet();
    } catch {
        $("#importedWalletAddress").text("Invalid Mnemonic. Enter Correct Seed Words separated by Space!");
    }
}

async function createWallet() {
    // let mnemonic = ethers.HDNode.entropyToMnemonic(ethers.utils.randomBytes(24));
    let mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
    console.table(mnemonic);
    $("#createdMnemonic").text(mnemonic);
    let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
    let walletAddress = await mnemonicWallet.getAddress();
    console.log(walletAddress + " " + mnemonicWallet.privateKey);
    $("#createdWalletAddress").text(walletAddress);

    chrome.storage.local.set({ walletAddress: walletAddress }, function() {
        console.log('WalletAddress is set to: ' + walletAddress);
    });

    chrome.storage.local.set({ mnemonic: mnemonic }, function() {
        console.log('Mnemonic is set to: ' + mnemonic);
    });

    chrome.storage.local.get(['walletAddress'], function(result) {
        console.log('Wallet Address currently is: ' + result.walletAddress);
    });

    chrome.storage.local.get(['mnemonic'], function(result) {
        console.log('Mnemonic currently is: ' + result.mnemonic);
    });
    refreshWallet();
    //window.location.href = "register.html";
}