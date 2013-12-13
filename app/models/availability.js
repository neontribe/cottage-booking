/**
 * This model represents the availability for a given cottage
 * @return {can.Model} availability the model
 */
define(['can', 'models/availability_day', 'moment'], function(can, AvailabilityDay, moment){
    'use strict';

    return can.Model({
        // TODO: Figure out some way to populate the ref correctly
        // findOne: 'GET tabs_property/{propRef}/availability',
        findOne: 'GET tabs_property/A223_ZZ/availability',
        // myAvailabilityStore['25-01-2013'] => {'available': false...} etc

        model: function( raw ) {
            var newData = can.Model.model.call( this, {} );

            can.each( raw, function( availData, key ) {
                newData.attr( key, new AvailabilityDay( availData ) );
            });

            return newData;
        }
    }, {

        /**
         * attr function overrides the default attr behavior
         * If the attr is a date, convert it to a string
         * @return {Mixed} The value(s) found from this request
         */
        attr: function() {
            var args = can.makeArray( arguments ),
                _attr = args[0];

            if( args.length && typeof args[0] !== 'string' ) {
                _attr = moment( args[0] ).format('YYYY-MM-DD');
            }

            return can.Model.prototype.attr.apply( this, [_attr].concat( args.slice(1) ) );
        }

    });

});