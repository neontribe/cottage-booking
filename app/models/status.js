define(['can/util/string', 'can/model', 'can/compute', 'can/map/setter'], function(can){
    'use strict';

    return can.Model({
        defaults: {
            openRequests: 0
        }
    }, {

        inTransit: can.compute(function() {
            //return this.attr('openRequests') !== 0;
            return !this.attr('openRequests');
        }),

        'setOpenRequests': function( val ) {
            return this.attr('openRequests') + val;
        }

    });

});