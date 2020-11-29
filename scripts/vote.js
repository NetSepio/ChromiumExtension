function getDomainName(tabURL){
  var tabURL = new URL(tabURL);
  return tabURL.hostname;
}


$("#votingForm").submit(function(e){

  e.preventDefault();
});

// App Start
chrome.tabs.query({
  currentWindow: true,
  active: true
}, function (tabs) {
  // Get URL
  var currentURL = tabs[0].url;
  // Get Domain
  var currentDomain = getDomainName(currentURL);

  // New Tab Detected
  if ('newtab' == currentDomain) {
    $("#domain").val('Open Website First');
    return;
  } else {
    $('#voteURL').val(currentURL);
    $('#voteDomain').text(currentDomain);
  }
});