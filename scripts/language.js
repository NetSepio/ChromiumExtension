$('#selectLanguageAndContinue').on('click', function(){
  let language = $('#language-select').val();

  chrome.storage.local.set({ languageSelected: language }, function() {
    console.log('Language is set to: ' + language);

    window.location.href = '/html/wallet.html';
  });
});