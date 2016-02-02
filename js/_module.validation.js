+function ($) {
  // как валидировать?
  // 1. определить способ валидации (зависит от типа поля)
  // 2. добавить обработчик keyup на поле
  // 2.1 проверяю валидно ли поле? (вот тут логика валидации будет зависеть от типа поля)
  // 2.2 если нет, ничего не делаю
  // 2.3 если да, setCustomValidity() + удаляю has-error (не важно, был он или нет)
  // 3. добавить обработчик blur 
  // 3.1 поле валидно? (вот тут логика валидации будет зависеть от типа поля)
  // 3.2 да — ничего не делаю
  // 3.3 нет - setCustomValidity(false), + добавляю has-error
  
  // вторая итерация 
  // научиться обрабатывать больше одной ошибки
  // 1. получаю объект validity
  // 2. прохожу по свойствам
  // 3. нахожу true и сопоставляю с объектом ошибок и текстов уникальным для данного поля
  // 4. выдаю именно эту ошибку
  
  // создаю объект, в котором есть стандартные тексты ошибок для стандартных кейсов
  // возможно с зависимостью от типа поля
  // далее при ошибке валидации, я сначала смотрю нет ли объекта с сообщениями об ошибках в параметрах инициализации
  // если нет, дергаю подходящее сообщение из предопределенного объекта
  
  // третья итерация
  // инициализировать плагин на поле
  // откуда брать сообщения об ошибке?
  // оставить в html?
  
  
  // четвертая итерация
  // усложнить логику валидации
  // не валидировать поле которое было и осталось пустым
  // валидировать поле на keyup, если поле уже когда то было отвалидировано в инвалид
  
  // пятая итерация
  // добавить валидацию для пароля
  
  // шестая итерация
  // вынести валидацию на уровень формы
  
  // последняя итерация 
  // покрыть код комментариями
  
  
  'use strict';
  
  var moduleName = 'validate';

  function Module (element, options) {
    this.element      = element;
    this._name        = moduleName;
    this._defaults    = $.fn[moduleName].defaults;
    this.options      = $.extend(true, {}, this._defaults, options );
    this.$element     = null;
    this.$parent      = null;
    this.$helpBlock   = null;
    this.everValue    = null;
    
    this.init();
  }
  
  Module.prototype.init = function () {
    this.buildCache();
    this.bindEvents();
  };
  
  Module.prototype.buildCache = function() {
    this.$element   = $(this.element);
    this.$parent    = this.$element.closest('.form-group');
    this.$helpBlock = this.$element.siblings('.help-block');
  };
  
  Module.prototype.bindEvents = function() {
    var module = this;
    
    module.$element.on('keyup'+'.'+module._name, function() {
      if ( module.isValid() ) {
        module.cleanUp();
      } else if( module.everValue ) {
        module.showError();
      }
    });
    
    module.$element.on('focus'+'.'+module._name, function() {
      if ( !module.everValue ) {
        module.everValue = module.$element.val();
      }
    });
    
    module.$element.on('blur'+'.'+module._name, function() {
      if ( !module.$element.val() && !module.everValue ) {
        return;
      }
      
      if ( module.isValid() ) {
        module.cleanUp();
      } else {
        module.showError();
      }
    });
  };
  
  Module.prototype.isValid = function() {
    var type = this.$element.attr('type');
    
    return this.element.checkValidity();
    /*
    if (type == 'password') {
      // ...
    } else {
      return this.element.checkValidity();
    }*/
  };
  
  Module.prototype.cleanUp = function() {
    this.$parent.removeClass('has-error');
    this.$helpBlock.addClass('hidden').html();
  };
  
  Module.prototype.showError = function() {
    var message = this.getErrorMessage();
    
    this.$parent.addClass('has-error');
    this.$helpBlock.removeClass('hidden').html(message);
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
    
    if (key == 'tooShort' || key == 'tooLong') {
      message = message.replace('NNN', this.$element.attr('minlength'));
    }
    
    return message;
  };
  
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
      tooShort: 'At least NNN characters'
    }
  };

}(jQuery);