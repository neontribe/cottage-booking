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
            booking: booking
        }
    },{
        init: function() {

            var formOptions, titles;

            titles = new can.List([
                ['Mr.'],
                ['Ms.']
            ]);

            formOptions = {
                model: this.options.booking,
                defaultLabel: true,
                optionsMap: {
                    'customer.name.title': titles
                }
            };

            this.element.html( views.init({
                formOptions: formOptions
            }) );
        },

        '{booking} submit': function() {
            this.options.booking.save();
        }
    });

});