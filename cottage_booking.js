requirejs(['can', 'controls/calendar/calendar'], function(can, Calendar) {
	'use strict';

	var components = [Calendar],
		BookingPath = can.Control({
			init: function() {
			},

			':page route': function() {
				console.log.apply(console, arguments);
			}
		});

	new BookingPath('#cottage-booking');
});