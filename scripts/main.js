function getDomainName(tabURL) {
  var tabURL = new URL(tabURL);
  return tabURL.hostname;
}

// App Start
chrome.tabs.query({
  currentWindow: true,
  active: true
}, function (tabs) {

  // Get Domain
  currentDomain = getDomainName(tabs[0].url);

  // Check Tab
  if ('newtab' == currentDomain) {
    $("#domain").val('Open Website First');
    console.log('New Tab Detected!');
    return;
  } else {
    console.log('Currently Viewing: ' + currentDomain);
  }
});