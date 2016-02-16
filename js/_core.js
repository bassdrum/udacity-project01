UI.core = {};

UI.core.applicationState = 'login';

UI.core.init = function() {
  UI.core.viewBuilder();
  // у меня всего три простых шага
  // 1. спиннер > логин
  // 2. спиннер > список ивентов
  // 3. спиннер > форма создания ивента
};

UI.core.viewBuilder = function() {
  var $registration = $('.registration');
  var $createEvent  = $('.createEvent');
  var $list         = $('.eventsList');
  var $dim          = $('.dim');
  var $spinner      = $('.spinner_global');
  var $body         = $('body');
  
  // login state
  if (UI.core.applicationState == 'login') {
    showSpinner();
    
    setTimeout(function(){
      hideSpinner();
      $registration.removeClass('hidden');
    }, 1000);
  }
  
  // events list state
  if (UI.core.applicationState == 'list') {
    showSpinner();
    
    setTimeout(function(){
      hideSpinner();
      $registration.addClass('hidden');
      $list.removeClass('hidden');
    }, 1000);
  }
  
  function showSpinner() {
    $body.addClass('modal-open');
    $dim.removeClass('hidden');
    $spinner.removeClass('hidden');
  }
  
  function hideSpinner() {
    $body.removeClass('modal-open');
    $dim.addClass('hidden');
    $spinner.addClass('hidden');
  }
};