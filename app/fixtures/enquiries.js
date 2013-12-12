define(['can/util/string', 'can/util/fixture'], function(can){
    'use strict';

    can.fixture({
        'POST tabs_property/{propRef}/booking/enquiry' : function() {
            console.log.apply(console, arguments);
        }
    });

    return can.fixture;

});