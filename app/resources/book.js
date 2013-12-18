/**
 *
 * @return {can.compute} The can.compute wrapped object
 */
define(['can/util/string', 'models/booking', 'can/observe'], function( can, Booking ) {
    'use strict';

    // Initialize the booking store and setup the getter using can.compute
    var getBooking = can.compute( function( fetch ) {

        var self = this,
            booking = this.attr('booking');

        if( fetch ) {

            switch( typeof fetch ) {
            case 'string':

                return Booking.findOne({
                    'bookingId': fetch
                }).done(function( booking ) {
                    self.attr('booking', booking);
                });

                //break;
            case 'object':
                booking = new Booking( fetch );
                this.attr('booking', booking);
                return booking.save();
            }

        } else {
            return booking || this.attr('booking', new Booking()).attr('booking');
        }


    }, new can.Observe());

    // Return the compute wrapped object, so we can listen for changes
    return getBooking;
});