/**
 *
 * @return {can.compute} The can.compute wrapped object
 */
define(['can/util/string', 'models/booking', 'can/observe'], function( can, Booking ) {
    'use strict';

    // Initialize the booking store and setup the getter using can.compute
    var booking = new Booking();

    booking.attr({
        'fetchBooking': can.compute( function( fetch ) {

            var self = this;
            // If we pass anything we can expect the deferred object to be returned, so we can attach done methods
            if( fetch ) {

                switch( typeof fetch ) {
                case 'string':

                    return Booking.findOne({
                        'bookingId': fetch
                    }).done(function( booking ) {
                        self.attr( booking );
                    });

                    //break;
                case 'object':
                    this.attr( fetch );
                    return this.save();
                }

            } else {
                return this;
            }
        }, booking)
    });

    // Return the model so we can listen for changes
    return booking;
});