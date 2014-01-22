define(['fixtures/fixtures', 'underscore'], function(can){
    'use strict';

    can.wrapFixture('POST property/booking/create', 'fixtures/bookings/', null, 'property-booking-d76c8badd8448cc9d1d888778966d140.json');

    can.wrapFixture('GET property/booking/{bookingId}', 'fixtures/bookings/');

    can.wrapFixture('POST property/booking/{bookingId}', 'fixtures/bookings/', function( data, status, def, originalAjax ) {
        return can.useFixtures ? can.extend( data, originalAjax.data ) : data;
    });

    return can;

});
