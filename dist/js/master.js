var UI = {};

// DESCRIPTION
// ============================================================
// validator manages validation process on a field level.
// it means, that you can init it on a specific field
// pass options (messages), 
// set constraints using html attributes (see Constraint Validation API)
// and enjoy the process
//
// important: validator supports slightly different logic for regular fields and password* fields
// * password validation options are hardcoded

// USAGE
// ============================================================
// $('#regPwd').validator(options);

// OPTIONS
// ============================================================
// take a look at module's default options
// it is allowed to redefine any predefined error messages
// $('#regName').validator({
//      messages: {
//      valueMissing: 'We really need your name, mate',
//      tooShort: 'The name is too short, bro (at least %N% characters)'
//    }
//  });

// GENERATED MARKUP
// ============================================================
// in case of password field
// module generates additional markup (to provide hints)
// <ul class="list-unstyled">
//   <li><span class="glyphicon glyphicon-ban-circle"></span> Hint text</li>
//   ...
//   <li><span class="glyphicon glyphicon-ban-circle"></span> Hint text</li>
// </ul>  

// API
// ============================================================
// you can force validation on a field
// $('#regName').validator('forceValidation');


+function ($) {
  'use strict';
  
  var moduleName = 'validator';

  function Module (element, options) {
    this.element        = element;
    this._name          = moduleName;
    this._defaults      = $.fn[moduleName].defaults;
    this.options        = $.extend(true, {}, this._defaults, options );
    this.elementType    = this.element.type;
    this.$element       = null;
    this.$parent        = null;
    this.$helpBlock     = null;
    this.$messagesList  = null; // used only for 'password' fields
    this.everValue      = null;
    
    this.init();
  }
  
  Module.prototype.init = function () {
    this.buildDom();
    this.buildCache();
    this.bindEvents();
  };
  
  Module.prototype.buildDom = function() {
    if (this.elementType == 'password') {
      var $ul = $('<ul class="list-unstyled"></ul>');
      
      for (var key in this.options.messages.password) {
        var element = '<li><span class="glyphicon glyphicon-ban-circle"></span> ' 
                      + this.options.messages.password[key] 
                      + '</li>';
        
        $ul.append(element);
      }
      
      $(this.element).closest('div').append($ul);
    }
  };
  
  Module.prototype.buildCache = function() {
    this.$element   = $(this.element);
    this.$parent    = this.$element.closest('.form-group');
    this.$helpBlock = this.$element.siblings('.help-block');
    this.$messagesList = this.$parent.find('ul.list-unstyled');
  };
  
  Module.prototype.bindEvents = function() {
    var module = this;
    
    module.$element.on('focus' + '.' + module._name, function() {
      if ( !module.everValue ) {
        module.everValue = module.$element.val();
      }
    });
    
    module.$element.on('input' + '.' + module._name, function() {
      if ( module.isValid() ) {
        module.cleanUp();
      } else if ( module.everValue ) {
        module.showError();
      }
    });
    
    module.$element.on('blur' + '.' +  module._name, function() {
      if ( !module.$element.val() && !module.everValue ) {
        return;
      }
      
      if ( module.isValid() ) {
        module.cleanUp();
      } else {
        module.showError();
      }
    });
    
    module.$element.on('input' + '.' + module._name + ', ' + 'blur' + '.' +  module._name , function() {
      if ( module.elementType == 'password' ) {
        module.processPasswordMessages();
      }
    });
  };
  
  Module.prototype.isValid = function() {
    if ( this.elementType != 'password' ) {
      return this.element.checkValidity();
    }
    
    return this.isValid_password().isValid;
  };
  
  Module.prototype.isValid_password = function() {
    var minLength = /^[\s\S]{8,}$/;
    var upper = /[A-Z]/;
    var lower = /[a-z]/;
    var number = /[0-9]/;
    var special = /[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/;
    var password = this.$element.val();
    var result = {};
    
    result.conditions = {};
    result.isValid = true;
    
    result.conditions.minLength = minLength.test(password) ? true : false;
    result.conditions.upper = upper.test(password) ? true : false;
    result.conditions.lower = lower.test(password) ? true : false;
    result.conditions.number = number.test(password) ? true : false;
    result.conditions.special = special.test(password) ? true : false;
    
    for (var key in result.conditions) {
      if( result.conditions[key] === false ) result.isValid = false;
    }
    
    if (result.isValid) {
      this.element.setCustomValidity('');
    } else {
      this.element.setCustomValidity('invalid');
    }
    
    return result;
  };
  
  Module.prototype.showError = function() {
    var message = this.getErrorMessage();
    
    this.$parent.addClass('has-error');
    this.$helpBlock.removeClass('hidden').html(message);
  };
  
  Module.prototype.cleanUp = function() {
    this.$helpBlock.addClass('hidden').html();
    this.$parent.removeClass('has-error');
  };
  
  Module.prototype.getErrorMessage = function() {
    var states = this.element.validity;
    
    for (var key in states) {
      if ( states[key] ) {
        return this.formatMessage(key);
      }
    }
    
    return false;
  };
  
  Module.prototype.formatMessage = function(key) {
    var message = this.options.messages[key];
    
    if (key == 'tooShort') {
      message = message.replace('%N%', this.$element.attr('minlength'));
    }
    
    return message;
  };
  
  Module.prototype.processPasswordMessages = function() {
    var result = this.isValid_password();
    var counter = 0;
    
    for (var key in result.conditions) {
      counter++;
      
      if (result.conditions[key]) {
        this.$messagesList
          .find('li:nth-child(' + counter + ')')
          .addClass('text-success strong')
          .find('.glyphicon')
          .removeClass('glyphicon-ban-circle')
          .addClass('glyphicon-ok-circle');
      } else {
        this.$messagesList
          .find('li:nth-child(' + counter + ')')
          .removeClass('text-success')
          .find('.glyphicon')
          .removeClass('glyphicon-ok-circle')
          .addClass('glyphicon-ban-circle');
      }
    }
  }
  
  // API methods
  Module.prototype.forceValidation = function() {
    if ( this.isValid() ) {
      this.cleanUp();
    } else {
      this.showError();
    }
    
    if ( this.elementType == 'password' ) {
      this.processPasswordMessages();
    }
    
    return false;
  }
  // end of API methods
  
  $.fn[moduleName] = function (option) {
    return this.each(function () {
      var $this   = $(this);
      var data    = $this.data( 'module_' + moduleName );
      var options = $.extend({}, $.fn[moduleName].defaults, $this.data(), typeof option == 'object' && option);
      
      if (!data) $this.data( 'module_' + moduleName, ( data = new Module(this, options) ) );
      if (typeof option == 'string') data[option]();
    });
  };

  $.fn[moduleName].defaults = {
    messages: {
      valueMissing: 'The field is required',
      tooShort: 'At least %N% characters',
      password: { 
        minlength: 'At least 8 characters long', // todo: get rid of hardcoded parameters
        upper: 'Contains uppercase letters',
        lower: 'Contains lowercase letters',
        number: 'Contains numbers',
        special: 'Contains punctuation'
      }
    }
  };

}(jQuery);
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
UI.events = {};

UI.events.model = {
  events: []
};

UI.events.init = function() {
  
};



UI.events.prepareStorage = function() {
  localStorage.clear();
}

UI.events.addEvent = function(event) {
  localStorage.setItem(event.name, event);
}
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
}
UI.createEvent = {};

UI.createEvent.model = {
  d_start: true,
  d_end: true
}

UI.createEvent.init = function() {
  UI.createEvent.when();
  UI.createEvent.guests();
  UI.createEvent.where();
  UI.createEvent.validation();
}

UI.createEvent.when = function() {
  var $startRow       = $('#createEvent-start');
  var $startTrigger   = $('#createEvent-start-trigger');
  var $startDate      = $('#createEvent-start-date-group');
  var $startTime      = $('#createEvent-start-time');
  
  var $endRow         = $('#createEvent-end');
  var $endTrigger     = $('#createEvent-end-trigger');
  var $endDate        = $('#createEvent-end-date-group');
  var $endTime        = $('#createEvent-end-time');

  var isUpdating      = false;
  var now             = new Date();
  
  UI.createEvent.model.d_start  = new Date( now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1 );
  UI.createEvent.model.d_end    = new Date( now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 2 );
  
  init();
  
  updateDate('start', UI.createEvent.model.d_start);
  updateDate('end',   UI.createEvent.model.d_end);
  
  subscribe();
  
  function init() {
    $startDate.datepicker({
      autoclose: true,
      startDate: UI.createEvent.model.d_start
    });
    
    $startTime.timepicker({
      template: false,
      showInputs: false,
      minuteStep: 5,
      showMeridian: false
    });
    
    $endDate.datepicker({
      autoclose: true,
      startDate: UI.createEvent.model.d_end
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
      UI.createEvent.model.d_start = new Date( d );
      
      $startDate.datepicker( 'setDate', (UI.createEvent.model.d_start.getMonth() + 1) + '-' + UI.createEvent.model.d_start.getDate() + '-' + UI.createEvent.model.d_start.getFullYear() );
      $startTime.timepicker( 'setTime', UI.createEvent.model.d_start.getHours() + ':' + UI.createEvent.model.d_start.getMinutes() );
    }
    
    if (type == 'end') {
      UI.createEvent.model.d_end = new Date( d );
      
      $endDate.datepicker( 'setDate', (UI.createEvent.model.d_end.getMonth() + 1) + '-' + UI.createEvent.model.d_end.getDate() + '-' + UI.createEvent.model.d_end.getFullYear() );
      $endTime.timepicker( 'setTime', UI.createEvent.model.d_end.getHours() + ':' + UI.createEvent.model.d_end.getMinutes() );
    }
    
    $endDate.datepicker( 'setStartDate', UI.createEvent.model.d_start );
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
  
  // returns true if (UI.createEvent.model.d_end < UI.createEvent.model.d_start + 1 hour)
  function compareDates() {
    if ( UI.createEvent.model.d_end - UI.createEvent.model.d_start < 3600000 ) {
      return true;
    }
    
    return false;
  }
  
  function onStartChange() {
    updateDate('start', getDateTime('start'));
    
    if ( compareDates() ) {
      var d = UI.createEvent.model.d_start;
      
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
      console.log(data);
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

UI.createEvent.validation = function() {
  var $form     = $('#createEvent');
  var $name     = $('#createEvent-name');
  var $end      = $('#createEvent-end');
  var $endDate  = $('#createEvent-end-date');
  var $endTime  = $('#createEvent-end-date');
  var $help     = $end.find('.help-block');
  
  
  $name.validator();
  
  $form.on('submit', function(e) {
    e.preventDefault();
    
    // call force validation
    $name.validator('forceValidation');
    
    // validate end time
    if (UI.createEvent.model.d_end - UI.createEvent.model.d_start <= 0) {
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
      UI.core.applicationState = 'list';
      UI.core.viewBuilder();
    }
  });
}


$(document).ready(function () {
  UI.core.init();
  UI.events.init();
  UI.createEvent.init();
  UI.registration();
});