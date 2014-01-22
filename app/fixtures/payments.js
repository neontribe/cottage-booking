define([
    'fixtures/fixtures'
], function(can){
    'use strict';

    can.wrapFixture('POST property/booking/{booking.bookingId}/pay', 'fixtures/payments/', function( data ) {
        return can.extend( data, {
            'NextURL': require.toUrl( 'fixtures/payments/sagepay.html' )
        });
    });

});
