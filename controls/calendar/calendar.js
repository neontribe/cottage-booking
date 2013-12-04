define(['can', 'ejs!./init', 'models/availability', 'models/availabilityList', 'jqueryui/jquery.ui.core', 'jqueryui/jquery.ui.datepicker'], function(can, init, Availability) {
    'use strict';

    return can.Control({
        defaults : {

        }
    },{
        init : function(){
            var avail = new Availability({'somedate': {'somestuff': 'ishere'}});

            this.options.availability = avail;

            this.element.html( init({
                datepickerOptions: {
                    'numberOfMonths': 6,
                    'showButtonPanel': true,
                    'firstDay': 1,
                    'onSelect': function() {

                    },
                    'beforeShowDay': function() {
                        return [];
                        //return [ true, 'someClass', tooltipsss ];
                    }
                }
            }));
        }
    });

});