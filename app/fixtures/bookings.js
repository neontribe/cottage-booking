define(['can/util/string', 'jquery', 'can/util/fixture'], function(can, $){
    'use strict';

    /* globals location */
    var queryObj = can.deparam( location.search.slice(1) ),
        fixture = !queryObj.noFixture ? require.toUrl('fixtures/bookings/booking_A223_ZZ.json') : function( options, reply ) {
            var url = 'http://localhost/NeonTABS/demosite/property/booking/create'; // Grumble
            can.fixture.on = false;
            $.ajax(can.extend(options, {
                url: url
            })).done(function( resp ) {
                reply( can.extend(resp, {
                    'wesentthis': options.data,
                    'wesentthisto': url
                }) );
            });
            can.fixture.on = true;
        },
        fixture1 = !queryObj.noFixture ? require.toUrl('fixtures/bookings/booking_A223_ZZ.json') : function( options, reply ) {
            var url = can.sub('http://localhost/NeonTABS/demosite/property/booking/{bookingId}', options.data); // Grumble
            can.fixture.on = false;
            $.ajax(can.extend(options, {
                url: url
            })).done(function( resp ) {
                reply( can.extend(resp, {
                    'wesentthis': options.data,
                    'wesentthisto': url
                }) );
            });
            can.fixture.on = true;
        };

    can.fixture({
        'POST property/booking/create' : fixture,
        'GET property/booking/{bookingId}' : fixture1,
    });

    return can;

});
