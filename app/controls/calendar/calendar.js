define([
    'can',
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
        onSelect: function( el, dateString, datepickerObject ) {
            console.log( el, dateString, datepickerObject );
            var date = moment( $(el).datepicker('getDate' ) );
            if( !this.options.enquiry.attr('fromDate') ) {
                this.options.enquiry.attr('fromDate', date);
            } else {
                this.options.enquiry.attr('toDate', date);
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

            if( availability ) {
                dayData = availability.attr( date );

                if( dayData ) {
                    enableDay = dayData.attr('available');

                    dayClasses.push( 'code-' + dayData.attr('code') );
                    dayClasses.push( dayData.attr('changeover') ? 'changeover' : '' );
                }

            }

            return [enableDay, dayClasses.join(' ')];
            //return [ true, 'someClass', tooltipsss ];
        },

        '{avail} change': function() {
            this.element.find('.hasDatepicker').first().datepicker('refresh');
        }
    });

});