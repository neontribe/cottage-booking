define([
    'can',
    'ejs!./views/init',
    'can/control',
    'can/control/plugin',
    'resources/enquiry',
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
                'can': can,
                'datepickerOptions': {

                }
            }));
        },

        '#depart change': function( $el ) {
            $el.val();
        }
    });

});