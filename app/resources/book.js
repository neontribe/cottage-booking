/**
 *
 * @return {can.compute} The can.compute wrapped object
 */
define(['can/util/string', 'models/booking'], function( can, Booking ) {
    'use strict';
    // Return the model so we can listen for changes
    return new Booking();
});