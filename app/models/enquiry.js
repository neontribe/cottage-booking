define([
    'can/util/string',
    'resources/avail',
    'underscore',
    'can/model',
    'can/map/validations'
], function(can, avail, _){
    'use strict';

    return can.Model({
        // update  : 'POST tabs_property/{propRef}/booking/enquiry',
        // create  : 'POST tabs_property/{propRef}/booking/enquiry',
        update  : 'POST tabs_property/{propRef}/booking/enquiry',
        create  : 'POST tabs_property/{propRef}/booking/enquiry',

        defaults: {
            // The availability object so we can validate stays
            'avail': avail,
            'saveOnValid': true,
            'adults': 4
        },

        // We only need this attributes to make an enquiry
        required: [
            'propRef',
            'fromDate',
            'toDate',
            // 'nights',
            'adults'
            // 'children',
            // 'infants',
            // 'pets'
        ],

        'init': function() {
            this.validate('fromDate', function( fromDate ) {
                if( !this.attr('toDate') ) {
                    return false;
                }

                if( fromDate < new Date() ) {
                    return 'Your stay should be in the future';
                }

                if( fromDate > this.attr('toDate') ) {
                    return 'The start of your stay must be before the end';
                }

                return false;
            });

            this.validate('toDate', function( toDate ) {
                if( !this.attr('fromDate') ) {
                    return false;
                }

                if( toDate < this.attr('fromDate') ) {
                    return 'The end of your stay must be after the start';
                }

                return false;
            });

            this.validate('status', function( status ) {
                if( status && status !== 'ok' ) {
                    return this.attr('message') || 'An unknown error occurred';
                }
            });

            this.validatePresenceOf( this.required );
        }

    }, {

        'init': function() {

            if( this.saveOnValid ) {
                var prox = can.proxy( this.datesChangeHandler, this );
                this.on('fromDate', prox);
                this.on('toDate', prox);
            }

            // Tidy
            delete this.saveOnValid;

            this.on( 'propRef', can.proxy( this.propRefChangeHandler, this ) );
        },

        // If we hear about a new propref re-fetch the availability data
        'propRefChangeHandler': function( obj, newVal ) {
            this.avail( newVal );
            // we _could_ clear stuff etc
        },

        'datesChangeHandler': function() {
            var from = this.attr('fromDate'),
                to = this.attr('toDate');

            if( from && to ) {

                if( !this.errors( this.constructor.required ) ) {
                    this.save();
                }

            }
        },

        'serialize': function() {
            // only include the attributes above
            var serialized = _.pick( can.Model.prototype.serialize.call( this ), this.constructor.required );

            if( this.attr('fromDate') ) {
                serialized.fromDate = this.attr('fromDate').format('YYYY-MM-DD');
            }
            if( this.attr('toDate') ) {
                serialized.toDate = this.attr('toDate').format('YYYY-MM-DD');
            }

            return serialized;
        },

        // TODO: move this sort of functionality into getClassesFor or something
        'fallsBetween': function( date ) {

            var from = this.attr('fromDate'),
                to = this.attr('toDate');

            if( !to || !from ) {
                return false;
            }

            return ( date >= from && date <= to );
        },

        /**
         * This function generates the array required for each day to be represented correctly
         * on a jquery datepicker calendar.
         * TODO: Tooltips contain error data and other nice information
         * TODO: Investigate whether this hard working function should be else where
         * @function generateCalendarRenderArray
         * @param  {Date} date   Date to generate for
         * @return {Array}       array of data to populate [available, classe(s), tooltips?]
         */
        'generateCalendarRenderArray': function( date ) {
            var availability = this.avail(),
                enableDay = false,
                dayData,
                errors = this.errors(),
                dayClasses = [],
                tooltip = '';

            // TODO: Look to change new Date() to like require('utils').today() or something
            // SO we could mox it in tests
            if( date > new Date() ) {
                if( availability ) {
                    dayData = availability.attr( date );

                    if( dayData ) {
                        // Get availability
                        enableDay = dayData.attr('available');

                        if( enableDay && this.fallsBetween( date ) ) {
                            dayClasses.push('selected');

                            // If we have a selection to show, and there's errors
                            if( errors ) {
                                dayClasses.push('errors');

                                // Look to add errors
                                if( errors.status ) {
                                    tooltip = errors.status[0];
                                }
                            }
                        }

                        // Add other misc classes
                        dayClasses.push( 'code-' + dayData.attr('code') );
                        dayClasses.push( dayData.attr('changeover') ? 'changeover' : '' );
                    }
                }
            }
            return [enableDay, dayClasses.join(' '), tooltip];
        }

    });

});