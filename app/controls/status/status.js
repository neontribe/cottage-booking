define([
    'can/util/string',
    './views',
    'models/status',
    'spinner',
    'idle',
    'can/control',
    'can/control/plugin'
], function( can, views, Status ) {
    'use strict';

    return can.Control({

        pluginName: 'bookingStatus',

        defaults: {
            booking: null,
            idleTime: 1000
            // Some sort of model to represent that state of this
            // so saving: true has some effect etc
            // Yay for spinners
        }
    },{

        init: function() {
            var $doc = can.$( window.document );

            this.options.status = new Status();

            this.element.addClass('status-display').html( views.init({
                control: this,
                status: this.options.status,
                spinOptions: {}
            }) );

            $doc.idleTimer( this.options.idleTime );
        },

        '{window.document} ajaxSend': function() {
            this.options.status.attr({
                'openRequests': 1,
                'complete': false
            });
        },

        '{window.document} ajaxComplete': function() {
            if( this.options.status.attr('openRequests') > 0 ) {
                this.options.status.attr('openRequests', -1);
            }
        },

        '{window.document} ajaxStop': function() {
            this.options.status.attr({
                'openRequests': 0,
                'complete': true
            });
        },

        transport: null,
        '{window} idle.idleTimer':function() {

            this.transport = this.options.booking.save()
                .done( can.proxy( this.bookingSaveSuccess, this ) )
                .fail( can.proxy( this.bookingSaveFail, this ) );
        },

        bookingSaveSuccess: function() {
            // debugger;
        },

        bookingSaveFail: function() {
            // debugger;
        },

        '{booking} updated': function() {
            // Handle error display here
        }

    });

});