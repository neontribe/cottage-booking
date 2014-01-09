define(['can/util/string', 'jquery', 'moment', 'can/util/string/deparam', 'can/util/fixture'], function(can, $, moment){
    'use strict';
    /* globals location */
    var queryObj = can.deparam( location.search.slice(1) ),
        fixture = !queryObj.noFixture ? function( options, reply ) {

            var fromDate = moment( options.data.fromDate, 'YYYY-MM-DD' ),
                url;

            if( (fromDate.get('M') + 1) % 2 === 0 ) {
                url = require.toUrl('fixtures/enquiries/enquiry_A223_ZZ_error.json');
            } else {
                url = require.toUrl('fixtures/enquiries/enquiry_A223_ZZ.json');
            }
            can.fixture.on = false;
            $.get( url ).done( reply );
            can.fixture.on = true;

        } : function( options, reply ) {
            var url = 'http://localhost/NeonTABS/demosite/property/booking/enquiry'; // Grumble
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
        'POST property/booking/enquiry' : fixture
    });

    return can.fixture;

});
