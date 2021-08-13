// Add event listeners once the DOM has fully loaded by listening for the
// `DOMContentLoaded` event on the document, and adding your listeners to
// specific elements when it triggers.
document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('submitReview').addEventListener('click', submitReview, false);
    document.getElementById('cancelReview').addEventListener('click', cancelReview, false);
});

let domainName;

function cancelReview() {
    window.location.href = 'dashboard.html';
}

async function submitReview() {
    // Get the Form Data
    let formData = $("form").serializeArray();
    console.log(formData);

    let reviewObj = {};
    $(formData).each(function(i, field){
        reviewObj[field.name] = field.value;
    });
    reviewObj.domainName = domainName;
    console.table(reviewObj);

    // Hardcoding till I find a way to integrate HHTP API
    let ceramicStreamID = "ceramic://kjzl6cwe1jw1470ue9ikdja9jcvaqk1n1gi250kb61c30h2pgq8803rbxjtiu9f"; //await createReviewOnCeramic(reviewObj);
    console.log(ceramicStreamID);

    let transactionHash = await createReviewOnBlockchain(reviewObj.domainName, reviewObj.websiteURL, reviewObj.websiteType, reviewObj.websiteTag, reviewObj.websiteSafety, ceramicStreamID);
    console.log(transactionHash);
    $('#txHash').text("Review Submission Successful!");
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 20000);
}

function createReviewOnCeramic(reviewObj) {
    return new Promise(resolve => {
        $.ajax({
            type: 'POST',
            url: 'http://localhost:7007/api/v0/streams',
            data: JSON.stringify(reviewObj),
            contentType: "application/json",
            dataType: 'json',
            success: function(responseData) {
                console.log('streamID: ' + responseData);
                resolve(responseData);
            },
            error: function(error) {
                resolve(error);
            }
        });
    });
}

function getDomainName(tabURL) {
    var tabURL = new URL(tabURL);
    // console.table(tabURL);
    return tabURL.hostname;
}

$("#reviewForm").submit(function(e){
    e.preventDefault();
});

// App Start
chrome.tabs.query({
    currentWindow: true,
    active: true
}, function (tabs) {
    // Get URL
    let currentURL = tabs[0].url;

    // Get Domain
    let currentDomain = getDomainName(currentURL);
    domainName = currentDomain;
    
    // New Tab Detected
    if ('newtab' == currentDomain) {
        $("#domain").val('Open Website First');
        return;
    } else {
        $('#websiteURL').val(currentURL);
        $('#domainName').text(currentDomain);
    }
});