define([
    'can',
    'ejs!./views/init',
    'can/control',
    'models/enquiry',
    'jqueryui/jquery.ui.core',
    'jqueryui/jquery.ui.datepicker'
], function( can, init ) {
    'use strict';
    return can.Control({
        defaults: {

        }
    },{
        'init' : function(){
            this.element.html(init({
                'can': can
            }));
        },

        '#depart change': function( $el ) {
            $el.val();
            debugger;
        }
    });

});