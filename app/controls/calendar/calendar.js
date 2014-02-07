define([
    'can/util/string',
    'moment',
    './views',
    'resources/enquiry',
    'utils',
    // extras
    'can/control',
    'jqueryui/jquery.ui.datepicker',
    'jqueryui/jquery.ui.tooltip'
], function(can, moment, views, enquiry, utils) {
    'use strict';

    return can.Control({

        defaults: {
            enquiry: enquiry
        }
    },{
        init: function() {
            this.element.html( views.init({
                datepickerOptions: {
                    // TODO: recalculate this when we resize
                    'numberOfMonths': [2,2],
                    //'showButtonPanel': true,
                    // Use apply to enhance the onSelect callback, providing the dom element
                    // which contains the datepicker as an extra argument to the onSelect function
                    'onSelect': utils.bindWithThis( this.onSelect, this ),
                    'beforeShowDay': utils.bindWithThis( this.beforeShowDay, this )
                }
            }));
        },

        /**
         * Datepicker onSelect handler
         * @param  {HTMLElement} el          The Dom element which contains the datepicker
         * @param  {String} dateString       String representation of the date
         * @param  {Object} datepickerObject The object containing date on the datepicker
         * @return {undefined}
         */
        onSelect: function( el/*, dateString, datepickerInst*/ ) {
            var date = moment( can.$(el).datepicker('getDate' ) ),
                enq = this.options.enquiry,
                fromDate = enq.attr('fromDate'),
                toDate = enq.attr('toDate');

            // hehehehe...
            //
            this.ignoreRedraw = true;

            // TODO: neatify, this was the first take of this behaviour, I think it could be done better
            if( !fromDate || ( fromDate && toDate ) ) {
                enq.attr('toDate', null);
                enq.attr('fromDate', date);
            } else {
                if( !toDate ) {
                    if( date < fromDate ) {
                        enq.attr('fromDate', date);
                        enq.attr('toDate', null);
                    } else {
                        enq.attr('toDate', date);
                    }
                } else {
                    enq.attr('fromDate', date);
                    enq.attr('toDate', null);
                }
            }

            this.ignoreRedraw = false;
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

        // TODO: Improve the selector, attach the datepicker as an option?
        '{enquiry.avail} change': function() {
            this.element.find('.hasDatepicker').first().datepicker('refresh');
        },
        // TODO: find out how to distinguish between date selection on here and external changes, which we care about
        // like this.ignoreRedraw? in the onSelect callback
        '{enquiry} change': function( model, evt, what ) {
            if( !this.ignoreRedraw && ( what === 'toDate' || what === 'fromDate' || what === 'message' ) ) {
                this.element.find('.hasDatepicker').first().datepicker('refresh');
            }
        }
    });

});