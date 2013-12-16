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
        update  : 'POST tabs_property/A223_ZZ/booking/enquiry',
        create  : 'POST tabs_property/A223_ZZ/booking/enquiry',

        defaults: {
            // The availability object so we can validate stays
            'avail': avail,
            'saveOnValid': false,
            'adults': 4
        },

        // We only need this attributes to make an enquiry
        required: [
            'propRef',
            'fromDate',
            'toDate',
            'nights',
            'adults',
            'children',
            'infants',
            'pets'
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

            this.validatePresenceOf( this.required );
        }

    }, {

        'init': function() {
            if( this.saveOnValid ) {
                var prox = can.proxy( this.datesChangedHandler, this );
                this.on('fromDate', prox);
                this.on('toDate', prox);
            }

            // Tidy
            delete this.saveOnValid;
        },

        'datesChangedHandler': function() {
            var from = this.attr('fromDate'),
                to = this.attr('toDate');

            if( from && to ) {

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
        }

    });

});