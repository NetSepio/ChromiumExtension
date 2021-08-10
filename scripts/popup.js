// Add event listeners once the DOM has fully loaded by listening for the
// `DOMContentLoaded` event on the document, and adding your listeners to
// specific elements when it triggers.  style="min-width: 320px; min-height: 600px;"
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('welcomePage').addEventListener('click',
        function() {
            window.location.href = "welcome.html";
        }, false);
});

function getDomainName(tabURL) {
    var tabURL = new URL(tabURL);
    console.table(tabURL);
    return tabURL.hostname;
}

// App Start
chrome.tabs.query({
    currentWindow: true,
    active: true
}, function(tabs) {
    // Get Domain
    let currentDomain = getDomainName(tabs[0].url);
    console.table(currentDomain);

    // Preview Current Domain
    if ('newtab' == currentDomain) {
        console.table('Open Website First');
        return;
    }
});