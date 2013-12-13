define([
    'can/util/string',
    'resources/avail',
    'underscore',
    'moment',
    'can/model',
    'can/map/validations'
], function(can, avail, _, moment){
    'use strict';

    return can.Model({
        // update  : 'POST tabs_property/{propRef}/booking/enquiry',
        // create  : 'POST tabs_property/{propRef}/booking/enquiry',
        update  : 'POST tabs_property/A223_ZZ/booking/enquiry',
        create  : 'POST tabs_property/A223_ZZ/booking/enquiry',

        defaults: {
            // The availability object so we can validate stays
            'avail': avail,
            'adults': 4,
            'stayDays': []
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
            'pets',
        ],

        'init': function() {
            this.validate('fromDate', function(/*fromDate*/) {
                return false;
            });

            this.validatePresenceOf( this.required );
        }

    }, {

        'init': function() {
            // There must be a better way to do this
            this.on('fromDate', can.proxy( this.datesChangedHandler, this ));
            this.on('toDate', can.proxy( this.datesChangedHandler, this ));
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

        'datesChangedHandler': function() {
            if( this.attr('fromDate') && this.attr('toDate') ) {
                //debugger;
            }
        },

        // TODO: move this sort of functionality into getClassesFor or something
        'fallsBetween': function( date ) {

            var from = this.attr('fromDate'),
                to = this.attr('toDate');

            if( !to || !from ) {
                return false;
            }

            if( from.isSame( date, 'day' ) || to.isSame( date, 'day' ) ) {
                return true;
            }

            return false && date.isAfter( this.attr('fromDate') );
        }

    });

});