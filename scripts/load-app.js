function validateUserAndStartApp(domainName){
  var user_email = Cookies.get('email');
  var user_authToken = Cookies.get('authToken');

  if(undefined != user_email && undefined != user_authToken){
    $.ajax({
      type: "POST",
      url: "https://app.lazarus.network/api/v1/be/validate-session/",
      data: {
        'email': user_email,
        'auth-token': user_authToken
      }
    }).done(function(response){
      if('success' == response.result){
        startApp(domainName);
      } else {
        loadLoginTemplate(domainName);
        console.log(response);
      }
    }).fail(function () {
      loadLoginTemplate(domainName);
      console.log('API Request Failed!');
    });
  } else {
    loadLoginTemplate(domainName);
    console.log('Authentication Details Not Found!');
  }
}

function authenticateFirstTime(domainName, email, authToken){
  Cookies.set('email', email, { expires: 365 });
  Cookies.set('authToken', authToken, { expires: 365 });

  console.log(email);

  startApp(domainName);
}

function authenticateAndStartApp(domainName, email, password){
  $.ajax({
    type: "POST",
    url: "https://app.lazarus.network/api/v1/be/login/",
    data: {
      'email': email,
      'password': password
    }
  }).done(function(response){  
    if('success' == response.result){
      authenticateFirstTime(domainName, email, response.authToken);
    }
  });
}


function loadApplication(domainName){
  validateUserAndStartApp(domainName);
}