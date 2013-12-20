define(['can/util/string', 'moment', 'underscore', 'can/model', 'can/map/setter'], function(can, moment, _){
    'use strict';

    // Abstract! Why not
    var dateify = function( raw ) {
        if( typeof raw === 'number' ) {
            return moment( raw * 1000 );
        } else if( typeof raw === 'string' ) {
            return moment( raw, 'YYYY-MM-DD' );
        }
        return raw;
    };

    return can.Model({
        findOne : 'GET property/booking/{bookingId}',
        create  : 'POST property/booking/create',
        update  : 'POST property/booking/{bookingId}',

        model: function( rawData ) {
            return can.Model.model.call( this, can.extend( rawData, {
                'propRef': rawData.propertyRef + '_' + rawData.brandCode,
                'fromDate': dateify( rawData.fromDate ),
                'toDate': dateify( rawData.toDate )
            }));
        },

        required: [
            'propRef',
            'fromDate',
            'toDate',
            'nights',
            'adults',
            'children',
            'infants',
            'pets'
        ]

    }, {

        'serialize': function() {
            // only include the attributes above
            var serialized = _.pick( can.Model.prototype.serialize.call( this), this.constructor.required );

            if( this.attr('fromDate') ) {
                serialized.fromDate = this.attr('fromDate').format('YYYY-MM-DD');
            }
            if( this.attr('toDate') ) {
                serialized.toDate = this.attr('toDate').format('YYYY-MM-DD');
            }

            return serialized;
        }

    });

});