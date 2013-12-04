/**
 * This file extends the availability model
 * @return {can.Model} availability the model
 */
define(['models/availability', 'moment'], function(Availability, moment){
    'use strict';

    Availability.List = Availability.List.extend({
        /**
         * This function finds the Availability model representation of a given date
         * @function find
         */
        find: function( date, format ) {
            var dateObject = moment( date, format || 'DD-MM-YYYY' ),
                found;

            this.each(function( avail ) {
                if( avail.date.diff( dateObject ) === 0 ) {
                    found = avail;
                }
                return !found;
            });

            return found;
        }
    }, {});

    return Availability.List;

});