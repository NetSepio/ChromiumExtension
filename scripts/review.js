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

    // Ceramic HTTP API
    let ceramicReviewObj = {
        "type": 0,
        "genesis": {
            "header": {
                "family": "NetSepioReview",
                "schema": "k1dpgaqe3i64kjpozl8oajejq83dlslcfhwmqs7526g64kjidvu136aplq2sqdx2wpglzxq1b5dg87bnnxmw3nzlbhdfup0z2rn3fl0yv02g2k8g7ry38g9da"
            },
            "data": reviewObj
        }
    };
    let ceramicStreamID;
    try {
        ceramicStreamID = await createReviewOnCeramic(reviewObj); //"ceramic://kjzl6cwe1jw1470ue9ikdja9jcvaqk1n1gi250kb61c30h2pgq8803rbxjtiu9f"
        ceramicStreamID = "ceramic://" + ceramicStreamID;
    } catch (error) {
        console.log(error);
        ceramicStreamID = "ceramic://kjzl6cwe1jw1470ue9ikdja9jcvaqk1n1gi250kb61c30h2pgq8803rbxjtiu9f";
    }
    // console.log(JSON.stringify(reviewObj));
    // let ceramicStreamID = await createReviewOnCeramic(reviewObj); //"ceramic://kjzl6cwe1jw1470ue9ikdja9jcvaqk1n1gi250kb61c30h2pgq8803rbxjtiu9f"
    // console.log(ceramicStreamID);
    
    let transactionHash = await createReviewOnBlockchain(reviewObj.domainName, reviewObj.websiteURL, reviewObj.websiteType, reviewObj.websiteTag, reviewObj.websiteSafety, ceramicStreamID);
    console.log(transactionHash);
    $('#txHash').text("Review Submission Successful!");
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 5000);
}

function createReviewOnCeramic(ceramicReviewObj) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8081/api/v1.0/submitReview',
            data: JSON.stringify(ceramicReviewObj),
            contentType: "application/json",
            dataType: 'json',
            success: function(responseData) {
                console.log('streamID: ' + responseData);
                resolve(responseData);
            },
            error: function(error) {
                reject(error);
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