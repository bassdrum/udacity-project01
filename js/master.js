var UI = {};

//= include _modules.validation.js
//= include _registration.js
//= include _createEvent.js


$(document).ready(function () {
  UI.registration();
  UI.createEvent.when();
  UI.createEvent.guests();
});