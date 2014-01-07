define([
    'can/util/string',
    './views',
    'resources/book',
    'can/control',
    'controls/form/form'
], function(can, views, booking) {
    'use strict';

    return can.Control({
        defaults: {
            booking: booking,
            childAge: 17
        }
    },{
        init: function() {

            var titles;

            titles = new can.List([
                ['Mr', 'Mr.'],
                ['Ms', 'Ms.']
            ]);

            this.element.html( views.init({
                model: this.options.booking,
                defaultLabel: true,
                titles: titles,
                views: views,
                ages: new can.List([
                    ['18-35'],
                    ['36-50'],
                    ['50+']
                ]),
                childAge: this.options.childAge
            }) );
        },

        '{booking.partyDetails} change': function( partyDetails, evt, attrName, type, newVal, oldVal ) {
            can.$.noop( partyDetails, evt, attrName, type, newVal, oldVal );
        },

        '{booking} submit': function() {
            this.options.booking.save();
        }
    });

});