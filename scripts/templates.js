function loadAppTemplate(domainName = null){
  $('#voting-content').html('<section id="security-status"> <div class="container"> <div class="bg-orb"></div><div class="display-icon icon-safe"> <span id="safety-icon" class="icon icon-check-mark"></span> </div><div id="status" class="status-message"> <h1 id="net-guard-title">You Are Safe</h1> </div><div class="floating-bar"> <div> <input id="domain" readonly/> <div class="loader"> <span class="dot-loader"></span> <span class="dot-loader dot-loader--2"></span> <span class="dot-loader dot-loader--3"></span> </div></div></div></div></section> <section id="error-selection" style="height: 0;"> <div class="container"> <table id="back-error-section" class="mx-auto back-button"> <tr> <td> <span class="icon icon-back"></span> </td><td> <span>Back</span> </td></tr></table> <div class="mt-20"> <button id="cta-spam" class="btn bg-danger w-100 mb-10">Spam (or) Fake</button> <button id="cta-adv" class="btn bg-danger w-100 mb-10">Advertisement</button> <button id="cta-spyware" class="btn bg-danger w-100 mb-10">Spyware</button> <button id="cta-malware" class="btn bg-danger w-100 mb-10">Virus (or) Malware</button> </div></div></section> <section id="user-interaction" class="padding-bottom"> <div class="container"> <button id="cta-safe" class="btn bg-safe w-100 mb-10"><span class="icon icon-thumb-up"></span> Safe <span id="safe-count" class="badge">0</span></button> <button id="danger" class="btn bg-danger w-100"><span class="icon icon-thumb-down"></span> Not Safe <span id="not-safe-count" class="badge">0</span></button> </div></section>');
}

function loadLoginTemplate(domainName){
  $('#login-content').html('<table class="w-100 h-100"><tr><td style="vertical-align:middle"><form class="mx-auto mt-20 mb-60" style="max-width:260px" id="login-form"><div class="form-group"><label class="block-label" for="email-input">Enter Email</label><input type="email" class="form-control" id="email-input" aria-describedby="email-help" required> <small id="email-help" class="form-text text-muted">Do not have the account? <a href="https://app.lazarus.network/register/" target="_blank">Create account</a></small></div><div class="form-group"><label class="block-label" for="password-input">Enter Password</label><input type="password" class="form-control" id="password-input" aria-describedby="password-help" required> <small id="password-help" class="form-text text-muted"><a href="https://app.lazarus.network/password-reset/" target="_blank">Forgot Password?</a></small></div><div class="form-group form-check"><input type="checkbox" class="form-check-input" id="exampleCheck1"><label class="form-check-label" for="exampleCheck1">I trust this browser</label></div><button type="submit" class="btn-submit">LOGIN</button></form></td></tr></table>');

  $('#login-form').on('submit', function(event){
    event.preventDefault();
  
    let email = $('#email-input').val();
    let password = $('#password-input').val();
    
    authenticateAndStartApp(domainName, email, password);
  
    return false;
  });
}