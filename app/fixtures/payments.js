define([
    'fixtures/fixtures'
], function(can){
    'use strict';

    can.wrapFixture('POST property/booking/{booking.bookingId}/pay', 'fixtures/payments/', function( data, status, xhr, ajaxObj ) {
        if( can.useFixtures ) {
            return can.extend( data, {
                'NextURL': require.toUrl( 'fixtures/payments/sagepay.html?bookingId=' + ajaxObj.data['booking\\.bookingId'] )
            });
        }
        return data;
    });

});
