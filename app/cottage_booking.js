requirejs([
	'can',
	'controls/calendar/calendar',
	'controls/calculator/calculator'
], function(can, Calendar) {
	'use strict';

	var components = [Calendar],
		BookingPath = can.Control({
			init: function() {
				new Calendar(this.element);
				can.route.ready();
			},

			':page route': function() {
				console.log.apply(console, arguments);
			}
		});

	// Initialise app on the cottage-booking element
	new BookingPath('#cottage-booking');
});