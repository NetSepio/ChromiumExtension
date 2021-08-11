document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('selectLanguageAndContinue').addEventListener('click',
        function() {
            let language = $('#languageSelection').val();
            chrome.storage.sync.set({ languageSelected: language }, function() {
                console.log('Language is set to: ' + language);
            });
            window.location.href = 'wallet.html';
        }, false);
});

$(document).ready(function() {
    (function() {
        $.getJSON(chrome.extension.getURL('../dataset/localization-codes.json'), function(localizationCodes) {
            //..
            console.table(localizationCodes);
            
            var languageSelection = document.getElementById("languageSelection");
           
            //Add the Options to the languageSelection DropDownList
            for (var i = 0; i < localizationCodes.length; i++) {
                var option = document.createElement("OPTION");
                //Set Language Name in Text part.
                option.innerHTML = localizationCodes[i].name;
                //Set Language Code in Value part.
                option.value = localizationCodes[i].code;
                //Add the Option element to DropDownList
                languageSelection.options.add(option);
            }
        });
    }());
});