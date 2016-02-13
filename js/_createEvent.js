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
  var d_end   = new Date();
  
  initPickers();
  
  $startDate.on('changeDate', function() {
    d_start = update_d_start();
    d_end = catch_up_d_end();
    updateEndPickers();
  });
  
  $startTime.timepicker().on('changeTime.timepicker blur', function() {
    if ( parseTime( $startTime.val() ).hours === undefined || parseTime( $startTime.val() ).minutes === undefined ) {
      $startTime.timepicker('setTime', d_start.getHours() + ':00');
    }
    
    d_start = update_d_start();
    d_end = catch_up_d_end();
    updateEndPickers();
  });
  
  $endDate.on('changeDate', function() {
    d_end = update_d_end();
  });
  
  $endTime.timepicker().on('changeTime.timepicker blur', function() {
    d_end = update_d_end();
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
    d_end = catch_up_d_end();
    
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
    console.log( 'd_start - ' + d_start );
    console.log( 'd_end - ' + d_end );
    console.log( d_end - d_start );
    
    $endDate.datepicker('setStartDate', d_start);
    
    $endDate.datepicker( 'setDate', (d_end.getMonth() + 1) + '-' + d_end.getDate() + '-' + d_end.getFullYear() );
    $endTime.timepicker( 'setTime', d_end.getHours() + ':' + d_end.getMinutes() );
  }
  
  function update_d_start() {
    var currentStartTime  = parseTime( $startTime.val() );
    var d                 = $startDate.datepicker('getDate');
    
    return new Date( d.getFullYear(), d.getMonth(), d.getDate(), currentStartTime.hours, currentStartTime.minutes );
  }
  
  function update_d_end() {
    var currentStartTime  = parseTime( $endTime.val() );
    var d                 = $endDate.datepicker('getDate');
    
    return new Date( d.getFullYear(), d.getMonth(), d.getDate(), currentStartTime.hours, currentStartTime.minutes );
  }
  
  function catch_up_d_end() {
    if ( d_end - d_start < 10800000 ) {
      return new Date( d_start.getFullYear(), d_start.getMonth(), d_start.getDate(), d_start.getHours() + 3, d_start.getMinutes() );
    } else {
      return d_end;
    }
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
  var $list  = $('.step-guestsList');
  var $first = $('.step-guestsList .step-guestsList-guest:first-child');
  
  // вешаю обработчик на ссылки в первой строке
  addListeners( $first );
  
  // обработчик на + добавляет строку в конец списка, вешает на нее обработчики и запускает парсер проверяющий, какие ссылки, в какой строке нужно открыть
  // обработчик на - удаляет строку и запускает парсер проверяющий, какие ссылки, в какой строке нужно открыть
  function addListeners( $el ) {
    $remove = $el.find('.step-guestsList-trigger_remove');
    $add    = $el.find('.step-guestsList-trigger_add');
    
    $remove.on('click', function(e) {
      e.preventDefault();
      $el.remove();
      manageLinksVisibility();
    });
    
    $add.on('click', function(e) {
      e.preventDefault();
      addListeners( addElement() );
      manageLinksVisibility();
    });
  }
  
  function addElement() {
    var $el       = $('<li class="step-guestsList-guest clearfix"></li>');
    var template  = '<div class="form-group step-guestsList-guest-name">' +
                      '<input type="text" class="form-control" placeholder="guest\'s name">' +
                    '</div>' +
                    '<a href="#" class="step-guestsList-trigger step-guestsList-trigger_remove hidden">Remove</a>' +
                    '<a href="#" class="step-guestsList-trigger step-guestsList-trigger_add hidden">+ Guest</a>';
    
    $list.append( $el.append(template) );
    
    return $el;
  }
  
  function manageLinksVisibility() {
    var q = $list.children('li').length;
    
    $list.children('li').each(function(n, el) {
      $remove = $(el).find('.step-guestsList-trigger_remove');
      $add    = $(el).find('.step-guestsList-trigger_add');
      
      if (n < q - 1) {
        $add.addClass('hidden');
        $remove.removeClass('hidden');
      } else if (q > 1) {
        $add.removeClass('hidden');
        $remove.removeClass('hidden');
      } else {
        $add.removeClass('hidden');
        $remove.addClass('hidden');
      }
    })
  }
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