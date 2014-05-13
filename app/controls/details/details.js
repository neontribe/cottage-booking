define([
    'can/util/string',
    './views',
    'resources/book',
    'models/country',
    'can/control',
    'controls/form/form',
    'can/compute'
], function( can, views, booking, Country ) {
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
            customSelect: true
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
                customSelect: this.options.customSelect,
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
                }
            }) );
        },

        destroy: function() {
            if( this.options.transit ) {
                this.options.transit.abort();
            }
            return can.Control.prototype.destroy.call( this );
        },

        '{booking} pets': function( model ) {
            model.justSaveIt();
        },

        '{booking} change': function( model, evt, attr ) {
            if( 'price.extras' === attr.slice(0, 12) ) {
                model.justSaveIt();
            }
        },

        '{booking} formErrors': function() {
            can.$('html, body').animate({
                scrollTop: this.element.offset().top
            }, 350);
        },

        '{booking} submit': function() {

            this.options.booking.save();
        }
    });

});
