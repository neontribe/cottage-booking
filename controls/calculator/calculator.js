define(['can/util/string', 'ejs!./init', 'jquery', 'can/control', 'jqueryui/jquery.ui.core', 'jqueryui/jquery.ui.datepicker'], function(can, initEjs, $){
    'use strict';

    can.EJS.Helpers.prototype.plugin = function() {
        var args = $.makeArray(arguments),
            widget = args.shift();
        return function( el ) {
            var jq = $(el);
            jq[widget].apply(jq, args);
        };
    };

    return can.Control({
        defaults : {

        }
    },{
        init : function(){
            this.element.append(initEjs({
                engine : 'EJS'
            }));
        }
    });

});