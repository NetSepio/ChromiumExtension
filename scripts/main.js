function getDomainName(tabURL){
  var tabURL = new URL(tabURL);
  return tabURL.hostname;
}

function getEnrollmentStatus(){
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['enrolmentStatus'], (result) => {
      resolve(result.enrolmentStatus);
    });
  });
}

async function loadVotingOptions(){
  var enrollmentStatus = await getEnrollmentStatus();

  if('active' == enrollmentStatus){
    $('##votingForm').css('display', '');
  } else {
    $('#enrollForVote').css('display', '');
  }
}

// App Start
chrome.tabs.query({
  currentWindow: true,
  active: true
}, function (tabs) {
  // Get Domain
  currentDomain = getDomainName(tabs[0].url);

  // Remove Loader
  $('.loader').animate({
    opacity: 0
  }, 500, function () {
    if ('newtab' == currentDomain) {
      $("#domain").val('Open Website First');
      return;
    } else {
      $("#domain").val(currentDomain);
      // processDomainStatus();
      loadVotingOptions();
    }
  });
});

$('#votingForm').on('click', function(){
  window.location.href = '/html/vote.html';
});