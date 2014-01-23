define([
    'can/util/string',
    './views',
    'resources/book',
    'models/payment',
    // extras
    'spinner',
    'can/control',
    'can/control/plugin',
    'controls/form/form'
], function( can, views, booking, Payment ) {
    'use strict';
    
    return can.Control({
        defaults: {
            booking: booking,
            payment: null,
            canPayLater: true,
            canDeposit: true,
            depositChoices: [
                ['balance', 'Pay the full amount'],
                ['deposit', 'Pay by deposit']
            ]
        }
    }, {
        init: function() {
            this.options.payment = new Payment({
                id: this.options.booking.attr('bookingId'),
                'payLater': false,
                // balance: pay the full amount
                // deposit: just pay the deposit
                'paymentType': 'balance'
            });
            this.options.depositChoices = new can.List( this.options.depositChoices );

            this.element.html( views.init({
                payment: this.options.payment,
                options: this.options,
                choices: this.options.depositChoices
            }) );

            this.options.payment.save();

            this.on();
        },

        '{booking} bookingId': function( model, newVal ) {
            if( newVal !== this.options.payment.attr('id') ) {
                this.options.payment.attr( 'id', newVal );
                this.options.payment.save();
            }
        },

        '{payment} paymentType': function() {
            this.options.payment.save();
        }

    });

});