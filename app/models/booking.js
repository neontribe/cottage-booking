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

            if( typeof this.attr('fromDate') !== 'string' ) {
                serialized.fromDate = this.attr('fromDate').format('YYYY-MM-DD');
            }
            if( typeof this.attr('toDate') !== 'string'  ) {
                serialized.toDate = this.attr('toDate').format('YYYY-MM-DD');
            }

            return serialized;
        },

        'fetchBooking': function( fetch ) {

            var self = this;
            // If we pass anything we can expect the deferred object to be returned, so we can attach done methods
            if( fetch ) {

                switch( typeof fetch ) {
                case 'string':

                    this.attr('bookingId', fetch);

                    return this.constructor.findOne({
                        'bookingId': fetch
                    }).done(function( booking ) {
                        self.attr( booking.attr() );
                    });

                    //break;
                case 'object':
                    this.attr( fetch );
                    return this.save().done(function () {});
                }

            } else {
                return this;
            }
        },

        'reset': function() {
            var self = this;
            this.each(function ( value, key ) {
                self.removeAttr(key);
            });
        }

    });

});