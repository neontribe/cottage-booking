define([
    'can/util/string',
    './views',
    'resources/book',
    'spinner',
    'idle',
    'can/control'
], function( can, views, booking ) {
    'use strict';

    return can.Control({

        defaults: {
            booking: booking
            // Some sort of model to represent that state of this
            // so saving: true has some effect etc
            // Yay for spinners
        }
    },{

        init: function() {
            this.element.html( views.init() );

            can.$( window.document ).idleTimer( 1000 );
        },

        '{window} idle.idleTimer':function() {

            this.options.booking.save();
        },

        '{booking} updated': function() {
            // Handle error display here
        }

    });

});