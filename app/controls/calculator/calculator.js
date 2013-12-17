define([
    'can/util/string',
    'ejs!./views/init',
    'resources/enquiry',
    'moment',
    // extras
    'can/control',
    'can/control/plugin',
    'jqueryui/jquery.ui.core',
    'jqueryui/jquery.ui.datepicker'
], function( can, init, enquiry, moment ) {
    'use strict';

    // TODO:Move this to a better place
    /* globals jQuery */
    jQuery.datepicker.setDefaults({
        dateFormat: 'dd/mm/yy'
    });

    return can.Control({

        pluginName: 'booking_calculator',

        defaults: {
            enquiry: enquiry
        }
    },{
        'init' : function(){
            this.element.html(init({
                'can': can,
                'enquiry': enquiry
            }));
        },

        '#depart change': function( $el ) {
            enquiry.attr('toDate', moment( $el.datepicker( 'getDate' ) ));
        },

        '#arrive change': function( $el ) {
            enquiry.attr('fromDate', moment( $el.datepicker( 'getDate' ) ));
        }
    });

});