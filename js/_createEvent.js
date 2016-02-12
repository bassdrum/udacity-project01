UI.createEvent = {};

UI.createEvent.when = function() {
  var $startRow       = $('#createEvent-start');
  var $startTrigger   = $('#createEvent-start-trigger');
  var $startDate      = $('#createEvent-start-date-group');
  var $startTime      = $('#createEvent-start-time');
  
  var $endRow         = $('#createEvent-end');
  var $endTrigger     = $('#createEvent-end-trigger');
  var $endDate        = $('#createEvent-end-date-group');
  var $endTime        = $('#createEvent-end-time');

  var d       = new Date();
  var d_start = new Date( d.getFullYear(), d.getMonth(), d.getDate(), d.getHours() + 1 );
  var d_end   = update_d_end();
  
  initPickers();
  
  $startDate.on('changeDate', function(e) {
    d_start = update_d_start();
    d_end = update_d_end();
    updateEndPickers();
  });
  
  $startTime.timepicker().on('changeTime.timepicker blur', function() {
    if ( parseTime( $startTime.val() ).hours === undefined || parseTime( $startTime.val() ).minutes === undefined ) {
      $startTime.timepicker('setTime', d_start.getHours() + ':00');
    }
    
    d_start = update_d_start();
    d_end = update_d_end();
    updateEndPickers();
  });
  
  $startTrigger.on('click', function() {
    $endRow.removeClass('hidden');
    $startTrigger.addClass('hidden');
  });
  
  $endTrigger.on('click', function() {
    $endRow.addClass('hidden');
    $startTrigger.removeClass('hidden');
  });
  
  function initPickers() {
    $startDate.datepicker({
      autoclose: true,
      startDate: d_start
    });
    
    $startTime.timepicker({
      template: false,
      showInputs: false,
      minuteStep: 5,
      showMeridian: false
    });
    
    $endDate.datepicker({
      autoclose: true,
      startDate: d_end
    });
    
    $endTime.timepicker({
      template: false,
      showInputs: false,
      minuteStep: 5,
      showMeridian: false
    });
    
    // set proper start date and time
    // it is fecking weird, but if you just pass a standard date object to the plugin, 
    // it doesn't highlighting the active date until user clicks it
    $startDate.datepicker( 'setDate', (d_start.getMonth() + 1) + '-' + d_start.getDate() + '-' + d_start.getFullYear() );
    $startTime.timepicker('setTime', d_start.getHours() + ':00');
    
    // set proper end date and time
    $endDate.datepicker( 'setDate', (d_end.getMonth() + 1) + '-' + d_end.getDate() + '-' + d_end.getFullYear() );
    $endTime.timepicker('setTime', d_end.getHours() + ':00');
    
    // fixing weird issue with timepicker's input-group-addon
    $startTime.siblings('.input-group-addon').off('click');
    $endTime.siblings('.input-group-addon').off('click');
  }
  
  function updateEndPickers() {
    $endDate.datepicker('setStartDate', d_end);
    
    $endDate.datepicker( 'setDate', (d_end.getMonth() + 1) + '-' + d_end.getDate() + '-' + d_end.getFullYear() );
    $endTime.timepicker( 'setTime', d_end.getHours() + ':' + d_end.getMinutes() );
  }
  
  function update_d_start() {
    var currentStartTime  = parseTime( $startTime.val() );
    var d                 = $startDate.datepicker('getDate');
    
    return new Date( d.getFullYear(), d.getMonth(), d.getDate(), currentStartTime.hours, currentStartTime.minutes );
  }
  
  function update_d_end() {
    return new Date( d_start.getFullYear(), d_start.getMonth(), d_start.getDate(), d_start.getHours() + 3, d_start.getMinutes() );
  }
  
  function parseTime(time) {
    var arr = time.split(':');
    
    return {
      hours: arr[0] || undefined,
      minutes: arr[1]  || undefined
    }
  }
}

UI.createEvent.guests = function() {
  
}

/*
 function() {
  var $form = $('#createEvent');
  var $geo = $('#createEvent-geo');
  
  
  // для валидации сложных парных полей, использовать флаги
  // давая понять плагину либо например что нужно использовать особую логику
  // или указывать плагину, где живет контейнер ошибок и особую логику для вывода сообщений (сумму валидации двух полей)
  // 
  
  
  



  function geoLocation() {
    var $input = $geo.find('input');
    var $pin = $geo.find('.step-geoLocation-icon');
  }
  
  geoLocation();
}
*/