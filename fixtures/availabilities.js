define(['can/util/string', 'can/util/fixture'], function(can){
    'use strict';

    var store = can.fixture.store(100, function(i){
        var id = i + 1; // Make ids 1 based instead of 0 based
        return {
            id   : id,
            name : 'Availability ' + id
        };
    });

    can.fixture({
        'GET /availabilities'         : store.findAll,
        'GET /availabilities/{id}'    : store.findOne,
        'POST /availabilities'        : store.create,
        'PUT /availabilities/{id}'    : store.update,
        'DELETE /availabilities/{id}' : store.destroy
    });

    return store;

});