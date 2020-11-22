async function linkWallet(){
  try {
    let mnemonic = $("#mnemonic").val();
    let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
    let walletAddress = await mnemonicWallet.getAddress();

    $('#walletAddressFetched').html('Ethereum Wallet Address: ' + walletAddress).css('display', 'block');

    
  } catch {
    $("#walletAddress").text("Invalid Mnemonic. Enter Correct Seed Words separated by Space!");
  }
}

$('#getWalletAddress').on('click', function(){
  linkWallet();
});

// drink bullet vague flee choose plate spot wrong unit fault hover organ