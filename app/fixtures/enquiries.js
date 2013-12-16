define(['can/util/string', 'jquery', 'can/util/fixture'], function(can, $){
    'use strict';

    can.fixture({
        //'POST tabs_property/{propRef}/booking/enquiry' : 'http://localhost/NeonTABS/demosite/property/{propRef}/booking/enquiry'
        'POST tabs_property/{propRef}/booking/enquiry': function( options, reply ) {
            var url = can.sub('http://localhost/NeonTABS/demosite/property/{propRef}/booking/enquiry', options.data);
            $.ajax(can.extend(options, {
                url: url
            })).done(function( resp ) {
                reply( can.extend(resp, {
                    'wesentthis': options.data,
                    'wesentthisto': url
                }) );
            });
        }
    });

    return can.fixture;

});
