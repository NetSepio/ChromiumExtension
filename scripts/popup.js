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
  Cookies.set('currentDomain', currentDomain, { expires: 365 });

  // Preview Current Domain
  if ('newtab' == currentDomain) {
    $("#domain").val('Open Website First');
    return;
  }

  setTimeout(() => {
    loadApplication(currentDomain);
  }, 500);

  setTimeout(() => {
    $('.preloader').remove();
  }, 1000);
});