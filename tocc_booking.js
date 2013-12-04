requirejs(['can'], function(can) {
	'use strict';

	var App = can.Control({
		init : function() {
			// The function will make a request from that URL and get the markup found in result from the selector
			this.element.load('http://localhost/empty/tabs_property/G430_zz/booking/calendar .calendar-container > .fieldset-wrapper');
		},

		':page route': function() {
			console.log.apply(console, arguments);
		}
	});

	new App('#content');
});