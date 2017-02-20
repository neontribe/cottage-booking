define([
    'can/util/string',
    './views',
    'resources/book',
    'models/country',
    'underscore',
    'models/booking',
    'can/control',
    'controls/form/form',
    'can/compute'
], function( can, views, booking, Country, _, Booking ) {
    'use strict';

    return can.Control({
        defaults: {
            booking: booking,
            titles: [
                ['mr', 'Mr.'],
                ['ms', 'Ms.'],
                ['dr', 'Dr.'],
                ['mrs', 'Mrs.'],
                ['other', 'Other']
            ],
            ages: [
                ['18-29', '18-29'],
                ['30-44', '30-44'],
                ['45-59', '45-59'],
                ['60+', 'Over 60']
            ],
            childAges: [
                ['2-8', '2-8'],
                ['9-12', '9-12'],
                ['13-17', '13-17']
            ],
            infantAges: [
                ['0-1' ,'0-1'],
                ['0-2', '0-2']
            ],
            // This means we will share the same country List ( note the capitol L )
            countries: new Country.List(),
            sources: [],
            notes: {
              show: false,
              title: 'Notes lipsum title',
              placeholder: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
              values: []
            },
            vouchers: {
              show: false,
              title: 'Voucher discounts',
              placeholder: 'Enter your voucher code'
            },
            deferPayment: {
              show: false,
              labels: {
                paylater: 'On tick',
                paynow: 'Up front'
              },
              'default': 'paylater'
            },
            autoPayment: {
              show: true,
              label: 'Would you like us to automatically take your balance, when it\'s due',
              labels: {
                autotakebalance: 'Oui',
                noautotakebalance: 'Non'
              }
            },
            customSelect: true,
            tncUrl: 'bar',
            primaryTravellerCheckboxLocation: 'customerName;partyDetails'
        }
    },{
        init: function() {
            var sourcesHasOther = false;
            // Perhaps this should be cached
            if( !this.options.countries.length ) {
                this.options.transit = Country.findAll().done(can.proxy(function( list ) {
                    this.options.countries.attr( list.__get() );
                }, this));
            }

            can.each(['ages', 'childAges', 'infantAges', 'titles', 'sources'], function( list ) {
                // Get the var to turn into an observed list. If they aren't arrays then
                // use the defaults
                var oldVal = this.options[ list ];
                if( oldVal.constructor !== can.List ) {
                    oldVal = can.isArray( this.options[ list ] ) ? oldVal : this.constructor.defaults[ list ];

                    this.options[ list ] = new can.List( oldVal );
                }
            }, this);

            // look for a "other" option in the list
            this.options.sources.each(function( src ) {
                return !(sourcesHasOther = ( src.attr('code') === 'other' ));
            });
            if( !sourcesHasOther ) {
                // Put an other choice in the list
                this.options.sources.unshift({
                    'code': 'other',
                    'description': 'Other'
                });
            }

            Booking.vouchers = this.options.vouchers || {};
            Booking.autopayment = this.options.autoPayment || {};

            this.element.html( views.init({
                model: this.options.booking,
                defaultLabel: true,
                views: views,
                // overwrite these with options during init
                ages: {
                    adultAges: this.options.ages,
                    childAges: this.options.childAges,
                    infantAges: this.options.infantAges
                },
                sources: this.options.sources,
                titles: this.options.titles,
                // $(controller).<plugin>('update', {})
                countries: this.options.countries,
                notes: this.options.notes,
                deferPayment: this.options.deferPayment,
                autoPayment: this.options.autoPayment,
                voucher: this.options.vouchers,
                customSelect: this.options.customSelect,
                displayTravellerCheckboxLocation: can.proxy( this.displayTravellerCheckboxLocation, this ),
                display: {
                    'pets': can.compute(function() {
                        if( this.options.booking.attr('propertyData') ) {
                            return this.options.booking.attr('propertyData').attr('pets') === true;
                        }
                        return false;
                    }, this),
                    'price.extras': can.compute(function() {
                        return !!(this.options.booking.attr('webExtras') && this.options.booking.attr('webExtras').attr('length') > 0);
                    }, this),
                    'customer.which': can.compute(function() {
                        var source = this.options.booking.attr('customer.source');

                        if( !source || source.toLowerCase() !== 'other' ) {
                            return false;
                        }
                    }, this)
                },
                disablePrimaryTrav: {
                    '**': can.compute(function() {
                        return !this.options.booking.attr('customerIsPrimaryTraveller');
                    }, this),
                    age: can.compute(function() {
                        return true;
                    }, this),
                },
                tncUrl: this.options.tncUrl
            }) );

            // jQuery('body').on('booking.booking.ok', function(el, evt, args){ console.log(arguments); });
            this.element.trigger('cottage_booking.details');
        },

        displayTravellerCheckboxLocation: function( forLocation ) {
            return this.options.primaryTravellerCheckboxLocation.indexOf( forLocation ) > -1;
        },

        destroy: function() {
            if( this.options.transit ) {
                this.options.transit.abort();
            }
            return can.Control.prototype.destroy.call( this );
        },

        '{booking} pets': function( model ) {
            if( !model.errors('pets') ) {
                model.justSaveIt();
            }
        },

        '{booking} change': function( model, evt, attr ) {
            if( 'price.extras' === attr.slice(0, 12) || attr === 'voucher' ) {
                model.justSaveIt();
            }
        },

        '{booking} formErrors': function() {
            var $scrollTop = this.element.find('.error:first');

            if( !$scrollTop.length ) {
                $scrollTop = this.element;
            }

            if(this.options.headerSelector) {
                var $headerElement = can.$(this.options.headerSelector),
                    headerHeight = $headerElement.height() || 0;

                can.$('html, body').animate({
                    scrollTop: $scrollTop.offset().top - headerHeight
                }, 350);
            } else {
                can.$('html, body').animate({
                    scrollTop: $scrollTop.offset().top
                }, 350);
            }
            debugger;
        },

        '{booking} submit': function() {
            this.options.booking.save();
        },

        '{booking} customerIsPrimaryTraveller': function( booking, evt, newVal ) {
            if( newVal ) {
                var prim = booking.attr('primaryTraveller');
                if( prim ) {
                    _.each(['firstName', 'surname', 'title'], function( attr ) {
                        prim.attr( attr, booking.attr('customer.name.' + attr ));
                    });
                }
            }
        },

        '{booking.customer.name} change': function( name, evt, attr, type, newVal ) {
            if( this.options.booking.attr('customerIsPrimaryTraveller') ) {
                this.options.booking.attr('primaryTraveller').attr( attr, newVal );
            }
        }
    });

});
