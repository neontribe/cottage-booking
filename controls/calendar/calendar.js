define(['can', 'ejs!./init', 'models/availability', 'jqueryui/jquery.ui.core', 'jqueryui/jquery.ui.datepicker'], function(can, init, Availability) {
    'use strict';

    return can.Control({
        defaults : {

        }
    },{
        init : function(){
            var avail = new Availability({'somedate': {'somestuff': 'ishere'}});

            this.options.availability = avail;
debugger;
            this.element.html( init({
                datepickerOptions: {
                    'numberOfMonths': 6,
                    'showButtonPanel': true,
                    'onSelect': function() {
                        debugger;
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