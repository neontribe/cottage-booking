/**
 * This model represents the availability for a given cottage
 * @return {can.Model} availability the model
 */
define(['can', 'moment'], function(can, moment){
    'use strict';

    return can.Model({
        // TODO: Figure out some way to populate the ref correctly
        // findAll: 'GET tabs_property/{propRef}/availability',
        findAll: 'GET tabs_property/G430_zz/availability',

        models: function( raw ) {
            return can.Model.models.call( this, raw.data );
        },

        model: function( raw ) {
            // The dates come through in seconds from epoch, turn it into milliseconds
            var date = moment( raw.date * 1000 ),
                id = date.format('DD-MM-YYYY');

            return can.Model.model.call( this, can.extend(raw, {
                'id': id,
                'date': date
            }));
        }
    }, {});

});