define([
    'can/util/string',
    'ejs!./views/init',
    'resources/enquiry',
    // extras
    'can/control',
    'can/control/plugin',
    'jqueryui/jquery.ui.core',
    'jqueryui/jquery.ui.datepicker'
], function( can, init, enquiry ) {
    'use strict';
    return can.Control({

        pluginName: 'booking_calculator',

        defaults: {
            enquiry: enquiry
        }
    },{
        'init' : function(){
            this.element.html(init({
                'can': can
            }));
        },

        '#depart change': function( $el ) {
            $el.val();
        }
    });

});