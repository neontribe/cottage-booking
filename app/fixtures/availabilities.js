define(['fixtures/fixtures', 'moment', 'underscore'], function( can, moment, _ ){
    'use strict';

    can.wrapFixture( 'GET property/availability/{propRef}', 'fixtures/availabilities/', function(data) {
        var keys = _.keys(data);
        var output = {};

        _.forEach(keys, function(key) {
            var date = moment(key, 'YYYY-MM-DD').year(moment().format('YYYY'));
            var newDate = date.format('YYYY-MM-DD');

            output[newDate] = _.extend(data[key], {
                id: newDate,
                date: date.unix(),
            });
        });

        return output;
    } );

});
