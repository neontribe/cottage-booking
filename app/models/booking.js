define(['can/util/string', 'moment', 'can/model'], function(can, moment){
    'use strict';
    return can.Model({
        findOne : 'GET property/booking/{bookingId}',
        create  : 'POST property/booking/create',
        update  : 'POST property/booking/{bookingId}',

        model: function( rawData ) {
            return can.Model.model.call( this, can.extend( rawData, {
                'fromDate': moment( rawData.fromDate * 1000 ),
                'toDate': moment( rawData.toDate * 1000 ),
                'propRef': rawData.id
            }));
        }

    }, {

    });

});