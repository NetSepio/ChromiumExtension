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
  }).done(function (response) {
    console.log(response);

    $('.loader').animate({
      opacity: 0
    }, 500, function () {
      $("#domain").val(currentDomain);
      processDomainStatus(response);
    });
  }).fail(function () {
    $('.loader').animate({
      opacity: 0
    }, 500, function () {
      $("#domain").val('Error Occurred. Please Reload!');
    });
  });
}

function startApp(domainName){
  $('#login-content').html('');

  loadAppTemplate();

  getDomainStatus(domainName);
}

// App Start
chrome.tabs.query({
  currentWindow: true,
  active: true
}, function (tabs) {
  // Get Domain
  currentDomain = getDomainName(tabs[0].url);

  // Preview Current Domain
  if ('newtab' == currentDomain) {
    $("#domain").val('Open Website First');
    return;
  }

  setTimeout(() => {
    // getDomainStatus(currentDomain);

    loadApplication(currentDomain);
  }, 500);
});