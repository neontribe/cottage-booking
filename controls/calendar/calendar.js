define(['can/util/string', 'ejs!./init', 'can/control'], function(can, initEjs){
    'use strict';

    return can.Control({
        defaults : {

        }
    },{
        init : function(){
            this.element.append(initEjs());
        }
    });

});