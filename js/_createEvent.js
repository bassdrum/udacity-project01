UI.createEvent = function() {
  var $form = $('#createEvent');
  var $geo = $('#createEvent-geo');
  
  function geoLocation() {
    var $input = $geo.find('input');
    var $pin = $geo.find('.step-geoLocation-icon');
  }
  
  geoLocation();
}
