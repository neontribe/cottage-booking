requirejs([
	'can',
	'controls/calendar/calendar',
], function(can, Calendar) {
	'use strict';

	var components = [Calendar],
		BookingPath = can.Control({
			init: function() {

				can.route.ready();
			},

			':page route': function() {
				console.log.apply(console, arguments);
			}
		});

	new BookingPath('#cottage-booking');
});