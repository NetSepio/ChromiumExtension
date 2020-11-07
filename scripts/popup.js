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
    return tabURL.hostname;
}

function getDomainStatus(domainName) {
    $.ajax({
        type: "GET",
        url: "https://netguardapi.herokuapp.com/api/getNetGuard/",
        data: {
            'domain': domainName
        }
    }).done(function(response) {
        console.log(response);
    }).fail(function() {
        console.log("Failure");
    });
}

function startApp(domainName) {
    console.table("Starting NetSepio App");
}

// App Start
chrome.tabs.query({
    currentWindow: true,
    active: true
}, function(tabs) {
    // Get Domain
    let currentDomain = getDomainName(tabs[0].url);
    // Cookies.set('currentDomain', currentDomain, { expires: 365 });
    getDomainStatus(currentDomain);

    // Preview Current Domain
    if ('newtab' == currentDomain) {
        console.table('Open Website First');
        return;
    }
});