define([
    'can/util/string',
    './views',
    'resources/book',
    'can/control'
], function( can, views, booking ) {
    'use strict';

    return can.Control({
        defaults: {
            booking: booking
        }
    }, {
        init: function() {
            this.element.html( views.init() );
        }
    });

});