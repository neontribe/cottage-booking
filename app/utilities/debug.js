define([
    'can/util/string',
    'resources/avail',
    'resources/book',
    'resources/enquiry',
    'can/util/string/deparam',
    'can/model'
], function( can, avail, booking, enquiry ) {

    var debugging = can.deparam().__debug || false;

    var Debug = can.Model({
        create: 'post /zz/property/booking_debug/{type}',
        update: 'post /zz/property/booking_debug/{type}',
        defaults: {
            booking: booking,
            availability: avail,
            enquiry: enquiry,
            type: 'log',
            message: 'Cottage booking debug default message'
        }
    }, {});

    function send( what, data ) {
        data = can.$.extend({
            message: can.sub( what, data )
        }, data);
        return Debug.model( data ).save();
    }

    return function debug( message, data ) {
        // treat this call as a setup call
        if( message === debug ) {
            debugging = typeof data === 'object' ? data.debugging : !!data;

            return;
        }
        return can.$.when( debugging && send( message, data ) );
    }
});