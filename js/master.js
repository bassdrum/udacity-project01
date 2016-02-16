var UI = {};

//= include _modules.validation.js
//= include _core.js
//= include _forms.registration.js
//= include _forms.createEvent.js


$(document).ready(function () {
  UI.core.init();
  UI.registration();
  UI.createEvent.when();
  UI.createEvent.guests();
  UI.createEvent.where();
});