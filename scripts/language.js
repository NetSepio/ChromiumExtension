document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginPage').addEventListener('click',
        function() {
            window.location.href = "login.html";
        }, false);
});


$(document).ready(function() {
    (function() {
        $.getJSON(chrome.extension.getURL('../dataset/localization-codes.json'), function(localizationCodes) {
            //..
            console.table(localizationCodes);
        });
    }());
})