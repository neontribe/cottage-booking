define([
    'can/util/string',
    './views',
    'resources/book',
], function(can, views, booking) {
    'use strict';

    return can.Control({},{
        init: function() {
            this.element.html( views.init() );
        }
    });

});