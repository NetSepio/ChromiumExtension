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

function refreshDomainStatus(){
  safe = parseInt($('#safe-count').text());
  notSafe = parseInt($('#not-safe-count').text());

  if(safe >= notSafe) {
    markDomainSafe();
  }
  else {
    markDomainNotSafe();
  }
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
    refreshDomainStatus();

    if('safe' == type) {
      incrementSafeCount();
    } else {
      resetAppUI();
      incrementNotSafeCount();
    }

    refreshDomainStatus();
  });
}

