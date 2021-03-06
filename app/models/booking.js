define([
    'can/util/string',
    'moment',
    'underscore',
    'utils',
    'models/travellers',
    'models/web_extra',
    'models/price',
    'can/model',
    'can/map/validations',
    'can/map/attributes',
    'can/compute'
], function(can, moment, _, utils, Traveller, WebExtra, Price ){
    'use strict';

    // Simple email regex
    // Shamelessly stolen from the AllegiantJSUI email validation..
    var emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,6}$/;

    return can.Model({
        findOne : utils.getResource('GET property/booking/{bookingId}'),
        create  : utils.getResource('POST property/booking/create'),
        update  : utils.getResource('POST property/booking/{bookingId}'),

        // We need empty objects for the magic ejs binding
        // It tries to bind to the model, if it's undefined it will
        // never update
        defaults: {
            webExtras: [],
            customer: {
                address: {
                    country: 'GB'
                },
                name: {}
            },
            payLater: 'false',
            voucher: '',
            propertyData: {},
            webVouchers: {}
        },

        id: 'bookingId',

        attributes: {
            partyDetails: Traveller,
            fromDate: 'date',
            toDate: 'date',
            webExtras: 'WebExtra',
            // We need to change our model is read and added to the booking
            price: Price,
            totalDueOn: 'date',
            secDepDueOn: 'date',
            payLater: 'string',
            autopayment: 'string'
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
                /* default is a reserved word.. */
                return this.convert['default'].apply( this, arguments );
            },
            'string': function( raw ) {
                return '' + raw;
            }
        },

        vouchers: {},

        autopayment: {},

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
            // these are required to complete a booking
            'customer.name.title',
            'customer.name.firstName',
            'customer.name.surname',
            'customer.address.addr1',
            'customer.address.town',
            //'customer.address.county',
            'customer.address.postcode',
            'customer.address.country',
            'customer.daytimePhone',
            //'customer.eveningPhone',
            //'customer.mobilePhone',
            'customer.email',
            'customer.emailConf',
            'customer.tnc',
            // this needs to be last
            'customer.source'
        ],

        'init': function() {
            var self = this;

            this.validatePresenceOf( this.required.slice(0, -1), {
                'message': 'The {label} field is required'
            });

            this.validatePresenceOf( this.required.slice(-1), {
                message: 'Please let us know where you heard about us'
            });

            this.validate(['adults', 'children', 'infants'], function() {
                // now hokey logic to allow propertyData.sleeps + 1 infant
                var adults = [];
                var children = [];
                var infants = [];
                if (this.attr('partyDetails') !== undefined && this.attr('partyDetails').length > 0 ) {
                  can.$.each(this.attr('partyDetails'), function (index, member){
                    switch (member.type) {
                      case 'infant':
                        infants.push(member);
                        break;
                      case 'child':
                        children.push(member);
                        break;
                      default:
                      case 'adult':
                        adults.push(member);
                        break;
                    }
                  });

                  if (typeof can.getObject('Drupal.behaviors.neontabs.validators.booking.partySize') === 'function') {
                        var validated = Drupal.behaviors.neontabs.validators.booking.partySize(adults, children, infants);
                        if (validated !== true) {
                         return validated.errorMessage;
                     }
                  } else { // fail over to default (broken?) behaviour
                    /*
                    According to alex castle any number of infants can be added to a property:
                    "
                    tabs and the API will allow you to book 4 adults 2 children
                    and 20 infants for a slps 6 property the age they consider
                    infants is up to them Ie do they become a child at one or 2
                    and the number allowed I assume is property specific using
                    A4293 as an example its a sleeps 2 but the only place I can
                    see info on kids is the description it says Please note:
                    Infants under 1 welcome but sorry no children.  they appear
                    to have a children allowed attribute maybe they need to set
                    something up for infants then you will at least be able to
                    see in api other than in description
                    "
                    So I'm going to disable existing logic and replace it with a straight adults + children check

                    if (adults.length + children.length === this.attr('propertyData.sleeps')) {
                      if (infants.length > 1) {
                        return 'The property only excepts one additional infant.';
                      }
                    }
                    // quick check
                    if( this.attr('partySize') > this.attr('propertyData.sleeps') && infants.length < 1 ) {
                        return 'The party size exceeds the maximum size this property can accommodate';
                    }
                    */
                    if (adults.length + children.length > this.attr('propertyData.sleeps')) {
                        return 'The party size exceeds the maximum size this property can accommodate';
                    }
                  }
                }
            });

            this.validate(['pets'], function( val ) {
                if( val > this.attr('propertyData.numberOfPets') ) {
                    return 'Sorry, the property does not allow that many pets';
                }

                if (val < 0) {
                    return 'Invalid number of pets';
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

            this.validate('customer.email', function( email ) {
                email = can.$.trim( email );
                if( email ) {
                    if( !emailRegex.test( email ) ) {
                        return 'Please enter a valid email address';
                    }
                }
            });

            this.validate('customer.emailConf', function( email ) {
                var oEmail = this.attr('customer.email');
                if( oEmail && ( !email || oEmail.toLowerCase() !== email.toLowerCase() ) ) {
                    return 'The two emails don\'t match';
                }
            });

            this.validate([ 'customer.daytimePhone', 'customer.eveningPhone', 'customer.mobilePhone' ], function( number ) {
                number = can.$.trim( number );
                if( number ) {
                    // strip white space before testing
                    if( number.length < 6 ) {
                        return 'This field needs to be at least 6 characters';
                    }
                }
            });

            this.validate('customer.tnc', function( ticked ) {
                if( !ticked ) {
                    return 'You must accept the Terms and Conditions to proceed.';
                }
            });

            this.validate('voucher', function( code ) {
                if( code && self.vouchers.show ) {
                    var codes = this.webVouchers;
                    if( codes && !codes[code] ) {
                        return 'Invalid voucher code.';
                    }
                }
            });

            this.validate('autopayment', function( option ) {
                if (self.autopayment.show && option !== "false" && option !== "true") {
                    return 'Please select an option.';
                }
            });

            this.validate('waiting', function() {
                if (this.transit) {
                    return true;
                }
            });
        }

    }, {

        'init': function() {
            this.on( 'partySize', can.proxy( this.partyChangeHandler, this ) );
        },

        // Because we can easily save to the server with empty values
        // But not with incorrect ones, proxy those checks here so that we can
        // Save the current state to the server
        // And simply do on('idle', function() {
        //     !booking.canSave() && booking.save()
        //      if errors then update the status box
        // })
        'canSave': function() {
            var err = {};
            can.each(['daytimePhone', 'eveningPhone', 'mobilePhone', 'email'], can.proxy(function( valid ) {
                var toTest =  'customer.' + valid,
                    val = this.attr( toTest );
                // if we have a value and we have an error it means we need to report on it
                if( val && this.errors(toTest) ) {
                    can.extend( err, this.errors(toTest) );
                }
            }, this));

            return can.$.isEmptyObject( err ) ? null : err;
        },

        'justSaveIt': function() {
            var errors = this.canSave(),
                self = this,
                badValues;

            if( this.attr('bookingId') ) {
                if( errors ) {

                    errors =  _.keys( errors );
                    badValues = utils.modelPick( this, errors );
                    // This is awesome
                    can.batch.start();

                    for (var i = 0; i < errors.length; i++) {
                        this.removeAttr( errors[i] );
                    }

                    // listen for changes to properties in errors []
                    // update a cached {} value with the newest props.
                    // When this.save() finishes re-apply the error-cache values
                    var p = this.save().always(function() {
                        self.attr(badValues);
                    });

                    self.attr(badValues);
                    can.batch.stop();

                    return p;
                } else {
                    return this.save();
                }
            }

        },

        'getPayingLater': can.compute(function() {
            return this.attr('payLater') === 'true';
        }),

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
            return _.omit( serialized, 'webExtras', 'payment', 'transit' );
        },

        'canPayDeposit': can.compute(function() {
            var date = this.attr('totalDueOn');
            return date > utils.now();
        }),

        'securityDepositDueNow': can.compute(function() {
            return this.attr('secDepDueOn') < utils.now();
        }),

        'partyChangeHandler': function() {
            this.matchTravCountToPartyDetails();
        },

        // Naming things is hard dude
        matchTravCountToPartyDetails: function() {
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
                        // and also, we throw away anything that doesn't back in the resp
                        var confEmail = {};

                        if (booking.attr('customer.email')) {
                            confEmail = {
                                'customer': {
                                    'emailConf': booking.attr('customer.email')
                                }
                            };
                        }

                        var bookingData = can.$.extend( true, booking.attr(), confEmail);

                        self.attr( bookingData, true );

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

        'primaryTraveller': can.compute(function() {
            var party = this.attr('partyDetailsTypes');
            return party.adults ? party.adults[0] : null;
        }),

        'canBookExtras': can.compute(function() {
            var extras = this.attr('webExtras') && this.attr('webExtras').attr('length'),
                pets = this.attr('propertyData') && this.attr('propertyData').attr('pets');
            return extras || pets;
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

        /**
         * We overwrite the save function here so that we only ever make one a save request at a time.
         * Otherwise we return the deferred in transit.
         * @return {$.Deferred} The deferred object in transit
         */
        transit: null,
        save: function save() {
            var self = this;

            // if we are already in transit make sure to abort the request
            // and return the new one
            if( this.transit ) {
                this.transit.abort();
                this.transit = null;

                return save.apply( this, arguments );
            }

            can.trigger( this, 'saving' );

            this.transit = can.Model.prototype.save.apply( this, arguments ).always(function() {
                self.transit = null;
                // Make sure that we update the party details to the number of travs
                self.matchTravCountToPartyDetails();
                can.trigger( self, 'saved' );
            }).done(function () {
                can.$(self).triggerHandler('savesuccess');
            });

            return this.transit;
        },

        // In most cases we need to clear this error before continuing
        // So we just remove it
        'clearServerError': function() {
            this.removeAttr('status');
        }

    });

});
