define([
    'can/util/string',
    './views',
    'resources/book',
    'can/control'
], function( can, views, booking ) {
    'use strict';

    return can.Control({
        defaults: {
            booking: booking,
            deferPayment: { 
              show: false,
              labels: {
                paylater: 'Pay Later',
                paynow: 'Pay Now',
                confirmationMessage: 'Thank you for your booking'
              },
              'default': 'paylater'
            }
        }
    }, {
        init: function() {
            this.element.html( views.init({
                booking: booking,
                deferPayment: this.options.deferPayment
            }) );
        }
    });

});
