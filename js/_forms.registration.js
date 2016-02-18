UI.registration = function() {
  var $form = $('#registration');
  var $name = $('#registration-name');
  var $email = $('#registration-email');
  var $pwd = $('#registration-pwd');
  
  $name.validator({
    messages: {
      valueMissing: 'We really need your name, mate',
      tooShort: 'The name is too short, bro (at least %N% characters)'
    }
  });
  
  $email.validator({
    messages: {
      valueMissing: 'What if it is an emergency?',
      typeMismatch: 'It doesn\'t look like a valid email'
    }
  });
  
  $pwd.validator();
  
  $form.on('submit', function(e) {
    // call force validation
    $name.validator('forceValidation');
    $email.validator('forceValidation');
    $pwd.validator('forceValidation');
    
    e.preventDefault();
    
    if ($form[0].checkValidity() === false) {
      return false;
    } else {
      UI.core.model.applicationState = 'list';
      UI.core.viewBuilder();
    }
  });
};