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

  var now             = new Date();
  var d_start         = new Date( now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1 );
  var d_end           = new Date( now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 2 );
  
  var isUpdating      = false;
  
  init();
  
  updateDate('start', d_start);
  updateDate('end', d_end);
  
  subscribe();
  
  function init() {
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
    
    // fixing weird issue with timepicker's input-group-addon
    $startTime.siblings('.input-group-addon').off('click');
    $endTime.siblings('.input-group-addon').off('click');
  }
  
  function subscribe() {
    $startTrigger.on('click', function() {
      $endRow.removeClass('hidden');
      $startTrigger.addClass('hidden');
    });
    
    $endTrigger.on('click', function() {
      $endRow.addClass('hidden');
      $startTrigger.removeClass('hidden');
    });

    $startDate.on('changeDate', function() {
      if (isUpdating) return;
      
      isUpdating = true;
      
      onStartChange();
      
      isUpdating = false;
    });
    
    $startTime.timepicker().on('changeTime.timepicker blur', function() {
      if (isUpdating) return;
      
      isUpdating = true;
      
      onStartChange();
      
      isUpdating = false;
    });
    
    $endDate.on('changeDate', function() {
      if (isUpdating) return;
      
      isUpdating = true;
      
      onEndChange();
      
      isUpdating = false;
    });
    
    $endTime.timepicker().on('changeTime.timepicker blur', function() {
      if (isUpdating) return;
      
      isUpdating = true;
      
      onEndChange();
      
      isUpdating = false;
    });
  }
  
  // start, d
  // end, d
  function updateDate(type, d) {
    if (type == 'start') {
      d_start = new Date( d );
      
      $startDate.datepicker( 'setDate', (d_start.getMonth() + 1) + '-' + d_start.getDate() + '-' + d_start.getFullYear() );
      $startTime.timepicker( 'setTime', d_start.getHours() + ':' + d_start.getMinutes() );
    }
    
    if (type == 'end') {
      d_end = new Date( d );
      
      $endDate.datepicker( 'setDate', (d_end.getMonth() + 1) + '-' + d_end.getDate() + '-' + d_end.getFullYear() );
      $endTime.timepicker( 'setTime', d_end.getHours() + ':' + d_end.getMinutes() );
    }
    
    $endDate.datepicker( 'setStartDate', d_start );
  }
  
  // start
  // end
  // returns d;
  function getDateTime(type) {
    var d;
    var t;
    
    if (type == 'start') {
      d = $startDate.datepicker('getDate');
      t = parseTime( $startTime.val() );
      
      d.setHours( t.hours );
      d.setMinutes( t.minutes );
    }
    
    if (type == 'end') {
      d = $endDate.datepicker('getDate');
      t = parseTime( $endTime.val() );
      
      d.setHours( t.hours );
      d.setMinutes( t.minutes );
    }
    
    return d;
  }
  
  // time
  // returns {hours: 'HH', minutes: 'MM'}
  function parseTime(time) {
    var arr = time.split(':');
    
    return {
      hours: arr[0] || 0,
      minutes: arr[1]  || 0
    }
  }
  
  // returns true if (d_end < d_start + 1 hour)
  function compareDates() {
    if ( d_end - d_start < 3600000 ) {
      return true;
    }
    
    return false;
  }
  
  function onStartChange() {
    updateDate('start', getDateTime('start'));
    
    if ( compareDates() ) {
      var d = d_start;
      
      d.setHours( d.getHours() + 1 );
      updateDate( 'end', d );
    }
  }
  
  function onEndChange() {
    updateDate('end', getDateTime('end'));
  }
}

UI.createEvent.guests = function() {
  var $list  = $('.guestsList');
  var $first = $('.guestsList .guestsList-guest:first-child');
  
  // вешаю обработчик на ссылки в первой строке
  addListeners( $first );
  
  // обработчик на + добавляет строку в конец списка, вешает на нее обработчики и запускает парсер проверяющий, какие ссылки, в какой строке нужно открыть
  // обработчик на - удаляет строку и запускает парсер проверяющий, какие ссылки, в какой строке нужно открыть
  function addListeners( $el ) {
    $remove = $el.find('.guestsList-trigger_remove');
    $add    = $el.find('.guestsList-trigger_add');
    
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
    var $el       = $('<li class="guestsList-guest clearfix"></li>');
    var template  = '<div class="form-group guestsList-guest-name">' +
                      '<input type="text" class="form-control" placeholder="guest\'s name">' +
                    '</div>' +
                    '<a href="#" class="guestsList-trigger guestsList-trigger_remove hidden">Remove</a>' +
                    '<a href="#" class="guestsList-trigger guestsList-trigger_add hidden">+ Guest</a>';
    
    $list.append( $el.append(template) );
    
    return $el;
  }
  
  function manageLinksVisibility() {
    var q = $list.children('li').length;
    
    $list.children('li').each(function(n, el) {
      $remove = $(el).find('.guestsList-trigger_remove');
      $add    = $(el).find('.guestsList-trigger_add');
      
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

UI.createEvent.where = function() {
  var autocomplete  = new google.maps.places.Autocomplete( document.getElementById('createEvent-location'), {types: ['geocode']});
  var geocoder      = new google.maps.Geocoder();
  var $geoTrigger   = $('.geoLocation-icon');
  var $geoInput     = $('#createEvent-location');
  var $spinner      = $geoTrigger.siblings('.spinner');
  
  if (navigator.geolocation) {
    $geoTrigger.removeClass('hidden');
    $geoTrigger.on('click', function() {
      showSpinner();
      navigator.geolocation.getCurrentPosition(onGetPositionSuccess, onGetPositionError);
    })
  };
  
  function onGetPositionSuccess(position) {
    $.ajax({
      url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' 
            + position.coords.latitude + ',' + position.coords.longitude 
            + '&key=AIzaSyDjdMGfSpv44b2bVuKVW8AxBGmXTVHTRzA'
    }).done(function(data) {
      $geoInput.val( data.results[0].formatted_address || '' );
    }).always(function() {
      hideSpinner();
    });
  }
  
  function onGetPositionError(error) {
    hideSpinner();
    console.log(error);
  }
  
  function showSpinner() {
    $spinner.removeClass('hidden');
    $geoTrigger.addClass('hidden');
  }
  
  function hideSpinner() {
    $spinner.addClass('hidden');
    $geoTrigger.removeClass('hidden');
  }
}