define([
    'can/util/string',
    'jquery',
    'can/util/string/deparam',
    'can/util/fixture'
], function(can, $){
    'use strict';
    /* globals location */
    var queryObj = can.deparam( location.search.slice(1) ),
        fixture = function( options, reply ) {
            var url = !queryObj.noFixture ? require.toUrl('fixtures/payments/payment.json') :
                    can.sub('//public2.neontribe.co.uk/NeonTABS/demosite/property/booking/{booking.bookingId}/pay', options.data),
                ajaxObj = can.extend(options, {
                    url: url
                }); // Grumble

            if( !queryObj.noFixture ) {
                can.extend(ajaxObj, {
                    'type': 'get'
                });
            }

            can.fixture.on = false;
            $.ajax( ajaxObj ).done(function( resp ) {
                var data = can.extend(true, resp, {
                    'NextURL': require.toUrl('fixtures/payments/sagepay.html')
                });
                reply( data );
            }).fail( reply );
            can.fixture.on = true;
        };

    can.fixture({
        'POST property/booking/{booking.bookingId}/pay': fixture
    });

});