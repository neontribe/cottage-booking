define([
    'can/util/string',
    './views',
    'resources/book',
    'models/country',
    'can/control',
    'controls/form/form'
], function( can, views, booking, Country ) {
    'use strict';

    return can.Control({
        defaults: {
            booking: booking,
            childAge: 17,
            titles: new can.List([
                ['Mr', 'Mr.'],
                ['Ms', 'Ms.']
            ]),
            countries: new Country.List()
        }
    },{
        init: function() {
            this.options.transit = Country.findAll().done(can.proxy(function( list ) {
                this.options.countries.attr( list.__get() );
            }, this));

            this.element.html( views.init({
                model: this.options.booking,
                defaultLabel: true,
                titles: this.options.titles,
                views: views,
                ages: new can.List([
                    ['18-35'],
                    ['36-50'],
                    ['50+']
                ]),
                childAge: this.options.childAge,
                countries: this.options.countries
            }) );
        },

        destroy: function() {
            this.options.transit.abort();
            return can.Control.prototype.destroy.call( this );
        },

        '{booking.partyDetails} change': function( partyDetails, evt, attrName, type, newVal, oldVal ) {
            can.$.noop( partyDetails, evt, attrName, type, newVal, oldVal );
        },

        '{booking} submit': function() {
            this.options.booking.save();
        }
    });

});