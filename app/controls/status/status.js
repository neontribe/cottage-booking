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