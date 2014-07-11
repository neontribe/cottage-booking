define([
    'can/util/string',
    './views',
    'resources/enquiry',
    'resources/book',
    'moment',
    'utils',
    'spinner',
    // extras
    'can/control',
    'can/control/plugin',
    'controls/form/form',
    'can/route'
], function( can, views, enquiry, booking, moment, utils ) {
    'use strict';

    // TODO:Move this to a better place
    can.$.datepicker.setDefaults({
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
                'enquiry': this.options.enquiry,
                'datepickerOptions': {
                    'beforeShowDay': utils.bindWithThis( this.beforeShowDay, this )
                },
                'route': can.route,
                'views': views,
                'booking': this.options.booking,
                'translations': this.options.translations
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

        // Change the toDate default date to at least be relevant to what has been picked
        '{enquiry} fromDate': function( model, evt, newVal ) {
            var $form = this.element.find('.bindForm:eq(0)'),
                form;

            if( $form.length ) {
                form = $form.controls('bindForm')[0];
                newVal = newVal || this.options.enquiry.attr('avail')().attr('firstAvailableDate');
                if( newVal && form ) {
                    form.getElementsFor('toDate').datepicker( 'option', 'defaultDate', newVal.format('DD/MM/YYYY') );
                }

            }
        },

        // We kinda rely on the fact that fixtures and the server will take longer than the app to load
        // danger..
        '{enquiry.avail} change': function() {
            var $form = this.element.find('.bindForm:eq(0)'),
                form, first;

            if( $form.length ) {
                first = this.options.enquiry.attr('avail')().attr('firstAvailableDate');
                form = $form.controls('bindForm')[0];
                if( first && form ) {
                    form.getElementsFor('toDate').datepicker( 'option', 'defaultDate', first.format('DD/MM/YYYY') );
                    form.getElementsFor('fromDate').datepicker( 'option', 'defaultDate', first.format('DD/MM/YYYY') );
                }
            }
        },

        '{enquiry} submit': function() {
            // The from controller should pretect us from an invalid form state
            this.options.enquiry.make();
        },

        '{booking} saving': function() {
            this.element.addClass('loading').spin();
        },

        '{booking} saved': function() {
            this.element.removeClass('loading').spin( false );
        }
    });

});
