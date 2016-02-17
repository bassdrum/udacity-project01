UI.core = {};

UI.core.model = {
  applicationState: 'createEvent'
};

UI.core.init = function() {
  UI.core.viewBuilder();
};

UI.core.viewBuilder = function() {
  var $registration = $('.registration');
  var $createEvent  = $('.createEvent');
  var $list         = $('.eventsList');
  var $dim          = $('.dim');
  var $spinner      = $('.spinner_global');
  var $body         = $('body');
  
  // login state
  if (UI.core.model.applicationState == 'registration') {
    showSpinner();
    
    setTimeout(function(){
      hideAll();
      hideSpinner();
      $registration.removeClass('hidden');
    }, 1000);
  }
  
  // events list state
  if (UI.core.model.applicationState == 'createEvent') {
    showSpinner();
    
    setTimeout(function(){
      hideAll();
      hideSpinner();
      $createEvent.removeClass('hidden');
    }, 1000);
  }
  
  // events list state
  if (UI.core.model.applicationState == 'list') {
    showSpinner();
    
    setTimeout(function(){
      hideAll();
      hideSpinner();
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
  
  function hideAll() {
    $registration .addClass('hidden');
    $createEvent  .addClass('hidden');
    $list         .addClass('hidden');
  }
};