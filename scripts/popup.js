function getDomainName(tabURL){
	var tabURL = new URL(tabURL);
	return tabURL.hostname;
}

function markDomainSafe(){
  $('#net-guard-title').text('You Are Safe');
  $('.bg-orb').removeClass('not-safe');
  $('#safety-icon').removeClass('icon-exclamation').addClass('icon-check-mark');
}

function markDomainNotSafe(){
  $('#net-guard-title').text('Not Safe');
  $('.bg-orb').addClass('not-safe');
  $('#safety-icon').removeClass('icon-check-mark').addClass('icon-exclamation');
}

function refreshDomainStatus(response){
  safe = parseInt($('#safe-count').text());
  notSafe = parseInt($('#not-safe-count').text());

  if(safe >= notSafe) {
    markDomainSafe();
  }
  else {
    markDomainNotSafe();
  }
}

function processDomainStatus(response){
  safe = parseInt(response["safe"]);
  spam = parseInt(response["spam"]);
  adv = parseInt(response["adv"]);
  spyware = parseInt(response["spyware"]);
  malware = parseInt(response["malware"]);

  notSafe = spam + adv + spyware + malware;

  $('#safe-count').text(safe);
  $('#not-safe-count').text(notSafe);

  if(safe >= notSafe) {
    markDomainSafe();
  }
  else {
    markDomainNotSafe();
  }
}

function refreshApp(domainName){
  $.ajax({
    type: "GET",
    url: "https://netguardapi.herokuapp.com/api/getNetGuard/",
    data: {
      'domain': domainName
    }
  }).done(function(response){
    console.log(response);
  });
}

function voteForThisDomain(type){
  domainName = $("#domain").val();
  $.ajax({
    type: "POST",
    url: "https://netguardapi.herokuapp.com/api/createNetGuard/",
    data: JSON.stringify({
      'domain': domainName,
      'content': type
    }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
  }).done(function(response){
    refreshApp(domainName);

    if('safe' == type) {
      incrementSafeCount();
    } else {
      resetAppUI();
      incrementNotSafeCount();
    }

    refreshDomainStatus();
  });
}

function loadApp(domainName){
  $.ajax({
    type: "GET",
    url: "https://netguardapi.herokuapp.com/api/getNetGuard/",
    data: {
      'domain': domainName
    }
  }).done(function(response){
    console.log(response);

    $('.loader').animate({
      opacity: 0
    }, 500, function(){
      $("#domain").val(currentDomain);
      processDomainStatus(response);
    });
  }).fail(function(){
    $('.loader').animate({
      opacity: 0
    }, 500, function(){
      $("#domain").val('Error Occurred. Please Reload!');
    });
  });
}

chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
  // Get Domain
  currentDomain = getDomainName(tabs[0].url);

  // Preview Current Domain
  if('newtab' == currentDomain){
    $("#domain").val('Open Website First');
    return;
  }

  setTimeout(() => {
    loadApp(currentDomain);  
  }, 500);
});

$("#danger").click(function(){
	$('#security-status, #user-interaction').animate({
    height: 0
  }, 300);

  $('#error-selection').animate({
    height: 260
  }, 300, function(){

  });
});

$('#back-error-section').click(function(){
  resetAppUI();
});

function resetAppUI(){
  $('#security-status').animate({
    height: 290
  }, 300);
  $('#user-interaction').animate({
    height: 120
  }, 300);
  $('#error-selection').animate({
    height: 0
  }, 300);
}

function incrementSafeCount(){
  safeCount = $('#safe-count').text();
  safeCount = parseInt(safeCount) + 1;
  $('#safe-count').text(safeCount);
  console.log('Marked as safe');
}

function incrementNotSafeCount(){
  notSafeCount = $('#not-safe-count').text();
  notSafeCount = parseInt(notSafeCount) + 1;
  $('#not-safe-count').text(notSafeCount);
  console.log('Marked as not safe');
}

$('#cta-safe').click(function(){
  voteForThisDomain('safe');
});

$('#cta-spam').click(function(){
  voteForThisDomain('spam');
});

$('#cta-adv').click(function(){
  voteForThisDomain('adv');
});

$('#cta-spyware').click(function(){
  voteForThisDomain('spyware');
});

$('#cta-malware').click(function(){
  voteForThisDomain('malware');
});