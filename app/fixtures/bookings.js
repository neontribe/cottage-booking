define(['can/util/string', 'can/util/fixture'], function(can){
    'use strict';
    var store = can.fixture.store(100, function(i){
        var id = i + 1; // Make ids 1 based instead of 0 based
        return {
            id   : id,
            name : 'Booking ' + id
        };
    });

    can.fixture({
        'GET /bookings'         : store.findAll,
        'GET /bookings/{id}'    : store.findOne,
        'POST /bookings'        : store.create,
        'PUT /bookings/{id}'    : store.update,
        'DELETE /bookings/{id}' : store.destroy
    });

    return store;

});