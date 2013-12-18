define(['can/util/string', 'can/model'], function(can){
    'use strict';
    return can.Model({
        findOne : 'GET property/booking/{bookingId}',
        create  : 'POST property/booking/create',
        update  : 'POST property/booking/{bookingId}'
    }, {

    });

});