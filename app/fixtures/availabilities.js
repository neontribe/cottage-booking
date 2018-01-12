define(['fixtures/fixtures', 'moment'], function( can, moment ){
    'use strict';

    can.wrapFixture( 'GET property/availability/{propRef}', 'fixtures/availabilities/', function(data) {
        var keys = Object.keys(data);
        var output = {};

        keys.forEach(function(key) {
            var date = moment(key, 'YYYY-MM-DD').year(moment().format('YYYY'));
            var newDate = date.format('YYYY-MM-DD');

            output[newDate] = Object.assign(data[key], {
                id: newDate,
                date: date.unix(),
            });
        });

        return output;
    } );

});
