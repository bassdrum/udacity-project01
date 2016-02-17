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