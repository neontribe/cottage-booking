define([
    'can/util/string',
    'moment',
    'underscore',
    'models/travellers',
    'models/web_extra',
    'models/price',
    'can/model',
    'can/map/validations',
    'can/map/attributes',
    'can/compute'
], function(can, moment, _, Traveller, WebExtra, Price ){
    'use strict';

    return can.Model({
        findOne : 'GET property/booking/{bookingId}',
        create  : 'POST property/booking/create',
        update  : 'POST property/booking/{bookingId}',

        // We need empty objects for the magic ejs binding
        // It tries to bind to the model, if it's undefined it will
        // never update
        defaults: {
            webExtras: [],
            customer: {
                address: {},
                name: {}
            }
        },

        attributes: {
            partyDetails: Traveller,
            fromDate: 'date',
            toDate: 'date',
            webExtras: 'WebExtra',
            // We need to change our model is read and added to the booking
            price: Price
        },

        convert: {
            'date': function( raw ) {
                if( typeof raw === 'number' ) {
                    return moment( raw * 1000 );
                } else if( typeof raw === 'string' ) {
                    return moment( raw, 'YYYY-MM-DD' );
                }
                return raw;
            },
            'WebExtra': function( val, oldVal ) {
                if( oldVal && oldVal.constructor === WebExtra.List ) {

                    if( val && can.isArray( val ) ) {
                        return oldVal.attr( val );
                    }

                }
                return this.convert.default.apply( this, arguments );
            }
        },

        'serialize': {
            date: function( val ) {
                if( val ) {
                    return val.format('YYYY-MM-DD');
                }
            }
        },

        model: function( rawData ) {
            return can.Model.model.call( this, can.extend( rawData, {
                'propRef': rawData.propertyRef + '_' + rawData.brandCode
            }));
        },

        required: [
            // this are required to make a booking
            'propRef',
            'fromDate',
            'toDate',
            'adults',
            'children',
            'infants',
            'pets',
            // these are required to complete a booking
            'customer.name.title',
            'customer.name.firstName',
            'customer.name.surname',
            'customer.address.addr1',
            'customer.address.addr2',
            'customer.address.town',
            'customer.address.county',
            'customer.address.postcode',
            'customer.address.country',
            'customer.daytimePhone',
            'customer.eveningPhone',
            'customer.mobilePhone',
            'customer.email',
            'customer.source'
        ],

        'init': function() {
            this.validatePresenceOf( this.required,{
                'message': 'The {label} field is required'
            });

            this.validate(['adults', 'children', 'infants'], function() {
                if( this.attr('partySize') > this.attr('propertyData.sleeps') ) {
                    return 'The party size exceeds the maximum size this property can accommodate';
                }
            });

            this.validate('status', function( status ) {
                if( status && status !== 'ok' ) {
                    return this.attr('message') || 'An unknown error occurred';
                }
            });

            this.validate('customer.which', function( which ) {
                if( this.attr('customer.source') === 'other' && !which ) {
                    return 'The {label} field is required';
                }
            });

            this.validate('customer.emailConf', function( email ) {
                if( this.attr('customer.email') && this.attr('customer.email') !== email ) {
                    return 'The two emails don\'t match';
                }
            });

            this.validate('canSave', function() {
                // TODO
                // Because we can easily save to the server with empty values
                // But not with incorrect ones, proxy those checks here so that we can
                // Save the current state to the server
                // And simply do on('idle', function() {
                //     !booking.errors('canSave') && booking.save()
                //      if errors then update the status box
                // })
            });
        }

    }, {

        'init': function() {
            this.on( 'partySize', can.proxy( this.partyChangeHandler, this ) );
        },

        'serialize': function() {
            var serialized = can.Model.prototype.serialize.call( this );
            // Standard booking object, some of this we can omit
            // "webExtras",
            // "customer",
            // "bookingId",
            // "id",
            // "propertyRef",
            // "brandCode",
            // "fromDate",
            // "toDate",
            // "adults",
            // "children",
            // "infants",
            // "partyDetails",
            // "pets",
            // "confirmation",
            // "payments",
            // "notes",
            // "price",
            // "totalPrice",
            // "propRef"
            return _.omit( serialized, 'webExtras', 'payment' );
        },

        'partyChangeHandler': function() {
            var mutate = {};

            can.trigger( this, 'partyDetailsUpdating' );

            // Why not set a default in the model?
            if( !this.attr('partyDetails') ) {
                this.attr('partyDetails', []);
            }

            can.each( _.pick( this, _.keys( Traveller.types ) ), function( value, key ) {
                mutate[ Traveller.types[key] ] = parseInt( value, 10 );
            });

            this.attr('partyDetails').mutate( mutate );
            can.trigger( this, 'partyDetailsUpdated' );
        },

        'destroy': function() {
            this.off('partySize');

            return can.Model.prototype.destroy.call( this );
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
                        //self.attr( booking.__get() ); Why did i do this
                        // The following call does mean that we instantiate and throw away stuff ( like travellers )
                        self.attr(booking.attr(), true);
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
        },

        'partySize': can.compute(function() {
            // TODO: use the Traveller.types static object keys
            return this.attr('adults') + this.attr('children') + this.attr('infants');
        }),

        'spaceLeft': can.compute(function() {
            return this.attr('propertyData.sleeps') - this.attr('partySize');
        }),

        'partyDetailsTypes': can.compute(function() {
            var lookup;
            if( this.attr('partyDetails') && this.attr('partyDetails').attr('length') ) {
                lookup = _.invert( Traveller.types );
                return _.object( _.map( this.attr('partyDetails').type(), function(val, key) {
                    return [lookup[key], val];
                }) );
            }
            return [];
        }),

        /**
         * This function manually compiles a list of _all_ errors because
         * the error generation for lists of models and sub models isn't complete
         * :-(
         * See: https://github.com/bitovi/canjs/pull/434
         * @return {Object}     The state of errors for this model
         */
        'errors': function() {
            var errors = can.Model.prototype.errors.apply( this, arguments ) || {};

            if( errors && !arguments.length && this.attr('partyDetails.length') ) {
                this.attr('partyDetails').each(function( item, index ) {
                    var errs = item.errors();
                    if( errs ) {
                        can.each( errs, function( err, errKey ) {
                            errors[can.sub('partyDetails.{index}.{key}', {
                                index: index,
                                key: errKey
                            })] = err;
                        });
                    }
                });
            }

            return can.isEmptyObject( errors ) ? null : errors;
        },

        // In most cases we need to clear this error before continuing
        // So we just remove it
        'clearServerError': function() {
            this.removeAttr('status');
        }

    });

});