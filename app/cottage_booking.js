define([
    'can/util/string',
    'controls/calendar/calendar',
    'controls/calculator/calculator',
    'can/control',
    'can/control/plugin',
], function(can, Calendar) {
    'use strict';

    var components = [Calendar],
        BookingPath = can.Control({
            pluginName: 'booking_path'
        }, {

            init: function() {
                new Calendar(this.element);
                can.route.ready();
            },

            ':page route': function() {
                console.log.apply(console, arguments);
            }
        });

    // Initialise app on the cottage-booking element
    //new BookingPath('#cottage-booking');
    return BookingPath;
});