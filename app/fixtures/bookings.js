define(['fixtures/fixtures', 'underscore'], function(can, _){
    'use strict';

    can.wrapFixture('POST property/booking/create', 'fixtures/bookings/', null, 'property-booking-d76c8badd8448cc9d1d888778966d140.json');

    can.wrapFixture('GET property/booking/{bookingId}', 'fixtures/bookings/');

    can.wrapFixture('POST property/booking/{bookingId}', 'fixtures/bookings/', function( data, status, def, originalAjax ) {
        return can.useFixtures ? can.extend( data, _.pick( originalAjax.data, _.keys( data ) ) ) : data;
    });

    return can;

});
