const provider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/aaa5b73d99b14f62933ad5e398a2ac97");
const nsTokenContract = new ethers.Contract(NSTokenContractAddress, NSTokenContractABI, provider);
const netsepioContract = new ethers.Contract(NetSepioContractAddress, NetSepioContractABI, provider);
let walletAddress;

function getWalletAddress() {
  return new Promise(resolve => {
      chrome.storage.sync.get(['walletAddress'], (result) => {
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
      chrome.storage.sync.get(['mnemonic'], (result) => {
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

  chrome.storage.sync.set({ enrolmentStatus: 'active' }, function() {
    window.location.href = '/html/main.html';
  });
}

async function initDApp() {
  let currentBlock = await provider.getBlockNumber();
  console.log(currentBlock);
  walletAddress = await getWalletAddress();
  $("#walletAddress").text(walletAddress);
  let ethBalance = await provider.getBalance(walletAddress);
  let walletETHBalance = ethers.utils.formatEther(ethBalance);
  $("#walletBalance").text(walletETHBalance);
  console.log(await nsTokenContract.name() + " " + await nsTokenContract.symbol() + " " + ethers.utils.formatUnits(await nsTokenContract.balanceOf(walletAddress), 18));

  $('#enrollForVoting').on('click', function(){
    votingRegistration();
  });
}

initDApp();

$('#skipEnrollment').on('click', function(){
  window.location.href = '/html/main.html';
});