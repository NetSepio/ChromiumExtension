// Add event listeners once the DOM has fully loaded by listening for the
// `DOMContentLoaded` event on the document, and adding your listeners to
// specific elements when it triggers.
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('getWalletAddress').addEventListener('click', getWalletAddress);
    chrome.storage.local.get(['mnemonic'], function(result) {
        if (undefined !== result) {
            console.log('Mnemonic currently is: ' + result.mnemonic);
            $("#mnemonic").val(result.mnemonic);
        }
    });
    chrome.storage.local.get(['walletAddress'], function(result) {
        if (undefined !== result) {
            console.log('Wallet Address currently is: ' + result.walletAddress);
            $("#walletAddress").text(result.walletAddress);
        }
    });
});

async function getWalletAddress() {
    //let mnemonic = "ring behave casino cloth paper wrist century prize goose convince comfort noble file apart deny census brass bird universe combine dizzy nephew dose stage";
    try {
        let mnemonic = $("#mnemonic").val();
        let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
        let walletAddress = await mnemonicWallet.getAddress();
        console.log(walletAddress + " " + mnemonicWallet.privateKey);
        $("#walletAddress").text(walletAddress);

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
    } catch {
        $("#walletAddress").text("Invalid Mnemonic. Enter Correct Seed Words separated by Space!");
    }
}