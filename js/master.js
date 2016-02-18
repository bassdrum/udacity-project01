var UI = {};

//= include _modules.validation.js
//= include _core.js
//= include _events.js
//= include _forms.registration.js
//= include _forms.createEvent.js


$(document).ready(function () {
  UI.core.init();
  UI.createEvent.init();
  UI.registration();
  UI.events.init();
});