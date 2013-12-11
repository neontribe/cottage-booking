define([
    'can',
    // THE PATHING IS FUCKED                                                                        !!!!!!
    // define('ejs!controls/calendar/init',['can/view/ejs', 'can/observe'], function(can){ return undefined });
    'ejs!./views/init',
    'can/control',
    'can/control/plugin',
    'resources/enquiry',
    'jqueryui/jquery.ui.core',
    'jqueryui/jquery.ui.datepicker'
], function( can, init, enquiry ) {
    'use strict';

    return can.Control({

        pluginName: 'calculator',

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