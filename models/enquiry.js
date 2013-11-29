define(['can/util/string', 'can/model'], function(can){
    'use strict';

    return can.Model({

        findAll : 'GET /enquiries',
        findOne : 'GET /enquiries/{id}',
        create  : 'POST /enquiries',
        update  : 'PUT /enquiries/{id}',
        destroy : 'DELETE /enquiries/{id}',

        attributes: {
            'fromDate': 'string',
            'nights': 'string',
            'adults': 'string',
            'children': 'string',
            'infants': 'string',
            'pets': 'string',
        }

    }, {

    });

});