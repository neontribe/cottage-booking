define(['can/util/string', 'resources/avail', 'can/model', 'can/map/validations'], function(can, avail){
    'use strict';

    return can.Model({
        // update  : 'POST tabs_property/{propRef}/booking/enquiry',
        // create  : 'POST tabs_property/{propRef}/booking/enquiry',
        update  : 'POST tabs_property/nope/booking/enquiry',
        create  : 'POST tabs_property/nope/booking/enquiry',

        defaults: {
            // The availability object so we can validate stays
            'avail': avail,
            'partySize': 1
        },

        'init': function() {
            this.validate('fromDate', function(fromDate) {
                return false;
            });

            this.validatePresenceOf('propRef');
        }

    }, {

        // We only need this attributes to make an enquiry
        // attributes: {
        //     'propRef': 'string',
        //     'fromDate': 'string',
        //     'nights': 'string',
        //     'adults': 'string',
        //     'children': 'string',
        //     'infants': 'string',
        //     'pets': 'string',
        // }
        'serialize': function() {
            // only include the attributes above
            var serialized = can.Model.prototype.serialize.call( this );

            if( this.attr('fromDate') ) {
                serialized.fromDate = this.attr('fromDate').format('YYYY-MM-DD');
            }
            if( this.attr('toDate') ) {
                serialized.toDate = this.attr('toDate').format('YYYY-MM-DD');
            }

            return serialized;
        }

    });

});