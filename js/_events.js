UI.events = {};

UI.events.model = {
  events: []
};

UI.events.init = function() {
  var $btns = $('.eventsList .btn-success');
  $btns.each(function() {
    $(this).on('click', function() {
      UI.core.model.applicationState = 'createEvent';
      UI.core.viewBuilder();
    });
  });
};

UI.events.process = function() {
  var $header   = $('.eventsList > .page-header');
  var $events   = $('.eventsList > .events');
  var $empty    = $('.eventsList > .emptyState');
  
  $events.html('');
  
  if (UI.events.model.events.length) {
    UI.events.model.events.forEach(function(event) {
      // event title
      var name = event.name ? '<span class="event-name">' + event.name + '</span>' : '';
      var type = event.type ? '<span class="label label-primary event-type">' + event.type + '</span>' : '';
      var title = '<h2 class="event-title">' + name + type + '</h2>'
      
      // event when
      var sameDate = '';
      var noEndDate = '';
      
      if (event.startYear == new Date().getFullYear()) {event.startYear = ''};
      if (event.endYear   == new Date().getFullYear()) {event.endYear = ''};
      if (event.startDate == event.endDate) {sameDate = 'event-when_sameDate'};
      if (!event.endDate) {noEndDate = 'event-when_onlyStart'};
      
      var startDate = '<div class="event-fieldset-field event-when-startDate">' +
                        '<span class="event-fieldset-label">Date:</span>' +
                        '<span class="event-fieldset-value"><span class="glyphicon glyphicon-calendar"></span>' + 
                          event.startDate + ' ' + 
                          event.startMonth + ' ' + 
                          event.startYear +
                        '</span>' +
                      '</div>';
      
      var startTime = '<div class="event-fieldset-field event-when-startTime">' +
                        '<span class="event-fieldset-label">Time:</span>' +
                        '<span class="event-fieldset-value"><span class="glyphicon glyphicon-time"></span>' + 
                          event.startTime + 
                        '</span>' +
                      '</div>';
      
      var endDate   = event.endDate ? 
                      '<div class="event-fieldset-field event-when-endDate">' +
                        '<span class="event-fieldset-label">Date:</span>' +
                        '<span class="event-fieldset-value"><span class="glyphicon glyphicon-calendar"></span>' + 
                          event.endDate + ' ' + 
                          event.endMonth + ' ' + 
                          event.endYear +
                        '</span>' +
                      '</div>' : '';

      var endTime   = event.endTime ? 
                      '<div class="event-fieldset-field event-when-endTime">' +
                        '<span class="event-fieldset-label">Time:</span>' +
                        '<span class="event-fieldset-value"><span class="glyphicon glyphicon-time"></span>' + 
                          event.endTime + 
                        '</span>' +
                      '</div>' : '';
      
      var when      = '<div class="event-fieldset event-when ' + sameDate + ' ' + noEndDate + '">' +
                        startDate +
                        startTime +
                        endDate + 
                        endTime +
                      '</div>';
      
      // event where
      var host      = event.host ? 
                      '<div class="event-fieldset-field event-where-host">' +
                        '<span class="event-fieldset-label">Host:</span>' +
                        '<span class="event-fieldset-value">' + event.host + '</span>' +
                      '</div>' : '';
      
      var location  = event.location ? 
                      '<div class="event-fieldset-field event-where-location">' +
                        '<span class="event-fieldset-label">Location:</span>' +
                        '<span class="event-fieldset-value">' + event.location + '</span>' +
                      '</div>' : '';
      
      var where     = host || location ? '<div class="event-fieldset event-where">' + host + location + '</div>' : '';
      
      // event guests
      var guests = '';
      
      if (event.guests.length) {
        event.guests.forEach(function(guest) {
          guests += '<div class="event-fieldset-field event-guests-guest">' +
                      '<span class="event-fieldset-label">Guests:</span>' +
                      '<span class="event-fieldset-value"><span class="glyphicon glyphicon-user"></span>' + guest + '</span>' +
                    '</div>';
        });
        
        guests = '<div class="event-fieldset event-guests">' + guests + '</div>';
      };
      
      $events.append( '<div class="event">' + title + when + where + guests + '</div>');
    });
    
    $header.removeClass('hidden');
    $events.removeClass('hidden');
    $empty.addClass('hidden');
  } else {
    $header.addClass('hidden');
    $events.addClass('hidden');
    $empty.removeClass('hidden');
  }
  
  console.log(UI.events.model.events)
};

/*
name: "1"
type: "2"

startDate: "17 February 2016"
startMonth:
startYear:
startTime: "19:00"

endDate: "17 February 2016"
endTime: "20:00"

host: "2"
location: "2555 East Harbor Boulevard, Ventura, CA, United States"

guests: Array[2]

message: "123"
*/
/*
<div class="event">
  <h2 class="event-title"><span class="event-name">I'm going to be 30</span><span class="label label-primary event-type">Birthday</span></h2>
  <div class="event-fieldset event-when event-when_sameDate">
    <div class="event-fieldset-field event-when-startDate">
      <span class="event-fieldset-label">Date:</span>
      <span class="event-fieldset-value"><span class="glyphicon glyphicon-calendar"></span>22 February 2016</span>
    </div>
    <div class="event-fieldset-field event-when-startTime">
      <span class="event-fieldset-label">Time:</span>
      <span class="event-fieldset-value"><span class="glyphicon glyphicon-time"></span>20:00</span>
    </div>
    <div class="event-fieldset-field event-when-endDate">
      <span class="event-fieldset-label">Date:</span>
      <span class="event-fieldset-value"><span class="glyphicon glyphicon-calendar"></span>22 February 2016</span>
    </div>
    <div class="event-fieldset-field event-when-endTime">
      <span class="event-fieldset-label">Time:</span>
      <span class="event-fieldset-value"><span class="glyphicon glyphicon-time"></span>21:00</span>
    </div>
  </div>
  <div class="event-fieldset event-where">
    <div class="event-fieldset-field event-where-host hidden">
      <span class="event-fieldset-label">Host:</span>
      <span class="event-fieldset-value"></span>
    </div>
    <div class="event-fieldset-field event-where-location">
      <span class="event-fieldset-label">Location:</span>
      <span class="event-fieldset-value">1107 Pittsfield Ln, Ventura, CA 93001, USA</span>
    </div>
  </div>
  <div class="event-fieldset event-guests">
    <div class="event-fieldset-field event-guests-guest">
      <span class="event-fieldset-label">Guests:</span>
      <span class="event-fieldset-value"><span class="glyphicon glyphicon-user"></span>Vasya</span>
    </div>
    <div class="event-fieldset-field event-guests-guest">
      <span class="event-fieldset-label">Guests:</span>
      <span class="event-fieldset-value"><span class="glyphicon glyphicon-user"></span>Petya</span>
    </div>
  </div>
</div>
*/