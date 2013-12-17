define(['can/util/string', 'can/util/string/deparam', 'jquery', 'can/util/fixture'], function(can, $){
    'use strict';
    /* globals location */
    var queryObj = can.deparam( location.search.slice(1) ),
        fixture = !queryObj.noFixture ? require.toUrl('fixtures/enquiries/enquiry_{propRef}.json') : function( options, reply ) {
            var url = can.sub('http://localhost/NeonTABS/demosite/property/{propRef}/booking/enquiry', options.data);
            $.ajax(can.extend(options, {
                url: url
            })).done(function( resp ) {
                reply( can.extend(resp, {
                    'wesentthis': options.data,
                    'wesentthisto': url
                }) );
            });
        };

    can.fixture({
        'POST tabs_property/{propRef}/booking/enquiry' : fixture
    });

    return can.fixture;

});
