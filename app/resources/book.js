/**
 *
 * @return {can.compute} The can.compute wrapped object
 */
define(['can/util/string', 'models/booking', 'can/observe'], function( can, Booking ) {
    'use strict';

    var booking = new Booking();

    // Return the model so we can listen for changes
    return booking;
});