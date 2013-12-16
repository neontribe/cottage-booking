define([
    'can/util/string',
    'jquery',
    'moment',
    'ejs!./views/init', // If the views stack because too big see controls/calculator/views.js for a good pattern
    'resources/avail',
    'resources/enquiry',
    'jqueryui/jquery.ui.core',
    'jqueryui/jquery.ui.datepicker'
], function(can, $, moment, init, avail, enquiry) {
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

        defaults: {
            avail: avail,
            enquiry: enquiry
        }
    },{
        init: function(){

            this.element.html( init({
                datepickerOptions: {
                    'numberOfMonths': [2,3],
                    //'showButtonPanel': true,
                    'firstDay': 1,
                    // Use apply to enhance the onSelect callback, providing the dom element
                    // which contains the datepicker as an extra argument to the onSelect function
                    'onSelect': bindWithThis( this.onSelect, this ),
                    'beforeShowDay': bindWithThis( this.beforeShowDay, this )
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
        onSelect: function( el, dateString, datepickerInst ) {
            console.log( el, dateString, datepickerInst );
            var date = moment( $(el).datepicker('getDate' ) ),
                enq = this.options.enquiry,
                fromDate = enq.attr('fromDate'),
                toDate = enq.attr('toDate');

            // TODO: neatify
            if( !fromDate || ( fromDate && toDate ) ) {
                enq.attr('fromDate', date);
                enq.attr('toDate', null);
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
        },

        /**
         * Datepicker beforeShowDay handler
         * @param  {HTMLElement} el     The datepicker
         * @param  {Date} date          The Date in question
         * @return {Array}              Array of data to populate [available, classe(s), tooltips?]
         */
        beforeShowDay: function( el, date ) {
            var availability = this.options.avail(),
                enableDay = false,
                dayData,
                dayClasses = [];

            if( date > new Date() ) {
                if( availability ) {
                    // Availability is still a model, but for speed
                    dayData = availability.attr( date );

                    if( dayData ) {
                        enableDay = dayData.attr('available');

                        if( enableDay && enquiry.fallsBetween( date ) ) {
                            dayClasses.push('selected');
                        }

                        dayClasses.push( 'code-' + dayData.attr('code') );
                        dayClasses.push( dayData.attr('changeover') ? 'changeover' : '' );
                    }


                }
            }
            return [enableDay, dayClasses.join(' '), 'Hey there'];
            //return [ true, 'someClass', tooltipsss ];
        },

        // TODO: Improve the selector, attach the datepicker as an option?
        '{avail} change': function() {
            this.element.find('.hasDatepicker').first().datepicker('refresh');
        },
        // TODO: find out to to distinguish between date selection on here and external changes, which we care about
        '{enquiry} change': function( model, evt, what ) {
            if( what === 'toDate' || what === 'fromDate' ) {
                this.element.find('.hasDatepicker').first().datepicker('refresh');
            }
        }
    });

});