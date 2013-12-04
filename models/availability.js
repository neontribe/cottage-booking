define(['can'], function(can){
    'use strict';

    return can.Model({

        findAll : 'GET /availabilities',
        findOne : 'GET /availabilities/{id}',
        create  : 'POST /availabilities',
        update  : 'PUT /availabilities/{id}',
        destroy : 'DELETE /availabilities/{id}'

    }, {

    });

});