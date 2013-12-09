requirejs(['can'], function(can) {
	'use strict';

	var App = can.Control({
		init : function() {
		},

		':page route': function() {
			console.log.apply(console, arguments);
		}
	});

	new App('#cottage-booking');
});