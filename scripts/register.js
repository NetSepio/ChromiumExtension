const provider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/aaa5b73d99b14f62933ad5e398a2ac97");
const nsTokenContract = new ethers.Contract(NSTokenContractAddress, NSTokenContractABI, provider);
const netsepioContract = new ethers.Contract(NetSepioContractAddress, NetSepioContractABI, provider);
let walletAddress;

$(function() {
    initDApp();
    document.getElementById('registerToVote').addEventListener('click', votingRegistration, false);
});

async function initDApp() {
    let currentBlock = await provider.getBlockNumber();
    console.log(currentBlock);
    walletAddress = await getWalletAddress();
    $("#walletAddress").text(walletAddress);
    let ethBalance = await provider.getBalance(walletAddress);
    let walletETHBalance = ethers.utils.formatEther(ethBalance);
    $("#walletBalance").text(walletETHBalance);
    console.log(await nsTokenContract.name() + " " + await nsTokenContract.symbol() + " " + ethers.utils.formatUnits(await nsTokenContract.balanceOf(walletAddress), 18));
}

function getWalletAddress() {
    return new Promise(resolve => {
        chrome.storage.local.get(['walletAddress'], (result) => {
            if (undefined !== result) {
                resolve(result.walletAddress);
            } else {
                resolve(undefined);
            }
        });
    });
}

function getWalletMnemonic() {
    return new Promise(resolve => {
        chrome.storage.local.get(['mnemonic'], (result) => {
            if (undefined !== result) {
                resolve(result.mnemonic);
            } else {
                resolve(undefined);
            }
        });
    });
}

async function votingRegistration() {
    let txRegister = await netsepioContract.populateTransaction.register();
    let mnemonic = await getWalletMnemonic();
    let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
    let signedTX = await mnemonicWallet.signTransaction(txRegister);
    nsWallet = mnemonicWallet.connect(provider);
    console.log(await nsWallet.getBalance());
    console.log(await nsWallet.getTransactionCount());
    let txReceipt = await nsWallet.sendTransaction(txRegister);
    console.log(txReceipt);
    $("#registerTXRecepit").text(txReceipt);
}