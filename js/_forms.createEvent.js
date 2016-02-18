UI.createEvent = {};

UI.createEvent.init = function() {
  UI.createEvent.when.init();
  UI.createEvent.guests.init();
  UI.createEvent.where();
  UI.createEvent.form.init();
}

UI.createEvent.when = {};

UI.createEvent.when.model = {
  d_start       : true,
  d_end         : true,
  d_endVisible  : false,
  monthNames    : [
                  'January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'
                  ],
  isUpdating    : false
}

UI.createEvent.when.init = function() {
  var $startRow       = $('#createEvent-start');
  var $startTrigger   = $('#createEvent-start-trigger');
  var $startDate      = $('#createEvent-start-date-group');
  var $startTime      = $('#createEvent-start-time');
  
  var $endRow         = $('#createEvent-end');
  var $endTrigger     = $('#createEvent-end-trigger');
  var $endDate        = $('#createEvent-end-date-group');
  var $endTime        = $('#createEvent-end-time');

  UI.createEvent.when.setDates();
  
  init();
  
  UI.createEvent.when.updateDates('start', UI.createEvent.when.model.d_start);
  UI.createEvent.when.updateDates('end', UI.createEvent.when.model.d_end);
  
  subscribe();
  
  function init() {
    $startDate.datepicker({
      autoclose: true,
      startDate: UI.createEvent.when.model.d_start
    });
    
    $startTime.timepicker({
      template: false,
      showInputs: false,
      minuteStep: 5,
      showMeridian: false
    });
    
    $endDate.datepicker({
      autoclose: true,
      startDate: UI.createEvent.when.model.d_end
    });
    
    $endTime.timepicker({
      template: false,
      showInputs: false,
      minuteStep: 5,
      showMeridian: false
    });
    
    // fixing weird issue with timepicker's input-group-addon
    $startTime.siblings('.input-group-addon').off('click');
    $endTime  .siblings('.input-group-addon').off('click');
  }
  
  function subscribe() {
    $startTrigger.on('click', function(e) {
      e.preventDefault();
      $endRow.removeClass('hidden');
      $startTrigger.addClass('hidden');
      UI.createEvent.when.model.d_endVisible = true;
    });
    
    $endTrigger.on('click', function(e) {
      e.preventDefault();
      $endRow.addClass('hidden');
      $startTrigger.removeClass('hidden');
      UI.createEvent.when.model.d_endVisible = false;
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
  
  // returns true if (UI.createEvent.when.model.d_end < UI.createEvent.when.model.d_start + 1 hour)
  function compareDates() {
    if ( UI.createEvent.when.model.d_end - UI.createEvent.when.model.d_start < 3600000 ) {
      return true;
    }
    
    return false;
  }
  
  function onStartChange() {
    UI.createEvent.when.updateDates('start', getDateTime('start'));
    
    if ( compareDates() ) {
      var d = UI.createEvent.when.model.d_start;
      
      d.setHours( d.getHours() + 1 );
      UI.createEvent.when.updateDates( 'end', d );
    }
  }
  
  function onEndChange() {
    UI.createEvent.when.updateDates('end', getDateTime('end'));
  }
}

UI.createEvent.when.setDates = function() {
  var now                       = new Date();
  
  UI.createEvent.when.model.d_start  = new Date( now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1 );
  UI.createEvent.when.model.d_end    = new Date( now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 2 );
}

UI.createEvent.when.updateDates = function(type, d) {
  var $startDate      = $('#createEvent-start-date-group');
  var $startTime      = $('#createEvent-start-time');
  var $endDate        = $('#createEvent-end-date-group');
  var $endTime        = $('#createEvent-end-time');
  
  if (type == 'start') {
    UI.createEvent.when.model.d_start = new Date( d );
    
    isUpdating = true;
    $startDate.datepicker( 'setDate', (UI.createEvent.when.model.d_start.getMonth() + 1) + '-' + UI.createEvent.when.model.d_start.getDate() + '-' + UI.createEvent.when.model.d_start.getFullYear() );
    $startTime.timepicker( 'setTime', UI.createEvent.when.model.d_start.getHours() + ':' + UI.createEvent.when.model.d_start.getMinutes() );
    isUpdating = false;
  }
  
  if (type == 'end') {
    UI.createEvent.when.model.d_end = new Date( d );
    
    isUpdating = true;
    $endDate.datepicker( 'setDate', (UI.createEvent.when.model.d_end.getMonth() + 1) + '-' + UI.createEvent.when.model.d_end.getDate() + '-' + UI.createEvent.when.model.d_end.getFullYear() );
    $endTime.timepicker( 'setTime', UI.createEvent.when.model.d_end.getHours() + ':' + UI.createEvent.when.model.d_end.getMinutes() );
    isUpdating = false;
  }
  
  $endDate.datepicker( 'setStartDate', UI.createEvent.when.model.d_start );
}

UI.createEvent.when.clean = function() {
  UI.createEvent.when.setDates();
  UI.createEvent.when.updateDates('start', UI.createEvent.when.model.d_start);
  UI.createEvent.when.updateDates('end', UI.createEvent.when.model.d_end);
  $('#createEvent-end').addClass('hidden');
  $('#createEvent-start-trigger').removeClass('hidden');
}

UI.createEvent.guests = {};

UI.createEvent.guests.dom = {
  $list: $('.guestsList'),
  $first: $('.guestsList .guestsList-guest:first-child')
}

UI.createEvent.guests.init = function() {
  var $list  = UI.createEvent.guests.dom.$list;
  var $first = UI.createEvent.guests.dom.$first;
  
  addListeners( $first );
  UI.createEvent.guests.manageLinksVisibility();
  
  function addListeners( $el ) {
    $remove = $el.find('.guestsList-trigger_remove');
    $add    = $el.find('.guestsList-trigger_add');
    
    $remove.on('click', function(e) {
      e.preventDefault();
      $el.remove();
      UI.createEvent.guests.manageLinksVisibility();
    });
    
    $add.on('click', function(e) {
      e.preventDefault();
      addListeners( addElement() );
      UI.createEvent.guests.manageLinksVisibility();
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
}

UI.createEvent.guests.manageLinksVisibility = function() {
  var $list  = UI.createEvent.guests.dom.$list;
  var q      = $list.children('li').length;
  
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
  });
}

UI.createEvent.guests.clean = function() {
  var $list  = UI.createEvent.guests.dom.$list;
  
  $list.find('li').not(':first-child').remove();
  UI.createEvent.guests.manageLinksVisibility();
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

UI.createEvent.form = {};

UI.createEvent.form.init = function() {
  var $form     = $('#createEvent');
  var $name     = $('#createEvent-name');
  var $end      = $('#createEvent-end');
  var $endDate  = $('#createEvent-end-date');
  var $endTime  = $('#createEvent-end-date');
  var $help     = $end.find('.help-block');
  var $cancel   = $('#createEvent-cancel');
  
  $name.validator();
  
  $form.on('keyup keypress', ':input:not(textarea):not([type=submit])', function(e) {
    var keyCode = e.keyCode;
    if (keyCode === 13) { 
      e.preventDefault();
      return false;
    }
  });
  
  $form.on('submit', function(e) {
    e.preventDefault();
    
    // call force validation
    $name.validator('forceValidation');
    
    // validate end time
    if (UI.createEvent.when.model.d_end - UI.createEvent.when.model.d_start <= 0) {
      $end.addClass('has-error');
      $help.removeClass('hidden');
      $endDate[0].setCustomValidity('invalid');
      $endTime[0].setCustomValidity('invalid');
    } else {
      $end.removeClass('has-error');
      $help.addClass('hidden');
      $endDate[0].setCustomValidity('');
      $endTime[0].setCustomValidity('');
    }

    if ($form[0].checkValidity() === false) {
      return false;
    } else {
      UI.events.model.events.push( UI.createEvent.form.collectEvent() );
      UI.createEvent.form.clean();
      UI.core.model.applicationState = 'list';
      UI.core.viewBuilder();
    }
  });
  
  $cancel.on('click', function(e) {
    e.preventDefault();
    UI.createEvent.form.clean();
    UI.core.model.applicationState = 'list';
    UI.core.viewBuilder();
  })
}

UI.createEvent.form.collectEvent = function() {
  var event = {};
  event.guests = [];
  
  event.name        = $('#createEvent-name').val();
  event.type        = $('#createEvent-type').val();
  event.startDate   = UI.createEvent.when.model.d_start.getDate();
  event.startMonth  = UI.createEvent.when.model.monthNames[ UI.createEvent.when.model.d_start.getMonth() ];
  event.startYear   = UI.createEvent.when.model.d_start.getFullYear();
  event.startTime   = UI.createEvent.when.model.d_start.getHours()  + ':' + ('0' + UI.createEvent.when.model.d_start.getMinutes() ).slice(-2);
  
  if (UI.createEvent.when.model.d_endVisible) {
    event.endDate   = UI.createEvent.when.model.d_end.getDate();
    event.endMonth  = UI.createEvent.when.model.monthNames[ UI.createEvent.when.model.d_end.getMonth() ];
    event.endYear   = UI.createEvent.when.model.d_end.getFullYear();
    event.endTime   = UI.createEvent.when.model.d_end.getHours()  + ':' + ('0' + UI.createEvent.when.model.d_end.getMinutes() ).slice(-2);
  }
  
  event.host      = $('#createEvent-host').val();
  event.location  = $('#createEvent-location').val();
  event.guests    = getGuests();
  event.message   = $('#createEvent-message').val();
  
  function getGuests() {
    var arr = [];
    
    $('#createEvent .guestsList .guestsList-guest').each(function() {
      var guest = $(this).find('input').val();
      
      if (guest) {
        arr.push(guest);
      }
    });
    
    return arr;
  };
  
  return event;
}

UI.createEvent.form.clean = function() {
  $('#createEvent')[0].reset();
  UI.createEvent.when.clean();
  UI.createEvent.guests.clean();
}