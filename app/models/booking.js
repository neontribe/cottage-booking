define([
    'can/util/string',
    'moment',
    'underscore',
    'models/traveller',
    'can/model',
    'can/map/validations',
    'can/map/attributes',
    'can/map/setter'
], function(can, moment, _, Traveller){
    'use strict';

    return can.Model({
        findOne : 'GET property/booking/{bookingId}',
        create  : 'POST property/booking/create',
        update  : 'POST property/booking/{bookingId}',

        attributes: {

            partyDetails: 'Traveller.models',
            fromDate: 'date',
            toDate: 'date'
        },

        convert: {
            'date': function( raw ) {
                if( typeof raw === 'number' ) {
                    return moment( raw * 1000 );
                } else if( typeof raw === 'string' ) {
                    return moment( raw, 'YYYY-MM-DD' );
                }
                return raw;
            }
        },

        'serialize': {
            date: function( val ) {
                if( val ) {
                    return val.toString('YYYY-MM-DD');
                }
            }
        },

        model: function( rawData ) {
            return can.Model.model.call( this, can.extend( rawData, {
                'propRef': rawData.propertyRef + '_' + rawData.brandCode
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
        ],

        'init': function() {
            this.validatePresenceOf( this.required );
        }

    }, {

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
                    return this.save();//.done(function () {});
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