define([
    'can/util/string',
    './views',
    'resources/book',
    'models/payment',
    'utils',
    // extras
    'spinner',
    'can/control',
    'can/control/plugin',
    'controls/form/form'
], function( can, views, booking, Payment, utils ) {
    'use strict';
    
    return can.Control({
        defaults: {
            booking: booking,
            payment: null,
            canPayLater: false,
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
                payment:        this.options.payment,
                options:        this.options,
                choices:        this.options.depositChoices,
                canPayLater:    this.options.canPayLater
            }) );

            this.updatePayment();

            this.on();
        },

        /**
         * This function is used to reset the control to contain 
         *
         * use bindAndCallAfter to call the function after
         * the rest of the page has rendered
         * 
         * @return {Number} The number returned by the setTimeout
         */
        updatePayment: utils.bindAndCallAfter(function() {
            var $holder = this.element.find('.iframe-holder'),
                $root = this.element;

            $holder
                .spin()
                .find('> iframe')
                    .remove();

            this.options.booking.save().done(can.proxy(function() {
                this.options.payment
                    .reset()
                    .save()
                    .done(function( payment ) {
                        $holder.spin(false);
                        if( payment.errors('Status') ) {
                            $root.html( views.error({
                                'errors': payment.errors('Status').Status
                            }) );
                        }
                    })
                    .fail(function( reply ) {

                        var view = views['booking' + reply.status] || views.booking404;

                        $holder.spin( false );
                        $root.html( view() );
                    });

            }, this));
        }),

        '{booking} bookingId': function( model, evt, newVal ) {
            if( newVal !== this.options.payment.attr('id') ) {
                this.options.payment.attr( 'id', newVal );
                this.updatePayment();
            }
        },

        '.pay-later click': function() {
            // TODO
            alert('I haven\'t implemented this yet');
        },

        '{payment} paymentType': function( model, evt, newVal ) {
            this.options.booking.attr('price.paymentType', newVal);
            this.updatePayment();
        },

        '{window} message': function( win, evt ) {
            var message = JSON.parse( evt.originalEvent.data );

            switch( message.action ) {
            case 'autoadvance':
                this.options.booking.save();
                break;
            case 'back':
                can.trigger( can.route.data, 'back', [ can.route.attr() ] );
                break;
            case 'retry':
                this.updatePayment();
                break;
            default:
                this.element.html( views.error({
                    errors: [message.message]
                }));
                break;
            }
        }

    });

});