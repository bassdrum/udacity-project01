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
    
    if ($form[0].checkValidity() === false) {
      e.preventDefault();
      console.log('invalid');
      return false;
    } else {
      console.log('valid');
    }
  });
}
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


$(document).ready(function () {
  UI.registration();
  UI.createEvent.when();
});