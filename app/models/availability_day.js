/**
 * This model represents the availability for a given cottage
 * on the day stored in this model
 * TODO: Investigate whether we can just instantiate a model on the fly, rather than this
 * @return {can.Model} availability the model
 */
define(['can', 'moment'], function(can, moment){
    'use strict';

    return can.Model({

        model: function( raw ) {
            // The date object comes through in seconds
            var date = moment( raw.date * 1000 ),
                id = date.format('YYYY-MM-DD');

            return can.Model.model.call( this, can.extend(raw, {
                'id': id,
                'date': date
            }));
        }
    }, {});

});