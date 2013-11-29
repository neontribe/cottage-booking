define(['can/util/string', 'can/util/fixture'], function(can){

  var store = can.fixture.store(100, function(i){
    var id = i + 1; // Make ids 1 based instead of 0 based
    return {
      id   : id,
      name : 'Enquiry ' + id
    }
  });

  can.fixture({
    'GET /enquiries'         : store.findAll,
    'GET /enquiries/{id}'    : store.findOne,
    'POST /enquiries'        : store.create,
    'PUT /enquiries/{id}'    : store.update,
    'DELETE /enquiries/{id}' : store.destroy
  });

  return store;

})