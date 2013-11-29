requirejs(['can'], function(can) {
	'use strict';

	var App = can.Control({
		init : function() {
			this.element.load('http://localhost/empty/tabs_property/G430_zz/booking/calendar .calendar-container > .fieldset-wrapper');
		},

		':page route': function() {
			console.log.apply(console, arguments);
		}
	});

	new App('#content');
});