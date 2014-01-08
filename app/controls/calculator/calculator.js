define([
    'can/util/string',
    './views',
    'resources/enquiry',
    'resources/book',
    'moment',
    'utils',
    // extras
    'can/control',
    'can/control/plugin',
    'controls/form/form'
], function( can, views, enquiry, booking, moment, utils ) {
    'use strict';

    // TODO:Move this to a better place
    /* globals jQuery */
    jQuery.datepicker.setDefaults({
        dateFormat: 'dd/mm/yy'
    });

    return can.Control({

        pluginName: 'bookingCalculator',

        defaults: {
            enquiry: enquiry,
            booking: booking
        }
    },{
        'init' : function() {
            this.options.enquiry.attr('propRef', this.options.propRef);

            this.element.html( views.init({
                'can': can,
                'enquiry': this.options.enquiry,
                'datepickerOptions': {
                    'beforeShowDay': utils.bindWithThis( this.beforeShowDay, this )
                },
                'route': can.route,
                'views': views,
                'booking': this.options.booking
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
            this.options.enquiry.attr('toDate', moment( $el.datepicker( 'getDate' ) ) );
        },

        '#arrive change': function( $el ) {
            this.options.enquiry.attr('fromDate', moment( $el.datepicker( 'getDate' ) ) );
        },

        '{enquiry} submit': function() {
            if( !this.options.enquiry.errors() ) {
                this.options.enquiry.make();
            }
        }
    });

});