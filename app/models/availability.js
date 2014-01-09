/**
 * This model represents the availability for a given cottage
 * @return {can.Model} availability the model
 */
define([
    'can/util/string',
    'models/availability_day',
    'moment',
    'underscore',
    'utils',
    'can/model',
    'can/compute'
], function(can, AvailabilityDay, moment, _, utils){
    'use strict';

    return can.Model({
        findOne: 'GET property/availability/{propRef}',
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

        firstAvailableDate: can.compute(function() {
            var current = utils.now(),
                availDate;

            this.each(function() {
                var date = this.attr( current.format('YYYY-MM-DD') );

                if( date && date.attr && date.attr('available') ) {
                    availDate = current;
                    return false;
                }

                current.add('d', 1);
            }, this);

            return availDate;
        }),

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