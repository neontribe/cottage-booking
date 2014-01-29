/**
 * This model represents the availability for a given cottage
 * on the day stored in this model
 * TODO: Investigate whether we can just instantiate a model on the fly, rather than this
 * @return {can.Model} availability the model
 */
define(['can/util/string', 'moment', 'underscore', 'can/model', 'can/compute'], function(can, moment, _){
    'use strict';

    return can.Model({

        model: function( raw ) {
            // The date object comes through in seconds
            var date = moment( raw.date * 1000 ),
                id = date.format('YYYY-MM-DD'),
                classes = raw['class'] || '';

            return can.Model.model.call( this, can.extend(raw, {
                'id': id,
                'date': date,
                // Compact removes falsey values
                'class': _.compact( classes.split(' ') )
            }));
        }
    }, {
        'bookingStart': can.compute(function() {
            return this.attr('class.length') && _.indexOf( this.attr('class'), 'bookingStart' ) !== -1;
        })
    });

});