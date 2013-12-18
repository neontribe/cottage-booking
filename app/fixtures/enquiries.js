define(['can/util/string', 'jquery', 'can/util/string/deparam', 'can/util/fixture'], function(can, $){
    'use strict';
    /* globals location */
    var queryObj = can.deparam( location.search.slice(1) ),
        fixture = !queryObj.noFixture ? require.toUrl('fixtures/enquiries/enquiry_A223_ZZ.json') : function( options, reply ) {
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
