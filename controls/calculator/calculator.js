define([
    'can',
    'ejs!./views/init',
    'can/control',
    'resources/enquiry',
    'jqueryui/jquery.ui.core',
    'jqueryui/jquery.ui.datepicker'
], function( can, init, enquiry ) {
    'use strict';

    return can.Control({
        defaults: {
            enquiry: enquiry
        }
    },{
        'init' : function(){
            this.element.html(init({
                'can': can,
                'datepickerOptions': {
                    'dateFormat': 'dd/mm/yy'
                }
            }));
        },

        '#depart change': function( $el ) {
            $el.val();
            debugger;
        }
    });

});