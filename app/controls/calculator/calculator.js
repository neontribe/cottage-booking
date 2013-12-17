define([
    'can/util/string',
    './views',
    'resources/enquiry',
    'moment',
    // extras
    'can/control',
    'can/control/plugin',
    'jqueryui/jquery.ui.core',
    'jqueryui/jquery.ui.datepicker'
], function( can, views, enquiry, moment ) {
    'use strict';

    // TODO:Move this to a better place
    /* globals jQuery */
    jQuery.datepicker.setDefaults({
        dateFormat: 'dd/mm/yy'
    });

    var slice = Array.prototype.slice,
        bindWithThis = function( fn, context ) {
            return function() {
                return fn.apply( context, [this].concat( slice.call( arguments ) ) );
            };
        };


    return can.Control({

        pluginName: 'booking_calculator',

        defaults: {
            enquiry: enquiry
        }
    },{
        'init' : function() {

            this.options.enquiry.attr('propRef', this.options.propRef);

            this.element.html( views.init({
                'can': can,
                'enquiry': enquiry,
                'datepickerOptions': {
                    'beforeShowDay': bindWithThis( this.beforeShowDay, this )
                }
            }));
        },

        /**
         * Datepicker beforeShowDay handler
         * @param  {HTMLElement} el     The datepicker
         * @param  {Date} date          The Date in question
         * @return {Array}              Array of data to populate [available, classe(s), tooltips?]
         */
        beforeShowDay: function( el, date ) {
            return this.options.enquiry.generateCalendarRenderArray( date );
        },

        '#depart change': function( $el ) {
            enquiry.attr('toDate', moment( $el.datepicker( 'getDate' ) ) );
        },

        '#arrive change': function( $el ) {
            enquiry.attr('fromDate', moment( $el.datepicker( 'getDate' ) ) );
        }
    });

});