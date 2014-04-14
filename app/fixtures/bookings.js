define(['fixtures/fixtures', 'underscore'], function(can){
    'use strict';

    can.wrapFixture('POST property/booking/create', 'fixtures/bookings/', null, 'property-booking-d76c8badd8448cc9d1d888778966d140.json');

    can.wrapFixture('GET property/booking/{bookingId}', 'fixtures/bookings/');

    function change() {

        var target = arguments[0] || {},
            args = [].slice.call(arguments, 1),
            looper = function( value, key ) {
                if( typeof args[i][key] === 'object' ) {
                    change( target[key], args[i][key] );
                } else if(args[i][key] !== undefined) {
                    target[key] = args[i][key];
                }
            };

        for (var i = 0; i < args.length; i++) {
            can.each( target, looper );
        }

        return target;

    }

    can.wrapFixture('POST property/booking/{bookingId}', 'fixtures/bookings/', function( data, status, def, originalAjax ) {
        var newObject = data;

        if( can.useFixtures ) {
            // Everything in the fixture is what could be returned
            // So things are thrown away if they aren't there
            change( newObject, originalAjax.data );
        }

        if( can.fixture.confirmed ) {
            newObject.confirmation = true;
        }

        return newObject;
    });

    return can;

});
