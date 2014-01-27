/**
 * This model represents the availability for a given cottage
 * @return {can.Model} availability the model
 */
define([
    'can/util/string',
    'utils',
    'can/model',
    'can/map/list'
], function( can, utils ){
    'use strict';

    return can.Model({
        findOne: utils.getResource('GET property/country/{code}'),
        findAll: utils.getResource('GET property/country'),

        // Mash the returned into a model
        models: function( raw ) {
            return can.Model.models.call( this, can.map( raw, function( country, code ) {
                return { id: code, name: country };
            }));
        }
    }, {});

});