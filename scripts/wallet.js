function saveMnemonic(mnemonicWords){
  chrome.storage.sync.set({ mnemonic: mnemonicWords });
}

function linkWalletAndContinue(walletAddressFetched){
  chrome.storage.sync.set({ walletAddress: walletAddressFetched }, function() {
    window.location.href = '/html/enrollment.html';
  });
}

async function linkWallet(){
  try {
    let mnemonic = $("#mnemonic").val();
    let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
    let walletAddress = await mnemonicWallet.getAddress();

    $('#walletAddressFetched').html('Ethereum Wallet Address: ' + walletAddress).css('display', 'block');

    $('#selectAndContinue').css('display', '').on('click', function(){
      saveMnemonic(mnemonic);
      linkWalletAndContinue(walletAddress);
    });
  } catch {
    $("#walletAddress").text("Invalid Mnemonic. Enter Correct Seed Words separated by Space!");
  }
}

$('#getWalletAddress').on('click', function(){
  linkWallet();
});

// drink bullet vague flee choose plate spot wrong unit fault hover organ