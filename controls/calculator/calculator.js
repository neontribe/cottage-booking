define([
    'can/util/library',
    'ejs!./views/init',
    'jquery',
    'can/control',
    'models/enquiry',
    'jqueryui/jquery.ui.core',
    'jqueryui/jquery.ui.datepicker'
], function( can, init ) {
    'use strict';

    return can.Control({
        defaults: {

        }
    },{
        init : function(){
            this.element.html( init() );
        }
    });

});