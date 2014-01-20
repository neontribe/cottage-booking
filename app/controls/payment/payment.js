define([
    'can/util/string',
    './views',
    'resources/book',
    'models/payment',
    // extras
    'can/control',
    'can/control/plugin',
    'controls/form/form'
], function( can, views, booking, Payment ) {
    'use strict';
    
    return can.Control({
        defaults: {
            booking: booking,
            payLater: true
        }
    }, {
        init: function() {
            var payment = new Payment();

            this.element.html( views.init({
                'model': payment
            }));
        }
    });

});