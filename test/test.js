define([
    'require',
    'chai',
    'chai-jquery',
    'can',
    'mocha',
    'jquery',
    // Fixture utility
    'can/util/fixture'
], function(require, chai, chaiJquery, can ){
    'use strict';

    // Chai
    /* globals window, mocha */
    //window.should = chai.should(); This breaks phantomjs
    window.expect = chai.expect;
    window.assert = chai.assert;

    chai.use(chaiJquery);
    mocha.setup('bdd');
    mocha.bail(false);

    can.$.ajaxSetup({
        async: false
    });

    can.fixture.delay = 0;

});
