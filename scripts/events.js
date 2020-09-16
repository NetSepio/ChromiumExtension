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