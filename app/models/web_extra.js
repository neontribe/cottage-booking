/**
 */
define(['can/util/string', 'utils', 'can/model', 'can/compute'], function(can, utils){
    'use strict';

    return can.Model({
        'descriptionWithPrice': can.compute(function() {
            var price = this.attr('price');
            return can.sub('{description} {price}', {
                description: this.attr('description'),
                price: price > 0 ? utils.money( price ) : ''
            });
        })
    });

});