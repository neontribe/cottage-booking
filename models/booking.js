define(['can/util/string', 'can/model'], function(can){

  return can.Model({

    findAll : 'GET /bookings',
    findOne : 'GET /bookings/{id}',
    create  : 'POST /bookings',
    update  : 'PUT /bookings/{id}',
    destroy : 'DELETE /bookings/{id}'

  }, {

  });

})