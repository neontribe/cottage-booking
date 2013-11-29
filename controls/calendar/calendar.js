define(['can/util/string', 'ejs!./init', 'can/control'], function(can, initEjs){

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

})