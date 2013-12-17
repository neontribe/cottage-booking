/**
 * This model represents the availability for a given cottage
 * @return {can.Model} availability the model
 */
define([
    'can/util/string',
    'models/availability_day',
    'moment',
    'underscore'
], function(can, AvailabilityDay, moment, _){
    'use strict';

    return can.Model({
        // TODO: Figure out some way to populate the ref correctly
        // findOne: 'GET tabs_property/{propRef}/availability',
        findOne: 'GET tabs_property/{propRef}/availability',
        // myAvailabilityStore['25-01-2013'] => {'available': false...} etc

        defaults: {
            'propRef': null
        },

        model: function( raw ) {
            var newData = can.Model.model.call( this, {} );

            can.each( raw, function( availData, key ) {
                newData.attr( key, new AvailabilityDay( availData ) );
            });

            return newData;
        }
    }, {

        isEmpty: function() {
            return _.chain( this.attr() )
                .omit( _.keys( this.constructor.defaults ) )
                .isEmpty()
                .value();
        },

        /**
         * attr function overrides the default attr behavior
         * If the attr is a date, convert it to a string
         * @return {Mixed} The value(s) found from this request
         */
        attr: function() {
            var args = can.makeArray( arguments ),
                _attr = args[0];

            if( args.length && args[0] && args[0].constructor === Date ) {
                _attr = moment( args[0] ).format( 'YYYY-MM-DD' );
            }

            return can.Model.prototype.attr.apply( this, [_attr].concat( args.slice(1) ) );
        }

    });

});