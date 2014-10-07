define([
    'can/util/string',
    'resources/avail',
    'resources/book',
    'resources/enquiry',
    'utils',
    'can/util/string/deparam',
    'can/model'
], function( can, avail, booking, enquiry, utils ) {

    var debugging = can.deparam().__debug || false;
    var requestType = {
        url: utils.baseUrl() + 'property/booking_debug/{type}',
        dataType: 'json',
        type: 'POST'
    };

    var Debug = can.Model({
        create: requestType,
        update: requestType,
        defaults: {
            booking: booking,
            availability: avail,
            enquiry: enquiry,
            type: 'log',
            message: 'Cottage booking debug default message'
        }
    }, {});

    utils.baseUrl.bind('change', function( evt, newVal, oldVal ) {
        // replace the front of the URL + oldVal with the newVal
        requestType.url = requestType.url.replace( new RegExp('^' + oldVal), newVal );
    });

    function send( what, data ) {
        data = can.$.extend({
            message: what ? can.sub( what, data ) : undefined
        }, data);
        return Debug.model( data ).save();
    }

    return function debug( message, data ) {
        // treat this call as a setup call
        if( message === debug ) {
            debugging = arguments.length > 1 ? !!data : debugging;

            if( debugging && typeof window.cottageBookingDebug === 'undefined' ) {
                window.cottageBookingDebug = {
                    require: require,
                    booking: booking,
                    availability: avail,
                    enquiry: enquiry
                };
            }

            if( data && typeof data === 'object' ) {
                can.$.extend( requestType, data );
            }
            return debugging;
        }
        return can.$.when( debugging && send( message, data ) );
    };
});