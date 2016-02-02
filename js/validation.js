+function ($, window, document, undefined) {

  $('#regName').validate({
    messages: {
      valueMissing: 'We really need your name, mate',
      tooShort: 'The name is too short, bro (at least NNN characters)'
    }
  });
  
  $('#regEmail').validate({
    messages: {
      valueMissing: 'What if it is an emergency?',
      typeMismatch: 'It doesn\'t look like a valid email'
    }
  });
  
  $('#regPwd').validate();
  
}( jQuery, window, document );